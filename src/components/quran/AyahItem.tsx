"use client";

import { useState, useEffect, useRef } from "react";
import { type AyahDTO, apiCreateBookmark, apiDeleteBookmark } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioStore } from "@/store/useAudioStore";
import { Play, Pause, Bookmark, Copy, Check } from "lucide-react";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

interface Props {
  ayah: AyahDTO;
  surahId: number;
  surahName: string;
  bookmarkId?: string;
  onBookmarkChange?: () => void;
  onRead?: (verseNumber: number) => void;
}

export default function AyahItem({ ayah, surahId, surahName, bookmarkId, onBookmarkChange, onRead }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize, arabicScript } = useSettingsStore();
  const { currentAyahId, isPlaying, setCurrentAyah, setIsPlaying } = useAudioStore();
  const [copied, setCopied] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const isCurrent = currentAyahId === ayah.verse_key;
  const isBookmarked = !!bookmarkId;
  const arabicText = arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";

  // English = resource_id 131, Bengali = resource_id 161
  const englishTranslation = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
  const bengaliTranslation = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";

  const handlePlay = () => {
    if (isCurrent && isPlaying) { setIsPlaying(false); return; }
    if (!ayah.audio_url) { toast.error("Audio not available"); return; }
    setCurrentAyah(ayah.verse_key, surahId, ayah.audio_url);
  };

  const handleCopy = () => {
    const text = [arabicText, englishTranslation, bengaliTranslation, `— Quran ${ayah.verse_key}`].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = async () => {
    if (bookmarking) return;
    setBookmarking(true);
    try {
      if (isBookmarked && bookmarkId) {
        await apiDeleteBookmark(bookmarkId);
        toast.info("Bookmark removed");
      } else {
        await apiCreateBookmark(ayah.verse_key, surahId, surahName, ayah.verse_number);
        toast.success("Bookmarked");
      }
      onBookmarkChange?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBookmarking(false);
    }
  };

  // Track reading progress when ayah becomes visible
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !onRead) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onRead(ayah.verse_number); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ayah.verse_number, onRead]);

  return (
    <div ref={ref} id={`ayah-${ayah.verse_number}`}
      className={cn("card p-5 transition-all", isCurrent && "ring-1 ring-primary/30 border-primary/30 bg-primary/5")}>
      <div className="flex items-center justify-between mb-4">
        <span className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-xs font-semibold text-muted">
          {ayah.verse_number}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={handlePlay}
            disabled={!ayah.audio_url}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              !ayah.audio_url ? "text-muted/30 cursor-not-allowed" :
              isCurrent && isPlaying ? "bg-primary text-white" : "text-muted hover:text-primary hover:bg-primary/10"
            )}>
            {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={toggleBookmark} disabled={bookmarking}
            className={cn("p-1.5 rounded-md transition-colors", isBookmarked ? "text-accent" : "text-muted hover:text-accent hover:bg-accent/10")}>
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button onClick={handleCopy} className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
            {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <p className="text-right leading-[2.2] mb-4" dir="rtl"
        style={{ fontSize: `${arabicFontSize}px`, fontFamily: arabicFont === "kfgq" ? "var(--font-kfgq)" : arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>
        {arabicText}
      </p>

      {/* English Translation */}
      {englishTranslation && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-medium text-primary mb-1.5">English</p>
          <p className="text-muted leading-relaxed" style={{ fontSize: `${translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: englishTranslation }} />
        </div>
      )}

      {/* Bengali Translation */}
      {bengaliTranslation && (
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs font-medium text-accent mb-1.5">বাংলা</p>
          <p className="text-muted leading-relaxed" style={{ fontSize: `${translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: bengaliTranslation }} />
        </div>
      )}
    </div>
  );
}
