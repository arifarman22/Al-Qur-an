"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, X, Volume2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalAudioPlayer() {
  const { currentAyahId, isPlaying, audioUrl, setIsPlaying, volume, setVolume, surahId } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    setLoading(true);
    setProgress(0);
    audioRef.current.src = audioUrl;
    audioRef.current.volume = volume;
    audioRef.current.load();
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);

  const handleCanPlay = () => {
    setLoading(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const time = (+e.target.value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(+e.target.value);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentAyahId) return null;

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3"
    >
      <audio
        ref={audioRef}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => setIsPlaying(false)}
        onError={() => { setLoading(false); setIsPlaying(false); }}
      />

      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{surahId}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Ayah {currentAyahId}</p>
            <p className="text-xs text-muted">
              {loading ? "Loading..." : `${formatTime(audioRef.current?.currentTime || 0)} / ${formatTime(duration)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={loading}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Volume2 size={16} className="text-muted" />
            <input
              type="range" min="0" max="1" step="0.1" value={volume}
              onChange={(e) => { const v = +e.target.value; setVolume(v); if (audioRef.current) audioRef.current.volume = v; }}
              className="w-20 accent-primary h-1"
            />
          </div>
          <button onClick={() => { useAudioStore.getState().setCurrentAyah(null); setProgress(0); setDuration(0); }}
            className="p-1.5 rounded-md text-muted hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-2">
        <input
          type="range" min="0" max="100" value={progress} onChange={handleSeek}
          className="w-full h-1 accent-primary appearance-none bg-border rounded-full cursor-pointer"
        />
      </div>
    </motion.div>
  );
}
