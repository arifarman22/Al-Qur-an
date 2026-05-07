"use client";

import { useEffect, useState } from "react";
import { apiSearch, type SearchResultDTO } from "@/utils/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SearchPage() {
      const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

    
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
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-1">Search the Quran</h1>
        <p className="text-muted text-sm mb-6">Find ayahs by English translation text.</p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="e.g. patience, mercy, forgiveness..." value={query} onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 text-sm" />
          <button type="submit" disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
            {loading ? "..." : "Search"}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-muted text-sm">Searching...</div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-muted mb-4">{results.length} results</p>
            {results.map((r, i) => (
              <motion.div key={`${r.verse_key}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{r.verse_key}</span>
                  <Link href={`/surah/${r.verse_key.split(":")[0]}`} className="text-xs text-primary font-medium hover:underline">
                    Go →
                  </Link>
                </div>
                <p className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: r.text }} />
              </motion.div>
            ))}
          </div>
        ) : searched ? (
          <p className="text-center py-16 text-muted text-sm">No results found.</p>
        ) : (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">Enter a keyword to search across all translations.</p>
          </div>
        )}
      </div>
    <Footer />
    </main>
  );
}
