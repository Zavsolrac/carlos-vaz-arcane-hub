import React from 'react';
import { motion } from 'motion/react';

interface MedallionProps {
  size?: number;
  className?: string;
  glow?: boolean;
  exportSafe?: boolean;
}

export const ArcaneEyeMedallion: React.FC<MedallionProps> = ({
  size = 96,
  className = '',
  glow = true,
  exportSafe = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#13171f] p-3 shadow-2xl transition-all duration-500 hover:scale-105 ${className}`}
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(197, 160, 89, 0.4)',
        boxShadow: glow
          ? '0 0 35px rgba(233, 193, 118, 0.2), inset 0 0 15px rgba(0, 242, 255, 0.1)'
          : undefined,
      }}
    >
      {/* Background ambient radial glow */}
      {exportSafe ? (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(233, 193, 118, 0.15) 0%, rgba(0, 242, 255, 0.05) 50%, transparent 100%)',
          }}
        />
      ) : (
        <div className="absolute inset-0 rounded-2xl bg-radial from-[#e9c176]/15 via-[#00f2ff]/5 to-transparent pointer-events-none" />
      )}

      {/* SVG Sacred Geometry Eye & Relic */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="eyeIrisGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ddfcff" />
            <stop offset="40%" stopColor="#00f2ff" />
            <stop offset="85%" stopColor="#006a70" />
            <stop offset="100%" stopColor="#002022" />
          </radialGradient>

          <linearGradient id="goldRelicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffdea5" />
            <stop offset="35%" stopColor="#e9c176" />
            <stop offset="70%" stopColor="#c5a059" />
            <stop offset="100%" stopColor="#684a0d" />
          </linearGradient>

          <filter id="relicGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Astral Rays */}
        <g stroke="url(#goldRelicGrad)" strokeWidth="1" strokeOpacity="0.6">
          {[...Array(16)].map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 82 * Math.cos((i * Math.PI) / 8)}
              y2={100 + 82 * Math.sin((i * Math.PI) / 8)}
              strokeDasharray="2 6"
            />
          ))}
        </g>

        {/* Outer Orbit Rings */}
        <circle
          cx="100"
          cy="100"
          r="78"
          stroke="url(#goldRelicGrad)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          className="opacity-70"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="#00f2ff"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />
        <circle
          cx="100"
          cy="100"
          r="64"
          stroke="url(#goldRelicGrad)"
          strokeWidth="1.5"
        />

        {/* Cardinal North/South/East/West Mystic Spikes */}
        <path
          d="M 100 12 L 104 30 L 100 24 L 96 30 Z"
          fill="url(#goldRelicGrad)"
          filter="url(#relicGlowFilter)"
        />
        <path
          d="M 100 188 L 104 170 L 100 176 L 96 170 Z"
          fill="url(#goldRelicGrad)"
          filter="url(#relicGlowFilter)"
        />
        <path
          d="M 12 100 L 30 96 L 24 100 L 30 104 Z"
          fill="url(#goldRelicGrad)"
          filter="url(#relicGlowFilter)"
        />
        <path
          d="M 188 100 L 170 96 L 176 100 L 170 104 Z"
          fill="url(#goldRelicGrad)"
          filter="url(#relicGlowFilter)"
        />

        {/* Diagonal Micro Diamonds */}
        {[45, 135, 225, 315].map((angle) => (
          <circle
            key={angle}
            cx={100 + 72 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 72 * Math.sin((angle * Math.PI) / 180)}
            r="2.5"
            fill="#e9c176"
          />
        ))}

        {/* Interlocking Geometries / Sacred Octagon */}
        <polygon
          points="100,38 144,56 162,100 144,144 100,162 56,144 38,100 56,56"
          stroke="url(#goldRelicGrad)"
          strokeWidth="1"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Sacred Triangles */}
        <polygon
          points="100,42 150,130 50,130"
          stroke="#00f2ff"
          strokeWidth="0.8"
          strokeOpacity="0.5"
          fill="none"
        />
        <polygon
          points="100,158 50,70 150,70"
          stroke="url(#goldRelicGrad)"
          strokeWidth="0.8"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* The Arcane Eye of Providence Contour */}
        <path
          d="M 46 100 C 66 68, 134 68, 154 100 C 134 132, 66 132, 46 100 Z"
          stroke="url(#goldRelicGrad)"
          strokeWidth="2.2"
          fill="#0c1017"
          fillOpacity="0.85"
          filter="url(#relicGlowFilter)"
        />

        {/* Inner Eye Details */}
        <path
          d="M 58 100 C 74 78, 126 78, 142 100 C 126 122, 74 122, 58 100 Z"
          stroke="#00f2ff"
          strokeWidth="0.75"
          strokeOpacity="0.6"
          fill="none"
        />

        {/* Iris Ring */}
        <circle
          cx="100"
          cy="100"
          r="20"
          stroke="url(#goldRelicGrad)"
          strokeWidth="1.5"
          fill="url(#eyeIrisGlow)"
        />

        {/* Central Luminous Faceted Diamond Pupil */}
        <polygon
          points="100,85 112,100 100,115 88,100"
          fill="#ffffff"
          filter="url(#relicGlowFilter)"
        />
        <polygon
          points="100,88 109,100 100,112 91,100"
          fill="#00f2ff"
        />
        <circle cx="100" cy="100" r="3.5" fill="#ffffff" />

        {/* Sparkling Glints */}
        <circle cx="95" cy="94" r="1.5" fill="#ffffff" />
        <circle cx="105" cy="106" r="1" fill="#ddfcff" />

        {/* Celestial Star on Top */}
        <path
          d="M 100 28 L 102 34 L 108 36 L 102 38 L 100 44 L 98 38 L 92 36 L 98 34 Z"
          fill="#ffdea5"
        />
      </svg>
    </div>
  );
};
