
import React from 'react';
import type { ScheduledPost } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { TrashIcon } from './icons/TrashIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface PlanPostModalProps {
  post: ScheduledPost | null;
  onClose: () => void;
  onDelete: (postId: string) => void;
}

export const PlanPostModal: React.FC<PlanPostModalProps> = ({ post, onClose, onDelete }) => {
  if (!post) return null;

  const { platform, text, imageUrl, scheduledAt, id } = post;
  const { icon: Icon, color } = PLATFORM_DETAILS[platform];

  const handleDelete = () => {
    onDelete(id);
    onClose();
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
        <div className="p-4 border-b border-border flex justify-between items-center">
            <div className={`flex items-center gap-3`}>
                <Icon className={`w-6 h-6 ${color}`} />
                <h3 className="font-bold text-lg text-card-foreground">Scheduled Post Details</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-accent">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="p-6 space-y-4">
            <div>
                <p className="text-sm font-semibold text-muted-foreground">Scheduled for</p>
                <p className="text-lg font-bold text-foreground">{new Date(scheduledAt).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            <div className="bg-muted border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                <p className="text-muted-foreground whitespace-pre-wrap text-sm">{text}</p>
            </div>
            {imageUrl && (
                <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                    <img src={imageUrl} alt={`Generated for ${platform}`} className="w-full h-full object-cover" />
                </div>
            )}
        </div>
        <div className="bg-muted px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-border">
            <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition flex items-center gap-2"
            >
                <TrashIcon className="w-4 h-4" />
                Delete Post
            </button>
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
