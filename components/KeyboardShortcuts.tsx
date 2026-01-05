
import React, { useState } from 'react';

interface ShortcutItem {
    keys: string[];
    description: string;
}

const shortcuts: ShortcutItem[] = [
    { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
    { keys: ['Ctrl', 'Y'], description: 'Redo action' },
    { keys: ['Ctrl', 'D'], description: 'Duplicate selected frame' },
    { keys: ['Delete'], description: 'Delete selected frame' },
    { keys: ['←', '→'], description: 'Move frame left/right' },
    { keys: ['Ctrl', 'E'], description: 'Export all frames' },
    { keys: ['Ctrl', '+'], description: 'Zoom in' },
    { keys: ['Ctrl', '-'], description: 'Zoom out' },
    { keys: ['Ctrl', '0'], description: 'Reset zoom' },
    { keys: ['?'], description: 'Toggle shortcuts panel' },
];

interface KeyboardShortcutsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-obsidian-light/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tight">Keyboard Shortcuts</h2>
                            <p className="text-xs text-white/40 font-bold">Power user commands</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Shortcuts List */}
                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <span className="text-sm text-white/70 font-medium">{shortcut.description}</span>
                            <div className="flex items-center gap-1.5">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <React.Fragment key={keyIndex}>
                                        <kbd className="px-3 py-1.5 bg-obsidian border border-white/20 rounded-lg text-xs font-mono font-bold text-white/80 shadow-[0_2px_0_rgba(255,255,255,0.1)]">
                                            {key}
                                        </kbd>
                                        {keyIndex < shortcut.keys.length - 1 && (
                                            <span className="text-white/20 text-xs">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-white/30 font-bold">
                        Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-accent font-mono">?</kbd> anytime to toggle this panel
                    </p>
                </div>
            </div>
        </div>
    );
};

// Hook for keyboard shortcut handling
export const useKeyboardShortcuts = (handlers: {
    onUndo?: () => void;
    onRedo?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onExport?: () => void;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onZoomReset?: () => void;
    onToggleShortcuts?: () => void;
    onMoveLeft?: () => void;
    onMoveRight?: () => void;
}) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
                return;
            }

            // Undo: Ctrl+Z
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handlers.onUndo?.();
            }

            // Redo: Ctrl+Y or Ctrl+Shift+Z
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                handlers.onRedo?.();
            }

            // Duplicate: Ctrl+D
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                handlers.onDuplicate?.();
            }

            // Delete: Delete or Backspace
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                handlers.onDelete?.();
            }

            // Export: Ctrl+E
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                handlers.onExport?.();
            }

            // Zoom In: Ctrl++
            if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                handlers.onZoomIn?.();
            }

            // Zoom Out: Ctrl+-
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                handlers.onZoomOut?.();
            }

            // Reset Zoom: Ctrl+0
            if (e.ctrlKey && e.key === '0') {
                e.preventDefault();
                handlers.onZoomReset?.();
            }

            // Toggle Shortcuts: ?
            if (e.key === '?') {
                e.preventDefault();
                handlers.onToggleShortcuts?.();
            }

            // Move Left: ArrowLeft
            if (e.key === 'ArrowLeft' && !e.ctrlKey) {
                e.preventDefault();
                handlers.onMoveLeft?.();
            }

            // Move Right: ArrowRight
            if (e.key === 'ArrowRight' && !e.ctrlKey) {
                e.preventDefault();
                handlers.onMoveRight?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};
