import { Home, Users, BookOpen, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BottomNavigation = ({ onAuthOpen }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, action: () => navigate('/'), label: 'Home' },
    { icon: Users, action: () => navigate('/community'), label: 'Community' },
    { type: 'logo', action: onAuthOpen },
    { icon: BookOpen, action: () => navigate('/explore'), label: 'Explore' },
    { icon: Trophy, action: () => navigate('/challenges'), label: 'Challenges' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-background/20 backdrop-blur-md border-t border-border/30 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          {navItems.map((item, index) => {
            if (item.type === 'logo') {
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform"
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/onoodm24_1000050916.png"
                    alt="The Fictionverse"
                    className="w-full h-full object-contain hover:opacity-80 transition-opacity"
                  />
                </button>
              );
            }
            
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="flex items-center justify-center w-12 h-12 hover:scale-110 transition-transform"
              >
                <Icon 
                  size={24}
                  className="text-neon-cyan hover:text-neon-blue transition-colors"
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
