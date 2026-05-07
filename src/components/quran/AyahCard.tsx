"use client";

import { useEffect, useRef, memo } from "react";
import { type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Play, Pause, Bookmark, Copy, Share2 } from "lucide-react";

interface Props {
  ayah: AyahDTO;
  index: number;
  surahId: number;
  surahName: string;
}

const AyahCard = memo(function AyahCard({ ayah, index, surahId, surahName }: Props) {
  const settings = useSettingsStore();
  const { currentIndex, isPlaying, currentWordIndex, playAyah, pause } = usePlaybackStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const ref = useRef<HTMLDivElement>(null);

  const isActive = currentIndex === index && isPlaying;
  const isCurrent = currentIndex === index;
  const bookmarked = isBookmarked(ayah.verse_key);
  const fontFamily = settings.arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";
  const arabicText = settings.arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
  const words = arabicText.split(" ");
  const english = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
  const bengali = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";

  // Auto-scroll to active ayah
  useEffect(() => {
    if (isCurrent && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrent]);

  const handlePlay = () => {
    if (isActive) pause();
    else playAyah(index);
  };

  const handleBookmark = () => {
    if (bookmarked) { removeBookmark(ayah.verse_key); toast.info("Removed"); }
    else { addBookmark({ verseKey: ayah.verse_key, surahId, surahName, ayahNumber: ayah.verse_number }); toast.success("Bookmarked"); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${arabicText}\n\n${english}\n\n— Quran ${ayah.verse_key}`);
    toast.success("Copied");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Quran ${ayah.verse_key}`, text: `${arabicText}\n\n${english}`, url: window.location.href });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className={cn(
        "relative flex gap-3 md:gap-5 px-3 py-6 md:px-6 border-b border-border/50 transition-all duration-300",
        isCurrent && "bg-primary/[0.03] border-l-[3px] border-l-primary"
      )}
    >
      {/* ═══ LEFT: VERTICAL ACTION BUTTONS ═══ */}
      <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
        {/* Verse number */}
        <span className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all",
          isCurrent ? "bg-primary text-white border-primary shadow-md shadow-primary/30" : "bg-surface-alt text-muted border-border"
        )}>
          {ayah.verse_number}
        </span>

        {/* Play/Pause */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handlePlay}
          disabled={!ayah.audio_url}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border",
            isActive
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/40"
              : "bg-surface/80 text-muted border-border/50 hover:text-primary hover:border-primary/40 hover:shadow-md"
          )}
        >
          {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </motion.button>

        {/* Bookmark */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleBookmark}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border",
            bookmarked
              ? "bg-accent/10 text-accent border-accent/30"
              : "bg-surface/80 text-muted border-border/50 hover:text-accent hover:border-accent/30"
          )}
        >
          <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
        </motion.button>

        {/* Copy */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleCopy}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-surface/80 text-muted border border-border/50 hover:text-foreground hover:border-border backdrop-blur-sm transition-all"
        >
          <Copy size={13} />
        </motion.button>

        {/* Share */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleShare}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-surface/80 text-muted border border-border/50 hover:text-foreground hover:border-border backdrop-blur-sm transition-all hidden md:flex"
        >
          <Share2 size={13} />
        </motion.button>
      </div>

      {/* ═══ RIGHT: AYAH CONTENT ═══ */}
      <div className="flex-1 min-w-0">
        {/* Arabic text with word-by-word highlighting */}
        <div className="text-right mb-4" dir="rtl">
          <p className="leading-[2.6] inline" style={{ fontSize: `${settings.arabicFontSize}px`, fontFamily, wordSpacing: "6px" }}>
            {words.map((word, wi) => (
              <span
                key={wi}
                className={cn(
                  "inline-block transition-all duration-200 rounded px-0.5",
                  isCurrent && wi === currentWordIndex && "text-accent scale-105 drop-shadow-[0_0_8px_rgba(197,150,58,0.4)]",
                  isCurrent && wi < currentWordIndex && "text-primary/70",
                  isCurrent && wi > currentWordIndex && "text-foreground"
                )}
              >
                {word}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* English Translation */}
        {english && (
          <p className="text-muted leading-relaxed" style={{ fontSize: `${settings.translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: english }} />
        )}

        {/* Bengali Translation */}
        {bengali && (
          <div className="mt-3 pt-3 border-t border-border/40">
            <p className="text-[10px] text-primary font-medium mb-1">বাংলা</p>
            <p className="text-muted leading-relaxed" style={{ fontSize: `${settings.translationFontSize}px`, fontFamily: "var(--font-bengali)" }} dangerouslySetInnerHTML={{ __html: bengali }} />
          </div>
        )}
      </div>
    </motion.div>
  );
});

export default AyahCard;
