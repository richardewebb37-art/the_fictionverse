import { Moon, Bell, Lock, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const SettingsSection = () => {
  return (
    <section id="settings" className="relative py-20 px-4 glass-section">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="neon-text">Settings</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Customize your Fictionverse experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Palette className="text-neon-cyan" size={24} />
                <div>
                  <Label htmlFor="theme" className="text-base font-semibold">Theme</Label>
                  <p className="text-sm text-muted-foreground">Cyberpunk Dark Mode (Active)</p>
                </div>
              </div>
              <Moon className="text-muted-foreground" size={20} />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="text-neon-blue" size={24} />
                <div>
                  <Label htmlFor="notifications" className="text-base font-semibold">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new stories</p>
                </div>
              </div>
              <Switch id="notifications" />
            </div>
          </div>

          {/* Privacy */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Lock className="text-electric-blue" size={24} />
                <div>
                  <Label htmlFor="privacy" className="text-base font-semibold">Private Profile</Label>
                  <p className="text-sm text-muted-foreground">Hide your profile from search</p>
                </div>
              </div>
              <Switch id="privacy" />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            More settings coming soon...
          </p>
        </div>
      </div>
    </section>
  );
};
