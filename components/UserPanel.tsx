
import React from 'react';
import type { User } from '../types';
import { UserIcon } from './icons/UserIcon';
import { auth } from '../firebase';

interface UserPanelProps {
  user: User;
}

export const UserPanel: React.FC<UserPanelProps> = ({ user }) => {
    
    const handleSignOut = () => {
        auth.signOut();
    };

    return (
        <div className="flex flex-col gap-4 py-4 border-b border-border">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">User</h2>
                </div>
                 <button onClick={handleSignOut} className="text-xs font-semibold text-destructive hover:underline">Sign Out</button>
            </div>
            <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground text-center truncate" title={user.email || 'No email provided'}>
                    {user.email}
                </p>
            </div>
        </div>
    );
};