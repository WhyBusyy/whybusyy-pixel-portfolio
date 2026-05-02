import Phaser from "phaser";

export interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "pharmacy" | "cafe";
  name: string;
  /** NPC 등 게임 오브젝트가 서있을 위치 (정문 앞). */
  doorX: number;
  doorY: number;
}

export interface BuildMapResult {
  collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  buildings: Building[];
}

const ROAD_WIDTH = 160;
const SIDEWALK_WIDTH = 32;

export function getBuildings(worldW: number, worldH: number): Building[] {
  const cx = worldW / 2;
  const cy = worldH / 2;
  const bw = 280;
  const bh = 200;
  const offsetFromRoadX = ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 80;
  const offsetFromRoadY = ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 80;

  return [
    {
      x: cx - offsetFromRoadX - bw,
      y: cy - offsetFromRoadY - bh,
      width: bw,
      height: bh,
      type: "pharmacy",
      name: "행복 약국",
      doorX: cx - offsetFromRoadX - bw / 2,
      doorY: cy - offsetFromRoadY + 32,
    },
    {
      x: cx + offsetFromRoadX,
      y: cy - offsetFromRoadY - bh,
      width: bw,
      height: bh,
      type: "pharmacy",
      name: "건강 약국",
      doorX: cx + offsetFromRoadX + bw / 2,
      doorY: cy - offsetFromRoadY + 32,
    },
    {
      x: cx - offsetFromRoadX - bw,
      y: cy + offsetFromRoadY,
      width: bw,
      height: bh,
      type: "cafe",
      name: "Cafe ROSE",
      doorX: cx - offsetFromRoadX - bw / 2,
      doorY: cy + offsetFromRoadY + bh + 16,
    },
    {
      x: cx + offsetFromRoadX,
      y: cy + offsetFromRoadY,
      width: bw,
      height: bh,
      type: "cafe",
      name: "Cafe DOTORI",
      doorX: cx + offsetFromRoadX + bw / 2,
      doorY: cy + offsetFromRoadY + bh + 16,
    },
  ];
}

