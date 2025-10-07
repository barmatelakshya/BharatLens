import { normalizeText, segmentAksharas } from './unicode';
import { toPhonemic, fromPhonemic } from './phonemic';
import { OrthographyEngine, OrthographyOptions } from './orthography';
import { ValidationEngine, exceptionDictionary } from './exceptions';
import Sanscript from '@indic-transliteration/sanscript';

export interface TransliterationResult {
  result: string;
  confidence: number;
  phonemic: string;
  validation: {
    isValid: boolean;
    confidence: number;
    suggestions?: string[];
  };
  metadata: {
    sourceScript: string;
    targetScript: string;
    mode: 'strict' | 'readable';
    processingSteps: string[];
  };
}

export class EnhancedTransliterationEngine {
  private orthographyEngine: OrthographyEngine;
  private validationEngine: ValidationEngine;
  
  constructor(options?: OrthographyOptions) {
    this.orthographyEngine = new OrthographyEngine(options);
    this.validationEngine = new ValidationEngine();
    this.validationEngine.loadUserCache();
  }

  async transliterate(
    text: string, 
    sourceScript: string, 
    targetScript: string,
    options: { validateResult?: boolean; useExceptions?: boolean } = {}
  ): Promise<TransliterationResult> {
    
    const processingSteps: string[] = [];
    
    // Step 1: Unicode normalization
    let processedText = normalizeText(text);
    processingSteps.push('Unicode normalization');
    
    // Step 2: Check exceptions first
    if (options.useExceptions !== false) {
      const exception = this.validationEngine.checkExceptions(processedText);
      if (exception) {
        return {
          result: exception,
          confidence: 1.0,
          phonemic: exception,
          validation: { isValid: true, confidence: 1.0 },
          metadata: {
            sourceScript,
            targetScript,
            mode: 'exception',
            processingSteps: ['Exception dictionary lookup']
          }
        };
      }
    }
    
    // Step 3: Grapheme segmentation
    const aksharas = segmentAksharas(processedText);
    processingSteps.push('Grapheme segmentation');
    
    // Step 4: Convert to phonemic intermediate
    const phonemic = toPhonemic(processedText, sourceScript);
    processingSteps.push('Phonemic conversion');
    
    // Step 5: Apply orthography rules
    let orthographyProcessed = this.orthographyEngine.processSchwa(phonemic, sourceScript);
    orthographyProcessed = this.orthographyEngine.processConjuncts(orthographyProcessed, sourceScript, targetScript);
    processingSteps.push('Orthography processing');
    
    // Step 6: Convert from phonemic to target script
    let result: string;
    try {
      // Use Sanscript as fallback for robust conversion
      result = Sanscript.t(processedText, sourceScript, targetScript);
      processingSteps.push('Sanscript conversion');
    } catch (error) {
      // Fallback to phonemic conversion
      result = fromPhonemic(orthographyProcessed, targetScript);
      processingSteps.push('Phonemic fallback conversion');
    }
    
    // Step 7: Apply target script specific rules
    result = this.orthographyEngine.processMatraPlacement(result, targetScript);
    result = this.orthographyEngine.processDiacritics(result, targetScript);
    result = this.orthographyEngine.applyScriptNuances(result, targetScript);
    processingSteps.push('Target script processing');
    
    // Step 8: Validation (if requested)
    let validation = { isValid: true, confidence: 0.9 };
    if (options.validateResult !== false) {
      validation = this.validationEngine.validateRoundTrip(
        processedText, 
        result, 
        sourceScript, 
        targetScript
      );
      processingSteps.push('Round-trip validation');
    }
    
    return {
      result,
      confidence: validation.confidence,
      phonemic: orthographyProcessed,
      validation,
      metadata: {
        sourceScript,
        targetScript,
        mode: this.orthographyEngine['options'].mode,
        processingSteps
      }
    };
  }

  // Batch transliteration for multiple texts
  async batchTransliterate(
    texts: string[], 
    sourceScript: string, 
    targetScript: string
  ): Promise<TransliterationResult[]> {
    const results: TransliterationResult[] = [];
    
    for (const text of texts) {
      const result = await this.transliterate(text, sourceScript, targetScript);
      results.push(result);
    }
    
    return results;
  }

  // Add user correction to training cache
  addUserCorrection(original: string, corrected: string): void {
    this.validationEngine.addUserCorrection(original, corrected);
  }

  // Get available scripts
  getSupportedScripts(): string[] {
    return [
      'devanagari', 'bengali', 'gurmukhi', 'gujarati', 'odia',
      'tamil', 'telugu', 'kannada', 'malayalam'
    ];
  }

  // Set orthography options
  setOrthographyOptions(options: OrthographyOptions): void {
    this.orthographyEngine = new OrthographyEngine(options);
  }

  // Get romanization (ISO 15919)
  getRomanization(text: string, sourceScript: string): string {
    const phonemic = toPhonemic(text, sourceScript);
    return phonemic; // Phonemic representation is close to ISO 15919
  }
}
