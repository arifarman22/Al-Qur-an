import { create } from "zustand";

interface AudioState {
  isPlaying: boolean;
  currentAyahId: string | null; // e.g., "1:1"
  surahId: number | null;
  audioUrl: string | null;
  reciterId: number;
  volume: number;
  playbackSpeed: number;
  
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentAyah: (ayahId: string | null, surahId?: number, audioUrl?: string | null) => void;
  setReciter: (id: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  playNextAyah: () => void;
  playPrevAyah: () => void;
}

export const useAudioStore = create<AudioState>()((set) => ({
  isPlaying: false,
  currentAyahId: null,
  surahId: null,
  audioUrl: null,
  reciterId: 7, // Mishary Rashid al-`Afasy
  volume: 1,
  playbackSpeed: 1,

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentAyah: (ayahId, surahId, audioUrl) => set({ 
    currentAyahId: ayahId, 
    surahId: surahId ?? null, 
    audioUrl: audioUrl ?? null,
    isPlaying: !!ayahId 
  }),
  setReciter: (id) => set({ reciterId: id }),
  setVolume: (volume) => set({ volume }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  // These will be implemented in the components/hooks based on the current list
  playNextAyah: () => {},
  playPrevAyah: () => {},
}));
