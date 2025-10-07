// Vowel system with independent vowels and dependent matras
export interface VowelInfo {
  phoneme: string;
  length: 'short' | 'long';
  position: 'pre-base' | 'post-base' | 'above-base' | 'below-base' | 'around-base';
  independent: Record<string, string>; // Independent vowel forms
  dependent: Record<string, string>;   // Matra forms
}

export const VOWEL_MAP: Record<string, VowelInfo> = {
  a: {
    phoneme: 'a',
    length: 'short',
    position: 'post-base',
    independent: {
      devanagari: 'अ',
      bengali: 'অ',
      gurmukhi: 'ਅ',
      gujarati: 'અ',
      odia: 'ଅ',
      tamil: 'அ',
      telugu: 'అ',
      kannada: 'ಅ',
      malayalam: 'അ'
    },
    dependent: {
      // Inherent vowel - no matra needed
      devanagari: '',
      bengali: '',
      gurmukhi: '',
      gujarati: '',
      odia: '',
      tamil: '',
      telugu: '',
      kannada: '',
      malayalam: ''
    }
  },
  aa: {
    phoneme: 'ā',
    length: 'long',
    position: 'post-base',
    independent: {
      devanagari: 'आ',
      bengali: 'আ',
      gurmukhi: 'ਆ',
      gujarati: 'આ',
      odia: 'ଆ',
      tamil: 'ஆ',
      telugu: 'ఆ',
      kannada: 'ಆ',
      malayalam: 'ആ'
    },
    dependent: {
      devanagari: 'ा',
      bengali: 'া',
      gurmukhi: 'ਾ',
      gujarati: 'ા',
      odia: 'ା',
      tamil: 'ா',
      telugu: 'ా',
      kannada: 'ಾ',
      malayalam: 'ാ'
    }
  },
  i: {
    phoneme: 'i',
    length: 'short',
    position: 'pre-base', // Bengali/Assamese specific
    independent: {
      devanagari: 'इ',
      bengali: 'ই',
      gurmukhi: 'ਇ',
      gujarati: 'ઇ',
      odia: 'ଇ',
      tamil: 'இ',
      telugu: 'ఇ',
      kannada: 'ಇ',
      malayalam: 'ഇ'
    },
    dependent: {
      devanagari: 'ि',
      bengali: 'ি', // Pre-base in Bengali
      gurmukhi: 'ਿ',
      gujarati: 'િ',
      odia: 'ି',
      tamil: 'ி',
      telugu: 'ి',
      kannada: 'ಿ',
      malayalam: 'ി'
    }
  },
  ii: {
    phoneme: 'ī',
    length: 'long',
    position: 'pre-base',
    independent: {
      devanagari: 'ई',
      bengali: 'ঈ',
      gurmukhi: 'ਈ',
      gujarati: 'ઈ',
      odia: 'ଈ',
      tamil: 'ஈ',
      telugu: 'ఈ',
      kannada: 'ಈ',
      malayalam: 'ഈ'
    },
    dependent: {
      devanagari: 'ी',
      bengali: 'ী',
      gurmukhi: 'ੀ',
      gujarati: 'ી',
      odia: 'ୀ',
      tamil: 'ீ',
      telugu: 'ీ',
      kannada: 'ೀ',
      malayalam: 'ീ'
    }
  },
  u: {
    phoneme: 'u',
    length: 'short',
    position: 'below-base',
    independent: {
      devanagari: 'उ',
      bengali: 'উ',
      gurmukhi: 'ਉ',
      gujarati: 'ઉ',
      odia: 'ଉ',
      tamil: 'உ',
      telugu: 'ఉ',
      kannada: 'ಉ',
      malayalam: 'ഉ'
    },
    dependent: {
      devanagari: 'ु',
      bengali: 'ু',
      gurmukhi: 'ੁ',
      gujarati: 'ુ',
      odia: 'ୁ',
      tamil: 'ு',
      telugu: 'ు',
      kannada: 'ು',
      malayalam: 'ു'
    }
  },
  uu: {
    phoneme: 'ū',
    length: 'long',
    position: 'below-base',
    independent: {
      devanagari: 'ऊ',
      bengali: 'ঊ',
      gurmukhi: 'ਊ',
      gujarati: 'ઊ',
      odia: 'ଊ',
      tamil: 'ஊ',
      telugu: 'ఊ',
      kannada: 'ಊ',
      malayalam: 'ഊ'
    },
    dependent: {
      devanagari: 'ू',
      bengali: 'ূ',
      gurmukhi: 'ੂ',
      gujarati: 'ૂ',
      odia: 'ୂ',
      tamil: 'ூ',
      telugu: 'ూ',
      kannada: 'ೂ',
      malayalam: 'ൂ'
    }
  },
  e: {
    phoneme: 'e',
    length: 'long',
    position: 'above-base',
    independent: {
      devanagari: 'ए',
      bengali: 'এ',
      gurmukhi: 'ਏ',
      gujarati: 'એ',
      odia: 'ଏ',
      tamil: 'ஏ',
      telugu: 'ఏ',
      kannada: 'ಏ',
      malayalam: 'ഏ'
    },
    dependent: {
      devanagari: 'े',
      bengali: 'ে',
      gurmukhi: 'ੇ',
      gujarati: 'ે',
      odia: 'େ',
      tamil: 'ே',
      telugu: 'ే',
      kannada: 'ೇ',
      malayalam: 'േ'
    }
  },
  o: {
    phoneme: 'o',
    length: 'long',
    position: 'around-base', // Complex positioning
    independent: {
      devanagari: 'ओ',
      bengali: 'ও',
      gurmukhi: 'ਓ',
      gujarati: 'ઓ',
      odia: 'ଓ',
      tamil: 'ஓ',
      telugu: 'ఓ',
      kannada: 'ಓ',
      malayalam: 'ഓ'
    },
    dependent: {
      devanagari: 'ो',
      bengali: 'ো',
      gurmukhi: 'ੋ',
      gujarati: 'ો',
      odia: 'ୋ',
      tamil: 'ோ',
      telugu: 'ో',
      kannada: 'ೋ',
      malayalam: 'ോ'
    }
  }
};

export function getVowelByPhoneme(phoneme: string): VowelInfo | undefined {
  return VOWEL_MAP[phoneme];
}

export function getVowelByScript(char: string, script: string, isIndependent: boolean): VowelInfo | undefined {
  for (const vowel of Object.values(VOWEL_MAP)) {
    const target = isIndependent ? vowel.independent[script] : vowel.dependent[script];
    if (target === char) {
      return vowel;
    }
  }
  return undefined;
}

export function isPreBaseVowel(vowel: VowelInfo, script: string): boolean {
  return vowel.position === 'pre-base' && (script === 'bengali' || script === 'assamese');
}
