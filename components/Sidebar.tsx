
import React, { useState } from 'react';
import { AppStyles, DeviceType, Template } from '../types';
import { DEVICES, Icons, TEMPLATES } from '../constants';

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
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'design' | 'ai'>('templates');
  const [bgPrompt, setBgPrompt] = useState('Abstract 3D marketing scene');
  const [activeFilter, setActiveFilter] = useState('3d-render');
  const [designSubTab, setDesignSubTab] = useState<'colors' | 'layout' | 'effects'>('colors');

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

      {/* Tab Navigation - Glassmorphism Style */}
      <div className="flex px-6 pt-6 gap-2">
        {(['templates', 'design', 'ai'] as const).map((tab) => (
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
              {(['colors', 'layout', 'effects'] as const).map((subtab) => (
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
                    <div className="flex justify-between text-[7px] text-white/20 font-bold">
                      <span>Up</span>
                      <span>Center</span>
                      <span>Down</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Effects Section */}
            {designSubTab === 'effects' && (
              <div className="space-y-6">
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

                {/* Atmospheric FX Toggle */}
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Atmospheric FX</span>
                    <span className="text-[8px] text-white/20 font-bold">Reflections, dust & grain</span>
                  </div>
                  <button
                    onClick={() => updateStyle('showDecorations', !styles.showDecorations)}
                    className={`
                      w-14 h-7 rounded-full transition-all relative
                      ${styles.showDecorations
                        ? 'bg-accent shadow-[0_0_20px_rgba(0,255,136,0.6)]'
                        : 'bg-white/10'
                      }
                    `}
                  >
                    <div className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-xl
                      ${styles.showDecorations ? 'left-8' : 'left-1'}
                    `} />
                  </button>
                </div>

                {/* Border Accent Toggle */}
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Border Accent</span>
                    <span className="text-[8px] text-white/20 font-bold">Subtle edge highlight</span>
                  </div>
                  <button
                    onClick={() => updateStyle('borderAccent', !styles.borderAccent)}
                    className={`
                      w-14 h-7 rounded-full transition-all relative
                      ${styles.borderAccent
                        ? 'bg-accent shadow-[0_0_20px_rgba(0,255,136,0.6)]'
                        : 'bg-white/10'
                      }
                    `}
                  >
                    <div className={`
                      absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-xl
                      ${styles.borderAccent ? 'left-8' : 'left-1'}
                    `} />
                  </button>
                </div>
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
