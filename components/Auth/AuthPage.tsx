import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

interface AuthPageProps {
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
    const { signIn, signUp, signInWithGoogle, signInWithGithub, resetPassword } = useAuth();

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Validation
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): { valid: boolean; message?: string } => {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true };
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate email
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (mode === 'forgot-password') {
            setLoading(true);
            const { error } = await resetPassword(email);
            setLoading(false);

            if (error) {
                setError(error.message);
            } else {
                setSuccess('Password reset email sent! Check your inbox.');
                setTimeout(() => setMode('login'), 3000);
            }
            return;
        }

        // Validate password for login/signup
        if (mode === 'signup') {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                setError(passwordValidation.message || 'Invalid password');
                return;
            }

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setLoading(true);

        if (mode === 'login') {
            const { error } = await signIn(email, password);
            setLoading(false);

            if (error) {
                setError(error.message);
            } else {
                onSuccess?.();
            }
        } else if (mode === 'signup') {
            const { error } = await signUp(email, password, fullName);
            setLoading(false);

            if (error) {
                setError(error.message);
            } else {
                setSuccess('Account created! Please check your email to verify your account.');
            }
        }
    };

    // Handle OAuth
    const handleGoogleSignIn = async () => {
        setError(null);
        setLoading(true);
        const { error } = await signInWithGoogle();
        setLoading(false);
        if (error) {
            setError(error.message);
        }
    };

    const handleGithubSignIn = async () => {
        setError(null);
        setLoading(true);
        const { error } = await signInWithGithub();
        setLoading(false);
        if (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth-page">
            {/* Animated Background */}
            <div className="auth-bg">
                <div className="auth-bg-gradient"></div>
                <div className="auth-bg-grid"></div>
                <div className="auth-bg-glow auth-bg-glow-1"></div>
                <div className="auth-bg-glow auth-bg-glow-2"></div>
            </div>

            {/* Back to Landing */}
            <a href="/" className="auth-back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
            </a>

            <div className="auth-container">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#logoGradient)" />
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#00FF88" />
                                    <stop offset="100%" stopColor="#00CC6A" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="auth-logo-text">APPSCREEN</span>
                </div>

                {/* Auth Card */}
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title">
                            {mode === 'login' && 'Welcome back'}
                            {mode === 'signup' && 'Create account'}
                            {mode === 'forgot-password' && 'Reset password'}
                        </h1>
                        <p className="auth-subtitle">
                            {mode === 'login' && 'Sign in to continue to AppScreen'}
                            {mode === 'signup' && 'Start creating stunning screenshots'}
                            {mode === 'forgot-password' && "Enter your email and we'll send you a reset link"}
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="auth-message auth-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-message auth-success">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {/* OAuth Buttons (only for login/signup) */}
                    {mode !== 'forgot-password' && (
                        <>
                            <div className="auth-oauth">
                                <button
                                    type="button"
                                    className="auth-oauth-btn"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <button
                                    type="button"
                                    className="auth-oauth-btn"
                                    onClick={handleGithubSignIn}
                                    disabled={loading}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="auth-divider">
                                <span>or</span>
                            </div>
                        </>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {mode === 'signup' && (
                            <div className="auth-field">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        {mode !== 'forgot-password' && (
                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <div className="auth-password-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {mode === 'signup' && password && (
                                    <div className="auth-password-strength">
                                        <div className={`strength-bar ${password.length >= 8 ? 'active' : ''}`}></div>
                                        <div className={`strength-bar ${/[A-Z]/.test(password) ? 'active' : ''}`}></div>
                                        <div className={`strength-bar ${/[a-z]/.test(password) ? 'active' : ''}`}></div>
                                        <div className={`strength-bar ${/[0-9]/.test(password) ? 'active' : ''}`}></div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="auth-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        )}

                        {mode === 'login' && (
                            <button
                                type="button"
                                className="auth-forgot-link"
                                onClick={() => setMode('forgot-password')}
                            >
                                Forgot password?
                            </button>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-spinner"></span>
                            ) : (
                                <>
                                    {mode === 'login' && 'Sign In'}
                                    {mode === 'signup' && 'Create Account'}
                                    {mode === 'forgot-password' && 'Send Reset Link'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="auth-footer">
                        {mode === 'login' && (
                            <p>
                                Don't have an account?{' '}
                                <button type="button" onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}>
                                    Sign up
                                </button>
                            </p>
                        )}
                        {mode === 'signup' && (
                            <p>
                                Already have an account?{' '}
                                <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }}>
                                    Sign in
                                </button>
                            </p>
                        )}
                        {mode === 'forgot-password' && (
                            <p>
                                Remember your password?{' '}
                                <button type="button" onClick={() => { setMode('login'); setError(null); setSuccess(null); }}>
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Terms */}
                <p className="auth-terms">
                    By continuing, you agree to our{' '}
                    <a href="/terms">Terms of Service</a> and{' '}
                    <a href="/privacy">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};
