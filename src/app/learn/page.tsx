"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiGetLearningProgress, type LearningProgressDTO } from "@/utils/api";
import { MODULES, LESSONS, getLessonsByModule } from "@/utils/lessons";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, ChevronRight } from "lucide-react";

export default function LearnPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    apiGetLearningProgress()
      .then((data) => {
        const map: Record<string, boolean> = {};
        data.forEach((p) => { if (p.completed) map[p.lessonId] = true; });
        setProgress(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const completedCount = Object.keys(progress).length;
  const totalLessons = LESSONS.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Learn Quran</h1>
          <p className="text-muted text-sm">Step-by-step course from Arabic basics to Quran reading.</p>
        </div>

        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Your Progress</span>
            <span className="text-sm font-bold text-primary">{completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="h-3 bg-surface-alt rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted mt-2">{overallProgress}% complete</p>
        </motion.div>

        {/* Modules */}
        <div className="space-y-8">
          {MODULES.map((mod, mi) => {
            const lessons = getLessonsByModule(mod.id);
            const modCompleted = lessons.filter((l) => progress[l.id]).length;
            const modTotal = lessons.length;
            const isModComplete = modCompleted === modTotal;

            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.05 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{mod.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-semibold flex items-center gap-2">
                      {mod.title}
                      {isModComplete && <CheckCircle2 size={16} className="text-primary" />}
                    </h2>
                    <p className="text-xs text-muted">{mod.description} · {modCompleted}/{modTotal}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {lessons.map((lesson, li) => {
                    const isCompleted = progress[lesson.id];
                    // A lesson is unlocked if it's the first, or the previous one is completed
                    const prevLesson = li > 0 ? lessons[li - 1] : null;
                    const isFirstInModule = li === 0;
                    const prevModuleLessons = mi > 0 ? getLessonsByModule(MODULES[mi - 1].id) : [];
                    const prevModuleComplete = mi === 0 || prevModuleLessons.every((l) => progress[l.id]);
                    const isUnlocked = isCompleted || (isFirstInModule ? (mi === 0 || prevModuleComplete) : progress[prevLesson!.id]);

                    return (
                      <Link
                        key={lesson.id}
                        href={isUnlocked ? `/learn/${lesson.id}` : "#"}
                        onClick={(e) => { if (!isUnlocked) e.preventDefault(); }}
                        className={`card p-4 flex items-center gap-4 transition-all ${isUnlocked ? "hover:border-primary/40" : "opacity-50 cursor-not-allowed"}`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                          isCompleted ? "bg-primary text-white" : isUnlocked ? "bg-primary/10 text-primary" : "bg-surface-alt text-muted"
                        }`}>
                          {isCompleted ? <CheckCircle2 size={18} /> : isUnlocked ? li + 1 : <Lock size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted truncate">{lesson.description}</p>
                        </div>
                        {isUnlocked && <ChevronRight size={16} className="text-muted shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
