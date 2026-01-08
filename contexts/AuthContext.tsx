import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, User, Session } from '../lib/supabase';

// Auth state interface
interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    initialized: boolean;
}

// Auth context interface
interface AuthContextType extends AuthState {
    // Authentication methods
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signInWithGithub: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
    // User profile
    updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        initialized: false,
    });

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error getting session:', error);
                }

                if (mounted) {
                    setAuthState({
                        user: session?.user ?? null,
                        session: session ?? null,
                        loading: false,
                        initialized: true,
                    });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (mounted) {
                    setAuthState(prev => ({ ...prev, loading: false, initialized: true }));
                }
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);

                if (mounted) {
                    setAuthState({
                        user: session?.user ?? null,
                        session: session ?? null,
                        loading: false,
                        initialized: true,
                    });
                }

                // Handle specific auth events
                if (event === 'SIGNED_IN') {
                    console.log('User signed in successfully');
                } else if (event === 'SIGNED_OUT') {
                    console.log('User signed out');
                } else if (event === 'TOKEN_REFRESHED') {
                    console.log('Token refreshed');
                } else if (event === 'PASSWORD_RECOVERY') {
                    console.log('Password recovery initiated');
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Sign up with email and password
    const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || '',
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                return { error };
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                console.log('Email confirmation required');
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Sign in with email and password
    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Sign in with Google OAuth
    const signInWithGoogle = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Sign in with GitHub OAuth
    const signInWithGithub = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }, []);

    // Reset password (send reset email)
    const resetPassword = useCallback(async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Update password
    const updatePassword = useCallback(async (newPassword: string) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    // Update user profile
    const updateProfile = useCallback(async (data: { full_name?: string; avatar_url?: string }) => {
        try {
            const { error } = await supabase.auth.updateUser({
                data,
            });

            return { error: error || null };
        } catch (error) {
            return { error: error as Error };
        }
    }, []);

    const value: AuthContextType = {
        ...authState,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
