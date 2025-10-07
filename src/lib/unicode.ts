// Unicode normalization for Indian scripts
export function normalizeText(text: string): string {
  // NFC normalization for canonical composition
  let normalized = text.normalize('NFC');
  
  // Remove zero-width joiners when safe
  normalized = normalized.replace(/\u200D/g, '');
  
  // Standardize nukta composition
  normalized = normalized.replace(/\u093C/g, '\u093C'); // Devanagari nukta
  
  return normalized;
}

// Grapheme segmentation for aksharas
export function segmentAksharas(text: string): string[] {
  const aksharas: string[] = [];
  let current = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.codePointAt(0) || 0;
    
    // Check if it's a combining mark or dependent vowel
    if (isCombiningMark(code) || isDependentVowel(code)) {
      current += char;
    } else if (isVirama(code)) {
      current += char;
      // Look ahead for conjunct
      if (i + 1 < text.length && isConsonant(text[i + 1].codePointAt(0) || 0)) {
        continue;
      }
    } else {
      if (current) aksharas.push(current);
      current = char;
    }
  }
  
  if (current) aksharas.push(current);
  return aksharas;
}

function isCombiningMark(code: number): boolean {
  return (code >= 0x0300 && code <= 0x036F) || // Combining diacriticals
         (code >= 0x093C && code <= 0x094F) || // Devanagari combining
         (code >= 0x09BC && code <= 0x09C4); // Bengali combining
}

function isDependentVowel(code: number): boolean {
  return (code >= 0x093E && code <= 0x094C) || // Devanagari matras
         (code >= 0x09BE && code <= 0x09CC); // Bengali matras
}

function isVirama(code: number): boolean {
  return code === 0x094D || // Devanagari virama
         code === 0x09CD || // Bengali hasant
         code === 0x0A4D || // Gurmukhi adak bindi
         code === 0x0ACD; // Gujarati virama
}

function isConsonant(code: number): boolean {
  return (code >= 0x0915 && code <= 0x0939) || // Devanagari consonants
         (code >= 0x0995 && code <= 0x09B9); // Bengali consonants
}
