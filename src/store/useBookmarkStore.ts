import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalBookmark {
  verseKey: string;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  note: string;
  createdAt: number;
}

interface BookmarkState {
  bookmarks: LocalBookmark[];
  addBookmark: (bm: Omit<LocalBookmark, "createdAt" | "note">) => void;
  removeBookmark: (verseKey: string) => void;
  isBookmarked: (verseKey: string) => boolean;
  updateNote: (verseKey: string, note: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bm) => set((s) => ({
        bookmarks: [{ ...bm, note: "", createdAt: Date.now() }, ...s.bookmarks],
      })),
      removeBookmark: (verseKey) => set((s) => ({
        bookmarks: s.bookmarks.filter((b) => b.verseKey !== verseKey),
      })),
      isBookmarked: (verseKey) => get().bookmarks.some((b) => b.verseKey === verseKey),
      updateNote: (verseKey, note) => set((s) => ({
        bookmarks: s.bookmarks.map((b) => b.verseKey === verseKey ? { ...b, note } : b),
      })),
    }),
    { name: "quran-bookmarks" }
  )
);
