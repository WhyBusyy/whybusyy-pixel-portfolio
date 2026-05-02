"use client";

import { useEffect, useState } from "react";
import { eventBus } from "@/game/EventBus";
import type { NpcConfig } from "@/game/objects/Npc";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-[92%] max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-8 font-mono text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[10px] tracking-widest uppercase text-blue-400 mb-2">
          NPC · {npc.id}
        </div>
        <h2 className="text-2xl font-bold mb-4">{npc.label}</h2>
        <p className="text-sm leading-relaxed text-zinc-300 mb-8">{npc.body}</p>

        <div className="flex justify-between items-center">
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
