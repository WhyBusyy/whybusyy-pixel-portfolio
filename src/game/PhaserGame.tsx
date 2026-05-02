"use client";

import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let game: Phaser.Game | null = null;

    (async () => {
      const PhaserMod = (await import("phaser")).default;
      const { BootScene } = await import("@/game/scenes/BootScene");
      const { MapScene } = await import("@/game/scenes/MapScene");
      if (!mounted || !containerRef.current) return;

      game = new PhaserMod.Game({
        type: PhaserMod.AUTO,
        parent: containerRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
        backgroundColor: "#0e0e1a",
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 0 }, debug: false },
        },
        scale: {
          mode: PhaserMod.Scale.RESIZE,
          autoCenter: PhaserMod.Scale.CENTER_BOTH,
        },
        scene: [BootScene, MapScene],
      });

      gameRef.current = game;
      // 게임 인스턴스 준비 완료 — 로딩 오버레이 페이드 아웃
      requestAnimationFrame(() => {
        if (mounted) setReady(true);
      });
    })();

    return () => {
      mounted = false;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-screen h-screen overflow-hidden bg-black select-none"
      />
      <LoadingOverlay visible={!ready} />
    </>
  );
}

function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center bg-[#0e0e1a] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="text-center font-mono">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className="inline-block w-3 h-3 bg-[#ff5566] animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="inline-block w-3 h-3 bg-[#ffd06b] animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block w-3 h-3 bg-[#88ddff] animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <div className="text-blue-400 text-lg font-bold tracking-widest">
          LOADING
        </div>
        <div className="text-zinc-500 text-xs mt-2">
          픽셀 캐릭터 생성 중...
        </div>
      </div>
    </div>
  );
}
