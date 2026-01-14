import { Pen, Lightbulb, Users, Zap, Globe, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Pen,
    title: 'Write with power',
    description: 'Craft your stories with intuitive features and easy editing.',
    color: 'text-neon-blue'
  },
  {
    icon: Lightbulb,
    title: 'Find inspiration',
    description: 'Explore a rich library of stories and discover new genres.',
    color: 'text-neon-cyan'
  },
  {
    icon: Users,
    title: 'Join the elite',
    description: 'Connect with writers who share your passion.',
    color: 'text-foreground'
  },
  {
    icon: Zap,
    title: 'Instant publishing',
    description: 'Share your work with the world in seconds, not days.',
    color: 'text-electric-blue'
  },
  {
    icon: Globe,
    title: 'Global reach',
    description: 'Your stories can be discovered by readers worldwide.',
    color: 'text-neon-cyan'
  },
  {
    icon: BookOpen,
    title: 'Rich editor',
    description: 'Professional tools to bring your vision to life.',
    color: 'text-neon-blue'
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-20 px-4 glass-section">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Features that fuel your <span className="neon-text">creativity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to write, publish, and share your stories with the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-8 group hover:scale-105 transition-all duration-300 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
