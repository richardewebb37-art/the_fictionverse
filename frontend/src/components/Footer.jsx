import { Github, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-neon-cyan">
                <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
                  <path 
                    d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
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
