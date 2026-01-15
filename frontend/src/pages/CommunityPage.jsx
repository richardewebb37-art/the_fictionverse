import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Calendar, TrendingUp } from 'lucide-react';

export const CommunityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="glass-section py-12 mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            The <span className="neon-text">Nexus</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Connect with fellow travelers, architects, and commanders
          </p>
        </div>

        {/* Community Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 hover:scale-105 transition-all cursor-pointer">
            <Users className="text-neon-cyan mb-4" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Clubs</h3>
            <p className="text-muted-foreground mb-4">
              Join reading circles and writing groups. Connect with like-minded storytellers.
            </p>
            <button className="text-neon-cyan hover:text-neon-blue transition-colors">
              Browse Clubs →
            </button>
          </div>

          <div className="glass-card p-8 hover:scale-105 transition-all cursor-pointer">
            <MessageCircle className="text-neon-blue mb-4" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Forums</h3>
            <p className="text-muted-foreground mb-4">
              Discuss theories, share critiques, and explore ideas with the community.
            </p>
            <button className="text-neon-cyan hover:text-neon-blue transition-colors">
              Visit Forums →
            </button>
          </div>

          <div className="glass-card p-8 hover:scale-105 transition-all cursor-pointer">
            <Calendar className="text-electric-blue mb-4" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Events</h3>
            <p className="text-muted-foreground mb-4">
              Participate in writing challenges, live readings, and community showcases.
            </p>
            <button className="text-neon-cyan hover:text-neon-blue transition-colors">
              See Events →
            </button>
          </div>

          <div className="glass-card p-8 hover:scale-105 transition-all cursor-pointer">
            <TrendingUp className="text-neon-cyan mb-4" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Trending</h3>
            <p className="text-muted-foreground mb-4">
              See what the community is reading, discussing, and creating right now.
            </p>
            <button className="text-neon-cyan hover:text-neon-blue transition-colors">
              View Trending →
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 text-center glass-card p-8">
          <h3 className="text-xl font-semibold mb-3 text-neon-cyan">Community Features Coming Soon</h3>
          <p className="text-muted-foreground">
            We're building a vibrant space for travelers to connect, collaborate, and celebrate storytelling together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
