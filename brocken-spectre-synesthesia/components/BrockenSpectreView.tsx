
import React from 'react';
import { SHADOW_PATH_HUMAN, MAX_GLORY_RADIUS_BASE, NUM_GLORY_RINGS, RING_SPACING_BASE } from '../constants';
import type { GloryRing } from '../types';

interface BrockenSpectreViewProps {
  intensity: number; // 0 to 1
  gloryColors: string[];
}

export const BrockenSpectreView: React.FC<BrockenSpectreViewProps> = ({ intensity, gloryColors }) => {
  const shadowOpacity = 0.3 + intensity * 0.5; // Shadow becomes more defined with intensity
  const gloryOverallOpacity = 0.2 + intensity * 0.8;
  const gloryRadiusFactor = 0.5 + intensity * 0.5; // Glory size expands with intensity

  const gloryRings: GloryRing[] = [];
  const effectiveMaxRadius = MAX_GLORY_RADIUS_BASE * gloryRadiusFactor;
  const effectiveRingSpacing = RING_SPACING_BASE * (0.8 + intensity * 0.4);


  for (let i = 0; i < NUM_GLORY_RINGS; i++) {
    gloryRings.push({
      radius: effectiveMaxRadius - i * effectiveRingSpacing,
      color: gloryColors[i % gloryColors.length],
      opacity: gloryOverallOpacity * (1 - i / (NUM_GLORY_RINGS * 1.5)) // Outer rings slightly more transparent
    });
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <svg 
        viewBox="-200 -200 400 400" 
        preserveAspectRatio="xMidYMid meet" 
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Mist/Atmosphere - subtle radial gradient */}
        <defs>
          <radialGradient id="mistGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(150, 150, 200, 0.1)', stopOpacity: intensity * 0.2 }} />
            <stop offset="30%" style={{ stopColor: 'rgba(100, 100, 150, 0.2)', stopOpacity: intensity * 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(50, 50, 100, 0.3)', stopOpacity: intensity * 0.4 }} />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="200" fill="url(#mistGradient)" />

        {/* Glory Rings - rendered from largest (outermost) to smallest (innermost) */}
        {gloryRings.slice().reverse().map((ring, index) => (
          <circle
            key={`glory-${index}`}
            cx="0" // Centered around the shadow's "head"
            cy="-45" // Offset to be around the head of the human silhouette
            r={ring.radius}
            fill="none"
            stroke={ring.color}
            strokeWidth={effectiveRingSpacing * 0.8} // Rings are fairly thick
            opacity={ring.opacity * intensity} // Overall intensity also affects ring visibility
            style={{ transition: 'all 0.3s ease-out' }}
          />
        ))}

        {/* Shadow Silhouette */}
        {/* The path is defined as 100x100, centered at 50,50. We scale and translate it. */}
        <g transform="translate(-50, -95) scale(1.2)"> 
          <path
            d={SHADOW_PATH_HUMAN}
            fill={`rgba(10, 10, 20, ${shadowOpacity})`} // Dark, semi-transparent shadow
            style={{ transition: 'opacity 0.5s ease-out' }}
          />
        </g>
      </svg>
      {/* Subtle lens flare / sun glow effect - positioned behind the observer (center) */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${300 + intensity * 200}px`,
          height: `${300 + intensity * 200}px`,
          background: `radial-gradient(circle, rgba(255,255,220,${intensity * 0.15}) 0%, rgba(255,255,220,0) 70%)`,
          opacity: intensity * 0.8,
          transition: 'all 0.5s ease-out'
        }}
      />
    </div>
  );
};
