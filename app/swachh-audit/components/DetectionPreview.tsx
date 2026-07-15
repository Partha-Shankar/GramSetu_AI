'use client';

import React, { useState } from 'react';
import { DetectionResult } from '../types/types';
import { cn } from '@/utils/cn';

interface DetectionPreviewProps {
  imageSrc: string;
  detections: DetectionResult[];
  highlightedId?: string | null;
  onHoverDetection?: (id: string | null) => void;
}

const CATEGORY_COLORS = {
  dry: {
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'bg-blue-600 text-white',
    ring: 'focus:ring-blue-400',
    colorHex: '#3b82f6',
  },
  wet: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'bg-emerald-600 text-white',
    ring: 'focus:ring-emerald-400',
    colorHex: '#10b981',
  },
  hazardous: {
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    text: 'bg-amber-600 text-white',
    ring: 'focus:ring-amber-400',
    colorHex: '#f59e0b',
  },
  sanitation: {
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'bg-purple-600 text-white',
    ring: 'focus:ring-purple-400',
    colorHex: '#8b5cf6',
  },
};

const CATEGORY_NAMES = {
  dry: 'Dry Waste',
  wet: 'Wet Waste',
  hazardous: 'Hazardous/E-Waste',
  sanitation: 'Sanitation Issue',
};

export function DetectionPreview({
  imageSrc,
  detections,
  highlightedId,
  onHoverDetection,
}: DetectionPreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleMouseEnter = (id: string) => {
    setActiveId(id);
    if (onHoverDetection) {
      onHoverDetection(id);
    }
  };

  const handleMouseLeave = () => {
    setActiveId(null);
    if (onHoverDetection) {
      onHoverDetection(null);
    }
  };

  const currentActiveId = highlightedId || activeId;

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 aspect-video flex items-center justify-center max-h-[460px] select-none shadow-inner group">
      {/* Base Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt="Scan Detection View"
        className="w-full h-full object-contain pointer-events-none"
      />

      {/* Absolute Overlay Container for Bounding Boxes */}
      <div className="absolute inset-0 w-full h-full top-0 left-0">
        {detections.map((det, index) => {
          const colors = CATEGORY_COLORS[det.category] || CATEGORY_COLORS.dry;
          const isHighlighted = currentActiveId === det.id;

          return (
            <div
              key={det.id}
              className={cn(
                'absolute border-2 transition-all duration-150 rounded-sm cursor-pointer focus:outline-hidden',
                colors.border,
                colors.bg,
                isHighlighted ? 'scale-[1.02] border-3 shadow-[0_0_12px_rgba(255,255,255,0.4)] z-20' : 'z-10'
              )}
              style={{
                left: `${det.bbox.x}%`,
                top: `${det.bbox.y}%`,
                width: `${det.bbox.width}%`,
                height: `${det.bbox.height}%`,
              }}
              onMouseEnter={() => handleMouseEnter(det.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Box Label and Confidence Tag */}
              <div
                className={cn(
                  'absolute bottom-full left-0 mb-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md',
                  colors.text,
                  isHighlighted ? 'opacity-100 z-30 scale-105' : ''
                )}
              >
                #{index + 1} {det.label} ({CATEGORY_NAMES[det.category] || det.category}) ({Math.round(det.confidence * 100)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
