// Exception dictionaries for proper nouns and edge cases
export const exceptionDictionary: Record<string, Record<string, string>> = {
  placeNames: {
    'दिल्ली': 'Delhi',
    'मुंबई': 'Mumbai', 
    'कोलकाता': 'Kolkata',
    'चेन्नै': 'Chennai',
    'बेंगलूरु': 'Bengaluru',
    'हैदराबाद': 'Hyderabad'
  },
  signageTerms: {
    'स्टेशन': 'Station',
    'अस्पताल': 'Hospital',
    'स्कूल': 'School',
    'बैंक': 'Bank',
    'होटल': 'Hotel',
    'रेस्टोरेंट': 'Restaurant'
  },
  abbreviations: {
    'रे.': 'Railway',
    'डॉ.': 'Dr.',
    'श्री': 'Shri',
    'श्रीमती': 'Smt.'
  }
};

export class ValidationEngine {
  private userCache: Map<string, string> = new Map();

  // Round-trip validation
  validateRoundTrip(original: string, transliterated: string, sourceScript: string, targetScript: string): {
    isValid: boolean;
    confidence: number;
    suggestions?: string[];
  } {
    try {
      // Attempt reverse transliteration
      const reversed = this.reverseTransliterate(transliterated, targetScript, sourceScript);
      const similarity = this.calculateSimilarity(original, reversed);
      
      return {
        isValid: similarity > 0.8,
        confidence: similarity,
        suggestions: similarity < 0.8 ? this.generateSuggestions(original) : undefined
      };
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        suggestions: ['Manual verification required']
      };
    }
  }

  private reverseTransliterate(text: string, fromScript: string, toScript: string): string {
    // Simplified reverse transliteration
    // In practice, this would use the same engine in reverse
    return text; // Placeholder
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Levenshtein distance based similarity
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }

  private generateSuggestions(original: string): string[] {
    const suggestions: string[] = [];
    
    // Check exception dictionaries
    for (const category of Object.values(exceptionDictionary)) {
      if (category[original]) {
        suggestions.push(category[original]);
      }
    }

    // Check user cache
    if (this.userCache.has(original)) {
      suggestions.push(this.userCache.get(original)!);
    }

    return suggestions.length > 0 ? suggestions : ['No suggestions available'];
  }

  // User training cache
  addUserCorrection(original: string, corrected: string): void {
    this.userCache.set(original, corrected);
    
    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('transliterationCache') || '{}');
      existing[original] = corrected;
      localStorage.setItem('transliterationCache', JSON.stringify(existing));
    }
  }

  loadUserCache(): void {
    if (typeof localStorage !== 'undefined') {
      const cached = JSON.parse(localStorage.getItem('transliterationCache') || '{}');
      this.userCache = new Map(Object.entries(cached));
    }
  }

  // Check exceptions before transliteration
  checkExceptions(text: string): string | null {
    // Check all exception categories
    for (const category of Object.values(exceptionDictionary)) {
      if (category[text]) {
        return category[text];
      }
    }

    // Check user cache
    return this.userCache.get(text) || null;
  }

  // Confidence scoring for OCR results
  calculateOCRConfidence(text: string, ocrConfidence: number): number {
    let confidence = ocrConfidence;

    // Boost confidence for known words
    if (this.checkExceptions(text)) {
      confidence = Math.min(1.0, confidence + 0.2);
    }

    // Reduce confidence for unusual character combinations
    if (this.hasUnusualPatterns(text)) {
      confidence = Math.max(0.1, confidence - 0.3);
    }

    return confidence;
  }

  private hasUnusualPatterns(text: string): boolean {
    // Check for unusual character sequences
    const unusualPatterns = [
      /[क-ह]{4,}/, // Too many consecutive consonants
      /[ा-ौ]{3,}/, // Too many consecutive vowel marks
      /्{2,}/      // Multiple viramas
    ];

    return unusualPatterns.some(pattern => pattern.test(text));
  }
}
