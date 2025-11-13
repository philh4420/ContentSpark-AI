// FIX: Removed self-import of `SocialPlatform` which caused a conflict with its local declaration.
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

export interface AdvancedToneProfile {
  formality: number;
  humor: number;
  urgency: number;
  enthusiasm: number;
}

export interface HistoryItem {
  id: string;
  idea: string;
  tone: AdvancedToneProfile;
  url?: string;
  platforms: SocialPlatform[];
  imagePrompt: string;
  timestamp: number;
  posts: PostData[];
  baseImage?: string;
  campaign?: string;
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