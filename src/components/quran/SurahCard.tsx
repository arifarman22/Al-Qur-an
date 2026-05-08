"use client";

import Link from "next/link";
import { type SurahDTO } from "@/utils/api";
import { motion } from "framer-motion";

export default function SurahCard({ surah, index }: { surah: SurahDTO; index: number }) {
  const isMeccan = surah.revelation_place.toLowerCase() === "makkah";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: (index % 6) * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <Link href={`/surah/${surah.id}`} className="group block">
        <div className="card p-5 group-hover:border-accent/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Number Container - Rub el Hizb style */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rotate-45 rounded-lg group-hover:bg-primary group-hover:rotate-90 transition-all duration-500" />
              <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-lg group-hover:bg-primary/90 transition-all duration-500" />
              <span className="relative text-sm font-bold text-primary group-hover:text-white transition-colors z-10">
                {surah.id}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground/90 group-hover:text-primary transition-colors truncate">
                  {surah.name_simple}
                </h3>
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isMeccan
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/30"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/30"
                }`}>
                  {isMeccan ? "Meccan" : "Medinan"}
                </span>
              </div>
              <p className="text-xs text-muted font-medium mt-0.5">
                {surah.translated_name.name} · <span className="text-accent/80">{surah.verses_count} Ayahs</span>
              </p>
            </div>

            {/* Arabic */}
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary leading-tight"
                style={{ fontFamily: "var(--font-amiri)" }}>
                {surah.name_arabic}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
