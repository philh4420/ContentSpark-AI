import React, { useState } from 'react';
import type { PostData } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { ShareIcon } from './icons/ShareIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { WandIcon } from './icons/WandIcon';

interface PostCardProps {
  data: PostData;
  onShare: (data: PostData) => void;
  onRefine: (data: PostData) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ data, onShare, onRefine }) => {
  const [copied, setCopied] = useState(false);
  const { platform, text, imageUrl } = data;
  const { icon: Icon, color, border } = PLATFORM_DETAILS[platform];

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `contentspark-ai-${platform}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-card rounded-lg shadow-lg border ${border} overflow-hidden flex flex-col animate-fade-in`}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-6 h-6 ${color}`} />
          <h3 className="font-bold text-lg text-card-foreground">{platform}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" title="Copy text">
            {copied ? <span className="text-xs font-semibold text-primary">Copied!</span> : <ClipboardIcon className="w-5 h-5" />}
          </button>
           <button onClick={handleDownload} className="p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" title="Download image">
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-grow p-4">
        <p className="text-muted-foreground whitespace-pre-wrap">{text}</p>
      </div>

      {imageUrl && (
        <div className="p-4">
          <img src={imageUrl} alt={`Generated for ${platform}`} className="w-full rounded-lg object-cover" />
        </div>
      )}
      
      <div className="p-4 bg-muted border-t border-border mt-auto grid grid-cols-2 gap-2">
         <button onClick={() => onRefine(data)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold p-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity">
            <WandIcon className="w-4 h-4" />
            <span>Refine</span>
         </button>
         <button onClick={() => onShare(data)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold p-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity">
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
         </button>
      </div>
    </div>
  );
};
