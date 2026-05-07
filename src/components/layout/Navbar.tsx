"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/utils/utils";

const navItems = [
  { name: "Surahs", href: "/" },
  { name: "Search", href: "/search" },
  { name: "Bookmarks", href: "/bookmarks" },
  { name: "Learn", href: "/learn" },
  { name: "Duas", href: "/duas" },
  { name: "Tasbih", href: "/tasbih" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
              </div>
              <span className="font-semibold text-sm hidden sm:block">Al-Quran</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className={cn("px-3 py-1.5 rounded-md text-sm transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted hover:text-foreground")}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-md text-muted hover:text-foreground transition-colors">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-md text-muted hover:text-foreground transition-colors">⚙️</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-muted">☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border px-4 pb-3 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={cn("block px-3 py-2 rounded-md text-sm", pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted")}>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>
      {settingsOpen && <SettingsDrawer onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

function SettingsDrawer({ onClose }: { onClose: () => void }) {
  const s = useSettingsStore();
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-80 max-w-full bg-surface border-l border-border h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Settings</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">✕</button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Theme</label>
          <div className="flex gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => s.setTheme(t)}
                className={cn("flex-1 py-2 text-sm rounded-lg border capitalize", s.theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted")}>{t}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Arabic Font</label>
          <div className="space-y-2">
            {([["amiri", "Amiri"], ["scheherazade", "Scheherazade"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => s.setArabicFont(key)}
                className={cn("w-full text-left px-4 py-3 rounded-lg border", s.arabicFont === key ? "border-primary bg-primary/5" : "border-border")}>
                <div className="text-xl mb-0.5" style={{ fontFamily: key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>بِسْمِ اللَّهِ</div>
                <div className="text-xs text-muted">{label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Script</label>
          <div className="flex gap-2">
            {(["uthmani", "indopak"] as const).map((sc) => (
              <button key={sc} onClick={() => s.setArabicScript(sc)}
                className={cn("flex-1 py-2 text-sm rounded-lg border capitalize", s.arabicScript === sc ? "border-accent bg-accent/10 text-accent" : "border-border text-muted")}>{sc}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted">Arabic size</span><span className="font-medium">{s.arabicFontSize}px</span></div>
            <input type="range" min="24" max="56" value={s.arabicFontSize} onChange={(e) => s.setArabicFontSize(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted">Translation size</span><span className="font-medium">{s.translationFontSize}px</span></div>
            <input type="range" min="12" max="22" value={s.translationFontSize} onChange={(e) => s.setTranslationFontSize(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
