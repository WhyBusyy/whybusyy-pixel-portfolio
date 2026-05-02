import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Phase 0 — placeholder만 사용. 실제 자산은 다음 Phase에 추가.
  }

  create() {
    this.scene.start("MapScene");
  }
}
