"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

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
    })();

    return () => {
      mounted = false;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black select-none"
    />
  );
}
