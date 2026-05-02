import Phaser from "phaser";

export interface NpcConfig {
  id: string;
  x: number;
  y: number;
  label: string;
  body: string;
  /** spritesheet 텍스처 키. 기본 "npc-test". */
  texture?: string;
  /** 기본 sprite 위에 곱해질 tint (0xrrggbb). */
  tint?: number;
}

export interface Npc {
  config: NpcConfig;
  sprite: Phaser.GameObjects.Sprite;
  labelText: Phaser.GameObjects.Text;
}

export const NPC_INTERACT_RADIUS = 70;

export function createNpc(scene: Phaser.Scene, config: NpcConfig): Npc {
  const textureKey = config.texture ?? "npc-test";
  const sprite = scene.add.sprite(config.x, config.y, textureKey, 0);
  sprite.setDepth(10);
  if (config.tint !== undefined) sprite.setTint(config.tint);

  const labelText = scene.add
    .text(config.x, config.y - 30, config.label, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#ffffff",
      backgroundColor: "#000000aa",
      padding: { x: 6, y: 3 },
    })
    .setOrigin(0.5)
    .setDepth(10);

  return { config, sprite, labelText };
}
