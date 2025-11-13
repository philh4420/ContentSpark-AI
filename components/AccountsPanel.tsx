
import React, { useState } from 'react';
import type { UserConnections } from '../types';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { UserIcon } from './icons/UserIcon';
// Correctly import auth and functions services from firebase setup.
import { functions } from '../firebase';

// Define callable functions to interact with Firebase Cloud Functions.
const getTwitterAuthUrl = functions.httpsCallable('getTwitterAuthUrl');
const getLinkedInAuthUrl = functions.httpsCallable('getLinkedInAuthUrl');

interface AccountsPanelProps {
  connections: UserConnections;
}

export const AccountsPanel: React.FC<AccountsPanelProps> = ({ connections }) => {
    const [loading, setLoading] = useState<'twitter' | 'linkedin' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async (platform: 'twitter' | 'linkedin') => {
        setLoading(platform);
        setError(null);
        try {
            const getAuthUrl = platform === 'twitter' ? getTwitterAuthUrl : getLinkedInAuthUrl;
            const result = await getAuthUrl();
            const { authUrl } = result.data as { authUrl: string };
            // Open the auth URL in a popup window
            window.open(authUrl, 'socialAuth', 'width=600,height=700');
        } catch (err: any) {
            console.error(`Error getting ${platform} auth URL:`, err);
            setError(`Could not connect to ${platform}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Accounts</h2>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                        <TwitterIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold text-muted-foreground">Twitter / X</span>
                    </div>
                    <button
                        onClick={() => handleConnect('twitter')}
                        disabled={!!connections.twitter || loading === 'twitter'}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${connections.twitter ? 'bg-green-500/20 text-green-500 cursor-default' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
                    >
                       {loading === 'twitter' ? '...' : connections.twitter ? 'Connected' : 'Connect'}
                    </button>
                </div>
                 <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                        <LinkedInIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold text-muted-foreground">LinkedIn</span>
                    </div>
                     <button
                        onClick={() => handleConnect('linkedin')}
                        disabled={!!connections.linkedin || loading === 'linkedin'}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${connections.linkedin ? 'bg-green-500/20 text-green-500 cursor-default' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
                    >
                       {loading === 'linkedin' ? '...' : connections.linkedin ? 'Connected' : 'Connect'}
                    </button>
                </div>
            </div>
            {error && <p className="text-xs text-center text-destructive">{error}</p>}
        </div>
    );
};