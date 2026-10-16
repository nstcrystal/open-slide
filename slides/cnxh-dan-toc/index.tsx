import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  MorphElement,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, type Ref, useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, type MotionProps } from 'motion/react';
import communityPhoto from './assets/vietnam-community.jpg';
import craftPhoto from './assets/craft-weaving.jpg';
import schoolPhoto from './assets/mountain-school.jpg';
import gatheringPhoto from './assets/community-gathering.jpg';
import farmingPhoto from './assets/terrace-farming.jpg';
import borderPhoto from './assets/quan-dan-vung-bien.jpg';
import bridgePhoto from './assets/ha-tang-vung-cao.jpg';
import hmongMarketPhoto from './assets/hmong-coc-ly.jpg';
import stiltHousePhoto from './assets/thai-stilt-house.jpg';
import costumePhoto from './assets/hmong-costume.jpg';
import dongVanPhoto from './assets/dong-van-market.jpg';
import pagodaPhoto from './assets/chua-doi.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// Webfont (module-level, slide-keyed)
// ─────────────────────────────────────────────────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap';
const FONT_LINK_ID = 'osd-webfont-cnxh-dan-toc';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

// ─────────────────────────────────────────────────────────────────────────────
// Design system
// ─────────────────────────────────────────────────────────────────────────────
export const design: DesignSystem = {
  palette: { bg: '#f3efe6', text: '#1f2520', accent: '#8b2f2a' },
  fonts: {
    display: '"Lora", "Times New Roman", serif',
    body: '"Be Vietnam Pro", Inter, system-ui, sans-serif',
  },
  typeScale: { hero: 156, body: 38 },
  radius: 6,
};

// Extra tokens
const ink = {
  text: '#1f2520',
  soft: '#4a4036',
  muted: '#7a6f62',
  gold: '#b88a3b',
  rule: '#d7cfbf',
  panel: '#faf6ee',
  accentSoft: 'rgba(139, 47, 42, 0.12)',
};

const font = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  mono: '"Be Vietnam Pro", Inter, system-ui, sans-serif',
};

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  WebkitFontSmoothing: 'antialiased',
};

const P = 120;

const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const MORPH_MS = 640;
// Swap opaque sheets; only their contents animate. A whole-sheet crossfade
// exposes the outgoing text through the incoming page's staggered reveals.
const morphTransition: SlideTransition = {
  duration: 280,
  exit: { duration: 1, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  // Mask the old sheet immediately; the shared-element overlay owns the motion.
  enter: { duration: 1, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: MORPH_MS, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const useEntry = (delay = 0, kind: 'rise' | 'fade' | 'stamp' = 'rise'): MotionProps => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  const from = kind === 'stamp'
    ? { opacity: 0, scale: 0.97, rotate: -2 }
    : kind === 'fade'
      ? { opacity: 0 }
      : { opacity: 0, y: 10 };
  return {
    initial: active && !reducedMotion ? from : false,
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    transition: { duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : delay, ease: MOTION_EASE },
  };
};

const StrokePath = ({ d, markerEnd, delay = 0.2, duration = 0.8 }: { d: string; markerEnd?: string; delay?: number; duration?: number }) => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  return (
    <>
    <motion.path
      d={d}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={active && !reducedMotion ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration: reducedMotion ? 0 : duration, delay: reducedMotion ? 0 : delay, ease: [0.45, 0, 0.25, 1] }, opacity: { duration: reducedMotion ? 0 : 0.12, delay: reducedMotion ? 0 : delay } }}
    />
    {markerEnd && (
      <motion.path
        d={d}
        markerEnd={markerEnd}
        strokeOpacity={0}
        initial={active && !reducedMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.12, delay: reducedMotion ? 0 : delay + duration * 0.9 }}
      />
    )}
    </>
  );
};

const Reveal = ({ children, delay = 0.2, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) => (
  <motion.div {...useEntry(delay)} style={style}>{children}</motion.div>
);

const pad2 = (n: number) => String(n).padStart(2, '0');

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <motion.div
      {...useEntry(0.25, 'fade')}
      style={{
        position: 'absolute',
        left: P,
        right: P,
        bottom: 72,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: font.mono,
        fontSize: 20,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: ink.muted,
      }}
    >
      <span>CNXH KHOA HỌC · DÂN TỘC</span>
      <span>
        {pad2(current)} / {pad2(total)}
      </span>
    </motion.div>
  );
};

const Mark = () => (
  <motion.div
    {...useEntry(0.05, 'stamp')}
    style={{
      position: 'absolute',
      left: P,
      top: 88,
      width: 24,
      height: 24,
      borderRadius: 'var(--osd-radius)',
      background: 'var(--osd-accent)',
    }}
  />
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <motion.div
    {...useEntry()}
    style={{
      position: 'absolute',
      left: P + 40,
      top: 88,
      fontSize: 22,
      lineHeight: '26px',
      fontWeight: 600,
      color: 'var(--osd-accent)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </motion.div>
);

const Frame = ({
  eyebrow,
  title,
  lead,
  staticContent = false,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  staticContent?: boolean;
  children: ReactNode;
}) => {
  const leadEntry = useEntry(0.12);
  const contentEntry = useEntry(0.18);
  return (
    <div style={fill}>
      <Mark />
      <Eyebrow>{eyebrow}</Eyebrow>
      <motion.h2
        {...useEntry(0.06)}
        style={{
          position: 'absolute',
          left: P,
          top: 128,
          margin: 0,
          fontFamily: font.display,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.08,
          maxWidth: 1680,
        }}
      >
        {title}
      </motion.h2>
      {lead && (
        <motion.p
          {...leadEntry}
          style={{
            position: 'absolute',
            left: P,
            top: 222,
            margin: 0,
            maxWidth: 1400,
            fontSize: 26,
            lineHeight: 1.5,
            color: ink.soft,
          }}
        >
          {lead}
        </motion.p>
      )}
      <motion.div
        {...(staticContent ? { initial: false } : contentEntry)}
        style={{
          position: 'absolute',
          left: P,
          right: P,
          top: lead ? 318 : 256,
          bottom: 140,
        }}
      >
        {children}
      </motion.div>
      <Footer />
    </div>
  );
};

const Divider = ({ roman, label, sub }: { roman: string; label: string; sub?: string }) => {
  const subEntry = useEntry(0.22);
  return (
    <div style={fill}>
      <div
        style={{
          position: 'absolute',
          left: P,
          right: P,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <motion.div
          {...useEntry(0, 'fade')}
          style={{
            position: 'absolute',
            right: P,
            top: 120,
            fontFamily: font.display,
            fontSize: 420,
            fontWeight: 700,
            lineHeight: 0.9,
            color: 'rgba(139, 47, 42, 0.08)',
            userSelect: 'none',
          }}
        >
          {roman}
        </motion.div>
        <motion.div
          {...useEntry(0.05, 'stamp')}
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--osd-radius)',
            background: 'var(--osd-accent)',
            marginBottom: 40,
          }}
        />
        <motion.div
          {...useEntry(0.1)}
          style={{
            fontFamily: font.display,
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--osd-accent)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          {label}
        </motion.div>
        <motion.h2
          {...useEntry(0.16)}
          style={{
            margin: 0,
            fontFamily: font.display,
            fontSize: 86,
            fontWeight: 700,
            lineHeight: 1.05,
            color: 'var(--osd-text)',
            maxWidth: 1300,
          }}
        >
          {roman === 'I' && 'Khái niệm, đặc trưng cơ bản của dân tộc'}
          {roman === 'II' && 'Chủ nghĩa Mác – Lênin về vấn đề dân tộc'}
          {roman === 'III' && 'Dân tộc và quan hệ dân tộc ở Việt Nam'}
        </motion.h2>
        {sub && (
          <motion.p
            {...subEntry}
            style={{
              marginTop: 32,
              maxWidth: 980,
              fontSize: 30,
              lineHeight: 1.5,
              color: ink.soft,
            }}
          >
            {sub}
          </motion.p>
        )}
      </div>
      <Footer />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <div style={fill}>
    <img src={communityPhoto} alt="Minh họa cộng đồng ở vùng núi Việt Nam" style={{ position: 'absolute', right: 0, top: 0, width: 900, height: 1080, objectFit: 'cover', objectPosition: '70% center' }} />
    <div style={{ position: 'absolute', right: 0, top: 0, width: 1040, height: 1080, background: 'linear-gradient(90deg, #f3efe6 0%, rgba(243,239,230,.86) 12%, rgba(243,239,230,0) 45%)' }} />
    <motion.div {...useEntry(0.05)} style={{ position: 'absolute', left: P, top: 94, fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--osd-accent)' }}>CHỦ NGHĨA XÃ HỘI KHOA HỌC / NHÓM 3</motion.div>
    <div style={{ position: 'absolute', left: P, top: 240, width: 1010 }}>
      <motion.div {...useEntry(0.1, 'fade')} style={{ width: 96, height: 8, background: 'var(--osd-accent)', marginBottom: 38, transformOrigin: 'left' }} />
      <motion.h1 {...useEntry(0.15)} style={{ margin: 0, fontFamily: font.display, fontSize: 93, lineHeight: 1.07, letterSpacing: '-0.04em', fontWeight: 700 }}>Vấn đề dân tộc<br />trong thời kỳ<br />quá độ lên CNXH</motion.h1>
      <motion.p {...useEntry(0.24)} style={{ margin: '34px 0 0', maxWidth: 870, fontSize: 30, lineHeight: 1.45, color: ink.soft }}>Hai cách hiểu về dân tộc, cương lĩnh Lênin và chính sách dân tộc ở Việt Nam.</motion.p>
    </div>
    <motion.div {...useEntry(0.32)} style={{ position: 'absolute', left: P, top: 760, width: 900, fontSize: 22, lineHeight: 1.48, color: ink.soft }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--osd-accent)', marginBottom: 8 }}>THÀNH VIÊN NHÓM 3</div>
      Thu Nhớ · Thảo My · Thảo Nguyên · Sơn<br />
      Trường Sơn · Nhất Vũ · Hoàng Thiện · Quang Chiến<br />
      Văn Duy · Phạm Quỳnh · Minh Nhật · Quang Minh · Đức Vũ
    </motion.div>
    <Footer />
  </div>
);

const DivConcept = () => <Divider roman="I" label="CHƯƠNG I" sub="Dân tộc theo nghĩa rộng và nghĩa hẹp" />;

const TimelineItem = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <motion.div {...useEntry(0.15 + Number(number) * 0.12)} style={{ position: 'relative', zIndex: 1, height: '100%', padding: '44px 24px 0 22px', boxSizing: 'border-box', borderLeft: number === '01' ? undefined : `1px solid ${ink.rule}` }}>
    <div style={{ fontFamily: font.display, fontSize: 112, lineHeight: 1, color: 'rgba(139, 47, 42, 0.21)', fontWeight: 700 }}>{number}</div>
    <div style={{ position: 'absolute', left: 22, top: 211, width: 18, height: 18, borderRadius: '50%', background: 'var(--osd-accent)', boxShadow: '0 0 0 8px var(--osd-bg)' }} />
    <div style={{ marginTop: 112, fontFamily: font.display, fontSize: 44, lineHeight: 1.15, fontWeight: 700 }}>{title}</div>
    <div style={{ marginTop: 20, fontSize: 27, lineHeight: 1.46, color: ink.soft }}>{description}</div>
  </motion.div>
);

const TimelineRule = () => (
  <svg width={1680} height={260} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
    <g fill="none" stroke="var(--osd-accent)" strokeWidth={3}>
      <StrokePath d="M31 220 H1291" delay={0.2} duration={1.05} />
    </g>
  </svg>
);

const ConceptTimeline: Page = () => (
  <Frame staticContent eyebrow="Chương I" title="Từ thị tộc đến dân tộc">
    <div style={{ position: 'relative', height: '100%' }}>
      <TimelineRule />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '100%', width: '100%' }}>
        <TimelineItem number="01" title="Thị tộc" description="Cộng đồng người có quan hệ huyết thống, cùng lao động và sinh hoạt." />
        <TimelineItem number="02" title="Bộ lạc" description="Nhiều thị tộc liên kết, có lãnh thổ và sinh hoạt chung." />
        <TimelineItem number="03" title="Bộ tộc" description="Cộng đồng rộng hơn, ngôn ngữ và văn hóa dần ổn định." />
        <TimelineItem number="04" title="Dân tộc" description="Cộng đồng ổn định với những mối liên hệ kinh tế, văn hóa, chính trị." />
      </div>
    </div>
  </Frame>
);

const BranchRow = ({ number, label, detail }: { number: string; label: string; detail?: string }) => (
  <motion.div {...useEntry(0.4 + Number(number) * 0.09)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 28, height: 92, boxSizing: 'border-box' }}>
    <span style={{ fontFamily: font.display, fontSize: 34, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 56 }}>{number}</span>
    <span style={{ fontSize: 30, lineHeight: 1.35, color: ink.text }}>{label}{detail && <small style={{ display: 'block', fontSize: 22, color: ink.muted, marginTop: 3 }}>{detail}</small>}</span>
  </motion.div>
);

