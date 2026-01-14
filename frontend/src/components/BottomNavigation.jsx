import { Home, Users, BookOpen, Trophy, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, action: () => navigate('/') },
    { icon: Users, action: () => navigate('/community') },
    { icon: BookOpen, action: () => navigate('/explore'), isCenter: true },
    { icon: Trophy, action: () => navigate('/challenges') },
    { icon: User, action: () => navigate('/profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-background/20 backdrop-blur-md border-t border-border/30 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex items-center justify-center transition-all ${
                  item.isCenter 
                    ? 'w-16 h-16 -mt-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue shadow-lg hover:shadow-neon hover:scale-110' 
                    : 'w-12 h-12 hover:scale-110'
                }`}
              >
                <Icon 
                  size={item.isCenter ? 28 : 24}
                  className={item.isCenter ? 'text-primary-foreground' : 'text-neon-cyan hover:text-neon-blue transition-colors'}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
