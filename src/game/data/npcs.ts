import type { NpcConfig } from "@/game/objects/Npc";
import { getBuildings } from "@/game/world/Map";

const APPSTORE_URL =
  "https://apps.apple.com/kr/app/%EB%A3%A8%ED%8B%B4-%EC%B2%B4%ED%81%AC-%EB%A7%A4%EC%9D%BC-%EC%8A%B5%EA%B4%80-%ED%8A%B8%EB%9E%98%EC%BB%A4/id6762101450";

/** 모든 NPC 데이터를 빌드합니다. 건물 위치는 Map.ts의 getBuildings에서 가져옴. */
export function buildNpcs(worldW: number, worldH: number): NpcConfig[] {
  const [pharmacyA, pharmacyB, cafeA, cafeB] = getBuildings(worldW, worldH);
  const cx = worldW / 2;
  const cy = worldH / 2;

  return [
    // 1. 행복 약국 — 프론트엔드 성능 최적화
    {
      id: "case-performance",
      x: pharmacyA.doorX,
      y: pharmacyA.doorY,
      label: "약사 · 성능 마법사",
      tint: 0xff8888,
      kind: "case-study",
      title: "프론트엔드 성능 최적화",
      role: "Frontend Developer (단독) · 2025 상반기 · 루멘테라",
      body: "B2B SaaS 플랫팜의 사용자 경험이 초기 로딩 속도와 인터랙션 지연으로 망가지고 있었습니다. 렌더링 파이프라인 전반을 단독으로 점검 — 라우트 기반 코드 스플리팅, dynamic import, React.memo/useMemo 전략, Next.js Image + WebP + lazy loading 까지 적용해 측정 가능한 성과를 만들었습니다.",
      metrics: [
        { value: "13 → 78", label: "Lighthouse Performance" },
        { value: "60%↓", label: "초기 번들 사이즈" },
        { value: "단독", label: "전 과정 수행" },
      ],
    },
    // 2. 건강 약국 — 자체 CMS 풀스택 단독
    {
      id: "case-cms",
      x: pharmacyB.doorX,
      y: pharmacyB.doorY,
      label: "약사 · 풀스택 약사",
      tint: 0xaaffaa,
      kind: "case-study",
      title: "자체 CMS 풀스택 단독 개발",
      role: "Fullstack Developer (단독) · 2025 하반기 ~ 2026 상반기",
      body: "콘텐츠 수정마다 개발자가 코드를 직접 고치고 배포해야 하는 병목이 있었습니다. 운영팀이 직접 콘텐츠를 관리할 수 있는 CMS를 프론트엔드부터 백엔드, 파일 업로드, 권한까지 단독 설계·구현. NestJS RESTful API, WYSIWYG + 드래그앤드롭, AWS S3 연동 + 이미지 최적화 파이프라인.",
      metrics: [
        { value: "100%", label: "풀스택 단독" },
        { value: "80%↓", label: "콘텐츠 개발 요청" },
        { value: "1개월", label: "설계~배포" },
      ],
    },
    // 3. Cafe ROSE — 에디터 마이그레이션 + tiptap-editor-kit npm
    {
      id: "case-editor",
      x: cafeA.doorX,
      y: cafeA.doorY,
      label: "바리스타 · 패키지 다이어터",
      tint: 0xffd06b,
      kind: "case-study",
      title: "WYSIWYG 에디터 마이그레이션",
      role: "Frontend Developer · 2026년 3월",
      body: "CKEditor 기반 에디터가 운영 빌드를 무겁게 만들고 있었습니다. Tiptap(ProseMirror)으로 전환하면서 커스텀 툴바를 직접 구현하고, React + Vanilla JS 듀얼 entry point를 가진 npm 패키지(tiptap-editor-kit)로 추출해 오픈소스 배포까지 완료했습니다.",
      metrics: [
        { value: "99.8%↓", label: "패키지 (2.5GB → 3MB)" },
        { value: "50%↓", label: "배포 시간 (12 → 6분)" },
        { value: "npm", label: "오픈소스 배포" },
      ],
      links: [
        {
          label: "tiptap-editor-kit",
          url: "https://www.npmjs.com/package/tiptap-editor-kit",
          icon: "npm",
        },
        {
          label: "GitHub",
          url: "https://github.com/WhyBusyy/tiptap-editor-kit",
          icon: "github",
        },
      ],
    },
    // 4. Cafe DOTORI — About + Contact
    {
      id: "about",
      x: cafeB.doorX,
      y: cafeB.doorY,
      label: "사장님 · 자기소개",
      tint: 0x88ddff,
      kind: "about",
      title: "유병규 · Fullstack Developer (Frontend 중심)",
      role: "ybg6152@naver.com · 서울 서대문구",
      body: "Next.js · TypeScript · React로 웹 서비스를 만들고, 필요하면 NestJS 백엔드와 AWS 인프라까지 직접 짓습니다. 측정 가능한 성과에 집중합니다.\n\nBeyond Code — 개인 쇼핑몰 운영(월매출 1,000만+), SNS 1만 팔로워 운영, 제약/금융 도메인 근무. 비즈니스 감각을 코드에 반영합니다.",
      links: [
        {
          label: "Portfolio",
          url: "https://portfolio-beta-olive-83.vercel.app",
          icon: "external",
        },
        {
          label: "GitHub",
          url: "https://github.com/WhyBusyy",
          icon: "github",
        },
        {
          label: "Email",
          url: "mailto:ybg6152@naver.com",
          icon: "email",
        },
      ],
    },
    // 5. 거리 위 사이드 프로젝트 — 루틴 체크
    {
      id: "side-routine-check",
      x: cx + 280,
      y: cy + 220,
      label: "산책자 · 루틴 메이커",
      tint: 0xff77cc,
      kind: "side-project",
      title: "루틴 체크 — 매일 습관 트래커",
      role: "Mobile Developer (단독) · 2026.04 · iOS 앱스토어 출시",
      body: "iOS 앱스토어에 출시한 루틴 트래커. Swift WidgetKit으로 Small/Medium/Large 위젯 3종을 직접 구현하고, Skia 기반 12주 히트맵으로 지속을 시각화했습니다.",
      metrics: [
        { value: "1.0.2", label: "App Store 버전" },
        { value: "3종", label: "iOS 홈 위젯" },
        { value: "오프라인", label: "로그인 불필요" },
      ],
      links: [
        { label: "App Store", url: APPSTORE_URL, icon: "appstore" },
        {
          label: "GitHub",
          url: "https://github.com/WhyBusyy/routine-check-app",
          icon: "github",
        },
      ],
    },
    // 6. 거리 위 OSS — facebook/lexical PR + tiptap-editor-kit
    {
      id: "oss",
      x: cx - 280,
      y: cy - 240,
      label: "행인 · 오픈소스",
      tint: 0xb19cff,
      kind: "oss",
      title: "Open Source Contributions",
      role: "기여 · 배포 · 머지",
      body: "매일 쓰는 도구가 전부 오픈소스라는 인식에서 출발해, 사용 중 발견한 버그는 직접 PR로 이어가고 회사 작업물에서 추출 가능한 기능은 npm 패키지로 분리해 배포합니다.",
      links: [
        {
          label: "lexical #8214 (merged)",
          url: "https://github.com/facebook/lexical/pull/8214",
          icon: "github",
        },
        {
          label: "tiptap-editor-kit npm",
          url: "https://www.npmjs.com/package/tiptap-editor-kit",
          icon: "npm",
        },
      ],
    },
  ];
}
