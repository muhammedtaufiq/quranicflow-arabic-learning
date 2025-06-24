// Completely offline local AI using pattern matching and statistical analysis
// No external dependencies - pure JavaScript algorithms

interface LearningPattern {
  mistakeTypes: string[];
  difficultyAreas: string[];
  timePatterns: number[];
  successRates: Record<string, number>;
}

interface WordDifficulty {
  wordIndex: number;
  difficulty: number;
  commonMistakes: string[];
  learningTime: number;
}

export class OfflineAI {
  private userPatterns: Map<number, LearningPattern> = new Map();
  private wordDifficulties: Map<number, WordDifficulty> = new Map();
  
  // Analyze user's learning pattern using statistical methods
  analyzeUserPattern(userId: number, sessionData: Array<{
    wordIndex: number;
    isCorrect: boolean;
    timeSpent: number;
    mistakeType?: string;
    sessionHour: number;
  }>): LearningPattern {
    let pattern = this.userPatterns.get(userId) || {
      mistakeTypes: [],
      difficultyAreas: [],
      timePatterns: new Array(24).fill(0),
      successRates: {}
    };

    sessionData.forEach(session => {
      // Track time patterns
      pattern.timePatterns[session.sessionHour]++;
      
      // Track mistake types
      if (!session.isCorrect && session.mistakeType) {
        if (!pattern.mistakeTypes) pattern.mistakeTypes = [];
        const mistakeType = String(session.mistakeType);
        if (!pattern.mistakeTypes.includes(mistakeType)) {
          pattern.mistakeTypes.push(mistakeType);
        }
      }
      
      // Calculate success rates by category
      const wordData = this.getWordByIndex(session.wordIndex);
      if (wordData) {
        const category = wordData.category;
        pattern.successRates = pattern.successRates || {};
        if (!(pattern.successRates as any)[category]) {
          (pattern.successRates as any)[category] = 0;
        }
        (pattern.successRates as any)[category] = session.isCorrect ? 
          ((pattern.successRates as any)[category] + 1) / 2 : 
          (pattern.successRates as any)[category] / 2;
      }
    });

    this.userPatterns.set(userId, pattern);
    return pattern;
  }

  // Predict which words user will struggle with using similarity matching
  predictDifficultWords(userId: number, newWords: any[]): Array<{
    word: any;
    predictedDifficulty: number;
    reasons: string[];
  }> {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) {
      return newWords.map(word => ({
        word,
        predictedDifficulty: 0.5,
        reasons: ['No historical data available']
      }));
    }

