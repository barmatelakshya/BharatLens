import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
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

  const achievements = [
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
            BHARATLENS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing Indian language accessibility through AI-powered transliteration
          </p>
        </div>

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
      </div>
    </div>
  );
}
