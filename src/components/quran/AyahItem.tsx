"use client";

import { useState, useEffect, useRef } from "react";
import { type AyahDTO, apiCreateBookmark, apiDeleteBookmark } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAudioStore } from "@/store/useAudioStore";
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
  const englishTranslation = ayah.translations?.find((t) => t.resource_id === 131)?.text || "";
  const bengaliTranslation = ayah.translations?.find((t) => t.resource_id === 161)?.text || "";

  const fontFamily = arabicFont === "kfgq" ? "var(--font-kfgq)" : arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

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
    } catch (err: any) { toast.error(err.message); }
    finally { setBookmarking(false); }
  };

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
    <div
      ref={ref}
      id={`ayah-${ayah.verse_number}`}
      className={cn(
        "group relative px-4 py-6 md:px-6 border-b border-border transition-colors",
        isCurrent && "bg-primary/5"
      )}
    >
      {/* Top row: verse number + actions */}
      <div className="flex items-center justify-between mb-5">
        {/* Verse badge (diamond shape like QuranMazid) */}
        <div className="verse-badge">
          <span>{ayah.verse_number}</span>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {/* Play */}
          <button
            onClick={handlePlay}
            disabled={!ayah.audio_url}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              !ayah.audio_url ? "text-muted/30 cursor-not-allowed" :
              isCurrent && isPlaying ? "bg-primary text-white" : "text-muted hover:text-primary hover:bg-primary/10"
            )}
          >
            {isCurrent && isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            disabled={bookmarking}
            className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", isBookmarked ? "text-accent" : "text-muted hover:text-accent hover:bg-accent/10")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isBookmarked ? 0 : 1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Arabic Text — centered, large */}
      <div className="text-center mb-5">
        <p
          className="leading-[2.4] text-foreground"
          dir="rtl"
          style={{ fontSize: `${arabicFontSize}px`, fontFamily, wordSpacing: "4px" }}
        >
          {arabicText}
        </p>
      </div>

      {/* English Translation */}
      {englishTranslation && (
        <div className="mb-3">
          <p
            className="text-subtitle leading-relaxed"
            style={{ fontSize: `${translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: englishTranslation }}
          />
        </div>
      )}

      {/* Bengali Translation */}
      {bengaliTranslation && (
        <div>
          <p className="text-[11px] text-primary/70 font-medium mb-1">বাংলা</p>
          <p
            className="text-subtitle leading-relaxed"
            style={{ fontSize: `${translationFontSize}px` }}
            dangerouslySetInnerHTML={{ __html: bengaliTranslation }}
          />
        </div>
      )}
    </div>
  );
}
