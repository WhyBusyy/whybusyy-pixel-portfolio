import Phaser from "phaser";

export type NpcKind =
  | "case-study"
  | "side-project"
  | "oss"
  | "about"
  | "placeholder";

export type NpcLinkIcon = "github" | "npm" | "appstore" | "external" | "email";

export interface NpcLink {
  label: string;
  url: string;
  icon?: NpcLinkIcon;
}

export interface NpcMetric {
  value: string;
  label: string;
}

export interface NpcConfig {
  id: string;
  x: number;
  y: number;
  /** 캐릭터 머리 위 라벨. */
  label: string;
  /** 모달 본문 (줄바꿈 포함 가능). */
  body: string;
  /** spritesheet 텍스처 키. 기본 "npc-test". */
  texture?: string;
  /** 기본 sprite 위에 곱해질 tint (0xrrggbb). */
  tint?: number;
  // 콘텐츠 메타데이터 (모달에서 사용)
  kind?: NpcKind;
  /** 모달 상단 작은 라벨 (예: "Frontend Developer · 2025 상반기"). */
  role?: string;
  /** 모달 타이틀 — label과 다를 수 있음. */
  title?: string;
  metrics?: NpcMetric[];
  links?: NpcLink[];
}

export interface Npc {
  config: NpcConfig;
  sprite: Phaser.GameObjects.Sprite;
  labelText: Phaser.GameObjects.Text;
  exclamation: Phaser.GameObjects.Text;
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

  // "!" 인디케이터 (대화 가능 표시)
  const exclamation = scene.add
    .text(config.x, config.y - 52, "!", {
      fontFamily: "monospace",
      fontSize: "20px",
      fontStyle: "bold",
      color: "#ffeb3b",
      stroke: "#1a1a2e",
      strokeThickness: 4,
    })
    .setOrigin(0.5)
    .setDepth(11);

  scene.tweens.add({
    targets: exclamation,
    y: { from: config.y - 52, to: config.y - 60 },
    duration: 700,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  return { config, sprite, labelText, exclamation };
}
