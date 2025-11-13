
export type Tone = 'Professional' | 'Witty' | 'Urgent' | 'Friendly' | 'Inspirational';

export type SocialPlatform = 'LinkedIn' | 'Twitter' | 'Instagram' | 'Facebook' | 'Pinterest' | 'TikTok';

export interface PlatformConfig {
  name: SocialPlatform;
  aspectRatio: string;
}

export interface PostData {
  id: string;
  platform: SocialPlatform;
  text: string;
  imageUrl: string;
}

export interface HistoryItem {
  id: string;
  idea: string;
  tone: Tone;
  url?: string;
  platforms: SocialPlatform[];
  imagePrompt: string;
  timestamp: number;
  posts: PostData[];
  baseImage?: string;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface UserProfile {
  brandVoice: string;
  targetAudience: string;
}

// FIX: Add ScheduledPost type, used in ScheduledPanel, CalendarView, and PlanPostModal.
export interface ScheduledPost extends PostData {
  scheduledAt: number;
}

// FIX: Add UserConnections type, used in AccountsPanel.
export interface UserConnections {
  twitter?: boolean;
  linkedin?: boolean;
}
