"use client";

import { useLearningStore } from "@/store/useLearningStore";
import { MODULES, LESSONS, getLessonsByModule } from "@/utils/lessons";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, ChevronRight } from "lucide-react";

export default function LearnPage() {
  const { completed, getCompletedCount } = useLearningStore();
  const completedCount = getCompletedCount();
  const totalLessons = LESSONS.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Learn Quran</h1>
          <p className="text-muted text-sm">Step-by-step course from Arabic basics to Quran reading.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Your Progress</span>
            <span className="text-sm font-bold text-primary">{completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="h-3 bg-surface-alt rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 0.8 }} className="h-full bg-primary rounded-full" />
          </div>
          <p className="text-xs text-muted mt-2">{overallProgress}% complete</p>
        </motion.div>

        <div className="space-y-8">
          {MODULES.map((mod, mi) => {
            const lessons = getLessonsByModule(mod.id);
            const modCompleted = lessons.filter((l) => completed[l.id]).length;
            const isModComplete = modCompleted === lessons.length;

            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.05 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{mod.icon}</span>
                  <div className="flex-1">
                    <h2 className="font-semibold flex items-center gap-2">
                      {mod.title}
                      {isModComplete && <CheckCircle2 size={16} className="text-primary" />}
                    </h2>
                    <p className="text-xs text-muted">{mod.description} · {modCompleted}/{lessons.length}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {lessons.map((lesson, li) => {
                    const isDone = completed[lesson.id];
                    const prevLesson = li > 0 ? lessons[li - 1] : null;
                    const prevModuleLessons = mi > 0 ? getLessonsByModule(MODULES[mi - 1].id) : [];
                    const prevModuleComplete = mi === 0 || prevModuleLessons.every((l) => completed[l.id]);
                    const isUnlocked = isDone || (li === 0 ? (mi === 0 || prevModuleComplete) : completed[prevLesson!.id]);

                    return (
                      <Link key={lesson.id} href={isUnlocked ? `/learn/${lesson.id}` : "#"}
                        onClick={(e) => { if (!isUnlocked) e.preventDefault(); }}
                        className={`card p-4 flex items-center gap-4 transition-all ${isUnlocked ? "hover:border-primary/40" : "opacity-50 cursor-not-allowed"}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${isDone ? "bg-primary text-white" : isUnlocked ? "bg-primary/10 text-primary" : "bg-surface-alt text-muted"}`}>
                          {isDone ? <CheckCircle2 size={18} /> : isUnlocked ? li + 1 : <Lock size={14} />}
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
      </div>
    <Footer />
    </main>
  );
}
