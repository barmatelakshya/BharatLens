// Heuristic modules for advanced transliteration processing
export interface SchwaRule {
  position: 'word-final' | 'word-medial' | 'cluster-medial' | 'before-consonant';
  condition: RegExp;
  action: 'delete' | 'retain';
  language: string[];
  confidence: number;
}

export const SCHWA_DELETION_RULES: SchwaRule[] = [
  // Hindi word-final schwa deletion
  {
    position: 'word-final',
    condition: /([क-ह])a$/,
    action: 'delete',
    language: ['hindi', 'marathi'],
    confidence: 0.9
  },
  
  // Hindi medial schwa deletion before single consonant
  {
    position: 'word-medial',
    condition: /([क-ह])a([क-ह])a/,
    action: 'delete',
    language: ['hindi'],
    confidence: 0.7
  },
  
  // Retain schwa in certain clusters
  {
    position: 'cluster-medial',
    condition: /([क-ह])a([क-ह])्([क-ह])/,
    action: 'retain',
    language: ['hindi', 'sanskrit'],
    confidence: 0.8
  },
  
  // Bengali retains most schwas
  {
    position: 'word-final',
    condition: /([ক-হ])a$/,
    action: 'retain',
    language: ['bengali', 'assamese'],
    confidence: 0.95
  }
];

export interface NasalizationRule {
  context: 'before-stop' | 'before-fricative' | 'before-nasal' | 'word-final';
  input: string;
  output: 'nasal-consonant' | 'vowel-nasalization';
  scripts: string[];
  examples: string[];
}

export const NASALIZATION_RULES: NasalizationRule[] = [
  // Anusvara before stops becomes homorganic nasal
  {
    context: 'before-stop',
    input: 'ṃ + velar-stop',
    output: 'nasal-consonant',
    scripts: ['devanagari', 'bengali', 'gurmukhi'],
    examples: ['संकल्प → saṅkalpa', 'गंगा → gaṅgā']
  },
  
  // Anusvara before fricatives remains nasalization
  {
    context: 'before-fricative',
    input: 'ṃ + fricative',
    output: 'vowel-nasalization',
    scripts: ['devanagari', 'bengali'],
    examples: ['संस्कार → saṃskāra', 'हंस → haṃsa']
  },
  
  // Word-final anusvara is vowel nasalization
  {
    context: 'word-final',
    input: 'ṃ + #',
    output: 'vowel-nasalization',
    scripts: ['devanagari', 'bengali', 'gujarati'],
    examples: ['राम → rāṃ', 'श्याम → śyāṃ']
  }
];

export interface DisambiguationRule {
  phoneme: string;
  targetScript: string;
  options: Array<{
    grapheme: string;
    context: string;
    frequency: number;
    signagePreference: boolean;
  }>;
}

export const DISAMBIGUATION_RULES: DisambiguationRule[] = [
  // Tamil consonant disambiguation
  {
    phoneme: 'ka',
    targetScript: 'tamil',
    options: [
      {
        grapheme: 'க',
        context: 'general',
        frequency: 0.9,
        signagePreference: true
      },
      {
        grapheme: 'ग', // Rare Sanskrit borrowing
        context: 'sanskrit-loan',
        frequency: 0.1,
        signagePreference: false
      }
    ]
  },
  
  // Tamil lacks aspirated consonants
  {
    phoneme: 'kha',
    targetScript: 'tamil',
    options: [
      {
        grapheme: 'க',
        context: 'native-tamil',
        frequency: 0.95,
        signagePreference: true
      },
      {
        grapheme: 'க்ஹ',
        context: 'foreign-word',
        frequency: 0.05,
        signagePreference: false
      }
    ]
  },
  
  // Malayalam chillu vs regular consonant
  {
    phoneme: 'n',
    targetScript: 'malayalam',
    options: [
      {
        grapheme: 'ൻ', // Chillu n
        context: 'word-final',
        frequency: 0.8,
        signagePreference: true
      },
      {
        grapheme: 'ന്', // Regular n + virama
        context: 'before-consonant',
        frequency: 0.2,
        signagePreference: false
      }
    ]
  }
];

// Heuristic processing functions
export class HeuristicProcessor {
  
  static applySchwaRules(text: string, language: string, mode: 'strict' | 'readable'): string {
    if (mode === 'strict') return text;
    
    let result = text;
    
    for (const rule of SCHWA_DELETION_RULES) {
      if (rule.language.includes(language)) {
        if (rule.action === 'delete') {
          result = result.replace(rule.condition, '$1');
        }
        // 'retain' rules don't modify text but prevent other rules
      }
    }
    
    return result;
  }
  
  static resolveNasalization(text: string, followingConsonant: string): string {
    // Determine if anusvara should become nasal consonant or remain nasalization
    const consonantInfo = this.getConsonantClass(followingConsonant);
    
    if (consonantInfo.manner === 'stop') {
      // Convert to homorganic nasal
      const nasalMap: Record<string, string> = {
        'velar': 'ṅ',
        'palatal': 'ñ',
        'retroflex': 'ṇ',
        'dental': 'n',
        'labial': 'm'
      };
      return nasalMap[consonantInfo.place] || 'ṃ';
    }
    
    // Keep as vowel nasalization
    return 'ṃ';
  }
  
  static disambiguateGrapheme(phoneme: string, targetScript: string, context: string): string {
    const rule = DISAMBIGUATION_RULES.find(r => 
      r.phoneme === phoneme && r.targetScript === targetScript
    );
    
    if (!rule) return phoneme;
    
    // Prefer signage-friendly options
    const signageOption = rule.options.find(opt => opt.signagePreference);
    if (signageOption) return signageOption.grapheme;
    
    // Fall back to most frequent option
    const mostFrequent = rule.options.reduce((prev, curr) => 
      curr.frequency > prev.frequency ? curr : prev
    );
    
    return mostFrequent.grapheme;
  }
  
  private static getConsonantClass(consonant: string): { place: string; manner: string } {
    // Simplified consonant classification
    const classifications: Record<string, { place: string; manner: string }> = {
      'क': { place: 'velar', manner: 'stop' },
      'च': { place: 'palatal', manner: 'stop' },
      'ट': { place: 'retroflex', manner: 'stop' },
      'त': { place: 'dental', manner: 'stop' },
      'प': { place: 'labial', manner: 'stop' },
      'श': { place: 'palatal', manner: 'fricative' },
      'स': { place: 'dental', manner: 'fricative' }
    };
    
    return classifications[consonant] || { place: 'dental', manner: 'stop' };
  }
  
  // Language-specific processing toggles
  static getLanguageSettings(language: string): {
    schwaHandling: boolean;
    nasalizationResolution: boolean;
    conjunctSimplification: boolean;
  } {
    const settings: Record<string, any> = {
      hindi: {
        schwaHandling: true,
        nasalizationResolution: true,
        conjunctSimplification: false
      },
      bengali: {
        schwaHandling: false,
        nasalizationResolution: true,
        conjunctSimplification: false
      },
      tamil: {
        schwaHandling: false,
        nasalizationResolution: false,
        conjunctSimplification: true
      },
      malayalam: {
        schwaHandling: false,
        nasalizationResolution: true,
        conjunctSimplification: false
      }
    };
    
    return settings[language] || settings.hindi;
  }
}
