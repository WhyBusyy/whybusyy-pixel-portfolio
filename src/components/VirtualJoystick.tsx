"use client";

import { useEffect, useRef, useState } from "react";
import { eventBus } from "@/game/EventBus";

const RADIUS = 60;

export default function VirtualJoystick() {
  const [enabled, setEnabled] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const center = useRef({ x: 0, y: 0 });
  const activeTouchId = useRef<number | null>(null);

  useEffect(() => {
    const check = () => {
      const isTouch =
        "ontouchstart" in window ||
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
      setEnabled(isTouch);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!enabled) return null;

  const updateFromTouch = (clientX: number, clientY: number) => {
    let dx = clientX - center.current.x;
    let dy = clientY - center.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }
    setStickPos({ x: dx, y: dy });
    eventBus.emit("input:joystick", { x: dx / RADIUS, y: dy / RADIUS });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    if (!baseRef.current || !t) return;
    const rect = baseRef.current.getBoundingClientRect();
    center.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    activeTouchId.current = t.identifier;
    updateFromTouch(t.clientX, t.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = Array.from(e.changedTouches).find(
      (t) => t.identifier === activeTouchId.current,
    );
    if (!t) return;
    updateFromTouch(t.clientX, t.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const ended = Array.from(e.changedTouches).some(
      (t) => t.identifier === activeTouchId.current,
    );
    if (!ended) return;
    activeTouchId.current = null;
    setStickPos({ x: 0, y: 0 });
    eventBus.emit("input:joystick", { x: 0, y: 0 });
  };

  const onActionTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    eventBus.emit("input:action");
  };

  return (
    <>
      <div
        ref={baseRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        className="fixed bottom-8 left-8 w-[120px] h-[120px] rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm z-40 touch-none select-none"
      >
        <div
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-white/40 border-2 border-white/60 pointer-events-none"
          style={{
            transform: `translate(calc(-50% + ${stickPos.x}px), calc(-50% + ${stickPos.y}px))`,
          }}
        />
      </div>

      <button
        type="button"
        onTouchStart={onActionTouch}
        aria-label="상호작용"
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full bg-blue-500/80 hover:bg-blue-500 active:bg-blue-400 text-white font-bold text-xs border-2 border-white/40 backdrop-blur-sm z-40 touch-none select-none font-mono"
      >
        ACTION
      </button>
    </>
  );
}
