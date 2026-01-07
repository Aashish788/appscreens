
import React, { useState } from 'react';
import { AppStyles, DeviceType, Template } from '../types';
import { DEVICES, Icons, TEMPLATES } from '../constants';
import { GRAPHICS_LIBRARY, GRAPHICS_CATEGORIES, GraphicItem, PREMIUM_GRAPHICS } from '../graphicsData';

interface SidebarProps {
  styles: AppStyles;
  setStyles: (styles: AppStyles) => void;
  selectedDevice: DeviceType;
  setSelectedDevice: (id: DeviceType) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onApplyTemplate: (template: Template) => void;
  onGenerateAIBackground: (prompt: string) => void;
  isGeneratingBg: boolean;
  onExportBatch: () => void;
  isExporting: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  editingFrameId?: string | null;
  onResetFrameStyles?: () => void;
  onAddSticker?: (url: string) => void;
  // New Canvas Controls
  selectedScreenshot?: { hideDevice?: boolean; floatingImages?: any[]; floatingTexts?: any[] };
  onToggleDevice?: (hide: boolean) => void;
  onAddFloatingImage?: (url: string) => void;
  onAddFloatingText?: () => void;
  onUpdateFloatingText?: (id: string, updates: any) => void;
  onRemoveFloatingText?: (id: string) => void;
  onRemoveFloatingImage?: (id: string) => void;
}

const STYLE_FILTERS = [
  { id: '3d-render', name: '3D Hyper-Render', prompt: '3D abstract geometric scene with volumetric lighting and high-gloss textures', icon: '🧊' },
  { id: 'glass', name: 'Glassmorphism', prompt: 'Frosted glass panels, refraction, soft pastel gradients, futuristic UI aesthetic', icon: '💎' },
  { id: 'organic', name: 'Organic Soft', prompt: 'Soft claymorphism, rounded shapes, gentle shadows, minimalist pastel environment', icon: '🌿' },
  { id: 'dark-vibe', name: 'Cyber Noir', prompt: 'Obsidian textures, neon edge-lighting, dark minimalist tech environment', icon: '🌑' },
];

const DEVICE_COLORS = [
  { id: 'black', name: 'Midnight', color: '#000000' },
  { id: 'titanium', name: 'Titanium', color: '#1a1a1b' },
  { id: 'silver', name: 'Silver', color: '#d1d1d6' },
  { id: 'gold', name: 'Gold', color: '#d4af37' },
];

const SHADOW_OPTIONS = [
  { id: 'none', name: 'None' },
  { id: 'soft', name: 'Soft' },
  { id: 'heavy', name: 'Heavy' },
  { id: 'grounded', name: 'Grounded' },
  { id: 'floating', name: 'Floating' },
];

const BG_TYPES = [
  { id: 'solid', name: 'Solid', icon: '◼' },
  { id: 'gradient', name: 'Gradient', icon: '◐' },
  { id: 'mesh', name: 'Mesh', icon: '◈' },
  { id: 'spotlight', name: 'Spotlight', icon: '◉' },
  { id: 'glass', name: 'Glass', icon: '◇' },
];

// Replaced by GRAPHICS_LIBRARY from graphicsData.ts

