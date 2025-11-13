
import React, { useState, useRef, useEffect } from 'react';
import { PLATFORMS } from '../constants';
import type { SocialPlatform, PlatformConfig, HistoryItem, AdvancedToneProfile } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { LinkIcon } from './icons/LinkIcon';
import { AdvancedToneMixer } from './AdvancedToneMixer';

type GenerationMode = 'idea' | 'url' | 'trends';

interface InputFormProps {
  onGenerate: (idea: string, platforms: PlatformConfig[], tone: AdvancedToneProfile, baseImage?: { data: string, mimeType: string }) => void;
  onGenerateFromUrl: (url: string, platforms: PlatformConfig[], tone: AdvancedToneProfile) => void;
  getTrendingTopics: (industry: string) => Promise<string[]>;
  isLoading: boolean;
  historyItemToLoad?: HistoryItem | null;
}

const defaultToneProfile: AdvancedToneProfile = {
    formality: 50,
    humor: 50,
    urgency: 50,
    enthusiasm: 50,
};

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, onGenerateFromUrl, getTrendingTopics, isLoading, historyItemToLoad }) => {
  const [mode, setMode] = useState<GenerationMode>('idea');
  
  // Idea Mode State
  const [idea, setIdea] = useState('');
  const [baseImage, setBaseImage] = useState<{ preview: string, data: string, mimeType: string } | null>(null);

  // URL Mode State
  const [url, setUrl] = useState('');

  // Trends Mode State
  const [industry, setIndustry] = useState('');
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);

  // Common State
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(new Set(['LinkedIn', 'Twitter']));
  const [toneProfile, setToneProfile] = useState<AdvancedToneProfile>(defaultToneProfile);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (historyItemToLoad) {
      if (historyItemToLoad.url) {
        setMode('url');
        setUrl(historyItemToLoad.url);
      } else {
        setMode('idea');
        setIdea(historyItemToLoad.idea);
      }
      setToneProfile(historyItemToLoad.tone);
      setSelectedPlatforms(new Set(historyItemToLoad.platforms));
      if (historyItemToLoad.baseImage) {
        setBaseImage({ 
            preview: historyItemToLoad.baseImage, 
            data: historyItemToLoad.baseImage.split(',')[1], 
            mimeType: historyItemToLoad.baseImage.match(/data:(.*);/)?.[1] || ''
        });
      } else {
        setBaseImage(null);
      }
    }
  }, [historyItemToLoad]);
  
  const togglePlatform = (platformName: SocialPlatform) => {
    const newSelection = new Set(selectedPlatforms);
    if (newSelection.has(platformName)) {
      newSelection.delete(platformName);
    } else {
      newSelection.add(platformName);
    }
    setSelectedPlatforms(newSelection);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBaseImage({
            preview: base64String,
            data: base64String.split(',')[1],
            mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetTrends = async () => {
    if (!industry.trim()) return;
    setIsTrendsLoading(true);
    try {
        const topics = await getTrendingTopics(industry);
        setTrendingTopics(topics);
    } catch (e) {
        console.error("Failed to get trending topics", e);
    } finally {
        setIsTrendsLoading(false);
    }
  };
  
  const handleTopicClick = (topic: string) => {
    setIdea(topic);
    setMode('idea');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const platformConfigs = PLATFORMS.filter(p => selectedPlatforms.has(p.name));
    if (platformConfigs.length === 0) return;
    
    if (mode === 'idea' && idea.trim()) {
      onGenerate(idea, platformConfigs, toneProfile, baseImage ? { data: baseImage.data, mimeType: baseImage.mimeType } : undefined);
    } else if (mode === 'url' && url.trim()) {
      onGenerateFromUrl(url, platformConfigs, toneProfile);
    }
  };

  const renderTabs = () => (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-4">
        <button type="button" onClick={() => setMode('idea')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors w-full flex items-center justify-center gap-2 ${mode === 'idea' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LightbulbIcon className="w-4 h-4" /> Idea
        </button>
        <button type="button" onClick={() => setMode('url')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors w-full flex items-center justify-center gap-2 ${mode === 'url' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <LinkIcon className="w-4 h-4" /> URL
        </button>
        <button type="button" onClick={() => setMode('trends')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors w-full flex items-center justify-center gap-2 ${mode === 'trends' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <TrendingUpIcon className="w-4 h-4" /> Trends
        </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {renderTabs()}
      
      {mode === 'idea' && (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
                <label htmlFor="idea" className="text-lg font-semibold text-foreground">Content Idea</label>
                <textarea id="idea" value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g., A new AI feature that drafts emails..." className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring" rows={3} required/>
            </div>
             <div className="space-y-3">
                <label className="font-semibold text-foreground">Base Image (Optional)</label>
                {baseImage ? (
                    <div className="relative w-32 h-32">
                        <img src={baseImage.preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button type="button" onClick={() => setBaseImage(null)} className="absolute -top-2 -right-2 bg-card rounded-full p-1 text-muted-foreground hover:text-destructive"><XCircleIcon className="w-6 h-6" /></button>
                    </div>
                ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                        <UploadIcon className="w-8 h-8 mb-2" /><span className="font-semibold">Upload Image</span>
                    </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg, image/webp" />
            </div>
        </div>
      )}

      {mode === 'url' && (
         <div className="space-y-2 animate-fade-in">
            <label htmlFor="url" className="text-lg font-semibold text-foreground">Website URL</label>
            <input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/blog/my-latest-article" className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring" required />
         </div>
      )}

      {mode === 'trends' && (
         <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                <label htmlFor="industry" className="text-lg font-semibold text-foreground">Industry or Topic</label>
                <div className="flex gap-2">
                    <input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g., Sustainable Fashion" className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring" />
                    <button type="button" onClick={handleGetTrends} disabled={isTrendsLoading} className="bg-secondary text-secondary-foreground font-semibold px-4 rounded-lg hover:opacity-90 disabled:opacity-50">
                        {isTrendsLoading ? '...' : 'Find Trends'}
                    </button>
                </div>
            </div>
            {trendingTopics.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold">Click a topic to use it as your idea:</h4>
                    <div className="flex flex-wrap gap-2">
                        {trendingTopics.map((topic, i) => (
                            <button key={i} type="button" onClick={() => handleTopicClick(topic)} className="bg-muted text-sm font-semibold p-2 rounded-md hover:bg-primary/20 hover:text-primary transition-colors">
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            )}
         </div>
      )}

      <div className="space-y-3">
        <label className="font-semibold text-foreground">Choose platforms</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PLATFORMS.map(platform => (
            <button key={platform.name} type="button" onClick={() => togglePlatform(platform.name)} className={`p-3 border-2 rounded-lg text-center font-semibold transition-all duration-200 ${selectedPlatforms.has(platform.name) ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-transparent hover:border-border'}`}>
              {platform.name}
            </button>
          ))}
        </div>
      </div>
      
      <AdvancedToneMixer value={toneProfile} onChange={setToneProfile} />

      <button
        type="submit"
        disabled={isLoading || selectedPlatforms.size === 0 || (mode === 'idea' && !idea.trim()) || (mode === 'url' && !url.trim())}
        className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold text-lg py-3 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Content
          </>
        )}
      </button>
    </form>
  );
};
