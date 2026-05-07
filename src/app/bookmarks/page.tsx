"use client";

import { useBookmarkStore } from "@/store/useBookmarkStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, updateNote } = useBookmarkStore();

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-1">Bookmarks</h1>
        <p className="text-muted text-sm mb-6">Your saved ayahs and notes.</p>

        {bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-sm text-muted mb-4">No bookmarks yet.</p>
            <Link href="/surah/1" className="text-sm text-primary font-medium hover:underline">Start reading</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((b) => (
                <motion.div key={b.verseKey} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{b.surahName} : {b.ayahNumber}</span>
                    <span className="text-[11px] text-muted">{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <textarea
                    defaultValue={b.note}
                    placeholder="Add a note..."
                    onBlur={(e) => updateNote(b.verseKey, e.target.value)}
                    className="w-full px-3 py-2 text-sm resize-none h-14"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <Link href={`/surah/${b.surahId}`} className="text-xs text-primary font-medium hover:underline">Read →</Link>
                    <button onClick={() => { removeBookmark(b.verseKey); toast.info("Removed"); }} className="text-xs text-red-500 font-medium hover:underline">Remove</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    <Footer />
    </main>
  );
}
