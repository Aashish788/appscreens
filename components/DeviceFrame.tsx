
import React, { useState } from 'react';
import { DeviceMetadata, AppStyles, ScreenshotSet, TextStyles, Sticker } from '../types';
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
    onUpdateSticker: (id: string, updates: Partial<Sticker>) => void;
    onRemoveSticker: (id: string) => void;
    // Canvas element handlers
    onUpdateFloatingImage?: (id: string, updates: any) => void;
    onRemoveFloatingImage?: (id: string) => void;
    onUpdateFloatingText?: (id: string, updates: any) => void;
    onRemoveFloatingText?: (id: string) => void;
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
    onUpdateSticker,
    onRemoveSticker,
    onUpdateFloatingImage,
    onRemoveFloatingImage,
    onUpdateFloatingText,
    onRemoveFloatingText,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [editingText, setEditingText] = useState<'title' | 'subtitle' | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dragItem, setDragItem] = useState<{ id: string, type: 'sticker', startX: number, startY: number } | null>(null);

    // Merge global styles with frame-specific styles
    const frameStyles = { ...styles, ...screenshot.styles };

    // Ensure styles exist with defaults
    const titleStyles = screenshot.titleStyles || DEFAULT_TITLE_STYLES;
    const subtitleStyles = screenshot.subtitleStyles || DEFAULT_SUBTITLE_STYLES;

    const isLight = frameStyles.primaryColor === '#FFFFFF' || frameStyles.primaryColor === '#FDFCF0' || frameStyles.primaryColor === '#F2F2F7' || frameStyles.primaryColor === '#F5F5F5' || frameStyles.primaryColor === '#81D8D0';

    const getBackgroundStyle = () => {
        let baseStyle: React.CSSProperties = {};

        if (frameStyles.backgroundImage) {
            const frameWidth = frameDimensions.width;
            const gap = 64;
            const totalWidth = (totalScreenshots * frameWidth) + ((totalScreenshots - 1) * gap);
            const scaleFactor = totalWidth / frameWidth;
            const xOffset = index * (frameWidth + gap);
            const percentagePosition = totalScreenshots > 1
                ? (xOffset / (totalWidth - frameWidth)) * 100
                : 50;

            baseStyle = {
                backgroundImage: `url(${frameStyles.backgroundImage})`,
                backgroundSize: `${scaleFactor * 100}% 100%`,
                backgroundPosition: `${percentagePosition}% center`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#050505'
            };
        } else {
            switch (frameStyles.backgroundType) {
                case 'solid': baseStyle = { backgroundColor: frameStyles.primaryColor }; break;
                case 'gradient': baseStyle = { background: `linear-gradient(${frameStyles.gradientAngle || 135}deg, ${frameStyles.primaryColor}, ${frameStyles.secondaryColor})` }; break;
                case 'mesh': baseStyle = {
                    backgroundImage: `radial-gradient(at 0% 0%, ${frameStyles.primaryColor}ee 0px, transparent 60%), 
                              radial-gradient(at 100% 0%, ${frameStyles.secondaryColor}aa 0px, transparent 60%),
                              radial-gradient(at 50% 100%, ${frameStyles.primaryColor}cc 0px, transparent 70%)`,
                    backgroundColor: '#050505'
                }; break;
                case 'spotlight': baseStyle = { background: `radial-gradient(circle at 50% 140%, ${frameStyles.primaryColor}88 0%, transparent 80%), #050505` }; break;
                case 'glass': baseStyle = {
                    background: `linear-gradient(135deg, ${frameStyles.primaryColor}44, ${frameStyles.secondaryColor}22)`,
                    backgroundColor: '#050505'
                }; break;
                default: baseStyle = { backgroundColor: frameStyles.primaryColor };
            }
        }

        // Apply Glass Blur overlay if backgroundType is glass
        if (frameStyles.backgroundType === 'glass') {
            return {
                ...baseStyle,
                backdropFilter: `blur(${frameStyles.glassBlur}px)`,
                border: '1px solid rgba(255,255,255,0.08)'
            };
        }

        return baseStyle;
    };

    const getFrameDimensions = () => {
        const height = 720;
        const ratio = device.width / device.height;
        return {
            height,
            width: height * ratio
        };
    };

    const frameDimensions = getFrameDimensions();

    // Calculate device dimensions based on device profile
    const getDeviceDimensions = () => {
        switch (device.id) {
            case 'iphone16pro':
                return { width: 200, height: 420, borderRadius: 44, borderWidth: 8, notchWidth: 80, notchHeight: 20, notchTop: 8 };
            case 'iphone16promax':
                return { width: 210, height: 450, borderRadius: 48, borderWidth: 8, notchWidth: 90, notchHeight: 24, notchTop: 8 };
            case 'ipadpro':
                return { width: 280, height: 380, borderRadius: 24, borderWidth: 10, notchWidth: 0, notchHeight: 0, notchTop: 0 }; // No notch for iPad
            case 'pixel9pro':
                return { width: 195, height: 420, borderRadius: 36, borderWidth: 6, notchWidth: 24, notchHeight: 24, notchTop: 10 }; // Punch-hole style
            default:
                return { width: 200, height: 420, borderRadius: 44, borderWidth: 8, notchWidth: 80, notchHeight: 20, notchTop: 8 };
        }
    };

    const deviceDimensions = getDeviceDimensions();

    const getDeviceColor = () => {
        switch (frameStyles.deviceColor) {
            case 'titanium': return 'border-[#1a1a1b] bg-[#0c0c0d] shadow-zinc-500/10';
            case 'black': return 'border-black bg-black shadow-black/80';
            case 'silver': return 'border-[#d1d1d6] bg-[#fdfdfd] shadow-slate-300/10';
            case 'gold': return 'border-[#d4af37]/50 bg-[#faf9f6] shadow-amber-300/5';
            default: return 'border-zinc-800 bg-black';
        }
    };

    const getShadowStyle = () => {
        switch (frameStyles.shadowIntensity) {
            case 'soft': return 'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)]';
            case 'heavy': return 'shadow-[0_120px_250px_-40px_rgba(0,0,0,0.75)]';
            case 'grounded': return 'shadow-[0_20px_60px_rgba(0,0,0,0.5)]';
            case 'floating': return 'shadow-[0_160px_280px_-60px_rgba(0,0,0,0.95)] animate-float';
            case 'none': return 'shadow-none';
            default: return 'shadow-2xl';
        }
    };

    const transformStyle = {
        transform: frameStyles.interactiveTilt && isHovered
            ? `translateX(${(frameStyles.deviceHorizontalPosition || 0) * 2}px) translateY(${(frameStyles.deviceVerticalPosition || 0) * -2}px) rotateZ(${frameStyles.frameRotation || 0}deg) rotateY(${(frameStyles.deviceTilt || 0) + (mousePos.x * 25)}deg) rotateX(${(frameStyles.deviceRotation || 0) - (mousePos.y * 25)}deg) scale(${frameStyles.deviceScale || 1})`
            : `translateX(${(frameStyles.deviceHorizontalPosition || 0) * 2}px) translateY(${(frameStyles.deviceVerticalPosition || 0) * -2}px) rotateZ(${frameStyles.frameRotation || 0}deg) rotateY(${frameStyles.deviceTilt || 0}deg) rotateX(${frameStyles.deviceRotation || 0}deg) scale(${frameStyles.deviceScale || 1})`,
        transition: isHovered ? 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d' as const,
        filter: (frameStyles.interactiveTilt && isHovered) ? `drop-shadow(${mousePos.x * -20}px ${mousePos.y * 20}px 30px rgba(0,0,0,0.5))` : 'none'
    };

    const getTextAlignClass = () => {
        switch (frameStyles.textAlign) {
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
          pt-16 -mt-16
        `}
                id={`screenshot-frame-${screenshot.id}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (editingText) {
                        setEditingText(null);
                    }
                    onSelect();
                }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPos = ((e.clientX - rect.left) / rect.width) - 0.5;
                    const yPos = ((e.clientY - rect.top) / rect.height) - 0.5;
                    setMousePos({ x: xPos, y: yPos });

                    if (dragItem?.type === 'sticker') {
                        const stickerX = ((e.clientX - rect.left) / rect.width) * 100;
                        const stickerY = ((e.clientY - rect.top) / rect.height) * 100;
                        onUpdateSticker(dragItem.id, { x: stickerX, y: stickerY });
                    }
                }}
                onMouseUp={() => setDragItem(null)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setMousePos({ x: 0, y: 0 });
                    setDragItem(null);
                }}
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
          no-export
          ${isSelected ? 'bg-accent text-obsidian border-accent' : ''}
        `}>
                    {index + 1}
                </div>

                {/* Selection Ring */}
                <div className={`
          absolute -inset-3 pointer-events-none
          transition-all duration-500 ease-out no-export
          ${isSelected
                        ? 'opacity-100 ring-2 ring-accent ring-offset-4 ring-offset-obsidian shadow-[0_0_60px_rgba(0,255,136,0.2)]'
                        : 'opacity-0'
                    }
        `} style={{ borderRadius: `${(frameStyles.cornerRadius || 0) + 20}px` }} />

                <div
                    className={`
            flex flex-col relative overflow-hidden
            shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] 
            transition-all duration-1000 
            ${isHovered || isSelected ? 'ring-1 ring-white/20' : ''}
            ${isDragging ? 'ring-2 ring-accent ring-offset-4 ring-offset-obsidian' : ''}
            ${frameStyles.borderAccent ? 'border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.03),inset_0_0_60px_rgba(255,255,255,0.08)]' : ''}
            ${frameStyles.backgroundType === 'mesh' ? 'animate-mesh' : ''}
          `}
                    style={{
                        ...getBackgroundStyle(),
                        width: `${frameDimensions.width}px`,
                        height: `${frameDimensions.height}px`,
                        borderRadius: `${frameStyles.cornerRadius}px`,
                        ['--mesh-speed' as any]: `${(110 - (frameStyles.meshAnimationSpeed || 50)) / 2}s`,
                        ['--tilt-x' as any]: `${mousePos.x * 15}px`,
                        ['--tilt-y' as any]: `${mousePos.y * 15}px`
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" style={{ borderRadius: `${frameStyles.cornerRadius}px` }} />

                    {/* Background Pattern Layer */}
                    {frameStyles.backgroundPattern !== 'none' && (
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.07]"
                            style={{
                                borderRadius: `${frameStyles.cornerRadius}px`,
                                backgroundImage:
                                    frameStyles.backgroundPattern === 'grid' ? 'radial-gradient(circle, white 1px, transparent 1px)' :
                                        frameStyles.backgroundPattern === 'dots' ? 'radial-gradient(white 1px, transparent 0px)' :
                                            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                    )}

                    {/* Floating Premium Shapes (Reactive Glass) */}
                    {frameStyles.showFloatingShapes && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden perspective-1000" style={{ borderRadius: `${frameStyles.cornerRadius}px` }}>
                            <div
                                className="absolute w-48 h-48 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl animate-float-slow transition-transform duration-500 ease-out"
                                style={{
                                    top: '15%', left: '5%',
                                    transform: `translate3d(${mousePos.x * 60}px, ${mousePos.y * 60}px, 50px)`
                                }}
                            />
                            <div
                                className="absolute w-64 h-64 rounded-full bg-accent/5 border border-accent/10 backdrop-blur-3xl animate-float-delayed transition-transform duration-700 ease-out"
                                style={{
                                    bottom: '10%', right: '-5%',
                                    transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, -50px)`
                                }}
                            />
                            <div
                                className="absolute w-32 h-32 rounded-full bg-white/5 border border-white/5 backdrop-blur-xl animate-float-slow transition-transform duration-1000 ease-out"
                                style={{
                                    top: '50%', right: '15%',
                                    transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 100px)`
                                }}
                            />
                        </div>
                    )}

                    {/* Film Grain/Noise Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                        style={{
                            borderRadius: `${frameStyles.cornerRadius}px`,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            opacity: frameStyles.noiseOpacity
                        }}
                    />

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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                }}
                                className="bg-transparent border-none w-full focus:outline-none focus:bg-white/5 rounded-lg px-2 py-1 transition-all uppercase"
                                placeholder="Your Headline"
                                style={{
                                    color: titleStyles.color,
                                    fontSize: `${titleStyles.fontSize}px`,
                                    fontFamily: titleStyles.fontFamily === 'Inter, sans-serif' ? (frameStyles.fontFamily || titleStyles.fontFamily) : titleStyles.fontFamily,
                                    fontWeight: titleStyles.fontWeight,
                                    letterSpacing: `${titleStyles.letterSpacing}px`,
                                    lineHeight: titleStyles.lineHeight,
                                    textShadow: titleStyles.textShadow ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
                                    textAlign: frameStyles.textAlign || 'center',
                                }}
                            />
                            {/* Edit Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                    setEditingText(editingText === 'title' ? null : 'title');
                                }}
                                className={`
                  absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl 
                  backdrop-blur-xl border transition-all shadow-lg no-export
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                }}
                                className="bg-transparent border-none w-full focus:outline-none focus:bg-white/5 rounded-lg px-2 py-1 resize-none overflow-hidden transition-all"
                                placeholder="Your description here..."
                                rows={2}
                                style={{
                                    color: subtitleStyles.color,
                                    fontSize: `${subtitleStyles.fontSize}px`,
                                    fontFamily: subtitleStyles.fontFamily === 'Inter, sans-serif' ? (frameStyles.fontFamily || subtitleStyles.fontFamily) : subtitleStyles.fontFamily,
                                    fontWeight: subtitleStyles.fontWeight,
                                    letterSpacing: `${subtitleStyles.letterSpacing}px`,
                                    lineHeight: subtitleStyles.lineHeight,
                                    textShadow: subtitleStyles.textShadow ? '0 2px 10px rgba(0,0,0,0.4)' : 'none',
                                    textAlign: frameStyles.textAlign || 'center',
                                }}
                            />
                            {/* Edit Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                    setEditingText(editingText === 'subtitle' ? null : 'subtitle');
                                }}
                                className={`
                  absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl 
                  backdrop-blur-xl border transition-all shadow-lg no-export
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

                    {/* Device Wrapper - Only render if not hidden */}
                    {!screenshot.hideDevice && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                            <div style={transformStyle} className="relative flex justify-center">
                                {/* Professional Rim Highlight matching brand color */}
                                {frameStyles.showDevice && (
                                    <div
                                        className="absolute inset-x-0 bottom-[-100px] h-[10px] pointer-events-none opacity-40 blur-2xl"
                                        style={{ background: `radial-gradient(circle at 50% 100%, ${frameStyles.primaryColor}, transparent 70%)` }}
                                    />
                                )}

                                <div
                                    className={`
                  relative overflow-hidden transition-all duration-1000 
                  ${frameStyles.showDevice
                                            ? `${getDeviceColor()} ${getShadowStyle()}`
                                            : `bg-obsidian-light/20 ${getShadowStyle()}`
                                        }
                `}
                                    style={frameStyles.showDevice
                                        ? {
                                            width: `${deviceDimensions.width}px`,
                                            height: `${deviceDimensions.height}px`,
                                            borderRadius: `${deviceDimensions.borderRadius}px`,
                                            borderWidth: `${deviceDimensions.borderWidth}px`,
                                            borderStyle: 'solid'
                                        }
                                        : {
                                            width: `${deviceDimensions.width - 15}px`,
                                            height: `${deviceDimensions.height - 20}px`,
                                            borderRadius: '24px'
                                        }
                                    }
                                >
                                    {screenshot.image ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={screenshot.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Premium Device Reflection */}
                                            <div
                                                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                                                style={{ opacity: frameStyles.reflectionOpacity }}
                                            />

                                            {/* Subtle shine overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                            {/* Remove Image Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdate({ image: null });
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-obsidian/80 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/80 hover:scale-110 no-export"
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelect();
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                    {/* Island Notch / Camera Cutout - Dynamic based on device */}
                                    {frameStyles.showDevice && deviceDimensions.notchWidth > 0 && (
                                        device.id === 'pixel9pro' ? (
                                            // Pixel punch-hole camera
                                            <div
                                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20 border border-white/5 shadow-inner"
                                                style={{
                                                    top: `${deviceDimensions.notchTop}px`,
                                                    width: `${deviceDimensions.notchWidth}px`,
                                                    height: `${deviceDimensions.notchHeight}px`
                                                }}
                                            />
                                        ) : (
                                            // iPhone Dynamic Island style notch
                                            <div
                                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20 border border-white/5 shadow-inner"
                                                style={{
                                                    top: `${deviceDimensions.notchTop}px`,
                                                    width: `${deviceDimensions.notchWidth}px`,
                                                    height: `${deviceDimensions.notchHeight}px`
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sticker Layer */}
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        {screenshot.stickers?.map((sticker) => (
                            <div
                                key={sticker.id}
                                className="absolute cursor-move pointer-events-auto group/sticker"
                                style={{
                                    left: `${sticker.x}%`,
                                    top: `${sticker.y}%`,
                                    transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                                    opacity: sticker.opacity,
                                    transition: dragItem?.id === sticker.id ? 'none' : 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setDragItem({ id: sticker.id, type: 'sticker', startX: e.clientX, startY: e.clientY });
                                }}
                            >
                                <div className="relative">
                                    <img src={sticker.url} alt="sticker" className="max-w-[150px] max-h-[150px] object-contain drop-shadow-2xl" />

                                    {/* Sticker Controls Overlay */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/sticker:opacity-100 transition-all flex items-center gap-1 bg-obsidian/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl shadow-2xl no-export">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { scale: sticker.scale * 1.2 }); }}
                                            className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                            title="Scale Up"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { scale: sticker.scale * 0.8 }); }}
                                            className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                            title="Scale Down"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { rotation: sticker.rotation + 15 }); }}
                                            className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                            title="Rotate"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        </button>
                                        <div className="w-px h-3 bg-white/10 mx-1" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemoveSticker(sticker.id); }}
                                            className="p-1 hover:bg-red-500/20 rounded-md text-white/60 hover:text-red-400"
                                            title="Delete"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>

                                    {/* Visual Selection Ring */}
                                    <div className="absolute -inset-2 border border-accent/0 group-hover/sticker:border-accent/40 rounded-lg pointer-events-none transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating Images Layer */}
                    <div className="absolute inset-0 z-25 pointer-events-none">
                        {screenshot.floatingImages?.map((img) => (
                            <div
                                key={img.id}
                                className="absolute cursor-move pointer-events-auto group/floatimg"
                                style={{
                                    left: `${img.x}%`,
                                    top: `${img.y}%`,
                                    width: `${img.width}%`,
                                    height: `${img.height}%`,
                                    transform: `rotate(${img.rotation}deg)`,
                                    opacity: img.opacity,
                                    zIndex: img.zIndex + 20,
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const deltaX = (moveEvent.clientX - startX) / 5;
                                        const deltaY = (moveEvent.clientY - startY) / 5;
                                        onUpdateFloatingImage?.(img.id, {
                                            x: Math.max(0, Math.min(100, img.x + deltaX)),
                                            y: Math.max(0, Math.min(100, img.y + deltaY))
                                        });
                                    };
                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            >
                                <img src={img.url} alt="floating" className="w-full h-full object-contain drop-shadow-2xl" />

                                {/* Floating Image Controls */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/floatimg:opacity-100 transition-all flex items-center gap-1 bg-obsidian/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl shadow-2xl no-export">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingImage?.(img.id, { width: img.width * 1.2, height: img.height * 1.2 }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Scale Up"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingImage?.(img.id, { width: img.width * 0.8, height: img.height * 0.8 }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Scale Down"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingImage?.(img.id, { rotation: (img.rotation || 0) + 15 }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Rotate"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </button>
                                    <div className="w-px h-3 bg-white/10 mx-1" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveFloatingImage?.(img.id); }}
                                        className="p-1 hover:bg-red-500/20 rounded-md text-white/60 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                {/* Selection ring */}
                                <div className="absolute -inset-2 border-2 border-dashed border-accent/0 group-hover/floatimg:border-accent/50 rounded-lg pointer-events-none transition-all" />
                            </div>
                        ))}
                    </div>

                    {/* Floating Text Layer */}
                    <div className="absolute inset-0 z-35 pointer-events-none">
                        {screenshot.floatingTexts?.map((txt) => (
                            <div
                                key={txt.id}
                                className="absolute cursor-move pointer-events-auto group/floattxt"
                                style={{
                                    left: `${txt.x}%`,
                                    top: `${txt.y}%`,
                                    transform: `rotate(${txt.rotation}deg)`,
                                    opacity: txt.opacity,
                                    zIndex: txt.zIndex + 30,
                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const deltaX = (moveEvent.clientX - startX) / 5;
                                        const deltaY = (moveEvent.clientY - startY) / 5;
                                        onUpdateFloatingText?.(txt.id, {
                                            x: Math.max(0, Math.min(100, txt.x + deltaX)),
                                            y: Math.max(0, Math.min(100, txt.y + deltaY))
                                        });
                                    };
                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: `${txt.fontSize}px`,
                                        fontFamily: txt.fontFamily,
                                        fontWeight: txt.fontWeight,
                                        color: txt.color,
                                        textAlign: txt.textAlign,
                                        whiteSpace: 'nowrap',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                    }}
                                    className="select-none"
                                >
                                    {txt.content}
                                </div>

                                {/* Floating Text Controls */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/floattxt:opacity-100 transition-all flex items-center gap-1 bg-obsidian/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl shadow-2xl no-export">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingText?.(txt.id, { fontSize: txt.fontSize + 4 }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Increase Size"
                                    >
                                        <span className="text-[10px] font-black">A+</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingText?.(txt.id, { fontSize: Math.max(8, txt.fontSize - 4) }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Decrease Size"
                                    >
                                        <span className="text-[10px] font-black">A-</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onUpdateFloatingText?.(txt.id, { rotation: (txt.rotation || 0) + 15 }); }}
                                        className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white"
                                        title="Rotate"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </button>
                                    <div className="w-px h-3 bg-white/10 mx-1" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveFloatingText?.(txt.id); }}
                                        className="p-1 hover:bg-red-500/20 rounded-md text-white/60 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                {/* Selection ring */}
                                <div className="absolute -inset-2 border-2 border-dashed border-accent/0 group-hover/floattxt:border-blue-400/50 rounded-lg pointer-events-none transition-all" />
                            </div>
                        ))}
                    </div>

                    {/* Atmospheric Layer */}
                    {frameStyles.showDecorations && (
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
            0%, 100% { transform: scale(1) rotateY(${frameStyles.deviceTilt || 0}deg) rotateX(${frameStyles.deviceRotation || 0}deg); }
            50% { transform: scale(1.02) rotateY(${(frameStyles.deviceTilt || 0) + 1}deg) rotateX(${(frameStyles.deviceRotation || 0) - 0.5}deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(10px, -20px); }
          }
          @keyframes mesh-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float {
            animation: float-pro 12s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-slow 10s ease-in-out infinite reverse;
            animation-delay: -2s;
          }
          .animate-mesh {
            background-size: 400% 400% !important;
            animation: mesh-flow var(--mesh-speed) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
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
        </div >
    );
};
