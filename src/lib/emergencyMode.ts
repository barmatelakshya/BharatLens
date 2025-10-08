// Emergency Mode - Critical sign detection with alerts
export interface EmergencyAlert {
  type: 'danger' | 'emergency' | 'medical' | 'fire' | 'evacuation';
  message: string;
  severity: 'critical' | 'high' | 'medium';
  action: string;
  sound?: string;
  vibration?: number[];
}

export const EMERGENCY_KEYWORDS: Record<string, Record<string, string[]>> = {
  danger: {
    devanagari: ['खतरा', 'सावधान', 'चेतावनी'],
    tamil: ['ஆபத்து', 'எச்சரிக்கை', 'கவனம்'],
    bengali: ['বিপদ', 'সাবধান', 'সতর্কতা'],
    telugu: ['ప్రమాదం', 'జాగ్రత్త', 'హెచ్చరిక'],
    kannada: ['ಅಪಾಯ', 'ಎಚ್ಚರಿಕೆ', 'ಜಾಗರೂಕತೆ'],
    malayalam: ['അപകടം', 'മുന്നറിയിപ്പ്', 'ശ്രദ്ധ'],
    gujarati: ['જોખમ', 'સાવધાન', 'ચેતવણી'],
    gurmukhi: ['ਖ਼ਤਰਾ', 'ਸਾਵਧਾਨ', 'ਚੇਤਾਵਨੀ'],
    odia: ['ବିପଦ', 'ସାବଧାନ', 'ଚେତାବନୀ'],
    romanization: ['danger', 'warning', 'caution', 'alert']
  },
  emergency: {
    devanagari: ['आपातकाल', 'तुरंत', 'जल्दी'],
    tamil: ['அவசரநிலை', 'உடனடி', 'விரைவு'],
    bengali: ['জরুরি', 'তাৎক্ষণিক', 'দ্রুত'],
    telugu: ['అత్యవసర', 'తక్షణం', 'వేగంగా'],
    kannada: ['ತುರ್ತು', 'ತಕ್ಷಣ', 'ವೇಗವಾಗಿ'],
    malayalam: ['അടിയന്തിര', 'ഉടനടി', 'വേഗം'],
    gujarati: ['કટોકટી', 'તાત્કાલિક', 'ઝડપથી'],
    gurmukhi: ['ਐਮਰਜੈਂਸੀ', 'ਤੁਰੰਤ', 'ਜਲਦੀ'],
    odia: ['ଜରୁରୀକାଳୀନ', 'ତତକ୍ଷଣାତ', 'ଶୀଘ୍ର'],
    romanization: ['emergency', 'urgent', 'immediate', 'quick']
  },
  evacuation: {
    devanagari: ['निकास', 'भागो', 'छोड़ो'],
    tamil: ['வெளியேறு', 'ஓடு', 'விட்டுச்செல்'],
    bengali: ['প্রস্থান', 'পালাও', 'ছেড়ে দাও'],
    telugu: ['నిష్క్రమణ', 'పరుగు', 'వదిలేయండి'],
    kannada: ['ನಿರ್ಗಮನ', 'ಓಡು', 'ಬಿಡು'],
    malayalam: ['പുറത്തുകടക്കുക', 'ഓടുക', 'വിടുക'],
    gujarati: ['બહાર નીકળો', 'દોડો', 'છોડો'],
    gurmukhi: ['ਬਾਹਰ ਨਿਕਲੋ', 'ਭੱਜੋ', 'ਛੱਡੋ'],
    odia: ['ବାହାରକୁ', 'ଦୌଡ଼', 'ଛାଡ଼'],
    romanization: ['exit', 'evacuate', 'leave', 'run']
  },
  fire: {
    devanagari: ['आग', 'अग्नि', 'जलना'],
    tamil: ['தீ', 'நெருப்பு', 'எரி'],
    bengali: ['আগুন', 'অগ্নি', 'জ্বলা'],
    telugu: ['అగ్ని', 'మంట', 'కాలు'],
    kannada: ['ಬೆಂಕಿ', 'ಅಗ್ನಿ', 'ಸುಡು'],
    malayalam: ['തീ', 'അഗ്നി', 'കത്തുക'],
    gujarati: ['આગ', 'અગ્નિ', 'બળવું'],
    gurmukhi: ['ਅੱਗ', 'ਅਗਨੀ', 'ਸੜਨਾ'],
    odia: ['ଅଗ୍ନି', 'ନିଆଁ', 'ଜଳିବା'],
    romanization: ['fire', 'flame', 'burn', 'smoke']
  }
};

export class EmergencyModeEngine {
  private isActive = false;
  private alertCallback?: (alert: EmergencyAlert) => void;

  activate(alertCallback?: (alert: EmergencyAlert) => void): void {
    this.isActive = true;
    this.alertCallback = alertCallback;
    console.log('🚨 Emergency Mode ACTIVATED');
  }

  deactivate(): void {
    this.isActive = false;
    this.alertCallback = undefined;
    console.log('✅ Emergency Mode deactivated');
  }

