import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { DeviceFrame } from './components/DeviceFrame';
import { ToastContainer, useToast } from './components/Toast';
import { KeyboardShortcuts, useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { ZoomControls } from './components/ZoomControls';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ExportSizeModal, ExportPreset } from './components/ExportSizeModal';
import { useHistory } from './hooks/useHistory';
import { AppStyles, DeviceType, ScreenshotSet, Template } from './types';
import { INITIAL_SCREENSHOTS, DEVICES, Icons, DEFAULT_TITLE_STYLES, DEFAULT_SUBTITLE_STYLES } from './constants';
import { analyzeScreenshot, generateAIBackground } from './services/geminiService';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/Auth/AuthPage';
import { UserMenu } from './components/Auth/UserMenu';
import { useAuth } from './contexts/AuthContext';

const INITIAL_STYLES: AppStyles = {
  primaryColor: '#00FF88',
  secondaryColor: '#0066CC',
  fontFamily: 'Inter',
  backgroundType: 'gradient',
  gradientAngle: 135,
  cornerRadius: 56,
  deviceTilt: 0,
  deviceRotation: 0,
  deviceScale: 1,
  deviceVerticalPosition: 0,
  deviceHorizontalPosition: 0,
  frameRotation: 0,
  showShadows: true,
  textAlign: 'center',
  deviceColor: 'black',
  showHeatmap: false,
  fontSize: 'base',
  showDecorations: true,
  shadowIntensity: 'heavy',
  layoutDensity: 'airy',
  showDevice: true,
  noiseOpacity: 0.05,
  glassBlur: 20,
  reflectionOpacity: 0.3,
  backgroundPattern: 'none',
  frameGap: 80,
  interactiveTilt: true,
  showFloatingShapes: false,
  meshAnimationSpeed: 50
};

