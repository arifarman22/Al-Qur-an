"use client";

import { useEffect, useState, use } from "react";
import { apiGetSurah, apiGetAyahs, type SurahDTO, type AyahDTO } from "@/utils/api";
import { useSettingsStore } from "@/store/useSettingsStore";
import AyahItem from "@/components/quran/AyahItem";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { arabicScript } = useSettingsStore();
  const [surah, setSurah] = useState<SurahDTO | null>(null);
  const [ayahs, setAyahs] = useState<AyahDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetSurah(+id), apiGetAyahs(+id, arabicScript)])
      .then(([s, a]) => { setSurah(s); setAyahs(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, arabicScript]);

  return (
    <main className="min-h-screen bg-surface-alt pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="text-sm text-muted hover:text-foreground mb-6 inline-block">← Back</Link>

        {loading ? (
          <div className="space-y-4">
            <div className="h-32 card animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 card animate-pulse" />)}
          </div>
        ) : surah ? (
          <>
            <div className="card p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">{surah.id}</div>
                    <div>
                      <h1 className="text-xl font-bold">{surah.name_simple}</h1>
                      <p className="text-sm text-muted">{surah.translated_name.name}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted">{surah.revelation_place} · {surah.verses_count} Ayahs</p>
                </div>
                <p className="text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-amiri)" }}>{surah.name_arabic}</p>
              </div>
            </div>

            {surah.id !== 1 && surah.id !== 9 && (
              <div className="text-center py-6 mb-6">
                <p className="text-3xl" style={{ fontFamily: "var(--font-amiri)" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              </div>
            )}

            <div className="space-y-4">
              {ayahs.map((ayah) => (
                <AyahItem key={ayah.id} ayah={ayah} surahId={surah.id} surahName={surah.name_simple} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted py-20">Surah not found</p>
        )}
      </div>
      <Footer />
    </main>
  );
}
