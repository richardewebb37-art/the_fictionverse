import { useEffect, useState } from 'react';
import './SplashAnimation.css';

export const SplashAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('compress'); // compress, morph, scroll, disclaimer, complete

  useEffect(() => {
    const sequence = async () => {
      // Stage 1: Logo compressed (gravity effect) - 0.8s
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Stage 2: Pause
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Stage 3: Morph to full wordmark - 1s
      setStage('morph');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 4: Scroll up to reveal disclaimer - 1s
      setStage('scroll');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 5: Show disclaimer - 5s
      setStage('disclaimer');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Stage 6: Fade out and complete
      setStage('complete');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onComplete();
    };

    sequence();
  }, [onComplete]);

  if (stage === 'complete') return null;

  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Logo Animation Area */}
        <div className={`logo-animation stage-${stage}`}>
          {stage === 'compress' && (
            <div className="logo-compress">
              <img 
                src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/37hnsbc4_dec9a994ec3641b2b4c1d6ca851e3dc2.png"
                alt="FV"
                className="fv-icon-compress"
              />
            </div>
          )}
          
          {(stage === 'morph' || stage === 'scroll' || stage === 'disclaimer') && (
            <div className={`logo-full ${stage === 'scroll' || stage === 'disclaimer' ? 'scroll-up' : ''}`}>
              <img 
                src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/37hnsbc4_dec9a994ec3641b2b4c1d6ca851e3dc2.png"
                alt="FV"
                className="fv-icon"
              />
              <img 
                src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/mpsnr4h5_f7008c300cfa4c46b66a7797a6a674de.png"
                alt="The Fictionverse"
                className="fv-text"
              />
            </div>
          )}
        </div>

        {/* Disclaimer */}
        {(stage === 'disclaimer') && (
          <div className="disclaimer-container fade-in">
            <div className="disclaimer-box">
              <h2 className="disclaimer-title">SYSTEM ACCESS PROTOCOL</h2>
              <div className="disclaimer-content">
                <p className="disclaimer-text">
                  You are accessing The Fictionverse—a curated nexus of fictional realities.
                </p>
                <p className="disclaimer-text">
                  All content within represents <span className="highlight">non-canonical simulations</span> and 
                  original protocols created by independent architects.
                </p>
                <p className="disclaimer-text">
                  By proceeding, you acknowledge these works are transformative explorations 
                  of established universes or entirely new constructs.
                </p>
              </div>
              <div className="disclaimer-footer">
                <div className="progress-bar">
                  <div className="progress-fill" />
                </div>
                <p className="disclaimer-small">Initializing access...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
