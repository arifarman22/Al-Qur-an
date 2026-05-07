"use client";

import { usePlaybackStore, formatTime } from "@/store/usePlaybackStore";
import { useSurahAudio } from "@/hooks/useSurahAudio";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Gauge } from "lucide-react";

export default function GlobalSurahPlayer() {
  const store = usePlaybackStore();
  const { seekGlobal } = useSurahAudio();

  if (!store.surahId || store.ayahs.length === 0) return null;

  const currentAyah = store.ayahs[store.currentIndex];
  const progressPercent = store.totalDuration > 0 ? (store.globalPosition / store.totalDuration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Glassmorphism background */}
        <div className="bg-surface/90 backdrop-blur-xl border-t border-border shadow-2xl shadow-black/20">
          {/* Progress bar (full width, thin) */}
          <div className="h-1 bg-border relative cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seekGlobal(percent * store.totalDuration);
            }}>
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1 }}
            />
            <div className="absolute inset-0 h-2 -top-1 group-hover:bg-primary/10 transition-colors" />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Left: Surah info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                <span className="text-primary text-xs font-bold">{store.surahId}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{store.surahName}</p>
                <p className="text-[11px] text-muted">
                  Ayah {currentAyah?.verse_number || 1} of {store.ayahs.length}
                  {store.currentWordIndex >= 0 && ` · Word ${store.currentWordIndex + 1}`}
                </p>
              </div>
            </div>

            {/* Center: Controls */}
            <div className="flex items-center gap-2">
              <button onClick={store.prevAyah} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
                <SkipBack size={16} />
              </button>
              <button onClick={store.togglePlay}
                className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all">
                {store.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={store.nextAyah} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
                <SkipForward size={16} />
              </button>
            </div>

            {/* Right: Time + controls */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <span className="text-[11px] text-muted tabular-nums hidden sm:block">
                {formatTime(store.globalPosition)} / {formatTime(store.totalDuration)}
              </span>

              {/* Speed */}
              <button onClick={() => store.setSpeed(store.speed >= 2 ? 0.5 : store.speed + 0.25)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-medium text-muted hover:text-foreground transition-colors">
                <Gauge size={12} />
                {store.speed}x
              </button>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-1.5">
                <Volume2 size={14} className="text-muted" />
                <input type="range" min="0" max="1" step="0.1" value={store.volume}
                  onChange={(e) => store.setVolume(+e.target.value)}
                  className="w-16" />
              </div>

              {/* Close */}
              <button onClick={store.reset} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
