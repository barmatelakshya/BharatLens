import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Volume2, 
  Download, 
  Share, 
  Zap,
  Settings,
  RefreshCw
} from 'lucide-react';
import { SCRIPT_INVENTORY } from '@/data/scriptInventory';
import { TTSControls, QuickTTSButton } from '@/components/TTSControls';
import { toast } from 'sonner';
import Sanscript from '@indic-transliteration/sanscript';

const scripts = [
  { value: 'itrans', label: 'Romanized (ITRANS)' },
  ...Object.entries(SCRIPT_INVENTORY).map(([key, info]) => ({
    value: key,
    label: info.name
  }))
];

export function TransliteratePage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceScript, setSourceScript] = useState("itrans");
  const [targetScript, setTargetScript] = useState("devanagari");
  const [copied, setCopied] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पाठ दर्ज करें (Please enter text)");
      return;
    }

    if (sourceScript === targetScript) {
      toast.error("Please select different source and target scripts");
      return;
    }

    setIsTransliterating(true);
    try {
      let actualSourceScript = sourceScript;
      
      // Auto-detect source script if needed
      if (sourceScript === 'auto') {
        actualSourceScript = detectScript(inputText);
        if (!actualSourceScript) {
          actualSourceScript = 'itrans';
        }
      }

      // Direct transliteration using Sanscript
      const result = Sanscript.t(inputText, actualSourceScript, targetScript);
      
      setOutputText(result);
      
      const sourceName = actualSourceScript === 'itrans' ? 'Romanized' : SCRIPT_INVENTORY[actualSourceScript]?.name;
      const targetName = targetScript === 'itrans' ? 'Romanized' : SCRIPT_INVENTORY[targetScript]?.name;
      
      toast.success(`Transliterated from ${sourceName} to ${targetName}`);
    } catch (error) {
      console.error("Transliteration error:", error);
      toast.error("Transliteration failed. Please try again.");
    } finally {
      setIsTransliterating(false);
    }
  };

  const detectScript = (text: string): string | null => {
    for (const [scriptKey, scriptInfo] of Object.entries(SCRIPT_INVENTORY)) {
      const [start, end] = scriptInfo.unicodeRange;
      for (const char of text) {
        const code = char.codePointAt(0);
        if (code && code >= start && code <= end) {
          return scriptKey;
        }
      }
    }
    return null;
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleSave = () => {
    if (outputText) {
      const blob = new Blob([outputText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transliterated_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    if (outputText) {
      if (navigator.share) {
        await navigator.share({ title: "Transliterated Text", text: outputText });
      } else {
        await navigator.clipboard.writeText(outputText);
        toast.success("Copied to clipboard!");
      }
    }
  };

  const swapScripts = () => {
    const temp = sourceScript;
    setSourceScript(targetScript);
    setTargetScript(temp);
    
    if (outputText) {
      setInputText(outputText);
      setOutputText("");
    }
    
    toast.info("Scripts swapped!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Text Transliteration
          </h1>
          <p className="text-xl text-gray-600">
            Convert text between Indian scripts with AI-powered accuracy
          </p>
        </div>

        {/* Main Transliteration Card */}
        <Card className="shadow-2xl border-2 border-blue-200 mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Professional Transliteration Engine
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            
            {/* Configuration Panel */}
            <Card className="mb-8 bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Configuration</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={autoDetect}
                        onChange={(e) => setAutoDetect(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Auto-detect source</span>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Source Script */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Source Script</label>
                    <Select 
                      value={sourceScript} 
                      onValueChange={setSourceScript}
                      disabled={autoDetect}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select source script" />
                      </SelectTrigger>
                      <SelectContent>
                        {scripts.map((script) => (
                          <SelectItem key={script.value} value={script.value}>
                            {script.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={swapScripts}
                      className="h-12 w-12 p-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Target Script */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Script</label>
                    <Select value={targetScript} onValueChange={setTargetScript}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select target script" />
                      </SelectTrigger>
                      <SelectContent>
                        {scripts.map((script) => (
                          <SelectItem key={script.value} value={script.value}>
                            {script.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Translation Flow:</div>
                  <div className="flex items-center gap-2 text-lg">
                    <Badge variant="outline">
                      {autoDetect ? 'Auto-detect' : SCRIPT_INVENTORY[sourceScript]?.name}
                    </Badge>
                    <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                    <Badge variant="default">
                      {SCRIPT_INVENTORY[targetScript]?.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input/Output Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Input */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Input Text
                    <Badge variant="secondary" className="text-xs">
                      {autoDetect ? 'Auto' : SCRIPT_INVENTORY[sourceScript]?.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type: namaste, bharat, ram, krishna, ganga..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] text-lg resize-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setInputText("namaste")}
                    >
                      namaste
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setInputText("bharat")}
                    >
                      bharat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setInputText("krishna")}
                    >
                      krishna
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setInputText("ganga")}
                    >
                      ganga
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Output Text
                    <Badge variant="default" className="text-xs">
                      {SCRIPT_INVENTORY[targetScript]?.name}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={outputText}
                    readOnly
                    className="min-h-[200px] text-lg bg-gray-50 resize-none"
                    placeholder="Transliterated text will appear here..."
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Characters: {outputText.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transliterate Button */}
            <div className="flex justify-center my-8">
              <Button 
                onClick={handleTransliterate}
                disabled={isTransliterating || !inputText.trim()}
                size="lg"
                className="px-12 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isTransliterating ? (
                  <>
                    <Zap className="mr-3 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="mr-3 h-5 w-5" />
                    Transliterate
                  </>
                )}
              </Button>
            </div>

            {/* Output Actions */}
            {outputText && (
              <div className="space-y-6">
                
                {/* TTS Controls */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-blue-600" />
                      Voice & Speech Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TTSControls
                      text={outputText}
                      script={targetScript}
                      showAdvanced={showAdvanced}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" onClick={handleCopy} className="flex items-center gap-2">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </Button>
                  
                  <QuickTTSButton text={outputText} script={targetScript} />
                  
                  <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Save File
                  </Button>
                  
                  <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Quick Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="ghost"
                onClick={() => setInputText("नमस्ते दोस्त")}
                className="text-left p-4 h-auto flex-col items-start"
              >
                <div className="font-medium">Hindi → Tamil</div>
                <div className="text-sm text-gray-600">नमस्ते दोस्त</div>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setInputText("வணக்கம் நண்பர்")}
                className="text-left p-4 h-auto flex-col items-start"
              >
                <div className="font-medium">Tamil → Hindi</div>
                <div className="text-sm text-gray-600">வணக்கம் நண்பர்</div>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setInputText("ನಮಸ್ಕಾರ ಸ್ನೇಹಿತ")}
                className="text-left p-4 h-auto flex-col items-start"
              >
                <div className="font-medium">Kannada → Bengali</div>
                <div className="text-sm text-gray-600">ನಮಸ್ಕಾರ ಸ್ನೇಹಿತ</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
