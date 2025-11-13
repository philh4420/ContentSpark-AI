import React, { useState } from 'react';
import { auth } from '../firebase';
import { ZapIcon } from './icons/ZapIcon';

interface AuthProps {
    initialMode: 'signin' | 'signup';
    onClose: () => void;
}

export const Auth: React.FC<AuthProps> = ({ initialMode, onClose }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getFriendlyErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return 'Invalid email or password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account with this email address already exists. Please sign in.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                await auth.createUserWithEmailAndPassword(email, password);
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }
            // No need to call onClose(), the onAuthStateChanged listener in App.tsx will handle the UI transition.
        } catch (err: any) {
            setError(getFriendlyErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };
    
    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError(null);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-card rounded-lg shadow-2xl w-full max-w-sm border border-border" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 space-y-6">
                    <div className="text-center">
                        <ZapIcon className="w-10 h-10 text-primary mx-auto mb-2" />
                        <h2 className="text-2xl font-bold text-card-foreground">
                            {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'signup' ? 'to start generating content.' : 'Sign in to continue.'}
                        </p>
                    </div>
                    
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm font-semibold p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-muted disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (mode === 'signup' ? 'Sign Up' : 'Sign In')}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={toggleMode} className="font-semibold text-primary hover:underline ml-1">
                            {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
