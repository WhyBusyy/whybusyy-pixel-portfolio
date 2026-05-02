import type { NpcConfig } from "@/game/objects/Npc";

export interface JoystickVec {
  x: number;
  y: number;
}

type EventMap = {
  "npc:open": (npc: NpcConfig) => void;
  "npc:close": () => void;
  "input:joystick": (vec: JoystickVec) => void;
  "input:action": () => void;
};

type EventName = keyof EventMap;

type AnyListener = (...args: unknown[]) => void;

const listeners: Record<string, Set<AnyListener>> = {};

export const eventBus = {
  on<K extends EventName>(event: K, handler: EventMap[K]) {
    (listeners[event] ??= new Set()).add(handler as AnyListener);
  },
  off<K extends EventName>(event: K, handler: EventMap[K]) {
    listeners[event]?.delete(handler as AnyListener);
  },
  emit<K extends EventName>(event: K, ...args: Parameters<EventMap[K]>) {
    listeners[event]?.forEach((h) => h(...(args as unknown[])));
  },
};
