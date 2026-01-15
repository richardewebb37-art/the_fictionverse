import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, Moon, Sun, Bell, Shield, 
  Palette, Eye, ChevronLeft, Save
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    showReadingProgress: true,
    matureContent: false,
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('fv_auth');
    if (authStatus) {
      setIsLoggedIn(true);
      // Load saved settings
      const savedSettings = localStorage.getItem('fv_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('fv_settings', JSON.stringify(settings));
    toast.success('Settings Saved', {
      description: 'Your preferences have been updated.'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 pb-32 flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md" data-testid="settings-login-required">
          <SettingsIcon className="text-neon-cyan mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access settings
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32" data-testid="settings-page">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="glass-section py-8 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-neon-cyan"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <SettingsIcon className="text-neon-cyan" size={32} />
            <div>
              <h1 className="text-3xl font-bold">
                <span className="neon-text">Settings</span>
              </h1>
              <p className="text-muted-foreground">Customize your experience</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new chapters and updates</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates" className="text-base">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly digest of new content</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailUpdates: checked })}
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme (recommended)</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
            </div>
          </div>

          {/* Reading Preferences */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-semibold">Reading Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="readingProgress" className="text-base">Show Reading Progress</Label>
                  <p className="text-sm text-muted-foreground">Display progress bar on stories</p>
                </div>
                <Switch
                  id="readingProgress"
                  checked={settings.showReadingProgress}
                  onCheckedChange={(checked) => setSettings({ ...settings, showReadingProgress: checked })}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-neon-cyan" size={24} />
              <h2 className="text-xl font-semibold">Content</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="matureContent" className="text-base">Mature Content</Label>
                  <p className="text-sm text-muted-foreground">Show stories marked as mature (18+)</p>
                </div>
                <Switch
                  id="matureContent"
                  checked={settings.matureContent}
                  onCheckedChange={(checked) => setSettings({ ...settings, matureContent: checked })}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSaveSettings}
            className="w-full btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
            data-testid="save-settings-btn"
          >
            <Save size={20} className="mr-2" />
            Save Settings
          </Button>

          {/* Coming Soon */}
          <div className="text-center glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold mb-2 text-neon-cyan">More Settings Coming Soon</h3>
            <p className="text-muted-foreground text-sm">
              Font customization, reading themes, and account management options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
