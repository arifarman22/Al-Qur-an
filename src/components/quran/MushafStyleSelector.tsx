"use client";

import { useState } from "react";
import { cn } from "@/utils/utils";

const MUSHAF_STYLES = [
  {
    id: "unicode",
    title: "Unicode Text Mushaf",
    desc: "Standard Unicode rendering",
    preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    font: "var(--font-amiri)",
  },
  {
    id: "hafezi",
    title: "Hafezi Quran Mushaf",
    desc: "Traditional Hafezi style from Bangladesh",
    preview: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    font: "var(--font-amiri)",
  },
  {
    id: "newmadani",
    title: "New Madani Mushaf",
    desc: "Modern Madinah Mushaf print style",
    preview: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ",
    font: "var(--font-scheherazade)",
  },
  {
    id: "nurani",
    title: "Nurani Mushaf",
    desc: "Color-coded Tajweed Nurani style",
    preview: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    font: "var(--font-amiri)",
  },
  {
    id: "qaloon",
    title: "Qaloon Mushaf",
    desc: "Qaloon recitation script (North Africa)",
    preview: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    font: "var(--font-scheherazade)",
  },
  {
    id: "shemerly",
    title: "Shemerly Mushaf",
    desc: "Shemerly calligraphy style",
    preview: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ",
    font: "var(--font-amiri)",
  },
  {
    id: "warsh",
    title: "Warsh Mushaf",
    desc: "Warsh recitation script (West Africa)",
    preview: "بِسْمِ اللّهِ الرَّحْمنِ الرَّحِيمِ",
    font: "var(--font-scheherazade)",
  },
  {
    id: "tanzil",
    title: "Tanzil Mushaf",
    desc: "Tanzil.net verified text",
    preview: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    font: "var(--font-amiri)",
  },
];

// Islamic Mosque Dome SVG Icon
function MosqueIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 2C12 2 8 6 8 9c0 1.5.5 2.5 1 3H15c.5-.5 1-1.5 1-3 0-3-4-7-4-7z" />
      <path d="M12 2v2M8 12v8M16 12v8M4 20h16M6 16h12M10 12v8M14 12v8" />
      <circle cx="12" cy="5" r="0.5" fill="currentColor" />
    </svg>
  );
}

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function MushafStyleSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <MosqueIcon className="w-4 h-4 text-primary" />
        <p className="text-xs font-semibold">Select Mushaf Style</p>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {MUSHAF_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={cn(
              "w-full text-left px-3 py-3 rounded-xl border transition-all",
              selected === style.id
                ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                : "border-border hover:border-primary/20 hover:bg-surface-alt"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Mushaf icon */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                selected === style.id ? "bg-primary/10 border-primary/20" : "bg-surface-alt border-border"
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn("w-5 h-5", selected === style.id ? "text-primary" : "text-muted")}>
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  <path d="M8 7h8M8 11h6M8 15h4" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn("text-[13px] font-medium", selected === style.id && "text-primary")}>{style.title}</p>
                <p className="text-[10px] text-muted">{style.desc}</p>
              </div>

              {selected === style.id && (
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                </span>
              )}
            </div>

            {/* Preview */}
            <div className="mt-2 ml-13 pl-[52px]">
              <p className="text-base text-foreground/70 leading-relaxed" dir="rtl" style={{ fontFamily: style.font }}>
                {style.preview}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="card p-3 bg-surface-alt/50 border-border/50">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-accent shrink-0 mt-0.5">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-[10px] text-muted leading-relaxed">
            All Mushaf styles display the same Quranic text with different typographic rendering. The text source is verified and accurate.
          </p>
        </div>
      </div>
    </div>
  );
}
