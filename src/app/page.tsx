"use client";

import { useEffect, useState } from "react";
import { apiGetSurahs, apiGetDailyAyah, type SurahDTO, type DailyAyahDTO } from "@/utils/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [dailyAyah, setDailyAyah] = useState<DailyAyahDTO | null>(null);

  useEffect(() => {
    apiGetSurahs().then(setSurahs).catch(() => {}).finally(() => setLoading(false));
    apiGetDailyAyah().then(setDailyAyah).catch(() => {});
  }, []);

  const filtered = surahs
    .filter((s) => {
      const matchQ = s.name_simple.toLowerCase().includes(query.toLowerCase()) || s.name_arabic.includes(query) || s.id.toString() === query;
      const matchF = filter === "all" || s.revelation_place.toLowerCase() === filter;
      return matchQ && matchF;
    })
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id));

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
          </div>
          <span className="font-semibold text-sm">Al-Quran</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/search" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors">Search</Link>
          <Link href="/bookmarks" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors">Bookmarks</Link>
          <Link href="/learn" className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors">Learn</Link>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">The Noble Quran</h1>
          <p className="text-muted text-sm">Read, listen, and reflect on the divine words.</p>
        </div>

        {/* Daily Ayah + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {dailyAyah && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-accent">✦ Ayah of the Day</span>
                <span className="text-xs text-muted ml-auto">{dailyAyah.surah.name_simple}</span>
              </div>
              <p className="text-center leading-[2] mb-3" dir="rtl" style={{ fontSize: "22px", fontFamily: "var(--font-kfgq)" }}>
                {dailyAyah.verse.text_uthmani}
              </p>
              <p className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: dailyAyah.verse.translations?.[0]?.text || "" }} />
              <Link href={`/surah/${dailyAyah.surah.id}`} className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
                Read Surah {dailyAyah.surah.name_simple} →
              </Link>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 gap-2">
            {[
              { href: "/learn", label: "Learn", icon: "📚" },
              { href: "/memorize", label: "Memorize", icon: "🧠" },
              { href: "/tasbih", label: "Tasbih", icon: "📿" },
              { href: "/duas", label: "Duas", icon: "🤲" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="card p-3 text-center hover:bg-surface-hover transition-colors">
                <span className="text-lg block">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Search surah..." value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-3 py-2.5 text-sm">
            <option value="all">All</option>
            <option value="meccan">Meccan</option>
            <option value="medinan">Medinan</option>
          </select>
          <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            className="px-3 py-2.5 card text-sm font-medium hover:bg-surface-hover transition-colors">
            {sort === "asc" ? "1 → 114" : "114 → 1"}
          </button>
        </div>

        {/* Surah Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-[72px] card animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((surah, i) => (
              <motion.div key={surah.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}>
                <Link href={`/surah/${surah.id}`}>
                  <div className="card p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                        {surah.id}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{surah.name_simple}</h3>
                        <p className="text-xs text-muted">{surah.translated_name.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-kfgq)" }}>{surah.name_arabic}</p>
                      <p className="text-[11px] text-muted">{surah.verses_count} ayahs · {surah.revelation_place}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">No surahs found.</div>
        )}
      </div>
    </main>
  );
}
