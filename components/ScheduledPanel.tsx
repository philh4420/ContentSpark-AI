
import React from 'react';
import type { ScheduledPost } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { BellIcon } from './icons/BellIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ScheduledPanelProps {
  posts: ScheduledPost[];
  onDelete: (postId: string) => void;
}

export const ScheduledPanel: React.FC<ScheduledPanelProps> = ({ posts, onDelete }) => {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4 flex-shrink min-h-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Scheduled</h2>
        </div>
         {posts.length > 0 && <span className="text-sm font-bold bg-primary/20 text-primary rounded-full px-2.5 py-0.5">{posts.length}</span>}
      </div>
      <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No posts scheduled.</p>
        ) : (
          posts.map(post => {
            const { icon: Icon } = PLATFORM_DETAILS[post.platform];
            return (
                <div
                    key={post.id}
                    className="w-full text-left p-3 rounded-md bg-muted group relative"
                >
                    <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-grow">
                            <p className="text-sm font-semibold truncate text-muted-foreground">{post.text}</p>
                            <p className="text-xs text-muted-foreground/70">
                                {new Date(post.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                        <button
                            onClick={() => onDelete(post.id)}
                            className="absolute top-2 right-2 p-1 text-destructive/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete scheduled post"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )
        })
        )}
      </div>
    </div>
  );
};