"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/utils/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FontSettingsPanel({ isOpen, onClose }: Props) {
  const s = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-80 max-w-full bg-surface border-l border-border h-full overflow-y-auto p-5 space-y-6 animate-in slide-in-from-right">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Font Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-hover text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Arabic Font Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Arabic Font</label>
          <div className="space-y-2">
            {([["kfgq", "KFGQ Hafs Uthmanic"], ["amiri", "Amiri Quran"], ["scheherazade", "Scheherazade New"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => s.setArabicFont(key)}
                className={cn("w-full text-left px-4 py-3 rounded-lg border transition-colors", s.arabicFont === key ? "border-primary bg-primary/10" : "border-border hover:border-primary/30")}>
                <p className="text-lg mb-0.5" dir="rtl" style={{ fontFamily: key === "kfgq" ? "var(--font-kfgq)" : key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-muted">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Script Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Quran Script</label>
          <div className="flex gap-2">
            {(["uthmani", "indopak"] as const).map((sc) => (
              <button key={sc} onClick={() => s.setArabicScript(sc)}
                className={cn("flex-1 py-2.5 text-sm rounded-lg border transition-colors capitalize", s.arabicScript === sc ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/30")}>
                {sc}
              </button>
            ))}
          </div>
        </div>

        {/* Arabic Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Arabic Font Size</label>
            <span className="text-xs font-bold text-primary">{s.arabicFontSize}px</span>
          </div>
          <input type="range" min="20" max="56" value={s.arabicFontSize} onChange={(e) => s.setArabicFontSize(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-[10px] text-muted"><span>Small</span><span>Large</span></div>
        </div>

        {/* Translation Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">Translation Font Size</label>
            <span className="text-xs font-bold text-primary">{s.translationFontSize}px</span>
          </div>
          <input type="range" min="12" max="24" value={s.translationFontSize} onChange={(e) => s.setTranslationFontSize(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-[10px] text-muted"><span>Small</span><span>Large</span></div>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Theme</label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((t) => (
              <button key={t} onClick={() => s.setTheme(t)}
                className={cn("flex-1 py-2.5 text-sm rounded-lg border transition-colors capitalize", s.theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/30")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-muted text-center pt-4 border-t border-border">Settings are saved automatically</p>
      </div>
    </div>
  );
}
