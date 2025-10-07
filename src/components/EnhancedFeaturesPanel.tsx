import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  AlertTriangle, 
  Palette, 
  Zap, 
  Shield, 
  Users,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { smartContextEngine } from '@/lib/smartContextMode';
import { emergencyModeEngine, EmergencyAlert } from '@/lib/emergencyMode';
import { culturalLayerEngine } from '@/lib/culturalLayer';
import { toast } from 'sonner';

interface EnhancedFeaturesPanelProps {
  currentText?: string;
  currentScript?: string;
  onFeatureToggle?: (feature: string, enabled: boolean) => void;
}

export function EnhancedFeaturesPanel({ 
  currentText = '', 
  currentScript = 'devanagari',
  onFeatureToggle 
}: EnhancedFeaturesPanelProps) {
  const [smartContextEnabled, setSmartContextEnabled] = useState(true);
  const [emergencyModeActive, setEmergencyModeActive] = useState(false);
  const [culturalLayerEnabled, setCulturalLayerEnabled] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [contextualTerms, setContextualTerms] = useState<any[]>([]);

  useEffect(() => {
    // Initialize engines
    smartContextEngine.toggle(smartContextEnabled);
    culturalLayerEngine.toggle(culturalLayerEnabled);
    
    if (emergencyModeActive) {
      emergencyModeEngine.activate((alert) => {
        setEmergencyAlerts(prev => [...prev, alert]);
        toast.error(alert.message, {
          description: alert.action,
          duration: 10000
        });
      });
    } else {
      emergencyModeEngine.deactivate();
    }

    return () => {
      emergencyModeEngine.deactivate();
    };
  }, [smartContextEnabled, emergencyModeActive, culturalLayerEnabled]);

  useEffect(() => {
    if (currentText && smartContextEnabled) {
      const terms = smartContextEngine.detectContextualTerms(currentText, currentScript);
      setContextualTerms(terms);
    }

    if (currentText && emergencyModeActive) {
      const alerts = emergencyModeEngine.scanForEmergencyTerms(currentText, currentScript);
      if (alerts.length > 0) {
        setEmergencyAlerts(prev => [...prev, ...alerts]);
      }
    }
  }, [currentText, currentScript, smartContextEnabled, emergencyModeActive]);

  const toggleSmartContext = (enabled: boolean) => {
    setSmartContextEnabled(enabled);
    smartContextEngine.toggle(enabled);
    onFeatureToggle?.('smartContext', enabled);
    toast.success(`Smart Context ${enabled ? 'enabled' : 'disabled'}`);
  };

  const toggleEmergencyMode = (enabled: boolean) => {
    setEmergencyModeActive(enabled);
    onFeatureToggle?.('emergencyMode', enabled);
    
    if (enabled) {
      toast.warning('🚨 Emergency Mode ACTIVATED - Scanning for critical signs');
    } else {
      toast.info('Emergency Mode deactivated');
      setEmergencyAlerts([]);
    }
  };

  const toggleCulturalLayer = (enabled: boolean) => {
    setCulturalLayerEnabled(enabled);
    culturalLayerEngine.toggle(enabled);
    onFeatureToggle?.('culturalLayer', enabled);
    toast.success(`Cultural Layer ${enabled ? 'enabled' : 'disabled'}`);
  };

  const clearEmergencyAlerts = () => {
    setEmergencyAlerts([]);
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Features Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            SIH-Winning Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Smart Context Mode */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">Smart Context</div>
                  <div className="text-xs text-gray-600">Semantic understanding</div>
                </div>
              </div>
              <Switch
                checked={smartContextEnabled}
                onCheckedChange={toggleSmartContext}
              />
            </div>

            {/* Emergency Mode */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium text-sm">Emergency Mode</div>
                  <div className="text-xs text-gray-600">Critical sign detection</div>
                </div>
              </div>
              <Switch
                checked={emergencyModeActive}
                onCheckedChange={toggleEmergencyMode}
              />
            </div>

            {/* Cultural Layer */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="font-medium text-sm">Cultural Layer</div>
                  <div className="text-xs text-gray-600">Regional motifs</div>
                </div>
              </div>
              <Switch
                checked={culturalLayerEnabled}
                onCheckedChange={toggleCulturalLayer}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alerts */}
      {emergencyAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Alerts ({emergencyAlerts.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearEmergencyAlerts}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {emergencyAlerts.slice(-3).map((alert, index) => (
              <Alert key={index} className="border-red-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-sm text-red-700 mt-1">{alert.action}</div>
                  <Badge variant="destructive" className="mt-2">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Smart Context Results */}
      {contextualTerms.length > 0 && smartContextEnabled && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Smart Context Detected ({contextualTerms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contextualTerms.map((detected, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <span className="text-2xl">{detected.term.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{detected.term.term}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {detected.term.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Confidence</div>
                    <div className="font-mono text-sm">{Math.round(detected.confidence * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural Theme Info */}
      {culturalLayerEnabled && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Cultural Layer Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const theme = culturalLayerEngine.detectRegionFromScript(currentScript);
              return theme ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{theme.region}</Badge>
                    <Badge variant="secondary">{theme.script}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Motifs:</span>
                    {theme.motifs.map((motif, i) => (
                      <span key={i} className="text-lg">{motif}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 text-sm">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <span className="text-gray-600 ml-2">Regional color palette</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  No cultural theme available for {currentScript}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Feature Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Enhanced Features Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {smartContextEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span>Smart Context</span>
            </div>
            
            <div className="flex items-center gap-2">
              {emergencyModeActive ? (
                <CheckCircle className="h-4 w-4 text-red-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span>Emergency Mode</span>
            </div>
            
            <div className="flex items-center gap-2">
              {culturalLayerEnabled ? (
                <CheckCircle className="h-4 w-4 text-purple-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-400" />
              )}
              <span>Cultural Layer</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Privacy-First</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Judge Appeal Info */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            SIH Judge Appeal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 text-sm space-y-2">
          <div>🧠 <strong>Smart Context:</strong> Semantic understanding beyond raw text</div>
          <div>🚨 <strong>Emergency Mode:</strong> Life-saving critical sign detection</div>
          <div>🎨 <strong>Cultural Layer:</strong> Respectful regional design integration</div>
          <div>🔒 <strong>Privacy-First:</strong> Complete on-device processing</div>
          <div>🌍 <strong>Inclusive:</strong> Pan-Indian cultural sensitivity</div>
        </CardContent>
      </Card>
    </div>
  );
}
