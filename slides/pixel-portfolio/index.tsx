import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — SNES-era 16-bit palette, zero radius, chunky type
// ─────────────────────────────────────────────────────────────────────────────

export const design: DesignSystem = {
  palette: { bg: '#8fdcff', text: '#1b2340', accent: '#ffd23f' },
  fonts: {
    display: '"Press Start 2P", "Courier New", monospace',
    body: '"Pixelify Sans", "VT323", system-ui, sans-serif',
  },
  typeScale: { hero: 96, body: 32 },
  radius: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Webfont + stylesheet injection (module level, once, keyed to this slide id)
// Press Start 2P has no Vietnamese glyphs; VT323 (also pixel) covers them.
// ─────────────────────────────────────────────────────────────────────────────

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;500;600;700&family=VT323&display=swap';
const FONT_LINK_ID = 'osd-webfont-pixel-portfolio';

if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = FONT_HREF;
}

const CSS = `
.pxa { animation-timing-function: steps(4, end); animation-fill-mode: both; }
[data-still] .pxa { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .pxa { animation: none !important; } }

@keyframes px-in    { from { opacity: 0; transform: translateY(12px); } }
@keyframes px-pop   { from { opacity: 0; transform: scale(0.88); } }
@keyframes px-drop  { from { opacity: 0; transform: translateY(-18px); } }
@keyframes px-bob   { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes px-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes px-coin  { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.18); } }
@keyframes px-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes px-drift { from { transform: translateX(0); } to { transform: translateX(-960px); } }
@keyframes px-walk  { from { transform: translateX(0); } to { transform: translateX(1340px); } }
@keyframes px-scroll{ from { transform: translateX(0); } to { transform: translateX(-1600px); } }
@keyframes px-bump  { 0%, 55% { transform: translateY(0); } 66% { transform: translateY(-12px); } 78%, 100% { transform: translateY(0); } }
@keyframes px-bar   { from { width: 0; } }
@keyframes px-up    { 0% { opacity: 0; transform: translateY(40px); } 12% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; transform: translateY(-150px); } }
@keyframes px-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.8); opacity: 0.3; } }
@keyframes px-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
@keyframes px-char  { from { opacity: 0; } }

.px-in     { animation-name: px-in;     animation-duration: 0.5s; }
.px-pop    { animation-name: px-pop;    animation-duration: 0.44s; }
.px-drop   { animation-name: px-drop;   animation-duration: 0.5s; }
.px-bob    { animation-name: px-bob;    animation-duration: 1.1s; animation-iteration-count: infinite; animation-timing-function: steps(2, end); }
.px-blink  { animation-name: px-blink;  animation-duration: 1s;   animation-iteration-count: infinite; animation-timing-function: steps(1, end); }
.px-coin   { animation-name: px-coin;   animation-duration: 1.2s; animation-iteration-count: infinite; animation-timing-function: steps(3, end); }
.px-float  { animation-name: px-float;  animation-duration: 2.6s; animation-iteration-count: infinite; animation-timing-function: steps(4, end); }
.px-drift  { animation-name: px-drift;  animation-duration: 48s;  animation-iteration-count: infinite; animation-timing-function: linear; }
.px-walk   { animation-name: px-walk;   animation-duration: 11s;  animation-iteration-count: infinite; animation-timing-function: steps(20, end); }
.px-scroll { animation-name: px-scroll; animation-duration: 6.4s; animation-iteration-count: infinite; animation-timing-function: steps(20, end); }
.px-bump   { animation-name: px-bump;   animation-duration: 3.2s; animation-iteration-count: infinite; animation-timing-function: steps(4, end); }
.px-bar    { width: 100%; animation-name: px-bar; animation-duration: 1.2s; animation-timing-function: steps(10, end); }
.px-up     { animation-name: px-up;     animation-duration: 3.6s; animation-iteration-count: infinite; animation-timing-function: steps(8, end); }
.px-pulse  { animation-name: px-pulse;  animation-duration: 1.1s; animation-iteration-count: infinite; animation-timing-function: steps(2, end); }
.px-twinkle{ animation-name: px-twinkle;animation-duration: 2.4s; animation-iteration-count: infinite; animation-timing-function: steps(2, end); }
.px-char   { animation-name: px-char;   animation-duration: 0.01s; }
`;

const STYLE_ID = 'osd-styles-pixel-portfolio';
if (typeof document !== 'undefined') {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = CSS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  ink: '#1b2340',
  inkSoft: '#31436b',
  cream: '#fff8e7',
  parch: '#f6d7b0',
  gold: '#ffd23f',
  goldDark: '#e0a020',
  red: '#e2492f',
  redDark: '#a82a1c',
  green: '#5ec44a',
  greenDark: '#2f8f2a',
  blue: '#3f6fd8',
  blueDark: '#2a4a9c',
  dirt: '#c98a4b',
  dirtDark: '#96602c',
  night: '#0d1530',
  white: '#ffffff',
  purple: '#8a5cd8',
  steel: '#8b93b0',
};

type Tone = 'day' | 'night' | 'sunset';

// ─────────────────────────────────────────────────────────────────────────────
// Pixel-art engine — sprites are ASCII grids over a shared legend
// ─────────────────────────────────────────────────────────────────────────────

const PX: Record<string, string> = {
  k: C.ink,
  w: C.white,
  y: C.gold,
  Y: C.goldDark,
  c: C.green,
  C: C.greenDark,
  s: '#f2c49b',
  S: '#d99a72',
  o: '#ff8b3d',
  p: C.blue,
  P: C.blueDark,
  r: C.red,
  R: C.redDark,
  u: C.purple,
  b: C.steel,
  e: C.dirt,
  E: C.dirtDark,
};

type Sprite = { w: number; h: number; rows: string[] };

const HERO: Sprite = {
  w: 12,
  h: 16,
  rows: [
    '....kkkk....',
    '..kkcccckk..',
    '.kcccccccck.',
    '.kCccccccCk.',
    '.kkkkkkkkkk.',
    '..kssssssk..',
    '..kskssksk..',
    '..kssssssk..',
    '..kkSSSSkk..',
    '...kkkkkk...',
    '..kooooook..',
    '.skooooooks.',
    '.skooooooks.',
    '..kppppppk..',
    '..kppppppk..',
    '..kbbbbbbk..',
  ],
};

const NPC: Sprite = {
  w: 12,
  h: 16,
  rows: [
    '....kkkk....',
    '..kkppppkk..',
    '.kppppppppk.',
    '.kPppppppPk.',
    '.kkkkkkkkkk.',
    '..kssssssk..',
    '..kskssksk..',
    '..kssssssk..',
    '..kkSSSSkk..',
    '...kkkkkk...',
    '..kuuuuuuk..',
    '.skuuuuuuks.',
    '.skuuuuuuks.',
    '..kppppppk..',
    '..kppppppk..',
    '..kbbbbbbk..',
  ],
};

const COIN: Sprite = {
  w: 8,
  h: 8,
  rows: [
    '..kkkk..',
    '.kyyyyk.',
    'kyywwyyk',
    'kyYwwYyk',
    'kyYwwYyk',
    'kyywwyyk',
    '.kyyyyk.',
    '..kkkk..',
  ],
};

