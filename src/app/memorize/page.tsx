"use client";

import { useEffect, useState } from "react";
import { apiGetSurahs, type SurahDTO } from "@/utils/api";
import { useMemorizationStore } from "@/store/useMemorizationStore";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  not_started: { label: "Not Started", icon: Circle, color: "text-muted" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-accent" },
  memorized: { label: "Memorized", icon: CheckCircle2, color: "text-primary" },
} as const;

const RECOMMENDED_ORDER = [114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78];

export default function MemorizePage() {
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"recommended" | "all">("recommended");
  const { progress, setStatus, getStatus } = useMemorizationStore();

  useEffect(() => {
    apiGetSurahs().then(setSurahs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const memorizedCount = Object.values(progress).filter((s) => s === "memorized").length;
  const inProgressCount = Object.values(progress).filter((s) => s === "in_progress").length;

  const displaySurahs = tab === "recommended"
    ? RECOMMENDED_ORDER.map((id) => surahs.find((s) => s.id === id)).filter(Boolean) as SurahDTO[]
    : surahs;

  return (
    <QuranReaderLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-1">Memorization Tracker</h1>
        <p className="text-muted text-sm mb-6">Track your Quran memorization (Hifz).</p>

        <div className="card p-5 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold text-primary">{memorizedCount}</p><p className="text-xs text-muted">Memorized</p></div>
            <div><p className="text-2xl font-bold text-accent">{inProgressCount}</p><p className="text-xs text-muted">In Progress</p></div>
            <div><p className="text-2xl font-bold">{114 - memorizedCount - inProgressCount}</p><p className="text-xs text-muted">Remaining</p></div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("recommended")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "recommended" ? "bg-primary text-white" : "card text-muted"}`}>Recommended</button>
          <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "all" ? "bg-primary text-white" : "card text-muted"}`}>All 114</button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Loading...</div>
        ) : (
          <div className="space-y-2">
            {displaySurahs.map((surah, i) => {
              const status = getStatus(surah.id);
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              return (
                <motion.div key={surah.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }} className="card p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-surface-alt`}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{surah.id}.</span>
                      <Link href={`/surah/${surah.id}`} className="text-sm font-medium hover:text-primary truncate">{surah.name_simple}</Link>
                      <span className="text-xs text-muted">({surah.verses_count})</span>
                    </div>
                  </div>
                  <select value={status} onChange={(e) => { setStatus(surah.id, e.target.value as any); toast.success(`${surah.name_simple}: ${e.target.value.replace("_", " ")}`); }}
                    className={`text-xs font-medium px-2 py-1.5 rounded-lg ${config.color}`}>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="memorized">Memorized</option>
                  </select>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </QuranReaderLayout>
  );
}
