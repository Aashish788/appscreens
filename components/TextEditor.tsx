
import React, { useState } from 'react';
import { TextStyles } from '../types';

interface InlineTextEditorProps {
    styles: TextStyles;
    onChange: (styles: TextStyles) => void;
    label: string;
    isOpen: boolean;
    onClose: () => void;
}

const FONT_FAMILIES = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Outfit', value: 'Outfit, sans-serif' },
    { name: 'Jakarta', value: 'Plus Jakarta Sans, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Space', value: 'Space Grotesk, sans-serif' },
    { name: 'Playfair', value: 'Playfair Display, serif' },
    { name: 'JetBrains', value: 'JetBrains Mono, monospace' },
];

const FONT_WEIGHTS = [
    { name: 'Light', value: 300 },
    { name: 'Regular', value: 400 },
    { name: 'Medium', value: 500 },
    { name: 'Bold', value: 700 },
    { name: 'Black', value: 900 },
];

const PRESET_COLORS = [
    '#FFFFFF', '#000000', '#00FF88', '#FF385C', '#635BFF',
    '#1DB954', '#FF9E2C', '#E50914', '#0066CC', '#9146FF',
];

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
    styles,
    onChange,
    label,
    isOpen,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<'style' | 'position'>('style');

    const updateStyle = <K extends keyof TextStyles>(key: K, value: TextStyles[K]) => {
        onChange({ ...styles, [key]: value });
    };

    if (!isOpen) return null;

    return (
        <div
            className="w-[260px] shrink-0 animate-in slide-in-from-left-4 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-obsidian-light/98 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-obsidian/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-accent/20 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <span className="text-xs font-black text-white">{label}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-2 border-b border-white/5 bg-white/5">
                    {(['style', 'position'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all
                ${activeTab === tab
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-white/30 hover:text-white/50'
                                }
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[450px] overflow-y-auto scrollbar-hide">
                    {activeTab === 'style' && (
                        <>
                            {/* Color Picker */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest flex items-center justify-between">
                                    Color
                                    <span className="font-mono text-accent">{styles.color.toUpperCase().slice(0, 7)}</span>
                                </label>
                                <div className="flex gap-1 flex-wrap">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateStyle('color', color)}
                                            className={`
                        w-6 h-6 rounded-lg transition-all hover:scale-110
                        ${styles.color === color ? 'ring-2 ring-accent scale-110' : 'ring-1 ring-white/10'}
                      `}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={styles.color}
                                        onChange={(e) => updateStyle('color', e.target.value)}
                                        className="w-6 h-6 rounded-lg cursor-pointer appearance-none border-none"
                                    />
                                </div>
                            </div>

                            {/* Font Size */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest flex items-center justify-between">
                                    Size
                                    <span className="font-mono text-accent">{styles.fontSize}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="56"
                                    value={styles.fontSize}
                                    onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            {/* Font Family */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest">Font</label>
                                <div className="grid grid-cols-4 gap-1">
                                    {FONT_FAMILIES.map((font) => (
                                        <button
                                            key={font.value}
                                            onClick={() => updateStyle('fontFamily', font.value)}
                                            className={`
                        py-1.5 px-1 rounded-lg text-[7px] font-bold transition-all truncate
                        ${styles.fontFamily === font.value
                                                    ? 'bg-accent/20 border border-accent/40 text-accent'
                                                    : 'bg-white/5 border border-white/5 text-white/50 hover:bg-white/10'
                                                }
                      `}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Weight */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest">Weight</label>
                                <div className="grid grid-cols-5 gap-1">
                                    {FONT_WEIGHTS.map((weight) => (
                                        <button
                                            key={weight.value}
                                            onClick={() => updateStyle('fontWeight', weight.value)}
                                            className={`
                        py-1.5 rounded-lg text-[7px] uppercase transition-all
                        ${styles.fontWeight === weight.value
                                                    ? 'bg-accent/20 border border-accent/40 text-accent'
                                                    : 'bg-white/5 border border-white/5 text-white/40'
                                                }
                      `}
                                        >
                                            {weight.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Shadow */}
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <span className="text-[9px] font-bold text-white/60">Drop Shadow</span>
                                <button
                                    onClick={() => updateStyle('textShadow', !styles.textShadow)}
                                    className={`
                    w-10 h-5 rounded-full transition-all relative
                    ${styles.textShadow ? 'bg-accent' : 'bg-white/10'}
                  `}
                                >
                                    <div className={`
                    absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all
                    ${styles.textShadow ? 'left-5' : 'left-0.5'}
                  `} />
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'position' && (
                        <>
                            {/* Vertical Position */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest flex items-center justify-between">
                                    Y Position
                                    <span className="font-mono text-accent">{styles.verticalPosition}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="40"
                                    value={styles.verticalPosition}
                                    onChange={(e) => updateStyle('verticalPosition', Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            {/* Letter Spacing */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest flex items-center justify-between">
                                    Spacing
                                    <span className="font-mono text-accent">{styles.letterSpacing}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="-2"
                                    max="6"
                                    step="0.5"
                                    value={styles.letterSpacing}
                                    onChange={(e) => updateStyle('letterSpacing', Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            {/* Line Height */}
                            <div className="space-y-2">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest flex items-center justify-between">
                                    Line Height
                                    <span className="font-mono text-accent">{styles.lineHeight.toFixed(1)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.8"
                                    max="1.8"
                                    step="0.1"
                                    value={styles.lineHeight}
                                    onChange={(e) => updateStyle('lineHeight', Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            {/* Quick Presets */}
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                <label className="text-[8px] text-white/50 font-black uppercase tracking-widest">Presets</label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                        onClick={() => onChange({ ...styles, fontSize: 28, fontWeight: 900, letterSpacing: -1, textShadow: true })}
                                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent/50 transition-all text-left"
                                    >
                                        <span className="text-[8px] font-black text-white/70 block">Bold Hero</span>
                                    </button>
                                    <button
                                        onClick={() => onChange({ ...styles, fontSize: 16, fontWeight: 400, letterSpacing: 2 })}
                                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent/50 transition-all text-left"
                                    >
                                        <span className="text-[8px] font-black text-white/70 block">Elegant</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Live indicator */}
                <div className="p-2 border-t border-white/5 bg-black/30 flex items-center justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[7px] font-bold text-white/30 uppercase tracking-widest">Live Preview</span>
                </div>
            </div>
        </div>
    );
};

// Keep old exports for backwards compatibility
export const TextEditorPanel = InlineTextEditor;
export const TextEditorToolbar = InlineTextEditor;

// Default text styles
export const DEFAULT_TITLE_STYLES: TextStyles = {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 900,
    letterSpacing: -1,
    lineHeight: 1.1,
    textShadow: true,
    verticalPosition: 12,
};

export const DEFAULT_SUBTITLE_STYLES: TextStyles = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.4,
    textShadow: false,
    verticalPosition: 12,
};
