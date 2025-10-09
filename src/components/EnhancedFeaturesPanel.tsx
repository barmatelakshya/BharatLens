import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Zap, Brain, Shield } from 'lucide-react';

interface EnhancedFeaturesPanelProps {
  currentText?: string;
  currentScript?: string;
  onFeatureToggle?: (feature: string, enabled: boolean) => void;
}

export function EnhancedFeaturesPanel({ onFeatureToggle }: EnhancedFeaturesPanelProps) {
  const [smartContextEnabled, setSmartContextEnabled] = useState(true);

  const toggleSmartContext = (enabled: boolean) => {
    setSmartContextEnabled(enabled);
    onFeatureToggle?.('smartContext', enabled);
    toast.success(`Smart Context ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Advanced Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">Smart Context</div>
                  <div className="text-xs text-gray-600">Intelligent text analysis</div>
                </div>
              </div>
              <Switch
                checked={smartContextEnabled}
                onCheckedChange={toggleSmartContext}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 text-sm space-y-2">
          <div>🧠 <strong>Smart Context:</strong> Semantic understanding beyond raw text</div>
          <div>🔒 <strong>Privacy-First:</strong> Complete on-device processing</div>
          <div>🌍 <strong>Inclusive:</strong> Pan-Indian linguistic diversity</div>
        </CardContent>
      </Card>
    </div>
  );
}
