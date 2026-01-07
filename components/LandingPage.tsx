import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="nav">
                <div className="nav-content">
                    <div className="logo">
                        <div className="logo-icon"></div>
                        <span>APEX STORE</span>
                    </div>
                    <div className="nav-items text-xs font-bold tracking-widest uppercase opacity-60">
                        <a href="#features" className="hover:opacity-100 transition-opacity">Features</a>
                        <a href="#templates" className="hover:opacity-100 transition-opacity">Templates</a>
                        <a href="#pricing" className="hover:opacity-100 transition-opacity">Pricing</a>
                    </div>
                    <button onClick={onLogin} className="login-button">
                        LOGIN
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="badge animate-fade-in">Version 5.0 is Here</div>
                    <h1 className="hero-title animate-slide-up">
                        Design for the <br /> <span className="text-gradient">Next Generation</span>
                    </h1>
                    <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Transform your app screenshots into high-fidelity marketing assets in seconds.
                        Powered by neural rendering and professional grade automation. Built for teams that move fast.
                    </p>
                    <div className="hero-cta animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button onClick={onLogin} className="primary-cta">
                            Start Building Now
                        </button>
                        <button className="secondary-cta">
                            Explore Templates
                        </button>
                    </div>
                </div>

                {/* Subtle Decorative element */}
                <div className="hero-glow-sphere animate-pulse-glow"></div>
            </header>

            {/* Trust Section */}
            <section className="trust">
                <p>TRUSTED BY OVER 10,000+ DESIGNERS & DEVELOPERS</p>
                <div className="logo-cloud">
                    {/* Using text for logos to avoid broken images */}
                    <div className="cloud-logo">LINEAR</div>
                    <div className="cloud-logo">FIGMA</div>
                    <div className="cloud-logo">STRIPE</div>
                    <div className="cloud-logo">VERCEL</div>
                </div>
            </section>

            {/* Info Section */}
            <section className="features-grid" id="features">
                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <h3>AI Scene Generation</h3>
                    <p>Create breathtaking backgrounds that perfectly match your brand's color palette automatically.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Premium Mockups</h3>
                    <p>The latest iPhone 16 Pro and Pixel 9 Pro frames with ultra-realistic titanium and glass shaders.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Batch Processing</h3>
                    <p>Export dozens of localized screenshots at once in ultra-4K resolution with zero effort.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <div className="logo">APEX STORE</div>
                        <p>© 2026 ApexStore Engine. All rights reserved.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Product</h4>
                            <a href="#">Engine</a>
                            <a href="#">Templates</a>
                            <a href="#">Showcase</a>
                        </div>
                        <div className="link-group">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Blog</a>
                            <a href="#">Careers</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
