import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Pause, Play, Square, Settings } from 'lucide-react';
import { ttsEngine, SCRIPT_VOICE_MAP } from '@/lib/enhancedTTS';
import { toast } from 'sonner';

interface TTSControlsProps {
  text: string;
  script: string;
  className?: string;
  showAdvanced?: boolean;
}

export function TTSControls({ text, script, className = '', showAdvanced = false }: TTSControlsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.8);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    initializeTTS();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(ttsEngine.isSpeaking());
      setIsPaused(ttsEngine.isPaused());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const initializeTTS = async () => {
    try {
      await ttsEngine.initialize();
      setIsInitialized(true);
      setAvailableVoices(ttsEngine.getAvailableVoicesForScript(script));
      toast.success('🔊 TTS Ready');
    } catch (error) {
      console.error('TTS initialization failed:', error);
      toast.error('TTS not available');
    }
  };

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    try {
      const config = SCRIPT_VOICE_MAP[script];
      const scriptName = config ? config.script : script;
      
      toast.info(`🔊 Speaking in ${scriptName}...`);
      
      await ttsEngine.speak(text, script, {
        rate,
        pitch,
        volume
      });
      
      toast.success('✅ Speech completed');
    } catch (error) {
      console.error('TTS error:', error);
      toast.error('Speech failed');
    }
  };

  const handleStop = () => {
    ttsEngine.stop();
    toast.info('🔇 Speech stopped');
  };

  const handlePause = () => {
    if (isPaused) {
      ttsEngine.resume();
      toast.info('▶️ Speech resumed');
    } else {
      ttsEngine.pause();
      toast.info('⏸️ Speech paused');
    }
  };

  if (!isInitialized) {
    return (
      <Button variant="outline" disabled className={className}>
        <Volume2 className="h-4 w-4 mr-2" />
        Loading TTS...
      </Button>
    );
  }

  const config = SCRIPT_VOICE_MAP[script];
  const hasVoiceSupport = availableVoices.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main TTS Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeak}
          disabled={!hasVoiceSupport || isSpeaking}
          className="flex items-center gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Speak
          {config && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {config.language.split('-')[0].toUpperCase()}
            </Badge>
          )}
        </Button>

        {isSpeaking && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              className="flex items-center gap-1"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              className="flex items-center gap-1"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </>
        )}

        {!hasVoiceSupport && (
          <Badge variant="destructive" className="text-xs">
            No voice available for {script}
          </Badge>
        )}
      </div>

      {/* Advanced Controls */}
      {showAdvanced && hasVoiceSupport && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Speed Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Speed</label>
                <span className="text-sm text-gray-600">{rate.toFixed(1)}x</span>
              </div>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.1}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Pitch</label>
                <span className="text-sm text-gray-600">{pitch.toFixed(1)}</span>
              </div>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.1}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Volume Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Volume</label>
                <span className="text-sm text-gray-600">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0.0}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Voice Info */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600">
                <div>Available voices: {availableVoices.length}</div>
                {config && (
                  <div>Language: {config.language}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Status Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {isSpeaking && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Speaking...</span>
          </div>
        )}
        {isPaused && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Paused</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick TTS Button Component
export function QuickTTSButton({ text, script, className = '' }: { text: string; script: string; className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSpeak = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      await ttsEngine.speak(text, script);
    } catch (error) {
      toast.error('Speech failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleQuickSpeak}
      disabled={isLoading}
      className={`flex items-center gap-1 ${className}`}
    >
      {isLoading ? (
        <VolumeX className="h-4 w-4 animate-pulse" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      Speak
    </Button>
  );
}
