import { useState, useEffect } from 'react';
import { User, LogOut, History, Info, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopBar = ({ onAuthOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const authStatus = localStorage.getItem('fv_auth');
    const userData = localStorage.getItem('fv_user');
    if (authStatus && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fv_auth');
    localStorage.removeItem('fv_user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    window.location.reload();
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 group"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/37hnsbc4_dec9a994ec3641b2b4c1d6ca851e3dc2.png"
              alt="The Fictionverse Icon"
              className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/mpsnr4h5_f7008c300cfa4c46b66a7797a6a674de.png"
              alt="The Fictionverse"
              className="h-8 object-contain group-hover:opacity-80 transition-opacity hidden sm:block"
            />
          </button>

          {/* Avatar Menu */}
          <div className="relative">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 avatar-dropdown rounded-lg shadow-lg py-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-sm font-semibold">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => scrollToSection('settings')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                    >
                      <Settings size={16} className="text-muted-foreground" />
                      Settings
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('about')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                    >
                      <Info size={16} className="text-muted-foreground" />
                      About
                    </button>
                    
                    <button
                      onClick={() => scrollToSection('history')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                    >
                      <History size={16} className="text-muted-foreground" />
                      History
                    </button>
                    
                    <div className="border-t border-border/50 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-3"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={onAuthOpen}
                className="btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
              >
                <User size={16} className="mr-2" />
                Join
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
