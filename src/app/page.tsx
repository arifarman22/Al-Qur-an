"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetSurahs, type SurahDTO } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SurahCard from "@/components/quran/SurahCard";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, ChevronDown, Sparkles } from "lucide-react";

const INITIAL_COUNT = 12;

export default function HomePage() {
  const router = useRouter();
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    apiGetSurahs().then(setSurahs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = surahs.filter((s) => {
    const matchQ = s.name_simple.toLowerCase().includes(query.toLowerCase()) || s.name_arabic.includes(query) || s.id.toString() === query;
    const matchF = filter === "all" || s.revelation_place.toLowerCase() === filter;
    return matchQ && matchF;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/islamic_hero_bg.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-background" />
          <div className="absolute inset-0 islamic-pattern opacity-5" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              <Sparkles size={12} />
              The Final Revelation
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl mb-8 leading-tight font-light tracking-tight">
              The Noble <span className="text-accent font-normal">Quran</span>
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Search Surah, Verse, or Topic..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-white/40 text-lg outline-none focus:border-accent/50 focus:bg-white/10 transition-all shadow-2xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) router.push(`/search?q=${encodeURIComponent(val)}`);
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:block">
                  <kbd className="px-2 py-1 bg-white/10 border border-white/10 rounded text-[10px] text-white/40 font-sans">Enter ↵</kbd>
                </div>
              </div>
            </div>

            {/* Auto-sliding Ayahs */}
            <AyahSlider />
          </motion.div>
        </div>
      </section>

      {/* ═══════ SURAH SECTION ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Surahs</h2>
            <p className="text-sm text-muted mt-1">Browse all 114 chapters of the Noble Quran</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" placeholder="Search..." value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(INITIAL_COUNT); }}
                className="pl-9 pr-4 py-2 w-48 text-sm" />
            </div>
            <select value={filter} onChange={(e) => { setFilter(e.target.value as any); setVisibleCount(INITIAL_COUNT); }} className="py-2 px-3 text-sm">
              <option value="all">All</option>
              <option value="meccan">Meccan</option>
              <option value="medinan">Medinan</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-20 card animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((surah, i) => (
                <SurahCard key={surah.id} surah={surah} index={i} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={() => setVisibleCount((c) => c + 12)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-sm font-medium hover:border-primary/40 hover:shadow-sm transition-all">
                  <ChevronDown size={16} />
                  Load More Surahs ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted">No surahs found.</div>
            )}
          </>
        )}
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L24 12 L36 12 L26 20 L30 32 L20 24 L10 32 L14 20 L4 12 L16 12 Z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Begin Your Quran Journey Today</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Whether you&apos;re a beginner learning the Arabic alphabet or memorizing surahs — we have everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/learn" className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg">
                <GraduationCap size={16} />
                Start Learning
              </Link>
              <Link href="/memorize" className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                <BookOpen size={16} />
                Memorize Quran
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function GraduationCap({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

// ═══ Auto-sliding Ayah component ═══
const SLIDER_AYAHS = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    reference: "Ash-Sharh 94:6",
  },
  {
    arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    translation: "And your Lord is going to give you, and you will be satisfied.",
    reference: "Ad-Duha 93:5",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    reference: "Al-Baqarah 2:152",
  },
];

function AyahSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDER_AYAHS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const ayah = SLIDER_AYAHS[current];

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <p className="text-2xl sm:text-3xl leading-relaxed mb-3" dir="rtl" style={{ fontFamily: "var(--font-amiri)" }}>
        {ayah.arabic}
      </p>
      <p className="text-white/70 text-sm mb-2">{ayah.translation}</p>
      <p className="text-white/40 text-xs">— {ayah.reference}</p>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {SLIDER_AYAHS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-white w-6" : "bg-white/30")} />
        ))}
      </div>
    </motion.div>
  );
}
