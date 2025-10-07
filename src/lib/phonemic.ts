// Phonemic intermediate representation (ISO 15919 based)
export interface PhonemeMap {
  consonants: Record<string, string>;
  vowels: Record<string, string>;
  modifiers: Record<string, string>;
}

export const phoneticMap: Record<string, PhonemeMap> = {
  devanagari: {
    consonants: {
      'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
      'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
      'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
      'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
      'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
      'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
      'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
      'क्ष': 'kṣa', 'त्र': 'tra', 'ज्ञ': 'jña'
    },
    vowels: {
      'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
      'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ॡ': 'ḹ',
      'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
      'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
      'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
      'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
    },
    modifiers: {
      'ं': 'ṃ', 'ँ': '̃', 'ः': 'ḥ', '्': '', 'ॐ': 'oṃ'
    }
  }
};

export function toPhonemic(text: string, script: string): string {
  const map = phoneticMap[script];
  if (!map) return text;
  
  let result = '';
  for (const char of text) {
    result += map.consonants[char] || map.vowels[char] || map.modifiers[char] || char;
  }
  
  return result;
}

export function fromPhonemic(phonemic: string, targetScript: string): string {
  const map = phoneticMap[targetScript];
  if (!map) return phonemic;
  
  // Reverse mapping from phonemic to target script
  const reverseMap: Record<string, string> = {};
  
  Object.entries(map.consonants).forEach(([char, phone]) => {
    reverseMap[phone] = char;
  });
  Object.entries(map.vowels).forEach(([char, phone]) => {
    reverseMap[phone] = char;
  });
  Object.entries(map.modifiers).forEach(([char, phone]) => {
    reverseMap[phone] = char;
  });
  
  let result = phonemic;
  // Sort by length (longest first) to avoid partial matches
  const sortedKeys = Object.keys(reverseMap).sort((a, b) => b.length - a.length);
  
  for (const phone of sortedKeys) {
    result = result.replace(new RegExp(phone, 'g'), reverseMap[phone]);
  }
  
  return result;
}
