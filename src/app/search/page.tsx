"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiSearch, type SearchResultDTO } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResultDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-search if query param exists
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setLoading(true);
      setSearched(true);
      apiSearch(initialQuery)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }
  }, [initialQuery]);

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
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative pt-16 pb-12 bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            Search Wisdom
          </div>
          <h1 className="text-3xl font-bold mb-2">Search the Quran</h1>
          <p className="text-muted text-sm max-w-md mx-auto">Find ayahs by English translation text or keywords across the entire Noble Quran.</p>
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto -mt-8 relative z-10">
        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="e.g. patience, mercy, forgiveness..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-4 bg-surface border border-border rounded-2xl shadow-xl shadow-primary/5 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all" 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-surface border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">{results.length} Results Found</p>
            </div>
            {results.map((r, i) => (
              <motion.div 
                key={`${r.verse_key}-${i}`} 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.03 }} 
                className="card p-5 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20 uppercase">Verse {r.verse_key}</span>
                  </div>
                  <Link href={`/surah/${r.verse_key.split(":")[0]}?ayah=${r.verse_key.split(":")[1]}`} className="text-xs font-bold text-accent hover:text-accent-light transition-colors flex items-center gap-1">
                    Read Ayah <span className="text-base leading-none">→</span>
                  </Link>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: r.text }} />
              </motion.div>
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-3xl">
            <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted/30">
              <Search size={32} />
            </div>
            <p className="text-muted text-sm">No results found for &quot;{query}&quot;</p>
            <button onClick={() => setQuery("")} className="text-primary text-xs font-bold mt-2 hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-sm">Enter a keyword above to search through the entire Quran.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
