import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export const GatekeeperModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('fv_intro_seen');
    
    if (!hasSeenIntro) {
      setIsVisible(true);
      
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleEnter();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem('fv_intro_seen', 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    handleEnter();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="text-center max-w-xl p-10 glass-card border-2 border-neon-cyan pulse-glow">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 neon-text uppercase tracking-wider">
          System Entry
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Accessing The Fictionverse Protocol...
        </p>
        
        <div className="mb-6">
          <Progress 
            value={((15 - timeLeft) / 15) * 100} 
            className="h-1 bg-muted"
          />
        </div>
        
        <div className="font-ibm text-neon-cyan text-sm mb-8">
          AUTHENTICATING... <span className="text-xl font-bold">{timeLeft}</span>s
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSkip}
          className="text-xs text-muted-foreground border-muted hover:border-neon-cyan hover:text-neon-cyan transition-all"
        >
          [Dev Skip]
        </Button>
      </div>
    </div>
  );
};
