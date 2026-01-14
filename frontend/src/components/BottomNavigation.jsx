import { Home, Lightbulb, Info, Settings } from 'lucide-react';

export const BottomNavigation = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { icon: Home, label: 'Explore', section: 'universes' },
    { icon: Lightbulb, label: 'Features', section: 'features' },
    { icon: Info, label: 'About', section: 'about' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
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
