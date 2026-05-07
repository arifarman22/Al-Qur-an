"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

interface PrayerData {
  timings: Record<string, string>;
  date: { hijri: { date: string; month: { en: string; ar: string; number: number }; year: string; day: string; weekday: { en: string } }; gregorian: { date: string; month: { en: string; number: number }; year: string; day: string; weekday: { en: string } } };
  meta: { method: { name: string } };
}

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const MAIN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const PRAYER_INFO = {
  Fajr: { meaning: "Dawn Prayer", rakats: "2 Sunnah + 2 Fard", icon: "🌅" },
  Dhuhr: { meaning: "Noon Prayer", rakats: "4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl", icon: "☀️" },
  Asr: { meaning: "Afternoon Prayer", rakats: "4 Sunnah + 4 Fard", icon: "🌤️" },
  Maghrib: { meaning: "Sunset Prayer", rakats: "3 Fard + 2 Sunnah + 2 Nafl", icon: "🌅" },
  Isha: { meaning: "Night Prayer", rakats: "4 Sunnah + 4 Fard + 2 Sunnah + 2 Nafl + 3 Witr", icon: "🌙" },
};

const FORBIDDEN_TIMES = [
  { name: "After Fajr", desc: "From Fajr prayer until sunrise", reason: "No voluntary prayer allowed" },
  { name: "At Sunrise", desc: "From sunrise until 15-20 minutes after", reason: "Sun is rising between horns of Shaytan" },
  { name: "At Zenith (Zawal)", desc: "When sun is at its highest point", reason: "Brief period before Dhuhr" },
  { name: "After Asr", desc: "From Asr prayer until sunset", reason: "No voluntary prayer allowed" },
  { name: "At Sunset", desc: "When the sun is setting", reason: "Sun is setting between horns of Shaytan" },
];

