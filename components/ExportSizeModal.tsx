import React, { useState } from 'react';

// Export size presets for different devices
export interface ExportPreset {
    id: string;
    name: string;
    category: 'ios' | 'android' | 'social' | 'custom';
    width: number;
    height: number;
    pixelRatio: number;
    description: string;
    icon: string;
    premium?: boolean;
    deviceType?: string; // Optional device mockup to use for this preset
}

export const EXPORT_PRESETS: ExportPreset[] = [
    // iOS Devices
    {
        id: 'iphone-15-pro-max',
        name: 'iPhone 15 Pro Max',
        category: 'ios',
        width: 1290,
        height: 2796,
        pixelRatio: 3,
        description: '6.7" Super Retina XDR',
        icon: '📱',
        deviceType: 'iphone16promax',
    },
    {
        id: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        category: 'ios',
        width: 1179,
        height: 2556,
        pixelRatio: 3,
        description: '6.1" Super Retina XDR',
        icon: '📱',
        deviceType: 'iphone16pro',
    },
    {
        id: 'iphone-15',
        name: 'iPhone 15 / 14',
        category: 'ios',
        width: 1170,
        height: 2532,
        pixelRatio: 3,
        description: '6.1" Super Retina',
        icon: '📱',
        deviceType: 'iphone16pro',
    },
    {
        id: 'iphone-se',
        name: 'iPhone SE',
        category: 'ios',
        width: 750,
        height: 1334,
        pixelRatio: 2,
        description: '4.7" Retina HD',
        icon: '📱',
        deviceType: 'iphone16pro', // Defaulting to pro since we don't have SE mockup
    },
    {
        id: 'ipad-pro-13',
        name: 'iPad Pro 12.9"',
        category: 'ios',
        width: 2048,
        height: 2732,
        pixelRatio: 2,
        description: '12.9" Liquid Retina XDR',
        icon: '📲',
        premium: true,
        deviceType: 'ipadpro',
    },
    {
        id: 'ipad-pro-11',
        name: 'iPad Pro 11"',
        category: 'ios',
        width: 1668,
        height: 2388,
        pixelRatio: 2,
        description: '11" Liquid Retina XDR',
        icon: '📲',
        premium: true,
        deviceType: 'ipadpro',
    },
    {
        id: 'ipad-air',
        name: 'iPad Air',
        category: 'ios',
        width: 1640,
        height: 2360,
        pixelRatio: 2,
        description: '10.9" Liquid Retina',
        icon: '📲',
        deviceType: 'ipadpro',
    },

    // Android Devices
    {
        id: 'pixel-9-pro',
        name: 'Google Pixel 9 Pro',
        category: 'android',
        width: 1344,
        height: 2992,
        pixelRatio: 3,
        description: '6.7" LTPO OLED',
        icon: '🤖',
        deviceType: 'pixel9pro',
    },
    {
        id: 'pixel-9',
        name: 'Google Pixel 9',
        category: 'android',
        width: 1080,
        height: 2400,
        pixelRatio: 3,
        description: '6.3" OLED',
        icon: '🤖',
        deviceType: 'pixel9pro',
    },
    {
        id: 'samsung-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'android',
        width: 1440,
        height: 3120,
        pixelRatio: 4,
        description: '6.8" Dynamic AMOLED 2X',
        icon: '🤖',
        premium: true,
        deviceType: 'pixel9pro',
    },
    {
        id: 'samsung-s24',
        name: 'Samsung Galaxy S24',
        category: 'android',
        width: 1080,
        height: 2340,
        pixelRatio: 3,
        description: '6.2" Dynamic AMOLED 2X',
        icon: '🤖',
        deviceType: 'pixel9pro',
    },
    {
        id: 'samsung-tab-s9',
        name: 'Samsung Galaxy Tab S9+',
        category: 'android',
        width: 1752,
        height: 2800,
        pixelRatio: 2,
        description: '12.4" Super AMOLED',
        icon: '📲',
        premium: true,
        deviceType: 'ipadpro', // Tablet mockup
    },
    {
        id: 'oneplus-12',
        name: 'OnePlus 12',
        category: 'android',
        width: 1440,
        height: 3168,
        pixelRatio: 3,
        description: '6.82" LTPO AMOLED',
        icon: '🤖',
        deviceType: 'pixel9pro',
    },

    // Social Media / Store Formats
    {
        id: 'app-store',
        name: 'App Store (6.5")',
        category: 'social',
        width: 1242,
        height: 2688,
        pixelRatio: 3,
        description: 'Official Apple App Store size',
        icon: '🍎',
        premium: true,
        deviceType: 'iphone16promax',
    },
    {
        id: 'play-store',
        name: 'Play Store',
        category: 'social',
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        description: 'Official Google Play Store',
        icon: '▶️',
        premium: true,
        deviceType: 'pixel9pro',
    },
    {
        id: 'instagram-story',
        name: 'Instagram Story',
        category: 'social',
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        description: '9:16 vertical format',
        icon: '📸',
    },
    {
        id: 'instagram-post',
        name: 'Instagram Post',
        category: 'social',
        width: 1080,
        height: 1080,
        pixelRatio: 2,
        description: '1:1 square format',
        icon: '📸',
    },
];

