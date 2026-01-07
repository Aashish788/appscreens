
export interface GraphicItem {
    id: string;
    name: string;
    url: string;
    category: string;
    premium?: boolean;
    aspectRatio?: 'square' | 'wide' | 'tall';
}

// Using Lucide Icons CDN (unpkg) - guaranteed fast and reliable
const LUCIDE_CDN = 'https://unpkg.com/lucide-static@latest/icons';

export const GRAPHICS_LIBRARY: GraphicItem[] = [
    // 🤳 HAND MOCKUPS (using pointer/touch icons)
    { id: 'hand-pointer', name: 'Pointer Hand', url: `${LUCIDE_CDN}/pointer.svg`, category: 'Hand Mockups', premium: true },
    { id: 'hand-touch', name: 'Touch Point', url: `${LUCIDE_CDN}/touchpad.svg`, category: 'Hand Mockups', premium: true },
    { id: 'hand-mouse', name: 'Mouse Pointer', url: `${LUCIDE_CDN}/mouse-pointer.svg`, category: 'Hand Mockups' },
    { id: 'hand-click', name: 'Mouse Click', url: `${LUCIDE_CDN}/mouse-pointer-click.svg`, category: 'Hand Mockups' },

    // 📱 DEVICE MOCKUPS
    { id: 'device-phone', name: 'Smartphone', url: `${LUCIDE_CDN}/smartphone.svg`, category: 'Device Mockups' },
    { id: 'device-tablet', name: 'Tablet', url: `${LUCIDE_CDN}/tablet.svg`, category: 'Device Mockups' },
    { id: 'device-laptop', name: 'Laptop', url: `${LUCIDE_CDN}/laptop.svg`, category: 'Device Mockups' },
    { id: 'device-monitor', name: 'Monitor', url: `${LUCIDE_CDN}/monitor.svg`, category: 'Device Mockups' },
    { id: 'device-watch', name: 'Watch', url: `${LUCIDE_CDN}/watch.svg`, category: 'Device Mockups' },
    { id: 'device-tv', name: 'TV Screen', url: `${LUCIDE_CDN}/tv.svg`, category: 'Device Mockups' },

    // 🎨 ABSTRACT / SHAPES
    { id: 'shape-star', name: 'Star', url: `${LUCIDE_CDN}/star.svg`, category: 'Shapes', premium: true },
    { id: 'shape-heart', name: 'Heart', url: `${LUCIDE_CDN}/heart.svg`, category: 'Shapes', premium: true },
    { id: 'shape-circle', name: 'Circle', url: `${LUCIDE_CDN}/circle.svg`, category: 'Shapes' },
    { id: 'shape-square', name: 'Square', url: `${LUCIDE_CDN}/square.svg`, category: 'Shapes' },
    { id: 'shape-triangle', name: 'Triangle', url: `${LUCIDE_CDN}/triangle.svg`, category: 'Shapes' },
    { id: 'shape-hexagon', name: 'Hexagon', url: `${LUCIDE_CDN}/hexagon.svg`, category: 'Shapes' },
    { id: 'shape-pentagon', name: 'Pentagon', url: `${LUCIDE_CDN}/pentagon.svg`, category: 'Shapes' },
    { id: 'shape-octagon', name: 'Octagon', url: `${LUCIDE_CDN}/octagon.svg`, category: 'Shapes' },

    // ✨ GLOW / EFFECTS
    { id: 'effect-sparkle', name: 'Sparkles', url: `${LUCIDE_CDN}/sparkles.svg`, category: 'Effects', premium: true },
    { id: 'effect-zap', name: 'Lightning', url: `${LUCIDE_CDN}/zap.svg`, category: 'Effects', premium: true },
    { id: 'effect-sun', name: 'Sun Glow', url: `${LUCIDE_CDN}/sun.svg`, category: 'Effects' },
    { id: 'effect-moon', name: 'Moon', url: `${LUCIDE_CDN}/moon.svg`, category: 'Effects' },
    { id: 'effect-flame', name: 'Flame', url: `${LUCIDE_CDN}/flame.svg`, category: 'Effects' },
    { id: 'effect-rainbow', name: 'Rainbow', url: `${LUCIDE_CDN}/rainbow.svg`, category: 'Effects' },

    // 🏆 BADGES
    { id: 'badge-award', name: 'Award', url: `${LUCIDE_CDN}/award.svg`, category: 'Badges', premium: true },
    { id: 'badge-trophy', name: 'Trophy', url: `${LUCIDE_CDN}/trophy.svg`, category: 'Badges', premium: true },
    { id: 'badge-medal', name: 'Medal', url: `${LUCIDE_CDN}/medal.svg`, category: 'Badges' },
    { id: 'badge-crown', name: 'Crown', url: `${LUCIDE_CDN}/crown.svg`, category: 'Badges' },
    { id: 'badge-verified', name: 'Verified', url: `${LUCIDE_CDN}/badge-check.svg`, category: 'Badges' },
    { id: 'badge-shield', name: 'Shield', url: `${LUCIDE_CDN}/shield-check.svg`, category: 'Badges' },
    { id: 'badge-gem', name: 'Gem', url: `${LUCIDE_CDN}/gem.svg`, category: 'Badges' },

    // 📲 SOCIAL
    { id: 'social-share', name: 'Share', url: `${LUCIDE_CDN}/share-2.svg`, category: 'Social' },
    { id: 'social-heart', name: 'Like', url: `${LUCIDE_CDN}/heart.svg`, category: 'Social' },
    { id: 'social-message', name: 'Message', url: `${LUCIDE_CDN}/message-circle.svg`, category: 'Social' },
    { id: 'social-send', name: 'Send', url: `${LUCIDE_CDN}/send.svg`, category: 'Social' },
    { id: 'social-bookmark', name: 'Bookmark', url: `${LUCIDE_CDN}/bookmark.svg`, category: 'Social' },
    { id: 'social-bell', name: 'Notification', url: `${LUCIDE_CDN}/bell.svg`, category: 'Social' },

    // 🎯 CTA / ARROWS
    { id: 'cta-arrow-right', name: 'Arrow Right', url: `${LUCIDE_CDN}/arrow-right.svg`, category: 'Arrows' },
    { id: 'cta-arrow-down', name: 'Arrow Down', url: `${LUCIDE_CDN}/arrow-down.svg`, category: 'Arrows' },
    { id: 'cta-chevron-right', name: 'Chevron Right', url: `${LUCIDE_CDN}/chevron-right.svg`, category: 'Arrows' },
    { id: 'cta-move-right', name: 'Move Right', url: `${LUCIDE_CDN}/move-right.svg`, category: 'Arrows' },
    { id: 'cta-external', name: 'External Link', url: `${LUCIDE_CDN}/external-link.svg`, category: 'Arrows' },
    { id: 'cta-download', name: 'Download', url: `${LUCIDE_CDN}/download.svg`, category: 'Arrows' },
    { id: 'cta-play', name: 'Play', url: `${LUCIDE_CDN}/play.svg`, category: 'Arrows' },

    // ⚡ TECH / UI
    { id: 'tech-settings', name: 'Settings', url: `${LUCIDE_CDN}/settings.svg`, category: 'Tech' },
    { id: 'tech-search', name: 'Search', url: `${LUCIDE_CDN}/search.svg`, category: 'Tech' },
    { id: 'tech-home', name: 'Home', url: `${LUCIDE_CDN}/home.svg`, category: 'Tech' },
    { id: 'tech-user', name: 'User', url: `${LUCIDE_CDN}/user.svg`, category: 'Tech' },
    { id: 'tech-lock', name: 'Lock', url: `${LUCIDE_CDN}/lock.svg`, category: 'Tech' },
    { id: 'tech-wifi', name: 'WiFi', url: `${LUCIDE_CDN}/wifi.svg`, category: 'Tech' },
    { id: 'tech-battery', name: 'Battery', url: `${LUCIDE_CDN}/battery-full.svg`, category: 'Tech' },
    { id: 'tech-cloud', name: 'Cloud', url: `${LUCIDE_CDN}/cloud.svg`, category: 'Tech' },
    { id: 'tech-cpu', name: 'CPU', url: `${LUCIDE_CDN}/cpu.svg`, category: 'Tech' },
    { id: 'tech-database', name: 'Database', url: `${LUCIDE_CDN}/database.svg`, category: 'Tech' },

    // 💼 BUSINESS
    { id: 'biz-chart', name: 'Chart', url: `${LUCIDE_CDN}/bar-chart-3.svg`, category: 'Business' },
    { id: 'biz-trending', name: 'Trending Up', url: `${LUCIDE_CDN}/trending-up.svg`, category: 'Business' },
    { id: 'biz-wallet', name: 'Wallet', url: `${LUCIDE_CDN}/wallet.svg`, category: 'Business' },
    { id: 'biz-credit', name: 'Credit Card', url: `${LUCIDE_CDN}/credit-card.svg`, category: 'Business' },
    { id: 'biz-dollar', name: 'Dollar', url: `${LUCIDE_CDN}/dollar-sign.svg`, category: 'Business' },
    { id: 'biz-shopping', name: 'Shopping Cart', url: `${LUCIDE_CDN}/shopping-cart.svg`, category: 'Business' },
    { id: 'biz-gift', name: 'Gift', url: `${LUCIDE_CDN}/gift.svg`, category: 'Business' },
    { id: 'biz-percent', name: 'Discount', url: `${LUCIDE_CDN}/percent.svg`, category: 'Business' },

    // 🎭 MISC
    { id: 'misc-camera', name: 'Camera', url: `${LUCIDE_CDN}/camera.svg`, category: 'Misc' },
    { id: 'misc-image', name: 'Image', url: `${LUCIDE_CDN}/image.svg`, category: 'Misc' },
    { id: 'misc-music', name: 'Music', url: `${LUCIDE_CDN}/music.svg`, category: 'Misc' },
    { id: 'misc-video', name: 'Video', url: `${LUCIDE_CDN}/video.svg`, category: 'Misc' },
    { id: 'misc-mic', name: 'Microphone', url: `${LUCIDE_CDN}/mic.svg`, category: 'Misc' },
    { id: 'misc-headphones', name: 'Headphones', url: `${LUCIDE_CDN}/headphones.svg`, category: 'Misc' },
    { id: 'misc-globe', name: 'Globe', url: `${LUCIDE_CDN}/globe.svg`, category: 'Misc' },
    { id: 'misc-map', name: 'Map Pin', url: `${LUCIDE_CDN}/map-pin.svg`, category: 'Misc' },
    { id: 'misc-calendar', name: 'Calendar', url: `${LUCIDE_CDN}/calendar.svg`, category: 'Misc' },
    { id: 'misc-clock', name: 'Clock', url: `${LUCIDE_CDN}/clock.svg`, category: 'Misc' },
];

export const GRAPHICS_CATEGORIES = Array.from(new Set(GRAPHICS_LIBRARY.map(item => item.category)));
export const PREMIUM_GRAPHICS = GRAPHICS_LIBRARY.filter(item => item.premium);