const MUSHROOM: Sprite = {
  w: 12,
  h: 10,
  rows: [
    '...kkkkkk...',
    '.kkrrrrrrkk.',
    '.krrwwrrwrk.',
    'kkrwwrrwwrkk',
    'kkrrrrrrrrkk',
    '.kkkkkkkkkk.',
    '.kwwwwwwwwk.',
    '.kwkkwwkkwk.',
    '.kwwwwwwwwk.',
    '..kkkkkkkk..',
  ],
};

const STAR: Sprite = {
  w: 12,
  h: 12,
  rows: [
    '.....kk.....',
    '....kyyk....',
    '....kyyk....',
    'kkkkkyykkkkk',
    'kyyyyyyyyyyk',
    '.kyyyyyyyyk.',
    '..kyyyyyyk..',
    '..kyyyyyyk..',
    '.kyyyyyyyyk.',
    '.kyyk..kyyk.',
    'kyk......kyk',
    'kk........kk',
  ],
};

const QBLOCK: Sprite = {
  w: 12,
  h: 12,
  rows: [
    'kkkkkkkkkkkk',
    'kyyyyyyyyyyk',
    'kyykkkkkkyyk',
    'kyykkkkkkyyk',
    'kyyyyykkyyyk',
    'kyyyyykkyyyk',
    'kyyyykkkyyyk',
    'kyyyykyyyyyk',
    'kyyyykyyyyyk',
    'kyyyyyyyyyyk',
    'kyyyyykyyyyk',
    'kkkkkkkkkkkk',
  ],
};

const BRICK: Sprite = {
  w: 12,
  h: 8,
  rows: [
    'kkkkkkkkkkkk',
    'krrrkrrrkrrk',
    'krrrkrrrkrrk',
    'kkkkkkkkkkkk',
    'kkrrrkrrrkrr',
    'kkrrrkrrrkrr',
    'kkkkkkkkkkkk',
    'kkkkkkkkkkkk',
  ],
};

const GROUND: Sprite = {
  w: 16,
  h: 8,
  rows: [
    'cccccccccccccccc',
    'CCCCCCCCCCCCCCCC',
    'eeeeeeeeeeeeeeee',
    'eeEeeeeeeEeeeeee',
    'eeeeeeeEeeeeeeee',
    'eEeeeeeeeeeEeeee',
    'eeeeeeeeeeeeeeee',
    'EEEEEEEEEEEEEEEE',
  ],
};

const CLOUD: Sprite = {
  w: 22,
  h: 8,
  rows: [
    '......kkkkkk..........',
    '....kkwwwwwwkk........',
    '..kkwwwwwwwwwwkk......',
    '.kwwwwwwwwwwwwwwk.....',
    'kwwwwwwwwwwwwwwwwwk...',
    'kwwwwwwwwwwwwwwwwwwk..',
    '.kkwwwwwwwwwwwwwwkk...',
    '...kkkkkkkkkkkkkk.....',
  ],
};

const FLAG: Sprite = {
  w: 10,
  h: 18,
  rows: [
    '.kkkkkkkk.',
    'kwwwwwwwwk',
    'kwkwkwkwwk',
    'kwwkwkwkwk',
    'kwkwkwkwwk',
    'kwwwwwwwwk',
    '.kkkkkkkk.',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
    '....kk....',
  ],
};

const HEART: Sprite = {
  w: 8,
  h: 7,
  rows: [
    '.kk..kk.',
    'krrkkrrk',
    'krrrrrrk',
    'kRrrrrrk',
    '.kRrrrk.',
    '..kRRk..',
    '...kk...',
  ],
};

const PIPE: Sprite = {
  w: 14,
  h: 12,
  rows: [
    'kkkkkkkkkkkkkk',
    'kcccccccccccck',
    'kwccccccccccck',
    'kkkkkkkkkkkkkk',
    '.kkCCCCCCCCkk.',
    '.kCCCCCCCCCCk.',
    '.kwCCCCCCCCCk.',
    '.kwCCCCCCCCCk.',
    '.kwCCCCCCCCCk.',
    '.kwCCCCCCCCCk.',
    '.kCCCCCCCCCCk.',
    '.kCCCCCCCCCCk.',
  ],
};

const BIRD: Sprite = {
  w: 10,
  h: 8,
  rows: [
    '...kkkk...',
    '..kyyyyk..',
    '.kywwyyyk.',
    'kyywwyyyyk',
    'kyyyyyykok',
    '.kyyyyyyk.',
    '..kkkkkk..',
    '.kk....kk.',
  ],
};

const SUN: Sprite = {
  w: 12,
  h: 11,
  rows: [
    '...kkkkkk...',
    '.kkyyyyyykk.',
    '.kyyyyyyyyk.',
    'kyyyyyyyyyyk',
    'kyywwyyywyyk',
    'kyywwyyywyyk',
    'kyyyyyyyyyyk',
    'kyyyyyyyyyyk',
    '.kyyyyyyyyk.',
    '.kkyyyyyykk.',
    '...kkkkkk...',
  ],
};

const PixelRects = ({ sprite, x = 0, y = 0, scale = 1 }: { sprite: Sprite; x?: number; y?: number; scale?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {sprite.rows.map((row, ry) =>
      row.split('').map((ch, rx) => {
        const fill = PX[ch];
        return fill ? <rect key={`${rx}-${ry}`} x={rx} y={ry} width={1} height={1} fill={fill} /> : null;
      }),
    )}
  </g>
);

const Px = ({
  sprite,
  scale = 4,
  flipY = false,
  className,
  style,
}: {
  sprite: Sprite;
  scale?: number;
  flipY?: boolean;
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    className={className}
    width={sprite.w * scale}
    height={sprite.h * scale}
    viewBox={`0 0 ${sprite.w} ${sprite.h}`}
    shapeRendering="crispEdges"
    style={{ display: 'block', transform: flipY ? 'scaleY(-1)' : undefined, ...style }}
  >
    <PixelRects sprite={sprite} />
  </svg>
);

const Ground = ({ width = 1920, tone = 'day' }: { width?: number; tone?: Tone }) => (
  <svg
    width={width}
    height={64}
    viewBox={`0 0 ${width} 64`}
    shapeRendering="crispEdges"
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      display: 'block',
      filter: tone === 'night' ? 'brightness(0.42) saturate(0.7)' : undefined,
    }}
  >
    <defs>
      <pattern id={`osdpx-ground-${tone}`} width={128} height={64} patternUnits="userSpaceOnUse">
        <PixelRects sprite={GROUND} x={0} y={0} scale={8} />
      </pattern>
    </defs>
    <rect width={width} height={64} fill={`url(#osdpx-ground-${tone})`} />
  </svg>
);

const Sky = ({ tone }: { tone: Tone }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        tone === 'night'
          ? 'linear-gradient(180deg, #070d20 0%, #16224a 55%, #33447f 100%)'
          : tone === 'sunset'
            ? 'linear-gradient(180deg, #ff9d6b 0%, #ff8f8f 30%, #f6c98a 66%, #ffe6bd 100%)'
            : 'linear-gradient(180deg, #6ec7f2 0%, #a5e2ff 58%, #dcf4ff 100%)',
    }}
  />
);

