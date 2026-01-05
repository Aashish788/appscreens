
import React from 'react';

interface QuickActionsProps {
    onDuplicate: () => void;
    onDelete: () => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
    canMoveLeft: boolean;
    canMoveRight: boolean;
    isVisible: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onDuplicate,
    onDelete,
    onMoveLeft,
    onMoveRight,
    canMoveLeft,
    canMoveRight,
    isVisible,
}) => {
    return (
        <div
            className={`
        absolute -top-16 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2 px-3 py-2
        bg-obsidian-light/95 backdrop-blur-2xl
        border border-white/10 rounded-2xl
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
      `}
        >
            {/* Move Left */}
            <button
                onClick={onMoveLeft}
                disabled={!canMoveLeft}
                className="group p-2.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move Left (←)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Move Right */}
            <button
                onClick={onMoveRight}
                disabled={!canMoveRight}
                className="group p-2.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move Right (→)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="w-px h-6 bg-white/10" />

            {/* Duplicate */}
            <button
                onClick={onDuplicate}
                className="group p-2.5 rounded-xl hover:bg-accent/20 transition-all"
                title="Duplicate (Ctrl+D)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>

            {/* Delete */}
            <button
                onClick={onDelete}
                className="group p-2.5 rounded-xl hover:bg-red-500/20 transition-all"
                title="Delete (Del)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};
