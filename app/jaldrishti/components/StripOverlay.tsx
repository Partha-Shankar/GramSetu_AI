import React from 'react';

// Percent-based so it works at any video resolution.
// Day 2 cropping will reuse this exact rect — don't change it without updating imageProcessor.ts later.
export const GUIDE_RECT = {
  xPct: 20,
  yPct: 40,
  widthPct: 60,
  heightPct: 18,
};

export function StripOverlay() {
  return (
    <div
      className="pointer-events-none absolute border-2 border-dashed border-blue-400 rounded-md"
      style={{
        left: `${GUIDE_RECT.xPct}%`,
        top: `${GUIDE_RECT.yPct}%`,
        width: `${GUIDE_RECT.widthPct}%`,
        height: `${GUIDE_RECT.heightPct}%`,
      }}
    >
      <span className="absolute -top-6 left-0 text-xs font-medium text-blue-500 bg-white/80 px-1.5 py-0.5 rounded">
        Align strip here
      </span>
    </div>
  );
}