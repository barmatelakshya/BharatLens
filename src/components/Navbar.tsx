import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Type, 
  Camera, 
  Eye, 
  Zap, 
  Menu, 
  X,
  Globe,
  Settings
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transliterate', label: 'Transliterate', icon: Type },
    { id: 'camera', label: 'Camera OCR', icon: Camera },
    { id: 'multi-ar', label: 'Multi-Lang AR', icon: Eye },
    { id: 'features', label: 'SIH Features', icon: Zap },
    { id: 'about', label: 'About', icon: Globe }
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🇮🇳</div>
            <div className="text-white">
              <h1 className="text-xl font-bold">भारत लिपि पुल</h1>
              <p className="text-xs opacity-90">Bharat Script Bridge</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white text-orange-600 shadow-md' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Settings Button */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate('settings')}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${
                      isActive 
                        ? 'bg-white text-orange-600' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
