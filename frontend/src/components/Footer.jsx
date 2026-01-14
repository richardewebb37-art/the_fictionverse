import { Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_storyworlds/artifacts/37hnsbc4_dec9a994ec3641b2b4c1d6ca851e3dc2.png"
                alt="The Fictionverse Icon"
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-semibold">The Fictionverse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Where stories begin and imagination knows no bounds.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-neon-cyan transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#universes" className="hover:text-neon-cyan transition-colors">
                  Universes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-neon-cyan transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>All rights reserved © 2026 The Fictionverse</p>
        </div>
      </div>
    </footer>
  );
};
