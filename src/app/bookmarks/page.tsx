"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiGetBookmarks, apiDeleteBookmark, apiUpdateBookmark, type BookmarkDTO } from "@/utils/api";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import { Bookmark, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setBookmarks(await apiGetBookmarks()); }
    catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    load();
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.info("Bookmark removed");
    } catch (err: any) { toast.error(err.message); }
  };

  const handleNoteUpdate = async (id: string, note: string) => {
    try { await apiUpdateBookmark(id, note); }
    catch {}
  };

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Bookmarks</h1>
          <p className="text-muted text-sm">Your saved ayahs and study notes.</p>
        </div>

        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-primary mx-auto" /></div>
        ) : bookmarks.length === 0 ? (
          <div className="card p-12 text-center">
            <Bookmark size={32} className="mx-auto mb-3 text-muted opacity-30" />
            <p className="text-sm text-muted mb-4">No bookmarks yet.</p>
            <Link href="/" className="text-sm text-primary font-medium hover:underline">Browse Surahs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((b) => (
                <motion.div key={b.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="card p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {b.surahName} : {b.ayahNumber}
                      </span>
                      <span className="text-[11px] text-muted">{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                    <textarea
                      defaultValue={b.note}
                      placeholder="Add a note..."
                      onBlur={(e) => handleNoteUpdate(b.id, e.target.value)}
                      className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm resize-none h-16 outline-none focus:border-primary transition-colors placeholder:text-muted/50"
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <Link href={`/surah/${b.surahId}?ayah=${b.ayahNumber}`}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                        Read <ExternalLink size={12} />
                      </Link>
                      <button onClick={() => handleDelete(b.id)}
                        className="text-xs text-red-500 font-medium flex items-center gap-1 hover:underline">
                        Remove <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Container>
      <Footer />
    </main>
  );
}
