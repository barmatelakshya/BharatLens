// Smart Context Mode - Semantic understanding of signage
export interface ContextualTerm {
  term: string;
  category: 'emergency' | 'transport' | 'medical' | 'religious' | 'commercial' | 'direction';
  icon: string;
  color: string;
  priority: number;
  translations: Record<string, string>;
}

export const CONTEXTUAL_DICTIONARY: ContextualTerm[] = [
  // Emergency terms
  {
    term: 'emergency',
    category: 'emergency',
    icon: '🚨',
    color: '#dc2626',
    priority: 10,
    translations: {
      devanagari: 'आपातकाल',
      tamil: 'அவசரநிலை',
      bengali: 'জরুরি',
      telugu: 'అత్యవసర',
      kannada: 'ತುರ್ತು',
      malayalam: 'അടിയന്തിര',
      gujarati: 'કટોકટી',
      gurmukhi: 'ਐਮਰਜੈਂਸੀ',
      odia: 'ଜରୁରୀକାଳୀନ'
    }
  },
  {
    term: 'hospital',
    category: 'medical',
    icon: '🏥',
    color: '#059669',
    priority: 9,
    translations: {
      devanagari: 'अस्पताल',
      tamil: 'மருத்துவமனை',
      bengali: 'হাসপাতাল',
      telugu: 'ఆసుపత్రి',
      kannada: 'ಆಸ್ಪತ್ರೆ',
      malayalam: 'ആശുപത്രി',
      gujarati: 'હોસ્પિટલ',
      gurmukhi: 'ਹਸਪਤਾਲ',
      odia: 'ଡାକ୍ତରଖାନା'
    }
  },
  {
    term: 'exit',
    category: 'direction',
    icon: '🚪',
    color: '#2563eb',
    priority: 8,
    translations: {
      devanagari: 'निकास',
      tamil: 'வெளியேறு',
      bengali: 'প্রস্থান',
      telugu: 'నిష్క్రమణ',
      kannada: 'ನಿರ್ಗಮನ',
      malayalam: 'പുറത്തുകടക്കുക',
      gujarati: 'બહાર નીકળો',
      gurmukhi: 'ਬਾਹਰ ਨਿਕਲੋ',
      odia: 'ବାହାରକୁ'
    }
  },
  {
    term: 'station',
    category: 'transport',
    icon: '🚉',
    color: '#7c3aed',
    priority: 7,
    translations: {
      devanagari: 'स्टेशन',
      tamil: 'நிலையம்',
      bengali: 'স্টেশন',
      telugu: 'స్టేషన్',
      kannada: 'ನಿಲ್ದಾಣ',
      malayalam: 'സ്റ്റേഷൻ',
      gujarati: 'સ્ટેશન',
      gurmukhi: 'ਸਟੇਸ਼ਨ',
      odia: 'ଷ୍ଟେସନ'
    }
  },
  {
    term: 'temple',
    category: 'religious',
    icon: '🛕',
    color: '#ea580c',
    priority: 6,
    translations: {
      devanagari: 'मंदिर',
      tamil: 'கோயில்',
      bengali: 'মন্দির',
      telugu: 'గుడి',
      kannada: 'ದೇವಾಲಯ',
      malayalam: 'ക്ഷേത്രം',
      gujarati: 'મંદિર',
      gurmukhi: 'ਮੰਦਰ',
      odia: 'ମନ୍ଦିର'
    }
  },
  {
    term: 'danger',
    category: 'emergency',
    icon: '⚠️',
    color: '#dc2626',
    priority: 10,
    translations: {
      devanagari: 'खतरा',
      tamil: 'ஆபத்து',
      bengali: 'বিপদ',
      telugu: 'ప్రమాదం',
      kannada: 'ಅಪಾಯ',
      malayalam: 'അപകടം',
      gujarati: 'જોખમ',
      gurmukhi: 'ਖ਼ਤਰਾ',
      odia: 'ବିପଦ'
    }
  }
];

export class SmartContextEngine {
  private dictionary = CONTEXTUAL_DICTIONARY;
  private isEnabled = true;

  detectContextualTerms(text: string, script: string): Array<{
    term: ContextualTerm;
    position: { start: number; end: number };
    confidence: number;
  }> {
    if (!this.isEnabled) return [];

    const detectedTerms: Array<{
      term: ContextualTerm;
      position: { start: number; end: number };
      confidence: number;
    }> = [];

    const normalizedText = text.toLowerCase();

    for (const term of this.dictionary) {
      // Check if the term exists in the current script
      const scriptTranslation = term.translations[script];
      if (!scriptTranslation) continue;

      const index = normalizedText.indexOf(scriptTranslation.toLowerCase());
      if (index !== -1) {
        detectedTerms.push({
          term,
          position: {
            start: index,
            end: index + scriptTranslation.length
          },
          confidence: 0.9
        });
      }

      // Also check English term
      const englishIndex = normalizedText.indexOf(term.term);
      if (englishIndex !== -1) {
        detectedTerms.push({
          term,
          position: {
            start: englishIndex,
            end: englishIndex + term.term.length
          },
          confidence: 0.85
        });
      }
    }

    // Sort by priority (emergency terms first)
    return detectedTerms.sort((a, b) => b.term.priority - a.term.priority);
  }

  enhanceTransliteration(
    originalText: string,
    transliteratedText: string,
    sourceScript: string,
    targetScript: string
  ): {
    enhancedText: string;
    contextualInfo: Array<{
      term: string;
      icon: string;
      category: string;
      color: string;
    }>;
  } {
    const detectedTerms = this.detectContextualTerms(originalText, sourceScript);
    let enhancedText = transliteratedText;
    const contextualInfo: Array<{
      term: string;
      icon: string;
      category: string;
      color: string;
    }> = [];

    for (const detected of detectedTerms) {
      const { term } = detected;
      const targetTranslation = term.translations[targetScript];
      
      if (targetTranslation) {
        // Add icon to the transliterated text
        enhancedText = enhancedText.replace(
          targetTranslation,
          `${term.icon} ${targetTranslation}`
        );

        contextualInfo.push({
          term: targetTranslation,
          icon: term.icon,
          category: term.category,
          color: term.color
        });
      }
    }

    return { enhancedText, contextualInfo };
  }

  getEmergencyTerms(): ContextualTerm[] {
    return this.dictionary.filter(term => term.category === 'emergency');
  }

  isEmergencyDetected(text: string, script: string): boolean {
    const emergencyTerms = this.getEmergencyTerms();
    const normalizedText = text.toLowerCase();

    return emergencyTerms.some(term => {
      const translation = term.translations[script];
      return translation && normalizedText.includes(translation.toLowerCase());
    });
  }

  toggle(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isActive(): boolean {
    return this.isEnabled;
  }
}

export const smartContextEngine = new SmartContextEngine();
