import { BookOpen, Lightbulb, Info, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id) => {
    // Check if we're on homepage
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const navItems = [
    { icon: BookOpen, label: 'Explore', action: handleExplore },
    { icon: Lightbulb, label: 'Features', action: () => scrollToSection('features') },
    { icon: Info, label: 'About', action: () => scrollToSection('about') },
    { icon: Settings, label: 'Settings', action: () => scrollToSection('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-background/5 backdrop-blur-sm border-t border-border/10 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center gap-1 px-4 py-2 group hover:scale-110 transition-transform"
              >
                <Icon 
                  size={24} 
                  className="text-muted-foreground group-hover:text-neon-cyan transition-colors" 
                />
                <span className="text-xs text-muted-foreground group-hover:text-neon-cyan transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
