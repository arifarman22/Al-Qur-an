"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiGetSurahs, apiGetMemorization, apiUpdateMemorization, type SurahDTO, type MemorizationDTO } from "@/utils/api";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, Circle } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  not_started: { label: "Not Started", icon: Circle, color: "text-muted", bg: "bg-surface-alt" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-accent", bg: "bg-accent/10" },
  memorized: { label: "Memorized", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
} as const;

// Recommended order: start with short surahs (114 → 78), then longer ones
const RECOMMENDED_ORDER = [
  114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100,
  99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78,
];

export default function MemorizePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [memMap, setMemMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"recommended" | "all">("recommended");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    Promise.all([
      apiGetSurahs().then(setSurahs),
      apiGetMemorization().then((data) => {
        const map: Record<number, string> = {};
        data.forEach((m) => { map[m.surahId] = m.status; });
        setMemMap(map);
      }),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const handleStatusChange = async (surah: SurahDTO, status: string) => {
    try {
      await apiUpdateMemorization(surah.id, surah.name_simple, status);
      setMemMap((prev) => ({ ...prev, [surah.id]: status }));
      toast.success(`${surah.name_simple}: ${STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}`);
    } catch (err: any) { toast.error(err.message); }
  };

  const memorizedCount = Object.values(memMap).filter((s) => s === "memorized").length;
  const inProgressCount = Object.values(memMap).filter((s) => s === "in_progress").length;

  const displaySurahs = tab === "recommended"
    ? RECOMMENDED_ORDER.map((id) => surahs.find((s) => s.id === id)).filter(Boolean) as SurahDTO[]
    : surahs;

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Memorization Tracker</h1>
          <p className="text-muted text-sm">Track your Quran memorization journey (Hifz).</p>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{memorizedCount}</p>
              <p className="text-xs text-muted">Memorized</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{inProgressCount}</p>
              <p className="text-xs text-muted">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{114 - memorizedCount - inProgressCount}</p>
              <p className="text-xs text-muted">Remaining</p>
            </div>
          </div>
          <div className="h-2 bg-surface-alt rounded-full mt-4 overflow-hidden flex">
            <div className="bg-primary h-full transition-all" style={{ width: `${(memorizedCount / 114) * 100}%` }} />
            <div className="bg-accent h-full transition-all" style={{ width: `${(inProgressCount / 114) * 100}%` }} />
          </div>
          <p className="text-xs text-muted mt-2 text-center">{Math.round((memorizedCount / 114) * 100)}% of Quran memorized</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("recommended")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "recommended" ? "bg-primary text-white" : "bg-surface border border-border text-muted"}`}>
            Recommended Order
          </button>
          <button onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "all" ? "bg-primary text-white" : "bg-surface border border-border text-muted"}`}>
            All 114 Surahs
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {displaySurahs.map((surah, i) => {
              const status = (memMap[surah.id] || "not_started") as keyof typeof STATUS_CONFIG;
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;

              return (
                <motion.div key={surah.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                  className="card p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">{surah.id}.</span>
                      <Link href={`/surah/${surah.id}`} className="text-sm font-medium hover:text-primary transition-colors truncate">
                        {surah.name_simple}
                      </Link>
                      <span className="text-xs text-muted">({surah.verses_count} ayahs)</span>
                    </div>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(surah, e.target.value)}
                    className={`text-xs font-medium px-2 py-1.5 rounded-lg border border-border outline-none ${config.color} bg-surface`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="memorized">Memorized</option>
                  </select>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
      <Footer />
    </main>
  );
}
