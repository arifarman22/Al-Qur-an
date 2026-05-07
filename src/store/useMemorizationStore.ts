import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MemorizationState {
  progress: Record<number, "not_started" | "in_progress" | "memorized">;
  setStatus: (surahId: number, status: "not_started" | "in_progress" | "memorized") => void;
  getStatus: (surahId: number) => "not_started" | "in_progress" | "memorized";
}

export const useMemorizationStore = create<MemorizationState>()(
  persist(
    (set, get) => ({
      progress: {},
      setStatus: (surahId, status) => set((s) => ({ progress: { ...s.progress, [surahId]: status } })),
      getStatus: (surahId) => get().progress[surahId] || "not_started",
    }),
    { name: "quran-memorization" }
  )
);