export const Sidebar: React.FC<SidebarProps> = ({
  styles,
  setStyles,
  selectedDevice,
  setSelectedDevice,
  onAnalyze,
  isAnalyzing,
  onApplyTemplate,
  onGenerateAIBackground,
  isGeneratingBg,
  onExportBatch,
  isExporting,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  editingFrameId,
  onResetFrameStyles,
  onAddSticker,
  selectedScreenshot,
  onToggleDevice,
  onAddFloatingImage,
  onAddFloatingText,
  onUpdateFloatingText,
  onRemoveFloatingText,
  onRemoveFloatingImage,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'design' | 'ai' | 'graphics'>('templates');
  const [bgPrompt, setBgPrompt] = useState('Abstract 3D marketing scene');
  const [activeFilter, setActiveFilter] = useState('3d-render');
  const [designSubTab, setDesignSubTab] = useState<'colors' | 'layout' | 'effects' | 'typography' | 'canvas'>('colors');
  const [graphicsSearch, setGraphicsSearch] = useState('');
  const [activeGraphicCategory, setActiveGraphicCategory] = useState<string>('All');

  const filteredGraphics = React.useMemo(() => {
    return GRAPHICS_LIBRARY.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(graphicsSearch.toLowerCase());
      const matchesCategory = activeGraphicCategory === 'All' || item.category === activeGraphicCategory;
      return matchesSearch && matchesCategory;
    });
  }, [graphicsSearch, activeGraphicCategory]);

  const updateStyle = <K extends keyof AppStyles>(key: K, value: AppStyles[K]) => {
    setStyles({ ...styles, [key]: value });
  };

  const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

  return (
    <div className="w-[380px] h-full bg-gradient-to-b from-obsidian-light via-obsidian-light to-obsidian border-r border-white/5 flex flex-col overflow-hidden shadow-[20px_0_60px_-15px_rgba(0,0,0,0.8)] z-50">
      {/* Premium Header with Glassmorphism */}
      <div className="p-8 border-b border-white/5 bg-obsidian-light/80 backdrop-blur-3xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <h1 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
            <span className="text-accent italic drop-shadow-[0_0_20px_rgba(0,255,136,0.4)] animate-pulse">APEX</span>
            <span className="text-white/90 bg-gradient-to-r from-white to-white/60 bg-clip-text">STORE</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-ping shadow-[0_0_15px_#00FF88]" />
          </h1>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.25em] mt-1.5">
            Elite Visual Pipeline v5.0
          </p>
        </div>

        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="group flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-[9px] font-bold text-white/40 group-hover:text-white/60 uppercase tracking-wider">Undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="group flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
            <span className="text-[9px] font-bold text-white/40 group-hover:text-white/60 uppercase tracking-wider">Redo</span>
          </button>
        </div>
      </div>

      {/* Selection Mode Indicator */}
      {editingFrameId && (
        <div className="mx-6 mt-4 p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Local Edit Mode</span>
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-tight">Editing specific frame</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetFrameStyles?.();
            }}
            className="p-2 rounded-lg bg-obsidian-light border border-white/5 hover:border-accent/40 text-[8px] font-black text-white/40 hover:text-accent uppercase transition-all"
          >
            Reset to Global
          </button>
        </div>
      )}

      {/* Tab Navigation - Glassmorphism Style */}
      <div className="flex px-6 pt-6 gap-2">
        {(['templates', 'design', 'ai', 'graphics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative flex-1 py-3.5 rounded-2xl text-[9px] font-black tracking-widest 
              transition-all duration-500 border overflow-hidden
              ${activeTab === tab
                ? 'bg-accent/10 border-accent/40 text-accent shadow-[0_0_30px_rgba(0,255,136,0.15)]'
                : 'bg-white/5 border-transparent text-white/30 hover:bg-white/10 hover:text-white/50'
              }
            `}
          >
            {activeTab === tab && (
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 animate-pulse" />
            )}
            <span className="relative">{tab.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Content Area with Premium Scrollbar */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {categories.map(cat => (
              <section key={cat} className="space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.35em] text-white/20 border-l-2 border-accent/30 pl-3 flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-accent/40">({TEMPLATES.filter(t => t.category === cat).length})</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {TEMPLATES.filter(t => t.category === cat).map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => onApplyTemplate(tpl)}
                      className="group relative w-full aspect-[21/9] rounded-[20px] overflow-hidden border border-white/5 hover:border-accent/50 transition-all duration-700 shadow-xl hover:-translate-y-1 hover:shadow-accent/10 active:scale-[0.98]"
                    >
                      <div
                        className="absolute inset-0 transition-all duration-1000 bg-cover bg-center group-hover:scale-110"
                        style={{
                          background: tpl.styles.backgroundImage
                            ? `url(${tpl.styles.backgroundImage})`
                            : `linear-gradient(135deg, ${tpl.previewColor}, #050505)`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="relative h-full p-5 flex flex-col justify-end">
                        <span className="font-black text-base text-white group-hover:text-accent transition-colors leading-none tracking-tighter uppercase">{tpl.name}</span>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Design Tab - Full DIY Editor */}
        {activeTab === 'design' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub-tabs */}
            <div className="flex gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/5">
              {(['colors', 'layout', 'effects', 'typography', 'canvas'] as const).map((subtab) => (
                <button
                  key={subtab}
                  onClick={() => setDesignSubTab(subtab)}
                  className={`
                    flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all
                    ${designSubTab === subtab
                      ? 'bg-white/10 text-white shadow-inner'
                      : 'text-white/30 hover:text-white/50'
                    }
                  `}
                >
                  {subtab}
                </button>
              ))}
            </div>

            {/* Colors Section */}
            {designSubTab === 'colors' && (
              <div className="space-y-6">
                {/* Primary Color */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Primary Color</label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={styles.primaryColor}
                        onChange={(e) => updateStyle('primaryColor', e.target.value)}
                        className="w-16 h-14 rounded-2xl bg-transparent border-2 border-white/10 cursor-pointer overflow-hidden p-0 appearance-none"
                      />
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_20px_var(--glow-color)] opacity-50"
                        style={{ '--glow-color': styles.primaryColor } as React.CSSProperties}
                      />
                    </div>
                    <input
                      type="text"
                      value={styles.primaryColor.toUpperCase()}
                      onChange={(e) => updateStyle('primaryColor', e.target.value)}
                      className="flex-1 bg-obsidian border border-white/10 rounded-2xl px-5 text-xs font-mono font-bold focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none uppercase tracking-widest transition-all"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Secondary Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={styles.secondaryColor}
                      onChange={(e) => updateStyle('secondaryColor', e.target.value)}
                      className="w-16 h-14 rounded-2xl bg-transparent border-2 border-white/10 cursor-pointer overflow-hidden p-0 appearance-none"
                    />
                    <input
                      type="text"
                      value={styles.secondaryColor.toUpperCase()}
                      onChange={(e) => updateStyle('secondaryColor', e.target.value)}
                      className="flex-1 bg-obsidian border border-white/10 rounded-2xl px-5 text-xs font-mono font-bold focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none uppercase tracking-widest transition-all"
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Background Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {BG_TYPES.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => updateStyle('backgroundType', bg.id as AppStyles['backgroundType'])}
                        className={`
                          flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all
                          ${styles.backgroundType === bg.id
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
                          }
                        `}
                      >
                        <span className="text-lg">{bg.icon}</span>
                        <span className="text-[8px] font-bold uppercase tracking-tight">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient Angle (only show for gradient type) */}
                {styles.backgroundType === 'gradient' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-white/50 font-black uppercase tracking-widest">Gradient Angle</label>
                      <span className="text-xs font-mono font-bold text-accent">{styles.gradientAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={styles.gradientAngle}
                      onChange={(e) => updateStyle('gradientAngle', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                )}

                {/* Device Color */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Device Frame</label>
                  <div className="grid grid-cols-4 gap-2">
                    {DEVICE_COLORS.map((dc) => (
                      <button
                        key={dc.id}
                        onClick={() => updateStyle('deviceColor', dc.id as AppStyles['deviceColor'])}
                        className={`
                          flex flex-col items-center gap-2 py-3 rounded-xl border transition-all
                          ${styles.deviceColor === dc.id
                            ? 'bg-white/10 border-accent/40'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }
                        `}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/20 shadow-inner"
                          style={{ backgroundColor: dc.color }}
                        />
                        <span className="text-[8px] font-bold text-white/50 uppercase tracking-tight">{dc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Layout Section */}
            {designSubTab === 'layout' && (
              <div className="space-y-6">
                {/* Device Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Device Profile</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEVICES.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDevice(d.id)}
                        className={`
                          p-4 rounded-xl border transition-all text-left
                          ${selectedDevice === d.id
                            ? 'bg-accent/10 border-accent/40'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="text-xs font-bold text-white/80">{d.name}</div>
                        <div className="text-[9px] text-white/30 font-mono mt-1">{d.width}×{d.height}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Device Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white font-black uppercase tracking-widest leading-none">Show Mockup</label>
                    <span className="text-[8px] text-white/30 font-bold uppercase tracking-tight">Display phone hardware shell</span>
                  </div>
                  <button
                    onClick={() => updateStyle('showDevice', !styles.showDevice)}
                    className={`
                      w-12 h-6 rounded-full transition-all relative
                      ${styles.showDevice ? 'bg-accent shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'bg-white/10'}
                    `}
                  >
                    <div className={`
                      absolute top-1 w-4 h-4 rounded-full transition-all duration-300
                      ${styles.showDevice ? 'left-7 bg-obsidian' : 'left-1 bg-white/40'}
                    `} />
                  </button>
                </div>

                {/* Text Alignment */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Text Alignment</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => updateStyle('textAlign', align)}
                        className={`
                          py-4 border rounded-xl flex items-center justify-center transition-all
                          ${styles.textAlign === align
                            ? 'bg-accent/10 border-accent/40 text-accent shadow-inner'
                            : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
                          }
                        `}
                      >
                        <span className="text-[10px] uppercase font-black tracking-tighter">{align}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Device Transform Controls */}
                <div className="space-y-4">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Device Transform</label>

                  {/* Tilt Y */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Tilt Y</span>
                      <span className="text-[10px] font-mono text-accent">{styles.deviceTilt}°</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={styles.deviceTilt}
                      onChange={(e) => updateStyle('deviceTilt', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Rotation X */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Rotation X</span>
                      <span className="text-[10px] font-mono text-accent">{styles.deviceRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={styles.deviceRotation}
                      onChange={(e) => updateStyle('deviceRotation', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Scale */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Scale</span>
                      <span className="text-[10px] font-mono text-accent">{(styles.deviceScale * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.5"
                      step="0.05"
                      value={styles.deviceScale}
                      onChange={(e) => updateStyle('deviceScale', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Vertical Position */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Y Position</span>
                      <span className="text-[10px] font-mono text-accent">{styles.deviceVerticalPosition || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={styles.deviceVerticalPosition || 0}
                      onChange={(e) => updateStyle('deviceVerticalPosition', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Horizontal Position */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">X Position</span>
                      <span className="text-[10px] font-mono text-accent">{styles.deviceHorizontalPosition || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={styles.deviceHorizontalPosition || 0}
                      onChange={(e) => updateStyle('deviceHorizontalPosition', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Frame Rotation / Straighten */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Straighten</span>
                      <span className="text-[10px] font-mono text-accent">{styles.frameRotation || 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={styles.frameRotation || 0}
                      onChange={(e) => updateStyle('frameRotation', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Frame Gap */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Frame Spacing</span>
                      <span className="text-[10px] font-mono text-accent">{styles.frameGap}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={styles.frameGap}
                      onChange={(e) => updateStyle('frameGap', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Frame Corner Radius */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Frame Corner</span>
                      <span className="text-[10px] font-mono text-accent">{styles.cornerRadius || 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      value={styles.cornerRadius || 0}
                      onChange={(e) => updateStyle('cornerRadius', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between mt-1">
                      <button
                        onClick={() => updateStyle('cornerRadius', 0)}
                        className="text-[8px] font-black text-white/20 hover:text-white/50 uppercase tracking-tighter"
                      >
                        Sharp
                      </button>
                      <button
                        onClick={() => updateStyle('cornerRadius', 56)}
                        className="text-[8px] font-black text-white/20 hover:text-white/50 uppercase tracking-tighter"
                      >
                        Default
                      </button>
                      <button
                        onClick={() => updateStyle('cornerRadius', 100)}
                        className="text-[8px] font-black text-white/20 hover:text-white/50 uppercase tracking-tighter"
                      >
                        Rounded
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Effects Section */}
            {designSubTab === 'effects' && (
              <div className="space-y-6">
                {/* Advanced Visual FX */}
                <div className="space-y-5">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Advanced Visual FX</label>

                  {/* Noise Intensity */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Film Grain</span>
                      <span className="text-[10px] font-mono text-accent">{Math.round(styles.noiseOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.2"
                      step="0.01"
                      value={styles.noiseOpacity}
                      onChange={(e) => updateStyle('noiseOpacity', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Glass Blur */}
                  {styles.backgroundType === 'glass' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-white/40 font-bold">Glass Refraction</span>
                        <span className="text-[10px] font-mono text-accent">{styles.glassBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={styles.glassBlur}
                        onChange={(e) => updateStyle('glassBlur', Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  )}

                  {/* Reflection Opacity */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-white/40 font-bold">Screen Reflection</span>
                      <span className="text-[10px] font-mono text-accent">{Math.round(styles.reflectionOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={styles.reflectionOpacity}
                      onChange={(e) => updateStyle('reflectionOpacity', Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                    />
                  </div>
                </div>

                {/* Patterns */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Background Pattern</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['none', 'grid', 'dots', 'plus'] as const).map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => updateStyle('backgroundPattern', pattern)}
                        className={`
                          py-3 rounded-xl border text-[8px] font-black uppercase transition-all
                          ${styles.backgroundPattern === pattern
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
                          }
                        `}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shadow Intensity */}
                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Shadow Style</label>
                  <div className="grid grid-cols-5 gap-2">
                    {SHADOW_OPTIONS.map((shadow) => (
                      <button
                        key={shadow.id}
                        onClick={() => updateStyle('shadowIntensity', shadow.id as AppStyles['shadowIntensity'])}
                        className={`
                          py-3 rounded-xl border text-[8px] font-bold uppercase transition-all
                          ${styles.shadowIntensity === shadow.id
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-white/5 border-white/5 text-white/40 hover:text-white/60'
                          }
                        `}
                      >
                        {shadow.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStyle('showDecorations', !styles.showDecorations)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${styles.showDecorations ? 'bg-accent/10 border-accent/40 text-accent' : 'bg-white/5 border-white/5 text-white/40'}`}
                  >
                    <span className="text-[8px] font-black uppercase">Atmosphere</span>
                    <div className={`w-6 h-3 rounded-full relative ${styles.showDecorations ? 'bg-accent' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${styles.showDecorations ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                  <button
                    onClick={() => updateStyle('borderAccent', !styles.borderAccent)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${styles.borderAccent ? 'bg-accent/10 border-accent/40 text-accent' : 'bg-white/5 border-white/5 text-white/40'}`}
                  >
                    <span className="text-[8px] font-black uppercase">Edge Border</span>
                    <div className={`w-6 h-3 rounded-full relative ${styles.borderAccent ? 'bg-accent' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${styles.borderAccent ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>

                {/* Experimental Premium FX */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Experimental Premium FX</label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateStyle('interactiveTilt', !styles.interactiveTilt)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${styles.interactiveTilt ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                      <span className="text-[8px] font-black uppercase">3D Tilt</span>
                      <div className={`w-6 h-3 rounded-full relative ${styles.interactiveTilt ? 'bg-blue-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${styles.interactiveTilt ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </button>
                    <button
                      onClick={() => updateStyle('showFloatingShapes', !styles.showFloatingShapes)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${styles.showFloatingShapes ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                      <span className="text-[8px] font-black uppercase">Glass Shapes</span>
                      <div className={`w-6 h-3 rounded-full relative ${styles.showFloatingShapes ? 'bg-purple-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${styles.showFloatingShapes ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </button>
                  </div>

                  {styles.backgroundType === 'mesh' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-white/40 font-bold">Mesh Flow Speed</span>
                        <span className="text-[10px] font-mono text-accent">{styles.meshAnimationSpeed}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={styles.meshAnimationSpeed}
                        onChange={(e) => updateStyle('meshAnimationSpeed', Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Typography Section */}
            {designSubTab === 'typography' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Global Font Family</label>
                  <select
                    value={styles.fontFamily}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    className="w-full bg-obsidian border border-white/10 rounded-2xl p-4 text-xs font-bold focus:border-accent/40 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Inter">Inter (Default)</option>
                    <option value="Outfit">Outfit (Premium)</option>
                    <option value="Plus Jakarta Sans">Jakarta (Modern)</option>
                    <option value="Playfair Display">Playfair (Elegant)</option>
                    <option value="JetBrains Mono">JetBrains (Tech)</option>
                    <option value="Space Grotesk">Space (Cyber)</option>
                    <option value="Montserrat">Montserrat (Classic)</option>
                  </select>
                </div>

                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 border-dashed">
                  <div className="flex items-center gap-3 mb-4">
                    <Icons.Magic />
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest">Type Control</span>
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed font-bold">
                    Use the <span className="text-white/60 underline">Inline Editor</span> directly on each frame for surgical control over Font Sizes, Weights, and Positioning. Click the edit icon on any text to open the precision panel.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-white/50 block font-black uppercase tracking-widest">Global Text Align</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => updateStyle('textAlign', align)}
                        className={`py-3 border rounded-xl flex items-center justify-center transition-all ${styles.textAlign === align ? 'bg-accent/10 border-accent/40 text-accent' : 'bg-white/5 border-white/5 text-white/30'}`}
                      >
                        <span className="text-[9px] uppercase font-black">{align}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Canvas Section - PREMIUM DIY Canvas Studio */}
            {designSubTab === 'canvas' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                {!editingFrameId ? (
                  <div className="p-8 rounded-[32px] bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 flex flex-col items-center gap-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.1),transparent_50%)]" />
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 relative">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                    </div>
                    <div className="space-y-2 relative">
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Canvas Studio</p>
                      <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Select a frame to unlock creative controls</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Stats Bar */}
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span className="text-[8px] font-black text-white/60 uppercase">{selectedScreenshot?.floatingImages?.length || 0} Images</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-[8px] font-black text-white/60 uppercase">{selectedScreenshot?.floatingTexts?.length || 0} Texts</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-[8px] font-black text-white/60 uppercase">{selectedScreenshot?.stickers?.length || 0} Stickers</span>
                      </div>
                    </div>

                    {/* Device Visibility Toggle - Premium */}
                    <div className="p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
                      <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedScreenshot?.hideDevice ? 'bg-red-500/20 text-red-400' : 'bg-accent/20 text-accent'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-white uppercase tracking-wide block">Device Frame</span>
                            <span className="text-[8px] text-white/30 font-bold">{selectedScreenshot?.hideDevice ? 'Hidden' : 'Visible'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => onToggleDevice?.(!selectedScreenshot?.hideDevice)}
                          className={`w-14 h-8 rounded-full transition-all duration-500 relative shadow-inner ${selectedScreenshot?.hideDevice ? 'bg-red-500/30 shadow-red-500/20' : 'bg-accent/30 shadow-accent/20'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-500 shadow-lg ${selectedScreenshot?.hideDevice ? 'left-1 bg-red-400' : 'left-7 bg-accent'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Quick Text Presets */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Quick Labels</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { text: 'NEW', color: '#22C55E', bg: 'bg-green-500/20' },
                          { text: 'HOT', color: '#EF4444', bg: 'bg-red-500/20' },
                          { text: 'BEST', color: '#F59E0B', bg: 'bg-amber-500/20' },
                          { text: 'PRO', color: '#8B5CF6', bg: 'bg-purple-500/20' },
                          { text: 'FREE', color: '#3B82F6', bg: 'bg-blue-500/20' },
                          { text: '★★★★★', color: '#FBBF24', bg: 'bg-yellow-500/20' },
                        ].map((preset) => (
                          <button
                            key={preset.text}
                            onClick={() => {
                              onAddFloatingText?.();
                              setTimeout(() => {
                                const texts = selectedScreenshot?.floatingTexts || [];
                                if (texts.length > 0) {
                                  const lastText = texts[texts.length - 1];
                                  onUpdateFloatingText?.(lastText.id, {
                                    content: preset.text,
                                    color: preset.color,
                                    fontSize: 16,
                                    fontWeight: 900
                                  });
                                }
                              }, 50);
                            }}
                            className={`${preset.bg} border border-white/10 rounded-xl py-2.5 text-[9px] font-black uppercase tracking-wide transition-all hover:scale-105 active:scale-95`}
                            style={{ color: preset.color }}
                          >
                            {preset.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add Elements Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Add Elements</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Add Image */}
                        <div className="relative group p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex flex-col items-center gap-3 transition-all hover:border-blue-400/50 cursor-pointer overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 relative">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-wide relative">Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => onAddFloatingImage?.(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>

                        {/* Add Text */}
                        <button
                          onClick={() => onAddFloatingText?.()}
                          className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex flex-col items-center gap-3 transition-all hover:border-purple-400/50"
                        >
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <span className="text-xl font-black">T</span>
                          </div>
                          <span className="text-[9px] font-black text-purple-400 uppercase tracking-wide">Text</span>
                        </button>
                      </div>
                    </div>

                    {/* Layer Manager - Images */}
                    {selectedScreenshot?.floatingImages && selectedScreenshot.floatingImages.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Image Layers</span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {selectedScreenshot.floatingImages.map((img: any, idx: number) => (
                            <div key={img.id} className="group flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-400/30 transition-all">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/20 overflow-hidden flex-shrink-0">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-bold text-white/80 block truncate">Layer {idx + 1}</span>
                                <span className="text-[7px] text-white/30">Pos: {Math.round(img.x)}%, {Math.round(img.y)}%</span>
                              </div>
                              <button
                                onClick={() => onRemoveFloatingImage?.(img.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Layer Manager - Texts */}
                    {selectedScreenshot?.floatingTexts && selectedScreenshot.floatingTexts.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Text Layers</span>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {selectedScreenshot.floatingTexts.map((txt: any) => (
                            <div key={txt.id} className="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-400/30 transition-all space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: txt.color + '20' }}>
                                  <span className="text-sm font-black" style={{ color: txt.color }}>T</span>
                                </div>
                                <input
                                  type="text"
                                  value={txt.content}
                                  onChange={(e) => onUpdateFloatingText?.(txt.id, { content: e.target.value })}
                                  className="flex-1 bg-transparent text-[10px] font-bold text-white border-b border-white/10 focus:border-purple-400/50 outline-none pb-1 min-w-0"
                                />
                                <button
                                  onClick={() => onRemoveFloatingText?.(txt.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>

                              {/* Compact Controls Row */}
                              <div className="grid grid-cols-4 gap-2">
                                <div>
                                  <span className="text-[6px] text-white/20 uppercase block mb-1">Size</span>
                                  <input
                                    type="number"
                                    value={txt.fontSize}
                                    onChange={(e) => onUpdateFloatingText?.(txt.id, { fontSize: Number(e.target.value) })}
                                    className="w-full bg-white/5 rounded-lg px-2 py-1.5 text-[8px] font-bold text-white border border-white/5 focus:border-purple-400/40 outline-none"
                                  />
                                </div>
                                <div>
                                  <span className="text-[6px] text-white/20 uppercase block mb-1">Weight</span>
                                  <select
                                    value={txt.fontWeight}
                                    onChange={(e) => onUpdateFloatingText?.(txt.id, { fontWeight: Number(e.target.value) })}
                                    className="w-full bg-white/5 rounded-lg px-1 py-1.5 text-[8px] font-bold text-white border border-white/5 focus:border-purple-400/40 outline-none appearance-none"
                                  >
                                    <option value={400}>Reg</option>
                                    <option value={600}>Med</option>
                                    <option value={700}>Bold</option>
                                    <option value={900}>Blk</option>
                                  </select>
                                </div>
                                <div>
                                  <span className="text-[6px] text-white/20 uppercase block mb-1">Font</span>
                                  <select
                                    value={txt.fontFamily}
                                    onChange={(e) => onUpdateFloatingText?.(txt.id, { fontFamily: e.target.value })}
                                    className="w-full bg-white/5 rounded-lg px-1 py-1.5 text-[8px] font-bold text-white border border-white/5 focus:border-purple-400/40 outline-none appearance-none"
                                  >
                                    <option value="Inter">Inter</option>
                                    <option value="Outfit">Outfit</option>
                                    <option value="Plus Jakarta Sans">Jakarta</option>
                                    <option value="Space Grotesk">Space</option>
                                  </select>
                                </div>
                                <div>
                                  <span className="text-[6px] text-white/20 uppercase block mb-1">Color</span>
                                  <input
                                    type="color"
                                    value={txt.color}
                                    onChange={(e) => onUpdateFloatingText?.(txt.id, { color: e.target.value })}
                                    className="w-full h-6 rounded-lg cursor-pointer border border-white/5"
                                  />
                                </div>
                              </div>

                              {/* Opacity Slider */}
                              <div className="flex items-center gap-3">
                                <span className="text-[7px] text-white/30 uppercase w-12">Opacity</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={txt.opacity || 1}
                                  onChange={(e) => onUpdateFloatingText?.(txt.id, { opacity: Number(e.target.value) })}
                                  className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-400"
                                />
                                <span className="text-[8px] text-white/40 font-bold w-8">{Math.round((txt.opacity || 1) * 100)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pro Tips Card */}
                    <div className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
                      <div className="flex items-center gap-2 mb-2 relative">
                        <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest">Pro Tips</span>
                      </div>
                      <ul className="text-[8px] text-white/40 leading-relaxed font-bold space-y-1 relative">
                        <li className="flex items-start gap-2"><span className="text-accent">→</span> Drag elements on canvas to reposition</li>
                        <li className="flex items-start gap-2"><span className="text-accent">→</span> Hover for scale, rotate & delete controls</li>
                        <li className="flex items-start gap-2"><span className="text-accent">→</span> Hide device for pure canvas mode</li>
                        <li className="flex items-start gap-2"><span className="text-accent">→</span> All layers export in 4K quality</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Vision Console</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span className="text-[8px] font-black text-accent tracking-tighter uppercase">Neural Ready</span>
                </div>
              </div>

              {/* AI Magic Button - Premium Glassmorphism */}
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing || isGeneratingBg || isExporting}
                className="w-full relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="relative w-full bg-obsidian text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 border border-white/10 hover:border-accent/50 transition-all disabled:opacity-50 shadow-2xl active:scale-95 overflow-hidden">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {isAnalyzing || isGeneratingBg ? (
                    <div className="flex items-center gap-3 relative">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
                      <span className="text-[11px] uppercase tracking-[0.2em]">Synthesizing Reality...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 relative">
                      <Icons.Sparkles />
                      <span className="text-[11px] uppercase tracking-[0.2em]">ONE-CLICK MAGIC REMODEL</span>
                    </div>
                  )}
                </div>
              </button>

              {/* AI Settings Panel - Glassmorphism */}
              <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 space-y-6 relative overflow-hidden">
                {/* Decorative Gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4 relative">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Style Influence</span>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setActiveFilter(f.id);
                          setBgPrompt(f.prompt);
                        }}
                        className={`
                           flex items-center gap-2 text-[9px] font-black py-3 px-4 rounded-xl border transition-all
                           ${activeFilter === f.id
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-white/5 border-white/5 text-white/30 hover:text-white/60 hover:bg-white/10'
                          }
                         `}
                      >
                        <span>{f.icon}</span>
                        <span className="uppercase tracking-tight">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Custom Scene Directive</span>
                  <div className="relative group">
                    <input
                      type="text"
                      value={bgPrompt}
                      onChange={(e) => setBgPrompt(e.target.value)}
                      className="w-full bg-obsidian border border-white/10 rounded-2xl p-5 text-xs focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none text-white/80 transition-all font-bold placeholder:text-white/10"
                      placeholder="e.g. 3D Floating Gold Coins"
                    />
                  </div>
                </div>

                <button
                  onClick={() => onGenerateAIBackground(bgPrompt)}
                  disabled={isGeneratingBg || isAnalyzing || isExporting}
                  className={`
                    w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] 
                    transition-all flex items-center justify-center gap-2 relative overflow-hidden
                    ${isGeneratingBg
                      ? 'bg-accent/10 text-accent animate-pulse border border-accent/20'
                      : 'bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent shadow-[0_0_30px_rgba(0,255,136,0.1)]'
                    }
                  `}
                >
                  {isGeneratingBg ? 'Generating 8K Scene...' : 'RE-GENERATE PANORAMA'}
                </button>
              </div>
            </section>

            {/* Neural Engine Info Card */}
            <div className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20 border-dashed relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
              <h4 className="text-[9px] font-black text-accent uppercase tracking-widest mb-3 flex items-center gap-2 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                NEURAL ENGINE V5.0
              </h4>
              <p className="text-[9px] text-white/40 leading-relaxed font-bold relative">
                Our proprietary context engine analyzes your UI elements (icons, graphs, images) to craft backgrounds that perfectly mirror your app's purpose. DETAIL DISTRIBUTION is automatically locked to 16:9 panoramic constraints.
              </p>
            </div>
          </div>
        )}

        {/* Graphics Tab */}
        {activeTab === 'graphics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Premium Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">DESIGN_VAULT</span>
                  <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-accent/20 to-blue-500/20 border border-accent/30">
                    <span className="text-accent text-[8px] font-black uppercase tracking-tight">{GRAPHICS_LIBRARY.length}+ ASSETS</span>
                  </div>
                </h3>
              </div>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">
                Hand mockups • Device frames • Abstract shapes • Premium emojis • Brand logos
              </p>

              {/* Featured Premium Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Featured Premium</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {PREMIUM_GRAPHICS.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => editingFrameId && onAddSticker?.(item.url)}
                      disabled={!editingFrameId}
                      className="group flex-shrink-0 relative w-20 h-20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-3 transition-all duration-500 hover:border-amber-400/50 hover:scale-105 active:scale-95 disabled:opacity-40 overflow-hidden"
                    >
                      {/* Pulse Loader */}
                      <div className="absolute inset-0 bg-white/5 animate-pulse group-data-[featured-loaded=true]:hidden" />

                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-400/80 flex items-center justify-center z-10">
                        <span className="text-[6px] text-black font-black">★</span>
                      </div>
                      <img
                        src={item.url}
                        alt={item.name}
                        loading="eager"
                        style={{ opacity: 0, filter: 'invert(1)' }}
                        className="w-full h-full object-contain transition-all duration-500"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.opacity = '1';
                          img.closest('button')?.setAttribute('data-featured-loaded', 'true');
                        }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = 'https://unpkg.com/lucide-static@latest/icons/star.svg';
                          img.style.opacity = '0.5';
                          img.closest('button')?.setAttribute('data-featured-loaded', 'true');
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-colors">
                    <Icons.Search />
                  </div>
                  <input
                    type="text"
                    placeholder="SEARCH HAND MOCKUPS, DEVICES, EMOJIS..."
                    value={graphicsSearch}
                    onChange={(e) => setGraphicsSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black text-white placeholder:text-white/10 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 outline-none transition-all uppercase tracking-widest"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                  {['All', ...GRAPHICS_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveGraphicCategory(cat)}
                      className={`
                        whitespace-nowrap px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-2
                        ${activeGraphicCategory === cat
                          ? 'bg-accent/20 border-accent/40 text-accent shadow-[0_0_15px_rgba(0,255,136,0.1)]'
                          : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/60'
                        }
                      `}
                    >
                      {cat === 'Hand Mockups' && '🤳'}
                      {cat === 'Device Mockups' && '📱'}
                      {cat === 'Abstract' && '🎨'}
                      {cat === 'Glow Effects' && '✨'}
                      {cat === '3D Elements' && '💎'}
                      {cat === 'Badges' && '🏆'}
                      {cat === 'Social' && '📲'}
                      {cat === 'Emojis' && '🔥'}
                      {cat === 'Brands' && '🏢'}
                      {cat === 'Trust' && '🛡️'}
                      {cat === 'CTA Elements' && '🎯'}
                      {cat === 'Tech' && '⚡'}
                      {cat === 'Frames' && '🎪'}
                      {cat === 'All' && '🌟'}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!editingFrameId && (
              <div className="p-8 rounded-[32px] bg-accent/5 border border-accent/20 flex flex-col items-center gap-4 text-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Icons.Plus />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Deployment Required</p>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Select a frame to unlock design vault</p>
                </div>
              </div>
            )}

            <div className={`space-y-12 transition-all duration-700 ${!editingFrameId ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <div className="grid grid-cols-2 gap-4">
                {filteredGraphics.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => editingFrameId && onAddSticker?.(item.url)}
                    className={`group relative bg-white/5 border rounded-[24px] p-6 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 flex flex-col items-center gap-4 active:scale-95 overflow-hidden ${item.premium
                      ? 'border-amber-500/20 hover:border-amber-400/50'
                      : 'border-white/5 hover:border-accent/40'
                      }`}
                  >
                    {/* Pulsing Skeleton Loader - Visible until image loads or errors */}
                    <div
                      id={`skeleton-${item.id}`}
                      className="absolute inset-0 bg-white/5 animate-pulse z-0 pointer-events-none"
                    />

                    {/* Premium Badge */}
                    {item.premium && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 z-20">
                        <span className="text-[7px] text-black font-black">★</span>
                      </div>
                    )}

                    <div className="w-full h-16 flex items-center justify-center relative">
                      <div className={`absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${item.premium ? 'bg-amber-500/10' : 'bg-white/5'}`} />

                      {/* Optimized Image Pipeline */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="eager"
                          decoding="async"
                          style={{ opacity: 0, filter: 'invert(1)' }}
                          className="max-h-full max-w-full object-contain relative z-10 transition-all duration-500 group-hover:scale-110"
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).style.opacity = '1';
                            document.getElementById(`skeleton-${item.id}`)?.classList.add('hidden');
                          }}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = 'https://unpkg.com/lucide-static@latest/icons/star.svg';
                            img.style.opacity = '0.5';
                            document.getElementById(`skeleton-${item.id}`)?.classList.add('hidden');
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 text-center relative z-10">
                      <span className="text-[7px] font-black text-white/20 group-hover:text-white transition-colors uppercase tracking-[0.2em] line-clamp-1">{item.name}</span>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_#00FF88]" />
                    </div>
                  </button>
                ))}
              </div>

              {filteredGraphics.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No assets found in vault</p>
                </div>
              )}

              {/* Custom Pipeline Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Architect_Input</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="relative group p-10 rounded-[40px] bg-obsidian-light/50 border border-dashed border-white/10 flex flex-col items-center gap-5 transition-all hover:bg-white/5 hover:border-accent/50 cursor-pointer overflow-hidden active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-accent group-hover:rotate-90 transition-all duration-700 relative z-10">
                    <Icons.Plus />
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Import Custom DNA</p>
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-tight mt-1.5">Alpha-transparent PNG or GIF</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => {
                      if (!editingFrameId) return;
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => onAddSticker?.(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Premium Export Button */}
      <div className="mt-auto p-6 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <button
          onClick={onExportBatch}
          disabled={isExporting || isAnalyzing || isGeneratingBg}
          className="w-full py-5 bg-accent text-obsidian rounded-[20px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_30px_60px_-15px_rgba(0,255,136,0.5)] disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
        >
          {/* Premium Shimmer */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1s] ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {isExporting ? (
            <span className="animate-pulse relative">EXPORTING BATCH...</span>
          ) : (
            <div className="flex items-center gap-3 relative">
              <Icons.ArrowDownTray />
              <span>PRO EXPORT BATCH</span>
            </div>
          )}
        </button>

        {/* Keyboard Shortcut Hint */}
        <p className="text-center mt-4 text-[9px] text-white/20 font-bold">
          Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/40 font-mono">?</kbd> for keyboard shortcuts
        </p>
      </div>
    </div>
  );
};