// Fixed geometry: every branch lands at the left edge and centre of its node.
const ConceptBranches = ({ narrow = false }: { narrow?: boolean }) => (
  <svg width={1680} height={622} viewBox="0 0 1680 622" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
    <g fill="none" stroke="var(--osd-accent)" strokeWidth={3}>
      <StrokePath d="M540 311 H630" delay={0.15} duration={0.35} />
      <StrokePath d={narrow ? 'M630 135 V487' : 'M630 87 V535'} delay={0.3} duration={0.6} />
      <StrokePath d={narrow ? 'M630 135 H720' : 'M630 87 H720'} delay={0.4} duration={0.4} />
      <StrokePath d={narrow ? 'M630 311 H720' : 'M630 199 H720'} delay={0.49} duration={0.4} />
      <StrokePath d={narrow ? 'M630 487 H720' : 'M630 311 H720'} delay={0.58} duration={0.4} />
      {!narrow && <StrokePath d="M630 423 H720" delay={0.67} duration={0.4} />}
      {!narrow && <StrokePath d="M630 535 H720" delay={0.76} duration={0.4} />}
    </g>
  </svg>
);

const NationDiagram: Page = () => (
  <Frame staticContent eyebrow="Chương I · 1" title="Dân tộc theo nghĩa rộng" lead="Dân tộc theo nghĩa rộng là cộng đồng người ổn định làm thành nhân dân một nước.">
    <div style={{ position: 'relative', height: 622 }}>
      <ConceptBranches />
      <Reveal delay={0.1} style={{ background: 'var(--osd-accent)', color: '#fff', position: 'absolute', left: 0, top: 0, width: 540, height: 622 }}>
        <img src={farmingPhoto} alt="Cảnh đồng ruộng miền núi" style={{ width: '100%', height: 246, objectFit: 'cover', filter: 'saturate(.75)' }} />
        <div style={{ padding: '25px 34px' }}>
          <div style={{ fontSize: 23, letterSpacing: '0.12em' }}>NGHĨA RỘNG · QUỐC GIA</div>
          <div style={{ fontFamily: font.display, fontSize: 45, lineHeight: 1.12, marginTop: 10 }}>Một cộng đồng quốc gia</div>
          <div style={{ fontSize: 23, lineHeight: 1.38, marginTop: 16 }}>Gắn bó bởi quyền lợi chính trị, kinh tế, truyền thống văn hóa và lịch sử dựng nước, giữ nước.</div>
          <div style={{ fontSize: 25, marginTop: 18 }}>Ví dụ: Việt Nam, Nhật Bản</div>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 41, width: 960, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <BranchRow number="01" label="Có chung vùng lãnh thổ ổn định" />
        <BranchRow number="02" label="Có chung phương thức sinh hoạt kinh tế" />
        <BranchRow number="03" label="Có chung ngôn ngữ giao tiếp" />
        <BranchRow number="04" label="Có chung nền văn hóa và tâm lý" />
        <BranchRow number="05" label="Có chung một nhà nước" />
      </div>
    </div>
  </Frame>
);

const EthnieDiagram: Page = () => (
  <Frame staticContent eyebrow="Chương I · 1" title="Dân tộc theo nghĩa hẹp" lead="Dân tộc theo nghĩa hẹp là cộng đồng tộc người hình thành trong lịch sử, có liên hệ bền vững.">
    <div style={{ position: 'relative', height: 622 }}>
      <ConceptBranches narrow />
      <Reveal delay={0.1} style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 622, boxSizing: 'border-box', background: ink.panel, border: `1px solid ${ink.rule}` }}>
        <img src={gatheringPhoto} alt="Sinh hoạt văn hóa cộng đồng" style={{ width: '100%', height: 365, objectFit: 'cover' }} />
        <div style={{ padding: '26px 34px' }}><div style={{ fontFamily: font.display, fontSize: 43, fontWeight: 700 }}>Một cộng đồng tộc người</div><div style={{ fontSize: 27, color: ink.soft, marginTop: 12 }}>Ví dụ: dân tộc Kinh, dân tộc Thái</div></div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 89, width: 960, display: 'flex', flexDirection: 'column', gap: 84 }}>
        <BranchRow number="01" label="Cộng đồng về ngôn ngữ" />
        <BranchRow number="02" label="Cộng đồng về văn hóa" />
        <BranchRow number="03" label="Ý thức tự giác tộc người" />
      </div>
    </div>
  </Frame>
);

const CompareRow = ({ criterion, nation, ethnie, header = false }: { criterion: string; nation: string; ethnie: string; header?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 1fr', gap: 24, padding: '12px 22px', minHeight: 72, alignItems: 'center', background: header ? 'var(--osd-accent)' : ink.panel, color: header ? '#fff' : ink.text, border: header ? 'none' : `1px solid ${ink.rule}`, fontSize: 25, lineHeight: 1.28, fontWeight: header ? 700 : 500 }}>
    <div>{criterion}</div><div>{nation}</div><div>{ethnie}</div>
  </div>
);

const TableCompare: Page = () => (
  <Frame eyebrow="Chương I · 1" title="Bảng phân biệt hai nghĩa">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'center' }}>
      <CompareRow header criterion="Tiêu chí" nation="Nghĩa rộng · Quốc gia" ethnie="Nghĩa hẹp · Tộc người" />
      <CompareRow criterion="Đối tượng" nation="Nhân dân một nước" ethnie="Cộng đồng tộc người" />
      <CompareRow criterion="Lãnh thổ" nation="Chung, ổn định" ethnie="Không nêu là đặc trưng riêng" />
      <CompareRow criterion="Kinh tế / nhà nước" nation="Kinh tế thống nhất; một nhà nước" ethnie="Không nêu là đặc trưng riêng" />
      <CompareRow criterion="Ngôn ngữ" nation="Ngôn ngữ chung" ethnie="Ngôn ngữ chung" />
      <CompareRow criterion="Văn hóa / ý thức" nation="Văn hóa, tâm lý chung" ethnie="Văn hóa chung; ý thức tự giác" />
      <CompareRow criterion="Ví dụ" nation="Việt Nam, Nhật Bản" ethnie="Kinh, Thái" />
    </div>
  </Frame>
);

