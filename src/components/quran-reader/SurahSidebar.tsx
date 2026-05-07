"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiGetSurahs, type SurahDTO } from "@/utils/api";
import { cn } from "@/utils/utils";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SurahSidebar({ isOpen = true, onClose }: Props) {
  const [surahs, setSurahs] = useState<SurahDTO[]>([]);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    apiGetSurahs().then(setSurahs).catch(() => {});
  }, []);

  const currentSurahId = pathname.match(/\/surah\/(\d+)/)?.[1];

  const filtered = surahs.filter((s) =>
    s.name_simple.toLowerCase().includes(search.toLowerCase()) ||
    s.name_arabic.includes(search) ||
    s.id.toString() === search
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "w-72 bg-sidebar border-r border-border h-screen flex flex-col shrink-0 sticky top-0 z-50 transition-transform duration-200",
        "max-md:fixed max-md:left-0 max-md:top-0",
        isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Surahs</h2>
            <span className="text-xs text-muted">114</span>
          </div>
          <input
            type="text"
            placeholder="Search surah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-surface-alt border border-border rounded-lg outline-none focus:border-primary"
          />
        </div>

        {/* Surah List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 border-b border-border/50 transition-colors",
                currentSurahId === surah.id.toString()
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : "hover:bg-surface-hover"
              )}
            >
              <span className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                currentSurahId === surah.id.toString() ? "bg-primary text-white" : "bg-surface-alt text-muted"
              )}>
                {surah.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{surah.name_simple}</p>
                <p className="text-[11px] text-muted truncate">{surah.translated_name.name} · {surah.verses_count} ayahs</p>
              </div>
              <p className="text-base font-bold text-primary shrink-0" style={{ fontFamily: "var(--font-amiri)" }}>
                {surah.name_arabic}
              </p>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
