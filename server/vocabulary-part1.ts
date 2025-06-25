// QuranicFlow Vocabulary Database - Part 1 of 2
// Authentic Quranic Arabic vocabulary for complete comprehension
// This file contains words 1-800 to prevent file size loading issues

export interface QuranicWord {
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningUrdu: string;
  frequency: number;
  difficulty: number;
  category: string;
  chapter: number;
  verse: number | null;
  rootWord: string;
  examples: string[];
  source: string;
}

export const VOCABULARY_PART1: QuranicWord[] = [
  {
    arabic: "اللَّهُ",
    transliteration: "Allah",
    meaning: "Allah - The One and Only God",
    meaningUrdu: "اللہ - واحد اور یکتا خدا",
    frequency: 2699,
    difficulty: 1,
    category: "divine",
    chapter: 1,
    verse: 1,
    rootWord: "أ ل ه",
    examples: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"],
    source: "Al-Fatiha - Divine Name"
  },
  {
    arabic: "الرَّحْمَٰنِ",
    transliteration: "ar-Rahman",
    meaning: "The Most Merciful - All-encompassing mercy",
    meaningUrdu: "رحمان - تمام جہانوں پر رحم کرنے والا",
    frequency: 169,
    difficulty: 1,
    category: "attributes",
    chapter: 1,
    verse: 1,
    rootWord: "ر ح م",
    examples: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"],
    source: "Al-Fatiha - Divine Attribute"
  },
  {
    arabic: "الرَّحِيمِ",
    transliteration: "ar-Raheem",
    meaning: "The Most Compassionate - Especially merciful to believers",
    meaningUrdu: "رحیم - مومنوں پر خاص رحم کرنے والا",
    frequency: 227,
    difficulty: 1,
    category: "attributes",
    chapter: 1,
    verse: 1,
    rootWord: "ر ح م",
    examples: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"],
    source: "Al-Fatiha - Divine Attribute"
  },
  {
    arabic: "الْحَمْدُ",
    transliteration: "al-hamdu",
    meaning: "All praise - Complete gratitude and appreciation",
    meaningUrdu: "حمد - مکمل تعریف اور شکر",
    frequency: 63,
    difficulty: 1,
    category: "worship",
    chapter: 1,
    verse: 2,
    rootWord: "ح م د",
    examples: ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"],
    source: "Al-Fatiha - Praise"
  },
  {
    arabic: "رَبِّ",
    transliteration: "rabbi",
    meaning: "Lord - Master, Sustainer, and Nurturer",
    meaningUrdu: "رب - مالک، پالنے والا اور پرورش کرنے والا",
    frequency: 962,
    difficulty: 1,
    category: "divine",
    chapter: 1,
    verse: 2,
    rootWord: "ر ب ب",
    examples: ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"],
    source: "Al-Fatiha - Divine Lordship"
  },
  {
    arabic: "الْعَالَمِينَ",
    transliteration: "al-aalameen",
    meaning: "All the worlds - All creation and realms of existence",
    meaningUrdu: "تمام جہان - تمام مخلوقات اور وجود کے درجے",
    frequency: 73,
    difficulty: 2,
    category: "creation",
    chapter: 1,
    verse: 2,
    rootWord: "ع ل م",
    examples: ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"],
    source: "Al-Fatiha - Creation"
  },
  {
    arabic: "مَالِكِ",
    transliteration: "maaliki",
    meaning: "Master - Owner and Sovereign",
    meaningUrdu: "مالک - مختار اور بادشاہ",
    frequency: 15,
    difficulty: 1,
    category: "divine",
    chapter: 1,
    verse: 4,
    rootWord: "م ل ك",
    examples: ["مَالِكِ يَوْمِ الدِّينِ"],
    source: "Al-Fatiha - Divine Sovereignty"
  },
  {
    arabic: "يَوْمِ",
    transliteration: "yawmi",
    meaning: "Day - The Day of Judgment",
    meaningUrdu: "دن - قیامت کا دن",
    frequency: 405,
    difficulty: 1,
    category: "time",
    chapter: 1,
    verse: 4,
    rootWord: "ي و م",
    examples: ["مَالِكِ يَوْمِ الدِّينِ"],
    source: "Al-Fatiha - Day of Judgment"
  },
  {
    arabic: "الدِّينِ",
    transliteration: "ad-deen",
    meaning: "The Religion - The Day of Recompense and Judgment",
    meaningUrdu: "دین - بدلہ اور انصاف کا دن",
    frequency: 79,
    difficulty: 1,
    category: "faith",
    chapter: 1,
    verse: 4,
    rootWord: "د ي ن",
    examples: ["مَالِكِ يَوْمِ الدِّينِ"],
    source: "Al-Fatiha - Religion and Judgment"
  },
  {
    arabic: "إِيَّاكَ",
    transliteration: "iyyaaka",
    meaning: "You alone - Exclusively You (Allah)",
    meaningUrdu: "صرف تجھی - صرف تو (اللہ)",
    frequency: 19,
    difficulty: 2,
    category: "worship",
    chapter: 1,
    verse: 5,
    rootWord: "أ ي ي",
    examples: ["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"],
    source: "Al-Fatiha - Exclusive worship"
  },
  {
    arabic: "نَعْبُدُ",
    transliteration: "na'budu",
    meaning: "We worship - We serve and submit",
    meaningUrdu: "ہم عبادت کرتے ہیں - ہم خدمت اور تابعداری کرتے ہیں",
    frequency: 279,
    difficulty: 1,
    category: "worship",
    chapter: 1,
    verse: 5,
    rootWord: "ع ب د",
    examples: ["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"],
    source: "Al-Fatiha - Worship"
  },
  {
    arabic: "نَسْتَعِينُ",
    transliteration: "nasta'een",
    meaning: "We seek help - We ask for assistance",
    meaningUrdu: "ہم مدد مانگتے ہیں - ہم امداد چاہتے ہیں",
    frequency: 15,
    difficulty: 2,
    category: "worship",
    chapter: 1,
    verse: 5,
    rootWord: "ع و ن",
    examples: ["إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"],
    source: "Al-Fatiha - Seeking help"
  },
  {
    arabic: "اهْدِنَا",
    transliteration: "ihdinaa",
    meaning: "Guide us - Show us the way",
    meaningUrdu: "ہمیں ہدایت دے - ہمیں راستہ دکھا",
    frequency: 317,
    difficulty: 1,
    category: "guidance",
    chapter: 1,
    verse: 6,
    rootWord: "ه د ي",
    examples: ["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"],
    source: "Al-Fatiha - Guidance"
  },
  {
    arabic: "الصِّرَاطَ",
    transliteration: "as-siraat",
    meaning: "The path - The way or road",
    meaningUrdu: "راستہ - طریقہ یا راہ",
    frequency: 45,
    difficulty: 1,
    category: "guidance",
    chapter: 1,
    verse: 6,
    rootWord: "ص ر ط",
    examples: ["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"],
    source: "Al-Fatiha - Straight path"
  },
  {
    arabic: "الْمُسْتَقِيمَ",
    transliteration: "al-mustaqeem",
    meaning: "The straight - The direct and right path",
    meaningUrdu: "سیدھا - براہ راست اور صحیح راستہ",
    frequency: 56,
    difficulty: 2,
    category: "guidance",
    chapter: 1,
    verse: 6,
    rootWord: "ق و م",
    examples: ["اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"],
    source: "Al-Fatiha - Straightness"
  }
];