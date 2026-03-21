import { useContext } from "react";
import { Ctx } from "../context/AudioPlayerCtx";

export function useAudioPlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudioPlayer must be used within <AudioPlayerProvider>");
  return ctx;
}
