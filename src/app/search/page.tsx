"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiSearch, type SearchResultDTO } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

export default function SearchPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => { if (!authLoading && !user) router.replace("/login"); }, [user, authLoading, router]);
  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try { setResults(await apiSearch(query)); }
    catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Search</h1>
          <p className="text-muted text-sm">Find ayahs by English translation.</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-8">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="e.g. patience, mercy, forgiveness..." value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
          <button type="submit" disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 size={24} className="animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted mb-4">{results.length} results for &ldquo;{query}&rdquo;</p>
            {results.map((r, i) => (
              <motion.div key={`${r.verse_key}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{r.verse_key}</span>
                  <Link href={`/surah/${r.verse_key.split(":")[0]}?ayah=${r.verse_key.split(":")[1]}`}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                    Go <ArrowRight size={12} />
                  </Link>
                </div>
                <p className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: r.text }} />
              </motion.div>
            ))}
          </div>
        ) : searched && !loading ? (
          <p className="text-center py-16 text-muted text-sm">No results for &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="text-center py-16 text-muted">
            <Search size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Enter a keyword to search the Quran.</p>
          </div>
        )}
      </Container>
      <Footer />
    </main>
  );
}
