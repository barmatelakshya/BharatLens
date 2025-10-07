// Consonant classification by place and manner of articulation
export interface ConsonantInfo {
  phoneme: string;
  place: 'velar' | 'palatal' | 'retroflex' | 'dental' | 'labial';
  manner: 'stop' | 'nasal' | 'fricative' | 'approximant' | 'lateral';
  voicing: 'voiced' | 'voiceless';
  aspiration: 'aspirated' | 'unaspirated';
  scripts: Record<string, string>;
}

export const CONSONANT_MAP: Record<string, ConsonantInfo> = {
  // Velars
  ka: {
    phoneme: 'ka',
    place: 'velar',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'क',
      bengali: 'ক',
      gurmukhi: 'ਕ',
      gujarati: 'ક',
      odia: 'କ',
      tamil: 'க',
      telugu: 'క',
      kannada: 'ಕ',
      malayalam: 'ക'
    }
  },
  kha: {
    phoneme: 'kha',
    place: 'velar',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'aspirated',
    scripts: {
      devanagari: 'ख',
      bengali: 'খ',
      gurmukhi: 'ਖ',
      gujarati: 'ખ',
      odia: 'ଖ',
      tamil: 'க', // Tamil merges with ka
      telugu: 'ఖ',
      kannada: 'ಖ',
      malayalam: 'ഖ'
    }
  },
  ga: {
    phoneme: 'ga',
    place: 'velar',
    manner: 'stop',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'ग',
      bengali: 'গ',
      gurmukhi: 'ਗ',
      gujarati: 'ગ',
      odia: 'ଗ',
      tamil: 'க', // Tamil merges with ka
      telugu: 'గ',
      kannada: 'ಗ',
      malayalam: 'ഗ'
    }
  },
  gha: {
    phoneme: 'gha',
    place: 'velar',
    manner: 'stop',
    voicing: 'voiced',
    aspiration: 'aspirated',
    scripts: {
      devanagari: 'घ',
      bengali: 'ঘ',
      gurmukhi: 'ਘ',
      gujarati: 'ઘ',
      odia: 'ଘ',
      tamil: 'க', // Tamil merges with ka
      telugu: 'ఘ',
      kannada: 'ಘ',
      malayalam: 'ഘ'
    }
  },
  nga: {
    phoneme: 'ṅa',
    place: 'velar',
    manner: 'nasal',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'ङ',
      bengali: 'ঙ',
      gurmukhi: 'ਙ',
      gujarati: 'ઙ',
      odia: 'ଙ',
      tamil: 'ங',
      telugu: 'ఙ',
      kannada: 'ಙ',
      malayalam: 'ങ'
    }
  },
  
  // Palatals
  ca: {
    phoneme: 'ca',
    place: 'palatal',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'च',
      bengali: 'চ',
      gurmukhi: 'ਚ',
      gujarati: 'ચ',
      odia: 'ଚ',
      tamil: 'ச',
      telugu: 'చ',
      kannada: 'ಚ',
      malayalam: 'ച'
    }
  },
  
  // Retroflexes
  Ta: {
    phoneme: 'ṭa',
    place: 'retroflex',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'ट',
      bengali: 'ট',
      gurmukhi: 'ਟ',
      gujarati: 'ટ',
      odia: 'ଟ',
      tamil: 'ட',
      telugu: 'ట',
      kannada: 'ಟ',
      malayalam: 'ട'
    }
  },
  
  // Dentals
  ta: {
    phoneme: 'ta',
    place: 'dental',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'त',
      bengali: 'ত',
      gurmukhi: 'ਤ',
      gujarati: 'ત',
      odia: 'ତ',
      tamil: 'த',
      telugu: 'త',
      kannada: 'ತ',
      malayalam: 'ത'
    }
  },
  
  // Labials
  pa: {
    phoneme: 'pa',
    place: 'labial',
    manner: 'stop',
    voicing: 'voiceless',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'प',
      bengali: 'প',
      gurmukhi: 'ਪ',
      gujarati: 'પ',
      odia: 'ପ',
      tamil: 'ப',
      telugu: 'ప',
      kannada: 'ಪ',
      malayalam: 'പ'
    }
  },
  
  // Approximants
  ya: {
    phoneme: 'ya',
    place: 'palatal',
    manner: 'approximant',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'य',
      bengali: 'য',
      gurmukhi: 'ਯ',
      gujarati: 'ય',
      odia: 'ଯ',
      tamil: 'ய',
      telugu: 'య',
      kannada: 'ಯ',
      malayalam: 'യ'
    }
  },
  ra: {
    phoneme: 'ra',
    place: 'retroflex',
    manner: 'approximant',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'र',
      bengali: 'র',
      gurmukhi: 'ਰ',
      gujarati: 'ર',
      odia: 'ର',
      tamil: 'ர',
      telugu: 'ర',
      kannada: 'ರ',
      malayalam: 'ര'
    }
  },
  la: {
    phoneme: 'la',
    place: 'dental',
    manner: 'lateral',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'ल',
      bengali: 'ল',
      gurmukhi: 'ਲ',
      gujarati: 'લ',
      odia: 'ଲ',
      tamil: 'ல',
      telugu: 'ల',
      kannada: 'ಲ',
      malayalam: 'ല'
    }
  },
  va: {
    phoneme: 'va',
    place: 'labial',
    manner: 'approximant',
    voicing: 'voiced',
    aspiration: 'unaspirated',
    scripts: {
      devanagari: 'व',
      bengali: 'ব',
      gurmukhi: 'ਵ',
      gujarati: 'વ',
      odia: 'ଵ',
      tamil: 'வ',
      telugu: 'వ',
      kannada: 'ವ',
      malayalam: 'വ'
    }
  }
};

export function getConsonantByPhoneme(phoneme: string): ConsonantInfo | undefined {
  return CONSONANT_MAP[phoneme];
}

export function getConsonantByScript(char: string, script: string): ConsonantInfo | undefined {
  for (const consonant of Object.values(CONSONANT_MAP)) {
    if (consonant.scripts[script] === char) {
      return consonant;
    }
  }
  return undefined;
}
