"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import Container from "@/components/ui/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Copy, Check, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DUAS = [
  {
    category: "Guidance",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhab an-nar",
    translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    reference: "2:201",
  },
  {
    category: "Forgiveness",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana zalamna anfusana wa il-lam taghfir lana wa tarhamna lanakunanna minal-khasireen",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    reference: "7:23",
  },
  {
    category: "Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge.",
    reference: "20:114",
  },
  {
    category: "Patience",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafireen",
    translation: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "2:250",
  },
  {
    category: "Protection",
    arabic: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ",
    transliteration: "Rabbi a'udhu bika min hamazatish-shayateen wa a'udhu bika rabbi an yahdurun",
    translation: "My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me.",
    reference: "23:97-98",
  },
  {
    category: "Parents",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani sagheera",
    translation: "My Lord, have mercy upon them as they brought me up when I was small.",
    reference: "17:24",
  },
  {
    category: "Ease",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbish-rahli sadri wa yassirli amri",
    translation: "My Lord, expand for me my chest and ease for me my task.",
    reference: "20:25-26",
  },
  {
    category: "Steadfastness",
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah",
    translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.",
    reference: "3:8",
  },
  {
    category: "Gratitude",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ",
    transliteration: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya",
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.",
    reference: "27:19",
  },
  {
    category: "Family",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqeena imama",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us a leader for the righteous.",
    reference: "25:74",
  },
];

export default function DuasPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { arabicFontSize, arabicFont } = useSettingsStore();
  const router = useRouter();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => { if (!authLoading && !user) router.replace("/login"); }, [user, authLoading, router]);
  if (authLoading || !user) return <div className="min-h-screen bg-surface-alt" />;

  const categories = ["All", ...Array.from(new Set(DUAS.map((d) => d.category)))];
  const filtered = filter === "All" ? DUAS : DUAS.filter((d) => d.category === filter);

  const handleCopy = (idx: number) => {
    const d = filtered[idx];
    navigator.clipboard.writeText(`${d.arabic}\n\n${d.transliteration}\n\n${d.translation}\n\n— Quran ${d.reference}`);
    setCopiedIdx(idx);
    toast.success("Dua copied");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <main className="min-h-screen bg-surface-alt">
      <Navbar />
      <Container className="py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Quranic Duas</h1>
          <p className="text-muted text-sm">Essential supplications from the Noble Quran.</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === c ? "bg-primary text-white" : "bg-surface border border-border text-muted hover:border-primary/30"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((dua, i) => (
            <motion.div key={dua.reference} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{dua.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted flex items-center gap-1"><BookOpen size={12} />{dua.reference}</span>
                  <button onClick={() => handleCopy(i)} className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                    {copiedIdx === i ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <p className="text-right leading-[2.2] mb-3" dir="rtl"
                style={{ fontSize: `${Math.min(arabicFontSize, 36)}px`, fontFamily: arabicFont === "amiri" ? "var(--font-amiri)" : "var(--font-scheherazade)" }}>
                {dua.arabic}
              </p>

              <p className="text-sm italic text-primary/80 mb-2">{dua.transliteration}</p>
              <p className="text-sm text-muted leading-relaxed">{dua.translation}</p>
            </motion.div>
          ))}
        </div>
      </Container>
      <Footer />
    </main>
  );
}
