// Cultural Layer - Region-specific motifs and design elements
export interface CulturalTheme {
  region: string;
  script: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  patterns: {
    border: string;
    background: string;
    overlay: string;
  };
  motifs: string[];
  fonts: {
    primary: string;
    decorative: string;
  };
}

export const CULTURAL_THEMES: Record<string, CulturalTheme> = {
  punjab: {
    region: 'Punjab',
    script: 'gurmukhi',
    colors: {
      primary: '#FF6B35', // Saffron
      secondary: '#4A90E2', // Blue
      accent: '#F7DC6F', // Golden
      background: 'rgba(255, 107, 53, 0.1)'
    },
    patterns: {
      border: 'phulkari-border',
      background: 'wheat-pattern',
      overlay: 'geometric-punjabi'
    },
    motifs: ['🌾', '🪔', '⚔️', '🎵'],
    fonts: {
      primary: 'Noto Sans Gurmukhi',
      decorative: 'Anmoluni'
    }
  },
  
  tamil_nadu: {
    region: 'Tamil Nadu',
    script: 'tamil',
    colors: {
      primary: '#DC143C', // Deep Red
      secondary: '#FFD700', // Gold
      accent: '#228B22', // Green
      background: 'rgba(220, 20, 60, 0.1)'
    },
    patterns: {
      border: 'kolam-border',
      background: 'temple-pattern',
      overlay: 'dravidian-arch'
    },
    motifs: ['🏛️', '🪷', '🥥', '🎭'],
    fonts: {
      primary: 'Noto Sans Tamil',
      decorative: 'Latha'
    }
  },

  bengal: {
    region: 'West Bengal',
    script: 'bengali',
    colors: {
      primary: '#FF6347', // Tomato
      secondary: '#4169E1', // Royal Blue
      accent: '#FFD700', // Gold
      background: 'rgba(255, 99, 71, 0.1)'
    },
    patterns: {
      border: 'alpona-border',
      background: 'fish-pattern',
      overlay: 'bengali-scroll'
    },
    motifs: ['🐟', '🪷', '📚', '🎨'],
    fonts: {
      primary: 'Noto Sans Bengali',
      decorative: 'Kalpurush'
    }
  },

  kerala: {
    region: 'Kerala',
    script: 'malayalam',
    colors: {
      primary: '#228B22', // Forest Green
      secondary: '#FFD700', // Gold
      accent: '#8B4513', // Saddle Brown
      background: 'rgba(34, 139, 34, 0.1)'
    },
    patterns: {
      border: 'mural-border',
      background: 'coconut-pattern',
      overlay: 'kerala-mural'
    },
    motifs: ['🥥', '🐘', '⛵', '🌴'],
    fonts: {
      primary: 'Noto Sans Malayalam',
      decorative: 'Rachana'
    }
  },

  karnataka: {
    region: 'Karnataka',
    script: 'kannada',
    colors: {
      primary: '#FFD700', // Gold
      secondary: '#DC143C', // Crimson
      accent: '#4B0082', // Indigo
      background: 'rgba(255, 215, 0, 0.1)'
    },
    patterns: {
      border: 'mysore-silk-border',
      background: 'palace-pattern',
      overlay: 'hoysala-arch'
    },
    motifs: ['🏰', '🐅', '🪷', '💎'],
    fonts: {
      primary: 'Noto Sans Kannada',
      decorative: 'Kedage'
    }
  },

  telangana: {
    region: 'Telangana',
    script: 'telugu',
    colors: {
      primary: '#FF1493', // Deep Pink
      secondary: '#32CD32', // Lime Green
      accent: '#FFD700', // Gold
      background: 'rgba(255, 20, 147, 0.1)'
    },
    patterns: {
      border: 'pochampally-border',
      background: 'ikat-pattern',
      overlay: 'charminar-silhouette'
    },
    motifs: ['🏛️', '💎', '🌾', '🎭'],
    fonts: {
      primary: 'Noto Sans Telugu',
      decorative: 'Pothana2000'
    }
  }
};

export class CulturalLayerEngine {
  private isEnabled = true;
  private currentTheme: CulturalTheme | null = null;

  detectRegionFromScript(script: string): CulturalTheme | null {
    // Map scripts to regions
    const scriptRegionMap: Record<string, string> = {
      gurmukhi: 'punjab',
      tamil: 'tamil_nadu',
      bengali: 'bengal',
      malayalam: 'kerala',
      kannada: 'karnataka',
      telugu: 'telangana'
    };

    const regionKey = scriptRegionMap[script];
    return regionKey ? CULTURAL_THEMES[regionKey] : null;
  }

