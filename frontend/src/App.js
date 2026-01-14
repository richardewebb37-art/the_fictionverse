import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { GatekeeperModal } from '@/components/GatekeeperModal';
import { SplashAnimation } from '@/components/SplashAnimation';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthModal } from '@/components/AuthModal';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UniversesSection } from '@/components/UniversesSection';
import { AboutSection } from '@/components/AboutSection';
import { SettingsSection } from '@/components/SettingsSection';
import { Footer } from '@/components/Footer';
import ExplorePage from '@/pages/ExplorePage';
import StoryReader from '@/pages/StoryReader';

const HomePage = ({ onAuthOpen }) => (
  <main className="relative z-10 pb-24">
    <HeroSection onAuthOpen={onAuthOpen} />
    <FeaturesSection />
    <UniversesSection />
    <AboutSection />
    <Footer />
  </main>
);

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    const seen = localStorage.getItem('fv_splash_seen');
    return !seen;
  });
  const [hasSeenSplash, setHasSeenSplash] = useState(() => {
    const seen = localStorage.getItem('fv_splash_seen');
    return !!seen;
  });

  const handleSplashComplete = () => {
    localStorage.setItem('fv_splash_seen', 'true');
    setShowSplash(false);
    setHasSeenSplash(true);
  };

  return (
    <BrowserRouter>
      <div className="App relative min-h-screen text-foreground font-space">
        {/* Splash Animation - First Time Only */}
        {showSplash && <SplashAnimation onComplete={handleSplashComplete} />}
        
        {/* Main App - Hidden Until Splash Complete */}
        {hasSeenSplash && (
          <>
            {/* Static Background Image */}
            <div className="app-background" />
            
            {/* Particle Canvas (above background) */}
            <ParticleCanvas />
            
            {/* 15-Second Gatekeeper - Only after splash */}
            <GatekeeperModal />
            
            {/* Top Bar (Logo + Avatar) - Darker */}
            <TopBar onAuthOpen={() => setIsAuthOpen(true)} />
            
            {/* Auth Modal */}
            <AuthModal 
              isOpen={isAuthOpen} 
              onClose={() => setIsAuthOpen(false)} 
            />
            
            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage onAuthOpen={() => setIsAuthOpen(true)} />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/read/:universeId/:chapterNum" element={<StoryReader />} />
            </Routes>
            
            {/* Bottom Navigation (Mobile App Style) - Darker */}
            <BottomNavigation />
            
            {/* Toast Notifications */}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--popover))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
