
import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { XCircleIcon } from './icons/XCircleIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: UserProfile;
    onSaveProfile: (profile: UserProfile) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userProfile, onSaveProfile, theme, setTheme }) => {
    const [brandVoice, setBrandVoice] = useState('');
    const [targetAudience, setTargetAudience] = useState('');

    useEffect(() => {
        if(isOpen) {
            setBrandVoice(userProfile.brandVoice);
            setTargetAudience(userProfile.targetAudience);
        }
    }, [isOpen, userProfile]);

    if (!isOpen) return null;
    
    const handleSave = () => {
        onSaveProfile({ brandVoice, targetAudience });
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-lg border border-border flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6 text-foreground" />
                        <h2 className="text-xl font-bold text-card-foreground">Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-accent">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                   <div>
                     <h3 className="font-semibold text-foreground mb-3">Brand & Audience Profile</h3>
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="brand-voice" className="block text-sm font-semibold text-foreground mb-1">Brand Voice</label>
                            <textarea
                                id="brand-voice"
                                rows={3}
                                value={brandVoice}
                                onChange={(e) => setBrandVoice(e.target.value)}
                                placeholder="e.g., Witty, professional, and slightly informal. Uses emojis sparingly."
                                className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>
                         <div>
                            <label htmlFor="target-audience" className="block text-sm font-semibold text-foreground mb-1">Target Audience</label>
                            <textarea
                                id="target-audience"
                                rows={3}
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                placeholder="e.g., Tech entrepreneurs and startup founders, aged 25-40, interested in AI."
                                className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>
                     </div>
                   </div>
                   <div className="border-t border-border pt-6">
                        <h3 className="font-semibold text-foreground mb-3">Appearance</h3>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span className="text-sm font-semibold text-muted-foreground">Theme</span>
                            <ThemeToggle theme={theme} setTheme={setTheme} />
                        </div>
                   </div>
                </div>
                <div className="bg-muted px-6 py-4 flex justify-end gap-3 rounded-b-lg border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-90 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
