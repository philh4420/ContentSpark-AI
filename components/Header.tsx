
import React, { useState, useEffect, useRef } from 'react';
import { ZapIcon } from './icons/ZapIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { User } from '../types';
import { LogOutIcon } from './icons/LogOutIcon';
import { auth } from '../firebase';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
  user: User;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSettings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="p-4 flex justify-between items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-20">
      <div className="font-bold text-xl flex items-center gap-2">
        <ZapIcon className="w-6 h-6 text-primary" />
        <span>ContentSpark AI</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onOpenSettings} className="p-2 rounded-full text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Open settings">
          <SettingsIcon className="w-5 h-5" />
        </button>
        
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-2 rounded-full text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
            <UserIcon className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl animate-fade-in origin-top-right">
              <div className="p-4 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Signed in as</p>
                <p className="text-sm text-muted-foreground truncate" title={user.email || ''}>{user.email}</p>
              </div>
              <div className="p-2">
                <button onClick={() => { auth.signOut(); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
