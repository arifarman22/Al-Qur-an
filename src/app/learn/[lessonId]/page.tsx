"use client";

import { use } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getLessonById, getNextLesson } from "@/utils/lessons";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const { completeLesson, isCompleted } = useLearningStore();
  const { arabicFont } = useSettingsStore();

  const lesson = getLessonById(lessonId);
  const nextLesson = lesson ? getNextLesson(lesson.id) : undefined;
  const completed = isCompleted(lessonId);
  const fontFamily = arabicFont === "kfgq" ? "var(--font-kfgq)" : arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)";

  if (!lesson) return (
    <QuranReaderLayout><div className="p-6 text-center text-muted py-20">Lesson not found.</div></QuranReaderLayout>
  );

  const handleComplete = () => {
    completeLesson(lesson.id);
    toast.success("Lesson completed! 🎉");
  };

  return (
    <QuranReaderLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-6 transition-colors">
          <ChevronLeft size={16} />Back to Lessons
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">{lesson.module}</span>
            {completed && <CheckCircle2 size={16} className="text-primary ml-auto" />}
          </div>
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-muted text-sm mb-8">{lesson.description}</p>
        </motion.div>

        <div className="space-y-6">
          {lesson.content.map((block, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {block.type === "text" && <p className="text-sm leading-relaxed">{block.value}</p>}
              {block.type === "arabic" && (
                <div className="card p-6 text-center">
                  <p className="text-2xl leading-[2.2]" dir="rtl" style={{ fontFamily }}>
                    {block.value.split("\n").map((line, j) => <span key={j}>{line}<br /></span>)}
                  </p>
                </div>
              )}
              {block.type === "table" && (
                <div className="card overflow-hidden divide-y divide-border">
                  {block.value.split("|").reduce((rows: string[][], cell, idx) => {
                    const rowIdx = Math.floor(idx / 3);
                    if (!rows[rowIdx]) rows[rowIdx] = [];
                    rows[rowIdx].push(cell);
                    return rows;
                  }, []).map((row, j) => (
                    <div key={j} className="flex items-center p-3 gap-4">
                      <span className="text-xl font-bold w-12 text-center shrink-0" style={{ fontFamily }}>{row[0]}</span>
                      <span className="text-sm font-medium w-24 shrink-0">{row[1]}</span>
                      <span className="text-sm text-muted flex-1">{row[2]}</span>
                    </div>
                  ))}
                </div>
              )}
              {block.type === "tip" && (
                <div className="card p-4 border-l-4 border-l-accent bg-accent/5">
                  <p className="text-sm">💡 {block.value}</p>
                </div>
              )}
              {block.type === "audio-practice" && (
                <div className="card p-4 text-center">
                  <p className="text-xs text-muted mb-2">🔊 Practice listening</p>
                  <Link href={`/surah/${block.value.split(":")[0]}`} className="text-sm text-primary font-medium hover:underline">
                    Open Surah {block.value.split(":")[0]} to listen →
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          {!completed ? (
            <button onClick={handleComplete}
              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Mark as Complete
            </button>
          ) : (
            <div className="text-center py-3 text-primary font-medium text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Lesson Completed
            </div>
          )}
          <div className="flex items-center justify-between">
            <Link href="/learn" className="text-sm text-muted hover:text-foreground">← All Lessons</Link>
            {nextLesson && (
              <Link href={`/learn/${nextLesson.id}`} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                Next: {nextLesson.title} <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </QuranReaderLayout>
  );
}
