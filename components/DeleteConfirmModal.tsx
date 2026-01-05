
import React from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'this frame',
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-obsidian-light/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] animate-in zoom-in-95 fade-in duration-200">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-black text-white mb-2">Delete Frame?</h2>
                    <p className="text-sm text-white/50 font-medium">
                        Are you sure you want to delete <span className="text-white/70">{title}</span>? This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white/70 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-4 px-6 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl text-sm font-bold text-red-400 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
