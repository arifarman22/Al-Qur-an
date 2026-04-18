"use client";

import Link from "next/link";
import { type SurahDTO } from "@/utils/api";
import { motion } from "framer-motion";

export default function SurahCard({ surah, index }: { surah: SurahDTO; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: (index % 6) * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/surah/${surah.id}`}>
        <div className="card p-4 flex items-center justify-between gap-4 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              {surah.id}
            </div>
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
  );
}
