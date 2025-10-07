# 🇮🇳 BharatLens - Bharat Script Bridge

[![SIH 2024](https://img.shields.io/badge/SIH-2024-orange)](https://sih.gov.in/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)

> Revolutionary AI-powered transliteration system with multi-language AR overlay, emergency detection, and cultural sensitivity for seamless Indian script conversion.

## 🚀 Features

### Core Capabilities
- **10+ Indian Scripts**: Devanagari, Tamil, Bengali, Telugu, Kannada, Malayalam, Gujarati, Gurmukhi, Odia
- **Multi-Input Methods**: Text, Camera OCR, Image Upload
- **Real-time Processing**: Instant transliteration with live preview
- **Offline-First**: Complete functionality without internet

### 🏆 SIH-Winning Innovations
- **Multi-Language AR Overlay**: Display multiple scripts simultaneously on signboards
- **Emergency Detection**: Life-saving alerts for danger signs with device notifications
- **Cultural Sensitivity**: Regional themes and motifs respecting local traditions
- **Smart Context Mode**: AI-powered understanding of signage and place names
- **Script-Specific TTS**: Native pronunciation with regional voices
- **Privacy-First Design**: All processing happens on-device

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **AI/ML**: Tesseract.js OCR + Custom transliteration engine
- **Mobile**: PWA + Capacitor for native deployment
- **State**: React Query + Local Storage

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd bharatlens

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile App Deployment
```bash
# Add mobile platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

## 🎯 Usage

### Text Transliteration
1. Navigate to **Transliterate** page
2. Select source and target scripts
3. Type or paste text
4. Get instant transliteration with TTS

### Camera OCR
1. Go to **Camera OCR** page
2. Point camera at signboard or text
3. Capture image for automatic text extraction
4. View transliterated results

### Multi-Language AR
1. Access **Multi-Lang AR** feature
2. Upload signboard image
3. See multiple script overlays simultaneously
4. Switch between display modes (Overlay/Stacked/Swipe)

## 🔧 Configuration

### Settings Panel
- **TTS Settings**: Voice selection, speed control
- **AR Overlay**: Display mode, opacity adjustment
- **Privacy**: Offline mode, data collection preferences
- **Cultural**: Regional themes and preferences
- **Emergency**: Alert configurations

## 🌟 Key Innovations

### 1. Multi-Language AR Overlay
First-of-its-kind system displaying multiple Indian scripts simultaneously on the same signboard image.

### 2. Emergency Detection System
AI-powered recognition of danger signs (खतरा, ஆபத்து, বিপদ) with instant device alerts.

### 3. Cultural Sensitivity Engine
Regional adaptation with appropriate motifs, colors, and themes for different Indian states.

### 4. Smart Context Understanding
Semantic analysis for better translation of place names, directions, and signage terms.

## 📊 Supported Scripts

| Script | Language | Status |
|--------|----------|--------|
| देवनागरी | Hindi/Sanskrit | ✅ |
| தமிழ் | Tamil | ✅ |
| বাংলা | Bengali | ✅ |
| తెలుగు | Telugu | ✅ |
| ಕನ್ನಡ | Kannada | ✅ |
| മലയാളം | Malayalam | ✅ |
| ગુજરાતી | Gujarati | ✅ |
| ਪੰਜਾਬੀ | Punjabi | ✅ |
| ଓଡ଼ିଆ | Odia | ✅ |

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── lib/                # Core libraries and utilities
├── data/               # Script data and configurations
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 SIH 2024 Compliance

- ✅ Multi-script support (10+ Indian languages)
- ✅ Auto-detection capabilities
- ✅ Real-time OCR processing
- ✅ Advanced transliteration engine
- ✅ AR overlay functionality
- ✅ Offline-first architecture
- ✅ Accessibility features
- ✅ Copy/share/export capabilities
- ✅ Enhanced TTS system
- ✅ Emergency detection
- ✅ Cultural sensitivity
- ✅ Privacy-first design

## 🌐 Live Demo

[Deploy your app and add link here]

## 📞 Contact

**Team BharatLens**
- Email: [your-email]
- GitHub: [your-github]

---

**Made with ❤️ for Digital India Initiative**
