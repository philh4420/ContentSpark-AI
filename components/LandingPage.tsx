import React from 'react';
import { ZapIcon } from './icons/ZapIcon';
import { HeroSparkle } from './icons/HeroSparkle';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { WandIcon } from './icons/WandIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { UploadIcon } from './icons/UploadIcon';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'signup' | 'signin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-4 flex justify-between items-center container mx-auto sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="font-bold text-xl flex items-center gap-2">
            <ZapIcon className="w-6 h-6 text-primary" />
            <span>ContentSpark AI</span>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigateToAuth('signin')} className="font-semibold text-sm px-4 py-2 rounded-md hover:bg-accent transition-colors">Sign In</button>
            <button onClick={() => onNavigateToAuth('signup')} className="bg-primary text-primary-foreground font-semibold text-sm py-2 px-4 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2">
                Get Started <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto grid lg:grid-cols-2 items-center gap-12 py-20 px-4">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
                    Spark Creativity. <br/> <span className="text-primary">Automate Content.</span>
                </h1>
                <p className="max-w-2xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                    Generate tailored social media posts with stunning AI-powered images in seconds. From a single idea to a full content calendar.
                </p>
                <button onClick={() => onNavigateToAuth('signup')} className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg text-lg hover:opacity-90 transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto lg:mx-0">
                    Get Started For Free <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="relative flex items-center justify-center h-64 lg:h-auto">
                <HeroSparkle className="w-full h-full max-w-md text-primary/30" />
            </div>
        </section>

        <section className="bg-card py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Features to Supercharge Your Workflow</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto mb-12">ContentSpark AI is more than a generator; it's your creative partner.</p>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-background p-6 rounded-lg border border-border">
                        <UploadIcon className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Multimodal Input</h3>
                        <p className="text-sm text-muted-foreground">Start with a text idea or upload your own image for the AI to analyze and build upon.</p>
                    </div>
                     <div className="bg-background p-6 rounded-lg border border-border">
                        <WandIcon className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">AI-Powered Refinement</h3>
                        <p className="text-sm text-muted-foreground">Instantly rewrite and improve any generated post with simple text commands.</p>
                    </div>
                     <div className="bg-background p-6 rounded-lg border border-border">
                        <HistoryIcon className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Cloud-Synced History</h3>
                        <p className="text-sm text-muted-foreground">Never lose a great idea. Your content history is saved to your account automatically.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

       <footer className="text-center p-6 bg-card border-t border-border">
         <p className="text-sm text-muted-foreground">
             &copy; {new Date().getFullYear()} ContentSpark AI. All Rights Reserved.
         </p>
      </footer>
    </div>
  );
};