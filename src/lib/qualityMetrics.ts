// Quality metrics and evaluation framework
export interface QualityMetrics {
  accuracy: {
    characterLevel: number;
    aksharaLevel: number;
    wordLevel: number;
  };
  readability: {
    humanJudgment: number;
    signageComprehension: number;
  };
  ocrRobustness: {
    cer: number; // Character Error Rate
    wer: number; // Word Error Rate
  };
  performance: {
    latency: number; // milliseconds
    throughput: number; // characters per second
  };
}

export class QualityEvaluator {
  
  // Character-level accuracy
  calculateCharacterAccuracy(predicted: string, ground_truth: string): number {
    const maxLen = Math.max(predicted.length, ground_truth.length);
    if (maxLen === 0) return 1.0;
    
    const distance = this.levenshteinDistance(predicted, ground_truth);
    return Math.max(0, (maxLen - distance) / maxLen);
  }

  // Akshara-level accuracy (orthographic syllables)
  calculateAksharaAccuracy(predicted: string, ground_truth: string): number {
    const predictedAksharas = this.segmentIntoAksharas(predicted);
    const truthAksharas = this.segmentIntoAksharas(ground_truth);
    
    const maxLen = Math.max(predictedAksharas.length, truthAksharas.length);
    if (maxLen === 0) return 1.0;
    
    let matches = 0;
    const minLen = Math.min(predictedAksharas.length, truthAksharas.length);
    
    for (let i = 0; i < minLen; i++) {
      if (predictedAksharas[i] === truthAksharas[i]) {
        matches++;
      }
    }
    
    return matches / maxLen;
  }

  // Word-level accuracy
  calculateWordAccuracy(predicted: string, ground_truth: string): number {
    const predictedWords = predicted.trim().split(/\s+/);
    const truthWords = ground_truth.trim().split(/\s+/);
    
    const maxLen = Math.max(predictedWords.length, truthWords.length);
    if (maxLen === 0) return 1.0;
    
    let matches = 0;
    const minLen = Math.min(predictedWords.length, truthWords.length);
    
    for (let i = 0; i < minLen; i++) {
      if (predictedWords[i] === truthWords[i]) {
        matches++;
      }
    }
    
    return matches / maxLen;
  }

  // OCR Character Error Rate
  calculateCER(predicted: string, ground_truth: string): number {
    const distance = this.levenshteinDistance(predicted, ground_truth);
    return ground_truth.length > 0 ? distance / ground_truth.length : 0;
  }

  // OCR Word Error Rate
  calculateWER(predicted: string, ground_truth: string): number {
    const predictedWords = predicted.trim().split(/\s+/);
    const truthWords = ground_truth.trim().split(/\s+/);
    
    const distance = this.levenshteinDistance(predictedWords.join(' '), truthWords.join(' '));
    return truthWords.length > 0 ? distance / truthWords.length : 0;
  }

  // Performance measurement
  async measureLatency<T>(operation: () => Promise<T>): Promise<{result: T, latency: number}> {
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    
    return {
      result,
      latency: endTime - startTime
    };
  }

  // Comprehensive evaluation
  async evaluateTransliteration(
    input: string,
    predicted: string,
    ground_truth: string,
    operation: () => Promise<string>
  ): Promise<QualityMetrics> {
    
    const {result, latency} = await this.measureLatency(operation);
    
    return {
      accuracy: {
        characterLevel: this.calculateCharacterAccuracy(predicted, ground_truth),
        aksharaLevel: this.calculateAksharaAccuracy(predicted, ground_truth),
        wordLevel: this.calculateWordAccuracy(predicted, ground_truth)
      },
      readability: {
        humanJudgment: 0.85, // Placeholder - would be from user studies
        signageComprehension: 0.90 // Placeholder - would be from field tests
      },
      ocrRobustness: {
        cer: this.calculateCER(predicted, ground_truth),
        wer: this.calculateWER(predicted, ground_truth)
      },
      performance: {
        latency,
        throughput: input.length / (latency / 1000) // chars per second
      }
    };
  }

  // Round-trip evaluation for reversibility
  evaluateRoundTrip(
    original: string,
    sourceScript: string,
    targetScript: string,
    transliterator: (text: string, from: string, to: string) => string
  ): {
    forwardAccuracy: number;
    backwardAccuracy: number;
    roundTripAccuracy: number;
  } {
    
    const forward = transliterator(original, sourceScript, targetScript);
    const backward = transliterator(forward, targetScript, sourceScript);
    
    return {
      forwardAccuracy: this.calculateCharacterAccuracy(forward, original),
      backwardAccuracy: this.calculateCharacterAccuracy(backward, original),
      roundTripAccuracy: this.calculateCharacterAccuracy(backward, original)
    };
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[len1][len2];
  }

  private segmentIntoAksharas(text: string): string[] {
    // Simplified akshara segmentation
    const aksharas: string[] = [];
    let current = '';
    
    for (const char of text) {
      const code = char.codePointAt(0) || 0;
      
      // Check if it's a combining character or matra
      if (this.isCombiningChar(code)) {
        current += char;
      } else {
        if (current) aksharas.push(current);
        current = char;
      }
    }
    
    if (current) aksharas.push(current);
    return aksharas;
  }

  private isCombiningChar(code: number): boolean {
    return (code >= 0x093C && code <= 0x094F) || // Devanagari combining
           (code >= 0x09BC && code <= 0x09C4) || // Bengali combining
           (code >= 0x0A3C && code <= 0x0A4D) || // Gurmukhi combining
           (code >= 0x0ABC && code <= 0x0ACD);   // Gujarati combining
  }
}

// Performance benchmarking
export class PerformanceBenchmark {
  private results: Array<{operation: string, latency: number, timestamp: number}> = [];

  async benchmark(name: string, operation: () => Promise<any>): Promise<number> {
    const startTime = performance.now();
    await operation();
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    this.results.push({
      operation: name,
      latency,
      timestamp: Date.now()
    });
    
    return latency;
  }

  getAverageLatency(operation: string): number {
    const operationResults = this.results.filter(r => r.operation === operation);
    if (operationResults.length === 0) return 0;
    
    const total = operationResults.reduce((sum, r) => sum + r.latency, 0);
    return total / operationResults.length;
  }

  getPerformanceReport(): {
    totalOperations: number;
    averageLatency: number;
    targetMet: boolean; // <100ms target
    operations: Record<string, {count: number, avgLatency: number}>;
  } {
    const avgLatency = this.results.reduce((sum, r) => sum + r.latency, 0) / this.results.length;
    
    const operations: Record<string, {count: number, avgLatency: number}> = {};
    
    for (const result of this.results) {
      if (!operations[result.operation]) {
        operations[result.operation] = {count: 0, avgLatency: 0};
      }
      operations[result.operation].count++;
    }
    
    for (const op in operations) {
      operations[op].avgLatency = this.getAverageLatency(op);
    }
    
    return {
      totalOperations: this.results.length,
      averageLatency: avgLatency,
      targetMet: avgLatency < 100, // Target <100ms
      operations
    };
  }
}
