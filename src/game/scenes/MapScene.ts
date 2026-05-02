import Phaser from "phaser";

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

  constructor() {
    super("MapScene");
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.drawGrid();
    this.drawTitle();

    const rect = this.add.rectangle(WORLD_W / 2, WORLD_H / 2, 28, 32, 0xff5566);
    rect.setStrokeStyle(2, 0xffffff);
    this.physics.add.existing(rect);
    this.player = rect;
    this.body = rect.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys("W,A,S,D") as typeof this.wasd;
    }

    this.drawHud();
  }

  update() {
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
      .text(WORLD_W / 2, 132, "Phase 0 · placeholder world", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#566080",
      })
      .setOrigin(0.5);
  }

  private drawHud() {
    this.add
      .text(16, 16, "← ↑ → ↓  /  WASD 로 이동", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(100);
  }
}