export function buildMap(
  scene: Phaser.Scene,
  worldW: number,
  worldH: number,
): BuildMapResult {
  const cx = worldW / 2;
  const cy = worldH / 2;

  const ground = scene.add.graphics();
  ground.setDepth(0);

  // 1. 잔디 배경
  ground.fillStyle(0x1f2e1a);
  ground.fillRect(0, 0, worldW, worldH);

  // 잔디 노이즈 (점)
  ground.fillStyle(0x2a3f24);
  for (let i = 0; i < 600; i++) {
    const px = Math.floor(Math.random() * worldW);
    const py = Math.floor(Math.random() * worldH);
    ground.fillRect(px, py, 2, 2);
  }

  // 2. 사이드워크 (도로 양옆)
  ground.fillStyle(0x787890);
  // 수직 도로 사이드워크
  ground.fillRect(
    cx - ROAD_WIDTH / 2 - SIDEWALK_WIDTH,
    0,
    SIDEWALK_WIDTH,
    worldH,
  );
  ground.fillRect(cx + ROAD_WIDTH / 2, 0, SIDEWALK_WIDTH, worldH);
  // 수평 도로 사이드워크
  ground.fillRect(
    0,
    cy - ROAD_WIDTH / 2 - SIDEWALK_WIDTH,
    worldW,
    SIDEWALK_WIDTH,
  );
  ground.fillRect(0, cy + ROAD_WIDTH / 2, worldW, SIDEWALK_WIDTH);

  // 3. 도로 (asphalt)
  ground.fillStyle(0x2c2c38);
  ground.fillRect(cx - ROAD_WIDTH / 2, 0, ROAD_WIDTH, worldH);
  ground.fillRect(0, cy - ROAD_WIDTH / 2, worldW, ROAD_WIDTH);

  // 4. 차선 (점선 노란색)
  ground.fillStyle(0xf6c542);
  for (let y = 0; y < worldH; y += 80) {
    if (Math.abs(y + 20 - cy) < ROAD_WIDTH / 2) continue;
    ground.fillRect(cx - 3, y, 6, 30);
  }
  for (let x = 0; x < worldW; x += 80) {
    if (Math.abs(x + 20 - cx) < ROAD_WIDTH / 2) continue;
    ground.fillRect(x, cy - 3, 30, 6);
  }

  // 5. 건물 그리기 + 충돌
  const collisionGroup = scene.physics.add.staticGroup();
  const buildings = getBuildings(worldW, worldH);

  for (const b of buildings) {
    drawBuilding(scene, b);

    const collider = scene.add.rectangle(
      b.x + b.width / 2,
      b.y + b.height / 2,
      b.width,
      b.height,
    );
    collider.setVisible(false);
    scene.physics.add.existing(collider, true);
    collisionGroup.add(collider);

    // 건물 이름 라벨 — 건물 머리 위에 떠있고 항상 위 (Y-sort 무시)
    scene.add
      .text(b.x + b.width / 2, b.y - 18, b.name, {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(99999);
  }

  // 6. 가로수
  drawTrees(scene, collisionGroup, worldW, worldH);

  // 7. 월드 경계 (검은 보더)
  const border = scene.add.graphics();
  border.lineStyle(8, 0x000000);
  border.strokeRect(0, 0, worldW, worldH);

  return { collisionGroup, buildings };
}

function drawBuilding(scene: Phaser.Scene, b: Building) {
  const g = scene.add.graphics();
  // Y-sort: 건물 하단(b.y + b.height)을 depth로 — 캐릭터 발 위치(player.y)와 비교됨
  g.setDepth(b.y + b.height);

  if (b.type === "pharmacy") {
    // 흰 외벽
    g.fillStyle(0xeaeaea);
    g.fillRect(b.x, b.y, b.width, b.height);
    g.fillStyle(0xc0c0c0);
    g.fillRect(b.x, b.y + b.height - 16, b.width, 16); // 그림자

    // 지붕 라인
    g.fillStyle(0x556070);
    g.fillRect(b.x - 4, b.y - 8, b.width + 8, 12);

    // 초록 십자가 (약국 심볼)
    const symW = 56;
    const cxs = b.x + b.width / 2;
    const cys = b.y + 60;
    g.fillStyle(0x22aa44);
    g.fillRect(cxs - symW / 2, cys - 8, symW, 16);
    g.fillRect(cxs - 8, cys - symW / 2, 16, symW);

    // 출입구 (어두운 사각형, 아래쪽)
    g.fillStyle(0x2a2a3a);
    g.fillRect(b.x + b.width / 2 - 24, b.y + b.height - 60, 48, 60);

    // 창문 양옆
    g.fillStyle(0x77bbdd);
    g.fillRect(b.x + 24, b.y + b.height - 80, 40, 32);
    g.fillRect(b.x + b.width - 64, b.y + b.height - 80, 40, 32);
  } else {
    // 카페: 갈색 외벽
    g.fillStyle(0x6b4423);
    g.fillRect(b.x, b.y, b.width, b.height);
    // 어두운 그림자
    g.fillStyle(0x4a2f17);
    g.fillRect(b.x, b.y + b.height - 16, b.width, 16);

    // 지붕
    g.fillStyle(0x3a2616);
    g.fillRect(b.x - 4, b.y - 8, b.width + 8, 12);

    // 간판 (베이지)
    g.fillStyle(0xd4a574);
    g.fillRect(b.x + 20, b.y + 22, b.width - 40, 32);
    g.lineStyle(2, 0x3a2616);
    g.strokeRect(b.x + 20, b.y + 22, b.width - 40, 32);

    // 출입구
    g.fillStyle(0x2a1a0a);
    g.fillRect(b.x + b.width / 2 - 22, b.y + b.height - 56, 44, 56);

    // 창문 (따뜻한 노란빛)
    g.fillStyle(0xffd06b);
    g.fillRect(b.x + 24, b.y + b.height - 80, 40, 32);
    g.fillRect(b.x + b.width - 64, b.y + b.height - 80, 40, 32);

    // 카페 라벨 (한글) — 간판 위에 그려짐, 건물과 같이 sort
    scene.add
      .text(b.x + b.width / 2, b.y + 38, "CAFE", {
        fontFamily: "monospace",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#3a2616",
      })
      .setOrigin(0.5)
      .setDepth(b.y + b.height);
  }
}

function drawTrees(
  scene: Phaser.Scene,
  collisionGroup: Phaser.Physics.Arcade.StaticGroup,
  worldW: number,
  worldH: number,
) {
  const cx = worldW / 2;
  const cy = worldH / 2;

  const positions: { x: number; y: number }[] = [];
  // 도로 양 끝 (수직 도로)
  for (let y = 80; y < worldH; y += 240) {
    if (Math.abs(y - cy) < ROAD_WIDTH) continue;
    positions.push({ x: cx - ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 20, y });
    positions.push({ x: cx + ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 20, y });
  }
  // 수평 도로
  for (let x = 80; x < worldW; x += 240) {
    if (Math.abs(x - cx) < ROAD_WIDTH) continue;
    positions.push({ x, y: cy - ROAD_WIDTH / 2 - SIDEWALK_WIDTH - 20 });
    positions.push({ x, y: cy + ROAD_WIDTH / 2 + SIDEWALK_WIDTH + 20 });
  }

  for (const p of positions) {
    // 나무마다 별도 graphics — Y-sort 적용
    const g = scene.add.graphics();
    g.setDepth(p.y + 8); // 줄기 하단(p.y + 8)을 발 위치로

    g.fillStyle(0x4a2a1a);
    g.fillRect(p.x - 3, p.y - 4, 6, 14);
    g.fillStyle(0x2a6a2a);
    g.fillCircle(p.x, p.y - 12, 14);
    g.fillStyle(0x3d8a3d);
    g.fillCircle(p.x - 6, p.y - 14, 8);
    g.fillCircle(p.x + 6, p.y - 14, 8);

    // 충돌 — 줄기 부분만
    const collider = scene.add.rectangle(p.x, p.y + 2, 14, 12);
    collider.setVisible(false);
    scene.physics.add.existing(collider, true);
    collisionGroup.add(collider);
  }
}
