import { ARCHITECTURE_CONFIG } from '../config/architecture';

// Base module interface
export interface IModule {
  name: string;
  version: string;
  initialize(): Promise<void>;
  process(input: any): Promise<any>;
  cleanup(): void;
}

// System core orchestrator
export class SystemCore {
  private modules: Map<string, IModule> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing BHARATLENS System...');
    
    // Initialize modules in dependency order
    const moduleOrder = [
      'scriptDetector',
      'ocrRunner', 
      'transliterationEngine',
      'enhancedFeatures',
      'accessibility'
    ];

    for (const moduleName of moduleOrder) {
      const module = this.modules.get(moduleName);
      if (module) {
        await module.initialize();
        console.log(`✓ ${moduleName} initialized`);
      }
    }

    this.initialized = true;
    console.log('System initialization complete');
  }

  registerModule(module: IModule): void {
    this.modules.set(module.name, module);
  }

  getModule<T extends IModule>(name: string): T | undefined {
    return this.modules.get(name) as T;
  }

  async processText(text: string, options: any = {}): Promise<any> {
    if (!this.initialized) {
      throw new Error('System not initialized');
    }

    const pipeline = ARCHITECTURE_CONFIG.modules.transliterationEngine.pipeline;
    let result = text;

    for (const step of pipeline) {
      const module = this.modules.get(step);
      if (module) {
        result = await module.process(result);
      }
    }

    return result;
  }

  async processImage(imageData: ImageData, options: any = {}): Promise<any> {
    const ocrModule = this.modules.get('ocrRunner');
    const enhancedModule = this.modules.get('enhancedFeatures');

    if (!ocrModule || !arModule) {
      throw new Error('Required modules not available');
    }

    // OCR processing
    const ocrResult = await ocrModule.process(imageData);
    
    // Enhanced features processing
    const arResult = await arModule.process({
      image: imageData,
      textRegions: ocrResult.regions,
      ...options
    });

    return arResult;
  }

  cleanup(): void {
    for (const module of this.modules.values()) {
      module.cleanup();
    }
    this.modules.clear();
    this.initialized = false;
  }
}