const Clouds = ({ tone }: { tone: Tone }) => (
  <svg
    className="pxa px-drift"
    width={3840}
    height={520}
    viewBox="0 0 3840 520"
    shapeRendering="crispEdges"
    style={{ position: 'absolute', left: 0, top: 0, opacity: tone === 'night' ? 0.22 : tone === 'sunset' ? 0.7 : 0.95 }}
  >
    <defs>
      <pattern id={`osdpx-clouds-${tone}`} width={960} height={520} patternUnits="userSpaceOnUse">
        <PixelRects sprite={CLOUD} x={120} y={40} scale={5} />
        <PixelRects sprite={CLOUD} x={560} y={250} scale={3} />
        <PixelRects sprite={CLOUD} x={700} y={60} scale={4} />
      </pattern>
    </defs>
    <rect width={3840} height={520} fill={`url(#osdpx-clouds-${tone})`} />
  </svg>
);

const Stars = () => (
  <>
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 240, top: 190, width: 8, height: 8, background: C.cream }} />
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 520, top: 300, width: 6, height: 6, background: C.cream, animationDelay: '0.4s' }} />
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 1180, top: 160, width: 8, height: 8, background: C.gold, animationDelay: '0.9s' }} />
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 1420, top: 330, width: 6, height: 6, background: C.cream, animationDelay: '1.3s' }} />
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 1660, top: 220, width: 6, height: 6, background: C.cream, animationDelay: '0.6s' }} />
    <div className="pxa px-twinkle" style={{ position: 'absolute', left: 900, top: 400, width: 6, height: 6, background: C.gold, animationDelay: '1.7s' }} />
  </>
);

const GroundBushes = () => (
  <div style={{ position: 'absolute', left: 0, bottom: 64, width: '100%', height: 16, background: `repeating-linear-gradient(90deg, ${C.greenDark} 0 32px, ${C.green} 32px 64px)`, opacity: 0.85 }} />
);

// ─────────────────────────────────────────────────────────────────────────────
// Type + chrome primitives
// ─────────────────────────────────────────────────────────────────────────────

const display = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-display)',
  fontSize: size,
  lineHeight: 1.3,
  letterSpacing: '0.01em',
  ...extra,
});

const body = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-body)',
  fontSize: size,
  lineHeight: 1.42,
  ...extra,
});

const pad2 = (n: number) => String(n).padStart(2, '0');
const pad3 = (n: number) => String(n).padStart(3, '0');

