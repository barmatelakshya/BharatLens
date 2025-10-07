import { EnhancedTransliterationEngine } from './enhancedTransliteration';

// Unicode ranges for Indian scripts
const scriptRanges = {
  devanagari: [0x0900, 0x097F],
  bengali: [0x0980, 0x09FF],
  gurmukhi: [0x0A00, 0x0A7F],
  gujarati: [0x0A80, 0x0AFF],
  odia: [0x0B00, 0x0B7F],
  tamil: [0x0B80, 0x0BFF],
  telugu: [0x0C00, 0x0C7F],
  kannada: [0x0C80, 0x0CFF],
  malayalam: [0x0D00, 0x0D7F]
};

export function detectScript(text: string): string {
  const scriptCounts: Record<string, number> = {};
  
  for (const char of text) {
    const code = char.codePointAt(0);
    if (!code) continue;
    
    for (const [script, [start, end]] of Object.entries(scriptRanges)) {
      if (code >= start && code <= end) {
        scriptCounts[script] = (scriptCounts[script] || 0) + 1;
      }
    }
  }
  
  const detected = Object.entries(scriptCounts).sort(([,a], [,b]) => b - a)[0];
  return detected ? detected[0] : 'devanagari';
}

export function romanize(text: string, script: string): string {
  const engine = new EnhancedTransliterationEngine();
  return engine.getRomanization(text, script);
}

// Enhanced detection with confidence scoring
export function detectScriptWithConfidence(text: string): {
  script: string;
  confidence: number;
  alternatives: Array<{script: string; confidence: number}>;
} {
  const scriptCounts: Record<string, number> = {};
  let totalChars = 0;
  
  for (const char of text) {
    const code = char.codePointAt(0);
    if (!code) continue;
    
    let found = false;
    for (const [script, [start, end]] of Object.entries(scriptRanges)) {
      if (code >= start && code <= end) {
        scriptCounts[script] = (scriptCounts[script] || 0) + 1;
        totalChars++;
        found = true;
        break;
      }
    }
  }
  
  if (totalChars === 0) {
    return {
      script: 'devanagari',
      confidence: 0,
      alternatives: []
    };
  }
  
  const sorted = Object.entries(scriptCounts)
    .map(([script, count]) => ({
      script,
      confidence: count / totalChars
    }))
    .sort((a, b) => b.confidence - a.confidence);
  
  return {
    script: sorted[0]?.script || 'devanagari',
    confidence: sorted[0]?.confidence || 0,
    alternatives: sorted.slice(1, 4)
  };
}
