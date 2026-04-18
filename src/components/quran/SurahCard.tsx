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
        <div className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-3.5">
            {/* Number */}
            <div className="w-11 h-11 rounded-xl bg-primary/8 dark:bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              {surah.id}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                  {surah.name_simple}
                </h3>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
                  isMeccan
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    : "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                }`}>
                  {isMeccan ? "Meccan" : "Medinan"}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {surah.translated_name.name} · {surah.verses_count} Ayahs
              </p>
            </div>

            {/* Arabic */}
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary/80 dark:text-primary/70 leading-tight"
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
