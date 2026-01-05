
import React from 'react';

interface ZoomControlsProps {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    minZoom?: number;
    maxZoom?: number;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
    zoom,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    minZoom = 0.5,
    maxZoom = 2,
}) => {
    const zoomPercentage = Math.round(zoom * 100);

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-obsidian-light/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            {/* Zoom Out */}
            <button
                onClick={onZoomOut}
                disabled={zoom <= minZoom}
                className="group p-2 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out (Ctrl+-)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>

            {/* Zoom Percentage */}
            <button
                onClick={onZoomReset}
                className="min-w-[60px] px-3 py-1.5 text-xs font-bold text-white/70 hover:text-accent hover:bg-white/5 rounded-lg transition-all"
                title="Reset Zoom (Ctrl+0)"
            >
                {zoomPercentage}%
            </button>

            {/* Zoom In */}
            <button
                onClick={onZoomIn}
                disabled={zoom >= maxZoom}
                className="group p-2 rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In (Ctrl++)"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Fit to View */}
            <button
                onClick={onZoomReset}
                className="group p-2 rounded-xl hover:bg-white/10 transition-all"
                title="Fit to View"
            >
                <svg className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            </button>
        </div>
    );
};
