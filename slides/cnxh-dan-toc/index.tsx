import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion, type MotionProps } from 'motion/react';
import communityPhoto from './assets/vietnam-community.jpg';
import craftPhoto from './assets/craft-weaving.jpg';
import schoolPhoto from './assets/mountain-school.jpg';
import gatheringPhoto from './assets/community-gathering.jpg';
import farmingPhoto from './assets/terrace-farming.jpg';
import borderPhoto from './assets/quan-dan-vung-bien.jpg';
import bridgePhoto from './assets/ha-tang-vung-cao.jpg';

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

const useEntry = (delay = 0, kind: 'rise' | 'fade' | 'stamp' = 'rise'): MotionProps => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  const from = kind === 'stamp'
    ? { opacity: 0, scale: 0.82, rotate: -5 }
    : kind === 'fade'
      ? { opacity: 0 }
      : { opacity: 0, y: 10 };
  return {
    initial: active && !reducedMotion ? from : false,
    animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    transition: { duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : delay * 0.5, ease: [0.22, 1, 0.36, 1] },
  };
};

const StrokePath = ({ d, markerEnd, delay = 0.2 }: { d: string; markerEnd?: string; delay?: number }) => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  return (
    <motion.path
      d={d}
      markerEnd={markerEnd}
      initial={active && !reducedMotion ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.75, delay: reducedMotion ? 0 : delay, ease: 'easeInOut' }}
    />
  );
};

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
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) => {
  const leadEntry = useEntry(0.12);
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
        {...useEntry(0.18)}
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
  <motion.div {...useEntry(Number(number) * 0.1)} style={{ position: 'relative', zIndex: 1, height: '100%', padding: '44px 24px 0 22px', boxSizing: 'border-box', borderLeft: number === '01' ? undefined : `1px solid ${ink.rule}` }}>
    <div style={{ fontFamily: font.display, fontSize: 112, lineHeight: 1, color: 'rgba(139, 47, 42, 0.21)', fontWeight: 700 }}>{number}</div>
    <div style={{ position: 'absolute', left: 22, top: 211, width: 18, height: 18, borderRadius: '50%', background: 'var(--osd-accent)', boxShadow: '0 0 0 8px var(--osd-bg)' }} />
    <div style={{ marginTop: 112, fontFamily: font.display, fontSize: 44, lineHeight: 1.15, fontWeight: 700 }}>{title}</div>
    <div style={{ marginTop: 20, fontSize: 27, lineHeight: 1.46, color: ink.soft }}>{description}</div>
  </motion.div>
);

const TimelineRule = () => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={active && !reducedMotion ? { scaleX: 0 } : false}
      animate={{ scaleX: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', left: 22, right: 22, top: 218, height: 3, background: 'var(--osd-accent)', transformOrigin: 'left' }}
    />
  );
};

const ConceptTimeline: Page = () => (
  <Frame eyebrow="Chương I" title="Từ thị tộc đến dân tộc">
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
  <div style={{ borderBottom: `1px solid ${ink.rule}`, padding: '18px 0', display: 'flex', alignItems: 'center', gap: 28, minHeight: 108, boxSizing: 'border-box' }}>
    <span style={{ fontFamily: font.display, fontSize: 34, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 56 }}>{number}</span>
    <span style={{ fontSize: 30, lineHeight: 1.35, color: ink.text }}>{label}{detail && <small style={{ display: 'block', fontSize: 22, color: ink.muted, marginTop: 3 }}>{detail}</small>}</span>
  </div>
);

