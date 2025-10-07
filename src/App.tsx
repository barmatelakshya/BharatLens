import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { HomePage } from "@/pages/HomePage";
import { TransliteratePage } from "@/pages/TransliteratePage";
import { AboutPage } from "@/pages/AboutPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { FeatureTestPage } from "@/pages/FeatureTestPage";
import { CameraCapture } from "@/components/CameraCapture";
import { MultiLanguageAROverlay } from "@/components/MultiLanguageAROverlay";
import { EnhancedFeaturesPanel } from "@/components/EnhancedFeaturesPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    toast.success(`Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)}`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      
      case 'transliterate':
        return <TransliteratePage />;
      
      case 'camera':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Camera OCR
                </h1>
                <p className="text-xl text-gray-600">
                  Capture signboards and extract text for transliteration
                </p>
              </div>
              
              <Card className="shadow-2xl border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-center">
                    Live Camera Capture
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <CameraCapture 
                    onCapture={(file) => {
                      toast.success("Image captured! Processing with OCR...");
                    }} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'multi-ar':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Multi-Language AR Overlay
                </h1>
                <p className="text-xl text-gray-600">
                  Display multiple scripts simultaneously on signboards
                </p>
              </div>
              
              <MultiLanguageAROverlay 
                onRegionsDetected={(regions) => {
                  toast.success(`🎯 ${regions.length} regions processed for multi-language display`);
                }}
              />
            </div>
          </div>
        );
      
      case 'features':
        return (
          <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  SIH-Winning Features
                </h1>
                <p className="text-xl text-gray-600">
                  Advanced AI capabilities and enhanced functionality
                </p>
              </div>
              
              <EnhancedFeaturesPanel 
                currentText="नमस्ते दोस्त"
                currentScript="devanagari"
                onFeatureToggle={(feature, enabled) => {
                  toast.info(`${feature} ${enabled ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>
          </div>
        );
      
      case 'about':
        return <AboutPage />;
      
      case 'settings':
        return <SettingsPage />;
      
      case 'test':
        return <FeatureTestPage />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
          <main>
            {renderPage()}
          </main>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
