import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { GatekeeperModal } from '@/components/GatekeeperModal';
import { Navigation } from '@/components/Navigation';
import { AuthModal } from '@/components/AuthModal';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UniversesSection } from '@/components/UniversesSection';
import { Footer } from '@/components/Footer';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="App relative min-h-screen bg-background text-foreground font-space">
        {/* Particle Background */}
        <ParticleCanvas />
        
        {/* 15-Second Gatekeeper */}
        <GatekeeperModal />
        
        {/* Navigation */}
        <Navigation onAuthOpen={() => setIsAuthOpen(true)} />
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
        
        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection onAuthOpen={() => setIsAuthOpen(true)} />
          <FeaturesSection />
          <UniversesSection />
        </main>
        
        {/* Footer */}
        <Footer />
        
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
