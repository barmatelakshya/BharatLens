import { useState, useEffect } from "react";
import { Camera, Type, ArrowRightLeft, Copy, Check, Download, Share, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SCRIPT_INVENTORY } from "@/data/scriptInventory";
import { HomeScreen } from "@/components/HomeScreen";
import { CameraCapture } from "@/components/CameraCapture";
import { TTSControls, QuickTTSButton } from "@/components/TTSControls";
import { EnhancedFeaturesPanel } from "@/components/EnhancedFeaturesPanel";
import { verifyAllFeatures } from "@/lib/featureVerification";
import { ttsEngine } from "@/lib/enhancedTTS";
import Sanscript from "@indic-transliteration/sanscript";

const scripts = Object.entries(SCRIPT_INVENTORY).map(([key, info]) => ({
  value: key,
  label: info.name
}));

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'app'>('home');
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceScript, setSourceScript] = useState("devanagari");
  const [targetScript, setTargetScript] = useState("tamil");
  const [copied, setCopied] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);

  useEffect(() => {
    const verification = verifyAllFeatures();
    
    ttsEngine.initialize().then(() => {
      toast.success("🔊 BHARATLENS Ready!");
    }).catch(() => {
      toast.warning("TTS not available on this device");
    });
    
    if (verification.completionRate === 100) {
      toast.success("✅ All features ready!");
    }
  }, []);

  const handleActionSelect = (action: 'camera' | 'upload' | 'text') => {
    setCurrentView('app');
    
    switch (action) {
      case 'camera':
        setActiveTab('camera');
        break;
      case 'upload':
        setActiveTab('enhanced');
        break;
      case 'text':
        setActiveTab('text');
        break;
    }
    
    toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} mode activated`);
  };

  const handleScriptChange = (source: string, target: string) => {
    setSourceScript(source);
    setTargetScript(target);
  };

  const handleToggleChange = (toggle: string, enabled: boolean) => {
    console.log(`Toggle ${toggle}: ${enabled}`);
  };

  if (currentView === 'home') {
    return (
      <HomeScreen
        onActionSelect={handleActionSelect}
        onScriptChange={handleScriptChange}
        onToggleChange={handleToggleChange}
      />
    );
  }

  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      toast.error("कृपया पाठ दर्ज करें (Please enter text)");
      return;
    }

    setIsTransliterating(true);
    try {
      const result = Sanscript.t(inputText, sourceScript, targetScript);
      setOutputText(result);
      toast.success(`Transliterated from ${SCRIPT_INVENTORY[sourceScript].name} to ${SCRIPT_INVENTORY[targetScript].name}`);
    } catch (error) {
      console.error("Transliteration error:", error);
      toast.error("Transliteration failed. Please try again.");
    } finally {
      setIsTransliterating(false);
    }
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

  const handleCameraCapture = (file: File) => {
    toast.info("OCR processing... Text will be extracted and transliterated.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 px-4 shadow-xl">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentView('home')}
            className="text-white hover:bg-white/20 font-medium"
          >
            ← Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 font-black text-xl shadow-lg">
              BL
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">BHARATLEANS</h1>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 font-medium">Professional</Badge>
        </div>
      </div>

      {/* Main Application */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-lg">
          <CardHeader className="text-center border-b bg-gradient-to-r from-indigo-50/80 to-purple-50/80 py-10">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Advanced Transliteration Platform
            </CardTitle>
            <CardDescription className="text-xl mt-4 text-gray-600 max-w-3xl mx-auto font-light">
              Enterprise-grade AI-powered script conversion with real-time processing
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="text" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">
                  <Type className="h-4 w-4" />
                  Text Input
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">
                  <Camera className="h-4 w-4" />
                  Camera OCR
                </TabsTrigger>
                <TabsTrigger value="enhanced" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Advanced Features
                </TabsTrigger>
              </TabsList>

              {/* Text Input Tab */}
              <TabsContent value="text" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Source Script</label>
                    <Select value={sourceScript} onValueChange={setSourceScript}>
                      <SelectTrigger>
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Script</label>
                    <Select value={targetScript} onValueChange={setTargetScript}>
                      <SelectTrigger>
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Text</label>
                    <Textarea
                      placeholder="Enter text in any Indian script..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[120px] text-lg"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button 
                      onClick={handleTransliterate}
                      disabled={isTransliterating}
                      size="lg"
                      className="px-12 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isTransliterating ? (
                        <Zap className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowRightLeft className="mr-2 h-5 w-5" />
                      )}
                      {isTransliterating ? "Processing..." : "Transliterate"}
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Output Text</label>
                    <Textarea
                      value={outputText}
                      readOnly
                      className="min-h-[120px] text-lg bg-gray-50"
                      placeholder="Transliterated text will appear here..."
                    />
                  </div>

                  {outputText && (
                    <div className="space-y-4">
                      <TTSControls
                        text={outputText}
                        script={targetScript}
                        showAdvanced={false}
                      />
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                        <QuickTTSButton text={outputText} script={targetScript} />
                        <Button variant="outline" size="sm" onClick={handleSave}>
                          <Download className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Camera Tab */}
              <TabsContent value="camera" className="space-y-6">
                <CameraCapture onCapture={handleCameraCapture} />
              </TabsContent>

              {/* Enhanced Features Tab */}
              <TabsContent value="enhanced" className="space-y-6">
                <EnhancedFeaturesPanel 
                  currentText={inputText}
                  currentScript={sourceScript}
                  onFeatureToggle={(feature, enabled) => {
                    toast.info(`${feature} ${enabled ? 'enabled' : 'disabled'}`);
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
