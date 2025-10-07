// Diacritics, signs, and special markers
export interface DiacriticInfo {
  phoneme: string;
  type: 'nasalization' | 'aspiration' | 'visarga' | 'nukta' | 'virama' | 'special';
  position: 'above' | 'below' | 'after' | 'before';
  scripts: Record<string, string>;
  contextual?: boolean; // Requires context for proper application
}

export const DIACRITICS_MAP: Record<string, DiacriticInfo> = {
  // Nasalization markers
  anusvara: {
    phoneme: 'ṃ',
    type: 'nasalization',
    position: 'above',
    scripts: {
      devanagari: 'ं',
      bengali: 'ং',
      gurmukhi: 'ੰ',
      gujarati: 'ં',
      odia: 'ଂ',
      tamil: 'ம்', // Tamil uses ma + virama
      telugu: 'ం',
      kannada: 'ಂ',
      malayalam: 'ം'
    },
    contextual: true
  },
  candrabindu: {
    phoneme: '̃',
    type: 'nasalization',
    position: 'above',
    scripts: {
      devanagari: 'ँ',
      bengali: 'ঁ',
      gurmukhi: 'ਁ',
      gujarati: 'ઁ',
      odia: 'ଁ',
      tamil: '', // Not used in Tamil
      telugu: 'ఁ',
      kannada: 'ಁ',
      malayalam: 'ഁ'
    }
  },
  
  // Aspiration and breath
  visarga: {
    phoneme: 'ḥ',
    type: 'visarga',
    position: 'after',
    scripts: {
      devanagari: 'ः',
      bengali: 'ঃ',
      gurmukhi: 'ਃ',
      gujarati: 'ઃ',
      odia: 'ଃ',
      tamil: 'ஃ',
      telugu: 'ః',
      kannada: 'ಃ',
      malayalam: 'ഃ'
    }
  },
  
  // Nukta variants for foreign sounds
  nukta: {
    phoneme: '̇',
    type: 'nukta',
    position: 'below',
    scripts: {
      devanagari: '़',
      bengali: '়',
      gurmukhi: '਼',
      gujarati: '઼',
      odia: '଼',
      tamil: '', // Not used in Tamil
      telugu: '', // Rare in Telugu
      kannada: '', // Rare in Kannada
      malayalam: '' // Rare in Malayalam
    },
    contextual: true
  },
  
  // Virama (halant) - consonant cluster marker
  virama: {
    phoneme: '',
    type: 'virama',
    position: 'below',
    scripts: {
      devanagari: '्',
      bengali: '্',
      gurmukhi: '੍',
      gujarati: '્',
      odia: '୍',
      tamil: '்',
      telugu: '్',
      kannada: '್',
      malayalam: '്'
    }
  },
  
  // Special markers
  om: {
    phoneme: 'oṃ',
    type: 'special',
    position: 'after',
    scripts: {
      devanagari: 'ॐ',
      bengali: 'ওঁ',
      gurmukhi: 'ੴ',
      gujarati: 'ૐ',
      odia: 'ଓଁ',
      tamil: 'ஓம்',
      telugu: 'ఓం',
      kannada: 'ಓಂ',
      malayalam: 'ഓം'
    }
  },
  
  // Gurmukhi specific
  tippi: {
    phoneme: 'ṃ',
    type: 'nasalization',
    position: 'above',
    scripts: {
      gurmukhi: 'ੰ'
    }
  },
  bindi: {
    phoneme: '̃',
    type: 'nasalization',
    position: 'above',
    scripts: {
      gurmukhi: 'ਁ'
    }
  },
  
  // Malayalam specific - chillu letters
  chillu_n: {
    phoneme: 'n്',
    type: 'special',
    position: 'after',
    scripts: {
      malayalam: 'ൻ'
    }
  },
  chillu_r: {
    phoneme: 'r്',
    type: 'special',
    position: 'after',
    scripts: {
      malayalam: 'ർ'
    }
  },
  chillu_l: {
    phoneme: 'l്',
    type: 'special',
    position: 'after',
    scripts: {
      malayalam: 'ൽ'
    }
  },
  chillu_ll: {
    phoneme: 'ḷ്',
    type: 'special',
    position: 'after',
    scripts: {
      malayalam: 'ൾ'
    }
  },
  chillu_k: {
    phoneme: 'k്',
    type: 'special',
    position: 'after',
    scripts: {
      malayalam: 'ൿ'
    }
  }
};

// Repha flags for different scripts
export const REPHA_INFO: Record<string, { char: string; position: 'pre-base' | 'post-base' }> = {
  devanagari: { char: 'र्', position: 'pre-base' },
  bengali: { char: 'র্', position: 'pre-base' },
  odia: { char: 'ର୍', position: 'pre-base' },
  kannada: { char: 'ರ್', position: 'post-base' },
  malayalam: { char: 'ര്', position: 'post-base' }
};

export function getDiacriticByPhoneme(phoneme: string): DiacriticInfo | undefined {
  return DIACRITICS_MAP[phoneme];
}

export function getDiacriticByScript(char: string, script: string): DiacriticInfo | undefined {
  for (const diacritic of Object.values(DIACRITICS_MAP)) {
    if (diacritic.scripts[script] === char) {
      return diacritic;
    }
  }
  return undefined;
}

export function isRepha(char: string, script: string): boolean {
  const rephaInfo = REPHA_INFO[script];
  return rephaInfo ? rephaInfo.char === char : false;
}

export function isChillu(char: string): boolean {
  const chilluChars = ['ൻ', 'ർ', 'ൽ', 'ൾ', 'ൿ'];
  return chilluChars.includes(char);
}
