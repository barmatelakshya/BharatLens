import { IModule } from '../SystemCore';
import { ARCHITECTURE_CONFIG } from '../../config/architecture';

export interface TextRegion {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  confidence: number;
  transliterated?: string;
}

export class AROverlayModule implements IModule {
  name = 'arOverlay';
  version = '1.0.0';
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async initialize(): Promise<void> {
    // Initialize AR overlay canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    console.log('AR overlay module initialized');
  }

  async process(input: {
    image: ImageData;
    textRegions: TextRegion[];
    targetScript: string;
  }): Promise<{
    overlayCanvas: HTMLCanvasElement;
    regions: TextRegion[];
  }> {
    const { image, textRegions, targetScript } = input;

    if (!this.canvas || !this.ctx) {
      throw new Error('AR overlay not initialized');
    }

    // Set canvas size to match image
    this.canvas.width = image.width;
    this.canvas.height = image.height;

    // Draw original image
    this.ctx.putImageData(image, 0, 0);

    // Process each text region
    const processedRegions = await Promise.all(
      textRegions.map(region => this.processTextRegion(region, targetScript))
    );

    // Apply perspective correction and render overlays
    for (const region of processedRegions) {
      await this.renderTextOverlay(region);
    }

    return {
      overlayCanvas: this.canvas,
      regions: processedRegions
    };
  }

  private async processTextRegion(region: TextRegion, targetScript: string): Promise<TextRegion> {
    // Perspective correction
    const correctedRegion = this.correctPerspective(region);
    
    // Font matching and contrast analysis
    const renderingOptions = this.analyzeTextStyle(correctedRegion);
    
    return {
      ...correctedRegion,
      renderingOptions
    };
  }

  private correctPerspective(region: TextRegion): TextRegion {
    // Apply perspective correction to text region
    const { bbox } = region;
    
    // Calculate perspective transform (simplified)
    const width = bbox.x1 - bbox.x0;
    const height = bbox.y1 - bbox.y0;
    
    // For now, return as-is (full implementation would use computer vision)
    return region;
  }

  private analyzeTextStyle(region: TextRegion): any {
    // Analyze original text for font matching and contrast
    const { bbox } = region;
    
    if (!this.ctx) return {};

    // Sample pixels around text region for background color
    const imageData = this.ctx.getImageData(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
    const backgroundColor = this.getAverageColor(imageData);
    
    // Determine contrast-aware text color
    const textColor = this.getContrastColor(backgroundColor);
    
    // Estimate font size based on region height
    const fontSize = Math.max(12, (bbox.y1 - bbox.y0) * 0.8);
    
    return {
      backgroundColor,
      textColor,
      fontSize,
      fontFamily: 'Arial, sans-serif' // Could be enhanced with font detection
    };
  }

  private getAverageColor(imageData: ImageData): string {
    const data = imageData.data;
    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  private getContrastColor(backgroundColor: string): string {
    // Simple contrast calculation
    const rgb = backgroundColor.match(/\d+/g);
    if (!rgb) return '#000000';
    
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  private async renderTextOverlay(region: TextRegion & { renderingOptions?: any }): Promise<void> {
    if (!this.ctx || !region.transliterated) return;

    const { bbox, transliterated, renderingOptions = {} } = region;
    const { textColor = '#000000', fontSize = 16, fontFamily = 'Arial' } = renderingOptions;

    // Set font and style
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    // Add background for better readability
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(bbox.x0 - 2, bbox.y0 - 2, bbox.x1 - bbox.x0 + 4, bbox.y1 - bbox.y0 + 4);

    // Render transliterated text
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(transliterated, bbox.x0, bbox.y0);
  }

  cleanup(): void {
    this.canvas = null;
    this.ctx = null;
  }
}
