import Phaser from "phaser";
import { eventBus } from "@/game/EventBus";
import { createNpc, NPC_INTERACT_RADIUS, type Npc } from "@/game/objects/Npc";

const WORLD_W = 2048;
const WORLD_H = 2048;
const PLAYER_SPEED = 220;

export class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
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

  constructor() {
    super("MapScene");
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.drawGrid();
    this.drawTitle();

    this.spawnPlayer();
    this.spawnNpcs();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys("W,A,S,D") as typeof this.wasd;
      this.input.keyboard.on("keydown-SPACE", this.onSpacePressed, this);
    }

    this.drawHud();
    this.drawHint();

    const onModalClose = this.onModalClose.bind(this);
    eventBus.on("npc:close", onModalClose);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventBus.off("npc:close", onModalClose);
    });
  }

  update() {
    this.updatePlayerVelocity();
    this.updateActiveNpc();
  }

  private spawnPlayer() {
    const rect = this.add.rectangle(WORLD_W / 2, WORLD_H / 2, 28, 32, 0xff5566);
    rect.setStrokeStyle(2, 0xffffff);
    rect.setDepth(20);
    this.physics.add.existing(rect);
    this.player = rect;
    this.body = rect.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);
  }

  private spawnNpcs() {
    this.npcs = [
      createNpc(this, {
        id: "test-npc",
        x: WORLD_W / 2 + 200,
        y: WORLD_H / 2,
        label: "Test NPC",
        body: "이것은 Phase 1 placeholder NPC입니다. 다음 Phase에서 실제 콘텐츠 NPC들로 교체됩니다.",
        color: 0x55aaff,
      }),
    ];
  }

  private updatePlayerVelocity() {
    if (!this.body) return;
    this.body.setVelocity(0);

    const left = !!(this.cursors?.left?.isDown || this.wasd?.left?.isDown);
    const right = !!(this.cursors?.right?.isDown || this.wasd?.right?.isDown);
    const up = !!(this.cursors?.up?.isDown || this.wasd?.up?.isDown);
    const down = !!(this.cursors?.down?.isDown || this.wasd?.down?.isDown);

    if (left) this.body.setVelocityX(-PLAYER_SPEED);
    else if (right) this.body.setVelocityX(PLAYER_SPEED);

    if (up) this.body.setVelocityY(-PLAYER_SPEED);
    else if (down) this.body.setVelocityY(PLAYER_SPEED);
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

  private drawGrid() {
    const g = this.add.graphics({ lineStyle: { width: 1, color: 0x1f1f33 } });
    for (let x = 0; x <= WORLD_W; x += 64) g.lineBetween(x, 0, x, WORLD_H);
    for (let y = 0; y <= WORLD_H; y += 64) g.lineBetween(0, y, WORLD_W, y);
  }

  private drawTitle() {
    this.add
      .text(WORLD_W / 2, 96, "약국·카페 거리", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#88aaff",
      })
      .setOrigin(0.5);

    this.add
      .text(WORLD_W / 2, 132, "Phase 1 · NPC 상호작용", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#566080",
      })
      .setOrigin(0.5);
  }

  private drawHud() {
    this.add
      .text(16, 16, "← ↑ → ↓ / WASD 이동  ·  SPACE 상호작용", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 6 },
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
