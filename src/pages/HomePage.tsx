import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Type, 
  Camera, 
  Eye, 
  Zap,
  Globe,
  Shield,
  Volume2,
  Brain,
  Heart
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const quickActions = [
    {
      title: "Text Transliteration",
      description: "Type or paste text for instant conversion between scripts",
      icon: Type,
      action: () => onNavigate('transliterate'),
      gradient: "from-blue-500 to-blue-600",
      page: 'transliterate'
    },
    {
      title: "Camera OCR",
      description: "Capture signboards and extract text automatically",
      icon: Camera,
      action: () => onNavigate('camera'),
      gradient: "from-green-500 to-green-600",
      page: 'camera'
    },
    {
      title: "Enhanced Features",
      description: "Display multiple scripts simultaneously on images",
      icon: Eye,
      action: () => onNavigate('multi-ar'),
      gradient: "from-purple-500 to-purple-600",
      page: 'multi-ar'
    }
  ];

  const features = [
    { icon: "🇮🇳", title: "10+ Scripts", desc: "All Indian languages" },
    { icon: "🧠", title: "AI Smart", desc: "Context understanding" },
    { icon: "🔒", title: "Privacy", desc: "Secure processing" },
    { icon: "🎨", title: "Cultural", desc: "Regional themes" },
    { icon: "🔊", title: "TTS", desc: "Native voices" },
    { icon: "🔒", title: "Private", desc: "On-device only" }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 via-white to-green-100 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-green-600 bg-clip-text text-transparent">
              BharatLens
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Revolutionary AI-powered transliteration system with advanced features, 
            advanced features, and secure processing for seamless Indian script conversion.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold text-sm text-gray-800">{feature.title}</div>
                <div className="text-xs text-gray-600">{feature.desc}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('transliterate')}
              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-10 py-4 text-xl rounded-xl shadow-lg"
            >
              Start Transliterating <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('features')}
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-10 py-4 text-xl rounded-xl"
            >
              Explore SIH Features
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Choose Your Method
            </h2>
            <p className="text-xl text-gray-600">
              Multiple ways to transliterate - pick what works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-orange-200"
                  onClick={action.action}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{action.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{action.description}</p>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-green-500 text-white hover:from-orange-600 hover:to-green-600 rounded-lg"
                    >
                      Try Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Why BharatLens?
            </h2>
            <p className="text-xl text-gray-600">
              The most advanced transliteration system for Indian languages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">AI-Powered Intelligence</h3>
              <p className="text-gray-600">Smart context understanding with semantic analysis of signage terms</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Privacy-First Design</h3>
              <p className="text-gray-600">All processing happens on your device. No data ever leaves your phone</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Cultural Sensitivity</h3>
              <p className="text-gray-600">Regional themes and motifs that respect local culture and traditions</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Volume2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Native Pronunciation</h3>
              <p className="text-gray-600">Script-specific TTS voices for authentic pronunciation in each language</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Offline Capable</h3>
              <p className="text-gray-600">Works perfectly without internet connection in rural areas</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Bridge the Script Divide?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already using BharatLens 
            to navigate India's linguistic diversity
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate('transliterate')}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg"
            >
              Start Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate('about')}
              className="border-2 border-white text-white hover:bg-white/20 px-8 py-4 text-lg rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
