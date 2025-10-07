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

// Region detection based on common scripts
const REGION_GREETINGS = {
  punjab: {
    scripts: ['gurmukhi'],
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! Welcome to Punjab',
    description: 'Transliterate Gurmukhi signs across Punjab',
    icon: '🌾'
  },
  tamil_nadu: {
    scripts: ['tamil'],
    greeting: 'வணக்கம்! Welcome to Tamil Nadu',
    description: 'Transliterate Tamil signs across Tamil Nadu',
    icon: '🏛️'
  },
  west_bengal: {
    scripts: ['bengali'],
    greeting: 'নমস্কার! Welcome to West Bengal',
    description: 'Transliterate Bengali signs across West Bengal',
    icon: '🐟'
  },
  kerala: {
    scripts: ['malayalam'],
    greeting: 'നമസ്കാരം! Welcome to Kerala',
    description: 'Transliterate Malayalam signs across Kerala',
    icon: '🥥'
  },
  karnataka: {
    scripts: ['kannada'],
    greeting: 'ನಮಸ್ಕಾರ! Welcome to Karnataka',
    description: 'Transliterate Kannada signs across Karnataka',
    icon: '🏰'
  },
  telangana: {
    scripts: ['telugu'],
    greeting: 'నమస్కారం! Welcome to Telangana',
    description: 'Transliterate Telugu signs across Telangana',
    icon: '💎'
  },
  gujarat: {
    scripts: ['gujarati'],
    greeting: 'નમસ્તે! Welcome to Gujarat',
    description: 'Transliterate Gujarati signs across Gujarat',
    icon: '🦁'
  },
  odisha: {
    scripts: ['odia'],
    greeting: 'ନମସ୍କାର! Welcome to Odisha',
    description: 'Transliterate Odia signs across Odisha',
    icon: '🏛️'
  },
  india: {
    scripts: ['devanagari'],
    greeting: 'नमस्ते! Welcome to Bharat',
    description: 'Transliterate signs across India',
    icon: '🇮🇳'
  }
};

export function HomeScreen({ onActionSelect, onScriptChange, onToggleChange }: HomeScreenProps) {
  const [sourceScript, setSourceScript] = useState('auto');
  const [targetScript, setTargetScript] = useState('devanagari');
  const [currentRegion, setCurrentRegion] = useState(REGION_GREETINGS.india);
  const [toggles, setToggles] = useState({
    tts: true,
    cultural: true,
    emergency: false,
    offline: true
  });

  useEffect(() => {
    // Detect region based on target script
    const region = Object.values(REGION_GREETINGS).find(r => 
      r.scripts.includes(targetScript)
    ) || REGION_GREETINGS.india;
    
    setCurrentRegion(region);
  }, [targetScript]);

  const handleToggle = (toggleName: string, enabled: boolean) => {
    setToggles(prev => ({ ...prev, [toggleName]: enabled }));
    onToggleChange(toggleName, enabled);
    
    const messages = {
      tts: `Text-to-Speech ${enabled ? 'enabled' : 'disabled'}`,
      cultural: `Cultural Mode ${enabled ? 'enabled' : 'disabled'}`,
      emergency: `Emergency Mode ${enabled ? 'ACTIVATED' : 'deactivated'}`,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header with Region-Aware Greeting */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{currentRegion.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold">भारत लिपि पुल</h1>
            <span className="text-4xl">{currentRegion.icon}</span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            {currentRegion.greeting}
          </h2>
          
          <p className="text-lg opacity-90 mb-4">
            {currentRegion.description}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Auto-detected region based on script selection</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-8">
          
          {/* Primary Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose Your Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Live Camera */}
                <Button
                  onClick={() => onActionSelect('camera')}
                  className="h-32 flex-col gap-4 text-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  <Camera className="h-12 w-12" />
                  <div className="text-center">
                    <div className="font-bold">📷 Live Camera</div>
                    <div className="text-sm opacity-90">Real-time transliteration</div>
                  </div>
                </Button>

                {/* Image Upload */}
                <Button
                  onClick={() => onActionSelect('upload')}
                  className="h-32 flex-col gap-4 text-lg bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  size="lg"
                >
                  <Upload className="h-12 w-12" />
                  <div className="text-center">
                    <div className="font-bold">🖼️ Image Upload</div>
                    <div className="text-sm opacity-90">Upload signboard photos</div>
                  </div>
                </Button>

                {/* Text Input */}
                <Button
                  onClick={() => onActionSelect('text')}
                  className="h-32 flex-col gap-4 text-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  size="lg"
                >
                  <Type className="h-12 w-12" />
                  <div className="text-center">
                    <div className="font-bold">📝 Text Input</div>
                    <div className="text-sm opacity-90">Type or paste text</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Script Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Script Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Source Script */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Source Script</label>
                  <Select value={sourceScript} onValueChange={(value) => handleScriptChange('source', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Auto-detect script
                        </div>
                      </SelectItem>
                      {scripts.map((script) => (
                        <SelectItem key={script.value} value={script.value}>
                          {script.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Script */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Target Script</label>
                  <Select value={targetScript} onValueChange={(value) => handleScriptChange('target', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
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

              {/* Script Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Preview:</div>
                <div className="text-lg">
                  {sourceScript === 'auto' ? (
                    <span className="text-yellow-600">Auto-detect → </span>
                  ) : (
                    <span>{SCRIPT_INVENTORY[sourceScript]?.name} → </span>
                  )}
                  <span className="font-semibold text-blue-600">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                
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

                {/* Cultural Mode Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-sm">🎨 Cultural</div>
                      <div className="text-xs text-gray-600">Regional themes</div>
                    </div>
                  </div>
                  <Switch
                    checked={toggles.cultural}
                    onCheckedChange={(checked) => handleToggle('cultural', checked)}
                  />
                </div>

                {/* Emergency Mode Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-sm">🚨 Emergency</div>
                      <div className="text-xs text-gray-600">Critical alerts</div>
                    </div>
                  </div>
                  <Switch
                    checked={toggles.emergency}
                    onCheckedChange={(checked) => handleToggle('emergency', checked)}
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

              {/* Active Features Display */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">Active Features:</div>
                <div className="flex flex-wrap gap-2">
                  {toggles.tts && <Badge className="bg-blue-100 text-blue-800">🔊 TTS Enabled</Badge>}
                  {toggles.cultural && <Badge className="bg-purple-100 text-purple-800">🎨 Cultural Mode</Badge>}
                  {toggles.emergency && <Badge className="bg-red-100 text-red-800">🚨 Emergency Active</Badge>}
                  {toggles.offline && <Badge className="bg-green-100 text-green-800">🌐 Offline Ready</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">10+</div>
              <div className="text-sm text-gray-600">Scripts Supported</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Offline Capable</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <div className="text-sm text-gray-600">Smart Context</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">AR</div>
              <div className="text-sm text-gray-600">Multi-Language</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
