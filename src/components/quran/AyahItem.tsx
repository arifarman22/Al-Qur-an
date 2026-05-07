"use client";

import { useState, useEffect, useRef } from "react";
import { type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioStore } from "@/store/useAudioStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

interface Props {
  ayah: AyahDTO;
  surahId: number;
  surahName: string;
}

export default function AyahItem({ ayah, surahId, surahName }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize, arabicScript } = useSettingsStore();
  const { currentAyahId, isPlaying, setCurrentAyah, setIsPlaying } = useAudioStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [copied, setCopied] = useState(false);

  const isCurrent = currentAyahId === ayah.verse_key;
  const bookmarked = isBookmarked(ayah.verse_key);
  const arabicText = arabicScript === "indopak" && ayah.text_indopak ? ayah.text_indopak : ayah.text_uthmani || "";
  const englishTranslation = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
  const bengaliTranslation = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";
  const fontFamily = arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

  const handlePlay = () => {
    if (isCurrent && isPlaying) { setIsPlaying(false); return; }
    if (!ayah.audio_url) { toast.error("Audio not available"); return; }
    setCurrentAyah(ayah.verse_key, surahId, ayah.audio_url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText([arabicText, englishTranslation, bengaliTranslation, `— Quran ${ayah.verse_key}`].filter(Boolean).join("\n\n"));
    setCopied(true);
    toast.success("Copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => {
    if (bookmarked) { removeBookmark(ayah.verse_key); toast.info("Bookmark removed"); }
    else { addBookmark({ verseKey: ayah.verse_key, surahId, surahName, ayahNumber: ayah.verse_number }); toast.success("Bookmarked"); }
  };

  return (
    <div id={`ayah-${ayah.verse_number}`} className={cn("card p-5 transition-all", isCurrent && "ring-1 ring-primary/30 border-primary/30")}>
      <div className="flex items-center justify-between mb-4">
        <span className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center text-xs font-semibold text-muted">
          {ayah.verse_number}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={handlePlay} disabled={!ayah.audio_url}
            className={cn("p-1.5 rounded-md transition-colors", !ayah.audio_url ? "text-muted/30" : isCurrent && isPlaying ? "bg-primary text-white" : "text-muted hover:text-primary hover:bg-primary/10")}>
            {isCurrent && isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={toggleBookmark} className={cn("p-1.5 rounded-md transition-colors", bookmarked ? "text-accent" : "text-muted hover:text-accent")}>
            {bookmarked ? "★" : "☆"}
          </button>
          <button onClick={handleCopy} className="p-1.5 rounded-md text-muted hover:text-foreground transition-colors">
            {copied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      <p className="text-right leading-[2.2] mb-4" dir="rtl" style={{ fontSize: `${arabicFontSize}px`, fontFamily }}>
        {arabicText}
      </p>

      {englishTranslation && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-medium text-primary mb-1">English</p>
          <p className="text-muted leading-relaxed" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: englishTranslation }} />
        </div>
      )}

      {bengaliTranslation && (
        <div className="border-t border-border pt-4 mt-3">
          <p className="text-xs font-medium text-accent mb-1">বাংলা</p>
          <p className="text-muted leading-relaxed" style={{ fontSize: `${translationFontSize}px` }} dangerouslySetInnerHTML={{ __html: bengaliTranslation }} />
        </div>
      )}
    </div>
  );
}
