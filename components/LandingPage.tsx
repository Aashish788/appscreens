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
                        <span>APPSCREEN</span>
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
                        Play Store & App Store <br /> <span className="text-gradient">Screenshot Generator</span>
                    </h1>
                    <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Create stunning, professional app screenshots for Play Store, App Store, Android, and iOS in seconds.
                        Powered by neural rendering and 4K export. The world's best tool for app marketing assets.
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
                    <h3>4K Batch Export</h3>
                    <p>Export dozens of localized screenshots at once in ultra-4K resolution for Play Store and App Store with zero effort.</p>
                </div>
            </section>

            {/* SEO Section - Visually minimal but great for search engines */}
            <section className="seo-content py-20 px-6 max-w-7xl mx-auto opacity-80">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-white">#1 Play Store & App Store Screenshot Maker</h2>
                        <p className="mb-4">AppScreen is the most advanced screenshot generator for Android and iOS apps. Whether you need Google Play Store screenshots or Apple App Store marketing images, our engine provides the highest quality 4K renders with pixel-perfect device frames.</p>
                        <ul className="space-y-2 opacity-70">
                            <li>• iPhone 16 Pro & Pixel 9 Pro frames</li>
                            <li>• Automated localization for international stores</li>
                            <li>• AI-powered background generation</li>
                            <li>• Custom device scaling and positioning</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-white">Why Use a Screenshot Generator?</h2>
                        <p className="mb-4">Converting visitors into users requires stunning visuals. Our tool helps you bypass expensive design agencies and complex software like Photoshop. Create professional iOS mockups and Android screenshots that drive more downloads and improve your app store ranking.</p>
                        <ul className="space-y-2 opacity-70">
                            <li>• 100% cloud-based, no installation needed</li>
                            <li>• Dynamic text editing with custom fonts</li>
                            <li>• Real-time preview of your app marketing assets</li>
                            <li>• Free to use with premium 4K export options</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <div className="logo">APPSCREEN</div>
                        <p>© 2026 AppScreen Engine. All rights reserved.</p>
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
