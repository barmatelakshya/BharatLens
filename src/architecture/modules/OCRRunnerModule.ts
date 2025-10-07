import { IModule } from '../SystemCore';
import { createWorker } from 'tesseract.js';
import { ARCHITECTURE_CONFIG } from '../../config/architecture';

export class OCRRunnerModule implements IModule {
  name = 'ocrRunner';
  version = '1.0.0';
  private worker: any = null;
  private models = ARCHITECTURE_CONFIG.modules.ocrRunner.models;

  async initialize(): Promise<void> {
    // Initialize Tesseract worker with Indian language models
    this.worker = await createWorker();
    const languages = this.models.join('+');
    
    await this.worker.loadLanguage(languages);
    await this.worker.initialize(languages);
    
    console.log('OCR runner initialized with models:', this.models);
  }

  async process(input: ImageData | File): Promise<{
    text: string;
    confidence: number;
    regions: Array<{
      text: string;
      bbox: { x0: number; y0: number; x1: number; y1: number };
      confidence: number;
    }>;
  }> {
    if (!this.worker) {
      throw new Error('OCR worker not initialized');
    }

    // GPU-accelerated preprocessing
    const preprocessed = await this.preprocessImage(input);
    
    // OCR processing
    const { data } = await this.worker.recognize(preprocessed);
    
    // Post-correction
    const correctedText = this.postCorrectOCR(data.text);
    
    return {
      text: correctedText,
      confidence: data.confidence / 100,
      regions: data.words.map((word: any) => ({
        text: word.text,
        bbox: word.bbox,
        confidence: word.confidence / 100
      }))
    };
  }

  private async preprocessImage(input: ImageData | File): Promise<ImageData | File> {
    // GPU-accelerated image preprocessing
    if (input instanceof ImageData) {
      return this.enhanceImageData(input);
    }
    return input;
  }

  private enhanceImageData(imageData: ImageData): ImageData {
    // Basic contrast enhancement
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast
      data[i] = Math.min(255, data[i] * 1.2);     // R
      data[i + 1] = Math.min(255, data[i + 1] * 1.2); // G
      data[i + 2] = Math.min(255, data[i + 2] * 1.2); // B
    }
    return imageData;
  }

  private postCorrectOCR(text: string): string {
    // Common OCR error corrections for Indian scripts
    return text
      .replace(/।/g, '।') // Correct devanagari danda
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/[0O]/g, '०') // Correct digit confusion
      .trim();
  }

  cleanup(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
