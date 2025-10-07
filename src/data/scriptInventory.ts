// Complete script inventory with Unicode ranges and metadata
export interface ScriptInfo {
  name: string;
  unicodeRange: [number, number];
  direction: 'ltr' | 'rtl';
  hasConjuncts: boolean;
  hasMatras: boolean;
  inherentVowel: string;
  virama: string;
}

export const SCRIPT_INVENTORY: Record<string, ScriptInfo> = {
  devanagari: {
    name: 'Devanagari',
    unicodeRange: [0x0900, 0x097F],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u094D'
  },
  bengali: {
    name: 'Bengali-Assamese',
    unicodeRange: [0x0980, 0x09FF],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u09CD'
  },
  gurmukhi: {
    name: 'Gurmukhi',
    unicodeRange: [0x0A00, 0x0A7F],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0A4D'
  },
  gujarati: {
    name: 'Gujarati',
    unicodeRange: [0x0A80, 0x0AFF],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0ACD'
  },
  odia: {
    name: 'Odia',
    unicodeRange: [0x0B00, 0x0B7F],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0B4D'
  },
  tamil: {
    name: 'Tamil',
    unicodeRange: [0x0B80, 0x0BFF],
    direction: 'ltr',
    hasConjuncts: false,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0BCD'
  },
  telugu: {
    name: 'Telugu',
    unicodeRange: [0x0C00, 0x0C7F],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0C4D'
  },
  kannada: {
    name: 'Kannada',
    unicodeRange: [0x0C80, 0x0CFF],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0CCD'
  },
  malayalam: {
    name: 'Malayalam',
    unicodeRange: [0x0D00, 0x0D7F],
    direction: 'ltr',
    hasConjuncts: true,
    hasMatras: true,
    inherentVowel: 'a',
    virama: '\u0D4D'
  },
  romanization: {
    name: 'Romanization',
    unicodeRange: [0x0000, 0x007F],
    direction: 'ltr',
    hasConjuncts: false,
    hasMatras: false,
    inherentVowel: '',
    virama: ''
  }
};

export function getScriptInfo(script: string): ScriptInfo | undefined {
  return SCRIPT_INVENTORY[script];
}

export function isCharInScript(char: string, script: string): boolean {
  const info = getScriptInfo(script);
  if (!info) return false;
  
  const code = char.codePointAt(0);
  if (!code) return false;
  
  return code >= info.unicodeRange[0] && code <= info.unicodeRange[1];
}
