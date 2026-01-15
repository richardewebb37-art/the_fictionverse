import { useEffect, useState } from 'react';
import { User, Mail, Calendar, BookOpen, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('fv_auth');
    const userData = localStorage.getItem('fv_user');
    if (authStatus && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 pb-32 flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <User className="text-neon-cyan mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your commander profile
          </p>
          <Button className="btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Profile Header */}
        <div className="glass-section py-12 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-4xl font-bold text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">
            <span className="neon-text">{user?.username}</span>
          </h1>
          <p className="text-center text-muted-foreground">{user?.email}</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <BookOpen className="text-neon-cyan mx-auto mb-3" size={32} />
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-muted-foreground">Stories Read</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <Edit className="text-neon-blue mx-auto mb-3" size={32} />
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-muted-foreground">Stories Written</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <User className="text-electric-blue mx-auto mb-3" size={32} />
            <div className="text-3xl font-bold mb-1">Traveler</div>
            <div className="text-sm text-muted-foreground">Rank</div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <Button size="sm" variant="outline" className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border/30">
              <User className="text-muted-foreground" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="font-medium">{user?.username}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-border/30">
              <Mail className="text-muted-foreground" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-border/30">
              <Calendar className="text-muted-foreground" size={20} />
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium capitalize">{user?.role || 'Traveler'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 text-center glass-card p-8">
          <h3 className="text-xl font-semibold mb-3 text-neon-cyan">Enhanced Profile Features Coming Soon</h3>
          <p className="text-muted-foreground">
            Reading history, bookmarks, created universes, and more personalization options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
