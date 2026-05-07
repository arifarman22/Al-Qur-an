import { useEffect, useRef, useCallback } from "react";
import { usePlaybackStore } from "@/store/usePlaybackStore";

export function useSurahAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const store = usePlaybackStore();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Load audio when currentIndex changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const ayah = store.ayahs[store.currentIndex];
    if (!ayah?.audio_url) return;

    audio.src = ayah.audio_url;
    audio.playbackRate = store.speed;
    audio.volume = store.volume;
    audio.load();

    if (store.isPlaying) {
      audio.play().catch(() => {});
    }
  }, [store.currentIndex, store.ayahs]);

  // Play/Pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (store.isPlaying) {
      audio.play().catch(() => store.pause());
    } else {
      audio.pause();
    }
  }, [store.isPlaying]);

  // Speed sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = store.speed;
  }, [store.speed]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = store.volume;
  }, [store.volume]);

  // Time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      store.setCurrentTime(audio.currentTime);
      
      // Word-level sync: estimate word index based on time
      const ayah = store.ayahs[store.currentIndex];
      if (ayah?.text_uthmani) {
        const words = ayah.text_uthmani.split(" ");
        const duration = audio.duration || 1;
        const progress = audio.currentTime / duration;
        const wordIndex = Math.floor(progress * words.length);
        store.setCurrentWordIndex(Math.min(wordIndex, words.length - 1));
      }
    };

    const onLoadedMetadata = () => {
      store.setAyahDuration(store.currentIndex, audio.duration);
    };

    const onEnded = () => {
      store.onAyahEnd();
    };

    const onError = () => {
      store.pause();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [store.currentIndex]);

  // Seek within current ayah
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  // Seek global (across ayahs)
  const seekGlobal = useCallback((globalTime: number) => {
    store.seekGlobal(globalTime);
    // After state updates, the useEffect for currentIndex will reload audio
    // Then we need to seek within that ayah
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = store.currentTime;
      }
    }, 100);
  }, []);

  return { audioRef, seekTo, seekGlobal };
}
