import { createWorker } from 'tesseract.js';

const scriptLanguages: Record<string, string> = {
  devanagari: 'hin+san+mar+nep',
  bengali: 'ben',
  gurmukhi: 'pan',
  gujarati: 'guj',
  odia: 'ori',
  tamil: 'tam',
  telugu: 'tel',
  kannada: 'kan',
  malayalam: 'mal'
};

export async function extractTextFromImage(imageFile: File, script?: string): Promise<string> {
  const worker = await createWorker();
  
  try {
    const languages = script ? scriptLanguages[script] : 'hin+ben+tam+tel+kan+mal+guj+pan+ori';
    await worker.loadLanguage(languages);
    await worker.initialize(languages);
    
    const { data: { text } } = await worker.recognize(imageFile);
    return postCorrectOCR(text);
  } finally {
    await worker.terminate();
  }
}

function postCorrectOCR(text: string): string {
  // Common OCR error corrections
  return text
    .replace(/।/g, '।') // Correct devanagari danda
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

export async function processImageWithOverlay(imageFile: File): Promise<{
  originalImage: string;
  textRegions: Array<{x: number, y: number, width: number, height: number, text: string}>;
}> {
  const worker = await createWorker();
  
  try {
    await worker.loadLanguage('hin+ben+tam+tel+kan+mal+guj+pan+ori');
    await worker.initialize('hin+ben+tam+tel+kan+mal+guj+pan+ori');
    
    const { data } = await worker.recognize(imageFile);
    const imageUrl = URL.createObjectURL(imageFile);
    
    const textRegions = data.words.map(word => ({
      x: word.bbox.x0,
      y: word.bbox.y0,
      width: word.bbox.x1 - word.bbox.x0,
      height: word.bbox.y1 - word.bbox.y0,
      text: word.text
    }));
    
    return { originalImage: imageUrl, textRegions };
  } finally {
    await worker.terminate();
  }
}
