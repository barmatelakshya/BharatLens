// Edge case handling for transliteration
export interface EdgeCaseHandler {
  detectProperNouns(text: string): Array<{start: number, end: number, text: string}>;
  handleMixedScripts(text: string): Array<{text: string, script: string, start: number, end: number}>;
  processNumerals(text: string, targetScript: string): string;
  handleDiacriticLoss(text: string, sourceScript: string, targetScript: string): string;
}

export class EdgeCaseProcessor implements EdgeCaseHandler {
  private properNounCache = new Map<string, string>();
  
  detectProperNouns(text: string): Array<{start: number, end: number, text: string}> {
    const properNouns: Array<{start: number, end: number, text: string}> = [];
    
    // Common proper noun patterns
    const patterns = [
      /\b[A-Z][a-z]+\b/g, // English proper nouns
      /\b[अ-ह][क-ह]*जी\b/g, // Hindi names with जी
      /\b[अ-ह][क-ह]*पुर\b/g, // City names ending in पुर
      /\b[अ-ह][क-ह]*गढ़\b/g, // City names ending in गढ़
      /\bश्री\s+[अ-ह][क-ह]*\b/g, // Names with श्री prefix
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        properNouns.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    }
    
    return properNouns;
  }

  handleMixedScripts(text: string): Array<{text: string, script: string, start: number, end: number}> {
    const segments: Array<{text: string, script: string, start: number, end: number}> = [];
    let currentSegment = '';
    let currentScript = '';
    let segmentStart = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const script = this.detectCharScript(char);
      
      if (script !== currentScript) {
        if (currentSegment) {
          segments.push({
            text: currentSegment,
            script: currentScript,
            start: segmentStart,
            end: i
          });
        }
        currentSegment = char;
        currentScript = script;
        segmentStart = i;
      } else {
        currentSegment += char;
      }
    }
    
    // Add final segment
    if (currentSegment) {
      segments.push({
        text: currentSegment,
        script: currentScript,
        start: segmentStart,
        end: text.length
      });
    }
    
    return segments;
  }

  processNumerals(text: string, targetScript: string): string {
    const numeralMaps: Record<string, Record<string, string>> = {
      devanagari: {'0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'},
      bengali: {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'},
      gujarati: {'0': '૦', '1': '૧', '2': '૨', '3': '૩', '4': '૪', '5': '૫', '6': '૬', '7': '૭', '8': '૮', '9': '૯'},
      gurmukhi: {'0': '੦', '1': '੧', '2': '੨', '3': '੩', '4': '੪', '5': '੫', '6': '੬', '7': '੭', '8': '੮', '9': '੯'},
      odia: {'0': '୦', '1': '୧', '2': '୨', '3': '୩', '4': '୪', '5': '୫', '6': '୬', '7': '୭', '8': '୮', '9': '୯'},
      tamil: {'0': '௦', '1': '௧', '2': '௨', '3': '௩', '4': '௪', '5': '௫', '6': '௬', '7': '௭', '8': '௮', '9': '௯'},
      telugu: {'0': '౦', '1': '౧', '2': '౨', '3': '౩', '4': '౪', '5': '౫', '6': '౬', '7': '౭', '8': '౮', '9': '౯'},
      kannada: {'0': '೦', '1': '೧', '2': '೨', '3': '೩', '4': '೪', '5': '೫', '6': '೬', '7': '೭', '8': '೮', '9': '೯'},
      malayalam: {'0': '൦', '1': '൧', '2': '൨', '3': '൩', '4': '൪', '5': '൫', '6': '൬', '7': '൭', '8': '൮', '9': '൯'}
    };
    
    const targetMap = numeralMaps[targetScript];
    if (!targetMap) return text;
    
    return text.replace(/[0-9]/g, (digit) => targetMap[digit] || digit);
  }

  handleDiacriticLoss(text: string, sourceScript: string, targetScript: string): string {
    // Fallback strategies for diacritic loss
    const fallbackStrategies: Record<string, (text: string) => string> = {
      tamil: (text) => {
        // Tamil lacks many consonant distinctions
        return text
          .replace(/kh|gh/g, 'k')
          .replace(/ch|jh/g, 'c')
          .replace(/ṭh|ḍh/g, 'ṭ')
          .replace(/th|dh/g, 't')
          .replace(/ph|bh/g, 'p');
      },
      
      malayalam: (text) => {
        // Handle chillu letters for word-final consonants
        return text
          .replace(/n$/g, 'ൻ')
          .replace(/r$/g, 'ർ')
          .replace(/l$/g, 'ൽ')
          .replace(/ḷ$/g, 'ൾ')
          .replace(/k$/g, 'ൿ');
      }
    };
    
    const strategy = fallbackStrategies[targetScript];
    return strategy ? strategy(text) : text;
  }

  private detectCharScript(char: string): string {
    const code = char.codePointAt(0) || 0;
    
    if (code >= 0x0900 && code <= 0x097F) return 'devanagari';
    if (code >= 0x0980 && code <= 0x09FF) return 'bengali';
    if (code >= 0x0A00 && code <= 0x0A7F) return 'gurmukhi';
    if (code >= 0x0A80 && code <= 0x0AFF) return 'gujarati';
    if (code >= 0x0B00 && code <= 0x0B7F) return 'odia';
    if (code >= 0x0B80 && code <= 0x0BFF) return 'tamil';
    if (code >= 0x0C00 && code <= 0x0C7F) return 'telugu';
    if (code >= 0x0C80 && code <= 0x0CFF) return 'kannada';
    if (code >= 0x0D00 && code <= 0x0D7F) return 'malayalam';
    if (code >= 0x0020 && code <= 0x007F) return 'latin';
    
    return 'unknown';
  }

  // User preference management for proper nouns
  lockProperNoun(original: string, preferred: string): void {
    this.properNounCache.set(original, preferred);
    
    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('properNounPreferences') || '{}');
      existing[original] = preferred;
      localStorage.setItem('properNounPreferences', JSON.stringify(existing));
    }
  }

  getPreferredTransliteration(text: string): string | null {
    return this.properNounCache.get(text) || null;
  }

  loadUserPreferences(): void {
    if (typeof localStorage !== 'undefined') {
      const prefs = JSON.parse(localStorage.getItem('properNounPreferences') || '{}');
      this.properNounCache = new Map(Object.entries(prefs));
    }
  }
}
