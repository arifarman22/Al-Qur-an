import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearningState {
  completed: Record<string, boolean>;
  completeLesson: (lessonId: string) => void;
  isCompleted: (lessonId: string) => boolean;
  getCompletedCount: () => number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      completed: {},
      completeLesson: (lessonId) => set((s) => ({ completed: { ...s.completed, [lessonId]: true } })),
      isCompleted: (lessonId) => !!get().completed[lessonId],
      getCompletedCount: () => Object.keys(get().completed).length,
    }),
    { name: "quran-learning" }
  )
);
