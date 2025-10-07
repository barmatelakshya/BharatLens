// Testing strategy and golden corpus framework
export interface GoldenCorpusEntry {
  id: string;
  sourceText: string;
  sourceScript: string;
  targetText: string;
  targetScript: string;
  phonemic: string;
  category: 'signage' | 'literature' | 'proper-noun' | 'technical';
  difficulty: 'easy' | 'medium' | 'hard';
  metadata: {
    location?: string;
    imageConditions?: string;
    linguisticFeatures?: string[];
  };
}

export interface TestResult {
  testId: string;
  passed: boolean;
  accuracy: number;
  latency: number;
  errors: string[];
  metadata: any;
}

export class TestingFramework {
  private goldenCorpus: GoldenCorpusEntry[] = [];
  private testResults: TestResult[] = [];

  // Initialize with curated test data
  initializeGoldenCorpus(): void {
    this.goldenCorpus = [
      // Signage examples
      {
        id: 'sign_001',
        sourceText: 'रेलवे स्टेशन',
        sourceScript: 'devanagari',
        targetText: 'ரயில்வே ஸ்டேஷன்',
        targetScript: 'tamil',
        phonemic: 'rēlvē sṭēśan',
        category: 'signage',
        difficulty: 'easy',
        metadata: {
          location: 'Mumbai Central',
          imageConditions: 'good lighting',
          linguisticFeatures: ['compound-word', 'english-loan']
        }
      },
      {
        id: 'sign_002',
        sourceText: 'হাসপাতাল',
        sourceScript: 'bengali',
        targetText: 'ಆಸ್ಪತ್ರೆ',
        targetScript: 'kannada',
        phonemic: 'hāspātāl',
        category: 'signage',
        difficulty: 'medium',
        metadata: {
          location: 'Kolkata',
          imageConditions: 'low light',
          linguisticFeatures: ['aspirated-consonants']
        }
      },
      
      // Proper noun examples
      {
        id: 'name_001',
        sourceText: 'श्री राम नगर',
        sourceScript: 'devanagari',
        targetText: 'ശ്രീ രാം നഗർ',
        targetScript: 'malayalam',
        phonemic: 'śrī rām nagar',
        category: 'proper-noun',
        difficulty: 'medium',
        metadata: {
          linguisticFeatures: ['honorific', 'place-name']
        }
      },
      
      // Complex linguistic features
      {
        id: 'complex_001',
        sourceText: 'संस्कृत भाषा',
        sourceScript: 'devanagari',
        targetText: 'సంస్కృత భాష',
        targetScript: 'telugu',
        phonemic: 'saṃskṛta bhāṣā',
        category: 'literature',
        difficulty: 'hard',
        metadata: {
          linguisticFeatures: ['conjuncts', 'nasalization', 'retroflex']
        }
      }
    ];
  }

  // Property-based testing
  async runPropertyTests(transliterator: (text: string, from: string, to: string) => Promise<string>): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test 1: Round-trip invariant
    for (const entry of this.goldenCorpus) {
      const testId = `roundtrip_${entry.id}`;
      const startTime = performance.now();
      
      try {
        const forward = await transliterator(entry.sourceText, entry.sourceScript, entry.targetScript);
        const backward = await transliterator(forward, entry.targetScript, entry.sourceScript);
        
        const accuracy = this.calculateSimilarity(entry.sourceText, backward);
        const latency = performance.now() - startTime;
        
        results.push({
          testId,
          passed: accuracy > 0.8, // 80% similarity threshold
          accuracy,
          latency,
          errors: accuracy <= 0.8 ? [`Low round-trip accuracy: ${accuracy}`] : [],
          metadata: { type: 'round-trip', entry: entry.id }
        });
      } catch (error) {
        results.push({
          testId,
          passed: false,
          accuracy: 0,
          latency: performance.now() - startTime,
          errors: [String(error)],
          metadata: { type: 'round-trip', entry: entry.id }
        });
      }
    }
    
    // Test 2: Diacritic preservation
    await this.testDiacriticPreservation(transliterator, results);
    
    // Test 3: Performance constraints
    await this.testPerformanceConstraints(transliterator, results);
    
