// Multi-language AR overlay system
export interface MultiLanguageConfig {
  primaryScript: string;
  secondaryScripts: string[];
  displayMode: 'stacked' | 'swipe' | 'overlay';
  maxScripts: number;
  fontScaling: {
    primary: number;
    secondary: number;
  };
  spacing: number;
}

export interface TransliterationResult {
  script: string;
  text: string;
  confidence: number;
  fontFamily: string;
  color: string;
}

export interface ARTextRegion {
  id: string;
  originalText: string;
  sourceScript: string;
  bbox: { x: number; y: number; width: number; height: number };
  transliterations: TransliterationResult[];
  backgroundStyle: {
    color: string;
    opacity: number;
    borderRadius: number;
  };
}

export class MultiLanguageAREngine {
  private config: MultiLanguageConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(config: MultiLanguageConfig) {
    this.config = config;
  }

  async processImageForMultiLanguageAR(
    imageFile: File,
    transliterator: (text: string, from: string, to: string) => Promise<string>
  ): Promise<{
    canvas: HTMLCanvasElement;
    regions: ARTextRegion[];
  }> {
    
    // Create canvas and load image
    const { canvas, ctx, imageData } = await this.setupCanvas(imageFile);
    this.canvas = canvas;
    this.ctx = ctx;

    // Extract text regions (simplified - in real implementation would use OCR)
    const textRegions = await this.extractTextRegions(imageData);
    
    // Process each region for multi-language transliteration
    const arRegions: ARTextRegion[] = [];
    
    for (const region of textRegions) {
      const arRegion = await this.createMultiLanguageRegion(
        region,
        transliterator
      );
      arRegions.push(arRegion);
    }

    // Render all regions on canvas
    await this.renderMultiLanguageOverlay(arRegions);

    return { canvas, regions: arRegions };
  }

  private async setupCanvas(imageFile: File): Promise<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    imageData: ImageData;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve({ canvas, ctx, imageData });
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private async extractTextRegions(imageData: ImageData): Promise<Array<{
    text: string;
    sourceScript: string;
    bbox: { x: number; y: number; width: number; height: number };
  }>> {
    // Simplified text region extraction
    // In real implementation, this would use OCR with bounding box detection
    return [
      {
        text: 'नमस्ते',
        sourceScript: 'devanagari',
        bbox: { x: 100, y: 50, width: 120, height: 40 }
      },
      {
        text: 'स्वागत',
        sourceScript: 'devanagari', 
        bbox: { x: 100, y: 150, width: 100, height: 35 }
      }
    ];
  }

  private async createMultiLanguageRegion(
    region: { text: string; sourceScript: string; bbox: any },
    transliterator: (text: string, from: string, to: string) => Promise<string>
  ): Promise<ARTextRegion> {
    
    const transliterations: TransliterationResult[] = [];
    
    // Add primary script transliteration
    try {
      const primaryText = await transliterator(region.text, region.sourceScript, this.config.primaryScript);
      transliterations.push({
        script: this.config.primaryScript,
        text: primaryText,
        confidence: 0.95,
        fontFamily: this.getFontFamily(this.config.primaryScript),
        color: this.getTextColor(this.config.primaryScript, true)
      });
    } catch (error) {
      console.error('Primary transliteration failed:', error);
    }

    // Add secondary script transliterations
    for (const script of this.config.secondaryScripts) {
      try {
        const transliteratedText = await transliterator(region.text, region.sourceScript, script);
        transliterations.push({
          script,
          text: transliteratedText,
          confidence: 0.90,
          fontFamily: this.getFontFamily(script),
          color: this.getTextColor(script, false)
        });
      } catch (error) {
        console.error(`Transliteration to ${script} failed:`, error);
      }
    }

    return {
      id: `region_${Date.now()}_${Math.random()}`,
      originalText: region.text,
      sourceScript: region.sourceScript,
      bbox: region.bbox,
      transliterations,
      backgroundStyle: this.getBackgroundStyle(region.bbox)
    };
  }

  private async renderMultiLanguageOverlay(regions: ARTextRegion[]): Promise<void> {
    if (!this.ctx) return;

    for (const region of regions) {
      await this.renderRegion(region);
    }
  }

  private async renderRegion(region: ARTextRegion): Promise<void> {
    if (!this.ctx) return;

    const { bbox, transliterations, backgroundStyle } = region;
    
    switch (this.config.displayMode) {
      case 'stacked':
        await this.renderStackedTransliterations(bbox, transliterations, backgroundStyle);
        break;
      case 'overlay':
        await this.renderOverlayTransliterations(bbox, transliterations, backgroundStyle);
        break;
      case 'swipe':
        // For swipe mode, render only the first transliteration
        await this.renderSingleTransliteration(bbox, transliterations[0], backgroundStyle);
        break;
    }
  }

