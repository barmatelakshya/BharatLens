// Enhanced TTS with script-specific voices and offline support
export interface TTSVoiceConfig {
  script: string;
  language: string;
  voiceName?: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const SCRIPT_VOICE_MAP: Record<string, TTSVoiceConfig> = {
  devanagari: {
    script: 'devanagari',
    language: 'hi-IN',
    voiceName: 'Google हिन्दी',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  bengali: {
    script: 'bengali',
    language: 'bn-IN',
    voiceName: 'Google বাংলা',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  tamil: {
    script: 'tamil',
    language: 'ta-IN',
    voiceName: 'Google தமிழ்',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  telugu: {
    script: 'telugu',
    language: 'te-IN',
    voiceName: 'Google తెలుగు',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  malayalam: {
    script: 'malayalam',
    language: 'ml-IN',
    voiceName: 'Google മലയാളം',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  kannada: {
    script: 'kannada',
    language: 'kn-IN',
    voiceName: 'Google ಕನ್ನಡ',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  gujarati: {
    script: 'gujarati',
    language: 'gu-IN',
    voiceName: 'Google ગુજરાતી',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  gurmukhi: {
    script: 'gurmukhi',
    language: 'pa-IN',
    voiceName: 'Google ਪੰਜਾਬੀ',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  odia: {
    script: 'odia',
    language: 'or-IN',
    voiceName: 'Google ଓଡ଼ିଆ',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0
  },
  romanization: {
    script: 'romanization',
    language: 'en-IN',
    voiceName: 'Google English (India)',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  }
};

export class EnhancedTTSEngine {
  private availableVoices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    // Wait for voices to load
    await this.loadVoices();
    this.isInitialized = true;
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const updateVoices = () => {
        this.availableVoices = speechSynthesis.getVoices();
        if (this.availableVoices.length > 0) {
          resolve();
        }
      };

      updateVoices();
      
      if (this.availableVoices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', updateVoices);
        // Fallback timeout
        setTimeout(resolve, 1000);
      }
    });
  }

  async speak(text: string, script: string, options?: Partial<TTSVoiceConfig>): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Stop any current speech
    this.stop();

    const config = { ...SCRIPT_VOICE_MAP[script], ...options };
    const voice = this.findBestVoice(config);

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.lang = config.language;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;
      
      if (voice) {
        utterance.voice = voice;
      }

      // Event handlers
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`TTS Error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log(`🔊 Speaking in ${config.language}: "${text}"`);
      };

      this.currentUtterance = utterance;
      speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause(): void {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }

  resume(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return speechSynthesis.speaking;
  }

  isPaused(): boolean {
    return speechSynthesis.paused;
  }

  private findBestVoice(config: TTSVoiceConfig): SpeechSynthesisVoice | null {
    // Try to find exact voice name match
    if (config.voiceName) {
      const exactMatch = this.availableVoices.find(voice => 
        voice.name.includes(config.voiceName!)
      );
      if (exactMatch) return exactMatch;
    }

    // Try to find language match
    const languageMatch = this.availableVoices.find(voice => 
      voice.lang === config.language
    );
    if (languageMatch) return languageMatch;

    // Try to find language prefix match (e.g., 'hi' for 'hi-IN')
    const langPrefix = config.language.split('-')[0];
    const prefixMatch = this.availableVoices.find(voice => 
      voice.lang.startsWith(langPrefix)
    );
    if (prefixMatch) return prefixMatch;

    // Fallback to default voice
    return this.availableVoices[0] || null;
  }

  getAvailableVoicesForScript(script: string): SpeechSynthesisVoice[] {
    const config = SCRIPT_VOICE_MAP[script];
    if (!config) return [];

    const langPrefix = config.language.split('-')[0];
    return this.availableVoices.filter(voice => 
      voice.lang.startsWith(langPrefix) || voice.lang === config.language
    );
  }

  // Batch speaking for multiple texts
  async speakSequence(texts: Array<{text: string, script: string}>, pauseBetween = 500): Promise<void> {
    for (let i = 0; i < texts.length; i++) {
      const { text, script } = texts[i];
      await this.speak(text, script);
      
      // Pause between texts (except for the last one)
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, pauseBetween));
      }
    }
  }

  // Get TTS capabilities report
  getTTSCapabilities(): {
    supported: boolean;
    voiceCount: number;
    supportedScripts: string[];
    recommendedVoices: Record<string, string>;
  } {
    const supportedScripts = Object.keys(SCRIPT_VOICE_MAP).filter(script => {
      const voices = this.getAvailableVoicesForScript(script);
      return voices.length > 0;
    });

    const recommendedVoices: Record<string, string> = {};
    for (const script of supportedScripts) {
      const config = SCRIPT_VOICE_MAP[script];
      const voice = this.findBestVoice(config);
      if (voice) {
        recommendedVoices[script] = voice.name;
      }
    }

    return {
      supported: 'speechSynthesis' in window,
      voiceCount: this.availableVoices.length,
      supportedScripts,
      recommendedVoices
    };
  }
}

// Singleton instance
export const ttsEngine = new EnhancedTTSEngine();

// Utility functions for quick access
export async function speakText(text: string, script: string): Promise<void> {
  return ttsEngine.speak(text, script);
}

export function stopSpeaking(): void {
  ttsEngine.stop();
}

export function isSpeaking(): boolean {
  return ttsEngine.isSpeaking();
}