interface ExportSizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (preset: ExportPreset | null, customWidth?: number, customHeight?: number, quality?: 'standard' | 'high' | 'ultra') => void;
    isExporting: boolean;
}

export const ExportSizeModal: React.FC<ExportSizeModalProps> = ({
    isOpen,
    onClose,
    onExport,
    isExporting,
}) => {
    const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(EXPORT_PRESETS[0]);
    const [activeCategory, setActiveCategory] = useState<'ios' | 'android' | 'social' | 'custom'>('ios');
    const [customWidth, setCustomWidth] = useState(1080);
    const [customHeight, setCustomHeight] = useState(1920);
    const [quality, setQuality] = useState<'standard' | 'high' | 'ultra'>('high');

    if (!isOpen) return null;

    const filteredPresets = EXPORT_PRESETS.filter(p => p.category === activeCategory);

    const handleExport = () => {
        if (activeCategory === 'custom') {
            onExport(null, customWidth, customHeight, quality);
        } else if (selectedPreset) {
            onExport(selectedPreset, undefined, undefined, quality);
        }
    };

    const getQualityMultiplier = () => {
        switch (quality) {
            case 'standard': return 2;
            case 'high': return 3;
            case 'ultra': return 4;
        }
    };

    const getFinalResolution = () => {
        if (activeCategory === 'custom') {
            const mult = getQualityMultiplier();
            return { width: customWidth * mult, height: customHeight * mult };
        }
        if (selectedPreset) {
            return { width: selectedPreset.width, height: selectedPreset.height };
        }
        return { width: 0, height: 0 };
    };

    const finalRes = getFinalResolution();

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-3xl animate-in fade-in duration-300" />

            {/* Modal */}
            <div
                className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-gradient-to-b from-obsidian-light via-obsidian-light to-obsidian rounded-[40px] border border-white/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)] animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-500"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -top-10 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                <span className="text-accent italic drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]">EXPORT</span>
                                <span className="text-white/90">STUDIO</span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-[8px] font-black text-accent uppercase tracking-widest">PRO</span>
                            </h2>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em] mt-2">
                                Device-Optimized Export Pipeline
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)] scrollbar-hide">
                    {/* Category Tabs */}
                    <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/5 mb-8">
                        {[
                            { id: 'ios', name: 'iOS', icon: '🍎' },
                            { id: 'android', name: 'Android', icon: '🤖' },
                            { id: 'social', name: 'Store & Social', icon: '📱' },
                            { id: 'custom', name: 'Custom', icon: '⚙️' },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id as any);
                                    if (cat.id !== 'custom') {
                                        const firstPreset = EXPORT_PRESETS.find(p => p.category === cat.id);
                                        if (firstPreset) setSelectedPreset(firstPreset);
                                    }
                                }}
                                className={`
                  flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                  ${activeCategory === cat.id
                                        ? 'bg-accent/10 text-accent shadow-[0_0_30px_rgba(0,255,136,0.1)] border border-accent/30'
                                        : 'text-white/30 hover:text-white/50 hover:bg-white/5 border border-transparent'
                                    }
                `}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Device Presets Grid */}
                    {activeCategory !== 'custom' ? (
                        <div className="grid grid-cols-2 gap-3">
                            {filteredPresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => setSelectedPreset(preset)}
                                    className={`
                    group relative p-5 rounded-2xl border transition-all duration-300 text-left overflow-hidden
                    ${selectedPreset?.id === preset.id
                                            ? 'bg-accent/10 border-accent/40 shadow-[0_0_40px_rgba(0,255,136,0.1)]'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }
                  `}
                                >
                                    {/* Premium Badge */}
                                    {preset.premium && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                                            <span className="text-[7px] font-black text-amber-400 uppercase tracking-wider">4K PRO</span>
                                        </div>
                                    )}

                                    {/* Selected Indicator */}
                                    {selectedPreset?.id === preset.id && (
                                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                                            <svg className="w-3 h-3 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center text-xl
                      ${selectedPreset?.id === preset.id ? 'bg-accent/20' : 'bg-white/5'}
                    `}>
                                            {preset.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">
                                                {preset.name}
                                            </div>
                                            <div className="text-[9px] text-white/30 font-bold mt-1">
                                                {preset.description}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-mono font-bold text-white/40">
                                                    {preset.width}×{preset.height}
                                                </span>
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] font-bold text-white/30">
                                                    @{preset.pixelRatio}x
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Custom Size Input */
                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-white">Custom Dimensions</span>
                                        <p className="text-[9px] text-white/30 font-bold">Set your own export resolution</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest block">Width (px)</label>
                                        <input
                                            type="number"
                                            value={customWidth}
                                            onChange={(e) => setCustomWidth(Number(e.target.value) || 1080)}
                                            className="w-full bg-obsidian border border-white/10 rounded-2xl px-5 py-4 text-lg font-mono font-bold focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-white/40 font-bold uppercase tracking-widest block">Height (px)</label>
                                        <input
                                            type="number"
                                            value={customHeight}
                                            onChange={(e) => setCustomHeight(Number(e.target.value) || 1920)}
                                            className="w-full bg-obsidian border border-white/10 rounded-2xl px-5 py-4 text-lg font-mono font-bold focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none text-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Quick Presets */}
                                <div className="flex gap-2 flex-wrap">
                                    {[
                                        { label: '1080p', w: 1080, h: 1920 },
                                        { label: '2K', w: 1440, h: 2560 },
                                        { label: '4K', w: 2160, h: 3840 },
                                        { label: 'Square', w: 1080, h: 1080 },
                                        { label: '16:9', w: 1920, h: 1080 },
                                    ].map((quick) => (
                                        <button
                                            key={quick.label}
                                            onClick={() => {
                                                setCustomWidth(quick.w);
                                                setCustomHeight(quick.h);
                                            }}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            {quick.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quality Selection */}
                    <div className="mt-8 space-y-4">
                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest block">Export Quality</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'standard', name: 'Standard', desc: '2x pixel ratio', icon: '⚡' },
                                { id: 'high', name: 'High', desc: '3x pixel ratio', icon: '✨' },
                                { id: 'ultra', name: 'Ultra 4K', desc: '4x pixel ratio', icon: '💎' },
                            ].map((q) => (
                                <button
                                    key={q.id}
                                    onClick={() => setQuality(q.id as any)}
                                    className={`
                    p-4 rounded-2xl border transition-all text-left
                    ${quality === q.id
                                            ? 'bg-accent/10 border-accent/40'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{q.icon}</span>
                                        <span className={`text-sm font-bold ${quality === q.id ? 'text-accent' : 'text-white/80'}`}>{q.name}</span>
                                    </div>
                                    <span className="text-[9px] text-white/30 font-bold">{q.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Export Action */}
                <div className="p-8 border-t border-white/5 bg-gradient-to-t from-obsidian to-transparent">
                    {/* Resolution Preview */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Final Output Resolution</div>
                                <div className="text-[10px] text-white/40 font-mono font-bold mt-1">
                                    {finalRes.width.toLocaleString()} × {finalRes.height.toLocaleString()} pixels
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                {((finalRes.width * finalRes.height) / 1000000).toFixed(1)} MP
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full py-6 bg-accent text-obsidian rounded-[24px] text-sm font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 shadow-[0_30px_60px_-15px_rgba(0,255,136,0.5)] disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                    >
                        {/* Premium Shimmer */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1s] ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        {isExporting ? (
                            <div className="flex items-center gap-3">
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-obsidian border-t-transparent" />
                                <span className="animate-pulse">PROCESSING...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 relative">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>EXPORT {selectedPreset?.name || 'CUSTOM'}</span>
                            </div>
                        )}
                    </button>

                    <p className="text-center mt-5 text-[9px] text-white/20 font-bold">
                        All frames will be exported to a ZIP archive • Lossless PNG format
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExportSizeModal;
