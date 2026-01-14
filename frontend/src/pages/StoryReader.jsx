import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Users, Globe2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const StoryReader = () => {
  const { universeId, chapterNum } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [universe, setUniverse] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [universeId, chapterNum]);

  const fetchStory = async () => {
    try {
      setIsLoading(true);
      
      // Fetch current chapter
      const storyRes = await axios.get(`${API}/stories/${universeId}/${chapterNum}`);
      setStory(storyRes.data);
      
      // Fetch universe info
      const universeRes = await axios.get(`${API}/universes/${universeId}`);
      setUniverse(universeRes.data);
      
      // Fetch all chapters
      const chaptersRes = await axios.get(`${API}/stories/${universeId}`);
      setAllChapters(chaptersRes.data);
    } catch (error) {
      console.error('Failed to fetch story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToChapter = (newChapterNum) => {
    navigate(`/read/${universeId}/${newChapterNum}`);
  };

  const currentChapterIndex = allChapters.findIndex(c => c.chapter_number === parseInt(chapterNum));
  const hasNext = currentChapterIndex < allChapters.length - 1;
  const hasPrev = currentChapterIndex > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-cyan animate-pulse">Loading simulation...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Protocol Not Found</h2>
          <Button onClick={() => navigate('/explore')}>Return to Archive</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Story Header */}
      <div className="glass-section py-8 mb-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/explore')}
            className="mb-4 text-muted-foreground hover:text-neon-cyan"
          >
            <ChevronLeft size={20} className="mr-2" />
            Return to Archive
          </Button>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{story.title}</h1>
              <p className="text-muted-foreground">
                Universe: <span className="text-foreground">{universe?.title}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                Chapter {story.chapter_number}
              </Badge>
              <Badge variant="outline">{universe?.genre}</Badge>
              <Badge variant="outline">{universe?.type}</Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>By {story.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>{allChapters.length} Chapters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto max-w-3xl px-4">
        <div className="glass-card p-8 md:p-12 mb-8">
          <div 
            className="prose prose-invert prose-lg max-w-none"
            style={{
              lineHeight: '1.8',
              fontSize: '1.125rem',
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
          >
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => goToChapter(allChapters[currentChapterIndex - 1].chapter_number)}
            disabled={!hasPrev}
            className="flex-1 border-muted text-foreground hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-30"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous Chapter
          </Button>
          
          <Button
            onClick={() => goToChapter(allChapters[currentChapterIndex + 1].chapter_number)}
            disabled={!hasNext}
            className="flex-1 btn-glow bg-neon-cyan text-primary-foreground hover:bg-neon-blue disabled:opacity-30"
          >
            Next Chapter
            <ChevronRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
