
import React, { useState, useEffect } from 'react';
import type { PostData } from '../types';
import { PLATFORM_DETAILS } from '../constants';

interface ShareModalProps {
  data: PostData | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Text & Open Platform');

  useEffect(() => {
    setCopyButtonText(`Copy Text & Open ${data?.platform || 'Platform'}`);
  }, [data]);

  if (!data) return null;

  const { platform, text, imageUrl } = data;
  const { icon: Icon, color } = PLATFORM_DETAILS[platform];

  const handleShare = () => {
    navigator.clipboard.writeText(text);
    setCopyButtonText('Text Copied!');

    const encodedText = encodeURIComponent(text);
    let url = '';

    if (platform === 'Twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    } else if (platform === 'LinkedIn') {
      url = `https://www.linkedin.com/shareArticle?mini=true&summary=${encodedText}`;
    } else if (platform === 'Instagram') {
      url = `https://www.instagram.com`;
    } else if (platform === 'Facebook') {
        url = `https://www.facebook.com`;
    } else if (platform === 'Pinterest') {
        url = `https://www.pinterest.com`;
    } else if (platform === 'TikTok') {
        url = `https://www.tiktok.com`;
    }


    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => {
      onClose();
    }, 800);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className={`flex items-center gap-3 mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="font-bold text-lg text-card-foreground">Share to {platform}</h3>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-card-foreground mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5">
                    <li>Click the button below to copy the text & open {platform}.</li>
                    <li>Return to this window.</li>
                    <li><span className="font-semibold text-card-foreground">Right-click (or long-press)</span> the image and select <span className="font-semibold text-card-foreground">'Copy Image'</span>.</li>
                    <li>Paste the image directly into your new post on {platform}.</li>
                </ol>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3 flex-grow overflow-y-auto">
                <p className="text-muted-foreground whitespace-pre-wrap text-sm">{text}</p>
            </div>
             <button
                onClick={handleShare}
                className={`w-full mt-4 bg-primary hover:opacity-90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring`}
            >
                {copyButtonText}
            </button>
        </div>
        <div className="w-full md:w-1/2 p-6 bg-muted rounded-b-lg md:rounded-r-lg md:rounded-bl-none flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={`Generated for ${platform}`} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg" 
            />
        </div>
      </div>
    </div>
  );
};