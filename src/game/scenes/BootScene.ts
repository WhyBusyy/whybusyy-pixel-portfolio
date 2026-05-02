import Phaser from "phaser";
import { generateCharacterSheet } from "@/game/textures";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // 동적으로 생성된 placeholder spritesheet 등록.
    // 추후 실제 픽셀 아트 자산이 준비되면 이 부분을 정적 PNG로 교체.
    this.load.spritesheet(
      "player",
      generateCharacterSheet({
        shirt: "#ff5566",
        pants: "#332244",
        hair: "#1a1a1a",
        skin: "#f8d3a3",
      }),
      { frameWidth: 32, frameHeight: 32 },
    );

    this.load.spritesheet(
      "npc-test",
      generateCharacterSheet({
        shirt: "#55aaff",
        pants: "#22334a",
        hair: "#5b3a1a",
        skin: "#f8d3a3",
      }),
      { frameWidth: 32, frameHeight: 32 },
    );
  }

  create() {
    this.scene.start("MapScene");
  }
}
