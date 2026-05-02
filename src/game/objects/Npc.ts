import Phaser from "phaser";

export interface NpcConfig {
  id: string;
  x: number;
  y: number;
  label: string;
  body: string;
  color?: number;
}

export interface Npc {
  config: NpcConfig;
  sprite: Phaser.GameObjects.Rectangle;
  labelText: Phaser.GameObjects.Text;
}

export const NPC_INTERACT_RADIUS = 70;

export function createNpc(scene: Phaser.Scene, config: NpcConfig): Npc {
  const color = config.color ?? 0x55aaff;

  const sprite = scene.add.rectangle(config.x, config.y, 28, 32, color);
  sprite.setStrokeStyle(2, 0xffffff);
  sprite.setDepth(10);

  const labelText = scene.add
    .text(config.x, config.y - 28, config.label, {
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
