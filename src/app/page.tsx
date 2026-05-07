"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetDailyAyah, apiGetReadingProgress, type DailyAyahDTO, type ReadingProgressDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [dailyAyah, setDailyAyah] = useState<DailyAyahDTO | null>(null);
  const [lastRead, setLastRead] = useState<ReadingProgressDTO | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    apiGetDailyAyah().then(setDailyAyah).catch(() => {});
    apiGetReadingProgress().then(setLastRead).catch(() => {});
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="h-screen bg-background" />;

  return (
    <QuranReaderLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-3xl font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Assalamu Alaikum, {user.name.split(" ")[0]}</h1>
          <p className="text-muted text-sm">Read, listen, and study the Noble Quran</p>
        </motion.div>

        {/* Continue Reading */}
        {lastRead && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary font-medium mb-1">Continue Reading</p>
                <p className="font-semibold">{lastRead.surahName}</p>
                <p className="text-xs text-muted">Ayah {lastRead.ayahNumber}</p>
              </div>
              <Link href={`/surah/${lastRead.surahId}?ayah=${lastRead.ayahNumber}`}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                Resume
              </Link>
            </div>
          </motion.div>
        )}

        {/* Daily Ayah */}
        {dailyAyah && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-accent">✦ Ayah of the Day</span>
              <span className="text-xs text-muted ml-auto">{dailyAyah.surah.name_simple}</span>
            </div>
            <p className="text-right leading-[2] mb-3" dir="rtl"
              style={{ fontSize: "22px", fontFamily: "var(--font-kfgq)" }}>
              {dailyAyah.verse.text_uthmani}
            </p>
            <p className="text-sm text-muted leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dailyAyah.verse.translations?.[0]?.text || "" }} />
            <Link href={`/surah/${dailyAyah.surah.id}`}
              className="text-xs text-primary font-medium mt-3 inline-block hover:underline">
              Read Surah {dailyAyah.surah.name_simple} →
            </Link>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-sm font-semibold mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/surah/1", label: "Al-Fatihah", icon: "📖" },
              { href: "/surah/36", label: "Ya-Sin", icon: "⭐" },
              { href: "/surah/67", label: "Al-Mulk", icon: "🌙" },
              { href: "/learn", label: "Learn Quran", icon: "📚" },
              { href: "/memorize", label: "Memorize", icon: "🧠" },
              { href: "/tasbih", label: "Tasbih", icon: "📿" },
              { href: "/duas", label: "Duas", icon: "🤲" },
              { href: "/search", label: "Search", icon: "🔍" },
              { href: "/bookmarks", label: "Bookmarks", icon: "🔖" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="card p-4 text-center hover:bg-surface-hover transition-colors">
                <span className="text-xl mb-1 block">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Start Reading CTA */}
        {!lastRead && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-center py-6">
            <Link href="/surah/1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
              Start Reading the Quran
            </Link>
          </motion.div>
        )}
      </div>
    </QuranReaderLayout>
  );
}