const DivMarx = () => <Divider roman="II" label="CHƯƠNG II" sub="Quan hệ dân tộc và cương lĩnh Lênin" />;

const TrendNode = ({ x, y, mode }: { x: number; y: number; mode: 'separate' | 'unite' }) => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  return (
    <motion.circle
      r={22}
      fill={mode === 'separate' ? '#8b2f2a' : '#2f6671'}
      initial={active && !reducedMotion ? { cx: mode === 'separate' ? 230 : x < 230 ? x - 24 : x + 24, cy: mode === 'separate' ? 95 : y, opacity: 0 } : false}
      animate={{ cx: x, cy: y, opacity: 0.76 }}
      transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.15, ease: MOTION_EASE }}
    />
  );
};

const TrendVisual = ({ mode }: { mode: 'separate' | 'unite' }) => {
  const color = mode === 'separate' ? '#8b2f2a' : '#2f6671';
  const arrowId = `cnxh-trend-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 460 190" style={{ display: 'block', width: '100%', height: 174 }} aria-hidden="true">
      <defs><marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 L9 5 L1 9 Z" fill={color} /></marker></defs>
      {mode === 'separate' ? (
        <g stroke={color} strokeWidth="5" fill="none">
          <StrokePath d="M198 80 L98 42" markerEnd={`url(#${arrowId})`} delay={0.2} />
          <StrokePath d="M198 110 L98 148" markerEnd={`url(#${arrowId})`} delay={0.3} />
          <StrokePath d="M262 80 L362 42" markerEnd={`url(#${arrowId})`} delay={0.4} />
          <StrokePath d="M262 110 L362 148" markerEnd={`url(#${arrowId})`} delay={0.5} />
        </g>
      ) : (
        <g stroke={color} strokeWidth="5" fill="none">
          <StrokePath d="M90 39 L188 80" markerEnd={`url(#${arrowId})`} delay={0.2} />
          <StrokePath d="M90 151 L188 110" markerEnd={`url(#${arrowId})`} delay={0.3} />
          <StrokePath d="M370 39 L272 80" markerEnd={`url(#${arrowId})`} delay={0.4} />
          <StrokePath d="M370 151 L272 110" markerEnd={`url(#${arrowId})`} delay={0.5} />
        </g>
      )}
      <circle cx="230" cy="95" r="43" fill={color} />
      <TrendNode x={69} y={31} mode={mode} /><TrendNode x={69} y={159} mode={mode} />
      <TrendNode x={391} y={31} mode={mode} /><TrendNode x={391} y={159} mode={mode} />
    </svg>
  );
};

const TrendCard = ({ number, title, cause, result, mode }: { number: string; title: string; cause: string; result: string; mode: 'separate' | 'unite' }) => (
  <motion.div {...useEntry(0.1 + Number(number) * 0.1)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderTop: `7px solid ${mode === 'separate' ? '#8b2f2a' : '#2f6671'}`, padding: 34, height: '100%', boxSizing: 'border-box' }}>
    <div style={{ color: mode === 'separate' ? '#8b2f2a' : '#2f6671', fontSize: 24, fontWeight: 700 }}>XU HƯỚNG {number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 39, lineHeight: 1.18, margin: '12px 0 8px', minHeight: 92 }}>{title}</h3>
    <TrendVisual mode={mode} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft, marginTop: 10 }}><strong>Cơ sở:</strong> {cause}</div>
    <div style={{ height: 2, background: ink.rule, margin: '18px 0' }} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft }}><strong>Biểu hiện:</strong> {result}</div>
  </motion.div>
);

const TwoTrends: Page = () => (
  <Frame staticContent eyebrow="Chương II · 2.1" title="Hai xu hướng khách quan">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, height: '100%' }}>
      <TrendCard number="01" mode="separate" title="Tách ra, hình thành dân tộc độc lập" cause="Sự thức tỉnh về ý thức dân tộc." result="Đấu tranh giải phóng dân tộc, thoát khỏi áp bức, đô hộ." />
      <TrendCard number="02" mode="unite" title="Các dân tộc liên hiệp lại" cause="Sự phát triển của lực lượng sản xuất, khoa học công nghệ và giao lưu." result="Các dân tộc tăng cường hợp tác trong và ngoài quốc gia." />
    </div>
  </Frame>
);

const TrendCell = ({ label, text }: { label: string; text: string }) => (
  <div style={{ background: ink.panel, border: `1px solid ${ink.rule}`, padding: '24px 30px' }}><div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)', marginBottom: 12 }}>{label}</div><div style={{ fontSize: 27, lineHeight: 1.42, color: ink.soft }}>{text}</div></div>
);

const TrendContexts: Page = () => (
  <Frame eyebrow="Chương II · 2.1" title="Biểu hiện trong nước và quốc tế">
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gridTemplateRows: '64px 1fr 1fr', gap: 14, height: '100%' }}>
      <div />
      <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--osd-accent)', alignSelf: 'center' }}>TRONG MỘT QUỐC GIA</div>
      <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--osd-accent)', alignSelf: 'center' }}>TRÊN PHẠM VI QUỐC TẾ</div>
      <div style={{ background: 'var(--osd-accent)', color: '#fff', padding: 28, fontFamily: font.display, fontSize: 35, lineHeight: 1.2 }}>01<br />Tách ra</div>
      <TrendCell label="QUYỀN TỰ DO, BÌNH ĐẲNG" text="Nỗ lực của từng tộc người để có tự do, bình đẳng và sự phát triển của cộng đồng mình." />
      <TrendCell label="ĐẤU TRANH GIẢI PHÓNG" text="Phong trào giành độc lập dân tộc; đấu tranh chống chủ nghĩa thực dân và chính sách đô hộ." />
      <div style={{ background: ink.gold, color: '#fff', padding: 28, fontFamily: font.display, fontSize: 35, lineHeight: 1.2 }}>02<br />Liên hiệp</div>
      <TrendCell label="XÍCH LẠI GẦN NHAU" text="Các dân tộc tăng cường gắn bó, hợp tác trên nhiều lĩnh vực trong một quốc gia." />
      <TrendCell label="HỢP TÁC KHU VỰC, TOÀN CẦU" text="Các dân tộc hợp tác và hình thành liên minh ở phạm vi khu vực hoặc toàn cầu." />
    </div>
  </Frame>
);

const PillarCard = ({ number, title, detail, expanded = false }: { number: string; title: string; detail: string; expanded?: boolean }) => (
  <div style={{ position: 'absolute', left: (Number(number) - 1) * 572, top: expanded ? 24 : 154, width: 536, height: expanded ? 620 : 510, color: expanded ? ink.text : '#fff' }}>
    <MorphElement id={`lenin-principle-${number}`}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: expanded ? ink.panel : 'var(--osd-accent)', borderRadius: 6 }} />
    </MorphElement>
    <MorphElement id={`lenin-number-${number}`}>
      <div style={{ position: 'absolute', left: 38, top: 38, width: 100, height: 86, fontFamily: font.display, fontSize: 72, lineHeight: 1, opacity: 0.7, color: expanded ? 'var(--osd-accent)' : '#fff' }}>{number}</div>
    </MorphElement>
    <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 38, right: 38, top: 134 }}>
      <h3 style={{ fontFamily: font.display, fontSize: 38, lineHeight: 1.2, margin: 0, minHeight: 138 }}>{title}</h3>
      <p style={{ fontSize: 28, lineHeight: 1.5, margin: '24px 0 0' }}>{detail}</p>
    </Reveal>
  </div>
);