const NationDiagram: Page = () => (
  <Frame eyebrow="Chương I · 1" title="Sơ đồ 1 / Dân tộc theo nghĩa rộng" lead="Dân tộc theo nghĩa rộng là cộng đồng người ổn định làm thành nhân dân một nước.">
    <div style={{ display: 'grid', gridTemplateColumns: '540px 1fr', gap: 78, height: '100%' }}>
      <div style={{ background: 'var(--osd-accent)', color: '#fff', position: 'relative' }}>
        <img src={farmingPhoto} alt="Cảnh đồng ruộng miền núi" style={{ width: '100%', height: 276, objectFit: 'cover', filter: 'saturate(.75)' }} />
        <div style={{ padding: '25px 34px' }}>
          <div style={{ fontSize: 23, letterSpacing: '0.12em' }}>NGHĨA RỘNG · QUỐC GIA</div>
          <div style={{ fontFamily: font.display, fontSize: 45, lineHeight: 1.12, marginTop: 10 }}>Một cộng đồng quốc gia</div>
          <div style={{ fontSize: 23, lineHeight: 1.38, marginTop: 16 }}>Gắn bó bởi quyền lợi chính trị, kinh tế, truyền thống văn hóa và lịch sử dựng nước, giữ nước.</div>
          <div style={{ fontSize: 25, marginTop: 18 }}>Ví dụ: Việt Nam, Nhật Bản</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
  <Frame eyebrow="Chương I · 1" title="Sơ đồ 2 / Dân tộc theo nghĩa hẹp" lead="Dân tộc theo nghĩa hẹp là cộng đồng tộc người hình thành trong lịch sử, có liên hệ bền vững.">
    <div style={{ display: 'grid', gridTemplateColumns: '650px 1fr', gap: 68, height: '100%' }}>
      <div style={{ background: ink.panel, border: `1px solid ${ink.rule}` }}>
        <img src={gatheringPhoto} alt="Sinh hoạt văn hóa cộng đồng" style={{ width: '100%', height: 365, objectFit: 'cover' }} />
        <div style={{ padding: '26px 34px' }}><div style={{ fontFamily: font.display, fontSize: 43, fontWeight: 700 }}>Một cộng đồng tộc người</div><div style={{ fontSize: 27, color: ink.soft, marginTop: 12 }}>Ví dụ: dân tộc Kinh, dân tộc Thái</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
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

const TrendVisual = ({ mode }: { mode: 'separate' | 'unite' }) => {
  const color = mode === 'separate' ? '#8b2f2a' : '#2f6671';
  const arrowId = mode === 'separate' ? 'trend-separate-arrow' : 'trend-unite-arrow';
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
      <circle cx="69" cy="31" r="22" fill={color} opacity=".76" /><circle cx="69" cy="159" r="22" fill={color} opacity=".76" />
      <circle cx="391" cy="31" r="22" fill={color} opacity=".76" /><circle cx="391" cy="159" r="22" fill={color} opacity=".76" />
    </svg>
  );
};

const TrendCard = ({ number, title, cause, result, mode }: { number: string; title: string; cause: string; result: string; mode: 'separate' | 'unite' }) => (
  <div style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderTop: `7px solid ${mode === 'separate' ? '#8b2f2a' : '#2f6671'}`, padding: 34, height: '100%', boxSizing: 'border-box' }}>
    <div style={{ color: mode === 'separate' ? '#8b2f2a' : '#2f6671', fontSize: 24, fontWeight: 700 }}>XU HƯỚNG {number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 39, lineHeight: 1.18, margin: '12px 0 8px', minHeight: 92 }}>{title}</h3>
    <TrendVisual mode={mode} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft, marginTop: 10 }}><strong>Cơ sở:</strong> {cause}</div>
    <div style={{ height: 2, background: ink.rule, margin: '18px 0' }} />
    <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft }}><strong>Biểu hiện:</strong> {result}</div>
  </div>
);

const TwoTrends: Page = () => (
  <Frame eyebrow="Chương II · 2.1" title="Hai xu hướng khách quan">
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

const PillarCard = ({ number, title, detail }: { number: string; title: string; detail: string }) => (
  <div style={{ background: 'var(--osd-accent)', color: '#fff', padding: 38, display: 'flex', flexDirection: 'column', gap: 22 }}><div style={{ fontFamily: font.display, fontSize: 72, lineHeight: 1, opacity: .7 }}>{number}</div><div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}>{title}</div><div style={{ fontSize: 27, lineHeight: 1.45 }}>{detail}</div></div>
);

const LeninPillars: Page = () => (
  <Frame eyebrow="Chương II · 2.2" title="Cương lĩnh dân tộc của Lênin">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, height: '100%' }}>
      <PillarCard number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Quyền và nghĩa vụ ngang nhau; chống áp bức và phân biệt dân tộc." />
      <PillarCard number="02" title="Các dân tộc được quyền tự quyết" detail="Tự chọn con đường phát triển; quyết định việc chia tách hoặc liên hiệp." />
      <PillarCard number="03" title="Liên hiệp công nhân các dân tộc" detail="Liên hiệp tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích chung." />
    </div>
  </Frame>
);

