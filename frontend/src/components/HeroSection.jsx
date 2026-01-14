import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = ({ onAuthOpen }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-4"
    >
      <div className="container mx-auto max-w-6xl fade-in">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-neon-cyan text-sm">
            <Sparkles size={16} className="animate-pulse" />
            <span>Welcome to the Nexus</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
            Stories begin <br />
            <span className="neon-text">with you.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to the Nexus. Here, every story is an invitation to dream, 
            connect, and explore together. Join a community where imagination knows no bounds.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={onAuthOpen}
              className="btn-glow bg-foreground text-background hover:bg-neon-cyan hover:text-primary-foreground text-lg px-8 py-6 group"
            >
              Join now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('universes')}
              className="border-foreground text-foreground hover:border-neon-cyan hover:text-neon-cyan text-lg px-8 py-6"
            >
              Explore
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="pt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span>10K+ Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              <span>5K+ Writers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
              <span>500+ Universes</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};
