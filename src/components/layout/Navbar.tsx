"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/utils/utils";
import { Moon, Sun, Settings, BookOpen, Search, Bookmark, GraduationCap, Heart, Menu, X, Clock } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: BookOpen },
  { name: "Read Quran", href: "/surah/1", icon: BookOpen },
  { name: "Prayer Times", href: "/prayer-times", icon: Clock },
  { name: "Search", href: "/search", icon: Search },
  { name: "Learn", href: "/learn", icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useSettingsStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary rotate-45 rounded-lg shadow-lg shadow-primary/20" />
              <span className="relative text-white text-xl font-bold z-10" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight text-primary">Al-Quran</span>
              <p className="text-[10px] text-accent font-bold uppercase tracking-widest -mt-1">Noble Wisdom</p>
            </div>
          </Link>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-alt/50 rounded-full px-2 py-1.5 border border-border">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted hover:text-primary hover:bg-white"
                )}>
                <item.icon size={15} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setSettingsOpen(true)} className="w-9 h-9 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="Settings">
              <Settings size={16} />
            </button>
            <Link href="/surah/1" className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:bg-accent-light hover:shadow-accent/40 transition-all">
              <BookOpen size={16} />
              Read Quran
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-muted">
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-surface px-4 pb-4 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm", pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted")}>
                <item.icon size={16} />
                {item.name}
              </Link>
            ))}
            <Link href="/surah/1" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium mt-2">
              <BookOpen size={16} />Start Reading
            </Link>
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 max-w-full bg-surface border-l border-border h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-muted hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Theme</label>
          <div className="flex gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => s.setTheme(t)}
                className={cn("flex-1 py-2.5 text-sm rounded-xl border font-medium capitalize transition-all", s.theme === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/30")}>{t}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Arabic Font</label>
          <div className="space-y-2">
            {([["amiri", "Amiri Quran"], ["scheherazade", "Scheherazade New"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => s.setArabicFont(key)}
                className={cn("w-full text-left px-4 py-3 rounded-xl border transition-all", s.arabicFont === key ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30")}>
                <div className="text-xl mb-0.5" style={{ fontFamily: key === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>بِسْمِ اللَّهِ</div>
                <div className="text-xs text-muted">{label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Script</label>
          <div className="flex gap-2">
            {(["uthmani", "indopak"] as const).map((sc) => (
              <button key={sc} onClick={() => s.setArabicScript(sc)}
                className={cn("flex-1 py-2.5 text-sm rounded-xl border font-medium capitalize transition-all", s.arabicScript === sc ? "border-accent bg-accent/10 text-accent" : "border-border text-muted")}>{sc}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted">Arabic size</span><span className="font-bold text-primary">{s.arabicFontSize}px</span></div>
            <input type="range" min="24" max="56" value={s.arabicFontSize} onChange={(e) => s.setArabicFontSize(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted">Translation size</span><span className="font-bold text-primary">{s.translationFontSize}px</span></div>
            <input type="range" min="12" max="22" value={s.translationFontSize} onChange={(e) => s.setTranslationFontSize(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
