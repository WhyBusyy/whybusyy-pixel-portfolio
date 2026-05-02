# whybusyy-pixel-portfolio

> 픽셀 아트 게임형 포트폴리오 — [peteroravec.com](https://peteroravec.com) 영감, 한국 색채(약국·카페) 컨셉.

## 컨셉

캐릭터를 조종해 약국·카페가 있는 거리를 돌아다니며 NPC 6명과 상호작용해 경력 임팩트·사이드 프로젝트·자기소개를 발견하는 2D RPG 형식의 포트폴리오.

기존 미니멀 포트폴리오([portfolio-beta-olive-83.vercel.app](https://portfolio-beta-olive-83.vercel.app))와 **병행 운영**합니다.

## Stack

- **Next.js 16** (App Router · Turbopack)
- **React 19** · **TypeScript**
- **Phaser 4** — 2D 게임 엔진
- **Tailwind v4** — DOM UI 오버레이

## 컨트롤

| 입력 | 동작 |
| :--- | :--- |
| `← ↑ → ↓` / `WASD` | 캐릭터 이동 |
| `SPACE` | NPC 상호작용 |
| `ESC` | 모달 닫기 |
| 가상 조이스틱 (모바일) | 캐릭터 이동 |
| `ACTION` 버튼 (모바일) | NPC 상호작용 |

## 진행 현황

- [x] **Phase 0** — Next 16 + Phaser 4 보일러 셋업, 화살표/WASD 이동, 카메라 follow
- [x] **Phase 1** — NPC trigger → React 모달 (EventBus 통신, scene pause/resume)
- [x] **Phase 2** — 동적 spritesheet 생성 (4방향 × idle/walk = 8프레임), velocity 기반 anim 전환
- [x] **Phase 3** — Procedural 약국·카페 거리 + 도로/사이드워크/가로수, 충돌
- [x] **Phase 4** — 콘텐츠 NPC 6명 + 풍부한 모달 (kind 배지 / metrics 그리드 / 외부 링크)
- [x] **Phase 5** — 모바일 가상 조이스틱 + ACTION 버튼
- [x] **Phase 6** — 로딩 오버레이 + favicon (픽셀 캐릭터 SVG)
- [ ] **Phase 7+** — Aseprite 픽셀 아트 자산 / Tiled 맵 / 사운드 / 더 많은 NPC

## 콘텐츠 NPC

| 위치 | NPC | 콘텐츠 |
| :--- | :--- | :--- |
| 행복 약국 | 약사 · 성능 마법사 | 프론트엔드 성능 최적화 (Lighthouse 13→78) |
| 건강 약국 | 약사 · 풀스택 약사 | 자체 CMS 풀스택 단독 (1개월, 80%↓) |
| Cafe ROSE | 바리스타 · 패키지 다이어터 | 에디터 마이그레이션 + tiptap-editor-kit npm |
| Cafe DOTORI | 사장님 · 자기소개 | About + Portfolio/GitHub/Email |
| 거리 | 산책자 · 루틴 메이커 | 루틴 체크 (App Store iOS) |
| 거리 | 행인 · 오픈소스 | facebook/lexical PR + tiptap-editor-kit |

## 개발

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

## 배포

Vercel 자동 배포: GitHub 연결 후 `main` 브랜치 push마다 배포.

## 디렉토리

```
src/
├── app/
│   ├── layout.tsx           # 메타데이터 + viewport
│   ├── page.tsx             # PhaserGame + NpcModal + VirtualJoystick
│   ├── icon.svg             # 픽셀 캐릭터 favicon
│   └── globals.css
├── components/
│   ├── NpcModal.tsx         # DOM 모달 (kind 배지 / metrics / 외부 링크)
│   └── VirtualJoystick.tsx  # 모바일 가상 조이스틱 + ACTION 버튼
└── game/
    ├── PhaserGame.tsx       # 'use client' · Phaser 동적 로드 + 로딩 오버레이
    ├── EventBus.ts          # Phaser ↔ React 통신 채널
    ├── textures.ts          # 동적 spritesheet 생성 (Canvas API)
    ├── data/npcs.ts         # NPC 콘텐츠 데이터
    ├── objects/Npc.ts       # NPC 생성 헬퍼
    ├── world/Map.ts         # Procedural 환경 (도로 / 건물 / 가로수 / 충돌)
    └── scenes/
        ├── BootScene.ts     # spritesheet preload
        └── MapScene.ts      # 메인 월드 + NPC 상호작용
```

## License

MIT
