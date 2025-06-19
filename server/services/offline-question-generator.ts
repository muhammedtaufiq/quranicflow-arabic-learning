import { Word } from "@shared/schema";

export interface GeneratedQuestion {
  type: 'multiple_choice' | 'translation' | 'fill_blank';
  question: string;
  arabicWord: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

// Pre-built question templates for different difficulty levels
const QUESTION_TEMPLATES = {
  1: [
    "What does this word mean?",
    "Choose the correct meaning:",
    "This Arabic word translates to:",
  ],
  2: [
    "What is the meaning of this word?",
    "Select the correct translation:",
    "This word from the Quran means:",
  ],
  3: [
    "What does this Quranic term mean?",
    "Choose the precise meaning:",
    "This Arabic word signifies:",
  ],
  4: [
    "What is the correct interpretation?",
    "Select the accurate meaning:",
    "This complex term means:",
  ],
  5: [
    "What does this advanced term mean?",
    "Choose the scholarly translation:",
    "This sophisticated word indicates:",
  ]
};

// Common wrong answers by category for realistic distractors
const DISTRACTOR_POOL = {
  divine: ["mercy", "guidance", "light", "peace", "blessing"],
  essential: ["prayer", "faith", "truth", "worship", "submission"],
  attributes: ["forgiving", "wise", "powerful", "generous", "patient"],
  prepositions: ["from", "with", "by", "through", "around"],
  pronouns: ["they", "we", "you", "those", "these"],
  particles: ["yes", "indeed", "truly", "certainly", "rather"],
  verbs: ["created", "guided", "forgave", "blessed", "commanded"],
  nouns: ["book", "people", "earth", "heaven", "heart"],
  time: ["night", "morning", "hour", "moment", "eternity"],
  concepts: ["faith", "knowledge", "wisdom", "justice", "mercy"],
  believers: ["righteous", "grateful", "patient", "truthful", "sincere"],
  people: ["scholars", "leaders", "followers", "companions", "witnesses"],
  worship: ["fasting", "pilgrimage", "remembrance", "supplication", "recitation"]
};

export function generateOfflineQuestions(word: Word, allWords: Word[]): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const templates = QUESTION_TEMPLATES[word.difficulty as keyof typeof QUESTION_TEMPLATES] || QUESTION_TEMPLATES[1];
  
  // Generate multiple choice questions
  const multipleChoiceQuestion = generateMultipleChoice(word, allWords, templates);
  if (multipleChoiceQuestion) {
    questions.push(multipleChoiceQuestion);
  }

  // Generate translation question
  const translationQuestion = generateTranslation(word, templates);
  if (translationQuestion) {
    questions.push(translationQuestion);
  }

  // Generate fill in the blank if examples exist
  if (word.examples && word.examples.length > 0) {
    const fillBlankQuestion = generateFillBlank(word);
    if (fillBlankQuestion) {
      questions.push(fillBlankQuestion);
    }
  }

  return questions;
}

function generateMultipleChoice(word: Word, allWords: Word[], templates: string[]): GeneratedQuestion {
  const question = templates[Math.floor(Math.random() * templates.length)];
  
  // Get smart distractors
  const distractors = getSmartDistractors(word, allWords);
  
  // Shuffle options
  const options = [word.meaning, ...distractors].sort(() => Math.random() - 0.5);
  
  return {
    type: 'multiple_choice',
    question,
    arabicWord: word.arabic,
    options,
    correctAnswer: word.meaning,
    explanation: `${word.arabic} (${word.transliteration}) means "${word.meaning}". Root: ${word.rootWord || 'N/A'}`
  };
}

function generateTranslation(word: Word, templates: string[]): GeneratedQuestion {
  const question = `Translate: ${word.arabic}`;
  
  return {
    type: 'translation',
    question,
    arabicWord: word.arabic,
    correctAnswer: word.meaning,
    explanation: `${word.arabic} is pronounced "${word.transliteration}" and means "${word.meaning}"`
  };
}

function generateFillBlank(word: Word): GeneratedQuestion | null {
  if (!word.examples || word.examples.length === 0) return null;
  
  const example = word.examples[0];
  const arabicWord = word.arabic;
  
  // Create fill-in-the-blank by replacing the word with ___
  const questionText = example.replace(arabicWord, "___");
  
  return {
    type: 'fill_blank',
    question: `Fill in the blank: ${questionText}`,
    arabicWord: word.arabic,
    correctAnswer: arabicWord,
    explanation: `The missing word is ${arabicWord} (${word.transliteration}), meaning "${word.meaning}"`
  };
}

function getSmartDistractors(word: Word, allWords: Word[]): string[] {
  const distractors: string[] = [];
  
  // Try to get distractors from same category first
  const sameCategoryWords = allWords.filter(w => 
    w.category === word.category && 
    w.id !== word.id &&
    w.meaning !== word.meaning
  );
  
  if (sameCategoryWords.length >= 3) {
    return sameCategoryWords
      .slice(0, 3)
      .map(w => w.meaning);
  }
  
  // Get from similar difficulty
  const similarDifficultyWords = allWords.filter(w => 
    Math.abs(w.difficulty - word.difficulty) <= 1 && 
    w.id !== word.id &&
    w.meaning !== word.meaning
  );
  
  if (similarDifficultyWords.length >= 3) {
    return similarDifficultyWords
      .slice(0, 3)
      .map(w => w.meaning);
  }
  
  // Fallback to predefined distractors
  const categoryPool = DISTRACTOR_POOL[word.category as keyof typeof DISTRACTOR_POOL] || DISTRACTOR_POOL.essential;
  const availableDistractors = categoryPool.filter(d => d !== word.meaning);
  
  // Mix with random words from database
  const randomWords = allWords
    .filter(w => w.id !== word.id && w.meaning !== word.meaning)
    .slice(0, 2)
    .map(w => w.meaning);
  
  const combined = [...availableDistractors.slice(0, 2), ...randomWords];
  return combined.slice(0, 3);
}

// Generate adaptive questions based on user performance
export function generateAdaptiveQuestions(
  words: Word[], 
  userPerformance: { wordId: number; correctAnswers: number; totalAttempts: number }[]
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  
  words.forEach(word => {
    const performance = userPerformance.find(p => p.wordId === word.id);
    const accuracy = performance ? performance.correctAnswers / performance.totalAttempts : 0;
    
    // Generate more questions for poorly performing words
    const questionCount = accuracy < 0.5 ? 2 : 1;
    
    for (let i = 0; i < questionCount; i++) {
      const wordQuestions = generateOfflineQuestions(word, words);
      questions.push(...wordQuestions);
    }
  });
  
  return questions.slice(0, 10); // Limit to 10 questions per session
}

// Spaced repetition question selection
export function selectSpacedRepetitionQuestions(
  words: Word[],
  userProgress: { wordId: number; nextReview: Date; masteryLevel: number }[]
): Word[] {
  const now = new Date();
  
  return words.filter(word => {
    const progress = userProgress.find(p => p.wordId === word.id);
    if (!progress) return true; // New words
    
    return progress.nextReview <= now; // Due for review
  }).sort((a, b) => {
    const progressA = userProgress.find(p => p.wordId === a.id);
    const progressB = userProgress.find(p => p.wordId === b.id);
    
    // Prioritize lower mastery levels
    const masteryA = progressA?.masteryLevel || 0;
    const masteryB = progressB?.masteryLevel || 0;
    
    return masteryA - masteryB;
  });
}