  applyculturalStyling(
    text: string,
    script: string,
    element?: HTMLElement
  ): {
    styledText: string;
    cssClasses: string[];
    inlineStyles: Record<string, string>;
    culturalElements: string[];
  } {
    if (!this.isEnabled) {
      return {
        styledText: text,
        cssClasses: [],
        inlineStyles: {},
        culturalElements: []
      };
    }

    const theme = this.detectRegionFromScript(script);
    if (!theme) {
      return {
        styledText: text,
        cssClasses: [],
        inlineStyles: {},
        culturalElements: []
      };
    }

    this.currentTheme = theme;

    // Add cultural motifs to text
    const motif = theme.motifs[Math.floor(Math.random() * theme.motifs.length)];
    const styledText = `${motif} ${text} ${motif}`;

    // Generate CSS classes
    const cssClasses = [
      `cultural-${theme.region.toLowerCase().replace(' ', '-')}`,
      `script-${script}`,
      'cultural-enhanced'
    ];

    // Generate inline styles
    const inlineStyles: Record<string, string> = {
      color: theme.colors.primary,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.accent,
      fontFamily: theme.fonts.primary,
      borderRadius: '8px',
      padding: '8px 12px',
      border: `2px solid ${theme.colors.accent}`,
      boxShadow: `0 2px 8px ${theme.colors.primary}20`
    };

    // Apply to element if provided
    if (element) {
      Object.assign(element.style, inlineStyles);
      element.classList.add(...cssClasses);
    }

    return {
      styledText,
      cssClasses,
      inlineStyles,
      culturalElements: theme.motifs
    };
  }

  generateCulturalCSS(): string {
    let css = `
      /* Cultural Layer Styles */
      .cultural-enhanced {
        position: relative;
        overflow: hidden;
      }
      
      .cultural-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.1;
        pointer-events: none;
        z-index: -1;
      }
    `;

    // Generate theme-specific CSS
    for (const [key, theme] of Object.entries(CULTURAL_THEMES)) {
      const className = `.cultural-${key.replace('_', '-')}`;
      
      css += `
        ${className} {
          background: linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.secondary}20);
          border-left: 4px solid ${theme.colors.primary};
        }
        
        ${className}::before {
          background: repeating-linear-gradient(
            45deg,
            ${theme.colors.accent}10,
            ${theme.colors.accent}10 10px,
            transparent 10px,
            transparent 20px
          );
        }
        
        ${className} .motif {
          color: ${theme.colors.accent};
          font-size: 1.2em;
        }
      `;
    }

    return css;
  }

  createCulturalOverlay(
    canvas: HTMLCanvasElement,
    theme: CulturalTheme,
    region: { x: number; y: number; width: number; height: number }
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current state
    ctx.save();

    // Set clipping region
    ctx.beginPath();
    ctx.rect(region.x, region.y, region.width, region.height);
    ctx.clip();

    // Draw cultural background pattern
    this.drawCulturalPattern(ctx, theme, region);

    // Draw border decoration
    this.drawCulturalBorder(ctx, theme, region);

    // Restore state
    ctx.restore();
  }

  private drawCulturalPattern(
    ctx: CanvasRenderingContext2D,
    theme: CulturalTheme,
    region: { x: number; y: number; width: number; height: number }
  ): void {
    // Simple geometric pattern based on region
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = theme.colors.accent;

    switch (theme.region) {
      case 'Punjab':
        // Phulkari-inspired diamond pattern
        this.drawDiamondPattern(ctx, region);
        break;
      case 'Tamil Nadu':
        // Kolam-inspired circular pattern
        this.drawCircularPattern(ctx, region);
        break;
      case 'West Bengal':
        // Alpona-inspired flowing pattern
        this.drawFlowingPattern(ctx, region);
        break;
      default:
        // Generic geometric pattern
        this.drawGeometricPattern(ctx, region);
    }

    ctx.globalAlpha = 1.0;
  }

  private drawDiamondPattern(ctx: CanvasRenderingContext2D, region: any): void {
    const size = 20;
    for (let x = region.x; x < region.x + region.width; x += size) {
      for (let y = region.y; y < region.y + region.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(x + size/2, y);
        ctx.lineTo(x + size, y + size/2);
        ctx.lineTo(x + size/2, y + size);
        ctx.lineTo(x, y + size/2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  private drawCircularPattern(ctx: CanvasRenderingContext2D, region: any): void {
    const radius = 15;
    for (let x = region.x; x < region.x + region.width; x += radius * 2) {
      for (let y = region.y; y < region.y + region.height; y += radius * 2) {
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawFlowingPattern(ctx: CanvasRenderingContext2D, region: any): void {
    ctx.beginPath();
    for (let x = region.x; x < region.x + region.width; x += 30) {
      ctx.moveTo(x, region.y);
      ctx.quadraticCurveTo(x + 15, region.y + region.height/2, x + 30, region.y + region.height);
    }
    ctx.stroke();
  }

  private drawGeometricPattern(ctx: CanvasRenderingContext2D, region: any): void {
    const size = 25;
    for (let x = region.x; x < region.x + region.width; x += size) {
      for (let y = region.y; y < region.y + region.height; y += size) {
        ctx.fillRect(x, y, size/2, size/2);
      }
    }
  }

  private drawCulturalBorder(
    ctx: CanvasRenderingContext2D,
    theme: CulturalTheme,
    region: { x: number; y: number; width: number; height: number }
  ): void {
    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(region.x, region.y, region.width, region.height);
    ctx.setLineDash([]);
  }

  getCurrentTheme(): CulturalTheme | null {
    return this.currentTheme;
  }

  toggle(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isActive(): boolean {
    return this.isEnabled;
  }
}

export const culturalLayerEngine = new CulturalLayerEngine();
