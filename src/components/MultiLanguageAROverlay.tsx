import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Upload, Eye, Settings, Languages, ArrowLeft, ArrowRight } from 'lucide-react';
import { SCRIPT_INVENTORY } from '@/data/scriptInventory';
import { createMultiLanguageAR, MultiLanguageConfig, ARTextRegion } from '@/lib/multiLanguageAR';
import { toast } from 'sonner';
import Sanscript from '@indic-transliteration/sanscript';

const scripts = Object.entries(SCRIPT_INVENTORY).map(([key, info]) => ({
  value: key,
  label: info.name
}));

interface MultiLanguageAROverlayProps {
  onRegionsDetected?: (regions: ARTextRegion[]) => void;
}

export function MultiLanguageAROverlay({ onRegionsDetected }: MultiLanguageAROverlayProps) {
  const [config, setConfig] = useState<MultiLanguageConfig>({
    primaryScript: 'tamil',
    secondaryScripts: ['devanagari', 'romanization'],
    displayMode: 'stacked',
    maxScripts: 3,
    fontScaling: { primary: 1.0, secondary: 0.8 },
    spacing: 5
  });
  
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [regions, setRegions] = useState<ARTextRegion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const arEngine = createMultiLanguageAR(config);
      
      // Simple transliterator function
      const transliterator = async (text: string, from: string, to: string) => {
        return Sanscript.t(text, from, to);
      };

      const result = await arEngine.processImageForMultiLanguageAR(file, transliterator);
      
      // Convert canvas to image URL
      const imageUrl = result.canvas.toDataURL();
      setProcessedImage(imageUrl);
      setRegions(result.regions);
      
      if (onRegionsDetected) {
        onRegionsDetected(result.regions);
      }
      
      toast.success(`🎯 Multi-language AR processed: ${result.regions.length} regions found`);
    } catch (error) {
      console.error('Multi-language AR processing failed:', error);
      toast.error('AR processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePrimaryScript = (script: string) => {
    setConfig(prev => ({ ...prev, primaryScript: script }));
  };

  const updateSecondaryScripts = (script: string, add: boolean) => {
    setConfig(prev => {
      const newSecondary = add 
        ? [...prev.secondaryScripts, script].slice(0, prev.maxScripts - 1)
        : prev.secondaryScripts.filter(s => s !== script);
      
      return { ...prev, secondaryScripts: newSecondary };
    });
  };

  const updateDisplayMode = (mode: 'stacked' | 'swipe' | 'overlay') => {
    setConfig(prev => ({ ...prev, displayMode: mode }));
  };

  const nextRegion = () => {
    if (config.displayMode === 'swipe' && regions.length > 0) {
      setCurrentRegionIndex((prev) => (prev + 1) % regions.length);
    }
  };

  const prevRegion = () => {
    if (config.displayMode === 'swipe' && regions.length > 0) {
      setCurrentRegionIndex((prev) => (prev - 1 + regions.length) % regions.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Multi-Language AR Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Script Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary Script</label>
            <Select value={config.primaryScript} onValueChange={updatePrimaryScript}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scripts.map(script => (
                  <SelectItem key={script.value} value={script.value}>
                    {script.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Secondary Scripts */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Secondary Scripts ({config.secondaryScripts.length}/{config.maxScripts - 1})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {scripts
                .filter(script => script.value !== config.primaryScript)
                .map(script => (
                  <div key={script.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={script.value}
                      checked={config.secondaryScripts.includes(script.value)}
                      onChange={(e) => updateSecondaryScripts(script.value, e.target.checked)}
                      disabled={!config.secondaryScripts.includes(script.value) && 
                               config.secondaryScripts.length >= config.maxScripts - 1}
                      className="rounded"
                    />
                    <label htmlFor={script.value} className="text-sm">
                      {script.label}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Display Mode */}
          <div>
            <label className="block text-sm font-medium mb-2">Display Mode</label>
            <Tabs value={config.displayMode} onValueChange={(value) => updateDisplayMode(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stacked">Stacked</TabsTrigger>
                <TabsTrigger value="overlay">Overlay</TabsTrigger>
                <TabsTrigger value="swipe">Swipe</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Font Scaling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Font Scale: {config.fontScaling.primary.toFixed(1)}x
              </label>
              <Slider
                value={[config.fontScaling.primary]}
                onValueChange={([value]) => setConfig(prev => ({
                  ...prev,
                  fontScaling: { ...prev.fontScaling, primary: value }
                }))}
                min={0.5}
                max={2.0}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Secondary Font Scale: {config.fontScaling.secondary.toFixed(1)}x
              </label>
              <Slider
                value={[config.fontScaling.secondary]}
                onValueChange={([value]) => setConfig(prev => ({
                  ...prev,
                  fontScaling: { ...prev.fontScaling, secondary: value }
                }))}
                min={0.3}
                max={1.5}
                step={0.1}
              />
            </div>
          </div>

          {/* Current Configuration Display */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium mb-2">Current Configuration:</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{SCRIPT_INVENTORY[config.primaryScript].name} (Primary)</Badge>
              {config.secondaryScripts.map(script => (
                <Badge key={script} variant="secondary">
                  {SCRIPT_INVENTORY[script].name}
                </Badge>
              ))}
              <Badge variant="outline">{config.displayMode}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image for Multi-Language AR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Upload Signboard Image'}
          </Button>

          {config.secondaryScripts.length === 0 && (
            <div className="mt-2 text-sm text-amber-600">
              ⚠️ Select at least one secondary script for multi-language display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Result */}
      {processedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Multi-Language AR Result
              </span>
              {config.displayMode === 'swipe' && regions.length > 1 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevRegion}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {currentRegionIndex + 1} / {regions.length}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextRegion}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img 
                src={processedImage} 
                alt="Multi-language AR overlay" 
                className="w-full max-w-2xl mx-auto rounded-lg border"
              />
              
              {/* Region Details */}
              {regions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Detected Regions:</h4>
                  {regions.map((region, index) => (
                    <div key={region.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Region {index + 1}</span>
                        <Badge variant="outline">{region.sourceScript}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Original: "{region.originalText}"
                      </div>
                      <div className="space-y-1">
                        {region.transliterations.map((trans, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm">{trans.text}</span>
                            <Badge variant={i === 0 ? "default" : "secondary"} className="text-xs">
                              {SCRIPT_INVENTORY[trans.script].name}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Multi-Language AR Demo</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-2 text-sm">
            <div>🎯 <strong>Stacked Mode:</strong> Shows all scripts vertically</div>
            <div>🔄 <strong>Overlay Mode:</strong> Layered transliterations with offsets</div>
            <div>👆 <strong>Swipe Mode:</strong> Switch between scripts with navigation</div>
            <div>🌍 <strong>Perfect for:</strong> Multilingual families, tourists, diverse groups</div>
            <div>🏆 <strong>Judge Appeal:</strong> "One signboard, many scripts" demonstration</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
