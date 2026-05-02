"use client";

import { useEffect, useState } from "react";
import { eventBus } from "@/game/EventBus";
import type { NpcConfig, NpcLinkIcon } from "@/game/objects/Npc";

const KIND_BADGE: Record<string, { label: string; color: string }> = {
  "case-study": { label: "Case Study", color: "bg-blue-500/20 text-blue-300" },
  "side-project": { label: "Side Project", color: "bg-pink-500/20 text-pink-300" },
  oss: { label: "Open Source", color: "bg-violet-500/20 text-violet-300" },
  about: { label: "About", color: "bg-emerald-500/20 text-emerald-300" },
  placeholder: { label: "Placeholder", color: "bg-zinc-500/20 text-zinc-400" },
};

function LinkIcon({ icon }: { icon?: NpcLinkIcon }) {
  const cls = "w-3.5 h-3.5";
  if (icon === "github") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.11 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 0Z" />
      </svg>
    );
  }
  if (icon === "npm") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0Zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331Zm4 0v1.336H8V8.667h5.334v5.331h-2.668Zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8v5.331ZM10.665 10H12v2.667h-1.335V10Z" />
      </svg>
    );
  }
  if (icon === "appstore") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    );
  }
  if (icon === "email") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14M5 5h5M5 19h14a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}

export default function NpcModal() {
  const [npc, setNpc] = useState<NpcConfig | null>(null);

  const close = () => {
    setNpc(null);
    eventBus.emit("npc:close");
  };

  useEffect(() => {
    const open = (config: NpcConfig) => setNpc(config);
    eventBus.on("npc:open", open);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNpc((prev) => {
          if (prev) eventBus.emit("npc:close");
          return null;
        });
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      eventBus.off("npc:open", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!npc) return null;

  const kind = npc.kind ?? "placeholder";
  const badge = KIND_BADGE[kind];
  const title = npc.title ?? npc.label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-7 font-mono text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kind badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] tracking-widest uppercase font-semibold ${badge.color}`}
          >
            {badge.label}
          </span>
          <span className="text-[10px] text-zinc-500">id: {npc.id}</span>
        </div>

        <h2 className="text-2xl font-bold leading-tight mb-2">{title}</h2>
        {npc.role && (
          <p className="text-xs text-zinc-400 mb-5">{npc.role}</p>
        )}

        <p className="text-sm leading-relaxed text-zinc-300 mb-6 whitespace-pre-line">
          {npc.body}
        </p>

        {npc.metrics && npc.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {npc.metrics.map((m) => (
              <div
                key={m.label}
                className="text-center bg-zinc-800/60 border border-zinc-700/50 rounded-lg py-3 px-2"
              >
                <div className="text-lg font-bold text-blue-400 leading-tight">
                  {m.value}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 leading-tight">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {npc.links && npc.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {npc.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-xs transition-colors"
              >
                <LinkIcon icon={l.icon} />
                {l.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <span className="text-[11px] text-zinc-500">ESC · 클릭으로 닫기</span>
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
