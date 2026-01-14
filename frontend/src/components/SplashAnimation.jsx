import { useEffect, useRef } from 'react';

export const SplashAnimation = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // TIMELINE CONFIG (In Seconds)
    const TIMELINE = {
      START_DELAY: 2,       // Screen sits black for moment
      LOGO_FORM: 4,         // Gravity pulls logo together
      LOGO_HOLD: 10,        // Logo stays
      TEXT_FORM: 15,        // "The Fictionverse" appears underneath
      TEXT_HOLD: 25,        // Both hold together
      MORPH_START: 28,      // Slow morph begins
      DISCLAIMER_FORM: 32,  // Disclaimer readable
      DISCLAIMER_HOLD: 38,  // Disclaimer stays
      EXPLODE: 39           // Zoom out to interface
    };

    // Resize handler
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // PARTICLE CLASS
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 2 + 1;
        
        this.originX = this.x;
        this.originY = this.y;
        
        this.targetX = null;
        this.targetY = null;
        
        this.vx = 0;
        this.vy = 0;
        
        this.friction = 0.94;
        this.ease = 0.04;
        
        this.color = Math.random() > 0.5 ? '#00F0FF' : '#2E93fA';
        this.size = 1.5;
        this.alpha = 1;
      }

      update(targetState) {
        if (this.targetX !== null && this.targetY !== null) {
          let dx = this.targetX - this.x;
          let dy = this.targetY - this.y;
          
          this.vx += dx * this.ease;
          this.vy += dy * this.ease;
        } else {
          this.vx += (Math.random() - 0.5) * 0.05;
          this.vy += (Math.random() - 0.5) * 0.05;
        }

        if (targetState === 'EXPLODE') {
          this.ease = 0.1;
          let dx = this.x - (width/2);
          let dy = this.y - (height/2);
          if(dx === 0) dx = 1;
          this.vx += dx * 0.05;
          this.vy += dy * 0.05;
          this.alpha -= 0.02;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    // TEXT TO PARTICLE CONVERTER
    const getTargetsFromText = (text, fontSize, yOffset) => {
      const tCanvas = document.createElement('canvas');
      const tCtx = tCanvas.getContext('2d');
      tCanvas.width = width;
      tCanvas.height = height;
      
      tCtx.fillStyle = 'white';
      tCtx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText(text, width / 2, (height / 2) + yOffset);

      const imageData = tCtx.getImageData(0, 0, width, height).data;
      const targets = [];
      
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const index = (y * width + x) * 4;
          if (imageData[index + 3] > 128) {
            targets.push({x, y});
          }
        }
      }
      return targets;
    };

    // Initialize Targets
    const logoTargets = getTargetsFromText('FV', 150, -50);
    const titleTargets = getTargetsFromText('THE FICTIONVERSE', 40, 60);
    const disclaimerTargets = getTargetsFromText('ORIGINAL & INSPIRED PROTOCOLS', 20, 0);

    const maxPoints = Math.max(logoTargets.length + titleTargets.length, disclaimerTargets.length);
    const particles = [];
    for(let i = 0; i < maxPoints + 500; i++) {
      particles.push(new Particle());
    }
    particlesRef.current = particles;

    let currentState = 'START';

    // ANIMATION LOOP
    const loop = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      // STATE MACHINE
      if (elapsed < TIMELINE.START_DELAY) {
        currentState = 'WAIT';
      } 
      else if (elapsed < TIMELINE.TEXT_FORM) {
        currentState = 'FORM_LOGO';
      }
      else if (elapsed < TIMELINE.MORPH_START) {
        currentState = 'FORM_FULL';
      }
      else if (elapsed < TIMELINE.EXPLODE) {
        currentState = 'MORPH_DISCLAIMER';
      }
      else {
        currentState = 'EXPLODE';
      }

      // Assign Targets based on State
      particles.forEach((p, i) => {
        p.targetX = null;
        p.targetY = null;

        if (currentState === 'FORM_LOGO') {
          if (i < logoTargets.length) {
            p.targetX = logoTargets[i].x;
            p.targetY = logoTargets[i].y;
          }
        }
        else if (currentState === 'FORM_FULL') {
          if (i < logoTargets.length) {
            p.targetX = logoTargets[i].x;
            p.targetY = logoTargets[i].y;
          } 
          else if (i < logoTargets.length + titleTargets.length) {
            let tIdx = i - logoTargets.length;
            p.targetX = titleTargets[tIdx].x;
            p.targetY = titleTargets[tIdx].y;
          }
        }
        else if (currentState === 'MORPH_DISCLAIMER') {
          if (i < disclaimerTargets.length) {
            p.targetX = disclaimerTargets[i].x;
            p.targetY = disclaimerTargets[i].y;
            p.ease = 0.02;
          }
        }
        
        p.update(currentState);
      });

      // Drawing
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach(p => p.draw());

      // END SEQUENCE CHECK
      if (currentState === 'EXPLODE' && elapsed > TIMELINE.EXPLODE + 2) {
        cancelAnimationFrame(animationFrameRef.current);
        onComplete();
      } else {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    // Start animation
    loop();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#050505',
        zIndex: 99999
      }}
    />
  );
};

