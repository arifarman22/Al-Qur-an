"use client";

import { useEffect, useState } from "react";
import { apiGetSurahs, type SurahDTO } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowRight, ChevronDown } from "lucide-react";

const INITIAL_COUNT = 12;

export default function HomePage() {
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
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="relative w-full">
          <img src="/mainbanner.png" alt="" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* H1 with special font */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl mb-8 leading-tight font-bold"
          >
            The Noble Quran
          </motion.h1>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search the Quran..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-sm outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                onKeyDown={(e) => { if (e.key === "Enter" && (e.target as HTMLInputElement).value) window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`; }}
              />
            </div>
          </motion.div>

          {/* Auto-sliding Ayahs (3 ayahs) */}
          <AyahSlider />
            </div>
          </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((surah, i) => (
                <motion.div key={surah.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                  <Link href={`/surah/${surah.id}`}>
                    <div className="card p-4 flex items-center justify-between gap-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all group">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center text-sm font-bold shrink-0 border border-primary/10">
                          {surah.id}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{surah.name_simple}</h3>
                          <p className="text-xs text-muted">{surah.translated_name.name}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-amiri)" }}>{surah.name_arabic}</p>
                        <p className="text-[11px] text-muted">{surah.verses_count} ayahs</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
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
