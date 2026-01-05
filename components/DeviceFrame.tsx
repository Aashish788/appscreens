
import React, { useState } from 'react';
import { DeviceMetadata, AppStyles, ScreenshotSet, TextStyles } from '../types';
import { Icons, DEFAULT_TITLE_STYLES, DEFAULT_SUBTITLE_STYLES } from '../constants';
import { QuickActions } from './QuickActions';
import { InlineTextEditor } from './TextEditor';

interface DeviceFrameProps {
  device: DeviceMetadata;
  styles: AppStyles;
  screenshot: ScreenshotSet;
  index: number;
  totalScreenshots: number;
  onUpdate: (data: Partial<ScreenshotSet>) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  isSelected: boolean;
  onSelect: () => void;
  zoomLevel: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  device,
  styles,
  screenshot,
  index,
  totalScreenshots,
  onUpdate,
  onUpload,
  onDuplicate,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
  isSelected,
  onSelect,
  zoomLevel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingText, setEditingText] = useState<'title' | 'subtitle' | null>(null);

  // Ensure styles exist with defaults
  const titleStyles = screenshot.titleStyles || DEFAULT_TITLE_STYLES;
  const subtitleStyles = screenshot.subtitleStyles || DEFAULT_SUBTITLE_STYLES;

  const isLight = styles.primaryColor === '#FFFFFF' || styles.primaryColor === '#FDFCF0' || styles.primaryColor === '#F2F2F7' || styles.primaryColor === '#F5F5F5' || styles.primaryColor === '#81D8D0';

  const getBackgroundStyle = () => {
    if (styles.backgroundImage) {
      const frameWidth = 360;
      const gap = 64;
      const totalWidth = (totalScreenshots * frameWidth) + ((totalScreenshots - 1) * gap);
      const scaleFactor = totalWidth / frameWidth;
      const xOffset = index * (frameWidth + gap);
      const percentagePosition = totalScreenshots > 1
        ? (xOffset / (totalWidth - frameWidth)) * 100
        : 50;

      return {
        backgroundImage: `url(${styles.backgroundImage})`,
        backgroundSize: `${scaleFactor * 100}% 100%`,
        backgroundPosition: `${percentagePosition}% center`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#050505'
      };
    }

    switch (styles.backgroundType) {
      case 'solid': return { backgroundColor: styles.primaryColor };
      case 'gradient': return { background: `linear-gradient(${styles.gradientAngle || 135}deg, ${styles.primaryColor}, ${styles.secondaryColor})` };
      case 'mesh': return {
        backgroundImage: `radial-gradient(at 0% 0%, ${styles.primaryColor}ee 0px, transparent 60%), 
                            radial-gradient(at 100% 0%, ${styles.secondaryColor}aa 0px, transparent 60%),
                            radial-gradient(at 50% 100%, ${styles.primaryColor}cc 0px, transparent 70%)`,
        backgroundColor: '#050505'
      };
      case 'spotlight': return { background: `radial-gradient(circle at 50% 140%, ${styles.primaryColor}88 0%, transparent 80%), #050505` };
      case 'glass': return {
        background: `linear-gradient(135deg, ${styles.primaryColor}44, ${styles.secondaryColor}22)`,
        backdropFilter: 'blur(120px)',
        border: '1px solid rgba(255,255,255,0.08)'
      };
      default: return { backgroundColor: styles.primaryColor };
    }
  };

  const getDeviceColor = () => {
    switch (styles.deviceColor) {
      case 'titanium': return 'border-[#1a1a1b] bg-[#0c0c0d] shadow-zinc-500/10';
      case 'black': return 'border-black bg-black shadow-black/80';
      case 'silver': return 'border-[#d1d1d6] bg-[#fdfdfd] shadow-slate-300/10';
      case 'gold': return 'border-[#d4af37]/50 bg-[#faf9f6] shadow-amber-300/5';
      default: return 'border-zinc-800 bg-black';
    }
  };

  const getShadowStyle = () => {
    switch (styles.shadowIntensity) {
      case 'soft': return 'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)]';
      case 'heavy': return 'shadow-[0_120px_250px_-40px_rgba(0,0,0,0.75)]';
      case 'grounded': return 'shadow-[0_20px_60px_rgba(0,0,0,0.5)]';
      case 'floating': return 'shadow-[0_160px_280px_-60px_rgba(0,0,0,0.95)] animate-float';
      case 'none': return 'shadow-none';
      default: return 'shadow-2xl';
    }
  };

  const transformStyle = {
    transform: `translateY(${(styles.deviceVerticalPosition || 0) * -2}px) rotateY(${styles.deviceTilt || 0}deg) rotateX(${styles.deviceRotation || 0}deg) scale(${styles.deviceScale || 1})`,
    transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
    transformStyle: 'preserve-3d' as const,
  };

  const getTextAlignClass = () => {
    switch (styles.textAlign) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleStylesChange = (newStyles: TextStyles) => {
    onUpdate({ titleStyles: newStyles });
  };

  const handleSubtitleStylesChange = (newStyles: TextStyles) => {
    onUpdate({ subtitleStyles: newStyles });
  };

  return (
    // Wrapper that contains both frame and editor side by side
    <div className="flex items-start gap-6 shrink-0">
      {/* Main Frame Container */}
      <div
        className={`
          relative group select-none perspective-3000 cursor-pointer
          transition-all duration-500 ease-out shrink-0
        `}
        id={`screenshot-frame-${screenshot.id}`}
        onClick={(e) => {
          if (editingText) {
            setEditingText(null);
          }
          onSelect();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Quick Actions Toolbar */}
        <QuickActions
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
          canMoveLeft={canMoveLeft}
          canMoveRight={canMoveRight}
          isVisible={isHovered || isSelected}
        />

        {/* Frame Index Badge */}
        <div className={`
          absolute -top-4 -left-4 z-50 w-10 h-10 rounded-2xl
          bg-obsidian-light/90 backdrop-blur-xl border border-white/10
          flex items-center justify-center
          text-xs font-black text-white/70
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]
          transition-all duration-300
          ${isSelected ? 'bg-accent text-obsidian border-accent' : ''}
        `}>
          {index + 1}
        </div>

        {/* Selection Ring */}
        <div className={`
          absolute -inset-3 rounded-[76px] pointer-events-none
          transition-all duration-500 ease-out
          ${isSelected
            ? 'opacity-100 ring-2 ring-accent ring-offset-4 ring-offset-obsidian shadow-[0_0_60px_rgba(0,255,136,0.2)]'
            : 'opacity-0'
          }
        `} />

        <div
          className={`
            w-[360px] h-[720px] rounded-[56px] flex flex-col relative overflow-hidden
            shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] 
            transition-all duration-1000 
            ${isHovered || isSelected ? 'ring-1 ring-white/20' : ''}
            ${isDragging ? 'ring-2 ring-accent ring-offset-4 ring-offset-obsidian' : ''}
          `}
          style={getBackgroundStyle()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 rounded-[56px] bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />

          {/* Caption Area - Full Width with Custom Positioning */}
          <div
            className={`absolute left-0 right-0 z-20 px-6 flex flex-col ${getTextAlignClass()}`}
            style={{ top: `${titleStyles.verticalPosition}%` }}
          >
            {/* Title with Edit Button */}
            <div className="relative group/title w-full">
              <input
                type="text"
                value={screenshot.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-none w-full focus:outline-none focus:bg-white/5 rounded-lg px-2 py-1 transition-all uppercase"
                placeholder="Your Headline"
                style={{
                  color: titleStyles.color,
                  fontSize: `${titleStyles.fontSize}px`,
                  fontFamily: titleStyles.fontFamily,
                  fontWeight: titleStyles.fontWeight,
                  letterSpacing: `${titleStyles.letterSpacing}px`,
                  lineHeight: titleStyles.lineHeight,
                  textShadow: titleStyles.textShadow ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
                  textAlign: styles.textAlign || 'center',
                }}
              />
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingText(editingText === 'title' ? null : 'title');
                }}
                className={`
                  absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl 
                  backdrop-blur-xl border transition-all shadow-lg
                  ${editingText === 'title'
                    ? 'bg-accent border-accent text-obsidian opacity-100'
                    : 'bg-obsidian/80 border-white/10 opacity-0 group-hover/title:opacity-100 hover:bg-accent hover:border-accent hover:text-obsidian'
                  }
                `}
                title="Edit Title Style"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            {/* Subtitle with Edit Button */}
            <div className="relative group/subtitle w-full mt-2">
              <textarea
                value={screenshot.subtitle}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-none w-full focus:outline-none focus:bg-white/5 rounded-lg px-2 py-1 resize-none overflow-hidden transition-all"
                placeholder="Your description here..."
                rows={2}
                style={{
                  color: subtitleStyles.color,
                  fontSize: `${subtitleStyles.fontSize}px`,
                  fontFamily: subtitleStyles.fontFamily,
                  fontWeight: subtitleStyles.fontWeight,
                  letterSpacing: `${subtitleStyles.letterSpacing}px`,
                  lineHeight: subtitleStyles.lineHeight,
                  textShadow: subtitleStyles.textShadow ? '0 2px 10px rgba(0,0,0,0.4)' : 'none',
                  textAlign: styles.textAlign || 'center',
                }}
              />
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingText(editingText === 'subtitle' ? null : 'subtitle');
                }}
                className={`
                  absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl 
                  backdrop-blur-xl border transition-all shadow-lg
                  ${editingText === 'subtitle'
                    ? 'bg-accent border-accent text-obsidian opacity-100'
                    : 'bg-obsidian/80 border-white/10 opacity-0 group-hover/subtitle:opacity-100 hover:bg-accent hover:border-accent hover:text-obsidian'
                  }
                `}
                title="Edit Subtitle Style"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Device Wrapper */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
            <div style={transformStyle} className="relative flex justify-center">
              {/* Professional Rim Highlight matching brand color */}
              {styles.showDevice && (
                <div
                  className="absolute inset-x-0 bottom-[-100px] h-[10px] pointer-events-none opacity-40 blur-2xl"
                  style={{ background: `radial-gradient(circle at 50% 100%, ${styles.primaryColor}, transparent 70%)` }}
                />
              )}

              <div
                className={`
                  relative overflow-hidden transition-all duration-1000 
                  ${styles.showDevice
                    ? `w-[200px] h-[420px] rounded-[44px] border-[8px] ${getDeviceColor()} ${getShadowStyle()}`
                    : `w-[185px] h-[400px] rounded-[24px] bg-obsidian-light/20 ${getShadowStyle()}`
                  }
                `}
              >
                {screenshot.image ? (
                  <div className="relative w-full h-full">
                    <img src={screenshot.image} alt="Preview" className="w-full h-full object-cover" />
                    {/* Subtle shine overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Remove Image Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate({ image: null });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-obsidian/80 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/80 hover:scale-110"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className={`
                      w-full h-full flex flex-col items-center justify-center 
                      bg-white/5 backdrop-blur-3xl gap-6 p-6 text-center
                      transition-all duration-500
                      ${isDragging ? 'bg-accent/10' : ''}
                    `}>
                    <div className={`
                        w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center 
                        text-white/20 group-hover:bg-accent group-hover:text-obsidian 
                        transition-all duration-500 
                        shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                        ${isDragging ? 'bg-accent text-obsidian animate-pulse' : ''}
                      `}>
                      <Icons.Plus />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">
                        {isDragging ? 'Drop Here' : 'Drop or Click'}
                      </span>
                      <span className="text-[7px] text-white/10 uppercase tracking-widest">
                        PNG, JPG, WebP
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onUpload}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
                {/* Island Notch */}
                {styles.showDevice && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 border border-white/5 shadow-inner" />
                )}
              </div>
            </div>
          </div>


          {/* Atmospheric Layer */}
          {styles.showDecorations && (
            <div className="absolute inset-0 rounded-[56px] pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_40%)]" />
            </div>
          )}

          {/* Premium Shimmer Effect on Hover */}
          <div className={`
            absolute inset-0 rounded-[56px] pointer-events-none overflow-hidden
            ${isHovered ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-700
          `}>
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-out bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>

        <style>{`
          @keyframes float-pro {
            0%, 100% { transform: scale(1) rotateY(${styles.deviceTilt || 0}deg) rotateX(${styles.deviceRotation || 0}deg); }
            50% { transform: scale(1.02) rotateY(${(styles.deviceTilt || 0) + 1}deg) rotateX(${(styles.deviceRotation || 0) - 0.5}deg); }
          }
          .animate-float {
            animation: float-pro 12s ease-in-out infinite;
          }
        `}</style>
      </div>

      <InlineTextEditor
        styles={editingText === 'title' ? titleStyles : subtitleStyles}
        onChange={editingText === 'title' ? handleTitleStylesChange : handleSubtitleStylesChange}
        label={editingText === 'title' ? 'Edit Title' : 'Edit Subtitle'}
        isOpen={editingText !== null}
        onClose={() => setEditingText(null)}
      />
    </div>
  );
};