const LeninPillars: Page = () => (
  <Frame staticContent eyebrow="Chương II · 2.2" title="Cương lĩnh dân tộc của Lênin">
    <div style={{ position: 'relative', height: 684 }}>
      <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 572, top: 0, width: 536, height: 64, background: ink.panel, border: `1px solid ${ink.rule}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 600 }}>BA NGUYÊN TẮC GẮN BÓ</Reveal>
      <svg width={1680} height={154} style={{ position: 'absolute', top: 0, left: 0 }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth={3}>
          <StrokePath d="M840 64 V104 H268 V154" delay={0.75} />
          <StrokePath d="M840 104 V154" delay={0.85} duration={0.5} />
          <StrokePath d="M840 104 H1412 V154" delay={0.95} />
        </g>
      </svg>
      <PillarCard number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Quyền và nghĩa vụ ngang nhau; chống áp bức và phân biệt dân tộc." />
      <PillarCard number="02" title="Các dân tộc được quyền tự quyết" detail="Tự chọn con đường phát triển; quyết định việc chia tách hoặc liên hiệp." />
      <PillarCard number="03" title="Liên hiệp công nhân các dân tộc" detail="Liên hiệp tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích chung." />
    </div>
  </Frame>
);

const LeninDetail: Page = () => (
  <Frame staticContent eyebrow="Chương II · 2.2" title="Nội dung của ba nguyên tắc">
    <div style={{ position: 'relative', height: 684 }}>
      <PillarCard expanded number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Các dân tộc có quyền và nghĩa vụ ngang nhau; trong một quốc gia, quyền này cần được pháp luật bảo đảm và thực thi." />
      <PillarCard expanded number="02" title="Các dân tộc được quyền tự quyết" detail="Dân tộc tự chọn con đường phát triển, quyết định việc chia tách hoặc liên hiệp; phản đối can thiệp vào công việc nội bộ." />
      <PillarCard expanded number="03" title="Liên hiệp công nhân các dân tộc" detail="Liên hiệp công nhân trên cơ sở tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc." />
    </div>
  </Frame>
);

LeninPillars.transition = morphTransition;
LeninDetail.transition = morphTransition;

const DivVN = () => <Divider roman="III" label="CHƯƠNG III" sub="54 dân tộc và chính sách dân tộc ở Việt Nam" />;

const FeatureNode = ({ number, side, children }: { number: string; side: 'left' | 'right'; children: ReactNode }) => (
  <motion.div {...useEntry(0.35 + ((Number(number) - 1) % 3) * 0.14)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderRight: side === 'left' ? '5px solid var(--osd-accent)' : undefined, borderLeft: side === 'right' ? '5px solid var(--osd-accent)' : undefined, height: 146, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 25px', boxSizing: 'border-box' }}>
    <span style={{ fontFamily: font.display, fontSize: 38, color: 'var(--osd-accent)', fontWeight: 700 }}>{number}</span>
    <span style={{ fontSize: 28, lineHeight: 1.36 }}>{children}</span>
  </motion.div>
);

const VNFeatures: Page = () => (
  <Frame staticContent eyebrow="Chương III · 3.1" title="Sáu đặc điểm dân tộc Việt Nam">
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '630px 360px 630px', gap: 30, height: 684, alignItems: 'center' }}>
      <svg viewBox="0 0 1680 684" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth="3" opacity=".65">
          <StrokePath d="M730 230 C660 230 690 172 630 172" delay={0.2} /><StrokePath d="M680 342 H630" delay={0.34} /><StrokePath d="M730 454 C660 454 690 512 630 512" delay={0.48} />
          <StrokePath d="M950 230 C1020 230 990 172 1050 172" delay={0.2} /><StrokePath d="M1000 342 H1050" delay={0.34} /><StrokePath d="M950 454 C1020 454 990 512 1050 512" delay={0.48} />
        </g>
      </svg>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <FeatureNode number="01" side="left">Chênh lệch số dân giữa các tộc người</FeatureNode>
        <FeatureNode number="02" side="left">Cư trú xen kẽ với nhau</FeatureNode>
        <FeatureNode number="03" side="left">Dân tộc thiểu số chủ yếu ở địa bàn chiến lược</FeatureNode>
      </div>
      <div style={{ position: 'relative', width: 320, height: 320, justifySelf: 'center', borderRadius: '50%', background: ink.panel, border: '8px solid var(--osd-accent)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.12em' }}>VIỆT NAM</div>
        <div style={{ fontFamily: font.display, fontSize: 112, fontWeight: 700, lineHeight: 1.05 }}>54</div>
        <div style={{ fontSize: 29, fontWeight: 600 }}>dân tộc</div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <FeatureNode number="04" side="right">Trình độ phát triển không đều</FeatureNode>
        <FeatureNode number="05" side="right">Truyền thống đoàn kết gắn bó lâu đời</FeatureNode>
        <FeatureNode number="06" side="right">Bản sắc riêng làm phong phú văn hóa chung</FeatureNode>
      </div>
    </div>
  </Frame>
);

const ViewPoint = ({ number, text }: { number: string; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: ink.panel, borderLeft: '5px solid var(--osd-accent)', padding: '14px 24px' }}><span style={{ fontFamily: font.display, fontSize: 40, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 58 }}>{number}</span><span style={{ fontSize: 26, lineHeight: 1.35 }}>{text}</span></div>
);

const PartyView: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Quan điểm về vấn đề dân tộc">
    <div style={{ display: 'grid', gridTemplateColumns: '540px 1fr', gap: 40, height: '100%' }}>
      <img src={gatheringPhoto} alt="Sinh hoạt cộng đồng" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '56% center' }} />
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gap: 9 }}>
        <ViewPoint number="01" text="Vấn đề dân tộc và đoàn kết dân tộc có ý nghĩa chiến lược, lâu dài và cấp bách." />
        <ViewPoint number="02" text="Các dân tộc bình đẳng, đoàn kết, tương trợ, giúp nhau cùng phát triển; chống chia rẽ." />
        <ViewPoint number="03" text="Phát triển toàn diện chính trị, kinh tế, văn hóa, xã hội và quốc phòng – an ninh." />
        <ViewPoint number="04" text="Ưu tiên đầu tư vùng dân tộc, miền núi; phát triển hạ tầng và giảm nghèo." />
        <ViewPoint number="05" text="Công tác dân tộc là nhiệm vụ của toàn Đảng, toàn dân, toàn quân và hệ thống chính trị." />
      </div>
    </div>
  </Frame>
);

const PolicyCard = ({ number, title, detail, image, alt, expanded = false }: { number: string; title: string; detail: string; image: string; alt: string; expanded?: boolean }) => (
  <div style={{ position: 'absolute', left: (Number(number) - 1) * (expanded ? 857 : 340), top: expanded ? 0 : 150, width: expanded ? 823 : 320, height: expanded ? 650 : 526 }}>
    <MorphElement id={`policy-${number}`}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: ink.panel, borderTop: '6px solid var(--osd-accent)', boxSizing: 'border-box' }} />
    </MorphElement>
    <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 0, right: 0, top: 6 }}>
      <img src={image} alt={alt} style={{ display: 'block', width: '100%', height: expanded ? 235 : 145, objectFit: 'cover', filter: 'saturate(.82)' }} />
    </Reveal>
    <MorphElement id={`policy-number-${number}`}>
      <div style={{ position: 'absolute', left: expanded ? 32 : 22, top: expanded ? 265 : 171, width: 64, height: 28, fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    </MorphElement>
    <Reveal delay={MORPH_MS / 1000 + 0.06} style={{ position: 'absolute', left: expanded ? 32 : 22, right: expanded ? 32 : 22, top: expanded ? 293 : 199 }}>
      <h3 style={{ fontFamily: font.display, fontSize: expanded ? 40 : 30, lineHeight: 1.17, margin: '8px 0 12px', minHeight: 70 }}>{title}</h3>
      <p style={{ fontSize: expanded ? 28 : 24, lineHeight: 1.4, color: ink.soft, margin: 0 }}>{detail}</p>
    </Reveal>
  </div>
);

const PolicyMatrix: Page = () => (
  <Frame staticContent eyebrow="Chương III · 3.2" title="Sơ đồ / Năm lĩnh vực chính sách">
    <div style={{ position: 'relative', height: 684 }}>
      <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 500, top: 0, width: 680, height: 70, display: 'grid', placeItems: 'center', background: 'var(--osd-accent)', color: '#fff', fontFamily: font.display, fontSize: 38, fontWeight: 700 }}>CHÍNH SÁCH DÂN TỘC</Reveal>
      <svg width={1680} height={150} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth={3}>
          <StrokePath d="M840 70 V106" delay={0.7} duration={0.3} />
          <StrokePath d="M840 106 H160 V150" delay={0.85} />
          <StrokePath d="M500 106 V150" delay={0.95} duration={0.4} />
          <StrokePath d="M840 106 V150" delay={1} duration={0.4} />
          <StrokePath d="M840 106 H1520 V150" delay={0.85} />
          <StrokePath d="M1180 106 V150" delay={0.95} duration={0.4} />
        </g>
      </svg>
        <PolicyCard number="01" title="Chính trị" detail="Bình đẳng, đoàn kết, tôn trọng và giúp nhau phát triển." image={gatheringPhoto} alt="Sinh hoạt cộng đồng" />
        <PolicyCard number="02" title="Kinh tế" detail="Phát huy tiềm năng, thu hẹp chênh lệch giữa các vùng." image={bridgePhoto} alt="Cầu đường ở miền núi" />
        <PolicyCard number="03" title="Xã hội" detail="An sinh, giáo dục, y tế và công bằng xã hội." image={schoolPhoto} alt="Trường học miền núi" />
        <PolicyCard number="04" title="Văn hóa" detail="Giữ bản sắc, nâng trình độ và mở rộng giao lưu." image={craftPhoto} alt="Nghề dệt truyền thống" />
        <PolicyCard number="05" title="Quốc phòng – an ninh" detail="Ổn định chính trị, trật tự và quan hệ quân dân." image={borderPhoto} alt="Cán bộ và người dân trò chuyện" />
    </div>
  </Frame>
);

const PolicyPoliticalEconomic: Page = () => (
  <Frame staticContent eyebrow="Chương III · 3.2" title="Chính sách chính trị và kinh tế">
    <div style={{ position: 'relative', height: 684 }}>
      <PolicyCard expanded number="01" title="Chính trị" detail="Thực hiện bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển; nâng cao nhận thức của đồng bào về đoàn kết dân tộc." image={gatheringPhoto} alt="Sinh hoạt cộng đồng" />
      <PolicyCard expanded number="02" title="Kinh tế" detail="Phát huy tiềm năng vùng miền núi, dân tộc thiểu số; triển khai chương trình phát triển, thu hẹp chênh lệch và thúc đẩy kinh tế thị trường định hướng XHCN." image={bridgePhoto} alt="Cầu đường ở miền núi" />
    </div>
  </Frame>
);

PolicyMatrix.transition = morphTransition;
PolicyPoliticalEconomic.transition = morphTransition;

const PolicySocial: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách xã hội">
    <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 44, height: '100%' }}>
      <img src={schoolPhoto} alt="Trường học miền núi" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '66% center' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ background: ink.panel, padding: 28, borderLeft: '5px solid var(--osd-accent)', fontSize: 29, lineHeight: 1.45 }}>Bảo đảm an sinh xã hội cho đồng bào dân tộc thiểu số.</div>
        <div style={{ background: ink.panel, padding: 28, borderLeft: '5px solid var(--osd-accent)', fontSize: 29, lineHeight: 1.45 }}>Thực hiện bình đẳng, công bằng xã hội thông qua chính sách phát triển.</div>
        <div style={{ background: ink.panel, padding: 28, borderLeft: '5px solid var(--osd-accent)', fontSize: 29, lineHeight: 1.45 }}>Quan tâm giảm nghèo, dân số, y tế và giáo dục.</div>
      </div>
    </div>
  </Frame>
);

const CulturePoint = ({ number, text }: { number: string; text: string }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'center', borderBottom: `1px solid ${ink.rule}`, padding: '9px 0' }}><span style={{ color: 'var(--osd-accent)', fontSize: 27, fontWeight: 700, minWidth: 40 }}>{number}</span><span style={{ fontSize: 25, lineHeight: 1.35 }}>{text}</span></div>
);

const PolicyCulture: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách văn hóa">
    <div style={{ display: 'grid', gridTemplateColumns: '650px 1fr', gap: 44, height: '100%' }}>
      <img src={craftPhoto} alt="Nghề dệt truyền thống" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '44% center' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CulturePoint number="01" text="Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc." />
        <CulturePoint number="02" text="Giữ gìn và phát huy giá trị văn hóa truyền thống của các tộc người." />
        <CulturePoint number="03" text="Nâng cao trình độ văn hóa cho nhân dân các dân tộc." />
        <CulturePoint number="04" text="Đào tạo cán bộ văn hóa, xây dựng môi trường và thiết chế văn hóa phù hợp." />
        <CulturePoint number="05" text="Mở rộng giao lưu văn hóa với quốc gia, khu vực và thế giới." />
        <CulturePoint number="06" text="Đấu tranh chống tệ nạn xã hội và diễn biến hòa bình trên mặt trận văn hóa – tư tưởng." />
      </div>
    </div>
  </Frame>
);

const PolicySecurity: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách quốc phòng – an ninh">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 44, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        <div style={{ background: ink.panel, borderLeft: '7px solid var(--osd-accent)', padding: 38 }}><div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, marginBottom: 20 }}>Bảo vệ Tổ quốc</div><div style={{ fontSize: 30, lineHeight: 1.48 }}>Bảo đảm ổn định chính trị, an ninh và trật tự an toàn xã hội ở vùng đồng bào dân tộc.</div></div>
        <div style={{ background: ink.panel, borderLeft: '7px solid '+ink.gold, padding: 38 }}><div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, marginBottom: 20 }}>Quan hệ quân dân</div><div style={{ fontSize: 30, lineHeight: 1.48 }}>Tăng cường gắn bó quân dân, tạo thế trận quốc phòng toàn dân tại địa bàn cư trú.</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', background: ink.panel }}>
        <img src={borderPhoto} alt="Cán bộ và người dân trò chuyện" style={{ width: '100%', height: 520, objectFit: 'cover', objectPosition: 'center 35%', filter: 'saturate(.82)' }} />
        <div style={{ padding: '22px 30px', fontSize: 25, lineHeight: 1.4, color: ink.soft }}>Quan hệ quân dân ở vùng đồng bào dân tộc.</div>
      </div>
    </div>
  </Frame>
);

const Practice: Page = () => (
  <Frame eyebrow="Liên hệ thực tiễn" title="Việc sinh viên có thể làm">
    <div style={{ display: 'grid', gridTemplateColumns: '620px 1fr', gap: 48, height: '100%' }}>
      <div style={{ background: ink.panel }}>
        <img src={craftPhoto} alt="Cảnh truyền nghề dệt" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ borderBottom: `1px solid ${ink.rule}`, paddingBottom: 22 }}><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>01 / TÌM HIỂU</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Tìm hiểu lịch sử, ngôn ngữ và văn hóa của các cộng đồng dân tộc.</div></div>
        <div style={{ borderBottom: `1px solid ${ink.rule}`, paddingBottom: 22 }}><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>02 / TÔN TRỌNG</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Tôn trọng khác biệt, tránh định kiến và cách nói gây tổn thương.</div></div>
        <div><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>03 / CHIA SẺ CÓ TRÁCH NHIỆM</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Kiểm chứng thông tin trước khi chia sẻ; không tiếp tay cho nội dung kích động chia rẽ.</div></div>
      </div>
    </div>
  </Frame>
);

const SummaryPoint = ({ number, children }: { number: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 30, background: ink.panel, padding: '25px 32px' }}><div style={{ width: 78, height: 78, borderRadius: '50%', background: 'var(--osd-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 700, flexShrink: 0 }}>{number}</div><div style={{ fontSize: 31, lineHeight: 1.4 }}>{children}</div></div>
);

const Summary: Page = () => (
  <Frame eyebrow="Tổng kết" title="Ba điểm cần nhớ">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 25, justifyContent: 'center', height: '100%' }}>
      <SummaryPoint number="01">Dân tộc có nghĩa rộng và nghĩa hẹp, với các đặc trưng khác nhau.</SummaryPoint>
      <SummaryPoint number="02">Quan hệ dân tộc có hai xu hướng; cương lĩnh Lênin gồm ba nội dung.</SummaryPoint>
      <SummaryPoint number="03">Việt Nam có 54 dân tộc; chính sách dân tộc được trình bày theo năm lĩnh vực.</SummaryPoint>
    </div>
  </Frame>
);

// Interactive interlude: Pommi-inspired stickers, chunky outlines and soft springs.
// One game page keeps the existing deck/notes order intact.
// Classroom game, styled with the deck's own tokens: panel cards, thin rules,
// serif headings and the single red accent. No separate visual language.
type QuizQuestion = { topic: string; question: string; options: readonly [string, string, string, string]; correct: number; explanation: string; img: string; alt: string };
const quizQuestions: readonly QuizQuestion[] = [
  { topic: 'Khởi động · Chương I', question: 'Thứ tự hình thành các cộng đồng người là gì?', options: ['Bộ lạc → thị tộc → dân tộc → bộ tộc', 'Thị tộc → bộ lạc → bộ tộc → dân tộc', 'Thị tộc → bộ tộc → bộ lạc → dân tộc', 'Dân tộc → bộ tộc → bộ lạc → thị tộc'], correct: 1, explanation: 'Tiến trình được trình bày: thị tộc, bộ lạc, bộ tộc rồi đến dân tộc.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Giải mã khái niệm · Chương I', question: '“Dân tộc” theo nghĩa rộng chỉ cộng đồng nào?', options: ['Những người cùng một dòng họ', 'Một cộng đồng tộc người', 'Nhân dân của một nước', 'Những người cùng tôn giáo'], correct: 2, explanation: 'Nghĩa rộng nói đến cộng đồng quốc gia; ví dụ là Việt Nam hoặc Nhật Bản.', img: hmongMarketPhoto, alt: 'Phụ nữ dân tộc Mông ở chợ' },
  { topic: 'Nhớ đúng, chọn nhanh · Chương I', question: 'Dân tộc theo nghĩa rộng có mấy đặc trưng cơ bản?', options: ['3 đặc trưng', '5 đặc trưng', '4 đặc trưng', '6 đặc trưng'], correct: 1, explanation: 'Năm đặc trưng: lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý và nhà nước.', img: stiltHousePhoto, alt: 'Nhà sàn của người Thái' },
  { topic: 'Bắt đúng từ khóa · Chương I', question: 'Đâu là một đặc trưng của dân tộc theo nghĩa hẹp?', options: ['Ý thức tự giác tộc người', 'Có nhà nước riêng', 'Có lãnh thổ riêng biệt', 'Có một nền kinh tế độc lập'], correct: 0, explanation: 'Nghĩa hẹp có ba đặc trưng: ngôn ngữ, văn hóa và ý thức tự giác tộc người.', img: costumePhoto, alt: 'Trang phục truyền thống người Mông' },
  { topic: 'Đổi góc nhìn · Chương II', question: 'Hai xu hướng khách quan của quan hệ dân tộc là gì?', options: ['Đô thị hóa và công nghiệp hóa', 'Cạnh tranh và khép kín', 'Đồng hóa và phân biệt', 'Tách ra độc lập và liên hiệp lại'], correct: 3, explanation: 'Hai xu hướng là hình thành dân tộc độc lập và các dân tộc xích lại gần, liên hiệp với nhau.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Tìm nguyên nhân · Chương II', question: 'Yếu tố nào thúc đẩy các dân tộc liên hiệp lại?', options: ['Phát triển sản xuất, công nghệ, giao lưu', 'Sống biệt lập với thế giới', 'Áp bức và phân biệt dân tộc', 'Ngăn cản hợp tác quốc tế'], correct: 0, explanation: 'Lực lượng sản xuất, khoa học công nghệ và giao lưu phát triển thúc đẩy hợp tác giữa các dân tộc.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Bộ ba nguyên tắc · Chương II', question: 'Bộ ba nào thuộc cương lĩnh dân tộc của Lênin?', options: ['Lãnh thổ – kinh tế – nhà nước', 'Độc lập – khép kín – tự cung tự cấp', 'Bình đẳng – tự quyết – liên hiệp công nhân', 'Ngôn ngữ – văn hóa – huyết thống'], correct: 2, explanation: 'Cương lĩnh gồm bình đẳng, quyền tự quyết và liên hiệp công nhân các dân tộc.', img: stiltHousePhoto, alt: 'Nhà sàn của người Thái' },
  { topic: 'Hiểu chứ không học vẹt · Chương II', question: 'Quyền tự quyết của dân tộc được hiểu như thế nào?', options: ['Can thiệp vào công việc dân tộc khác', 'Bắt buộc phải tách thành nước riêng', 'Tự chọn con đường phát triển', 'Từ chối mọi hình thức liên hiệp'], correct: 2, explanation: 'Tự quyết là tự chọn con đường phát triển, quyết định chia tách hoặc liên hiệp; không đồng nghĩa bắt buộc chia tách.', img: stiltHousePhoto, alt: 'Nhà sàn của người Thái' },
  { topic: 'Tự hào Việt Nam · Chương III', question: 'Cộng đồng các dân tộc Việt Nam có bao nhiêu dân tộc?', options: ['50 dân tộc', '52 dân tộc', '56 dân tộc', '54 dân tộc'], correct: 3, explanation: 'Việt Nam là quốc gia thống nhất của 54 dân tộc, mỗi dân tộc có bản sắc riêng.', img: hmongMarketPhoto, alt: 'Phụ nữ dân tộc Mông ở chợ' },
  { topic: 'Về đích · Chương III', question: 'Chính sách dân tộc trong bài được chia thành mấy lĩnh vực?', options: ['5 lĩnh vực', '3 lĩnh vực', '4 lĩnh vực', '6 lĩnh vực'], correct: 0, explanation: 'Năm lĩnh vực: chính trị, kinh tế, xã hội, văn hóa và quốc phòng – an ninh.', img: costumePhoto, alt: 'Trang phục truyền thống người Mông' },
  { topic: 'Đối chiếu ví dụ · Chương I', question: 'Cặp ví dụ nào đúng với “dân tộc theo nghĩa rộng”?', options: ['Người Kinh – người Thái', 'Việt Nam – Nhật Bản', 'Thị tộc – bộ lạc', 'Làng – bản'], correct: 1, explanation: 'Nghĩa rộng lấy quốc gia làm ví dụ: Việt Nam, Nhật Bản. Kinh, Thái là ví dụ của nghĩa hẹp.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Loại trừ · Chương I', question: 'Đặc trưng nào KHÔNG được nêu riêng cho dân tộc theo nghĩa hẹp?', options: ['Cộng đồng ngôn ngữ', 'Có chung một nhà nước', 'Cộng đồng văn hóa', 'Ý thức tự giác tộc người'], correct: 1, explanation: 'Nhà nước là đặc trưng của nghĩa rộng; nghĩa hẹp chỉ nêu ngôn ngữ, văn hóa và ý thức tự giác.', img: costumePhoto, alt: 'Trang phục truyền thống người Mông' },
  { topic: 'Trong một quốc gia · Chương II', question: 'Trong một quốc gia, xu hướng “tách ra” gắn với điều gì?', options: ['Nỗ lực giành tự do, bình đẳng của từng tộc người', 'Xây dựng liên minh toàn cầu', 'Phát triển khoa học công nghệ', 'Mở rộng giao lưu văn hóa'], correct: 0, explanation: 'Trong một quốc gia, xu hướng tách ra là nỗ lực của từng tộc người vì tự do, bình đẳng và phát triển của cộng đồng mình.', img: hmongMarketPhoto, alt: 'Phụ nữ dân tộc Mông ở chợ' },
  { topic: 'Phạm vi quốc tế · Chương II', question: 'Trên phạm vi quốc tế, xu hướng “liên hiệp” biểu hiện ra sao?', options: ['Đấu tranh giành độc lập', 'Hợp tác, liên minh khu vực và toàn cầu', 'Khép kín biên giới', 'Chia tách thành nhiều quốc gia'], correct: 1, explanation: 'Trên phạm vi quốc tế, các dân tộc hợp tác và hình thành liên minh ở phạm vi khu vực hoặc toàn cầu.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Nguyên tắc bình đẳng · Chương II', question: 'Nguyên tắc “bình đẳng” trong cương lĩnh Lênin yêu cầu điều gì?', options: ['Mọi dân tộc có quyền, nghĩa vụ ngang nhau; chống phân biệt', 'Dân tộc lớn lãnh đạo dân tộc nhỏ', 'Đồng hóa ngôn ngữ các tộc người', 'Mỗi dân tộc một nhà nước riêng'], correct: 0, explanation: 'Bình đẳng là quyền và nghĩa vụ ngang nhau; trong một quốc gia cần được pháp luật bảo đảm, chống áp bức và phân biệt.', img: stiltHousePhoto, alt: 'Nhà sàn của người Thái' },
  { topic: 'Sức mạnh đoàn kết · Chương II', question: '“Liên hiệp công nhân các dân tộc” dựa trên cơ sở nào?', options: ['Ép buộc và đồng hóa', 'Tự nguyện, bình đẳng, tôn trọng lẫn nhau', 'Lợi ích của dân tộc đa số', 'Can thiệp công việc nội bộ'], correct: 1, explanation: 'Liên hiệp trên cơ sở tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc.', img: dongVanPhoto, alt: 'Chợ vùng cao đông người' },
  { topic: 'Chung sống · Chương III', question: 'Dân cư các tộc người ở Việt Nam phân bố ra sao?', options: ['Sống tách biệt trong vùng khép kín', 'Cư trú xen kẽ với nhau', 'Chỉ tập trung ở đồng bằng', 'Chỉ ở khu vực biên giới'], correct: 1, explanation: 'Một trong sáu đặc điểm là các tộc người cư trú xen kẽ với nhau trên cùng lãnh thổ.', img: stiltHousePhoto, alt: 'Nhà sàn của người Thái' },
  { topic: 'Trách nhiệm chung · Chương III', question: 'Theo quan điểm của Đảng, công tác dân tộc là nhiệm vụ của ai?', options: ['Riêng cơ quan dân tộc', 'Toàn Đảng, toàn dân, toàn quân và cả hệ thống chính trị', 'Chính quyền vùng dân tộc thiểu số', 'Các tổ chức quốc tế'], correct: 1, explanation: 'Công tác dân tộc được xác định là nhiệm vụ của toàn Đảng, toàn dân, toàn quân và hệ thống chính trị.', img: pagodaPhoto, alt: 'Cổng chùa của người Khmer ở Sóc Trăng' },
  { topic: 'Giữ gìn bản sắc · Chương III', question: 'Chính sách văn hóa nhấn mạnh điều gì?', options: ['Giữ gìn, phát huy giá trị văn hóa truyền thống', 'Xóa bỏ phong tục các tộc người', 'Hạn chế giao lưu văn hóa', 'Đồng phục hóa đời sống tinh thần'], correct: 0, explanation: 'Chính sách văn hóa giữ gìn, phát huy giá trị truyền thống, nâng trình độ văn hóa và mở rộng giao lưu.', img: costumePhoto, alt: 'Trang phục truyền thống người Mông' },
  { topic: 'Việc mình làm được · Liên hệ', question: 'Việc làm nào phù hợp với sinh viên?', options: ['Chia sẻ tin chưa kiểm chứng', 'Tìm hiểu, tôn trọng văn hóa các dân tộc', 'Kỳ thị khác biệt vùng miền', 'Tránh tiếp xúc với bạn dân tộc khác'], correct: 1, explanation: 'Tìm hiểu lịch sử, ngôn ngữ, văn hóa; tôn trọng khác biệt; kiểm chứng thông tin trước khi chia sẻ.', img: pagodaPhoto, alt: 'Cổng chùa của người Khmer ở Sóc Trăng' },
];

const QuizAction = ({ children, onClick, buttonRef }: { children: ReactNode; onClick: () => void; buttonRef?: Ref<HTMLButtonElement> }) => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button ref={buttonRef} type="button" onClick={(event) => { event.stopPropagation(); onClick(); }} whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }} style={{ minHeight: 76, padding: '14px 30px', border: '2px solid var(--osd-accent)', borderRadius: 'var(--osd-radius)', background: ink.panel, color: 'var(--osd-accent)', fontFamily: font.body, fontSize: 28, lineHeight: 1.3, fontWeight: 700, cursor: 'pointer' }}>{children}</motion.button>
  );
};

const QuizBoardButton = ({ number, done, selected, onSelect, buttonRef }: { number: number; done: boolean; selected: boolean; onSelect: () => void; buttonRef?: Ref<HTMLButtonElement> }) => {
  const reducedMotion = useReducedMotion();
  return (
  <motion.button ref={buttonRef} type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} aria-label={`Câu ${number}: ${done ? 'đã xong' : selected ? 'đang chọn' : 'chưa xong'}`} aria-pressed={selected} whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} style={{ height: 76, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0, border: selected ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, borderRadius: 'var(--osd-radius)', background: done ? ink.accentSoft : selected ? ink.panel : ink.panel, color: done ? 'var(--osd-accent)' : ink.text, fontFamily: font.body, cursor: 'pointer' }}>
    <span style={{ fontFamily: font.display, fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{done ? '✓' : pad2(number)}</span>
    <span style={{ fontSize: 17, fontWeight: 600, color: done ? 'var(--osd-accent)' : ink.muted }}>{done ? 'đã xong' : 'câu hỏi'}</span>
  </motion.button>
  );
};

const QuizBoard = ({ done, selected, onSelect, buttonRefs }: { done: boolean[]; selected: number; onSelect: (index: number) => void; buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]> }) => (
  <div role="group" aria-label="Chọn câu hỏi" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
    <QuizBoardButton number={1} done={done[0]} selected={selected === 0} onSelect={() => onSelect(0)} buttonRef={(node) => { buttonRefs.current[0] = node; }} />
    <QuizBoardButton number={2} done={done[1]} selected={selected === 1} onSelect={() => onSelect(1)} buttonRef={(node) => { buttonRefs.current[1] = node; }} />
    <QuizBoardButton number={3} done={done[2]} selected={selected === 2} onSelect={() => onSelect(2)} buttonRef={(node) => { buttonRefs.current[2] = node; }} />
    <QuizBoardButton number={4} done={done[3]} selected={selected === 3} onSelect={() => onSelect(3)} buttonRef={(node) => { buttonRefs.current[3] = node; }} />
    <QuizBoardButton number={5} done={done[4]} selected={selected === 4} onSelect={() => onSelect(4)} buttonRef={(node) => { buttonRefs.current[4] = node; }} />
    <QuizBoardButton number={6} done={done[5]} selected={selected === 5} onSelect={() => onSelect(5)} buttonRef={(node) => { buttonRefs.current[5] = node; }} />
    <QuizBoardButton number={7} done={done[6]} selected={selected === 6} onSelect={() => onSelect(6)} buttonRef={(node) => { buttonRefs.current[6] = node; }} />
    <QuizBoardButton number={8} done={done[7]} selected={selected === 7} onSelect={() => onSelect(7)} buttonRef={(node) => { buttonRefs.current[7] = node; }} />
    <QuizBoardButton number={9} done={done[8]} selected={selected === 8} onSelect={() => onSelect(8)} buttonRef={(node) => { buttonRefs.current[8] = node; }} />
    <QuizBoardButton number={10} done={done[9]} selected={selected === 9} onSelect={() => onSelect(9)} buttonRef={(node) => { buttonRefs.current[9] = node; }} />
    <QuizBoardButton number={11} done={done[10]} selected={selected === 10} onSelect={() => onSelect(10)} buttonRef={(node) => { buttonRefs.current[10] = node; }} />
    <QuizBoardButton number={12} done={done[11]} selected={selected === 11} onSelect={() => onSelect(11)} buttonRef={(node) => { buttonRefs.current[11] = node; }} />
    <QuizBoardButton number={13} done={done[12]} selected={selected === 12} onSelect={() => onSelect(12)} buttonRef={(node) => { buttonRefs.current[12] = node; }} />
    <QuizBoardButton number={14} done={done[13]} selected={selected === 13} onSelect={() => onSelect(13)} buttonRef={(node) => { buttonRefs.current[13] = node; }} />
    <QuizBoardButton number={15} done={done[14]} selected={selected === 14} onSelect={() => onSelect(14)} buttonRef={(node) => { buttonRefs.current[14] = node; }} />
    <QuizBoardButton number={16} done={done[15]} selected={selected === 15} onSelect={() => onSelect(15)} buttonRef={(node) => { buttonRefs.current[15] = node; }} />
    <QuizBoardButton number={17} done={done[16]} selected={selected === 16} onSelect={() => onSelect(16)} buttonRef={(node) => { buttonRefs.current[16] = node; }} />
    <QuizBoardButton number={18} done={done[17]} selected={selected === 17} onSelect={() => onSelect(17)} buttonRef={(node) => { buttonRefs.current[17] = node; }} />
    <QuizBoardButton number={19} done={done[18]} selected={selected === 18} onSelect={() => onSelect(18)} buttonRef={(node) => { buttonRefs.current[18] = node; }} />
    <QuizBoardButton number={20} done={done[19]} selected={selected === 19} onSelect={() => onSelect(19)} buttonRef={(node) => { buttonRefs.current[19] = node; }} />
  </div>
);

const QuizAnswer = ({ index, question, wrong, done, onChoose, buttonRef }: { index: number; question: QuizQuestion; wrong: boolean; done: boolean; onChoose: (index: number) => void; buttonRef?: Ref<HTMLButtonElement> }) => {
  const reducedMotion = useReducedMotion();
  const correct = done && index === question.correct;
  const disabled = wrong || done;
  return (
    <motion.button ref={buttonRef} type="button" disabled={disabled} onClick={(event) => { event.stopPropagation(); onChoose(index); }} aria-label={`${'ABCD'[index]}. ${question.options[index]}${correct ? ' (đáp án đúng)' : wrong ? ' (đã thử, chưa đúng)' : ''}`} aria-describedby="cnxh-quiz-feedback" whileHover={disabled || reducedMotion ? undefined : { y: -3 }} whileTap={disabled || reducedMotion ? undefined : { scale: 0.99 }} animate={{ backgroundColor: correct ? ink.accentSoft : ink.panel, opacity: wrong ? 0.55 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} style={{ width: '100%', height: 112, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, textAlign: 'left', padding: '16px 22px', border: correct ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, borderRadius: 'var(--osd-radius)', color: ink.text, fontFamily: font.body, cursor: disabled ? 'default' : 'pointer' }}>
      <span aria-hidden="true" style={{ flexShrink: 0, width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: 14, border: correct ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, background: correct ? 'var(--osd-accent)' : ink.panel, color: correct ? '#fff' : 'var(--osd-accent)', fontFamily: font.display, fontWeight: 700, fontSize: 28 }}>{correct ? '✓' : 'ABCD'[index]}</span>
      <span style={{ fontSize: 26, lineHeight: 1.35, fontWeight: 500, textDecoration: wrong ? 'line-through' : 'none', color: wrong ? ink.muted : ink.text }}>{question.options[index]}</span>
    </motion.button>
  );
};

const Quiz: Page = () => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [wrong, setWrong] = useState<number[][]>(() => quizQuestions.map(() => []));
  const [done, setDone] = useState<boolean[]>(() => quizQuestions.map(() => false));
  const question = quizQuestions[selected];
  const isDone = done[selected];
  const tried = wrong[selected];
  const completed = done.filter(Boolean).length;
  const allDone = completed === quizQuestions.length;
  useEffect(() => {
    // Answering correctly disables the focused option, dropping focus to the
    // page body where slide shortcuts would catch it. Keep keyboard users
    // inside the game by moving to the next unfinished question instead.
    if (!active || !isDone) return;
    const next = done.findIndex((value, index) => !value && index !== selected);
    if (next !== -1) boardRefs.current[next]?.focus({ preventScroll: true });
  }, [active, isDone, selected, done]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;
    const guard = (event: KeyboardEvent) => {
      if (!(event.target instanceof HTMLElement) || !root.contains(event.target)) return;
      if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) event.stopPropagation();
    };
    window.addEventListener('keydown', guard, { capture: true });
    return () => window.removeEventListener('keydown', guard, { capture: true });
  }, [active]);
  const chooseQuestion = (index: number) => { if (!active) return; setSelected(index); };
  const chooseAnswer = (answer: number) => {
    if (!active || isDone) return;
    if (answer === question.correct) setDone(previous => previous.map((value, index) => index === selected ? true : value));
    else if (!tried.includes(answer)) setWrong(previous => previous.map((list, index) => index === selected ? [...list, answer] : list));
  };
  const reset = () => { if (!active) return; setWrong(quizQuestions.map(() => [])); setDone(quizQuestions.map(() => false)); setSelected(0); };
  return (
    <div ref={rootRef} className="cnxh-quiz" data-osd-interactive="true" style={{ ...fill }} onClick={event => event.stopPropagation()}>
      <style>{`.cnxh-quiz button:focus-visible { outline: 3px solid #8b2f2a; outline-offset: 4px; } .cnxh-quiz button:disabled { opacity: 1; }`}</style>
      <Mark />
      <Eyebrow>Trò chơi · Cả lớp cùng chơi</Eyebrow>
      <motion.h2
        {...useEntry(0.06)}
        style={{
          position: 'absolute',
          left: P,
          top: 128,
          margin: 0,
          fontFamily: font.display,
          fontSize: 56,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.08,
          maxWidth: 1200,
        }}
      >
        Cùng tìm đáp án đúng
      </motion.h2>
      <div style={{ position: 'absolute', right: P, top: 128, fontSize: 22, fontWeight: 600, padding: '12px 22px', border: `1px solid ${ink.rule}`, borderRadius: 'var(--osd-radius)', background: allDone ? ink.accentSoft : ink.panel, color: allDone ? 'var(--osd-accent)' : ink.soft }}>{allDone ? 'Xong cả 20 câu ✦' : `Đã xong ${completed} / 20`}</div>
      <aside style={{ position: 'absolute', left: P, top: 248, width: 460, height: 684, boxSizing: 'border-box', padding: 26, background: ink.panel, border: `1px solid ${ink.rule}`, borderRadius: 'var(--osd-radius)' }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--osd-accent)' }}>BẢNG CÂU HỎI</div>
        <p style={{ margin: '10px 0 16px', fontSize: 22, lineHeight: 1.45, color: ink.soft }}>Chọn một câu, cả lớp cùng tìm đáp án đúng.</p>
        <QuizBoard done={done} selected={selected} onSelect={chooseQuestion} buttonRefs={boardRefs} />
      </aside>
      <motion.div key={selected} {...useEntry(0)} style={{ position: 'absolute', left: 630, top: 248, width: 1170 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
          <img src={question.img} alt={question.alt} style={{ width: 300, height: 196, objectFit: 'cover', borderRadius: 'var(--osd-radius)', border: `1px solid ${ink.rule}`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--osd-accent)' }}>{question.topic.toUpperCase()}</div>
            <h2 style={{ fontFamily: font.display, fontSize: 44, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '12px 0 0', minHeight: 132 }}>{question.question}</h2>
          </div>
        </div>
        <div role="group" aria-label="Chọn một đáp án, sai được thử lại" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <QuizAnswer index={0} question={question} wrong={tried.includes(0)} done={isDone} onChoose={chooseAnswer} />
          <QuizAnswer index={1} question={question} wrong={tried.includes(1)} done={isDone} onChoose={chooseAnswer} />
          <QuizAnswer index={2} question={question} wrong={tried.includes(2)} done={isDone} onChoose={chooseAnswer} />
          <QuizAnswer index={3} question={question} wrong={tried.includes(3)} done={isDone} onChoose={chooseAnswer} />
        </div>
      </motion.div>
      <div style={{ position: 'absolute', left: 630, top: 800, width: 1170, display: 'flex', alignItems: 'flex-start', gap: 28 }}>
        <div id="cnxh-quiz-feedback" role="status" aria-live="polite" style={{ flex: 1, minHeight: 112 }}>
          {isDone
            ? <motion.div key={`done-${selected}`} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}><div style={{ fontSize: 27, fontWeight: 700, marginBottom: 6, color: 'var(--osd-accent)' }}>Đúng rồi ✦ Câu này đã xong!</div><div style={{ fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{question.explanation}</div></motion.div>
            : tried.length > 0
              ? <motion.div key={`retry-${selected}-${tried.length}`} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}><div style={{ fontSize: 27, fontWeight: 700, marginBottom: 6 }}>Chưa đúng — cả lớp thử đáp án khác nhé!</div><div style={{ fontSize: 24, lineHeight: 1.45, color: ink.soft }}>Đáp án đã thử sẽ mờ đi. Cứ chọn tiếp đến khi tìm ra câu đúng.</div></motion.div>
              : <span />}
        </div>
        {allDone && <QuizAction onClick={reset}>Đặt lại bảng ↻</QuizAction>}
      </div>
      <Footer />
    </div>
  );
};

const Closing: Page = () => (
  <div style={fill}>
    <img src={communityPhoto} alt="Minh họa cộng đồng vùng núi Việt Nam" style={{ position: 'absolute', right: 0, top: 0, width: 850, height: 1080, objectFit: 'cover', objectPosition: '74% center' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1160, height: 1080, background: 'linear-gradient(90deg, #f3efe6 82%, rgba(243,239,230,0))' }} />
    <div style={{ position: 'absolute', left: P, top: 240, width: 1020 }}>
      <motion.div {...useEntry(0.05, 'fade')} style={{ width: 100, height: 8, background: 'var(--osd-accent)', marginBottom: 52 }} />
      <motion.h1 {...useEntry(0.12)} style={{ margin: 0, fontFamily: font.display, fontSize: 112, lineHeight: 1.1 }}>Cảm ơn<br />đã lắng nghe</motion.h1>
      <motion.p {...useEntry(0.22)} style={{ fontSize: 33, lineHeight: 1.5, color: ink.soft, maxWidth: 850, marginTop: 40 }}>Mời giảng viên và các bạn đặt câu hỏi hoặc góp ý.</motion.p>
    </div>
    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'Vấn đề dân tộc trong thời kỳ quá độ lên CNXH',
  createdAt: '2026-10-15T13:53:01.521Z',
};

export const notes: (string | undefined)[] = [
  'Chào giảng viên và các bạn, giới thiệu thành viên nhóm 3. Đề tài được phân công là vấn đề dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội. Bài trình bày bắt đầu từ khái niệm dân tộc, rồi đến cương lĩnh Lênin và chính sách ở Việt Nam.',
  'Chương I trình bày quá trình hình thành cộng đồng người và hai cách hiểu từ “dân tộc”.',
  'Theo tiến trình trong tài liệu: thị tộc, bộ lạc, bộ tộc rồi đến dân tộc. Mỗi ô trên trang chỉ nêu nét chính của một hình thức cộng đồng.',
  'Nghĩa rộng nói đến nhân dân một nước. Năm đặc trưng gồm lãnh thổ, kinh tế, ngôn ngữ, văn hóa và tâm lý, nhà nước; ví dụ là Việt Nam và Nhật Bản.',
  'Nghĩa hẹp nói đến tộc người. Ba đặc trưng trên sơ đồ là ngôn ngữ, văn hóa và ý thức tự giác; ví dụ là dân tộc Kinh và dân tộc Thái.',
  'Đối chiếu theo từng hàng. Sơ đồ về nghĩa hẹp không liệt kê lãnh thổ, kinh tế hay nhà nước thành đặc trưng riêng; bảng không phủ nhận các yếu tố đó trong đời sống tộc người.',
  'Chương II gồm hai xu hướng của quan hệ dân tộc và ba nội dung trong cương lĩnh Lênin.',
  'Ý thức dân tộc có thể dẫn đến đấu tranh giành độc lập. Lực lượng sản xuất, khoa học công nghệ và giao lưu thúc đẩy các dân tộc hợp tác.',
  'Trong một quốc gia, sơ đồ đặt cạnh quyền phát triển của từng tộc người và sự hợp tác giữa các tộc người. Trên phạm vi quốc tế, đó là đấu tranh giải phóng và liên minh khu vực hoặc toàn cầu.',
  'Ba nội dung của cương lĩnh: các dân tộc hoàn toàn bình đẳng; các dân tộc được quyền tự quyết; liên hiệp công nhân các dân tộc.',
  'Bình đẳng cần được pháp luật bảo đảm. Tự quyết gồm quyền chọn con đường phát triển, chia tách hoặc liên hiệp. Liên hiệp dựa trên tự nguyện và bình đẳng.',
  'Chương III chuyển sang sáu đặc điểm dân tộc Việt Nam, quan điểm của Đảng và Nhà nước, rồi các lĩnh vực chính sách.',
  'Sáu đặc điểm: quy mô dân số chênh lệch; cư trú xen kẽ; địa bàn chiến lược; phát triển không đều; truyền thống đoàn kết; mỗi dân tộc có bản sắc riêng.',
  'Quan điểm của Đảng và Nhà nước đặt vấn đề dân tộc và đoàn kết dân tộc ở tầm chiến lược, đồng thời coi công tác dân tộc là nhiệm vụ của cả hệ thống chính trị.',
  'Năm lĩnh vực chính sách là chính trị, kinh tế, xã hội, văn hóa và quốc phòng – an ninh. Tài liệu xếp xã hội thành một lĩnh vực riêng.',
  'Ở lĩnh vực chính trị, nói đến bình đẳng, đoàn kết và tôn trọng. Ở lĩnh vực kinh tế, nói đến tiềm năng vùng dân tộc thiểu số và việc thu hẹp chênh lệch giữa các vùng. Ảnh hạ tầng là hình minh họa, không phải dẫn chứng về một địa điểm cụ thể.',
  'Chính sách xã hội gồm an sinh, bình đẳng và công bằng; các phần việc được nêu là giảm nghèo, dân số, y tế và giáo dục.',
  'Sáu ý trên trang gồm giữ giá trị truyền thống, nâng cao trình độ văn hóa, đào tạo cán bộ, xây dựng thiết chế, mở rộng giao lưu và chống tệ nạn xã hội.',
  'Quốc phòng – an ninh tập trung vào ổn định chính trị, trật tự an toàn xã hội, quan hệ quân dân và thế trận quốc phòng toàn dân ở vùng đồng bào dân tộc.',
  'Phần liên hệ thực tiễn của tài liệu chưa triển khai chi tiết. Có thể mời lớp nêu ví dụ về tìm hiểu văn hóa, tôn trọng khác biệt và kiểm chứng thông tin trước khi chia sẻ.',
  'Nhắc lại hai nghĩa của dân tộc, hai xu hướng quan hệ dân tộc, ba nội dung cương lĩnh Lênin và năm lĩnh vực chính sách ở Việt Nam.',
  'Mời cả lớp chơi bảng 20 câu hỏi. Chọn một câu trên bảng, chọn A/B/C/D để trả lời; sai được thử tiếp đến khi đúng, câu đúng được đánh dấu đã xong. Không tính điểm, chỉ theo dõi số câu đã xong. Mỗi câu hỏi có ảnh minh họa từ Wikimedia Commons (ghi nguồn trong phần này). Phím mũi tên và Space khi đang chọn trong trò chơi không chuyển slide.',
  'Cảm ơn giảng viên và các bạn. Mời câu hỏi hoặc góp ý.',
];

export default [
  Cover,
  DivConcept,
  ConceptTimeline,
  NationDiagram,
  EthnieDiagram,
  TableCompare,
  DivMarx,
  TwoTrends,
  TrendContexts,
  LeninPillars,
  LeninDetail,
  DivVN,
  VNFeatures,
  PartyView,
  PolicyMatrix,
  PolicyPoliticalEconomic,
  PolicySocial,
  PolicyCulture,
  PolicySecurity,
  Practice,
  Summary,
  Quiz,
  Closing,
] satisfies Page[];
