import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { InputForm } from './components/InputForm';
import { PostCard } from './components/PostCard';
import { ShareModal } from './components/ShareModal';
import { RefineModal } from './components/RefineModal';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';

import { generateSocialPosts, generateImage, refinePostText, getTrendingTopics, generatePostContentFromUrl } from './services/geminiService';
import { saveUserProfile, getUserProfile, saveHistoryItem, getHistory, deleteHistoryItem } from './services/firestoreService';

import useLocalStorage from './hooks/useLocalStorage';
import { auth } from './firebase';

import type { PostData, Tone, SocialPlatform, PlatformConfig, HistoryItem, UserProfile, User } from './types';

type AuthMode = 'signin' | 'signup';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authModal, setAuthModal] = useState<AuthMode | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [posts, setPosts] = useState<PostData[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ brandVoice: '', targetAudience: '' });

  const [modalData, setModalData] = useState<PostData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [historyItemToLoad, setHistoryItemToLoad] = useState<HistoryItem | null>(null);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadUserData = useCallback(async (uid: string) => {
      setIsLoading(true);
      try {
          const [profile, historyItems] = await Promise.all([
              getUserProfile(uid),
              getHistory(uid),
          ]);
          setUserProfile(profile);
          setHistory(historyItems);
      } catch (e) {
          console.error("Error loading user data:", e);
          setError("Could not load your data. Please try again later.");
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const { uid, email } = firebaseUser;
        setUser({ uid, email });
        loadUserData(uid);
        setAuthModal(null);
      } else {
        setUser(null);
        // Reset state on logout
        setPosts([]);
        setHistory([]);
        setUserProfile({ brandVoice: '', targetAudience: '' });
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [loadUserData]);

  const processAndSavePosts = async (
    generatedPosts: any[],
    imagePrompt: string,
    platforms: PlatformConfig[],
    generationMeta: { idea: string, tone: Tone, url?: string, baseImage?: { data: string, mimeType: string } }
  ) => {
      const imagePromises = platforms.map(p => generateImage(imagePrompt, p.aspectRatio));
      const base64Images = await Promise.all(imagePromises);

      const newPosts: PostData[] = generatedPosts.map((post: any, index: number) => {
        return {
          id: uuidv4(),
          platform: post.platform,
          text: post.text,
          imageUrl: `data:image/jpeg;base64,${base64Images[index]}`
        };
      }).filter((p: PostData) => platforms.some(pc => pc.name === p.platform));
      
      setPosts(newPosts);

      if (user) {
        const newHistoryItem: HistoryItem = {
          id: uuidv4(),
          idea: generationMeta.idea,
          tone: generationMeta.tone,
          url: generationMeta.url,
          platforms: platforms.map(p => p.name),
          imagePrompt,
          timestamp: Date.now(),
          posts: newPosts,
          baseImage: generationMeta.baseImage ? `data:${generationMeta.baseImage.mimeType};base64,${generationMeta.baseImage.data}` : undefined
        };
        await saveHistoryItem(user.uid, newHistoryItem);
        setHistory([newHistoryItem, ...history]);
      }
  };

  const handleGenerate = async (idea: string, platforms: PlatformConfig[], tone: Tone, baseImage?: {data: string, mimeType: string}) => {
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setHistoryItemToLoad(null);

    try {
      const response = await generateSocialPosts(idea, platforms, tone, userProfile, baseImage);
      const jsonResponse = JSON.parse(response.text);
      const { imagePrompt, posts: generatedPosts } = jsonResponse;
      await processAndSavePosts(generatedPosts, imagePrompt, platforms, { idea, tone, baseImage });
    } catch (e: any) {
      console.error(e);
      setError(`An error occurred during generation: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromUrl = async (url: string, platforms: PlatformConfig[], tone: Tone) => {
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setHistoryItemToLoad(null);

    try {
      const response = await generatePostContentFromUrl(url, platforms, tone, userProfile);
      const jsonResponse = JSON.parse(response.text);
      const { imagePrompt, posts: generatedPosts, idea } = jsonResponse;
      await processAndSavePosts(generatedPosts, imagePrompt, platforms, { idea, tone, url });
    } catch (e: any) {
      console.error(e);
      setError(`An error occurred while generating from URL: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRefine = async (post: PostData, refinement: string) => {
    if (!user) return;
    setIsRefining(true);
    setError(null);
    try {
        const refinedText = await refinePostText(post.text, post.platform, refinement, userProfile);
        const updatedPosts = posts.map(p => p.id === post.id ? { ...p, text: refinedText } : p);
        setPosts(updatedPosts);
        setIsRefineModalOpen(false);
        setModalData(null);
    } catch (e: any) {
        console.error(e);
        setError(`An error occurred while refining: ${e.message}`);
    } finally {
        setIsRefining(false);
    }
  };
  
  const handleLoadHistory = (item: HistoryItem) => {
    setPosts(item.posts);
    setHistoryItemToLoad(item);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!user) return;
    await deleteHistoryItem(user.uid, id);
    setHistory(history.filter(item => item.id !== id));
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    if (!user) return;
    setIsSavingProfile(true);
    await saveUserProfile(user.uid, profile);
    setUserProfile(profile);
    setIsSavingProfile(false);
    setIsSettingsModalOpen(false);
  };

  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>, data: PostData) => {
    setModalData(data);
    setter(true);
  };

  if (!authChecked) {
      return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-foreground">Loading...</p></div>;
  }

  if (!user) {
    return (
        <>
            <LandingPage onNavigateToAuth={setAuthModal} />
            {authModal && <Auth initialMode={authModal} onClose={() => setAuthModal(null)} />}
        </>
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col font-sans ${theme}`}>
      <Header user={user} onOpenSettings={() => setIsSettingsModalOpen(true)} />

      <div className="flex-grow flex min-h-0">
        <main className="flex-grow p-4 sm:p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
          <InputForm
            onGenerate={handleGenerate}
            onGenerateFromUrl={handleGenerateFromUrl}
            getTrendingTopics={getTrendingTopics}
            isLoading={isLoading}
            historyItemToLoad={historyItemToLoad}
          />
              
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-semibold">{error}</div>}

          {(isLoading && posts.length === 0) && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Generating your content... this might take a moment.</p>
            </div>
          )}
          
          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  data={post}
                  onShare={(d) => openModal(setIsShareModalOpen, d)}
                  onRefine={(d) => openModal(setIsRefineModalOpen, d)}
                />
              ))}
            </div>
          )}

        </main>
        
        <aside className="w-80 bg-card border-l border-border p-4 flex-col gap-4 hidden xl:flex overflow-y-auto">
          <SettingsPanel userProfile={userProfile} onSave={handleSaveProfile} isSaving={isSavingProfile} />
          <HistoryPanel history={history} onLoad={handleLoadHistory} onDelete={handleDeleteHistory} isLoading={isLoading && history.length === 0} />
        </aside>
      </div>

      <ShareModal data={modalData} onClose={() => setIsShareModalOpen(false)} />
      <RefineModal data={modalData} onClose={() => setIsRefineModalOpen(false)} onRefine={handleRefine} isRefining={isRefining} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} userProfile={userProfile} onSaveProfile={handleSaveProfile} theme={theme} setTheme={setTheme} />
    </div>
  );
}

export default App;
