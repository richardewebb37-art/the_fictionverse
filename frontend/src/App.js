import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { GatekeeperModal } from '@/components/GatekeeperModal';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthModal } from '@/components/AuthModal';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UniversesSection } from '@/components/UniversesSection';
import { AboutSection } from '@/components/AboutSection';
import { SettingsSection } from '@/components/SettingsSection';
import { Footer } from '@/components/Footer';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="App relative min-h-screen text-foreground font-space">
        {/* Static Background Image */}
        <div className="app-background" />
        
        {/* Particle Canvas (above background) */}
        <ParticleCanvas />
        
        {/* 15-Second Gatekeeper */}
        <GatekeeperModal />
        
        {/* Top Bar (Logo + Avatar) */}
        <TopBar onAuthOpen={() => setIsAuthOpen(true)} />
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
        
        {/* Main Content */}
        <main className="relative z-10 pb-24">
          <HeroSection onAuthOpen={() => setIsAuthOpen(true)} />
          <FeaturesSection />
          <UniversesSection />
          <AboutSection />
          <SettingsSection />
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Bottom Navigation (Mobile App Style) */}
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
      </div>
    </BrowserRouter>
  );
}

export default App;
