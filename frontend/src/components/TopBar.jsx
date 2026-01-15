import { useState, useEffect } from 'react';
import { User, LogOut, Info, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopBar = ({ onAuthOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background/20 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* The Fictionverse Text Logo on Left */}
          <button 
            onClick={() => navigate('/')}
            className="group"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/mpsnr4h5_f7008c300cfa4c46b66a7797a6a674de.png"
              alt="The Fictionverse"
              className="h-8 object-contain group-hover:opacity-80 transition-opacity"
            />
          </button>

          {/* User Menu Icon on Right - Always Visible */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted/20 transition-all"
              data-testid="user-menu-button"
            >
              {isLoggedIn && user ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-neon-cyan/50 flex items-center justify-center hover:border-neon-cyan transition-colors">
                  <User size={18} className="text-neon-cyan" />
                </div>
              )}
            </button>

            {/* Dropdown Menu - Profile, Settings, About, Logout */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 avatar-dropdown rounded-lg shadow-lg py-2 animate-in slide-in-from-top-2 duration-200">
                {isLoggedIn && user && (
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                  data-testid="menu-profile"
                >
                  <User size={16} className="text-muted-foreground" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                  data-testid="menu-settings"
                >
                  <Settings size={16} className="text-muted-foreground" />
                  Settings
                </button>
                
                <button
                  onClick={() => scrollToSection('about')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-3"
                  data-testid="menu-about"
                >
                  <Info size={16} className="text-muted-foreground" />
                  About
                </button>
                
                {isLoggedIn && (
                  <div className="border-t border-border/50 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-3"
                      data-testid="menu-logout"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
