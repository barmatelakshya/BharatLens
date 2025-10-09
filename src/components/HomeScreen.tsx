import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Camera, 
  Upload, 
  Type, 
  Volume2, 
  Palette, 
  AlertTriangle, 
  Wifi, 
  WifiOff,
  MapPin,
  Zap
} from 'lucide-react';
import { SCRIPT_INVENTORY } from '@/data/scriptInventory';
import { toast } from 'sonner';

interface HomeScreenProps {
  onActionSelect: (action: 'camera' | 'upload' | 'text') => void;
  onScriptChange: (source: string, target: string) => void;
  onToggleChange: (toggle: string, enabled: boolean) => void;
}

const scripts = Object.entries(SCRIPT_INVENTORY).map(([key, info]) => ({
  value: key,
  label: info.name
}));

export function HomeScreen({ onActionSelect, onScriptChange, onToggleChange }: HomeScreenProps) {
  const [sourceScript, setSourceScript] = useState('auto');
  const [targetScript, setTargetScript] = useState('devanagari');
  const [toggles, setToggles] = useState({
    tts: true,
    offline: true
  });

  const handleToggle = (toggleName: string, enabled: boolean) => {
    setToggles(prev => ({ ...prev, [toggleName]: enabled }));
    onToggleChange(toggleName, enabled);
    
    const messages = {
      tts: `Text-to-Speech ${enabled ? 'enabled' : 'disabled'}`,
      offline: `Offline Mode ${enabled ? 'enabled' : 'disabled'}`
    };
    
    toast.success(messages[toggleName as keyof typeof messages]);
  };

  const handleScriptChange = (type: 'source' | 'target', script: string) => {
    if (type === 'source') {
      setSourceScript(script);
    } else {
      setTargetScript(script);
    }
    onScriptChange(sourceScript === 'auto' ? 'devanagari' : sourceScript, targetScript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header with Professional Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-16 px-4 shadow-2xl">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              alt="BHARATLENS Logo" 
              className="w-16 h-16 object-contain bg-white/20 rounded-lg p-2"
            />
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-3xl shadow-xl">
                BL
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent">
                BHARATLEANS
              </h1>
            </div>
            <img 
              alt="BHARATLENS Logo" 
              className="w-16 h-16 object-contain bg-white/20 rounded-lg p-2"
            />
          </div>
          
          <h2 className="text-xl md:text-2xl font-medium mb-3 text-blue-100">
            {currentRegion.greeting}
          </h2>
          
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Advanced AI-Powered Script Transliteration Platform
          </p>
          
          <div className="flex items-center justify-center gap-2 text-blue-200">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Intelligent region detection • Enterprise-grade accuracy</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          
          {/* Primary Action Buttons */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Choose Your Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Live Camera */}
                <Button
                  onClick={() => onActionSelect('camera')}
                  className="h-40 flex-col gap-4 text-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 transform hover:scale-105"
                  size="lg"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                    <Camera className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">Live Camera</div>
                    <div className="text-sm opacity-90 mt-2">Real-time processing</div>
                  </div>
                </Button>

                {/* Image Upload */}
                <Button
                  onClick={() => onActionSelect('upload')}
                  className="h-40 flex-col gap-4 text-lg bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 transform hover:scale-105"
                  size="lg"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">Image Upload</div>
                    <div className="text-sm opacity-90 mt-2">Batch processing</div>
                  </div>
                </Button>

                {/* Text Input */}
                <Button
                  onClick={() => onActionSelect('text')}
                  className="h-40 flex-col gap-4 text-lg bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 transform hover:scale-105"
                  size="lg"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                    <Type className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">Text Input</div>
                    <div className="text-sm opacity-90 mt-2">Direct typing</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Script Selector */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Script Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Source Script */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Source Script</label>
                  <Select value={sourceScript} onValueChange={(value) => handleScriptChange('source', value)}>
                    <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium">Auto-detect script</span>
                        </div>
                      </SelectItem>
                      {scripts.map((script) => (
                        <SelectItem key={script.value} value={script.value}>
                          <span className="font-medium">{script.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Script */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Target Script</label>
                  <Select value={targetScript} onValueChange={(value) => handleScriptChange('target', value)}>
                    <SelectTrigger className="h-14 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.map((script) => (
                        <SelectItem key={script.value} value={script.value}>
                          <span className="font-medium">{script.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Script Preview */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Preview:</div>
                <div className="text-lg font-medium">
                  {sourceScript === 'auto' ? (
                    <span className="text-amber-600 font-semibold">Auto-detect → </span>
                  ) : (
                    <span className="text-gray-700">{SCRIPT_INVENTORY[sourceScript]?.name} → </span>
                  )}
                  <span className="font-bold text-blue-700">
                    {SCRIPT_INVENTORY[targetScript]?.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Toggle Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* TTS Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">🔊 TTS</div>
                      <div className="text-xs text-gray-600">Text-to-Speech</div>
                    </div>
                  </div>
                  <Switch
                    checked={toggles.tts}
                    onCheckedChange={(checked) => handleToggle('tts', checked)}
                  />
                </div>

                {/* Offline Mode Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {toggles.offline ? (
                      <WifiOff className="h-5 w-5 text-green-500" />
                    ) : (
                      <Wifi className="h-5 w-5 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium text-sm">🌐 Offline</div>
                      <div className="text-xs text-gray-600">No internet needed</div>
                    </div>
                  </div>
                  <Switch
                    checked={toggles.offline}
                    onCheckedChange={(checked) => handleToggle('offline', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
