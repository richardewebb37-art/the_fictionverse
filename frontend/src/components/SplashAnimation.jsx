import { useEffect, useState } from 'react';

export const SplashAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('fadeInLogo'); // fadeInLogo, morphToText, moveUp, showDisclaimer, fadeOut

  useEffect(() => {
    const sequence = async () => {
      // Stage 1: Fade in FV logo - 2s
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 2: Morph to FICTIONVERSE text - 2s
      setStage('morphToText');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 3: Move up to make room for disclaimer - 1s
      setStage('moveUp');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 4: Show disclaimer - 10s hold
      setStage('showDisclaimer');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Stage 5: Fade out to home screen - 1s
      setStage('fadeOut');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete();
    };

    sequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* FV Logo (fades in, then fades out as text appears) */}
      <img
        src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/onoodm24_1000050916.png"
        alt="FV Logo"
        className={`absolute w-32 h-32 object-contain transition-all duration-1000 ease-in-out
          ${stage === 'fadeInLogo' ? 'opacity-100 scale-100' : ''}
          ${stage === 'morphToText' ? 'opacity-0 scale-90' : ''}
          ${stage === 'moveUp' || stage === 'showDisclaimer' || stage === 'fadeOut' ? 'opacity-0 scale-0' : ''}
        `}
        style={{
          filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.6))'
        }}
      />

      {/* FICTIONVERSE Text (morphs in from logo position) */}
      <div
        className={`absolute transition-all duration-1000 ease-in-out
          ${stage === 'fadeInLogo' ? 'opacity-0 scale-50' : ''}
          ${stage === 'morphToText' ? 'opacity-100 scale-100' : ''}
          ${stage === 'moveUp' || stage === 'showDisclaimer' ? 'opacity-100 scale-100 -translate-y-24' : ''}
          ${stage === 'fadeOut' ? 'opacity-0 scale-110' : ''}
        `}
      >
        <img
          src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/mpsnr4h5_f7008c300cfa4c46b66a7797a6a674de.png"
          alt="The Fictionverse"
          className="h-16 md:h-20 object-contain"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.4))'
          }}
        />
      </div>

      {/* Disclaimer (appears after text moves up) */}
      {(stage === 'showDisclaimer' || stage === 'fadeOut') && (
        <div
          className={`absolute top-[60%] max-w-3xl px-8 text-center transition-all duration-1000
            ${stage === 'showDisclaimer' ? 'opacity-100 translate-y-0' : ''}
            ${stage === 'fadeOut' ? 'opacity-0 translate-y-4' : ''}
          `}
        >
          <div className="bg-[#0b0f19]/80 backdrop-blur-md border border-[#00F0FF]/30 rounded-lg p-8 shadow-[0_0_60px_rgba(0,240,255,0.2)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00F0FF] mb-6 uppercase tracking-wider">
              System Access Protocol
            </h2>
            <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
              <p>
                You are accessing <span className="text-[#00F0FF] font-semibold">The Fictionverse</span>—a curated nexus of fictional realities.
              </p>
              <p>
                All content represents <span className="text-[#00F0FF] font-semibold">non-canonical simulations</span> and 
                original protocols created by independent architects.
              </p>
              <p className="text-sm text-gray-400 pt-4">
                By proceeding, you acknowledge these works as transformative explorations.
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00F0FF] to-[#2E93fA]"
                style={{
                  animation: 'progressLoad 10s linear forwards'
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 font-mono tracking-wide">
              Initializing access...
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progressLoad {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

