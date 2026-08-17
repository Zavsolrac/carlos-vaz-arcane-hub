interface MedallionProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export function ArcaneEyeMedallion({ size = 96, className = '', glow = true }: MedallionProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#13171f] p-3 ${className}`}
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(197, 160, 89, 0.4)',
        boxShadow: glow
          ? '0 0 35px rgba(233, 193, 118, 0.2), inset 0 0 15px rgba(0, 242, 255, 0.1)'
          : undefined,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(233,193,118,0.15) 0%, rgba(0,242,255,0.05) 45%, transparent 70%)' }} />
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 select-none" fill="none">
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
        </defs>
        <g stroke="url(#goldRelicGrad)" strokeWidth="1" strokeOpacity="0.6">
          {Array.from({ length: 16 }, (_, i) => (
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
        <circle cx="100" cy="100" r="78" stroke="url(#goldRelicGrad)" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.7" />
        <circle cx="100" cy="100" r="72" stroke="#00f2ff" strokeWidth="0.75" strokeOpacity="0.4" />
        <circle cx="100" cy="100" r="64" stroke="url(#goldRelicGrad)" strokeWidth="1.5" />
        <path d="M 100 12 L 104 30 L 100 24 L 96 30 Z" fill="url(#goldRelicGrad)" />
        <path d="M 100 188 L 104 170 L 100 176 L 96 170 Z" fill="url(#goldRelicGrad)" />
        <path d="M 12 100 L 30 96 L 24 100 L 30 104 Z" fill="url(#goldRelicGrad)" />
        <path d="M 188 100 L 170 96 L 176 100 L 170 104 Z" fill="url(#goldRelicGrad)" />
        {[45, 135, 225, 315].map((angle) => (
          <circle
            key={angle}
            cx={100 + 72 * Math.cos((angle * Math.PI) / 180)}
            cy={100 + 72 * Math.sin((angle * Math.PI) / 180)}
            r="2.5"
            fill="#e9c176"
          />
        ))}
        <polygon points="100,38 144,56 162,100 144,144 100,162 56,144 38,100 56,56" stroke="url(#goldRelicGrad)" strokeWidth="1" strokeOpacity="0.5" fill="none" />
        <polygon points="100,42 150,130 50,130" stroke="#00f2ff" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
        <polygon points="100,158 50,70 150,70" stroke="url(#goldRelicGrad)" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        <path d="M 46 100 C 66 68, 134 68, 154 100 C 134 132, 66 132, 46 100 Z" stroke="url(#goldRelicGrad)" strokeWidth="2.2" fill="#0c1017" fillOpacity="0.85" />
        <path d="M 58 100 C 74 78, 126 78, 142 100 C 126 122, 74 122, 58 100 Z" stroke="#00f2ff" strokeWidth="0.75" strokeOpacity="0.6" fill="none" />
        <circle cx="100" cy="100" r="20" stroke="url(#goldRelicGrad)" strokeWidth="1.5" fill="url(#eyeIrisGlow)" />
        <polygon points="100,85 112,100 100,115 88,100" fill="#ffffff" />
        <polygon points="100,88 109,100 100,112 91,100" fill="#00f2ff" />
        <circle cx="100" cy="100" r="3.5" fill="#ffffff" />
        <circle cx="95" cy="94" r="1.5" fill="#ffffff" />
        <circle cx="105" cy="106" r="1" fill="#ddfcff" />
        <path d="M 100 28 L 102 34 L 108 36 L 102 38 L 100 44 L 98 38 L 92 36 L 98 34 Z" fill="#ffdea5" />
      </svg>
    </div>
  );
}