    return newWords.map(word => {
      const difficulty = this.calculatePredictedDifficulty(word, pattern);
      const reasons = this.generateDifficultyReasons(word, pattern);
      
      return {
        word,
        predictedDifficulty: difficulty,
        reasons
      };
    });
  }

  // Generate personalized review schedule using spaced repetition algorithm
  generateReviewSchedule(userId: number, strugglingWords: number[]): Array<{
    wordIndex: number;
    reviewDate: Date;
    priority: number;
  }> {
    const pattern = this.userPatterns.get(userId);
    const schedule: Array<{
      wordIndex: number;
      reviewDate: Date;
      priority: number;
    }> = [];

    strugglingWords.forEach(wordIndex => {
      const wordDifficulty = this.wordDifficulties.get(wordIndex);
      const baseInterval = this.calculateBaseInterval(wordDifficulty?.difficulty || 3);
      
      // Adjust interval based on user's learning pattern
      const adjustedInterval = this.adjustIntervalForUser(baseInterval, pattern);
      
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + adjustedInterval);
      
      schedule.push({
        wordIndex,
        reviewDate,
        priority: this.calculatePriority(wordIndex, pattern)
      });
    });

    return schedule.sort((a, b) => b.priority - a.priority);
  }

  // Create adaptive question selection based on user weaknesses
  selectAdaptiveQuestions(userId: number, availableWords: any[], sessionLength: number): any[] {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) {
      return availableWords.slice(0, sessionLength);
    }

    // Weight words based on user's weak areas
    const weightedWords = availableWords.map(word => ({
      word,
      weight: this.calculateWordWeight(word, pattern)
    }));

    // Sort by weight and select top words
    weightedWords.sort((a, b) => b.weight - a.weight);
    return weightedWords.slice(0, sessionLength).map(w => w.word);
  }

  // Offline pattern recognition for mistake classification
  classifyMistake(userAnswer: string, correctAnswerParam: string, wordData: any): string {
    // Simple pattern matching for mistake classification
    if (this.isPhoneticMistake(userAnswer, correctAnswerParam)) {
      return 'phonetic';
    }
    if (this.isSemanticMistake(userAnswer, wordData)) {
      return 'semantic';
    }
    if (this.isOrthographicMistake(userAnswer, correctAnswerParam)) {
      return 'orthographic';
    }
    if (this.isGrammaticalMistake(userAnswer, wordData)) {
      return 'grammatical';
    }
    return 'unknown';
  }

  private calculatePredictedDifficulty(word: any, pattern: LearningPattern): number {
    let difficulty = 0.5; // Base difficulty
    
    // Increase difficulty if category has low success rate
    if (pattern.successRates[word.category] < 0.6) {
      difficulty += 0.2;
    }
    
    // Increase difficulty if word has similar characteristics to past mistakes
    if (this.hasCharacteristicsSimilarToMistakes(word, pattern)) {
      difficulty += 0.15;
    }
    
    // Adjust based on word frequency (less frequent = more difficult)
    if (word.frequency < 100) {
      difficulty += 0.1;
    }
    
    return Math.min(1, difficulty);
  }

  private generateDifficultyReasons(word: any, pattern: LearningPattern): string[] {
    const reasons: string[] = [];
    
    if (pattern.successRates[word.category] < 0.6) {
      reasons.push(`Low success rate in ${word.category} category`);
    }
    
    if (word.frequency < 100) {
      reasons.push('Infrequent word - requires more practice');
    }
    
    if (pattern.mistakeTypes.includes('phonetic') && this.hasComplexPhonetics(word)) {
      reasons.push('Complex pronunciation based on past phonetic difficulties');
    }
    
    return reasons;
  }

  private calculateBaseInterval(difficulty: number): number {
    // Spaced repetition intervals based on difficulty
    const intervals = [1, 3, 7, 14, 30, 60]; // days
    const index = Math.min(Math.floor(difficulty), intervals.length - 1);
    return intervals[index];
  }

  private adjustIntervalForUser(baseInterval: number, pattern?: LearningPattern): number {
    if (!pattern) return baseInterval;
    
    // Adjust based on user's optimal learning times
    const bestHour = pattern.timePatterns.indexOf(Math.max(...pattern.timePatterns));
    const currentHour = new Date().getHours();
    
    // If user learns better at specific times, adjust interval
    if (Math.abs(bestHour - currentHour) > 6) {
      return Math.floor(baseInterval * 1.2); // Slightly longer interval
    }
    
    return baseInterval;
  }

  private calculatePriority(wordIndex: number, pattern?: LearningPattern): number {
    let priority = 5; // Base priority
    
    const wordDifficulty = this.wordDifficulties.get(wordIndex);
    if (wordDifficulty) {
      priority += wordDifficulty.difficulty;
    }
    
    return priority;
  }

  private calculateWordWeight(word: any, pattern: LearningPattern): number {
    let weight = 1;
    
    // Higher weight for categories with low success rates
    if (pattern.successRates[word.category] < 0.6) {
      weight += 2;
    }
    
    // Higher weight for mistake-prone characteristics
    if (this.hasCharacteristicsSimilarToMistakes(word, pattern)) {
      weight += 1.5;
    }
    
    return weight;
  }

  private isPhoneticMistake(userAnswer: string, correctAnswer: string): boolean {
    // Simple phonetic similarity check
    const similarity = this.calculatePhoneticSimilarity(userAnswer, correctAnswer);
    return similarity > 0.7 && similarity < 1;
  }

  private isSemanticMistake(userAnswer: string, wordData: any): boolean {
    // Check if answer is semantically related
    return wordData.examples?.some((example: string) => 
      example.toLowerCase().includes(userAnswer.toLowerCase())
    ) || false;
  }

  private isOrthographicMistake(userAnswer: string, correctAnswerParam: string): boolean {
    const correctAnswer = correctAnswerParam;
    // Check for spelling mistakes
    const distance = this.calculateLevenshteinDistance(userAnswer, correctAnswer);
    return distance > 0 && distance <= 2;
  }

  private isGrammaticalMistake(userAnswer: string, wordData: any): boolean {
    // Simple grammatical pattern matching
    return userAnswer.length > wordData.meaning.length * 1.5;
  }

  private hasCharacteristicsSimilarToMistakes(word: any, pattern: LearningPattern): boolean {
    // Simple heuristic based on word characteristics
    return pattern.mistakeTypes.includes('phonetic') && this.hasComplexPhonetics(word);
  }

  private hasComplexPhonetics(word: any): boolean {
    // Check for complex Arabic phonetics (simplified)
    const complexSounds = ['ع', 'غ', 'ق', 'خ', 'ح', 'ص', 'ض', 'ط', 'ظ'];
    return complexSounds.some(sound => word.arabic?.includes(sound));
  }

  private calculatePhoneticSimilarity(str1: string, str2: string): number {
    // Simple phonetic similarity calculation
    const distance = this.calculateLevenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getWordByIndex(index: number): any {
    // This should reference the actual vocabulary data
    // For now, return a basic structure
    return {
      category: 'default',
      arabic: '',
      frequency: 100
    };
  }
}

// Singleton instance
export const offlineAI = new OfflineAI();