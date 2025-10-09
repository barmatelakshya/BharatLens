import { SystemCore } from './SystemCore';
import { ScriptDetectorModule } from './modules/ScriptDetectorModule';
import { OCRRunnerModule } from './modules/OCRRunnerModule';
import { TransliterationEngineModule } from './modules/TransliterationEngineModule';

import { AccessibilityModule } from './modules/AccessibilityModule';

// Singleton system manager
export class SystemManager {
  private static instance: SystemManager;
  private systemCore: SystemCore;
  private initialized = false;

  private constructor() {
    this.systemCore = new SystemCore();
    this.registerModules();
  }

  static getInstance(): SystemManager {
    if (!SystemManager.instance) {
      SystemManager.instance = new SystemManager();
    }
    return SystemManager.instance;
  }

  private registerModules(): void {
    // Register all system modules
    this.systemCore.registerModule(new ScriptDetectorModule());
    this.systemCore.registerModule(new OCRRunnerModule());
    this.systemCore.registerModule(new TransliterationEngineModule());

    this.systemCore.registerModule(new AccessibilityModule());
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.systemCore.initialize();
      this.initialized = true;
      console.log('🚀 BHARATLENS System Ready');
    } catch (error) {
      console.error('System initialization failed:', error);
      throw error;
    }
  }

  // High-level API methods
  async translateText(
    text: string, 
    sourceScript: string, 
    targetScript: string
  ): Promise<any> {
    const transliterationModule = this.systemCore.getModule<TransliterationEngineModule>('transliterationEngine');
    
    if (!transliterationModule) {
      throw new Error('Transliteration module not available');
    }

    return await transliterationModule.process({
      text,
      sourceScript,
      targetScript
    });
  }

  async processImageWithAR(
    imageFile: File,
    targetScript: string
  ): Promise<any> {
    // Convert file to ImageData
    const imageData = await this.fileToImageData(imageFile);
    
    // Process with OCR
    const ocrModule = this.systemCore.getModule<OCRRunnerModule>('ocrRunner');
    if (!ocrModule) throw new Error('OCR module not available');
    
    const ocrResult = await ocrModule.process(imageFile);
    
    // Process with enhanced features
    const enhancedModule = this.systemCore.getModule('enhancedFeatures');
    if (!arModule) throw new Error('AR module not available');
    
    return await arModule.process({
      image: imageData,
      textRegions: ocrResult.regions,
      targetScript
    });
  }

  async detectScript(text: string): Promise<any> {
    const detectorModule = this.systemCore.getModule<ScriptDetectorModule>('scriptDetector');
    
    if (!detectorModule) {
      throw new Error('Script detector module not available');
    }

    return await detectorModule.process(text);
  }

  async accessibilityAction(action: string, data?: any): Promise<any> {
    const accessibilityModule = this.systemCore.getModule<AccessibilityModule>('accessibility');
    
    if (!accessibilityModule) {
      throw new Error('Accessibility module not available');
    }

    return await accessibilityModule.process({ action, data });
  }

  private async fileToImageData(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          resolve(imageData);
        } else {
          reject(new Error('Failed to create ImageData'));
        }
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // System health and diagnostics
  getSystemStatus(): any {
    return {
      initialized: this.initialized,
      modules: {
        scriptDetector: !!this.systemCore.getModule('scriptDetector'),
        ocrRunner: !!this.systemCore.getModule('ocrRunner'),
        transliterationEngine: !!this.systemCore.getModule('transliterationEngine'),
        enhancedFeatures: !!this.systemCore.getModule('enhancedFeatures'),
        accessibility: !!this.systemCore.getModule('accessibility')
      },
      timestamp: new Date().toISOString()
    };
  }

  cleanup(): void {
    this.systemCore.cleanup();
    this.initialized = false;
  }
}

// Export singleton instance
export const systemManager = SystemManager.getInstance();
