import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const UniversesSection = () => {
  const [universes, setUniverses] = useState({ original: [], inspired: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUniverses();
  }, []);

  const fetchUniverses = async () => {
    try {
      const response = await axios.get(`${API}/universes`);
      setUniverses(response.data);
    } catch (error) {
      console.error('Failed to fetch universes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const UniverseCard = ({ universe }) => (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-neon-cyan transition-colors">
            {universe.title}
          </h3>
          <Badge variant="outline" className="mb-3 border-muted text-muted-foreground">
            {universe.type}
          </Badge>
        </div>
        <div className="text-neon-cyan">
          {universe.type === 'Original' ? <Sparkles size={24} /> : <BookOpen size={24} />}
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-4">
        {universe.description}
      </p>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <span className="font-medium">By</span>
        <span className="text-foreground">{universe.author}</span>
      </div>
    </div>
  );

  return (
    <section id="universes" className="relative py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Explore <span className="neon-text">Universes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into original worlds or discover stories inspired by your favorite universes.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-muted/50">
            <TabsTrigger 
              value="original" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
            >
              <Sparkles size={16} className="mr-2" />
              Original
            </TabsTrigger>
            <TabsTrigger 
              value="inspired" 
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
            >
              <BookOpen size={16} className="mr-2" />
              Inspired
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-neon-cyan" size={48} />
            </div>
          ) : (
            <>
              <TabsContent value="original" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universes.original.length > 0 ? (
                    universes.original.map((universe, index) => (
                      <UniverseCard key={`original-${index}`} universe={universe} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No original universes yet. Be the first to create one!
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="inspired" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universes.inspired.length > 0 ? (
                    universes.inspired.map((universe, index) => (
                      <UniverseCard key={`inspired-${index}`} universe={universe} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No inspired universes yet. Start exploring!
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </section>
  );
};
