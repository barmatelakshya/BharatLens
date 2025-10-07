// Conjunct rules and ligature patterns
export interface ConjunctRule {
  pattern: string[];
  phonemic: string;
  ligature: Record<string, string>;
  frequency: 'common' | 'rare';
  context?: 'word-initial' | 'word-medial' | 'word-final' | 'any';
}

export const CONJUNCT_RULES: Record<string, ConjunctRule> = {
  // Common Sanskrit conjuncts
  ksha: {
    pattern: ['क', '्', 'ष'],
    phonemic: 'kṣa',
    ligature: {
      devanagari: 'क्ष',
      bengali: 'ক্ষ',
      gurmukhi: 'ਕ੍ਸ਼',
      gujarati: 'ક્ષ',
      odia: 'କ୍ଷ',
      tamil: 'க்ஷ', // Decomposed in Tamil
      telugu: 'క్ష',
      kannada: 'ಕ್ಷ',
      malayalam: 'ക്ഷ'
    },
    frequency: 'common'
  },
  tra: {
    pattern: ['त', '्', 'र'],
    phonemic: 'tra',
    ligature: {
      devanagari: 'त्र',
      bengali: 'ত্র',
      gurmukhi: 'ਤ੍ਰ',
      gujarati: 'ત્ર',
      odia: 'ତ୍ର',
      tamil: 'த்ர',
      telugu: 'త్ర',
      kannada: 'ತ್ರ',
      malayalam: 'ത്ര'
    },
    frequency: 'common'
  },
  jnya: {
    pattern: ['ज', '्', 'ञ'],
    phonemic: 'jña',
    ligature: {
      devanagari: 'ज्ञ',
      bengali: 'জ্ঞ',
      gurmukhi: 'ਗ੍ਯ', // Different in Gurmukhi
      gujarati: 'જ્ઞ',
      odia: 'ଜ୍ଞ',
      tamil: 'ஞ', // Simplified in Tamil
      telugu: 'జ్ఞ',
      kannada: 'ಜ್ಞ',
      malayalam: 'ജ്ഞ'
    },
    frequency: 'common'
  },
  shra: {
    pattern: ['श', '्', 'र'],
    phonemic: 'śra',
    ligature: {
      devanagari: 'श्र',
      bengali: 'শ্র',
      gurmukhi: 'ਸ਼੍ਰ',
      gujarati: 'શ્ર',
      odia: 'ଶ୍ର',
      tamil: 'ஶ்ர',
      telugu: 'శ్ర',
      kannada: 'ಶ್ರ',
      malayalam: 'ശ്ര'
    },
    frequency: 'common'
  },
  
  // Double consonants
  kka: {
    pattern: ['क', '्', 'क'],
    phonemic: 'kka',
    ligature: {
      devanagari: 'क्क',
      bengali: 'ক্ক',
      gurmukhi: 'ਕ੍ਕ',
      gujarati: 'ક્ક',
      odia: 'କ୍କ',
      tamil: 'க்க',
      telugu: 'క్క',
      kannada: 'ಕ್ಕ',
      malayalam: 'ക്ക'
    },
    frequency: 'common'
  },
  
  // Nasal + consonant clusters
  nka: {
    pattern: ['ङ', '्', 'क'],
    phonemic: 'ṅka',
    ligature: {
      devanagari: 'ङ्क',
      bengali: 'ঙ্ক',
      gurmukhi: 'ਙ੍ਕ',
      gujarati: 'ઙ્ક',
      odia: 'ଙ୍କ',
      tamil: 'ங்க',
      telugu: 'ఙ్క',
      kannada: 'ಙ್ಕ',
      malayalam: 'ങ്ക'
    },
    frequency: 'common'
  },
  
  // Retroflex clusters
  Tta: {
    pattern: ['ट', '्', 'ट'],
    phonemic: 'ṭṭa',
    ligature: {
      devanagari: 'ट्ट',
      bengali: 'ট্ট',
      gurmukhi: 'ਟ੍ਟ',
      gujarati: 'ટ્ટ',
      odia: 'ଟ୍ଟ',
      tamil: 'ட்ட',
      telugu: 'ట్ట',
      kannada: 'ಟ್ಟ',
      malayalam: 'ട്ട'
    },
    frequency: 'common'
  },
  
  // Sibilant clusters
  shcha: {
    pattern: ['श', '्', 'च'],
    phonemic: 'śca',
    ligature: {
      devanagari: 'श्च',
      bengali: 'শ্চ',
      gurmukhi: 'ਸ਼੍ਚ',
      gujarati: 'શ્ચ',
      odia: 'ଶ୍ଚ',
      tamil: 'ஶ்ச',
      telugu: 'శ్చ',
      kannada: 'ಶ್ಚ',
      malayalam: 'ശ്ച'
    },
    frequency: 'rare'
  }
};

// Graph patterns for automatic conjunct detection
export interface GraphPattern {
  input: RegExp;
  output: string;
  script: string;
  priority: number;
}

export const GRAPH_PATTERNS: GraphPattern[] = [
  // Devanagari patterns
  {
    input: /([क-ह])्([क-ह])/g,
    output: '$1्$2',
    script: 'devanagari',
    priority: 1
  },
  
  // Bengali patterns
  {
    input: /([ক-হ])্([ক-হ])/g,
    output: '$1্$2',
    script: 'bengali',
    priority: 1
  },
  
  // Tamil patterns (limited conjuncts)
  {
    input: /([க-ஹ])்([க-ஹ])/g,
    output: '$1்$2',
    script: 'tamil',
    priority: 1
  }
];

export function getConjunctRule(pattern: string): ConjunctRule | undefined {
  return CONJUNCT_RULES[pattern];
}

export function findConjunctByLigature(ligature: string, script: string): ConjunctRule | undefined {
  for (const rule of Object.values(CONJUNCT_RULES)) {
    if (rule.ligature[script] === ligature) {
      return rule;
    }
  }
  return undefined;
}

export function applyGraphPatterns(text: string, script: string): string {
  const patterns = GRAPH_PATTERNS.filter(p => p.script === script);
  let result = text;
  
  // Apply patterns by priority
  patterns.sort((a, b) => a.priority - b.priority);
  
  for (const pattern of patterns) {
    result = result.replace(pattern.input, pattern.output);
  }
  
  return result;
}

// Common conjunct sequences by frequency
export const CONJUNCT_FREQUENCY: Record<string, number> = {
  'ksha': 0.95,
  'tra': 0.90,
  'jnya': 0.85,
  'shra': 0.80,
  'kka': 0.75,
  'nka': 0.70,
  'Tta': 0.65,
  'shcha': 0.30
};

export function getConjunctFrequency(conjunct: string): number {
  return CONJUNCT_FREQUENCY[conjunct] || 0.1;
}
