import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ExplorePage = () => {
  const navigate = useNavigate();
  const [universes, setUniverses] = useState({ original: [], inspired: [] });
  const [filteredUniverses, setFilteredUniverses] = useState({ original: [], inspired: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const genres = ['all', 'Sci-Fi', 'Fantasy', 'Cyberpunk', 'Mystery', 'Noir'];

  useEffect(() => {
    fetchUniverses();
  }, []);

  useEffect(() => {
    filterUniverses();
  }, [searchQuery, selectedGenre, universes]);

  const fetchUniverses = async () => {
    try {
      const response = await axios.get(`${API}/universes`);
      setUniverses(response.data);
      setFilteredUniverses(response.data);
    } catch (error) {
      console.error('Failed to fetch universes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUniverses = () => {
    const filterByGenreAndSearch = (list) => {
      return list.filter(u => {
        const matchesSearch = u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'all' || u.genre === selectedGenre;
        return matchesSearch && matchesGenre;
      });
    };

    setFilteredUniverses({
      original: filterByGenreAndSearch(universes.original),
      inspired: filterByGenreAndSearch(universes.inspired)
    });
  };

  const UniverseCard = ({ universe }) => (
    <div 
      className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/universe/${encodeURIComponent(universe.title)}`)}
      data-testid={`universe-card-${universe.title}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-neon-cyan transition-colors">
            {universe.title}
          </h3>
          <div className="flex gap-2 mb-3">
            <Badge variant="outline" className="border-muted text-muted-foreground">
              {universe.type}
            </Badge>
            <Badge variant="outline" className="border-neon-blue text-neon-blue">
              {universe.genre}
            </Badge>
            {universe.is_premium && (
              <Badge className="bg-neon-cyan/20 text-neon-cyan">Premium</Badge>
            )}
          </div>
        </div>
        <div className="text-neon-cyan">
          {universe.type === 'Original' ? <Sparkles size={24} /> : <BookOpen size={24} />}
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-4">
        {universe.description}
      </p>
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>
          <span className="font-medium">Architect:</span> {universe.author}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="text-neon-cyan hover:text-neon-blue"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/universe/${universe.title}`);
          }}
        >
          Enter Simulation →
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-32">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="glass-section py-12 mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-4">
            The <span className="neon-text">Archive</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Access protocols and simulations from architects across the multiverse
          </p>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search universes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-muted focus:border-neon-cyan"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  size="sm"
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? 'bg-neon-cyan text-primary-foreground' : 'border-muted hover:border-neon-cyan'}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Universe Tabs */}
        <Tabs defaultValue="original" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-muted/50">
            <TabsTrigger 
              value="original" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
            >
              <Sparkles size={16} className="mr-2" />
              Original Protocols ({filteredUniverses.original.length})
            </TabsTrigger>
            <TabsTrigger 
              value="inspired" 
              className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
            >
              <BookOpen size={16} className="mr-2" />
              Inspired Simulations ({filteredUniverses.inspired.length})
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-neon-cyan animate-pulse">Loading archive...</div>
            </div>
          ) : (
            <>
              <TabsContent value="original" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUniverses.original.length > 0 ? (
                    filteredUniverses.original.map((universe, index) => (
                      <UniverseCard key={`original-${index}`} universe={universe} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No original protocols found. Try adjusting your filters.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="inspired" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUniverses.inspired.length > 0 ? (
                    filteredUniverses.inspired.map((universe, index) => (
                      <UniverseCard key={`inspired-${index}`} universe={universe} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No inspired simulations found. Try adjusting your filters.
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ExplorePage;
