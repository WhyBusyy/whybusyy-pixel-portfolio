"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "whybusyy-pixel-welcome-v1";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // localStorage 차단된 환경 — 그냥 표시
      setOpen(true);
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-8 font-mono text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2.5 h-2.5 bg-[#ff5566]" />
          <span className="inline-block w-2.5 h-2.5 bg-[#ffd06b]" />
          <span className="inline-block w-2.5 h-2.5 bg-[#88ddff]" />
        </div>

        <h2 className="text-2xl font-bold mb-3">
          WhyBusyy Pixel Portfolio
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          캐릭터를 조종해 <strong className="text-blue-400">약국·카페 거리</strong>를
          돌아다니며 NPC <strong className="text-blue-400">6명</strong>과 대화하세요.
          경력 임팩트, 사이드 프로젝트, 자기소개를 발견할 수 있습니다.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
          <div className="bg-zinc-800/80 border border-zinc-700/50 px-3 py-3 rounded-lg">
            <div className="text-blue-400 font-bold mb-2 tracking-widest text-[10px]">
              PC
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-0.5">
              <div>← ↑ → ↓ / WASD</div>
              <div>SPACE · 대화</div>
              <div>ESC · 닫기</div>
            </div>
          </div>
          <div className="bg-zinc-800/80 border border-zinc-700/50 px-3 py-3 rounded-lg">
            <div className="text-blue-400 font-bold mb-2 tracking-widest text-[10px]">
              MOBILE
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-0.5">
              <div>좌측 조이스틱</div>
              <div>ACTION · 대화</div>
              <div>오버레이 탭 · 닫기</div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 mb-4">
          NPC 머리 위 노란
          <span className="mx-1 inline-block px-1.5 py-0.5 bg-yellow-400 text-black font-bold rounded">
            !
          </span>
          마크는 대화 가능한 NPC를 의미합니다.
        </p>

        <button
          type="button"
          onClick={close}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded text-sm font-semibold transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
