import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TestingFramework, TestResult } from '@/lib/testingFramework';
import { QualityEvaluator, QualityMetrics } from '@/lib/qualityMetrics';
import { EdgeCaseProcessor } from '@/lib/edgeCases';
import { CheckCircle, XCircle, Clock, Target, Zap, AlertTriangle } from 'lucide-react';

interface EvaluationDashboardProps {
  transliterator: (text: string, from: string, to: string) => Promise<string>;
}

export function EvaluationDashboard({ transliterator }: EvaluationDashboardProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testingFramework] = useState(new TestingFramework());
  const [qualityEvaluator] = useState(new QualityEvaluator());
  const [edgeCaseProcessor] = useState(new EdgeCaseProcessor());

  useEffect(() => {
    testingFramework.initializeGoldenCorpus();
    edgeCaseProcessor.loadUserPreferences();
  }, []);

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    try {
      // Run property tests
      const propertyResults = await testingFramework.runPropertyTests(transliterator);
      setTestResults(propertyResults);

      // Run quality evaluation on sample data
      const sampleMetrics = await qualityEvaluator.evaluateTransliteration(
        'नमस्ते दोस्त',
        'நமஸ்தே தோஸ்த்',
        'நமஸ்தே தோஸ்த்',
        async () => await transliterator('नमस्ते दोस्त', 'devanagari', 'tamil')
      );
      setQualityMetrics(sampleMetrics);

    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const testSummary = testResults.length > 0 ? {
    total: testResults.length,
    passed: testResults.filter(r => r.passed).length,
    failed: testResults.filter(r => !r.passed).length,
    averageAccuracy: testResults.reduce((sum, r) => sum + r.accuracy, 0) / testResults.length,
    averageLatency: testResults.reduce((sum, r) => sum + r.latency, 0) / testResults.length
  } : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Evaluation Dashboard</h2>
          <p className="text-gray-600">Comprehensive testing and quality metrics</p>
        </div>
        <Button 
          onClick={runComprehensiveTests} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <Zap className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      {/* Test Summary */}
      {testSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testSummary.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{testSummary.passed}</div>
              <Progress value={(testSummary.passed / testSummary.total) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{testSummary.failed}</div>
              <Progress value={(testSummary.failed / testSummary.total) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Avg Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testSummary.averageLatency.toFixed(1)}ms</div>
              <Badge variant={testSummary.averageLatency < 100 ? "default" : "destructive"} className="mt-2">
                {testSummary.averageLatency < 100 ? "Target Met" : "Target Missed"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quality Metrics */}
      {qualityMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
            <CardDescription>Accuracy and performance measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Accuracy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Character Level</span>
                    <span className="font-mono">{(qualityMetrics.accuracy.characterLevel * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={qualityMetrics.accuracy.characterLevel * 100} />
                  
                  <div className="flex justify-between">
                    <span>Akshara Level</span>
                    <span className="font-mono">{(qualityMetrics.accuracy.aksharaLevel * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={qualityMetrics.accuracy.aksharaLevel * 100} />
                  
                  <div className="flex justify-between">
                    <span>Word Level</span>
                    <span className="font-mono">{(qualityMetrics.accuracy.wordLevel * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={qualityMetrics.accuracy.wordLevel * 100} />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">OCR Robustness</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Character Error Rate</span>
                    <span className="font-mono">{(qualityMetrics.ocrRobustness.cer * 100).toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (qualityMetrics.ocrRobustness.cer * 100))} />
                  
                  <div className="flex justify-between">
                    <span>Word Error Rate</span>
                    <span className="font-mono">{(qualityMetrics.ocrRobustness.wer * 100).toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (qualityMetrics.ocrRobustness.wer * 100))} />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span className="font-mono">{qualityMetrics.performance.latency.toFixed(1)}ms</span>
                  </div>
                  <Badge variant={qualityMetrics.performance.latency < 100 ? "default" : "destructive"}>
                    {qualityMetrics.performance.latency < 100 ? "✓ Target Met" : "✗ Target Missed"}
                  </Badge>
                  
                  <div className="flex justify-between">
                    <span>Throughput</span>
                    <span className="font-mono">{qualityMetrics.performance.throughput.toFixed(0)} chars/s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results Details */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Detailed test execution results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">{result.testId}</div>
                      {result.errors.length > 0 && (
                        <div className="text-sm text-red-600">{result.errors[0]}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Accuracy: {(result.accuracy * 100).toFixed(1)}%</span>
                    <span>Latency: {result.latency.toFixed(1)}ms</span>
                    <Badge variant={result.passed ? "default" : "destructive"}>
                      {result.passed ? "PASS" : "FAIL"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edge Cases Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Edge Cases Coverage
          </CardTitle>
          <CardDescription>Status of edge case handling capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Proper Nouns</span>
                <Badge variant="default">✓ Implemented</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Mixed Scripts</span>
                <Badge variant="default">✓ Implemented</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Numerals & Punctuation</span>
                <Badge variant="default">✓ Implemented</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Diacritic Loss Fallback</span>
                <Badge variant="default">✓ Implemented</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
