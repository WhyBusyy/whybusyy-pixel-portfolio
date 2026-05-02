# whybusyy-pixel-portfolio

> 픽셀 아트 게임형 포트폴리오 — [peteroravec.com](https://peteroravec.com) 영감, 한국 색채(약국·카페) 컨셉.

## 컨셉

캐릭터를 조종해 약국·카페가 있는 거리를 돌아다니며 NPC와 상호작용해 경력·임팩트·사이드 프로젝트를 발견하는 2D RPG 형식의 포트폴리오.

기존 미니멀 포트폴리오([portfolio-beta-olive-83.vercel.app](https://portfolio-beta-olive-83.vercel.app))와 **병행 운영**합니다.

## Stack

- **Next.js 16** (App Router · Turbopack)
- **React 19** · **TypeScript**
- **Phaser 4** — 2D 게임 엔진
- **Tailwind v4** — DOM UI 오버레이
- **Tiled** (예정) — 타일맵 디자인
- **Aseprite** (예정) — 픽셀 아트 자산 제작

## Phase 0 — Setup ✅

- Next.js + Phaser 보일러 통합
- 빨간 사각형 placeholder 캐릭터
- 화살표키 / WASD 이동 + 카메라 follow
- 2048 × 2048 빈 월드 (그리드 시각화)

## 다음 단계

- Phase 1: NPC trigger → React 모달 (EventBus)
- Phase 2: 메인 캐릭터 walk cycle (Aseprite)
- Phase 3: 약국·카페 타일셋 + Tiled 맵
- Phase 4: 콘텐츠 NPC (임팩트 3개 + 사이드 5개 + About + Contact)
- Phase 5: 모바일 가상 조이스틱
- Phase 6: 폴리싱 + Vercel 배포

## 개발

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

## 디렉토리

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx          # PhaserGame 마운트
│   └── globals.css
└── game/
    ├── PhaserGame.tsx    # 'use client' · Phaser 동적 로드
    └── scenes/
        ├── BootScene.ts  # 자산 preload
        └── MapScene.ts   # 메인 월드
```
