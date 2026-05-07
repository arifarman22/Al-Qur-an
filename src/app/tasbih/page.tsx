"use client";

import { useEffect, useState } from "react";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";
import { RotateCcw, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const PRESETS = [
  { label: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { label: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah", target: 33 },
  { label: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
  { label: "لَا إِلَٰهَ إِلَّا اللَّهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah", target: 100 },
  { label: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness from Allah", target: 100 },
  { label: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", transliteration: "Durood", meaning: "Blessings upon the Prophet ﷺ", target: 100 },
];

export default function TasbihPage() {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasbih-total");
    if (saved) setTotalAll(parseInt(saved) || 0);
  }, []);

  const preset = PRESETS[selected];
  const progress = Math.min((count / preset.target) * 100, 100);
  const isComplete = count >= preset.target;

  const increment = () => {
    setCount((c) => c + 1);
    setTotalAll((t) => { const n = t + 1; localStorage.setItem("tasbih-total", n.toString()); return n; });
    setPressed(true);
    setTimeout(() => setPressed(false), 100);
  };

  const reset = () => setCount(0);

  const selectPreset = (i: number) => { setSelected(i); setCount(0); };

  return (
    <QuranReaderLayout>
      <div className="p-6 max-w-3xl mx-auto">
      
        <h1 className="text-2xl font-bold mb-2">Tasbih Counter</h1>
        <p className="text-muted text-sm mb-8">Digital dhikr counter for daily remembrance.</p>

        {/* Preset Selector */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => selectPreset(i)}
              className={`card p-3 text-left transition-all ${selected === i ? "ring-1 ring-primary border-primary/40" : "hover:border-primary/20"}`}>
              <p className="text-base font-bold" style={{ fontFamily: "var(--font-amiri)" }}>{p.label}</p>
              <p className="text-[11px] text-muted">{p.transliteration} · {p.target}x</p>
            </button>
          ))}
        </div>

        {/* Counter Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center mb-6"
        >
          <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-amiri)" }}>{preset.label}</p>
          <p className="text-xs text-muted mb-6">{preset.meaning}</p>

          {/* Circular Progress */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-border" />
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                className={isComplete ? "stroke-accent" : "stroke-primary"}
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} ${283 - progress * 2.83}`}
                style={{ transition: "stroke-dasharray 0.2s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.p
                key={count}
                initial={pressed ? { scale: 1.2 } : {}}
                animate={{ scale: 1 }}
                className="text-5xl font-bold"
              >
                {count}
              </motion.p>
              <p className="text-xs text-muted">/ {preset.target}</p>
            </div>
          </div>

          {isComplete && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent text-sm font-medium mb-4">
              ✓ Target reached! MashaAllah
            </motion.p>
          )}

          {/* Tap Button */}
          <button onClick={increment}
            className="w-20 h-20 bg-primary text-white rounded-full mx-auto flex items-center justify-center text-2xl font-bold hover:bg-primary-dark active:scale-95 transition-all shadow-lg">
            <Plus size={32} />
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={() => setCount((c) => Math.max(0, c - 1))}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
              <Minus size={18} />
            </button>
            <button onClick={reset}
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
              <RotateCcw size={18} />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted">Lifetime total: {totalAll.toLocaleString()} dhikr</p>
      
      </div>
    </QuranReaderLayout>
  );
}