  private async renderStackedTransliterations(
    bbox: any,
    transliterations: TransliterationResult[],
    backgroundStyle: any
  ): Promise<void> {
    if (!this.ctx) return;

    const totalHeight = transliterations.length * (bbox.height + this.config.spacing);
    const startY = bbox.y;

    // Draw background
    this.ctx.fillStyle = backgroundStyle.color;
    this.ctx.globalAlpha = backgroundStyle.opacity;
    this.ctx.fillRect(bbox.x - 5, startY - 5, bbox.width + 10, totalHeight + 10);
    this.ctx.globalAlpha = 1.0;

    // Draw each transliteration
    transliterations.forEach((trans, index) => {
      const y = startY + (index * (bbox.height + this.config.spacing));
      const fontSize = index === 0 ? 
        bbox.height * this.config.fontScaling.primary : 
        bbox.height * this.config.fontScaling.secondary;

      this.ctx!.font = `${fontSize}px ${trans.fontFamily}`;
      this.ctx!.fillStyle = trans.color;
      this.ctx!.fillText(trans.text, bbox.x, y + fontSize);

      // Add script label
      this.ctx!.font = `${fontSize * 0.6}px Arial`;
      this.ctx!.fillStyle = '#666';
      this.ctx!.fillText(trans.script.toUpperCase(), bbox.x + bbox.width + 5, y + fontSize);
    });
  }

  private async renderOverlayTransliterations(
    bbox: any,
    transliterations: TransliterationResult[],
    backgroundStyle: any
  ): Promise<void> {
    if (!this.ctx) return;

    // Render transliterations with slight offsets
    transliterations.forEach((trans, index) => {
      const offsetX = index * 2;
      const offsetY = index * 2;
      const fontSize = bbox.height * (index === 0 ? this.config.fontScaling.primary : this.config.fontScaling.secondary);

      // Background for each transliteration
      this.ctx!.fillStyle = backgroundStyle.color;
      this.ctx!.globalAlpha = backgroundStyle.opacity * (1 - index * 0.1);
      this.ctx!.fillRect(bbox.x + offsetX - 3, bbox.y + offsetY - 3, bbox.width + 6, bbox.height + 6);
      this.ctx!.globalAlpha = 1.0;

      // Text
      this.ctx!.font = `${fontSize}px ${trans.fontFamily}`;
      this.ctx!.fillStyle = trans.color;
      this.ctx!.fillText(trans.text, bbox.x + offsetX, bbox.y + offsetY + fontSize);
    });
  }

  private async renderSingleTransliteration(
    bbox: any,
    transliteration: TransliterationResult,
    backgroundStyle: any
  ): Promise<void> {
    if (!this.ctx || !transliteration) return;

    const fontSize = bbox.height * this.config.fontScaling.primary;

    // Background
    this.ctx.fillStyle = backgroundStyle.color;
    this.ctx.globalAlpha = backgroundStyle.opacity;
    this.ctx.fillRect(bbox.x - 3, bbox.y - 3, bbox.width + 6, bbox.height + 6);
    this.ctx.globalAlpha = 1.0;

    // Text
    this.ctx.font = `${fontSize}px ${transliteration.fontFamily}`;
    this.ctx.fillStyle = transliteration.color;
    this.ctx.fillText(transliteration.text, bbox.x, bbox.y + fontSize);
  }

  private getFontFamily(script: string): string {
    const fontMap: Record<string, string> = {
      devanagari: 'Noto Sans Devanagari, Arial Unicode MS',
      tamil: 'Noto Sans Tamil, Arial Unicode MS',
      bengali: 'Noto Sans Bengali, Arial Unicode MS',
      telugu: 'Noto Sans Telugu, Arial Unicode MS',
      kannada: 'Noto Sans Kannada, Arial Unicode MS',
      malayalam: 'Noto Sans Malayalam, Arial Unicode MS',
      gujarati: 'Noto Sans Gujarati, Arial Unicode MS',
      gurmukhi: 'Noto Sans Gurmukhi, Arial Unicode MS',
      odia: 'Noto Sans Oriya, Arial Unicode MS',
      romanization: 'Arial, sans-serif'
    };
    return fontMap[script] || 'Arial Unicode MS, sans-serif';
  }

  private getTextColor(script: string, isPrimary: boolean): string {
    if (isPrimary) {
      return '#000000'; // Black for primary
    }
    
    // Different colors for secondary scripts
    const colorMap: Record<string, string> = {
      devanagari: '#1a365d',
      tamil: '#744210',
      bengali: '#2d3748',
      telugu: '#553c9a',
      kannada: '#c53030',
      malayalam: '#38a169',
      gujarati: '#d69e2e',
      gurmukhi: '#3182ce',
      odia: '#805ad5',
      romanization: '#4a5568'
    };
    
    return colorMap[script] || '#4a5568';
  }

  private getBackgroundStyle(bbox: any): any {
    return {
      color: 'rgba(255, 255, 255, 0.9)',
      opacity: 0.9,
      borderRadius: 4
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<MultiLanguageConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): MultiLanguageConfig {
    return { ...this.config };
  }
}

// Default configuration
export const DEFAULT_MULTILANG_CONFIG: MultiLanguageConfig = {
  primaryScript: 'devanagari',
  secondaryScripts: ['tamil', 'romanization'],
  displayMode: 'stacked',
  maxScripts: 3,
  fontScaling: {
    primary: 1.0,
    secondary: 0.8
  },
  spacing: 5
};

// Utility function to create multi-language AR engine
export function createMultiLanguageAR(config?: Partial<MultiLanguageConfig>): MultiLanguageAREngine {
  const finalConfig = { ...DEFAULT_MULTILANG_CONFIG, ...config };
  return new MultiLanguageAREngine(finalConfig);
}
