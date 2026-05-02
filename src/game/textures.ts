// 동적 캐릭터 spritesheet 생성기.
// 외부 자산 의존성 없이 Phase 0~2 동작 검증용 placeholder를 그린다.
// 실제 픽셀 아트 자산이 준비되면 BootScene의 load.spritesheet URL만 교체하면 됨.

export type Direction = "down" | "up" | "left" | "right";

export interface CharacterPalette {
  shirt: string;
  pants: string;
  hair: string;
  skin: string;
}

const FRAME = 32;
const DIRECTIONS: Direction[] = ["down", "up", "left", "right"];

function drawCharacterFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  direction: Direction,
  walking: boolean,
  p: CharacterPalette,
) {
  const wb = walking ? 1 : 0;

  // 다리 (교차 보행)
  ctx.fillStyle = p.pants;
  ctx.fillRect(ox + 11, 22, 4, 8 - wb);
  ctx.fillRect(ox + 17, 22, 4, 8 + wb);

  // 신발
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(ox + 11, 30 - wb, 4, 2);
  ctx.fillRect(ox + 17, 30 + wb, 4, 2);

  // 몸통 (셔츠)
  ctx.fillStyle = p.shirt;
  ctx.fillRect(ox + 9, 13, 14, 10);

  // 팔
  ctx.fillStyle = p.shirt;
  ctx.fillRect(ox + 6, 14, 3, 7);
  ctx.fillRect(ox + 23, 14, 3, 7);

  // 손
  ctx.fillStyle = p.skin;
  ctx.fillRect(ox + 6, 21, 3, 2);
  ctx.fillRect(ox + 23, 21, 3, 2);

  // 머리
  ctx.fillStyle = p.skin;
  ctx.fillRect(ox + 10, 4, 12, 10);

  // 헤어
  ctx.fillStyle = p.hair;
  if (direction === "up") {
    // 뒷머리 — 머리 영역 거의 다 덮음
    ctx.fillRect(ox + 10, 4, 12, 8);
  } else {
    ctx.fillRect(ox + 10, 3, 12, 4);
    if (direction === "left") ctx.fillRect(ox + 9, 5, 2, 3);
    if (direction === "right") ctx.fillRect(ox + 21, 5, 2, 3);
  }

  // 눈
  ctx.fillStyle = "#000";
  if (direction === "down") {
    ctx.fillRect(ox + 13, 10, 2, 2);
    ctx.fillRect(ox + 17, 10, 2, 2);
  } else if (direction === "left") {
    ctx.fillRect(ox + 12, 10, 2, 2);
  } else if (direction === "right") {
    ctx.fillRect(ox + 18, 10, 2, 2);
  }
  // up 은 뒷모습이라 눈 안 그림
}

/**
 * 4 directions × 2 frames = 8 columns. 각 frame은 32×32.
 * Frame index 매핑:
 *   0 down-idle   1 down-walk
 *   2 up-idle     3 up-walk
 *   4 left-idle   5 left-walk
 *   6 right-idle  7 right-walk
 */
export function generateCharacterSheet(palette: CharacterPalette): string {
  const canvas = document.createElement("canvas");
  canvas.width = FRAME * 8;
  canvas.height = FRAME;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  ctx.imageSmoothingEnabled = false;

  let idx = 0;
  for (const dir of DIRECTIONS) {
    drawCharacterFrame(ctx, idx * FRAME, dir, false, palette);
    idx++;
    drawCharacterFrame(ctx, idx * FRAME, dir, true, palette);
    idx++;
  }

  return canvas.toDataURL("image/png");
}

export const FRAME_INDEX = {
  downIdle: 0,
  downWalk: 1,
  upIdle: 2,
  upWalk: 3,
  leftIdle: 4,
  leftWalk: 5,
  rightIdle: 6,
  rightWalk: 7,
} as const;