const Chip = ({
  children,
  tone = 'ink',
  delay = 0,
  className = 'pxa px-in',
}: {
  children: ReactNode;
  tone?: 'ink' | 'gold' | 'green' | 'red' | 'cream';
  delay?: number;
  className?: string;
}) => {
  const tones: Record<string, { bg: string; fg: string }> = {
    ink: { bg: C.ink, fg: C.cream },
    gold: { bg: C.gold, fg: C.ink },
    green: { bg: C.greenDark, fg: C.cream },
    red: { bg: C.red, fg: C.cream },
    cream: { bg: C.cream, fg: C.ink },
  };
  return (
    <span
      className={className}
      style={{
        ...display(16),
        display: 'inline-flex',
        alignItems: 'center',
        height: 38,
        padding: '0 12px',
        boxSizing: 'border-box',
        border: `4px solid ${C.ink}`,
        background: tones[tone].bg,
        color: tones[tone].fg,
        animationDelay: className.includes('px-in') ? `${delay}s` : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

const Panel = ({
  children,
  tone = 'cream',
  delay = 0,
  className = 'pxa px-in',
  padding = 28,
  style,
}: {
  children: ReactNode;
  tone?: 'cream' | 'ink' | 'parch';
  delay?: number;
  className?: string;
  padding?: number;
  style?: CSSProperties;
}) => {
  const isInk = tone === 'ink';
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        background: isInk ? 'rgba(16,24,48,0.94)' : tone === 'parch' ? C.parch : C.cream,
        border: `6px solid ${C.ink}`,
        boxShadow: `inset 0 0 0 4px ${isInk ? 'rgba(255,248,231,0.16)' : '#f2c14e'}, 0 8px 0 rgba(27,35,64,0.28)`,
        padding,
        animationDelay: className.includes('px-in') ? `${delay}s` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Heading = ({
  eyebrow,
  title,
  lead,
  light = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  light?: boolean;
}) => (
  <div>
    <Chip tone={light ? 'gold' : 'ink'}>{eyebrow}</Chip>
    <h2
      className="pxa px-in"
      style={display(56, {
        margin: '18px 0 0',
        color: light ? C.cream : C.ink,
        animationDelay: '0.06s',
      })}
    >
      {title}
    </h2>
    {lead ? (
      <p
        className="pxa px-in"
        style={body(30, {
          margin: '16px 0 0',
          color: light ? 'rgba(255,248,231,0.85)' : C.inkSoft,
          maxWidth: 1400,
          animationDelay: '0.12s',
        })}
      >
        {lead}
      </p>
    ) : null}
  </div>
);

const Bullet = ({ children, delay = 0, light = false }: { children: ReactNode; delay?: number; light?: boolean }) => (
  <div className="pxa px-in" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDelay: `${delay}s` }}>
    <div style={{ marginTop: 8, flexShrink: 0 }}>
      <Px sprite={COIN} scale={2} />
    </div>
    <span style={body(28, { color: light ? 'rgba(255,248,231,0.88)' : C.inkSoft, maxWidth: 1180 })}>{children}</span>
  </div>
);

const Meter = ({ value, delay = 0, color = C.green }: { value: number; delay?: number; color?: string }) => (
  <div
    style={{
      position: 'relative',
      height: 28,
      background: '#e8dcc0',
      border: `4px solid ${C.ink}`,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}
  >
    <div
      className="pxa px-bar"
      style={{ height: '100%', width: `${value}%`, background: color, animationDelay: `${delay}s`, animationDuration: '1.2s' }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(27,35,64,0.24) 0 3px, rgba(0,0,0,0) 3px 20px)',
      }}
    />
  </div>
);

// Reveals one character at a time without ever disturbing layout: every
// character is already laid out in normal flow and merely fades in on a
// staggered delay. Wrapping happens once, at the final width, so the text can
// never reflow into a tall column or spill out of its panel.
const Typewriter = ({
  text,
  delay = 0,
  charDelay = 0.012,
  caret = false,
  style,
}: {
  text: string;
  delay?: number;
  charDelay?: number;
  caret?: boolean;
  style?: CSSProperties;
}) => (
  <span style={style}>
    {[...text].map((ch, i) => (
      <span key={i} className="pxa px-char" style={{ animationDelay: `${delay + i * charDelay}s` }}>
        {ch}
      </span>
    ))}
    {caret ? (
      <span
        aria-hidden
        className="pxa px-blink"
        style={{ display: 'inline-block', width: 16, height: 30, marginLeft: 10, background: C.ink, verticalAlign: '-1px' }}
      />
    ) : null}
  </span>
);

const Hud = ({ level, world, coins }: { level: string; world: string; coins: number }) => {
  const { current, total } = useSlidePageNumber();
  const label = C.cream;
  return (
    <div
      className="pxa px-drop"
      style={{
        position: 'absolute',
        left: 96,
        right: 96,
        top: 24,
        height: 76,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 20px',
        boxSizing: 'border-box',
        background: 'rgba(20,28,54,0.92)',
        border: `5px solid ${C.ink}`,
        boxShadow: 'inset 0 0 0 4px rgba(255,248,231,0.14)',
      }}
    >
      <Px sprite={HERO} scale={3} />
      <span style={display(16, { color: label })}>NSTCRYSTAL</span>
      <Chip tone="gold" className="">{level}</Chip>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="pxa px-coin">
          <Px sprite={COIN} scale={3} />
        </div>
        <span style={display(16, { color: C.gold })}>x{pad3(coins)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Px sprite={HEART} scale={3} />
        <Px sprite={HEART} scale={3} />
        <Px sprite={HEART} scale={3} />
      </div>
      <span style={display(16, { color: label })}>WORLD {world}</span>
      <span style={display(16, { color: C.gold })}>
        {pad2(current)}/{pad2(total)}
      </span>
    </div>
  );
};

const STAGE: CSSProperties = { position: 'absolute', left: 96, right: 96, top: 132, height: 858 };

const Frame = ({
  level,
  world,
  coins = 137,
  tone = 'day',
  foreground,
  children,
}: {
  level: string;
  world: string;
  coins?: number;
  tone?: Tone;
  foreground?: ReactNode;
  children: ReactNode;
}) => {
  const active = useIsActivePage();
  const light = tone === 'night';
  return (
    <div
      data-still={active ? undefined : ''}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background: light ? C.night : 'var(--osd-bg)',
        color: light ? C.cream : 'var(--osd-text)',
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      <Sky tone={tone} />
      {tone === 'sunset' ? (
        <div className="pxa px-float" style={{ position: 'absolute', right: 190, top: 150 }}>
          <Px sprite={SUN} scale={9} />
        </div>
      ) : null}
      <Clouds tone={tone} />
      {light ? <Stars /> : null}
      <Ground tone={tone} />
      {tone === 'day' ? <GroundBushes /> : null}
      <div style={STAGE}>{children}</div>
      <Hud level={level} world={world} coins={coins} />
      {foreground ? <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{foreground}</div> : null}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page transition — chunky steps() so page changes feel 8-bit too
// ─────────────────────────────────────────────────────────────────────────────

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 200, easing: 'steps(3, end)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 240,
    easing: 'steps(5, end)',
    keyframes: [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1 — Title screen
// ─────────────────────────────────────────────────────────────────────────────

const TitleDecor = () => (
  <>
    <div className="pxa px-bob" style={{ position: 'absolute', left: 250, bottom: 64 }}>
      <Px sprite={HERO} scale={12} />
    </div>
    <div className="pxa px-float" style={{ position: 'absolute', left: 470, bottom: 380 }}>
      <div className="pxa px-coin">
        <Px sprite={COIN} scale={7} />
      </div>
    </div>
    <div className="pxa px-float" style={{ position: 'absolute', left: 560, bottom: 470, animationDelay: '0.7s' }}>
      <div className="pxa px-coin" style={{ animationDelay: '0.3s' }}>
        <Px sprite={COIN} scale={7} />
      </div>
    </div>
    <div className="pxa px-float" style={{ position: 'absolute', left: 650, bottom: 380, animationDelay: '1.3s' }}>
      <div className="pxa px-coin" style={{ animationDelay: '0.6s' }}>
        <Px sprite={COIN} scale={7} />
      </div>
    </div>
    <div className="pxa px-bob" style={{ position: 'absolute', right: 300, bottom: 64, animationDelay: '0.5s' }}>
      <Px sprite={MUSHROOM} scale={8} />
    </div>
  </>
);

const TitleScreen: Page = () => (
  <Frame level="TITLE" world="1-1" coins={137} foreground={<TitleDecor />}>
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        className="pxa px-in"
        style={{
          width: '100%',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 22px',
          boxSizing: 'border-box',
          background: 'rgba(20,28,54,0.9)',
          border: `5px solid ${C.ink}`,
        }}
      >
        <span style={display(16, { color: C.cream })}>1 PLAYER</span>
        <span style={display(16, { color: C.gold })}>HI-SCORE 000420</span>
        <span style={display(16, { color: C.cream })}>© 2026 NSTCRYSTAL</span>
      </div>

      <div style={{ marginTop: 66, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Chip tone="ink">WORLD 1 · 2026</Chip>
        <h1
          className="pxa px-pop"
          style={display(96, {
            margin: '32px 0 0',
            color: C.gold,
            textShadow: `8px 8px 0 ${C.ink}`,
            animationDelay: '0.1s',
          })}
        >
          NSTCRYSTAL
        </h1>
        <p
          className="pxa px-in"
          style={body(34, { margin: '34px 0 0', color: C.ink, textAlign: 'center', animationDelay: '0.22s' })}
        >
          A DEVELOPER'S PORTFOLIO — VUE · NUXT · TAILWIND
        </p>
        <p className="pxa px-in" style={body(24, { margin: '14px 0 0', color: C.inkSoft, animationDelay: '0.3s' })}>
          1 PLAYER · 3 LIVES · 6 PROJECTS · 1 PORTFOLIO
        </p>
        <div className="pxa px-blink" style={{ marginTop: 62 }}>
          <span style={display(32, { color: C.red, textShadow: `4px 4px 0 ${C.cream}` })}>PRESS START</span>
        </div>
      </div>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2 — World map (agenda) — order matters, so it is stepped
// ─────────────────────────────────────────────────────────────────────────────

const LevelRow = ({ code, title, line }: { code: string; title: string; line: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      height: 78,
      marginBottom: 10,
      padding: '0 24px',
      boxSizing: 'border-box',
      background: 'rgba(255,248,231,0.94)',
      border: `5px solid ${C.ink}`,
      boxShadow: '0 6px 0 rgba(27,35,64,0.22)',
    }}
  >
    <Chip tone="ink" className="">
      {code}
    </Chip>
    <span style={display(24, { color: C.ink })}>{title}</span>
    <span style={{ flex: 1 }} />
    <span style={body(24, { color: C.inkSoft })}>{line}</span>
    <Px sprite={FLAG} scale={2} />
  </div>
);

const WorldMap: Page = () => (
  <Frame
    level="WORLD MAP"
    world="1-1"
    coins={138}
    foreground={
      <div className="pxa px-walk" style={{ position: 'absolute', left: 160, bottom: 64 }}>
        <Px sprite={HERO} scale={6} />
      </div>
    }
  >
    <Heading eyebrow="COURSE SELECT" title="WORLD MAP" lead="Six worlds stand between you and the end credits. Reveal them one by one." />
    <div style={{ marginTop: 28 }}>
      <Steps>
        <Step>
          <LevelRow code="1-1" title="PLAYER ONE" line="Who I am, and what I build" />
        </Step>
        <Step>
          <LevelRow code="2-1" title="INVENTORY" line="Six projects I shipped" />
        </Step>
        <Step>
          <LevelRow code="3-1" title="QUEST LOG" line="Notes written along the way" />
        </Step>
        <Step>
          <LevelRow code="4-1" title="ACHIEVEMENTS" line="School, stats and allies" />
        </Step>
        <Step>
          <LevelRow code="5-1" title="OPTIONS" line="What I can build for you" />
        </Step>
        <Step>
          <LevelRow code="6-1" title="SAVE & CONTINUE" line="How to reach me" />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3 — Level 1-1 · Player One (about)
// ─────────────────────────────────────────────────────────────────────────────

const StatRow = ({ k, v }: { k: string; v: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '7px 0', borderBottom: '3px dashed rgba(150,96,44,0.45)' }}>
    <span style={display(14, { color: C.ink })}>{k}</span>
    <span style={body(22, { color: C.inkSoft, textAlign: 'right' })}>{v}</span>
  </div>
);

const PlayerCard = () => (
  <Panel style={{ width: 452, padding: 26 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Chip tone="red" className="">
        PLAYER 1
      </Chip>
      <div className="pxa px-bob" style={{ margin: '16px 0' }}>
        <Px sprite={HERO} scale={9} />
      </div>
      <div style={display(24, { color: C.ink })}>VÕ VĂN DUY</div>
      <div style={body(22, { color: C.inkSoft, marginTop: 6 })}>@NSTCrystal</div>
      <div style={{ width: '100%', marginTop: 18 }}>
        <StatRow k="CLASS" v="Web developer" />
        <StatRow k="BASE" v="Hue, Vietnam" />
        <StatRow k="GUILD" v="Hue Univ. of Sciences" />
        <StatRow k="SINCE" v="2024" />
        <StatRow k="PLATFORM" v="Vue · Nuxt · Node" />
      </div>
    </div>
  </Panel>
);

const PlayerOne: Page = () => (
  <Frame level="1-1 PLAYER ONE" world="1-1" coins={142}>
    <div style={{ height: '100%', display: 'flex', gap: 52, alignItems: 'center' }}>
      <PlayerCard />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Heading eyebrow="LEVEL 1-1" title="PLAYER ONE" />
        <p className="pxa px-in" style={body(30, { margin: 0, color: C.inkSoft, maxWidth: 1120, animationDelay: '0.12s' })}>
          I'm a Computer Science student and web developer from Hue, Vietnam. I turn ideas into fast, clean web products
          — mostly on the Vue.js and Nuxt ecosystem.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          <Bullet delay={0.18}>Started with one question: how do websites actually work?</Bullet>
          <Bullet delay={0.26}>Now I build them — clean, maintainable, and pleasant to use.</Bullet>
          <Bullet delay={0.34}>Off-screen: tech reading, Linux setups, games and stories.</Bullet>
        </div>
        <div className="pxa px-in" style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, animationDelay: '0.42s' }}>
          <Px sprite={HEART} scale={3} />
          <Px sprite={HEART} scale={3} />
          <Px sprite={HEART} scale={3} />
          <span style={body(24, { color: C.inkSoft })}>3 lives — curiosity, patience and a full pot of coffee.</span>
        </div>
      </div>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 4 — Level 1-2 · Power-ups (tech stack)
// ─────────────────────────────────────────────────────────────────────────────

const PowerBlock = ({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) => (
  <Panel delay={delay} padding={26} style={{ height: 168, display: 'flex', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, width: '100%' }}>
      <div className="pxa px-bump" style={{ animationDelay: `${delay + 0.5}s` }}>
        <Px sprite={QBLOCK} scale={5} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={display(16, { color: C.ink })}>{label}</span>
          <Chip tone="ink" className="">
            {value}%
          </Chip>
        </div>
        <div style={{ marginTop: 14 }}>
          <Meter value={value} color={color} delay={delay + 0.6} />
        </div>
      </div>
    </div>
  </Panel>
);

const PowerUps: Page = () => (
  <Frame level="1-2 POWER-UPS" world="1-2" coins={148}>
    <Heading
      eyebrow="SECRET LEVEL 1-2"
      title="POWER-UPS"
      lead="Six blocks, opened daily. Each one is a tool I actually use — no inventory filler."
    />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, marginTop: 32 }}>
      <PowerBlock label="VUE.JS" value={92} color={C.green} delay={0.16} />
      <PowerBlock label="NUXT" value={88} color={C.greenDark} delay={0.22} />
      <PowerBlock label="TAILWIND CSS" value={86} color={C.blue} delay={0.28} />
      <PowerBlock label="TYPESCRIPT" value={76} color={C.blueDark} delay={0.34} />
      <PowerBlock label="NODE.JS" value={72} color={C.steel} delay={0.4} />
      <PowerBlock label="GIT" value={82} color={C.red} delay={0.46} />
    </div>
    <p className="pxa px-in" style={body(26, { margin: '28px 0 0', color: C.ink, animationDelay: '0.55s' })}>
      FULL-STACK TRAINING — no cheat codes, just repetition.
    </p>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 5 — Level 2-1 · Inventory (projects)
// ─────────────────────────────────────────────────────────────────────────────

const ProjectSlot = ({
  sprite,
  title,
  tag,
  year,
  line,
  delay,
}: {
  sprite: Sprite;
  title: string;
  tag: string;
  year: string;
  line: string;
  delay: number;
}) => (
  <Panel delay={delay} padding={24} style={{ height: 214, display: 'flex', alignItems: 'center' }}>
    <div style={{ display: 'flex', gap: 22, alignItems: 'center', width: '100%' }}>
      <div
        style={{
          width: 88,
          height: 88,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f2e2c4',
          border: `4px solid ${C.ink}`,
        }}
      >
        <Px sprite={sprite} scale={4} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={display(16, { color: C.ink })}>{title}</span>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <Chip tone="green" className="">
            {tag}
          </Chip>
          <Chip tone="ink" className="">
            {year}
          </Chip>
        </div>
        <p style={body(23, { margin: '14px 0 0', color: C.inkSoft })}>{line}</p>
      </div>
    </div>
  </Panel>
);

const Inventory: Page = () => (
  <Frame level="2-1 INVENTORY" world="2-1" coins={154}>
    <Heading eyebrow="LEVEL 2-1" title="INVENTORY" lead="Six projects in the bag — every one of them open source on GitHub." />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, marginTop: 32 }}>
      <ProjectSlot
        sprite={QBLOCK}
        title="CALCULATOR"
        tag="APP"
        year="2026"
        line="Vue + Electron desktop calculator"
        delay={0.16}
      />
      <ProjectSlot
        sprite={BRICK}
        title="DATA STRUCTURES"
        tag="LEARNING"
        year="2025"
        line="DSA practice, cleanly annotated"
        delay={0.22}
      />
      <ProjectSlot
        sprite={PIPE}
        title="FLAPPY BIRD"
        tag="GAME"
        year="2025"
        line="The 2013 classic, rebuilt from zero"
        delay={0.28}
      />
      <ProjectSlot
        sprite={STAR}
        title="GITHUB DASHBOARD"
        tag="TUI"
        year="2026"
        line="Reads your GitHub at a glance"
        delay={0.34}
      />
      <ProjectSlot
        sprite={COIN}
        title="TIKTOK DOWNLOADER"
        tag="WEB"
        year="2026"
        line="Grab videos, cleanly and fast"
        delay={0.4}
      />
      <ProjectSlot
        sprite={MUSHROOM}
        title="TODO APP"
        tag="WEB"
        year="2026"
        line="A tidy task manager, UI practice"
        delay={0.46}
      />
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 6 — Level 2-2 · Bonus stage (Flappy Bird)
// ─────────────────────────────────────────────────────────────────────────────

const PipeGate = ({ left, offset }: { left: number; offset: number }) => (
  <div
    style={{
      position: 'absolute',
      left,
      top: offset,
      width: 70,
      height: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <div>
      <Px sprite={PIPE} scale={5} flipY />
      <Px sprite={PIPE} scale={5} flipY style={{ marginTop: -6 }} />
    </div>
    <div>
      <Px sprite={PIPE} scale={5} style={{ marginBottom: -6 }} />
      <Px sprite={PIPE} scale={5} />
    </div>
  </div>
);

const BonusStage: Page = () => (
  <Frame level="2-2 BONUS STAGE" world="2-2" coins={161} tone="night">
    <Heading
      light
      eyebrow="SECRET LEVEL 2-2"
      title="BONUS STAGE"
      lead="Flappy Bird — the first project where code turned into a game."
    />
    <div
      style={{
        position: 'relative',
        height: 396,
        marginTop: 28,
        background: 'linear-gradient(180deg, #16224a 0%, #33447f 100%)',
        border: `6px solid ${C.ink}`,
        boxShadow: 'inset 0 0 0 4px rgba(255,248,231,0.16)',
        overflow: 'hidden',
      }}
    >
      <div className="pxa px-scroll" style={{ position: 'absolute', left: 0, top: 0, width: 3328, height: 400 }}>
        <PipeGate left={200} offset={-30} />
        <PipeGate left={1000} offset={30} />
        <PipeGate left={1800} offset={-30} />
        <PipeGate left={2600} offset={30} />
      </div>
      <div className="pxa px-bob" style={{ position: 'absolute', left: 640, top: 172 }}>
        <Px sprite={BIRD} scale={6} />
      </div>
      <div style={{ position: 'absolute', left: 24, top: 20, display: 'flex', gap: 26 }}>
        <span style={display(20, { color: C.cream })}>SCORE 0137</span>
        <span style={display(20, { color: C.gold })}>BEST 0420</span>
      </div>
      <div style={{ position: 'absolute', right: 24, top: 20 }}>
        <span style={display(20, { color: C.cream })}>PIPES 08</span>
      </div>
      <Ground width={1728} tone="night" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 30 }}>
      <Bullet light delay={0.2}>Physics from a single gravity constant.</Bullet>
      <Bullet light delay={0.3}>Collision checks on every pipe edge.</Bullet>
      <Bullet light delay={0.4}>One bird that refused to stay up.</Bullet>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 7 — Level 3-1 · Quest log (blog)
// ─────────────────────────────────────────────────────────────────────────────

const QuestRow = ({ no, title, meta, delay }: { no: string; title: string; meta: string; delay: number }) => (
  <div
    className="pxa px-in"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      height: 84,
      marginBottom: 12,
      padding: '0 24px',
      boxSizing: 'border-box',
      background: 'rgba(255,248,231,0.94)',
      border: `5px solid ${C.ink}`,
      boxShadow: '0 6px 0 rgba(27,35,64,0.22)',
      animationDelay: `${delay}s`,
    }}
  >
    <div style={{ flexShrink: 0 }}>
      <Px sprite={COIN} scale={2} />
    </div>
    <span style={display(14, { color: C.goldDark })}>{no}</span>
    <span style={display(16, { color: C.ink })}>{title}</span>
    <span style={{ flex: 1 }} />
    <span style={body(23, { color: C.inkSoft })}>{meta}</span>
  </div>
);

const QuestLog: Page = () => (
  <Frame level="3-1 QUEST LOG" world="3-1" coins={167}>
    <Heading eyebrow="LEVEL 3-1" title="QUEST LOG" lead="Six quests recorded — framework notes, a setup tour, and one fan screenplay." />
    <div style={{ marginTop: 26 }}>
      <QuestRow no="01" title="NUXT 3: MY FIRST IMPRESSIONS" meta="6 MIN READ · 2026" delay={0.16} />
      <QuestRow no="02" title="HOW TO USE MARKDOWN FILES" meta="22 MIN READ · 2026" delay={0.22} />
      <QuestRow no="03" title="KAMEN RIDER: A FAN SCREENPLAY" meta="18 MIN READ · 2026" delay={0.28} />
      <QuestRow no="04" title="MY DEVELOPER SETUP" meta="4 MIN READ · 2026" delay={0.34} />
      <QuestRow no="05" title="MY HOBBIES" meta="5 MIN READ · 2026" delay={0.4} />
      <QuestRow no="06" title="STYLING VUE APPS WITH TAILWIND" meta="5 MIN READ · 2026" delay={0.46} />
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 8 — Level 3-2 · Collectibles (hobbies)
// ─────────────────────────────────────────────────────────────────────────────

const CollectibleCard = ({
  sprite,
  title,
  line1,
  line2,
  delay,
}: {
  sprite: Sprite;
  title: string;
  line1: string;
  line2: string;
  delay: number;
}) => (
  <Panel delay={delay} padding={22} style={{ flex: 1, height: 356, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={{
        height: 134,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        background: '#f2e2c4',
        border: `4px solid ${C.ink}`,
      }}
    >
      <Px sprite={sprite} scale={7} />
    </div>
    <span style={display(16, { color: C.ink, marginTop: 18, textAlign: 'center' })}>{title}</span>
    <span style={body(22, { color: C.inkSoft, marginTop: 14, textAlign: 'center' })}>{line1}</span>
    <span style={body(22, { color: C.inkSoft, textAlign: 'center' })}>{line2}</span>
  </Panel>
);

const Collectibles: Page = () => (
  <Frame level="3-2 COLLECTIBLES" world="3-2" coins={173}>
    <Heading
      eyebrow="SECRET LEVEL 3-2"
      title="COLLECTIBLES"
      lead="5 of 5 collected. Off-screen, this is what fills the inventory."
    />
    <div style={{ display: 'flex', gap: 22, marginTop: 30 }}>
      <CollectibleCard sprite={STAR} title="GAMES" line1="Genshin Impact" line2="Reverse: 1999 · Strinova" delay={0.16} />
      <CollectibleCard sprite={BRICK} title="MANGA" line1="Frieren · Shadows House" line2="Magus of Library · Tàn lửa" delay={0.24} />
      <CollectibleCard sprite={BIRD} title="ANIME" line1="Sukasuka · Umamusume" line2="Urusei Yatsura" delay={0.32} />
      <CollectibleCard sprite={HERO} title="KAMEN RIDER" line1="Kabuto · Decade" line2="Double · Faiz (collected)" delay={0.4} />
      <CollectibleCard sprite={NPC} title="COSPLAY" line1="One outfit tested:" line2="Vertin — Reverse: 1999" delay={0.48} />
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 9 — Level 4-1 · Achievements
// ─────────────────────────────────────────────────────────────────────────────

const AchievementRow = ({
  sprite,
  title,
  line,
  delay,
}: {
  sprite: Sprite;
  title: string;
  line: string;
  delay: number;
}) => (
  <Panel delay={delay} padding={24} tone="ink" style={{ height: 128, display: 'flex', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, width: '100%' }}>
      <div
        style={{
          width: 76,
          height: 76,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,248,231,0.12)',
          border: `4px solid ${C.gold}`,
        }}
      >
        <Px sprite={sprite} scale={4} />
      </div>
      <div style={{ flex: 1 }}>
        <span style={display(18, { color: C.gold })}>{title}</span>
        <p style={body(25, { margin: '10px 0 0', color: 'rgba(255,248,231,0.86)' })}>{line}</p>
      </div>
      <Chip tone="green" className="">
        UNLOCKED
      </Chip>
    </div>
  </Panel>
);

const Achievements: Page = () => (
  <Frame level="4-1 ACHIEVEMENTS" world="4-1" coins={181}>
    <Heading eyebrow="LEVEL 4-1" title="ACHIEVEMENTS" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 34 }}>
      <AchievementRow
        sprite={HERO}
        title="FIRST COMMIT"
        line="Writing and shipping code in the open on GitHub as @nstcrystal, since 2024."
        delay={0.16}
      />
      <AchievementRow
        sprite={STAR}
        title="SIX PROJECTS SHIPPED"
        line="Web apps, a TUI dashboard and a game — each one built end to end."
        delay={0.24}
      />
      <AchievementRow
        sprite={QBLOCK}
        title="FULL-STACK TRAINED"
        line="Vue, Nuxt and Tailwind up front; Node.js and clean APIs behind."
        delay={0.32}
      />
    </div>
    <Panel delay={0.42} tone="parch" padding={22} style={{ marginTop: 22, height: 104, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, width: '100%' }}>
        <Px sprite={FLAG} scale={3} />
        <span style={display(18, { color: C.ink })}>HUE UNIVERSITY OF SCIENCES</span>
        <span style={{ flex: 1 }} />
        <span style={body(24, { color: C.inkSoft })}>Studying from 2024 — present</span>
      </div>
    </Panel>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 10 — Level 4-2 · Ally camp (testimonial)
// ─────────────────────────────────────────────────────────────────────────────

const QUOTE =
  'Duy has a real talent for turning ideas into working software. He approaches every problem with creativity and sharp analysis, and what he leaves behind is code that stays clean and maintainable.';

const AllyCamp: Page = () => (
  <Frame level="4-2 ALLY CAMP" world="4-2" coins={188}>
    <Heading eyebrow="SECRET LEVEL 4-2" title="ALLY CAMP" lead="An ally joined the party. This is what they say about the run so far." />
    <Panel delay={0.18} padding={38} style={{ marginTop: 34, height: 400 }}>
      <div style={{ display: 'flex', gap: 34, height: '100%', alignItems: 'center' }}>
        <div
          style={{
            width: 150,
            height: 150,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f2e2c4',
            border: `4px solid ${C.ink}`,
          }}
        >
          <div className="pxa px-bob">
            <Px sprite={NPC} scale={7} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Chip tone="gold" className="">
            VÕ QUANG CHIẾN
          </Chip>
          <p style={body(24, { margin: '12px 0 0', color: C.inkSoft })}>2giosangmitom.is-a.dev</p>
          <p style={body(34, { margin: '22px 0 0', color: C.ink, maxWidth: 1320 })}>
            <Typewriter text={`“${QUOTE}”`} delay={0.5} charDelay={0.02} caret />
          </p>
        </div>
      </div>
    </Panel>
    <div className="pxa px-blink" style={{ marginTop: 26 }}>
      <span style={display(20, { color: C.ink })}>ALLY JOINED YOUR PARTY</span>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 11 — Level 5-1 · Options (services + process) — process is ordered
// ─────────────────────────────────────────────────────────────────────────────

const ServiceRow = ({ sprite, title, line, delay }: { sprite: Sprite; title: string; line: string; delay: number }) => (
  <div className="pxa px-in" style={{ display: 'flex', gap: 20, alignItems: 'center', animationDelay: `${delay}s` }}>
    <div
      style={{
        width: 72,
        height: 72,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f2e2c4',
        border: `4px solid ${C.ink}`,
      }}
    >
      <Px sprite={sprite} scale={4} />
    </div>
    <div>
      <span style={display(16, { color: C.ink })}>{title}</span>
      <p style={body(24, { margin: '8px 0 0', color: C.inkSoft, maxWidth: 620 })}>{line}</p>
    </div>
  </div>
);

const ProcessStep = ({ no, title, line }: { no: string; title: string; line: string }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
    <Chip tone="ink" className="">
      {no}
    </Chip>
    <div style={{ flex: 1 }}>
      <span style={display(16, { color: C.ink })}>{title}</span>
      <p style={body(23, { margin: '6px 0 0', color: C.inkSoft })}>{line}</p>
    </div>
  </div>
);

const Options: Page = () => (
  <Frame level="5-1 OPTIONS" world="5-1" coins={196}>
    <Heading eyebrow="LEVEL 5-1" title="OPTIONS" lead="What I can build for you, and the route we take to ship it." />
    <div style={{ display: 'flex', gap: 56, marginTop: 34 }}>
      <div style={{ width: 704, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ServiceRow
          sprite={STAR}
          title="WEB APPS"
          line="Vue 3 and Nuxt front ends, from first sketch to deployment."
          delay={0.16}
        />
        <ServiceRow
          sprite={QBLOCK}
          title="REST APIS"
          line="Node.js back ends with clean contracts and predictable data."
          delay={0.24}
        />
        <ServiceRow
          sprite={PIPE}
          title="INTEGRATIONS"
          line="Third-party services, authentication and content pipelines."
          delay={0.32}
        />
      </div>
      <Panel delay={0.26} padding={30} style={{ flex: 1, height: 470 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <Px sprite={FLAG} scale={3} />
          <span style={display(16, { color: C.ink })}>THE ROUTE</span>
        </div>
        <Steps>
          <Step>
            <div style={{ marginBottom: 22 }}>
              <ProcessStep no="01" title="REQUIREMENTS" line="Map the goal, pin the scope, agree on done." />
            </div>
          </Step>
          <Step>
            <div style={{ marginBottom: 22 }}>
              <ProcessStep no="02" title="DESIGN" line="Screens, flows and components before code." />
            </div>
          </Step>
          <Step>
            <div style={{ marginBottom: 22 }}>
              <ProcessStep no="03" title="BUILD" line="Small, reviewable slices — no surprises." />
            </div>
          </Step>
          <Step>
            <div style={{ marginBottom: 22 }}>
              <ProcessStep no="04" title="SHIP" line="Test, deploy, then keep improving it." />
            </div>
          </Step>
        </Steps>
      </Panel>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 12 — Level 5-2 · Help (FAQ)
// ─────────────────────────────────────────────────────────────────────────────

const FaqBox = ({ q, a, delay }: { q: string; a: string; delay: number }) => (
  <Panel delay={delay} padding={26} style={{ height: 182 }}>
    <div style={{ display: 'flex', gap: 22 }}>
      <div style={{ flexShrink: 0 }}>
        <Px sprite={QBLOCK} scale={3} />
      </div>
      <div>
        <span style={display(14, { color: C.ink })}>{q}</span>
        <p style={body(26, { margin: '14px 0 0', color: C.inkSoft, maxWidth: 1480 })}>{a}</p>
      </div>
    </div>
  </Panel>
);

const Help: Page = () => (
  <Frame level="5-2 HELP" world="5-2" coins={203}>
    <Heading eyebrow="SECRET LEVEL 5-2" title="HELP" lead="The three questions that come up most often." />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 32 }}>
      <FaqBox
        q="WHAT DO YOU ENJOY MOST ABOUT THE WORK?"
        a="Seeing people actually use what I built. Closing the gap between what users need and what the code can do is the best part of the job."
        delay={0.16}
      />
      <FaqBox
        q="WHAT DO YOU DO WHEN YOU ARE NOT CODING?"
        a="Games, manga, anime, Kamen Rider and a little cosplay — mostly collecting stories and, occasionally, armour."
        delay={0.24}
      />
      <FaqBox
        q="DO YOU WORK ON OPEN SOURCE?"
        a="Yes — contributions and my own tools. Everything lives on GitHub, under @nstcrystal."
        delay={0.32}
      />
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 13 — Level 6-1 · Save & continue (contact)
// ─────────────────────────────────────────────────────────────────────────────

const PortalCard = ({ label, handle, hint, delay }: { label: string; handle: string; hint: string; delay: number }) => (
  <Panel delay={delay} padding={26} style={{ flex: 1, height: 296, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Chip tone="ink" className="">
      {label}
    </Chip>
    <div className="pxa px-bob" style={{ margin: '22px 0', animationDelay: `${delay}s` }}>
      <Px sprite={PIPE} scale={5} />
    </div>
    <span style={body(26, { color: C.ink, textAlign: 'center' })}>{handle}</span>
    <span style={body(22, { color: C.inkSoft, marginTop: 10, textAlign: 'center' })}>{hint}</span>
  </Panel>
);

const SaveContinue: Page = () => (
  <Frame level="6-1 SAVE & CONTINUE" world="6-1" coins={211}>
    <Heading eyebrow="LEVEL 6-1" title="SAVE & CONTINUE" />
    <Panel delay={0.16} tone="ink" padding={24} style={{ marginTop: 30, height: 108, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 26, width: '100%' }}>
        <div style={{ position: 'relative', width: 30, height: 30, flexShrink: 0 }}>
          <div className="pxa px-pulse" style={{ position: 'absolute', inset: 0, background: C.green, border: `4px solid ${C.ink}` }} />
        </div>
        <span style={display(20, { color: C.green })}>AVAILABLE FOR NEW PROJECTS</span>
        <span style={{ flex: 1 }} />
        <span style={body(24, { color: 'rgba(255,248,231,0.86)' })}>Open to freelance work, collaborations and a first full-time role.</span>
      </div>
    </Panel>
    <div style={{ display: 'flex', gap: 24, marginTop: 26 }}>
      <PortalCard label="EMAIL" handle="nstcrystal@gmail.com" hint="Best for a first message" delay={0.24} />
      <PortalCard label="GITHUB" handle="github.com/nstcrystal" hint="Code, repos and experiments" delay={0.32} />
      <PortalCard label="FACEBOOK" handle="fb.com/nst.crystal.1" hint="For everything else" delay={0.4} />
    </div>
    <div className="pxa px-blink" style={{ marginTop: 26 }}>
      <span style={display(18, { color: C.ink })}>NO GAME OVER — JUST A CONVERSATION</span>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// 14 — Level 6-2 · Course clear (closing)
// ─────────────────────────────────────────────────────────────────────────────

const CreditRow = ({ k, v }: { k: string; v: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
    <span style={display(14, { color: C.gold, width: 200 })}>{k}</span>
    <span style={body(26, { color: 'rgba(255,248,231,0.9)' })}>{v}</span>
  </div>
);

const CourseClearDecor = () => (
  <>
    <div className="pxa px-up" style={{ position: 'absolute', left: 320, bottom: 120 }}>
      <Px sprite={COIN} scale={6} />
    </div>
    <div className="pxa px-up" style={{ position: 'absolute', left: 760, bottom: 120, animationDelay: '1.1s' }}>
      <Px sprite={COIN} scale={6} />
    </div>
    <div className="pxa px-up" style={{ position: 'absolute', left: 1180, bottom: 120, animationDelay: '2.1s' }}>
      <Px sprite={COIN} scale={6} />
    </div>
    <div className="pxa px-up" style={{ position: 'absolute', left: 1520, bottom: 120, animationDelay: '0.6s' }}>
      <Px sprite={MUSHROOM} scale={6} />
    </div>
    <div className="pxa px-bob" style={{ position: 'absolute', right: 260, bottom: 64 }}>
      <Px sprite={HERO} scale={10} />
    </div>
  </>
);

const CourseClear: Page = () => (
  <Frame level="6-2 COURSE CLEAR" world="6-2" coins={222} tone="sunset" foreground={<CourseClearDecor />}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2
        className="pxa px-pop"
        style={display(64, { margin: 0, color: C.gold, textShadow: `7px 7px 0 ${C.ink}` })}
      >
        COURSE CLEAR!
      </h2>
      <p className="pxa px-in" style={display(24, { margin: '26px 0 0', color: C.cream, textShadow: `4px 4px 0 ${C.ink}`, animationDelay: '0.14s' })}>
        THANKS FOR PLAYING
      </p>
      <Panel delay={0.24} tone="ink" padding={34} style={{ marginTop: 40, width: 1440 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CreditRow k="BUILT WITH" v="Vue.js · Nuxt · Tailwind CSS · Nuxt UI" />
          <CreditRow k="WRITTEN IN" v="Markdown, mostly after midnight" />
          <CreditRow k="POWERED BY" v="curiosity, coffee and one stubborn bird" />
          <CreditRow k="BASE CAMP" v="Hue, Vietnam — open to remote" />
        </div>
      </Panel>
      <div className="pxa px-blink" style={{ marginTop: 44 }}>
        <span style={display(24, { color: C.ink, textShadow: `4px 4px 0 ${C.cream}` })}>PLAY AGAIN? PRESS START</span>
      </div>
      <p className="pxa px-in" style={body(24, { margin: '22px 0 0', color: C.ink, animationDelay: '0.4s' })}>
        © 2026 NSTCrystal — Võ Văn Duy · Hue, Vietnam
      </p>
    </div>
  </Frame>
);

// ─────────────────────────────────────────────────────────────────────────────
// Slide meta + pages
// ─────────────────────────────────────────────────────────────────────────────

export const meta: SlideMeta = {
  title: 'NSTCrystal — Pixel Portfolio',
  createdAt: '2026-10-13T21:26:40.035Z',
};

export default [
  TitleScreen,
  WorldMap,
  PlayerOne,
  PowerUps,
  Inventory,
  BonusStage,
  QuestLog,
  Collectibles,
  Achievements,
  AllyCamp,
  Options,
  Help,
  SaveContinue,
  CourseClear,
] satisfies Page[];
