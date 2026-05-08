"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Star, Clock, Globe, Heart, Sparkles } from "lucide-react";

const QURAN_FACTS = [
  { label: "Total Surahs", value: "114", icon: BookOpen },
  { label: "Total Ayahs", value: "6,236", icon: Star },
  { label: "Total Words", value: "77,430", icon: Globe },
  { label: "Revelation Period", value: "23 Years", icon: Clock },
  { label: "Meccan Surahs", value: "86", icon: Heart },
  { label: "Medinan Surahs", value: "28", icon: Sparkles },
];

const FEATURED_SURAHS = [
  { id: 1, name: "Al-Fatihah", arabic: "الفاتحة", desc: "The Opening — recited in every prayer", ayahs: 7, tag: "Essential" },
  { id: 36, name: "Ya-Sin", arabic: "يس", desc: "The Heart of the Quran", ayahs: 83, tag: "Popular" },
  { id: 55, name: "Ar-Rahman", arabic: "الرحمن", desc: "The Most Merciful — beautiful repetition", ayahs: 78, tag: "Beautiful" },
  { id: 67, name: "Al-Mulk", arabic: "الملك", desc: "Protection from punishment of the grave", ayahs: 30, tag: "Recommended" },
  { id: 18, name: "Al-Kahf", arabic: "الكهف", desc: "Read every Friday for light between two Fridays", ayahs: 110, tag: "Friday" },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", desc: "Equal to one-third of the Quran in reward", ayahs: 4, tag: "Short" },
];

const READING_GUIDE = [
  { step: "1", title: "Start with Al-Fatihah", desc: "The opening chapter is the most recited surah. It's a prayer and a conversation with Allah." },
  { step: "2", title: "Read Short Surahs", desc: "Begin with Juz Amma (last 30th) — short, powerful surahs like Al-Ikhlas, Al-Falaq, An-Nas." },
  { step: "3", title: "Use Translation", desc: "Read with English or Bengali translation to understand the meaning behind each verse." },
  { step: "4", title: "Listen to Recitation", desc: "Play audio to hear proper pronunciation and feel the beauty of Quranic recitation." },
  { step: "5", title: "Read Daily", desc: "Even one page a day builds a strong connection. Consistency matters more than quantity." },
  { step: "6", title: "Reflect & Apply", desc: "The Quran is guidance for life. Reflect on its messages and apply them in your daily actions." },
];

const THEMES = [
  { title: "Tawheed (Monotheism)", desc: "The oneness of Allah — the central message of the entire Quran", color: "primary" },
  { title: "Stories of Prophets", desc: "25 prophets mentioned — lessons from Adam to Muhammad ﷺ", color: "accent" },
  { title: "Day of Judgment", desc: "Descriptions of the Hereafter, Paradise, and accountability", color: "primary" },
  { title: "Moral Guidance", desc: "Ethics, justice, kindness, family, and community values", color: "accent" },
  { title: "Laws & Rulings", desc: "Halal, haram, inheritance, marriage, and social contracts", color: "primary" },
  { title: "Signs in Nature", desc: "The universe, creation, and natural phenomena as proof of Allah", color: "accent" },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold mb-6">
              <Sparkles size={12} />
              Discover the Quran
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Your Guide to the Noble Quran</h1>
            <p className="text-muted max-w-xl mx-auto">Explore the structure, themes, and beauty of the final revelation. Whether you&apos;re new or returning — start here.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">

        {/* ═══ QURAN STATISTICS ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-6">Quran at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QURAN_FACTS.map((fact, i) => (
              <motion.div key={fact.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card p-4 text-center hover:border-primary/30 transition-all">
                <fact.icon size={20} className="mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{fact.value}</p>
                <p className="text-[11px] text-muted mt-1">{fact.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ FEATURED SURAHS ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Featured Surahs</h2>
              <p className="text-sm text-muted mt-1">Recommended surahs to start with</p>
            </div>
            <Link href="/surah/1" className="text-xs text-primary font-medium hover:underline">View all 114 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SURAHS.map((surah, i) => (
              <motion.div key={surah.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/surah/${surah.id}`}>
                  <div className="card p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase">{surah.tag}</span>
                      <span className="text-xs text-muted">{surah.ayahs} ayahs</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{surah.name}</h3>
                      <p className="text-lg text-primary font-bold" style={{ fontFamily: "var(--font-amiri)" }}>{surah.arabic}</p>
                    </div>
                    <p className="text-xs text-muted">{surah.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ HOW TO READ THE QURAN ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-2">How to Start Reading the Quran</h2>
          <p className="text-sm text-muted mb-6">A simple guide for beginners and returning readers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {READING_GUIDE.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card p-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-sm font-bold mb-3">{item.step}</div>
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ MAJOR THEMES ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-2">Major Themes of the Quran</h2>
          <p className="text-sm text-muted mb-6">The core messages that run throughout the entire Quran</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((theme, i) => (
              <motion.div key={theme.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`card p-5 border-l-[3px] ${theme.color === "primary" ? "border-l-primary" : "border-l-accent"}`}>
                <h3 className="text-sm font-bold mb-1">{theme.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{theme.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ CTA ═══ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card p-8 sm:p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-3">Ready to Begin?</h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6">Start your journey with the Quran today. Read, listen, and reflect on the words of Allah.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/surah/1" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <BookOpen size={16} />
              Start Reading
            </Link>
            <Link href="/prayer-times" className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-sm font-medium hover:border-primary/40 transition-all">
              <Clock size={16} />
              Prayer Times
            </Link>
          </div>
        </motion.section>
      </div>

      <Footer />
    </main>
  );
}