  scanForEmergencyTerms(text: string, script: string): EmergencyAlert[] {
    if (!this.isActive) return [];

    const alerts: EmergencyAlert[] = [];
    const normalizedText = text.toLowerCase();

    // Check each emergency category
    for (const [category, scriptKeywords] of Object.entries(EMERGENCY_KEYWORDS)) {
      const keywords = scriptKeywords[script] || [];
      
      for (const keyword of keywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          const alert = this.createAlert(category as keyof typeof EMERGENCY_KEYWORDS, keyword);
          alerts.push(alert);
          
          // Trigger immediate alert
          if (this.alertCallback) {
            this.alertCallback(alert);
          }
          
          // Trigger device alerts
          this.triggerDeviceAlert(alert);
        }
      }
    }

    return alerts.sort((a, b) => this.getSeverityScore(b.severity) - this.getSeverityScore(a.severity));
  }

  private createAlert(category: keyof typeof EMERGENCY_KEYWORDS, keyword: string): EmergencyAlert {
    const alertMap: Record<string, EmergencyAlert> = {
      danger: {
        type: 'danger',
        message: `⚠️ DANGER DETECTED: "${keyword}"`,
        severity: 'critical',
        action: 'Exercise extreme caution. Avoid the area if possible.',
        vibration: [200, 100, 200, 100, 200]
      },
      emergency: {
        type: 'emergency',
        message: `🚨 EMERGENCY: "${keyword}"`,
        severity: 'critical',
        action: 'Seek immediate assistance. Call emergency services if needed.',
        vibration: [300, 150, 300, 150, 300]
      },
      evacuation: {
        type: 'evacuation',
        message: `🏃 EVACUATION: "${keyword}"`,
        severity: 'critical',
        action: 'Leave the area immediately. Follow evacuation procedures.',
        vibration: [100, 50, 100, 50, 100, 50, 100]
      },
      fire: {
        type: 'fire',
        message: `🔥 FIRE ALERT: "${keyword}"`,
        severity: 'critical',
        action: 'Exit immediately. Do not use elevators. Call fire department.',
        vibration: [400, 200, 400, 200, 400]
      }
    };

    return alertMap[category] || {
      type: 'emergency',
      message: `🚨 ALERT: "${keyword}"`,
      severity: 'high',
      action: 'Stay alert and follow safety protocols.',
      vibration: [200, 100, 200]
    };
  }

  private triggerDeviceAlert(alert: EmergencyAlert): void {
    // Vibration
    if ('vibrate' in navigator && alert.vibration) {
      navigator.vibrate(alert.vibration);
    }

    // Audio alert
    this.playAlertSound(alert.severity);

    // Visual alert (handled by UI component)
    console.log(`🚨 ${alert.severity.toUpperCase()}: ${alert.message}`);
  }

  private playAlertSound(severity: 'critical' | 'high' | 'medium'): void {
    if (!('AudioContext' in window)) return;

    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different severities
      const frequencies = {
        critical: 800,
        high: 600,
        medium: 400
      };

      oscillator.frequency.setValueAtTime(frequencies[severity], audioContext.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Audio alert failed:', error);
    }
  }

  private getSeverityScore(severity: 'critical' | 'high' | 'medium'): number {
    const scores = { critical: 3, high: 2, medium: 1 };
    return scores[severity];
  }

  isEmergencyModeActive(): boolean {
    return this.isActive;
  }

  // Quick scan mode for rapid detection
  quickScan(text: string, script: string): boolean {
    const criticalKeywords = [
      ...EMERGENCY_KEYWORDS.danger[script] || [],
      ...EMERGENCY_KEYWORDS.emergency[script] || [],
      ...EMERGENCY_KEYWORDS.fire[script] || []
    ];

    const normalizedText = text.toLowerCase();
    return criticalKeywords.some(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    );
  }
}

export const emergencyModeEngine = new EmergencyModeEngine();

// Detect emergency terms function for feature testing
export function detectEmergencyTerms(text: string, script: string = 'romanization'): {
  detected: boolean;
  terms: string[];
  severity: 'critical' | 'high' | 'medium' | 'none';
  alerts: EmergencyAlert[];
} {
  const normalizedText = text.toLowerCase();
  const detectedTerms: string[] = [];
  let highestSeverity: 'critical' | 'high' | 'medium' | 'none' = 'none';

  // Check each emergency category
  for (const [category, scriptKeywords] of Object.entries(EMERGENCY_KEYWORDS)) {
    const keywords = scriptKeywords[script] || [];
    
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        detectedTerms.push(keyword);
        
        // Determine severity based on category
        if (category === 'danger' || category === 'emergency' || category === 'fire') {
          highestSeverity = 'critical';
        } else if (category === 'evacuation' && highestSeverity !== 'critical') {
          highestSeverity = 'high';
        } else if (highestSeverity === 'none') {
          highestSeverity = 'medium';
        }
      }
    }
  }

  // Generate alerts if terms detected
  const alerts = detectedTerms.length > 0 ? 
    emergencyModeEngine.scanForEmergencyTerms(text, script) : [];

  return {
    detected: detectedTerms.length > 0,
    terms: detectedTerms,
    severity: highestSeverity,
    alerts
  };
}
