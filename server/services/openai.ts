import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface WordGenerationOptions {
  difficulty: number;
  category: string;
  count: number;
  excludeWords: string[];
}

export interface LearningQuestion {
  type: 'multiple_choice' | 'translation' | 'fill_blank';
  question: string;
  arabicWord: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateQuranicWords(options: WordGenerationOptions): Promise<any[]> {
  try {
    const prompt = `Generate ${options.count} Quranic Arabic words with the following criteria:
    - Difficulty level: ${options.difficulty} (1-5 scale)
    - Category: ${options.category}
    - Exclude these words: ${options.excludeWords.join(', ')}
    
    For each word, provide:
    - arabic: the Arabic text
    - transliteration: romanized pronunciation
    - meaning: English translation
    - frequency: estimated frequency in Quran (1-100)
    - difficulty: 1-5 difficulty rating
    - category: word category
    - rootWord: Arabic root letters
    - examples: array of example phrases/verses
    
    Respond with valid JSON array format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in Quranic Arabic and Islamic studies. Generate authentic Quranic vocabulary with accurate translations and linguistic information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"words": []}');
    return result.words || [];
  } catch (error) {
    console.error('Error generating Quranic words:', error);
    throw new Error('Failed to generate vocabulary words');
  }
}

export async function generateLearningQuestions(arabicWord: string, meaning: string, difficulty: number): Promise<LearningQuestion[]> {
  try {
    const prompt = `Create 3 different types of learning questions for this Quranic Arabic word:
    - Arabic: ${arabicWord}
    - Meaning: ${meaning}
    - Difficulty: ${difficulty}
    
    Generate:
    1. Multiple choice question (4 options)
    2. Translation question
    3. Fill in the blank question
    
    For each question provide:
    - type: question type
    - question: the question text
    - arabicWord: the target Arabic word
    - options: array of choices (for multiple choice)
    - correctAnswer: the correct answer
    - explanation: brief explanation of the answer
    
    Respond with valid JSON format.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are creating educational content for Quranic Arabic learning. Make questions engaging and pedagogically sound."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"questions": []}');
    return result.questions || [];
  } catch (error) {
    console.error('Error generating learning questions:', error);
    throw new Error('Failed to generate learning questions');
  }
}

export async function adaptLearningDifficulty(userStats: {
  correctAnswers: number;
  totalAttempts: number;
  recentPerformance: number[];
}): Promise<{
  recommendedDifficulty: number;
  suggestion: string;
}> {
  try {
    const prompt = `Analyze this learner's performance and recommend difficulty adjustment:
    - Correct answers: ${userStats.correctAnswers}
    - Total attempts: ${userStats.totalAttempts}
    - Recent performance (last 10 questions): ${userStats.recentPerformance.join(', ')} (1=correct, 0=incorrect)
    
    Provide:
    - recommendedDifficulty: integer 1-5
    - suggestion: brief explanation for the recommendation
    
    Consider spaced repetition principles and adaptive learning theory.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an adaptive learning algorithm expert. Analyze performance patterns and suggest optimal difficulty adjustments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      recommendedDifficulty: result.recommendedDifficulty || 1,
      suggestion: result.suggestion || "Maintain current difficulty level"
    };
  } catch (error) {
    console.error('Error adapting learning difficulty:', error);
    return {
      recommendedDifficulty: 1,
      suggestion: "Continue with current difficulty level"
    };
  }
}
