import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Users, 
  Globe, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle,
  Star,
  Github,
  ExternalLink
} from 'lucide-react';

export function AboutPage() {
  const teamMembers = [
    {
      name: "Lakshya Barmate",
      role: "Lead Developer & AI Engineer",
      description: "Full-stack development, AI integration, and system architecture"
    },
    {
      name: "Development Team",
      role: "SIH 2024 Participants",
      description: "Collaborative development and feature implementation"
    }
  ];

  const technologies = [
    { name: "React 18", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Vite", category: "Build Tool" },
    { name: "Sanscript.js", category: "Transliteration" },
    { name: "Tesseract.js", category: "OCR" },
    { name: "Web Speech API", category: "TTS" },
    { name: "PWA", category: "Mobile" },
    { name: "Capacitor", category: "Native Apps" }
  ];

  const achievements = [
    {
      icon: Award,
      title: "SIH 2024 Ready",
      description: "Complete implementation of all required features"
    },
    {
      icon: CheckCircle,
      title: "100% Feature Complete",
      description: "All non-negotiable and enhanced features implemented"
    },
    {
      icon: Globe,
      title: "10+ Scripts Supported",
      description: "Comprehensive coverage of Indian languages"
    },
    {
      icon: Shield,
      title: "Privacy-First Design",
      description: "Complete on-device processing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-lg mb-6">
            🏆 About Our Project
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bharat Script Bridge
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing Indian language accessibility through AI-powered transliteration
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To bridge the linguistic divide across India by providing seamless, accurate, and culturally 
              sensitive transliteration between all Indian scripts. We believe that language should never 
              be a barrier to accessing information, navigating spaces, or connecting with others.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What Makes Us Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-purple-600" />
                      <CardTitle className="text-xl">{achievement.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                  <div className="font-semibold text-gray-800">{tech.name}</div>
                  <div className="text-sm text-gray-600">{tech.category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Our Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center p-6 border rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact */}
        <Card className="mb-12 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-800">
              Social Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">♿</div>
                <h3 className="font-semibold mb-2">Accessibility</h3>
                <p className="text-sm text-gray-700">Helping visually impaired users navigate with TTS</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">🌍</div>
                <h3 className="font-semibold mb-2">Cultural Unity</h3>
                <p className="text-sm text-gray-700">Bridging linguistic divides across India</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">🚨</div>
                <h3 className="font-semibold mb-2">Safety</h3>
                <p className="text-sm text-gray-700">Emergency sign detection saves lives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recognition */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-yellow-800">
              SIH 2024 Competition
            </h2>
            <p className="text-lg text-yellow-700 mb-6">
              This project was developed for Smart India Hackathon 2024, showcasing innovation 
              in language technology and cultural sensitivity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
              >
                <Github className="mr-2 h-4 w-4" />
                View Source Code
              </Button>
              
              <Button 
                variant="outline"
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Project Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