const App: React.FC = () => {
  // History-enabled state for undo/redo
  const {
    state: screenshots,
    set: setScreenshots,
    undo: undoScreenshots,
    redo: redoScreenshots,
    canUndo,
    canRedo,
  } = useHistory<ScreenshotSet[]>([]);

  const [styles, setStyles] = useState<AppStyles>(INITIAL_STYLES);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('iphone16pro');
  const [activeLocale, setActiveLocale] = useState('en');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportPhase, setExportPhase] = useState<'capturing' | 'packaging'>('capturing');
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });

  // New state for enhanced UX
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; title: string }>({
    isOpen: false,
    id: null,
    title: '',
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Supabase Auth
  const { user, loading: authLoading, signOut } = useAuth();

  // Toast notifications
  const { toasts, toast, removeToast } = useToast();

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

  // Screenshot operations
  const handleUpdateScreenshot = useCallback((id: string, data: Partial<ScreenshotSet>) => {
    setScreenshots(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, [setScreenshots]);

  const handleFileUpload = useCallback(async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateScreenshot(id, { image: reader.result as string });
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  }, [handleUpdateScreenshot, toast]);

  const addScreen = useCallback(() => {
    const newId = Date.now().toString();
    setScreenshots(prev => [...prev, {
      id: newId,
      title: 'Power Feature',
      subtitle: 'Enhanced productivity at your fingertips.',
      image: null,
      titleStyles: { ...DEFAULT_TITLE_STYLES },
      subtitleStyles: { ...DEFAULT_SUBTITLE_STYLES },
    }]);
    setSelectedFrameId(newId);
    toast.success('New frame added!');
  }, [setScreenshots, toast]);

  const duplicateScreen = useCallback((id: string) => {
    const original = screenshots.find(s => s.id === id);
    if (original) {
      const newId = Date.now().toString();
      const index = screenshots.findIndex(s => s.id === id);
      const newScreenshots = [...screenshots];
      newScreenshots.splice(index + 1, 0, {
        ...original,
        id: newId,
        title: `${original.title} (Copy)`,
      });
      setScreenshots(newScreenshots);
      setSelectedFrameId(newId);
      toast.success('Frame duplicated!');
    }
  }, [screenshots, setScreenshots, toast]);

  const deleteScreen = useCallback((id: string) => {
    if (screenshots.length <= 1) {
      toast.warning('Cannot delete the last frame');
      return;
    }
    setScreenshots(prev => prev.filter(s => s.id !== id));
    setSelectedFrameId(null);
    toast.success('Frame deleted');
    setDeleteConfirm({ isOpen: false, id: null, title: '' });
  }, [screenshots.length, setScreenshots, toast]);

  const moveScreen = useCallback((id: string, direction: 'left' | 'right') => {
    const index = screenshots.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= screenshots.length) return;

    const newScreenshots = [...screenshots];
    [newScreenshots[index], newScreenshots[newIndex]] = [newScreenshots[newIndex], newScreenshots[index]];
    setScreenshots(newScreenshots);
  }, [screenshots, setScreenshots]);

  // Get selected frame info
  const selectedFrame = useMemo(() => {
    if (!selectedFrameId) return null;
    const index = screenshots.findIndex(s => s.id === selectedFrameId);
    return { index, screenshot: screenshots[index] };
  }, [selectedFrameId, screenshots]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: () => {
      undoScreenshots();
      toast.info('Undo');
    },
    onRedo: () => {
      redoScreenshots();
      toast.info('Redo');
    },
    onDuplicate: () => {
      if (selectedFrameId) {
        duplicateScreen(selectedFrameId);
      }
    },
    onDelete: () => {
      if (selectedFrameId && screenshots.length > 1) {
        const frame = screenshots.find(s => s.id === selectedFrameId);
        setDeleteConfirm({ isOpen: true, id: selectedFrameId, title: frame?.title || 'this frame' });
      }
    },
    onExport: handleExportBatch,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomReset: handleZoomReset,
    onToggleShortcuts: () => setShowShortcuts(prev => !prev),
    onMoveLeft: () => {
      if (selectedFrameId) moveScreen(selectedFrameId, 'left');
    },
    onMoveRight: () => {
      if (selectedFrameId) moveScreen(selectedFrameId, 'right');
    },
  });

  const applyTemplate = useCallback((template: Template) => {
    if (selectedFrameId) {
      setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? { ...s, styles: { ...s.styles, ...template.styles } } : s));
    } else {
      setStyles(prev => ({
        ...prev,
        ...template.styles,
        backgroundImage: undefined,
      }));
    }
    toast.success(`Applied "${template.name}" template ${selectedFrameId ? 'to selected frame' : 'globally'}`);
  }, [selectedFrameId, setScreenshots, toast]);

  // Open export modal instead of direct export
  function handleExportBatch() {
    setShowExportModal(true);
  }

  // Actual export function with size options
  async function executeExport(
    preset: ExportPreset | null,
    customWidth?: number,
    customHeight?: number,
    quality: 'standard' | 'high' | 'ultra' = 'high'
  ) {
    if (isExporting) return;
    setShowExportModal(false);
    setIsExporting(true);
    setExportPhase('capturing');
    setExportProgress({ current: 0, total: screenshots.length });

    // Determine target dimensions and device
    const targetWidth = preset ? preset.width : (customWidth || 1080);
    const targetHeight = preset ? preset.height : (customHeight || 1920);
    const targetDevice = preset?.deviceType as DeviceType || selectedDevice;
    const originalDevice = selectedDevice;

    // Temporarily switch device if needed
    if (targetDevice !== originalDevice) {
      setSelectedDevice(targetDevice);
      // Wait for re-render and style calculations
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Determine pixel ratio based on quality
    const getPixelRatio = () => {
      switch (quality) {
        case 'standard': return 2;
        case 'high': return 3;
        case 'ultra': return 4;
      }
    };

    const pixelRatio = getPixelRatio();
    const exportName = preset ? preset.name.replace(/\s+/g, '_') : 'Custom';

    const zip = new JSZip();
    const folder = zip.folder(`AppScreen_Assets_${exportName}_${quality.toUpperCase()}`);

    try {
      // 1. Capture Phase
      for (let i = 0; i < screenshots.length; i++) {
        setExportProgress({ current: i + 1, total: screenshots.length });
        const element = document.getElementById(`screenshot-frame-${screenshots[i].id}`);

        if (element) {
          // Extra wait to ensure all transitions/styles are settled
          await new Promise(resolve => setTimeout(resolve, 500));

          // Calculate scaling to fit target dimensions while maintaining aspect ratio or following user request
          const elementRect = element.getBoundingClientRect();
          const scaleX = targetWidth / elementRect.width;
          const scaleY = targetHeight / elementRect.height;

          // Use the target dimensions directly in the export
          const exportOptions: any = {
            width: targetWidth,
            height: targetHeight,
            style: {
              transform: `scale(${Math.max(scaleX, scaleY)})`,
              transformOrigin: 'top left',
            },
            pixelRatio: 1, // We control scaling ourselves for better precision
            cacheBust: true,
            quality: 1.0,
            skipFonts: false,
            filter: (node: any) => {
              if (node.classList && node.classList.contains('no-export')) {
                return false;
              }
              return true;
            },
          };

          const blob = await htmlToImage.toBlob(element, exportOptions);

          if (blob && folder) {
            const fileName = `0${i + 1}_${screenshots[i].title.toLowerCase().replace(/\s+/g, '_') || 'asset'}.png`;
            folder.file(fileName, blob);
          }
        }
      }

      // 2. Packaging Phase
      setExportPhase('packaging');
      const content = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `AppScreen_${exportName}_${quality.toUpperCase()}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success(`Exported ${screenshots.length} frames at ${targetWidth}×${targetHeight} (${quality.toUpperCase()})!`);
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      // Revert device if it was changed
      if (targetDevice !== originalDevice) {
        setSelectedDevice(originalDevice);
      }
      setIsExporting(false);
    }
  }

  const runAIAnalysis = async () => {
    const firstImage = screenshots.find(s => s.image !== null)?.image;
    if (!firstImage) {
      toast.warning("Please upload at least one UI screenshot first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeScreenshot(firstImage);

      setStyles(prev => ({
        ...prev,
        primaryColor: result.colors[0] || prev.primaryColor,
        secondaryColor: result.colors[1] || prev.secondaryColor,
      }));

      setScreenshots(prev => prev.map((s, idx) => {
        if (result.suggestedCaptions[idx]) {
          return {
            ...s,
            title: result.suggestedCaptions[idx].title,
            subtitle: result.suggestedCaptions[idx].subtitle
          };
        }
        return s;
      }));

      setIsGeneratingBg(true);
      const imageUrl = await generateAIBackground(result.scenePrompt);
      setStyles(prev => ({
        ...prev,
        backgroundImage: imageUrl,
        backgroundType: 'ai-generated'
      }));

      toast.success("AI Magic applied successfully!");
    } catch (error: any) {
      console.error("AI Magic Pipeline failed:", error);
      toast.error(`AI Error: ${error.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingBg(false);
    }
  };

  const handleGenerateAIBackground = async (prompt: string) => {
    setIsGeneratingBg(true);
    try {
      const imageUrl = await generateAIBackground(prompt);
      if (selectedFrameId) {
        setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? { ...s, styles: { ...s.styles, backgroundImage: imageUrl, backgroundType: 'ai-generated' } } : s));
      } else {
        setStyles(prev => ({
          ...prev,
          backgroundImage: imageUrl,
          backgroundType: 'ai-generated'
        }));
      }
      toast.success("Background generated!");
    } catch (error: any) {
      console.error("BG Gen failed:", error);
      toast.error(`Failed to generate: ${error.message}`);
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-obsidian items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
          <span className="text-white/40 text-sm font-medium tracking-wider">Loading...</span>
        </div>
      </div>
    );
  }

  // Show auth page if requested
  if (showAuthPage && !user) {
    return <AuthPage onSuccess={() => setShowAuthPage(false)} />;
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage onLogin={() => setShowAuthPage(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-obsidian text-slate-100 font-sans selection:bg-accent selection:text-obsidian overflow-hidden">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        onConfirm={() => deleteConfirm.id && deleteScreen(deleteConfirm.id)}
        title={deleteConfirm.title}
      />

      {/* Export Size Selection Modal */}
      <ExportSizeModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={executeExport}
        isExporting={isExporting}
      />

      {/* Neural & Export Processing Overlay */}
      {(isAnalyzing || isGeneratingBg || isExporting) && (
        <div className="fixed inset-0 z-[100] bg-obsidian/95 backdrop-blur-2xl flex flex-col items-center justify-center transition-all animate-in fade-in duration-500">
          <div className="relative mb-12">
            <div className="w-40 h-40 rounded-full border-2 border-white/5 border-t-accent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full animate-pulse blur-3xl" />
              <div className="text-accent font-black text-xl tracking-tighter italic">APPSCREEN</div>
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-[0.2em] text-accent animate-pulse uppercase text-center max-w-2xl px-8 leading-tight">
            {isExporting
              ? exportPhase === 'capturing'
                ? `Capturing High-Resolution Asset ${exportProgress.current}/${exportProgress.total}`
                : "Finalizing Ultra-4K Archive"
              : isAnalyzing
                ? "Decrypting Brand Identity"
                : "Architecting Neural Environment"
            }
          </h2>

          <div className="flex flex-col items-center mt-10">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.6em] mb-6">Pipeline Status: Operational</p>

            {(isExporting || isAnalyzing) && (
              <div className="w-80 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full bg-accent transition-all duration-700 shadow-[0_0_20px_#00FF88] ${exportPhase === 'packaging' ? 'animate-shimmer' : ''}`}
                  style={{
                    width: isExporting
                      ? exportPhase === 'capturing'
                        ? `${(exportProgress.current / exportProgress.total) * 100}%`
                        : '100%'
                      : '30%' // Static for analysis
                  }}
                />
              </div>
            )}

            {isExporting && exportPhase === 'packaging' && (
              <p className="mt-4 text-accent/60 text-[9px] font-black uppercase tracking-widest animate-pulse">Compressing assets for delivery...</p>
            )}
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        styles={selectedFrameId ? { ...styles, ...(screenshots.find(s => s.id === selectedFrameId)?.styles || {}) } : styles}
        setStyles={(newStyles) => {
          if (selectedFrameId) {
            // Only store the local styles that are actually passed in or modified
            // This allows the frame to still inherit other global styles
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              styles: { ...(s.styles || {}), ...newStyles }
            } : s));
          } else {
            setStyles(newStyles);
          }
        }}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        onAnalyze={runAIAnalysis}
        isAnalyzing={isAnalyzing}
        onApplyTemplate={applyTemplate}
        onGenerateAIBackground={handleGenerateAIBackground}
        isGeneratingBg={isGeneratingBg}
        onExportBatch={handleExportBatch}
        isExporting={isExporting}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undoScreenshots}
        onRedo={redoScreenshots}
        editingFrameId={selectedFrameId}
        selectedScreenshot={screenshots.find(s => s.id === selectedFrameId)}
        onResetFrameStyles={() => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? { ...s, styles: {} } : s));
            setSelectedFrameId(null); // Clear selection to show reset effect
            toast.info("Frame reset to global theme");
          }
        }}
        onAddSticker={(url) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              stickers: [...(s.stickers || []), {
                id: Math.random().toString(36).substr(2, 9),
                url,
                x: 50,
                y: 50,
                scale: 0.5,
                rotation: 0,
                opacity: 1
              }]
            } : s));
            toast.success("Design element added");
          } else {
            toast.info("Select a frame first");
          }
        }}
        onToggleDevice={(hide) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              hideDevice: hide
            } : s));
          }
        }}
        onAddFloatingImage={(url) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              floatingImages: [...(s.floatingImages || []), {
                id: Math.random().toString(36).substr(2, 9),
                url,
                x: 20,
                y: 30,
                width: 30,
                height: 30,
                rotation: 0,
                opacity: 1,
                zIndex: (s.floatingImages?.length || 0) + 1
              }]
            } : s));
            toast.success("Floating image added");
          }
        }}
        onAddFloatingText={() => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              floatingTexts: [...(s.floatingTexts || []), {
                id: Math.random().toString(36).substr(2, 9),
                content: 'New Text',
                x: 10,
                y: 50,
                fontSize: 24,
                fontFamily: 'Inter',
                fontWeight: 700,
                color: '#FFFFFF',
                rotation: 0,
                opacity: 1,
                textAlign: 'left',
                zIndex: (s.floatingTexts?.length || 0) + 1
              }]
            } : s));
            toast.success("Text element added");
          }
        }}
        onUpdateFloatingText={(textId, updates) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              floatingTexts: s.floatingTexts?.map(t => t.id === textId ? { ...t, ...updates } : t)
            } : s));
          }
        }}
        onRemoveFloatingText={(textId) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              floatingTexts: s.floatingTexts?.filter(t => t.id !== textId)
            } : s));
          }
        }}
        onRemoveFloatingImage={(imageId) => {
          if (selectedFrameId) {
            setScreenshots(prev => prev.map(s => s.id === selectedFrameId ? {
              ...s,
              floatingImages: s.floatingImages?.filter(img => img.id !== imageId)
            } : s));
          }
        }}
      />

      <main className="flex-1 overflow-hidden bg-[#050505] relative flex flex-col">
        {/* Top Navigation - Enhanced with Glassmorphism */}
        <div className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-obsidian/80 backdrop-blur-3xl z-40">
          <div className="flex items-center gap-4 md:gap-10">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-white/40 hover:text-accent md:hidden transition-colors"
            >
              {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
            </button>

            <div className="flex flex-col">
              <span className="hidden sm:block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-0.5">Automated Asset Pipeline</span>
              <span className="text-sm font-black flex items-center gap-2 tracking-tighter">
                BATCH_ENGINE_v5.0
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#00FF88]" />
              </span>
            </div>
            <div className="hidden md:block h-10 w-px bg-white/5" />

            {/* Locale Selector with Glassmorphism - Hidden on small mobile */}
            <div className="hidden sm:flex bg-white/5 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 shadow-inner">
              {['EN', 'DE', 'FR', 'JP'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLocale(lang.toLowerCase())}
                  className={`px-3 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all duration-300 ${activeLocale === lang.toLowerCase() ? 'bg-white/10 text-accent shadow-[0_0_15px_rgba(0,255,136,0.2)]' : 'text-white/20 hover:text-white/40'}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="hidden md:block h-10 w-px bg-white/5" />

            {/* Frame Count */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">Frames</span>
              <span className="text-sm font-black text-accent">{screenshots.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="hidden md:block">
              <ZoomControls
                zoom={zoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onZoomReset={handleZoomReset}
              />
            </div>

            {screenshots.length > 0 && (
              <button
                onClick={addScreen}
                className="px-4 md:px-8 py-2 md:py-3 bg-white/5 hover:bg-accent hover:text-obsidian rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-accent transition-all shadow-xl active:scale-95 flex items-center gap-2"
              >
                <Icons.Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Frame</span>
              </button>
            )}

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Panoramic Viewer or Empty State */}
        <div
          className="flex-1 p-12 overflow-x-auto scrollbar-hide flex items-center bg-[radial-gradient(circle_at_50%_0%,_rgba(0,255,136,0.03)_0%,_transparent_60%)] relative"
          onClick={() => setSelectedFrameId(null)}
        >
          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

          {screenshots.length > 0 ? (
            /* Centered Container with Transform */
            <div
              className="flex min-w-max m-auto items-center px-12 transition-transform duration-500 ease-out"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                gap: `${styles.frameGap}px`
              }}
            >
              {screenshots.map((s, index) => (
                <DeviceFrame
                  key={s.id}
                  index={index}
                  totalScreenshots={screenshots.length}
                  screenshot={s}
                  device={DEVICES.find(d => d.id === selectedDevice)!}
                  styles={styles}
                  onUpdate={(data) => handleUpdateScreenshot(s.id, data)}
                  onUpload={(e) => handleFileUpload(s.id, e)}
                  onDuplicate={() => duplicateScreen(s.id)}
                  onDelete={() => setDeleteConfirm({ isOpen: true, id: s.id, title: s.title })}
                  onMoveLeft={() => moveScreen(s.id, 'left')}
                  onMoveRight={() => moveScreen(s.id, 'right')}
                  canMoveLeft={index > 0}
                  canMoveRight={index < screenshots.length - 1}
                  isSelected={selectedFrameId === s.id}
                  onSelect={() => setSelectedFrameId(s.id)}
                  zoomLevel={1}
                  onUpdateSticker={(stickerId, updates) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      stickers: sc.stickers?.map(st => st.id === stickerId ? { ...st, ...updates } : st)
                    } : sc));
                  }}
                  onRemoveSticker={(stickerId) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      stickers: sc.stickers?.filter(st => st.id !== stickerId)
                    } : sc));
                  }}
                  onUpdateFloatingImage={(imageId, updates) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      floatingImages: sc.floatingImages?.map(img => img.id === imageId ? { ...img, ...updates } : img)
                    } : sc));
                  }}
                  onRemoveFloatingImage={(imageId) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      floatingImages: sc.floatingImages?.filter(img => img.id !== imageId)
                    } : sc));
                  }}
                  onUpdateFloatingText={(textId, updates) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      floatingTexts: sc.floatingTexts?.map(txt => txt.id === textId ? { ...txt, ...updates } : txt)
                    } : sc));
                  }}
                  onRemoveFloatingText={(textId) => {
                    setScreenshots(prev => prev.map(sc => sc.id === s.id ? {
                      ...sc,
                      floatingTexts: sc.floatingTexts?.filter(txt => txt.id !== textId)
                    } : sc));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="m-auto flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-1000">
              <div className="mb-8 relative group">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative backdrop-blur-3xl transition-all duration-500 group-hover:border-accent/50">
                  <Icons.Plus className="w-8 h-8 text-white/20 group-hover:text-accent transition-colors duration-500" />
                </div>
              </div>

              <h2 className="text-3xl font-bold tracking-tight mb-2 text-white/90">
                Start your design
              </h2>
              <p className="text-white/30 text-sm max-w-[280px] mx-auto mb-8 leading-relaxed">
                Add a frame to begin crafting your app screenshots.
              </p>

              <button
                onClick={addScreen}
                className="group px-8 py-3.5 bg-white text-obsidian rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Add First Frame
              </button>
            </div>
          )}
        </div>



        {/* Keyboard Shortcut Hint */}
        <button
          onClick={() => setShowShortcuts(true)}
          className="absolute bottom-12 right-8 z-40 w-10 h-10 rounded-full bg-obsidian-light/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/30 hover:text-accent hover:border-accent/50 transition-all"
          title="Keyboard Shortcuts (?)"
        >
          <span className="text-lg font-bold">?</span>
        </button>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite;
        }
        
        /* Custom scrollbar hide */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Range input styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00FF88;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00FF88;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
          border: none;
        }

        /* Color input styling */
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default App;
