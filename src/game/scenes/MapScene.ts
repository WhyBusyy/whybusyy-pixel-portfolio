import Phaser from "phaser";
import { eventBus, type JoystickVec } from "@/game/EventBus";
import { createNpc, NPC_INTERACT_RADIUS, type Npc } from "@/game/objects/Npc";
import { buildMap } from "@/game/world/Map";
import { buildNpcs } from "@/game/data/npcs";

const WORLD_W = 2048;
const WORLD_H = 2048;
const PLAYER_SPEED = 220;

type Direction = "down" | "up" | "left" | "right";

export class MapScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private body!: Phaser.Physics.Arcade.Body;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private npcs: Npc[] = [];
  private activeNpc: Npc | null = null;
  private hint!: Phaser.GameObjects.Text;
  private facing: Direction = "down";
  private joystick: JoystickVec = { x: 0, y: 0 };

  constructor() {
    super("MapScene");
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    const { collisionGroup } = buildMap(this, WORLD_W, WORLD_H);

    this.registerAnimations("player");
    this.registerAnimations("npc-test");

    this.spawnPlayer();
    this.spawnNpcs();

    this.physics.add.collider(this.player, collisionGroup);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      }) as typeof this.wasd;
      this.input.keyboard.on("keydown-SPACE", this.onSpacePressed, this);
    }

    this.drawHud();
    this.drawHint();

    const onModalClose = this.onModalClose.bind(this);
    const onJoystick = (v: JoystickVec) => {
      this.joystick = v;
    };
    const onAction = this.onSpacePressed.bind(this);

    eventBus.on("npc:close", onModalClose);
    eventBus.on("input:joystick", onJoystick);
    eventBus.on("input:action", onAction);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventBus.off("npc:close", onModalClose);
      eventBus.off("input:joystick", onJoystick);
      eventBus.off("input:action", onAction);
    });
  }

  update() {
    this.updatePlayerVelocity();
    this.updatePlayerAnimation();
    this.updateActiveNpc();
    // Y-sort: 캐릭터 발 위치를 depth로 사용 → 건물·나무와 자연스럽게 occlusion
    if (this.player) this.player.setDepth(this.player.y + 16);
  }

  private registerAnimations(textureKey: string) {
    const directions: Direction[] = ["down", "up", "left", "right"];
    directions.forEach((dir, i) => {
      const key = `${textureKey}-${dir}`;
      if (this.anims.exists(key)) return;
      const start = i * 2;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(textureKey, {
          start,
          end: start + 1,
        }),
        frameRate: 6,
        repeat: -1,
      });
    });
  }

  private spawnPlayer() {
    // 시작 위치: 사거리 중앙 살짝 위 (수평 도로 위쪽 사이드워크)
    const sprite = this.physics.add.sprite(
      WORLD_W / 2,
      WORLD_H / 2 - 220,
      "player",
      0,
    );
    sprite.setDepth(20);
    this.player = sprite;
    this.body = sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
    // hitbox는 발 부위로 (32x32 sprite의 하단 12px 정도)
    this.body.setSize(20, 12);
    this.body.setOffset(6, 18);
  }

  private spawnNpcs() {
    const configs = buildNpcs(WORLD_W, WORLD_H);
    this.npcs = configs.map((c) => createNpc(this, c));
    for (const npc of this.npcs) {
      npc.sprite.setFrame(0);
    }
  }

  private updatePlayerVelocity() {
    if (!this.body) return;
    this.body.setVelocity(0);

    const left = !!(this.cursors?.left?.isDown || this.wasd?.left?.isDown);
    const right = !!(this.cursors?.right?.isDown || this.wasd?.right?.isDown);
    const up = !!(this.cursors?.up?.isDown || this.wasd?.up?.isDown);
    const down = !!(this.cursors?.down?.isDown || this.wasd?.down?.isDown);

    const keyboardActive = left || right || up || down;

    if (keyboardActive) {
      if (left) this.body.setVelocityX(-PLAYER_SPEED);
      else if (right) this.body.setVelocityX(PLAYER_SPEED);

      if (up) this.body.setVelocityY(-PLAYER_SPEED);
      else if (down) this.body.setVelocityY(PLAYER_SPEED);

      // 대각선 속도 정규화
      if ((left || right) && (up || down)) {
        this.body.velocity.normalize().scale(PLAYER_SPEED);
      }
    } else if (this.joystick.x !== 0 || this.joystick.y !== 0) {
      // 가상 조이스틱
      this.body.setVelocityX(this.joystick.x * PLAYER_SPEED);
      this.body.setVelocityY(this.joystick.y * PLAYER_SPEED);
    }
  }

  private updatePlayerAnimation() {
    const vx = this.body.velocity.x;
    const vy = this.body.velocity.y;
    const moving = Math.abs(vx) > 1 || Math.abs(vy) > 1;

    if (!moving) {
      this.player.anims.stop();
      const idleFrame = { down: 0, up: 2, left: 4, right: 6 }[this.facing];
      this.player.setFrame(idleFrame);
      return;
    }

    let next: Direction;
    if (Math.abs(vx) > Math.abs(vy)) {
      next = vx > 0 ? "right" : "left";
    } else {
      next = vy > 0 ? "down" : "up";
    }

    this.facing = next;
    const animKey = `player-${next}`;
    if (this.player.anims.currentAnim?.key !== animKey) {
      this.player.play(animKey);
    }
  }

  private updateActiveNpc() {
    let nearest: Npc | null = null;
    let nearestDist = Infinity;

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.sprite.x,
        npc.sprite.y,
      );
      if (dist < NPC_INTERACT_RADIUS && dist < nearestDist) {
        nearest = npc;
        nearestDist = dist;
      }
    }

    this.activeNpc = nearest;

    if (nearest) {
      this.hint
        .setVisible(true)
        .setText(`SPACE — ${nearest.config.label}`)
        .setPosition(nearest.sprite.x, nearest.sprite.y - 56);
    } else {
      this.hint.setVisible(false);
    }
  }

  private onSpacePressed() {
    if (!this.activeNpc) return;
    eventBus.emit("npc:open", this.activeNpc.config);
    this.scene.pause();
  }

  private onModalClose() {
    this.scene.resume();
  }

  private drawHud() {
    this.add
      .text(16, 16, "WhyBusyy · Pixel Portfolio", {
        fontFamily: "monospace",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#88ddff",
        backgroundColor: "#000000cc",
        padding: { x: 12, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(16, 50, "← ↑ → ↓ / WASD 이동  ·  SPACE 상호작용  ·  ESC 닫기", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#cccccc",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(16, 78, "NPC 6명과 대화해 임팩트·사이드 프로젝트·자기소개를 확인하세요.", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#888899",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(100);
  }

  private drawHint() {
    this.hint = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#1a1a2e",
        backgroundColor: "#88ddff",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(50)
      .setVisible(false);
  }
}
