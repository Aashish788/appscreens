import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserMenu.css';

export const UserMenu: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    // Get user display info
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.user_metadata?.avatar_url;
    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleSignOut = async () => {
        setIsOpen(false);
        await signOut();
    };

    return (
        <div className="user-menu-compact" ref={menuRef}>
            <button
                className="user-menu-avatar-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                title={displayName}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="user-avatar-img" />
                ) : (
                    <span className="user-avatar-initials">{initials}</span>
                )}
            </button>

            {isOpen && (
                <div className="user-menu-dropdown-compact">
                    <div className="user-menu-header-compact">
                        <div className="user-menu-avatar-lg-compact">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        <div className="user-menu-details-compact">
                            <span className="user-menu-name-compact">{displayName}</span>
                            <span className="user-menu-email-compact">{user.email}</span>
                        </div>
                    </div>

                    {/* Plan Badge */}
                    <div className="user-menu-plan">
                        <span className="plan-badge">FREE PLAN</span>
                    </div>

                    <div className="user-menu-divider-compact" />

                    {/* Menu Items */}
                    <div className="user-menu-items-compact">
                        <button className="user-menu-item-compact">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Profile Settings
                        </button>

                        <button className="user-menu-item-compact">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Billing & Plans
                        </button>

                        <button className="user-menu-item-compact">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20V10" />
                                <path d="M18 20V4" />
                                <path d="M6 20v-4" />
                            </svg>
                            Usage Stats
                        </button>
                    </div>

                    <div className="user-menu-divider-compact" />

                    <button className="user-menu-signout-compact" onClick={handleSignOut}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};
