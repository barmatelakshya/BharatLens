// System architecture configuration
export const ARCHITECTURE_CONFIG = {
  client: {
    offlineFirst: true,
    privacy: {
      onDeviceProcessing: true,
      noDataTransmission: true,
      optInTelemetry: false
    },
    performance: {
      useWebAssembly: true,
      gpuAcceleration: true,
      cacheModels: true
    }
  },
  modules: {
    scriptDetector: {
      enabled: true,
      confidence: 0.8,
      fallback: 'devanagari'
    },
    ocrRunner: {
      models: ['hin', 'ben', 'tam', 'tel', 'kan', 'mal', 'guj', 'pan', 'ori'],
      preprocessing: true,
      postCorrection: true
    },
    transliterationEngine: {
      pipeline: ['normalize', 'segment', 'phonemic', 'rules', 'render'],
      ruleFormat: 'json',
      versioning: true
    },
    arOverlay: {
      textDetection: true,
      perspectiveCorrection: true,
      fontMatching: true,
      contrastAware: true
    },
    accessibility: {
      tts: true,
      highContrast: true,
      fontSize: { min: 12, max: 32 }
    }
  },
  updates: {
    deltaUpdates: true,
    signedPackages: true,
    autoCheck: false
  }
};
