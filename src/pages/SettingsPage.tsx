import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Volume2, 
  Eye, 
  Shield, 
  Palette, 
  AlertTriangle,
  Globe,
  Save,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    tts: {
      enabled: true,
      voice: 'hindi-female',
      speed: [1.0],
      pitch: [1.0]
    },
    ar: {
      enabled: true,
      opacity: [0.8],
      displayMode: 'overlay'
    },
    privacy: {
      offlineMode: true,
      dataCollection: false,
      analytics: false
    },
    cultural: {
      enabled: true,
      region: 'auto',
      theme: 'traditional'
    },
    emergency: {
      enabled: false,
      vibration: true,
      sound: true
    },
    general: {
      language: 'english',
      notifications: true,
      autoSave: true
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    toast.success('Setting updated');
  };

  const resetSettings = () => {
    setSettings({
      tts: { enabled: true, voice: 'hindi-female', speed: [1.0], pitch: [1.0] },
      ar: { enabled: true, opacity: [0.8], displayMode: 'overlay' },
      privacy: { offlineMode: true, dataCollection: false, analytics: false },
      cultural: { enabled: true, region: 'auto', theme: 'traditional' },
      emergency: { enabled: false, vibration: true, sound: true },
      general: { language: 'english', notifications: true, autoSave: true }
    });
    toast.success('Settings reset to defaults');
  };

  const saveSettings = () => {
    localStorage.setItem('bharatScriptBridge_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Customize your Bharat Script Bridge experience
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Text-to-Speech Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-600" />
                Text-to-Speech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable TTS</div>
                  <div className="text-sm text-gray-600">Script-specific voice synthesis</div>
                </div>
                <Switch
                  checked={settings.tts.enabled}
                  onCheckedChange={(checked) => updateSetting('tts', 'enabled', checked)}
                />
              </div>
              
              {settings.tts.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice Selection</label>
                    <Select 
                      value={settings.tts.voice} 
                      onValueChange={(value) => updateSetting('tts', 'voice', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi-female">Hindi Female</SelectItem>
                        <SelectItem value="hindi-male">Hindi Male</SelectItem>
                        <SelectItem value="tamil-female">Tamil Female</SelectItem>
                        <SelectItem value="bengali-female">Bengali Female</SelectItem>
                        <SelectItem value="auto">Auto-detect Script</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speech Speed: {settings.tts.speed[0]}x</label>
                    <Slider
                      value={settings.tts.speed}
                      onValueChange={(value) => updateSetting('tts', 'speed', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* AR Overlay Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                AR Overlay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable AR Overlay</div>
                  <div className="text-sm text-gray-600">Multi-language display on images</div>
                </div>
                <Switch
                  checked={settings.ar.enabled}
                  onCheckedChange={(checked) => updateSetting('ar', 'enabled', checked)}
                />
              </div>
              
              {settings.ar.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Mode</label>
                    <Select 
                      value={settings.ar.displayMode} 
                      onValueChange={(value) => updateSetting('ar', 'displayMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overlay">Overlay Mode</SelectItem>
                        <SelectItem value="stacked">Stacked Mode</SelectItem>
                        <SelectItem value="swipe">Swipe Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Overlay Opacity: {Math.round(settings.ar.opacity[0] * 100)}%</label>
                    <Slider
                      value={settings.ar.opacity}
                      onValueChange={(value) => updateSetting('ar', 'opacity', value)}
                      max={1}
                      min={0.3}
                      step={0.1}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Offline Mode</div>
                  <div className="text-sm text-gray-600">Process everything on-device</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.privacy.offlineMode}
                    onCheckedChange={(checked) => updateSetting('privacy', 'offlineMode', checked)}
                  />
                  <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Data Collection</div>
                  <div className="text-sm text-gray-600">Allow anonymous usage analytics</div>
                </div>
                <Switch
                  checked={settings.privacy.dataCollection}
                  onCheckedChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cultural Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-600" />
                Cultural Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Cultural Mode</div>
                  <div className="text-sm text-gray-600">Regional themes and motifs</div>
                </div>
                <Switch
                  checked={settings.cultural.enabled}
                  onCheckedChange={(checked) => updateSetting('cultural', 'enabled', checked)}
                />
              </div>
              
              {settings.cultural.enabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select 
                    value={settings.cultural.region} 
                    onValueChange={(value) => updateSetting('cultural', 'region', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="north">North India</SelectItem>
                      <SelectItem value="south">South India</SelectItem>
                      <SelectItem value="west">West India</SelectItem>
                      <SelectItem value="east">East India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Emergency Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Emergency Mode</div>
                  <div className="text-sm text-gray-600">Detect danger signs and alert</div>
                </div>
                <Switch
                  checked={settings.emergency.enabled}
                  onCheckedChange={(checked) => updateSetting('emergency', 'enabled', checked)}
                />
              </div>
              
              {settings.emergency.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Vibration Alerts</div>
                      <div className="text-sm text-gray-600">Vibrate on danger detection</div>
                    </div>
                    <Switch
                      checked={settings.emergency.vibration}
                      onCheckedChange={(checked) => updateSetting('emergency', 'vibration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sound Alerts</div>
                      <div className="text-sm text-gray-600">Audio warning for emergencies</div>
                    </div>
                    <Switch
                      checked={settings.emergency.sound}
                      onCheckedChange={(checked) => updateSetting('emergency', 'sound', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={saveSettings}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="border-2 border-gray-300 flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
