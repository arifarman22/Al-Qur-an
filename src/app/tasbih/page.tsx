"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/utils/utils";
import { RotateCcw, Plus, Minus, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-16 pb-12 bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            Daily Remembrance
          </div>
          <h1 className="text-3xl font-bold mb-2">Tasbih Counter</h1>
          <p className="text-muted text-sm max-w-md mx-auto">Digital dhikr counter designed for your daily spiritual remembrance and meditation.</p>
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto -mt-8 relative z-10">
        {/* Preset Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => selectPreset(i)}
              className={cn(
                "card p-4 text-left transition-all relative overflow-hidden group",
                selected === i ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/30"
              )}>
              <div className="relative z-10">
                <p className="text-lg font-bold text-primary group-hover:scale-105 transition-transform" style={{ fontFamily: "var(--font-amiri)" }}>{p.label}</p>
                <p className="text-[10px] text-muted font-bold tracking-tight mt-1">{p.transliteration} · {p.target}x</p>
              </div>
              {selected === i && <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-primary/10 rounded-full blur-xl" />}
            </button>
          ))}
        </div>

        {/* Counter Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-10 md:p-16 text-center mb-8 shadow-2xl shadow-primary/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />
          
          <div className="relative z-10">
            <p className="text-3xl md:text-4xl font-bold mb-2 text-primary" style={{ fontFamily: "var(--font-amiri)" }}>{preset.label}</p>
            <p className="text-sm text-muted font-medium italic mb-10">{preset.meaning}</p>

            {/* Circular Progress Container */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mb-10 group">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="3" className="stroke-primary/10" />
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                  className={isComplete ? "stroke-accent" : "stroke-primary"}
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} ${283 - progress * 2.83}`}
                  style={{ transition: "stroke-dasharray 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.p
                  key={count}
                  initial={pressed ? { scale: 1.3, y: -5 } : {}}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-7xl font-black tracking-tighter text-foreground"
                >
                  {count}
                </motion.p>
                <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mt-2">of {preset.target}</p>
              </div>
            </div>

            {isComplete && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-accent text-sm font-bold mb-6">
                <Sparkles size={14} />
                <span>Target reached! MashaAllah</span>
              </motion.div>
            )}

            {/* Tap Button */}
            <div className="flex flex-col items-center gap-6">
              <button onClick={increment}
                className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold hover:bg-primary-dark hover:scale-105 active:scale-90 transition-all shadow-xl shadow-primary/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus size={40} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-6">
                <button onClick={() => setCount((c) => Math.max(0, c - 1))}
                  className="p-3 rounded-2xl bg-surface-alt text-muted hover:text-primary hover:bg-primary/10 transition-all border border-border"
                  title="Decrease">
                  <Minus size={20} />
                </button>
                <button onClick={reset}
                  className="p-3 rounded-2xl bg-surface-alt text-muted hover:text-accent hover:bg-accent/10 transition-all border border-border"
                  title="Reset Counter">
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center p-4 bg-surface rounded-2xl border border-border">
          <p className="text-xs font-bold text-muted uppercase tracking-widest">Lifetime Remembrance: <span className="text-primary font-black ml-1">{totalAll.toLocaleString()}</span></p>
        </div>
      
      </div>
      <Footer />
    </main>
  );
}
