import PhaserGame from "@/game/PhaserGame";
import NpcModal from "@/components/NpcModal";
import VirtualJoystick from "@/components/VirtualJoystick";

export default function Home() {
  return (
    <>
      <PhaserGame />
      <VirtualJoystick />
      <NpcModal />
    </>
  );
}
