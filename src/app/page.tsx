"use client";

import { useEffect, useState } from "react";
import { apiGetSurahs, apiGetDailyAyah, type SurahDTO, type DailyAyahDTO } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">The Noble Quran</h1>
          <p className="text-muted text-sm">Read, listen, and reflect on the divine words.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {dailyAyah && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-accent">✦ Ayah of the Day</span>
                <span className="text-xs text-muted ml-auto">{dailyAyah.surah.name_simple}</span>
              </div>
              <p className="text-right leading-[2] mb-3" dir="rtl" style={{ fontSize: "22px", fontFamily: "var(--font-amiri)" }}>
                {dailyAyah.verse.text_uthmani}
              </p>
              <p className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: dailyAyah.verse.translations?.[0]?.text || "" }} />
              <Link href={`/surah/${dailyAyah.surah.id}`} className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
                Read Surah {dailyAyah.surah.name_simple} →
              </Link>
            </motion.div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {[{ href: "/learn", label: "Learn", icon: "📚" }, { href: "/memorize", label: "Memorize", icon: "🧠" }, { href: "/tasbih", label: "Tasbih", icon: "📿" }, { href: "/duas", label: "Duas", icon: "🤲" }].map((item) => (
              <Link key={item.href} href={item.href} className="card p-3 text-center hover:border-primary/30 transition-colors">
                <span className="text-lg block">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="Search surah..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option><option value="meccan">Meccan</option><option value="medinan">Medinan</option>
          </select>
          <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")} className="card px-3 py-2 text-sm font-medium">
            {sort === "asc" ? "1 → 114" : "114 → 1"}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-[72px] card animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((surah, i) => (
              <motion.div key={surah.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}>
                <Link href={`/surah/${surah.id}`}>
                  <div className="card p-4 flex items-center justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">{surah.id}</div>
                      <div>
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{surah.name_simple}</h3>
                        <p className="text-xs text-muted">{surah.translated_name.name}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-amiri)" }}>{surah.name_arabic}</p>
                      <p className="text-[11px] text-muted">{surah.verses_count} ayahs · {surah.revelation_place}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
