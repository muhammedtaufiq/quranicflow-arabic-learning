export interface QuranicVerse {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface WordFrequency {
  word: string;
  frequency: number;
  verses: QuranicVerse[];
}

// High-frequency Quranic words with their occurrence data
export const HIGH_FREQUENCY_WORDS = [
  {
    arabic: "اللَّهُ",
    transliteration: "Allah",
    meaning: "Allah (God)",
    frequency: 2697,
    difficulty: 1,
    category: "divine",
    rootWord: "ا ل ه"
  },
  {
    arabic: "الَّذِينَ",
    transliteration: "alladhina",
    meaning: "those who",
    frequency: 1270,
    difficulty: 2,
    category: "pronouns",
    rootWord: "ا ل ل"
  },
  {
    arabic: "فِي",
    transliteration: "fi",
    meaning: "in, on",
    frequency: 1221,
    difficulty: 1,
    category: "prepositions",
    rootWord: "ف ي ي"
  },
  {
    arabic: "مِن",
    transliteration: "min",
    meaning: "from, of",
    frequency: 1161,
    difficulty: 1,
    category: "prepositions",
    rootWord: "م ن ن"
  },
  {
    arabic: "إِلَىٰ",
    transliteration: "ila",
    meaning: "to, towards",
    frequency: 746,
    difficulty: 1,
    category: "prepositions",
    rootWord: "ا ل ي"
  },
  {
    arabic: "عَلَىٰ",
    transliteration: "ala",
    meaning: "on, upon",
    frequency: 666,
    difficulty: 1,
    category: "prepositions",
    rootWord: "ع ل ي"
  },
  {
    arabic: "لَا",
    transliteration: "la",
    meaning: "no, not",
    frequency: 663,
    difficulty: 1,
    category: "particles",
    rootWord: "ل ا ا"
  },
  {
    arabic: "كَانَ",
    transliteration: "kana",
    meaning: "was, were",
    frequency: 496,
    difficulty: 2,
    category: "verbs",
    rootWord: "ك و ن"
  },
  {
    arabic: "قَالَ",
    transliteration: "qala",
    meaning: "said, spoke",
    frequency: 432,
    difficulty: 2,
    category: "verbs",
    rootWord: "ق و ل"
  },
  {
    arabic: "النَّاسِ",
    transliteration: "an-nas",
    meaning: "the people",
    frequency: 368,
    difficulty: 2,
    category: "nouns",
    rootWord: "ن و س"
  }
];

export const SURAH_AL_FATIHA = {
  number: 1,
  name: "Al-Fatiha",
  verses: [
    {
      ayah: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahi'r-rahmani'r-rahim",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
      words: [
        { arabic: "بِسْمِ", meaning: "in the name of", rootWord: "س م و" },
        { arabic: "اللَّهِ", meaning: "Allah", rootWord: "ا ل ه" },
        { arabic: "الرَّحْمَٰنِ", meaning: "the Most Gracious", rootWord: "ر ح م" },
        { arabic: "الرَّحِيمِ", meaning: "the Most Merciful", rootWord: "ر ح م" }
      ]
    },
    {
      ayah: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      transliteration: "Alhamdu lillahi rabbi'l-alamin",
      translation: "Praise be to Allah, Lord of all the worlds",
      words: [
        { arabic: "الْحَمْدُ", meaning: "praise", rootWord: "ح م د" },
        { arabic: "لِلَّهِ", meaning: "to Allah", rootWord: "ا ل ه" },
        { arabic: "رَبِّ", meaning: "Lord", rootWord: "ر ب ب" },
        { arabic: "الْعَالَمِينَ", meaning: "the worlds", rootWord: "ع ل م" }
      ]
    },
    {
      ayah: 3,
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Ar-rahmani'r-rahim",
      translation: "The Most Gracious, the Most Merciful",
      words: [
        { arabic: "الرَّحْمَٰنِ", meaning: "the Most Gracious", rootWord: "ر ح م" },
        { arabic: "الرَّحِيمِ", meaning: "the Most Merciful", rootWord: "ر ح م" }
      ]
    }
  ]
};

export function getWordsForDifficulty(difficulty: number, count: number): any[] {
  return HIGH_FREQUENCY_WORDS
    .filter(word => word.difficulty === difficulty)
    .slice(0, count)
    .map(word => ({
      ...word,
      examples: [`Example verse with ${word.arabic}`]
    }));
}

export function calculateSpacedRepetitionInterval(correctAnswers: number, totalAttempts: number): number {
  const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;
  
  if (accuracy >= 0.9) return 7; // 1 week
  if (accuracy >= 0.7) return 3; // 3 days
  if (accuracy >= 0.5) return 1; // 1 day
  return 0.5; // 12 hours
}

export function getMasteryLevel(correctAnswers: number, totalAttempts: number): number {
  if (totalAttempts < 3) return 0;
  
  const accuracy = correctAnswers / totalAttempts;
  if (accuracy >= 0.9 && correctAnswers >= 5) return 3; // Gold
  if (accuracy >= 0.7 && correctAnswers >= 3) return 2; // Silver
  if (accuracy >= 0.5) return 1; // Bronze
  return 0; // No mastery
}
