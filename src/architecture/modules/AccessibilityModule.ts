import { IModule } from '../SystemCore';
import { ARCHITECTURE_CONFIG } from '../../config/architecture';

export class AccessibilityModule implements IModule {
  name = 'accessibility';
  version = '1.0.0';
  private ttsEnabled = ARCHITECTURE_CONFIG.modules.accessibility.tts;
  private fontSizeRange = ARCHITECTURE_CONFIG.modules.accessibility.fontSize;
  private currentFontSize = 16;
  private highContrastMode = false;

  async initialize(): Promise<void> {
    // Initialize accessibility features
    this.loadUserPreferences();
    this.setupKeyboardShortcuts();
    console.log('Accessibility module initialized');
  }

  async process(input: {
    action: 'speak' | 'adjustFont' | 'toggleContrast' | 'getPreferences';
    data?: any;
  }): Promise<any> {
    const { action, data } = input;

    switch (action) {
      case 'speak':
        return this.speakText(data.text, data.language);
      
      case 'adjustFont':
        return this.adjustFontSize(data.increase);
      
      case 'toggleContrast':
        return this.toggleHighContrast();
      
      case 'getPreferences':
        return this.getAccessibilityPreferences();
      
      default:
        throw new Error(`Unknown accessibility action: ${action}`);
    }
  }

  private async speakText(text: string, language: string = 'hi-IN'): Promise<void> {
    if (!this.ttsEnabled || !('speechSynthesis' in window)) {
      throw new Error('Text-to-speech not available');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      speechSynthesis.speak(utterance);
    });
  }

  private adjustFontSize(increase: boolean): { fontSize: number; applied: boolean } {
    const delta = increase ? 2 : -2;
    const newSize = this.currentFontSize + delta;
    
    if (newSize >= this.fontSizeRange.min && newSize <= this.fontSizeRange.max) {
      this.currentFontSize = newSize;
      this.applyFontSize(newSize);
      this.saveUserPreferences();
      
      return { fontSize: newSize, applied: true };
    }
    
    return { fontSize: this.currentFontSize, applied: false };
  }

  private applyFontSize(size: number): void {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    
    // Apply to specific elements
    const elements = document.querySelectorAll('.transliteration-text, .output-text');
    elements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${size}px`;
    });
  }

  private toggleHighContrast(): { enabled: boolean } {
    this.highContrastMode = !this.highContrastMode;
    
    if (this.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    this.saveUserPreferences();
    return { enabled: this.highContrastMode };
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Plus: Increase font size
      if ((event.ctrlKey || event.metaKey) && event.key === '=') {
        event.preventDefault();
        this.adjustFontSize(true);
      }
      
      // Ctrl/Cmd + Minus: Decrease font size
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        this.adjustFontSize(false);
      }
      
      // Ctrl/Cmd + Shift + C: Toggle high contrast
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        this.toggleHighContrast();
      }
    });
  }

  private loadUserPreferences(): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const prefs = JSON.parse(localStorage.getItem('accessibility-preferences') || '{}');
      
      if (prefs.fontSize) {
        this.currentFontSize = prefs.fontSize;
        this.applyFontSize(this.currentFontSize);
      }
      
      if (prefs.highContrast) {
        this.highContrastMode = prefs.highContrast;
        if (this.highContrastMode) {
          document.body.classList.add('high-contrast');
        }
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error);
    }
  }

  private saveUserPreferences(): void {
    if (typeof localStorage === 'undefined') return;
    
    const prefs = {
      fontSize: this.currentFontSize,
      highContrast: this.highContrastMode,
      ttsEnabled: this.ttsEnabled
    };
    
    localStorage.setItem('accessibility-preferences', JSON.stringify(prefs));
  }

  private getAccessibilityPreferences(): any {
    return {
      fontSize: this.currentFontSize,
      fontSizeRange: this.fontSizeRange,
      highContrast: this.highContrastMode,
      ttsEnabled: this.ttsEnabled,
      keyboardShortcuts: {
        'Ctrl/Cmd + =': 'Increase font size',
        'Ctrl/Cmd + -': 'Decrease font size',
        'Ctrl/Cmd + Shift + C': 'Toggle high contrast'
      }
    };
  }

  cleanup(): void {
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}
