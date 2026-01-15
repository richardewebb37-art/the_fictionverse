import { Trophy, Pen, Globe, BookOpen, Clock } from 'lucide-react';

export const ChallengesPage = () => {
  const sampleChallenges = [
    {
      title: "The 100-Word Universe Challenge",
      description: "Create an entire universe in exactly 100 words. Show us a world worth exploring.",
      type: "Worldbuilding",
      deadline: "Open Entry",
      icon: Globe,
      color: "text-neon-cyan"
    },
    {
      title: "Cyberpunk Short Story",
      description: "Write a 1000-word cyberpunk story featuring a hacker protagonist in Neo-Tokyo.",
      type: "Writing",
      deadline: "2 weeks remaining",
      icon: Pen,
      color: "text-neon-blue"
    },
    {
      title: "Character Deep Dive",
      description: "Create a detailed character profile with backstory, motivations, and unique traits.",
      type: "Character",
      deadline: "1 month",
      icon: BookOpen,
      color: "text-electric-blue"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="glass-section py-12 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-neon-cyan" size={48} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            <span className="neon-text">Challenges</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Test your creativity with community challenges and showcase your skills
          </p>
        </div>

        {/* Active Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleChallenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 hover:scale-105 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`${challenge.color} group-hover:scale-110 transition-transform`} size={28} />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={14} />
                      <span>{challenge.deadline}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-neon-cyan transition-colors">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                      {challenge.type}
                    </span>
                    <button className="text-sm text-neon-cyan hover:text-neon-blue transition-colors">
                      Enter Challenge →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="glass-card p-8 text-center">
          <Trophy className="text-neon-cyan mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-3 text-neon-cyan">More Challenges Coming Soon</h3>
          <p className="text-muted-foreground">
            We're preparing exciting new challenges for architects to showcase their storytelling prowess.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
