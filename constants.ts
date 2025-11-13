
import React from 'react';
import type { PlatformConfig, SocialPlatform } from './types';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { TwitterIcon } from './components/icons/TwitterIcon';
import { InstagramIcon } from './components/icons/InstagramIcon';
import { FacebookIcon } from './components/icons/FacebookIcon';
import { PinterestIcon } from './components/icons/PinterestIcon';
import { TikTokIcon } from './components/icons/TikTokIcon';

export const TONE_PROFILES = [
    { id: 'formality', label: 'Formality', minLabel: 'Casual', maxLabel: 'Formal', defaultValue: 50 },
    { id: 'humor', label: 'Humor', minLabel: 'Serious', maxLabel: 'Witty', defaultValue: 50 },
    { id: 'urgency', label: 'Urgency', minLabel: 'Patient', maxLabel: 'Urgent', defaultValue: 50 },
    { id: 'enthusiasm', label: 'Enthusiasm', minLabel: 'Reserved', maxLabel: 'Enthusiastic', defaultValue: 50 },
] as const;


export const PLATFORMS: PlatformConfig[] = [
  { name: 'LinkedIn', aspectRatio: '16:9' },
  { name: 'Twitter', aspectRatio: '16:9' },
  { name: 'Instagram', aspectRatio: '1:1' },
  { name: 'Facebook', aspectRatio: '1:1' },
  { name: 'Pinterest', aspectRatio: '9:16' },
  { name: 'TikTok', aspectRatio: '9:16' },
];

export const PLATFORM_DETAILS: { [key in SocialPlatform]: { icon: React.ComponentType<{ className?: string }>, color: string, border: string } } = {
  LinkedIn: { icon: LinkedInIcon, color: 'text-blue-700', border: 'border-blue-700' },
  Twitter: { icon: TwitterIcon, color: 'text-sky-500', border: 'border-sky-500' },
  Instagram: { icon: InstagramIcon, color: 'text-pink-600', border: 'border-pink-600' },
  Facebook: { icon: FacebookIcon, color: 'text-blue-600', border: 'border-blue-600' },
  Pinterest: { icon: PinterestIcon, color: 'text-red-600', border: 'border-red-600' },
  TikTok: { icon: TikTokIcon, color: 'text-black dark:text-white', border: 'border-black dark:border-white' },
};
