#!/usr/bin/env node

// BharatLens Demo Script
console.log('🇮🇳 BharatLens - Interactive Demo\n');
console.log('=====================================\n');

// Demo 1: Emergency Detection
console.log('🚨 DEMO 1: Emergency Detection System');
console.log('-------------------------------------');

const emergencyScenarios = [
  { text: 'DANGER - High Voltage', expected: 'CRITICAL ALERT' },
  { text: 'खतरा - विद्युत का झटका', expected: 'CRITICAL ALERT' },
  { text: 'ஆபத்து - மின்சாரம்', expected: 'CRITICAL ALERT' },
  { text: 'Emergency Exit Only', expected: 'HIGH PRIORITY' },
  { text: 'Regular signboard text', expected: 'NO ALERT' }
];

emergencyScenarios.forEach((scenario, index) => {
  console.log(`Test ${index + 1}: "${scenario.text}"`);
  console.log(`Expected: ${scenario.expected}`);
  
  // Simulate emergency detection
  const hasEmergencyTerm = /danger|खतरा|ஆபத்து|emergency|fire|evacuation/i.test(scenario.text);
  if (hasEmergencyTerm) {
    console.log('🚨 ALERT TRIGGERED! Device vibration + sound alert');
  } else {
    console.log('✅ Normal text - no alerts');
  }
  console.log('');
});

// Demo 2: Script Transliteration
console.log('📝 DEMO 2: Multi-Script Transliteration');
console.log('---------------------------------------');

const transliterationDemo = [
  { source: 'namaste', from: 'romanization', to: 'devanagari', result: 'नमस्ते' },
  { source: 'hospital', from: 'english', to: 'tamil', result: 'மருத்துவமனை' },
  { source: 'station', from: 'english', to: 'bengali', result: 'স্টেশন' },
  { source: 'temple', from: 'english', to: 'kannada', result: 'ದೇವಾಲಯ' }
];

transliterationDemo.forEach((demo, index) => {
  console.log(`${index + 1}. ${demo.source} (${demo.from}) → ${demo.result} (${demo.to})`);
});
console.log('');

// Demo 3: Context Analysis
console.log('🧠 DEMO 3: Smart Context Analysis');
console.log('----------------------------------');

const contextExamples = [
  { text: 'Railway Station Platform 1', category: 'Transport', icon: '🚉', priority: 'Medium' },
  { text: 'Emergency Hospital Entrance', category: 'Medical + Emergency', icon: '🏥🚨', priority: 'Critical' },
  { text: 'Shiva Temple Main Gate', category: 'Religious', icon: '🛕', priority: 'Low' },
  { text: 'Fire Exit - Keep Clear', category: 'Emergency', icon: '🔥🚪', priority: 'Critical' }
];

contextExamples.forEach((example, index) => {
  console.log(`${index + 1}. "${example.text}"`);
  console.log(`   Category: ${example.category}`);
  console.log(`   Icon: ${example.icon}`);
  console.log(`   Priority: ${example.priority}`);
  console.log('');
});

// Demo 4: AR Overlay Modes
console.log('🔍 DEMO 4: AR Overlay Display Modes');
console.log('------------------------------------');

const arModes = [
  {
    mode: 'Overlay Mode',
    description: 'Transliterated text overlaid on original image',
    useCase: 'Real-time camera view'
  },
  {
    mode: 'Stacked Mode', 
    description: 'Multiple scripts displayed vertically',
    useCase: 'Detailed comparison view'
  },
  {
    mode: 'Swipe Mode',
    description: 'Swipe between different script versions',
    useCase: 'Interactive learning'
  }
];

arModes.forEach((mode, index) => {
  console.log(`${index + 1}. ${mode.mode}`);
  console.log(`   Description: ${mode.description}`);
  console.log(`   Use Case: ${mode.useCase}`);
  console.log('');
});

// Demo 5: Cultural Sensitivity
console.log('🎨 DEMO 5: Cultural Sensitivity Features');
console.log('----------------------------------------');

const culturalFeatures = [
  { region: 'Tamil Nadu', theme: 'Traditional Tamil motifs', colors: 'Red, Gold' },
  { region: 'Kerala', theme: 'Backwater and coconut themes', colors: 'Green, Brown' },
  { region: 'Rajasthan', theme: 'Desert and palace motifs', colors: 'Orange, Yellow' },
  { region: 'Bengal', theme: 'Cultural and artistic themes', colors: 'Red, White' }
];

culturalFeatures.forEach((feature, index) => {
  console.log(`${index + 1}. ${feature.region}`);
  console.log(`   Theme: ${feature.theme}`);
  console.log(`   Colors: ${feature.colors}`);
  console.log('');
});

// Summary
console.log('📊 DEMO SUMMARY');
console.log('===============');
console.log('✅ Emergency Detection: Real-time safety alerts');
console.log('✅ Multi-Script Support: 9 Indian languages');
console.log('✅ Context Analysis: Smart signage understanding');
console.log('✅ AR Overlay: Multiple display modes');
console.log('✅ Cultural Sensitivity: Regional customization');
console.log('✅ Offline Capability: Works without internet');
console.log('✅ PWA Ready: Install as mobile app');
console.log('');

console.log('🚀 Ready to test BharatLens!');
console.log('');
console.log('Next Steps:');
console.log('1. npm run dev - Start development server');
console.log('2. Open http://localhost:8080/BharatLens/');
console.log('3. Test camera OCR with signboard images');
console.log('4. Try emergency detection with danger signs');
console.log('5. Explore multi-script transliteration');
console.log('');
console.log('🏆 SIH 2024 - Digital India Initiative');
