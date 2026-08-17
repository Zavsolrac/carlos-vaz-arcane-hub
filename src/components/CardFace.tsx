import type { CardConfig } from '../data/profile';
import { EXPORT_PRESETS, type ExportFormat } from '../lib/exportPresets';
import { ArcaneEyeMedallion } from './ArcaneEyeMedallion';

interface CardFaceProps {
  config: CardConfig;
  format: ExportFormat;
  qrDataUrl: string | null;
}

export function CardFace({ config, format, qrDataUrl }: CardFaceProps) {
  const { width, height } = EXPORT_PRESETS[format];
  const isStory = format === 'story';

  return (
    <div
      data-export-card="true"
      style={{
        width,
        height,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        color: '#e5e2e1',
        padding: isStory ? '96px 88px 88px' : '72px 80px 64px',
        backgroundColor: '#0d1117',
        backgroundImage: config.bgImageUrl
          ? `linear-gradient(to bottom, rgba(10,10,10,0.88), rgba(13,17,23,0.94)), url(${config.bgImageUrl})`
          : isStory
            ? 'radial-gradient(circle at 50% 18%, rgba(0,242,255,0.10) 0%, rgba(13,17,23,1) 58%)'
            : 'radial-gradient(circle at 50% 30%, rgba(0,242,255,0.10) 0%, rgba(13,17,23,1) 70%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(0,77,77,0.8)',
      }}
    >
      <Corner x="left" y="top" />
      <Corner x="right" y="top" />
      <Corner x="left" y="bottom" />
      <Corner x="right" y="bottom" />

      <div>
        <span
          style={{
            display: 'inline-block',
            padding: '8px 18px',
            borderRadius: 999,
            background: 'rgba(233,193,118,0.10)',
            border: '1px solid rgba(233,193,118,0.35)',
            color: '#e9c176',
            fontFamily: 'Inter, sans-serif',
            fontSize: isStory ? 18 : 16,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          {config.badgeText}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isStory ? 28 : 18 }}>
        <ArcaneEyeMedallion size={isStory ? 228 : 156} glow />
        <h3
          className="font-signature gold-gradient-text"
          style={{
            margin: 0,
            fontSize: isStory ? 72 : 56,
            lineHeight: 1.05,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {config.name}
        </h3>
        <p
          className="font-cinzel"
          style={{
            margin: 0,
            fontSize: isStory ? 28 : 22,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#d1c5b4',
            fontWeight: 600,
          }}
        >
          {config.title}
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: 780,
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(0,242,255,0.10)',
            border: '1px solid rgba(0,242,255,0.32)',
            color: '#00f2ff',
            fontFamily: 'Inter, sans-serif',
            fontSize: isStory ? 20 : 16,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {config.tagline}
        </p>
        {isStory && (
          <p
            className="font-lora"
            style={{
              margin: '8px 0 0',
              maxWidth: 760,
              fontSize: 28,
              lineHeight: 1.45,
              fontStyle: 'italic',
              color: 'rgba(229,226,225,0.92)',
            }}
          >
            “{config.description}”
          </p>
        )}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isStory ? 28 : 20 }}>
        <div
          style={{
            width: '100%',
            padding: isStory ? '22px 28px' : '18px 24px',
            borderRadius: 16,
            background: 'linear-gradient(90deg, rgba(0,242,255,0.18), rgba(0,242,255,0.28), rgba(0,242,255,0.18))',
            border: '1px solid rgba(0,242,255,0.6)',
            color: '#ddfcff',
            fontFamily: 'Inter, sans-serif',
            fontSize: isStory ? 22 : 18,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {config.ctaText}
        </div>

        {config.showQrCode && qrDataUrl && (
          <div style={{ display: 'flex', flexDirection: isStory ? 'column' : 'row', alignItems: 'center', gap: 16 }}>
            <img
              src={qrDataUrl}
              alt=""
              width={isStory ? 220 : 148}
              height={isStory ? 220 : 148}
              style={{
                width: isStory ? 220 : 148,
                height: isStory ? 220 : 148,
                background: '#f4fffe',
                padding: 8,
                borderRadius: 12,
              }}
            />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: isStory ? 16 : 14,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(209,197,180,0.75)',
                maxWidth: isStory ? 280 : 220,
              }}
            >
              Escaneie para abrir o destino
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Corner({ x, y }: { x: 'left' | 'right'; y: 'top' | 'bottom' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        [y]: 28,
        [x]: 28,
        width: 28,
        height: 28,
        borderTop: y === 'top' ? '2px solid #004d4d' : undefined,
        borderBottom: y === 'bottom' ? '2px solid #004d4d' : undefined,
        borderLeft: x === 'left' ? '2px solid #004d4d' : undefined,
        borderRight: x === 'right' ? '2px solid #004d4d' : undefined,
      }}
    />
  );
}
