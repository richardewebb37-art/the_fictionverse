import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, BookOpen, Users, Scroll, Globe2, 
  Sparkles, User, Play, Clock 
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const UniversePage = () => {
  const { universeId } = useParams();
  const navigate = useNavigate();
  const [universe, setUniverse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [lore, setLore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUniverseData();
  }, [universeId]);

  const fetchUniverseData = async () => {
    try {
      setIsLoading(true);
      
      const [universeRes, chaptersRes, charactersRes, loreRes] = await Promise.all([
        axios.get(`${API}/universes/${universeId}`),
        axios.get(`${API}/stories/${universeId}`),
        axios.get(`${API}/characters/${universeId}`),
        axios.get(`${API}/lore/${universeId}`)
      ]);
      
      setUniverse(universeRes.data);
      setChapters(chaptersRes.data);
      setCharacters(charactersRes.data);
      setLore(loreRes.data);
    } catch (error) {
      console.error('Failed to fetch universe data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="universe-loading">
        <div className="text-neon-cyan animate-pulse">Accessing Protocol...</div>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="universe-not-found">
        <div className="text-center glass-card p-12">
          <Globe2 className="text-neon-cyan mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-bold mb-4">Protocol Not Found</h2>
          <p className="text-muted-foreground mb-6">This universe doesn't exist or has been archived.</p>
          <Button onClick={() => navigate('/explore')} className="btn-glow bg-neon-cyan text-primary-foreground">
            Return to Archive
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32" data-testid="universe-page">
      {/* Universe Header */}
      <div className="glass-section py-12 mb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/explore')}
            className="mb-6 text-muted-foreground hover:text-neon-cyan"
            data-testid="back-to-archive"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to Archive
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Universe Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {universe.type === 'Original' ? (
                  <Sparkles className="text-neon-cyan" size={28} />
                ) : (
                  <BookOpen className="text-neon-blue" size={28} />
                )}
                <Badge 
                  variant="outline" 
                  className={universe.type === 'Original' ? 'border-neon-cyan text-neon-cyan' : 'border-neon-blue text-neon-blue'}
                >
                  {universe.type === 'Original' ? 'Original Protocol' : 'Inspired Simulation'}
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="universe-title">
                <span className="neon-text">{universe.title}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {universe.description}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="border-muted">
                  {universe.genre}
                </Badge>
                {universe.is_premium && (
                  <Badge className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-foreground">
                    Premium
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Architect: <span className="text-foreground">{universe.author}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>{chapters.length} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{characters.length} Characters</span>
                </div>
              </div>
            </div>
            
            {/* Start Reading CTA */}
            {chapters.length > 0 && (
              <div className="lg:w-80">
                <div className="glass-card p-6 text-center">
                  <Play className="text-neon-cyan mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-3">Begin Your Journey</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {chapters.length} chapters available
                  </p>
                  <Button 
                    onClick={() => navigate(`/read/${universe.title}/1`)}
                    className="w-full btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue"
                    data-testid="start-reading-btn"
                  >
                    Start Reading
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto max-w-6xl px-4">
        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-muted/50">
            <TabsTrigger 
              value="chapters" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              data-testid="chapters-tab"
            >
              <BookOpen size={16} className="mr-2" />
              Chapters
            </TabsTrigger>
            <TabsTrigger 
              value="characters" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              data-testid="characters-tab"
            >
              <Users size={16} className="mr-2" />
              Characters
            </TabsTrigger>
            <TabsTrigger 
              value="lore" 
              className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan"
              data-testid="lore-tab"
            >
              <Scroll size={16} className="mr-2" />
              Lore
            </TabsTrigger>
          </TabsList>
          
          {/* Chapters Tab */}
          <TabsContent value="chapters" className="mt-0">
            {chapters.length > 0 ? (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 hover:border-neon-cyan/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/read/${universe.title}/${chapter.chapter_number}`)}
                    data-testid={`chapter-${chapter.chapter_number}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                            Chapter {chapter.chapter_number}
                          </Badge>
                          <Badge variant="outline" className="border-muted text-muted-foreground text-xs">
                            {chapter.status}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-neon-cyan transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {chapter.content.substring(0, 200)}...
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-card">
                <BookOpen className="text-muted-foreground mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">No Chapters Yet</h3>
                <p className="text-muted-foreground">This universe's story is being written...</p>
              </div>
            )}
          </TabsContent>
          
          {/* Characters Tab */}
          <TabsContent value="characters" className="mt-0">
            {characters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 hover:scale-105 transition-all"
                    data-testid={`character-${index}`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {character.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{character.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={
                            character.role === 'protagonist' ? 'border-neon-cyan text-neon-cyan' :
                            character.role === 'antagonist' ? 'border-red-500 text-red-500' :
                            'border-muted text-muted-foreground'
                          }
                        >
                          {character.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {character.description}
                    </p>
                    
                    {character.traits && character.traits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {character.traits.map((trait, i) => (
                          <Badge key={i} variant="outline" className="border-muted text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {character.backstory && (
                      <p className="text-sm text-muted-foreground border-t border-border/30 pt-4 mt-4">
                        {character.backstory}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-card">
                <Users className="text-muted-foreground mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">No Characters Yet</h3>
                <p className="text-muted-foreground">The inhabitants of this universe await discovery...</p>
              </div>
            )}
          </TabsContent>
          
          {/* Lore Tab */}
          <TabsContent value="lore" className="mt-0">
            {lore.length > 0 ? (
              <div className="space-y-6">
                {lore.map((entry, index) => (
                  <div
                    key={index}
                    className="glass-card p-6"
                    data-testid={`lore-${index}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Scroll className="text-neon-cyan" size={24} />
                      <h3 className="text-xl font-semibold">{entry.title}</h3>
                      <Badge variant="outline" className="border-muted text-muted-foreground ml-auto">
                        {entry.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-card">
                <Scroll className="text-muted-foreground mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold mb-2">No Lore Entries Yet</h3>
                <p className="text-muted-foreground">The secrets of this universe remain hidden...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversePage;