const LeninDetail: Page = () => (
  <Frame eyebrow="Chương II · 2.2" title="Nội dung của ba nguyên tắc">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 30, height: '100%', alignItems: 'center' }}>
      <div style={{ padding: 35, background: ink.panel, minHeight: 420 }}><div style={{ fontSize: 62, color: 'var(--osd-accent)', fontFamily: font.display }}>01</div><h3 style={{ fontSize: 34, margin: '10px 0 24px' }}>Bình đẳng</h3><p style={{ fontSize: 27, lineHeight: 1.5, color: ink.soft }}>Các dân tộc có quyền và nghĩa vụ ngang nhau; trong một quốc gia, quyền này cần được pháp luật bảo đảm và thực thi.</p></div>
      <div style={{ padding: 35, background: ink.panel, minHeight: 420 }}><div style={{ fontSize: 62, color: 'var(--osd-accent)', fontFamily: font.display }}>02</div><h3 style={{ fontSize: 34, margin: '10px 0 24px' }}>Tự quyết</h3><p style={{ fontSize: 27, lineHeight: 1.5, color: ink.soft }}>Dân tộc tự chọn con đường phát triển, quyết định việc chia tách hoặc liên hiệp; phản đối can thiệp vào công việc nội bộ.</p></div>
      <div style={{ padding: 35, background: ink.panel, minHeight: 420 }}><div style={{ fontSize: 62, color: 'var(--osd-accent)', fontFamily: font.display }}>03</div><h3 style={{ fontSize: 34, margin: '10px 0 24px' }}>Liên hiệp</h3><p style={{ fontSize: 27, lineHeight: 1.5, color: ink.soft }}>Liên hiệp công nhân trên cơ sở tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc.</p></div>
    </div>
  </Frame>
);

const DivVN = () => <Divider roman="III" label="CHƯƠNG III" sub="54 dân tộc và chính sách dân tộc ở Việt Nam" />;

const FeatureNode = ({ number, side, children }: { number: string; side: 'left' | 'right'; children: ReactNode }) => (
  <div style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderRight: side === 'left' ? '5px solid var(--osd-accent)' : undefined, borderLeft: side === 'right' ? '5px solid var(--osd-accent)' : undefined, minHeight: 146, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 25px', boxSizing: 'border-box' }}>
    <span style={{ fontFamily: font.display, fontSize: 38, color: 'var(--osd-accent)', fontWeight: 700 }}>{number}</span>
    <span style={{ fontSize: 28, lineHeight: 1.36 }}>{children}</span>
  </div>
);

