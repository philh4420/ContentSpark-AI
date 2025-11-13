import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { SettingsIcon } from './icons/SettingsIcon';

interface SettingsPanelProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isSaving: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userProfile, onSave, isSaving }) => {
    const [brandVoice, setBrandVoice] = useState(userProfile.brandVoice);
    const [targetAudience, setTargetAudience] = useState(userProfile.targetAudience);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setBrandVoice(userProfile.brandVoice);
        setTargetAudience(userProfile.targetAudience);
        setHasChanges(false);
    }, [userProfile]);
    
    useEffect(() => {
        const hasChanged = brandVoice !== userProfile.brandVoice || targetAudience !== userProfile.targetAudience;
        setHasChanges(hasChanged);
    }, [brandVoice, targetAudience, userProfile]);

    const handleSave = () => {
        onSave({ brandVoice, targetAudience });
    };
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Brand Profile</h2>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="brand-voice-panel" className="block text-sm font-semibold text-foreground mb-1">Brand Voice</label>
                    <textarea
                        id="brand-voice-panel"
                        rows={3}
                        value={brandVoice}
                        onChange={(e) => setBrandVoice(e.target.value)}
                        placeholder="e.g., Witty, professional..."
                        className="w-full p-2 bg-input border border-border rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                </div>
                <div>
                    <label htmlFor="target-audience-panel" className="block text-sm font-semibold text-foreground mb-1">Target Audience</label>
                    <textarea
                        id="target-audience-panel"
                        rows={3}
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., Tech entrepreneurs..."
                        className="w-full p-2 bg-input border border-border rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
};
