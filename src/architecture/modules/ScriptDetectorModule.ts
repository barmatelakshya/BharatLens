import { IModule } from '../SystemCore';
import { detectScriptWithConfidence } from '../../lib/scriptDetection';
import { ARCHITECTURE_CONFIG } from '../../config/architecture';

export class ScriptDetectorModule implements IModule {
  name = 'scriptDetector';
  version = '1.0.0';
  private confidence = ARCHITECTURE_CONFIG.modules.scriptDetector.confidence;

  async initialize(): Promise<void> {
    // Load script detection models/rules
    console.log('Script detector ready');
  }

  async process(input: string): Promise<{
    script: string;
    confidence: number;
    alternatives: Array<{script: string; confidence: number}>;
  }> {
    const result = detectScriptWithConfidence(input);
    
    // Apply confidence threshold
    if (result.confidence < this.confidence) {
      return {
        script: ARCHITECTURE_CONFIG.modules.scriptDetector.fallback,
        confidence: 0.5,
        alternatives: [result]
      };
    }

    return result;
  }

  cleanup(): void {
    // Cleanup resources
  }
}
