
import React, { useState } from 'react';
import type { PostData } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { WandIcon } from './icons/WandIcon';

interface RefineModalProps {
  data: PostData | null;
  onClose: () => void;
  onRefine: (post: PostData, refinement: string) => void;
  isRefining: boolean;
}

export const RefineModal: React.FC<RefineModalProps> = ({ data, onClose, onRefine, isRefining }) => {
  const [refinement, setRefinement] = useState('');

  if (!data) return null;

  const { platform, text } = data;
  const { icon: Icon, color } = PLATFORM_DETAILS[platform];

  const handleRefineClick = () => {
    if (!refinement.trim()) return;
    onRefine(data, refinement);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg shadow-2xl w-full max-w-lg flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
            <div className={`flex items-center gap-3 mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="font-bold text-lg text-card-foreground">Refine Post for {platform}</h3>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3 max-h-32 overflow-y-auto mb-4">
                <p className="text-muted-foreground whitespace-pre-wrap text-sm">{text}</p>
            </div>
            
            <div>
                <label htmlFor="refinement-input" className="block text-sm font-semibold text-foreground mb-1">How should we change it?</label>
                <textarea
                    id="refinement-input"
                    rows={3}
                    value={refinement}
                    onChange={(e) => setRefinement(e.target.value)}
                    placeholder="e.g., Make it shorter and add a question at the end."
                    className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                    disabled={isRefining}
                />
            </div>
        </div>

        <div className="bg-muted px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-border">
            <button
                onClick={onClose}
                disabled={isRefining}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-90 transition disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                onClick={handleRefineClick}
                disabled={!refinement.trim() || isRefining}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
                {isRefining ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Refining...
                    </>
                ) : (
                    <>
                        <WandIcon className="w-4 h-4" />
                        Refine
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};