const ISLAMIC_EVENTS = [
  { name: "Ramadan", hijriMonth: 9, day: 1, desc: "Month of fasting begins" },
  { name: "Laylatul Qadr", hijriMonth: 9, day: 27, desc: "Night of Power" },
  { name: "Eid ul-Fitr", hijriMonth: 10, day: 1, desc: "Festival of Breaking Fast" },
  { name: "Dhul Hijjah Begins", hijriMonth: 12, day: 1, desc: "Month of Hajj" },
  { name: "Day of Arafah", hijriMonth: 12, day: 9, desc: "Best day for fasting" },
  { name: "Eid ul-Adha", hijriMonth: 12, day: 10, desc: "Festival of Sacrifice" },
  { name: "Islamic New Year", hijriMonth: 1, day: 1, desc: "1st Muharram" },
  { name: "Ashura", hijriMonth: 1, day: 10, desc: "Day of Ashura" },
  { name: "Mawlid an-Nabi", hijriMonth: 3, day: 12, desc: "Birth of Prophet Muhammad ﷺ" },
  { name: "Isra & Mi'raj", hijriMonth: 7, day: 27, desc: "Night Journey" },
  { name: "Shab-e-Barat", hijriMonth: 8, day: 15, desc: "Night of Fortune" },
];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function PrayerTimesPage() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [location, setLocation] = useState("Dhaka, Bangladesh");

  useEffect(() => {
    fetch("/api/prayer-times?lat=23.8103&lng=90.4125&method=1")
      .then((r) => r.json())
      .then((j) => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find current and next prayer
  let currentPrayer = "Isha";
  let nextPrayer = "Fajr";
  let nextPrayerTime = "";
  let remainingMinutes = 0;

  if (data) {
    const prayerTimes = MAIN_PRAYERS.map((p) => ({ name: p, minutes: timeToMinutes(data.timings[p]) }));
    for (let i = 0; i < prayerTimes.length; i++) {
      if (currentMinutes < prayerTimes[i].minutes) {
        nextPrayer = prayerTimes[i].name;
        nextPrayerTime = data.timings[prayerTimes[i].name];
        remainingMinutes = prayerTimes[i].minutes - currentMinutes;
        currentPrayer = i > 0 ? prayerTimes[i - 1].name : "Isha";
        break;
      }
      if (i === prayerTimes.length - 1) {
        currentPrayer = "Isha";
        nextPrayer = "Fajr";
        nextPrayerTime = data.timings.Fajr;
        remainingMinutes = (24 * 60 - currentMinutes) + timeToMinutes(data.timings.Fajr);
      }
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Prayer Times</h1>
          <p className="text-muted text-sm">{location} · {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 card animate-pulse" />)}
          </div>
        ) : data && (
          <>
            {/* ═══ CURRENT PRAYER + COUNTDOWN ═══ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Current Prayer</p>
                  <h2 className="text-3xl font-bold text-primary">{currentPrayer}</h2>
                  <p className="text-sm text-muted mt-1">Next: {nextPrayer} at {nextPrayerTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted mb-1">Time Remaining</p>
                  <p className="text-4xl font-bold text-primary tabular-nums">{formatCountdown(remainingMinutes)}</p>
                  <p className="text-xs text-muted mt-1">until {nextPrayer}</p>
                </div>
              </div>
            </motion.div>

            {/* ═══ DAILY PRAYER CARDS ═══ */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Daily Prayer Times</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MAIN_PRAYERS.map((prayer, i) => {
                  const time = data.timings[prayer];
                  const info = PRAYER_INFO[prayer];
                  const isActive = currentPrayer === prayer;
                  const isNext = nextPrayer === prayer;
                  return (
                    <motion.div key={prayer} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={cn("card p-4 transition-all", isActive && "border-primary/40 bg-primary/5", isNext && "border-accent/40 bg-accent/5")}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{info.icon}</span>
                          <div>
                            <p className={cn("text-sm font-bold", isActive && "text-primary", isNext && "text-accent")}>{prayer}</p>
                            <p className="text-[10px] text-muted">{info.meaning}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-lg font-bold tabular-nums", isActive && "text-primary", isNext && "text-accent")}>{time}</p>
                          {isActive && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">NOW</span>}
                          {isNext && <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-medium">NEXT</span>}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted">{info.rakats}</p>
                    </motion.div>
                  );
                })}
                {/* Sunrise card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌄</span>
                      <div>
                        <p className="text-sm font-bold">Sunrise</p>
                        <p className="text-[10px] text-muted">Ishraq after 15min</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold tabular-nums">{data.timings.Sunrise}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ═══ PRAYER INFORMATION ═══ */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Prayer Information</h2>
              <div className="card overflow-hidden divide-y divide-border">
                {MAIN_PRAYERS.map((prayer) => {
                  const info = PRAYER_INFO[prayer];
                  return (
                    <div key={prayer} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{info.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{prayer}</p>
                          <p className="text-[11px] text-muted">{info.meaning}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted text-right max-w-[200px]">{info.rakats}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ═══ FORBIDDEN PRAYER TIMES ═══ */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Forbidden Prayer Times</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {FORBIDDEN_TIMES.map((ft, i) => (
                  <motion.div key={ft.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="card p-4 border-l-[3px] border-l-red-500/50">
                    <p className="text-sm font-bold text-red-500/80 mb-1">{ft.name}</p>
                    <p className="text-xs text-muted mb-2">{ft.desc}</p>
                    <p className="text-[10px] text-muted/70 italic">{ft.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ═══ ISLAMIC CALENDAR ═══ */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Islamic Calendar</h2>
              <div className="card p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Hijri Date</p>
                    <p className="text-2xl font-bold">{data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH</p>
                    <p className="text-lg mt-1" style={{ fontFamily: "var(--font-amiri)" }}>{data.date.hijri.month.ar}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Gregorian</p>
                    <p className="text-lg font-bold">{data.date.gregorian.day} {data.date.gregorian.month.en} {data.date.gregorian.year}</p>
                    <p className="text-sm text-muted">{data.date.gregorian.weekday.en}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ UPCOMING ISLAMIC EVENTS ═══ */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Upcoming Islamic Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ISLAMIC_EVENTS.map((event, i) => {
                  const currentHijriMonth = data.date.hijri.month.number;
                  const currentHijriDay = parseInt(data.date.hijri.day);
                  const isUpcoming = event.hijriMonth > currentHijriMonth || (event.hijriMonth === currentHijriMonth && event.day >= currentHijriDay);
                  const isToday = event.hijriMonth === currentHijriMonth && event.day === currentHijriDay;

                  return (
                    <motion.div key={event.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className={cn("card p-4 transition-all", isToday && "border-primary/40 bg-primary/5", !isUpcoming && "opacity-50")}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={cn("text-sm font-bold", isToday && "text-primary")}>{event.name}</p>
                        {isToday && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">TODAY</span>}
                      </div>
                      <p className="text-xs text-muted mb-1">{event.desc}</p>
                      <p className="text-[10px] text-muted/70">{event.day} {["", "Muharram", "Safar", "Rabi ul-Awal", "Rabi ul-Thani", "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhul Qa'dah", "Dhul Hijjah"][event.hijriMonth]}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
