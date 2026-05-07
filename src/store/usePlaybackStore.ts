import { create } from "zustand";
import { type AyahDTO } from "@/utils/api";

interface PlaybackState {
  // Surah state
  surahId: number | null;
  surahName: string;
  ayahs: AyahDTO[];
  currentIndex: number;
  isPlaying: boolean;
  
  // Timeline
  currentTime: number; // current time within current ayah
  totalDuration: number; // total surah duration (sum of all ayah durations)
  ayahDurations: number[]; // duration of each ayah
  globalPosition: number; // position in total surah timeline
  
  // Word sync
  currentWordIndex: number;
  
  // Playback speed
  speed: number;
  volume: number;

  // Actions
  loadSurah: (surahId: number, surahName: string, ayahs: AyahDTO[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playAyah: (index: number) => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seekGlobal: (position: number) => void;
  setCurrentTime: (time: number) => void;
  setAyahDuration: (index: number, duration: number) => void;
  setCurrentWordIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  onAyahEnd: () => void;
  reset: () => void;
}

export const usePlaybackStore = create<PlaybackState>()((set, get) => ({
  surahId: null,
  surahName: "",
  ayahs: [],
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  totalDuration: 0,
  ayahDurations: [],
  globalPosition: 0,
  currentWordIndex: -1,
  speed: 1,
  volume: 1,

  loadSurah: (surahId, surahName, ayahs) => {
    set({
      surahId,
      surahName,
      ayahs,
      currentIndex: 0,
      isPlaying: false,
      currentTime: 0,
      totalDuration: 0,
      ayahDurations: new Array(ayahs.length).fill(0),
      globalPosition: 0,
      currentWordIndex: -1,
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  playAyah: (index) => {
    const { ayahs } = get();
    if (index >= 0 && index < ayahs.length) {
      set({ currentIndex: index, isPlaying: true, currentTime: 0, currentWordIndex: -1 });
    }
  },

  nextAyah: () => {
    const { currentIndex, ayahs } = get();
    if (currentIndex < ayahs.length - 1) {
      set({ currentIndex: currentIndex + 1, currentTime: 0, currentWordIndex: -1 });
    } else {
      set({ isPlaying: false }); // End of surah
    }
  },

  prevAyah: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, currentTime: 0, currentWordIndex: -1 });
    }
  },

  seekGlobal: (position) => {
    // Find which ayah this position falls into
    const { ayahDurations } = get();
    let accumulated = 0;
    for (let i = 0; i < ayahDurations.length; i++) {
      if (accumulated + ayahDurations[i] > position) {
        set({ currentIndex: i, currentTime: position - accumulated, globalPosition: position });
        return;
      }
      accumulated += ayahDurations[i];
    }
  },

  setCurrentTime: (time) => {
    const { currentIndex, ayahDurations } = get();
    let globalPos = 0;
    for (let i = 0; i < currentIndex; i++) globalPos += ayahDurations[i];
    globalPos += time;
    set({ currentTime: time, globalPosition: globalPos });
  },

  setAyahDuration: (index, duration) => {
    set((s) => {
      const durations = [...s.ayahDurations];
      durations[index] = duration;
      return { ayahDurations: durations, totalDuration: durations.reduce((a, b) => a + b, 0) };
    });
  },

  setCurrentWordIndex: (index) => set({ currentWordIndex: index }),
  setSpeed: (speed) => set({ speed }),
  setVolume: (volume) => set({ volume }),

  onAyahEnd: () => {
    const { currentIndex, ayahs } = get();
    if (currentIndex < ayahs.length - 1) {
      set({ currentIndex: currentIndex + 1, currentTime: 0, currentWordIndex: -1 });
    } else {
      set({ isPlaying: false, currentTime: 0, currentWordIndex: -1 });
    }
  },

  reset: () => set({
    surahId: null, surahName: "", ayahs: [], currentIndex: 0, isPlaying: false,
    currentTime: 0, totalDuration: 0, ayahDurations: [], globalPosition: 0, currentWordIndex: -1,
  }),
}));

// Helper: format seconds to mm:ss
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
