import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export const Navigation = ({ onAuthOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 flex items-center justify-center text-neon-cyan">
              <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
                <path 
                  d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-foreground group-hover:text-neon-cyan transition-colors">
              The Fictionverse
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('explore')}
              className="text-foreground hover:text-neon-cyan transition-colors"
            >
              Explore
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-neon-cyan transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('universes')}
              className="text-foreground hover:text-neon-cyan transition-colors"
            >
              Universes
            </button>
            <Button
              variant="outline"
              onClick={onAuthOpen}
              className="border-foreground text-foreground hover:border-neon-cyan hover:text-neon-cyan"
            >
              Login
            </Button>
            <Button
              onClick={onAuthOpen}
              className="btn-glow bg-foreground text-background hover:bg-neon-cyan hover:text-primary-foreground"
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <button 
              onClick={() => scrollToSection('explore')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-neon-cyan transition-colors"
            >
              Explore
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-neon-cyan transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('universes')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-neon-cyan transition-colors"
            >
              Universes
            </button>
            <div className="px-4 pt-2 space-y-2">
              <Button
                variant="outline"
                onClick={onAuthOpen}
                className="w-full border-foreground text-foreground hover:border-neon-cyan hover:text-neon-cyan"
              >
                Login
              </Button>
              <Button
                onClick={onAuthOpen}
                className="w-full btn-glow bg-foreground text-background hover:bg-neon-cyan"
              >
                Sign up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