const VNFeatures: Page = () => (
  <Frame eyebrow="Chương III · 3.1" title="Sáu đặc điểm dân tộc Việt Nam">
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 360px 1fr', gap: 30, height: '100%', alignItems: 'center' }}>
      <svg viewBox="0 0 1680 684" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth="3" opacity=".65">
          <StrokePath d="M630 172 C700 172 710 270 750 280" delay={0.15} /><StrokePath d="M630 342 H700" delay={0.25} /><StrokePath d="M630 512 C700 512 710 414 750 404" delay={0.35} />
          <StrokePath d="M1050 172 C980 172 970 270 930 280" delay={0.45} /><StrokePath d="M1050 342 H980" delay={0.55} /><StrokePath d="M1050 512 C980 512 970 414 930 404" delay={0.65} />
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

const PolicyCard = ({ number, title, detail, image, alt }: { number: string; title: string; detail: string; image: string; alt: string }) => (
  <div style={{ background: ink.panel, borderTop: '6px solid var(--osd-accent)', minHeight: 390 }}>
    <img src={image} alt={alt} style={{ display: 'block', width: '100%', height: 145, objectFit: 'cover', filter: 'saturate(.82)' }} />
    <div style={{ padding: '20px 22px 24px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
      <h3 style={{ fontSize: 30, lineHeight: 1.17, margin: '8px 0 12px', minHeight: 70 }}>{title}</h3>
      <p style={{ fontSize: 22, lineHeight: 1.36, color: ink.soft, margin: 0 }}>{detail}</p>
    </div>
  </div>
);

const PolicyMatrix: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Sơ đồ / Năm lĩnh vực chính sách">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <div style={{ background: 'var(--osd-accent)', color: '#fff', padding: '18px 52px', fontFamily: font.display, fontSize: 38, fontWeight: 700 }}>CHÍNH SÁCH DÂN TỘC</div>
      <div style={{ width: 3, height: 50, background: 'var(--osd-accent)' }} />
      <div style={{ width: '82%', height: 3, background: 'var(--osd-accent)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, width: '100%', height: 28 }}>
        <div style={{ width: 3, height: 28, background: 'var(--osd-accent)', justifySelf: 'center' }} />
        <div style={{ width: 3, height: 28, background: 'var(--osd-accent)', justifySelf: 'center' }} />
        <div style={{ width: 3, height: 28, background: 'var(--osd-accent)', justifySelf: 'center' }} />
        <div style={{ width: 3, height: 28, background: 'var(--osd-accent)', justifySelf: 'center' }} />
        <div style={{ width: 3, height: 28, background: 'var(--osd-accent)', justifySelf: 'center' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, width: '100%' }}>
        <PolicyCard number="01" title="Chính trị" detail="Bình đẳng, đoàn kết, tôn trọng và giúp nhau phát triển." image={communityPhoto} alt="Sinh hoạt cộng đồng" />
        <PolicyCard number="02" title="Kinh tế" detail="Phát huy tiềm năng, thu hẹp chênh lệch giữa các vùng." image={bridgePhoto} alt="Cầu đường ở miền núi" />
        <PolicyCard number="03" title="Xã hội" detail="An sinh, giáo dục, y tế và công bằng xã hội." image={schoolPhoto} alt="Trường học miền núi" />
        <PolicyCard number="04" title="Văn hóa" detail="Giữ bản sắc, nâng trình độ và mở rộng giao lưu." image={craftPhoto} alt="Nghề dệt truyền thống" />
        <PolicyCard number="05" title="Quốc phòng – an ninh" detail="Ổn định chính trị, trật tự và quan hệ quân dân." image={borderPhoto} alt="Cán bộ và người dân trò chuyện" />
      </div>
    </div>
  </Frame>
);

const PolicyPoliticalEconomic: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách chính trị và kinh tế">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, height: '100%' }}>
      <div style={{ background: ink.panel, borderTop: '7px solid var(--osd-accent)' }}><img src={gatheringPhoto} alt="Sinh hoạt cộng đồng" style={{ width: '100%', height: 235, objectFit: 'cover' }} /><div style={{ padding: '24px 32px' }}><h3 style={{ fontFamily: font.display, fontSize: 40, margin: '0 0 16px' }}>Chính trị</h3><p style={{ fontSize: 27, lineHeight: 1.46, color: ink.soft, margin: 0 }}>Thực hiện bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển; nâng cao nhận thức của đồng bào về đoàn kết dân tộc.</p></div></div>
      <div style={{ background: ink.panel, borderTop: '7px solid '+ink.gold }}><img src={bridgePhoto} alt="Cầu đường ở miền núi" style={{ width: '100%', height: 235, objectFit: 'cover', filter: 'saturate(.82)' }} /><div style={{ padding: '24px 32px' }}><h3 style={{ fontFamily: font.display, fontSize: 40, margin: '0 0 16px' }}>Kinh tế</h3><p style={{ fontSize: 27, lineHeight: 1.46, color: ink.soft, margin: 0 }}>Phát huy tiềm năng vùng miền núi, dân tộc thiểu số; triển khai chương trình phát triển, thu hẹp chênh lệch và thúc đẩy kinh tế thị trường định hướng XHCN.</p></div></div>
    </div>
  </Frame>
);

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

const Quiz: Page = () => (
  <Frame eyebrow="Trò chơi" title="Kiểm tra nhanh hiểu bài">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, height: '100%', alignItems: 'center' }}>
      <div style={{ background: ink.panel, padding: 32, borderTop: '6px solid var(--osd-accent)', minHeight: 360 }}>
        <div style={{ fontSize: 24, color: 'var(--osd-accent)', fontWeight: 700 }}>CÂU 01</div>
        <p style={{ fontSize: 30, lineHeight: 1.4, fontWeight: 700 }}>Dân tộc theo nghĩa rộng có mấy đặc trưng?</p>
        <div style={{ fontSize: 25, lineHeight: 1.45, color: ink.soft }}>5: lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý, nhà nước.</div>
      </div>
      <div style={{ background: ink.panel, padding: 32, borderTop: '6px solid var(--osd-accent)', minHeight: 360 }}>
        <div style={{ fontSize: 24, color: 'var(--osd-accent)', fontWeight: 700 }}>CÂU 02</div>
        <p style={{ fontSize: 30, lineHeight: 1.4, fontWeight: 700 }}>Cương lĩnh dân tộc Lênin gồm mấy nội dung?</p>
        <div style={{ fontSize: 25, lineHeight: 1.45, color: ink.soft }}>3: bình đẳng, tự quyết, liên hiệp công nhân các dân tộc.</div>
      </div>
      <div style={{ background: ink.panel, padding: 32, borderTop: '6px solid var(--osd-accent)', minHeight: 360 }}>
        <div style={{ fontSize: 24, color: 'var(--osd-accent)', fontWeight: 700 }}>CÂU 03</div>
        <p style={{ fontSize: 30, lineHeight: 1.4, fontWeight: 700 }}>Việt Nam có bao nhiêu dân tộc?</p>
        <div style={{ fontSize: 25, lineHeight: 1.45, color: ink.soft }}>54 dân tộc.</div>
      </div>
    </div>
  </Frame>
);

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
  'Mời lớp trả lời từng câu, rồi đối chiếu với đáp án trên trang. Giải thích ngắn nếu có câu trả lời khác.',
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
