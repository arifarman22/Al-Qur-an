"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B7A6E] dark:bg-[#0C1220] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="splash-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L37 20 L57 20 L41 32 L47 52 L30 40 L13 52 L19 32 L3 20 L23 20 Z" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#splash-pattern)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200, duration: 0.6 }}
          className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <span className="text-white text-5xl font-bold" style={{ fontFamily: "var(--font-amiri)" }}>
            ق
          </span>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Al-Quran</h1>
          <p className="text-white/60 text-sm mt-1">The Noble Quran</p>
        </motion.div>

        {/* Quranic Verse */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-white/40 text-xs text-center max-w-xs mt-2"
        >
          &ldquo;Read! In the Name of your Lord Who created.&rdquo;
          <br />
          <span className="text-white/30">— Al-Alaq 96:1</span>
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="flex items-center gap-1.5 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