    return results;
  }

  // A/B testing for heuristics
  async runABHeuristicTests(
    heuristicA: (text: string) => string,
    heuristicB: (text: string) => string,
    testCases: Array<{input: string, expected: string, context: string}>
  ): Promise<{
    heuristicA: {accuracy: number, preference: number};
    heuristicB: {accuracy: number, preference: number};
    recommendation: 'A' | 'B' | 'tie';
  }> {
    
    let scoreA = 0, scoreB = 0;
    let preferenceA = 0, preferenceB = 0;
    
    for (const testCase of testCases) {
      const resultA = heuristicA(testCase.input);
      const resultB = heuristicB(testCase.input);
      
      const accuracyA = this.calculateSimilarity(resultA, testCase.expected);
      const accuracyB = this.calculateSimilarity(resultB, testCase.expected);
      
      scoreA += accuracyA;
      scoreB += accuracyB;
      
      // Simulate user preference (in real implementation, this would be human judgment)
      if (accuracyA > accuracyB) preferenceA++;
      else if (accuracyB > accuracyA) preferenceB++;
    }
    
    const avgAccuracyA = scoreA / testCases.length;
    const avgAccuracyB = scoreB / testCases.length;
    
    return {
      heuristicA: { accuracy: avgAccuracyA, preference: preferenceA },
      heuristicB: { accuracy: avgAccuracyB, preference: preferenceB },
      recommendation: avgAccuracyA > avgAccuracyB ? 'A' : avgAccuracyB > avgAccuracyA ? 'B' : 'tie'
    };
  }

  // OCR robustness testing
  async testOCRRobustness(
    ocrEngine: (image: ImageData) => Promise<string>,
    testImages: Array<{image: ImageData, groundTruth: string, conditions: string}>
  ): Promise<{
    overallCER: number;
    overallWER: number;
    conditionBreakdown: Record<string, {cer: number, wer: number}>;
  }> {
    
    let totalCER = 0, totalWER = 0;
    const conditionResults: Record<string, {cer: number, wer: number, count: number}> = {};
    
    for (const testCase of testImages) {
      try {
        const ocrResult = await ocrEngine(testCase.image);
        
        const cer = this.calculateCER(ocrResult, testCase.groundTruth);
        const wer = this.calculateWER(ocrResult, testCase.groundTruth);
        
        totalCER += cer;
        totalWER += wer;
        
        if (!conditionResults[testCase.conditions]) {
          conditionResults[testCase.conditions] = {cer: 0, wer: 0, count: 0};
        }
        
        conditionResults[testCase.conditions].cer += cer;
        conditionResults[testCase.conditions].wer += wer;
        conditionResults[testCase.conditions].count++;
        
      } catch (error) {
        console.error('OCR test failed:', error);
      }
    }
    
    // Calculate averages
    const conditionBreakdown: Record<string, {cer: number, wer: number}> = {};
    for (const [condition, results] of Object.entries(conditionResults)) {
      conditionBreakdown[condition] = {
        cer: results.cer / results.count,
        wer: results.wer / results.count
      };
    }
    
    return {
      overallCER: totalCER / testImages.length,
      overallWER: totalWER / testImages.length,
      conditionBreakdown
    };
  }

  // Generate test report
  generateTestReport(): {
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      averageAccuracy: number;
      averageLatency: number;
    };
    categoryBreakdown: Record<string, {passed: number, total: number, accuracy: number}>;
    performanceAnalysis: {
      targetMet: boolean;
      slowestTests: Array<{testId: string, latency: number}>;
    };
  } {
    
    const totalTests = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = totalTests - passed;
    
    const averageAccuracy = this.testResults.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;
    const averageLatency = this.testResults.reduce((sum, r) => sum + r.latency, 0) / totalTests;
    
    // Category breakdown
    const categoryBreakdown: Record<string, {passed: number, total: number, accuracy: number}> = {};
    
    // Performance analysis
    const slowestTests = this.testResults
      .sort((a, b) => b.latency - a.latency)
      .slice(0, 5)
      .map(r => ({testId: r.testId, latency: r.latency}));
    
    return {
      summary: {
        totalTests,
        passed,
        failed,
        averageAccuracy,
        averageLatency
      },
      categoryBreakdown,
      performanceAnalysis: {
        targetMet: averageLatency < 100, // <100ms target
        slowestTests
      }
    };
  }

  private async testDiacriticPreservation(
    transliterator: (text: string, from: string, to: string) => Promise<string>,
    results: TestResult[]
  ): Promise<void> {
    const diacriticTests = [
      { text: 'संस्कृत', script: 'devanagari', feature: 'conjuncts' },
      { text: 'अंग्रेजी', script: 'devanagari', feature: 'anusvara' },
      { text: 'हिंदी', script: 'devanagari', feature: 'candrabindu' }
    ];
    
    for (const test of diacriticTests) {
      const testId = `diacritic_${test.feature}`;
      const startTime = performance.now();
      
      try {
        const result = await transliterator(test.text, test.script, 'tamil');
        const hasPreservedFeature = this.checkDiacriticPreservation(result, test.feature);
        
        results.push({
          testId,
          passed: hasPreservedFeature,
          accuracy: hasPreservedFeature ? 1.0 : 0.0,
          latency: performance.now() - startTime,
          errors: hasPreservedFeature ? [] : [`Diacritic feature lost: ${test.feature}`],
          metadata: { type: 'diacritic-preservation', feature: test.feature }
        });
      } catch (error) {
        results.push({
          testId,
          passed: false,
          accuracy: 0,
          latency: performance.now() - startTime,
          errors: [String(error)],
          metadata: { type: 'diacritic-preservation', feature: test.feature }
        });
      }
    }
  }

  private async testPerformanceConstraints(
    transliterator: (text: string, from: string, to: string) => Promise<string>,
    results: TestResult[]
  ): Promise<void> {
    
    const performanceTests = [
      { text: 'अ', length: 'short' },
      { text: 'नमस्ते दोस्त कैसे हो', length: 'medium' },
      { text: 'यह एक बहुत लंबा वाक्य है जो प्रदर्शन परीक्षण के लिए उपयोग किया जा रहा है', length: 'long' }
    ];
    
    for (const test of performanceTests) {
      const testId = `performance_${test.length}`;
      const startTime = performance.now();
      
      try {
        await transliterator(test.text, 'devanagari', 'tamil');
        const latency = performance.now() - startTime;
        
        results.push({
          testId,
          passed: latency < 100, // <100ms target
          accuracy: 1.0,
          latency,
          errors: latency >= 100 ? [`Latency exceeded target: ${latency}ms`] : [],
          metadata: { type: 'performance', textLength: test.length }
        });
      } catch (error) {
        results.push({
          testId,
          passed: false,
          accuracy: 0,
          latency: performance.now() - startTime,
          errors: [String(error)],
          metadata: { type: 'performance', textLength: test.length }
        });
      }
    }
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 1.0;
    
    const distance = this.levenshteinDistance(str1, str2);
    return Math.max(0, (maxLen - distance) / maxLen);
  }

  private calculateCER(predicted: string, groundTruth: string): number {
    const distance = this.levenshteinDistance(predicted, groundTruth);
    return groundTruth.length > 0 ? distance / groundTruth.length : 0;
  }

  private calculateWER(predicted: string, groundTruth: string): number {
    const predictedWords = predicted.trim().split(/\s+/);
    const truthWords = groundTruth.trim().split(/\s+/);
    
    const distance = this.levenshteinDistance(predictedWords.join(' '), truthWords.join(' '));
    return truthWords.length > 0 ? distance / truthWords.length : 0;
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

  private checkDiacriticPreservation(text: string, feature: string): boolean {
    // Simplified diacritic preservation check
    switch (feature) {
      case 'conjuncts':
        return /्/.test(text) || text.includes('்'); // Has virama or equivalent
      case 'anusvara':
        return /ं|ং|ം/.test(text); // Has anusvara variants
      case 'candrabindu':
        return /ँ|ঁ|ഁ/.test(text); // Has candrabindu variants
      default:
        return true;
    }
  }
}
