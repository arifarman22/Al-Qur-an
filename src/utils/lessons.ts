export interface Lesson {
  id: string;
  module: string;
  title: string;
  description: string;
  content: LessonContent[];
  practiceAyah?: string; // verse_key to practice with
}

export interface LessonContent {
  type: "text" | "arabic" | "table" | "tip" | "audio-practice";
  value: string;
  extra?: string;
}

export const MODULES = [
  { id: "basics", title: "Arabic Basics", icon: "🔤", description: "Learn the Arabic alphabet and sounds" },
  { id: "reading", title: "Reading Skills", icon: "📖", description: "Learn to read Arabic words and short ayahs" },
  { id: "first-surahs", title: "First Surahs", icon: "⭐", description: "Learn the essential short surahs" },
  { id: "tajweed", title: "Tajweed Basics", icon: "🎯", description: "Pronunciation rules for beautiful recitation" },
  { id: "understanding", title: "Understanding", icon: "💡", description: "Learn key Quranic vocabulary and themes" },
];

export const LESSONS: Lesson[] = [
  // Module 1: Arabic Basics
  {
    id: "arabic-alphabet-1",
    module: "basics",
    title: "Arabic Alphabet (Part 1)",
    description: "Learn the first 10 letters of the Arabic alphabet with their sounds.",
    content: [
      { type: "text", value: "Arabic is read from right to left. The alphabet has 28 letters. Let's start with the first 10." },
      { type: "table", value: "ا|Alif|aa (as in father)|ب|Ba|b (as in boy)|ت|Ta|t (as in top)|ث|Tha|th (as in think)|ج|Jim|j (as in jam)|ح|Ha|h (heavy, from throat)|خ|Kha|kh (as in Bach)|د|Dal|d (as in door)|ذ|Dhal|dh (as in this)|ر|Ra|r (rolled r)" },
      { type: "tip", value: "Practice saying each letter out loud. Arabic letters change shape depending on their position in a word (beginning, middle, end, or isolated)." },
    ],
  },
  {
    id: "arabic-alphabet-2",
    module: "basics",
    title: "Arabic Alphabet (Part 2)",
    description: "Learn the next 10 letters.",
    content: [
      { type: "table", value: "ز|Zay|z (as in zoo)|س|Sin|s (as in sun)|ش|Shin|sh (as in ship)|ص|Sad|s (heavy, emphatic)|ض|Dad|d (heavy, emphatic)|ط|Ta|t (heavy, emphatic)|ظ|Dha|dh (heavy, emphatic)|ع|Ain|a (deep throat)|غ|Ghain|gh (gargling sound)|ف|Fa|f (as in fan)" },
      { type: "tip", value: "The 'heavy' letters (Sad, Dad, Ta, Dha) are pronounced with the tongue pressed against the roof of the mouth. This is unique to Arabic." },
    ],
  },
  {
    id: "arabic-alphabet-3",
    module: "basics",
    title: "Arabic Alphabet (Part 3)",
    description: "Learn the final 8 letters.",
    content: [
      { type: "table", value: "ق|Qaf|q (deep in throat)|ك|Kaf|k (as in king)|ل|Lam|l (as in lamp)|م|Mim|m (as in moon)|ن|Nun|n (as in noon)|ه|Ha|h (light, as in hat)|و|Waw|w/oo|ي|Ya|y/ee" },
      { type: "text", value: "Congratulations! You now know all 28 Arabic letters. The next step is learning the vowel marks (harakat) that tell you how to pronounce each letter." },
    ],
  },
  {
    id: "vowel-marks",
    module: "basics",
    title: "Vowel Marks (Harakat)",
    description: "Learn Fatha, Kasra, Damma — the three short vowels.",
    content: [
      { type: "text", value: "Arabic uses small marks above or below letters to indicate vowel sounds. These are essential for reading the Quran correctly." },
      { type: "table", value: "بَ|Fatha (above)|ba — short 'a' sound|بِ|Kasra (below)|bi — short 'i' sound|بُ|Damma (above)|bu — short 'u' sound|بْ|Sukun (above)|b — no vowel, letter is silent" },
      { type: "arabic", value: "بَ بِ بُ — تَ تِ تُ — نَ نِ نُ" },
      { type: "tip", value: "Try reading: بَابٌ (baab = door), كِتَابٌ (kitaab = book). The Quran always has these marks, making it easier to read than regular Arabic text." },
    ],
  },
  {
    id: "tanween-shadda",
    module: "basics",
    title: "Tanween & Shadda",
    description: "Learn double vowels and letter doubling.",
    content: [
      { type: "text", value: "Tanween adds an 'n' sound to the end of a word. Shadda doubles a letter's sound." },
      { type: "table", value: "بً|Fathatan|ban — double fatha|بٍ|Kasratan|bin — double kasra|بٌ|Dammatan|bun — double damma|بّ|Shadda|bb — doubled letter" },
      { type: "arabic", value: "كِتَابًا — عِلْمٍ — رَبٌّ" },
      { type: "tip", value: "Shadda is very important in Quran recitation. For example, رَبّ (Rabb = Lord) — the 'b' is held longer." },
    ],
  },

  // Module 2: Reading Skills
  {
    id: "connecting-letters",
    module: "reading",
    title: "Connecting Letters",
    description: "Learn how Arabic letters join together to form words.",
    content: [
      { type: "text", value: "Most Arabic letters connect to the next letter. Some letters (ا د ذ ر ز و) only connect from the right side." },
      { type: "arabic", value: "ب + س + م = بسم" },
      { type: "arabic", value: "ا + ل + ل + ه = الله" },
      { type: "tip", value: "Practice writing بسم الله (Bismillah) — 'In the name of Allah'. This is the most common phrase in the Quran." },
    ],
  },
  {
    id: "reading-short-words",
    module: "reading",
    title: "Reading Short Words",
    description: "Practice reading common Quranic words.",
    content: [
      { type: "text", value: "Let's read some of the most common words in the Quran:" },
      { type: "table", value: "اللَّهُ|Allah|God|رَبِّ|Rabbi|My Lord|قُلْ|Qul|Say|مِنْ|Min|From|فِي|Fee|In|عَلَى|Ala|Upon|إِنَّ|Inna|Indeed|لَا|La|No/Not" },
      { type: "tip", value: "These 8 words appear thousands of times in the Quran. Recognizing them will help you follow along during recitation." },
    ],
  },
  {
    id: "reading-bismillah",
    module: "reading",
    title: "Reading the Bismillah",
    description: "Read and understand بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    content: [
      { type: "arabic", value: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
      { type: "text", value: "Bis-mil-laa-hir-Rah-maa-nir-Ra-heem" },
      { type: "table", value: "بِسْمِ|Bismi|In the name of|اللَّهِ|Allah|God|الرَّحْمَٰنِ|Ar-Rahman|The Most Gracious|الرَّحِيمِ|Ar-Raheem|The Most Merciful" },
      { type: "tip", value: "This phrase opens 113 of the 114 surahs. It's the first thing you say before reading any surah (except Surah At-Tawbah)." },
      { type: "audio-practice", value: "1:1" },
    ],
    practiceAyah: "1:1",
  },

  // Module 3: First Surahs
  {
    id: "surah-fatiha",
    module: "first-surahs",
    title: "Surah Al-Fatihah",
    description: "Learn the opening chapter — recited in every prayer.",
    content: [
      { type: "text", value: "Al-Fatihah (The Opener) is the most important surah. It's recited in every unit of prayer (salah). It has 7 ayahs." },
      { type: "arabic", value: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" },
      { type: "text", value: "Translation: In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us along the Straight Path — the path of those You have blessed, not those who have earned anger, nor those who have gone astray." },
      { type: "tip", value: "Listen to the audio and try to follow along. Start by memorizing one ayah at a time. Most Muslims memorize this surah first." },
      { type: "audio-practice", value: "1:1" },
    ],
    practiceAyah: "1:1",
  },
  {
    id: "surah-ikhlas",
    module: "first-surahs",
    title: "Surah Al-Ikhlas (112)",
    description: "The surah of pure monotheism — equal to 1/3 of the Quran.",
    content: [
      { type: "text", value: "Al-Ikhlas (Sincerity) is one of the shortest surahs but carries immense weight. The Prophet ﷺ said it equals one-third of the Quran in reward." },
      { type: "arabic", value: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ" },
      { type: "text", value: "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent." },
      { type: "audio-practice", value: "112:1" },
    ],
    practiceAyah: "112:1",
  },
  {
    id: "surah-falaq-nas",
    module: "first-surahs",
    title: "Surah Al-Falaq & An-Nas (113-114)",
    description: "The two surahs of protection — recited for seeking refuge.",
    content: [
      { type: "text", value: "These two surahs are known as Al-Mu'awwidhatayn (the two protectors). They are recited for protection from evil." },
      { type: "arabic", value: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِن شَرِّ مَا خَلَقَ" },
      { type: "text", value: "Al-Falaq: Say, I seek refuge in the Lord of daybreak, from the evil of that which He created..." },
      { type: "arabic", value: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلَٰهِ النَّاسِ" },
      { type: "text", value: "An-Nas: Say, I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind..." },
      { type: "tip", value: "These surahs are recited 3 times each after Fajr and Maghrib prayers, and once after other prayers." },
      { type: "audio-practice", value: "113:1" },
    ],
    practiceAyah: "113:1",
  },

  // Module 4: Tajweed Basics
  {
    id: "tajweed-intro",
    module: "tajweed",
    title: "What is Tajweed?",
    description: "Introduction to the science of Quran recitation.",
    content: [
      { type: "text", value: "Tajweed (تجويد) means 'to beautify' or 'to improve'. It's the set of rules for pronouncing the Quran correctly, exactly as it was revealed to Prophet Muhammad ﷺ." },
      { type: "text", value: "Learning tajweed is considered obligatory (fard) for every Muslim who reads the Quran. The goal is to recite each letter from its correct point of articulation with its proper characteristics." },
      { type: "tip", value: "Don't worry about perfecting tajweed immediately. Start by reading slowly and correctly, then gradually improve your pronunciation." },
    ],
  },
  {
    id: "tajweed-noon-meem",
    module: "tajweed",
    title: "Noon & Meem Rules",
    description: "Learn Ikhfa, Idgham, Iqlab, and Izhar.",
    content: [
      { type: "text", value: "When Noon Sakinah (نْ) or Tanween appears before certain letters, special rules apply:" },
      { type: "table", value: "Izhar (Clear)|نْ before throat letters (ء ه ع ح غ خ)|Pronounce the noon clearly|Idgham (Merge)|نْ before ي ن م و ل ر|Merge the noon into the next letter|Iqlab (Convert)|نْ before ب|Convert noon to meem sound|Ikhfa (Hide)|نْ before remaining 15 letters|Nasalize between noon and next letter" },
      { type: "arabic", value: "مِنْ خَيْرٍ — Izhar (clear noon before خ)" },
      { type: "arabic", value: "مِن يَّعْمَلْ — Idgham (noon merges into ي)" },
      { type: "arabic", value: "مِن بَعْدِ — Iqlab (noon becomes meem before ب)" },
      { type: "tip", value: "Listen carefully to reciters like Mishary Alafasy — you'll hear these rules applied naturally." },
    ],
  },
  {
    id: "tajweed-madd",
    module: "tajweed",
    title: "Madd (Elongation)",
    description: "Learn when and how to stretch vowel sounds.",
    content: [
      { type: "text", value: "Madd means to stretch a vowel sound. There are different types based on how long you hold the sound:" },
      { type: "table", value: "Natural Madd|2 counts|ا after fatha, و after damma, ي after kasra|Connected Madd|4-5 counts|Madd letter followed by hamza in same word|Separated Madd|4-5 counts|Madd letter at end of word, hamza at start of next|Obligatory Madd|6 counts|Madd letter followed by shadda" },
      { type: "arabic", value: "قَالَ — natural madd (2 counts on the alif)" },
      { type: "arabic", value: "جَاءَ — connected madd (4-5 counts, alif before hamza)" },
      { type: "tip", value: "A 'count' is roughly the time it takes to open or close a finger. Practice with a metronome or by tapping." },
    ],
  },

  // Module 5: Understanding
  {
    id: "quran-structure",
    module: "understanding",
    title: "Structure of the Quran",
    description: "Understand how the Quran is organized.",
    content: [
      { type: "text", value: "The Quran has 114 surahs (chapters), 6,236 ayahs (verses), and 30 juz (parts). It was revealed over 23 years." },
      { type: "table", value: "Meccan Surahs|86 surahs|Revealed in Makkah — focus on faith, afterlife, stories of prophets|Medinan Surahs|28 surahs|Revealed in Madinah — focus on laws, community, social guidance|Longest Surah|Al-Baqarah (2)|286 ayahs|Shortest Surah|Al-Kawthar (108)|3 ayahs" },
      { type: "tip", value: "The surahs are NOT arranged in chronological order. They are arranged by divine instruction, with longer surahs generally first." },
    ],
  },
  {
    id: "key-vocabulary",
    module: "understanding",
    title: "50 Most Common Quran Words",
    description: "Learn the words that make up 50% of the Quran.",
    content: [
      { type: "text", value: "Just 50 words make up roughly half of the entire Quran. Learning these gives you a huge head start in understanding." },
      { type: "table", value: "اللَّه|Allah|God|رَبّ|Rabb|Lord|قَالَ|Qala|He said|كَانَ|Kana|He was|عَلِمَ|Alima|He knew|إِنَّ|Inna|Indeed|الَّذِي|Alladhi|The one who|مَا|Ma|What/Not|لَا|La|No/Not|هُوَ|Huwa|He" },
      { type: "table", value: "مِنْ|Min|From|فِي|Fi|In|عَلَى|Ala|Upon|إِلَى|Ila|To|أَنَّ|Anna|That|هَذَا|Hadha|This|كُلّ|Kull|Every/All|بَعْد|Ba'd|After|قَبْل|Qabl|Before|يَوْم|Yawm|Day" },
      { type: "tip", value: "Try to spot these words when reading any surah. You'll be surprised how often they appear!" },
    ],
  },
  {
    id: "themes-quran",
    module: "understanding",
    title: "Major Themes of the Quran",
    description: "Understand the core messages of the Quran.",
    content: [
      { type: "text", value: "The Quran revolves around several interconnected themes:" },
      { type: "table", value: "Tawheed|Oneness of Allah — the central message|Risalah|Prophethood — stories and lessons from 25 prophets|Akhirah|The Hereafter — Day of Judgment, Paradise, Hellfire|Guidance|Laws, ethics, and moral principles for daily life|Stories|Historical narratives for reflection and learning|Nature|Signs of Allah in creation as proof of His existence" },
      { type: "tip", value: "Every surah connects back to Tawheed (monotheism) in some way. Keep this in mind as you read — it helps you see the bigger picture." },
    ],
  },
];

export function getLessonsByModule(moduleId: string): Lesson[] {
  return LESSONS.filter((l) => l.module === moduleId);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getNextLesson(currentId: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.id === currentId);
  return idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : undefined;
}
