
import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const formatToneProfile = (tone: HistoryItem['tone']): string => {
    return `F:${tone.formality} H:${tone.humor} U:${tone.urgency} E:${tone.enthusiasm}`;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete, isLoading }) => {
  return (
    <div className="flex flex-col gap-4 flex-shrink min-h-0 h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">History</h2>
        </div>
        {isLoading && <span className="text-xs text-muted-foreground">Loading...</span>}
      </div>
      <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
        {history.length === 0 && !isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent history.</p>
        ) : (
          history.map(item => (
            <div
                key={item.id}
                className="w-full text-left p-3 rounded-md hover:bg-accent group relative"
            >
                <button onClick={() => onLoad(item)} className="w-full text-left">
                    <p className="text-sm font-semibold truncate text-accent-foreground">{item.idea}</p>
                    <p className="text-xs text-muted-foreground">{formatToneProfile(item.tone)}</p>
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="absolute top-2 right-2 p-1 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete history item"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
