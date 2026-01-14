import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/login`, loginData, {
        withCredentials: true
      });
      
      toast.success('Access Granted', {
        description: 'Welcome back, Commander.'
      });
      
      // Update UI to show logged-in state
      localStorage.setItem('fv_auth', 'true');
      localStorage.setItem('fv_user', JSON.stringify(response.data.user));
      
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Access Denied', {
        description: error.response?.data?.detail || 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API}/auth/signup`, signupData, {
        withCredentials: true
      });
      
      toast.success('Account Created', {
        description: 'Welcome to The Fictionverse!'
      });
      
      // Update UI to show logged-in state
      localStorage.setItem('fv_auth', 'true');
      localStorage.setItem('fv_user', JSON.stringify(response.data.user));
      
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error('Registration Failed', {
        description: error.response?.data?.detail || 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-2 border-neon-cyan/50 bg-popover/95">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-text text-center uppercase tracking-wider">
            System Access
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-muted-foreground uppercase text-xs tracking-wider">
                  Access ID (Email)
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="commander@fictionverse.io"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="bg-background/50 border-muted focus:border-neon-cyan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-muted-foreground uppercase text-xs tracking-wider">
                  Passphrase
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="bg-background/50 border-muted focus:border-neon-cyan"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
              >
                {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE'}
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground text-center">
              Secure Connection Required
            </p>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 pt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-muted-foreground uppercase text-xs tracking-wider">
                  Commander Name
                </Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="storyteller"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  required
                  className="bg-background/50 border-muted focus:border-neon-cyan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-muted-foreground uppercase text-xs tracking-wider">
                  Access ID (Email)
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="commander@fictionverse.io"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  className="bg-background/50 border-muted focus:border-neon-cyan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-muted-foreground uppercase text-xs tracking-wider">
                  Passphrase
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  className="bg-background/50 border-muted focus:border-neon-cyan"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
              >
                {isLoading ? 'CREATING ACCESS...' : 'JOIN NEXUS'}
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground text-center">
              By joining, you agree to our Terms of Service
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
