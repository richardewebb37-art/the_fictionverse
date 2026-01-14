import { BookOpen, Users, Globe, Sparkles } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 px-4 glass-section">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            About <span className="neon-text">The Fictionverse</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where imagination meets technology in a cyberpunk storytelling nexus.
          </p>
        </div>

        <div className="glass-card p-8 md:p-12 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold flex items-center gap-3">
              <Sparkles className="text-neon-cyan" size={28} />
              Our Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              The Fictionverse is a next-generation storytelling platform designed to connect writers 
              and readers in a boundless digital universe. We believe every story deserves to be told, 
              and every reader deserves to discover worlds beyond imagination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="space-y-2">
              <BookOpen className="text-neon-blue mb-2" size={32} />
              <h4 className="font-semibold">10,000+ Stories</h4>
              <p className="text-sm text-muted-foreground">
                A vast library of original and inspired works
              </p>
            </div>
            
            <div className="space-y-2">
              <Users className="text-neon-cyan mb-2" size={32} />
              <h4 className="font-semibold">5,000+ Writers</h4>
              <p className="text-sm text-muted-foreground">
                A thriving community of creative minds
              </p>
            </div>
            
            <div className="space-y-2">
              <Globe className="text-electric-blue mb-2" size={32} />
              <h4 className="font-semibold">Global Reach</h4>
              <p className="text-sm text-muted-foreground">
                Readers from over 100 countries worldwide
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              Founded in 2026 • Powered by imagination and cyberpunk aesthetics
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
