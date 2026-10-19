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
import vietnamPhoto from './assets/vietnam-hd.png';
import craftPhoto from './assets/craft-weaving.jpg';
import volunteersPhoto from './assets/sinh-vien-tinh-nguyen-vung-cao.jpg';
import schoolPhoto from './assets/mountain-school.jpg';
import gatheringPhoto from './assets/community-gathering.jpg';
import terracesPhoto from './assets/ruong-bac-thang-hd.png';
import wrappingCakePhoto from './assets/goi-banh-hd.png';
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
  typeScale: { hero: 140, body: 38 },
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
            fontSize: 28,
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
    <img src={vietnamPhoto} alt="Bản đồ Việt Nam ghép từ hình ảnh con người và văn hóa" style={{ position: 'absolute', right: 40, top: 0, width: 760, height: 1000, objectFit: 'contain', mixBlendMode: 'multiply' }} />
    <motion.div {...useEntry(0.05)} style={{ position: 'absolute', left: P, top: 94, fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--osd-accent)' }}>CHỦ NGHĨA XÃ HỘI KHOA HỌC / NHÓM 3</motion.div>
    <div style={{ position: 'absolute', left: P, top: 240, width: 1010 }}>
      <motion.div {...useEntry(0.1, 'fade')} style={{ width: 96, height: 8, background: 'var(--osd-accent)', marginBottom: 38, transformOrigin: 'left' }} />
      <motion.h1 {...useEntry(0.15)} style={{ margin: 0, fontFamily: font.display, fontSize: 93, lineHeight: 1.07, letterSpacing: '-0.04em', fontWeight: 700 }}>Vấn đề dân tộc<br />trong thời kỳ<br />quá độ lên CNXH</motion.h1>
      <motion.p {...useEntry(0.24)} style={{ margin: '34px 0 0', maxWidth: 870, fontSize: 30, lineHeight: 1.45, color: ink.soft }}>Từ hai nghĩa của dân tộc đến 54 dân tộc Việt Nam.</motion.p>
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

const DivConcept = () => <Divider roman="I" label="PHẦN I" sub="Chương 1 · 1.1: Khái niệm và đặc trưng cơ bản của dân tộc" />;

const WhyThisTopic: Page = () => (
  <Frame eyebrow="Mở đầu" title="Vì sao cần hiểu đúng vấn đề dân tộc?" lead="Bốn lý do: lý luận, thực tiễn Việt Nam, an ninh và trách nhiệm sinh viên.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 28, height: '100%' }}>
      <PointCard number="01" title="Cơ sở lý luận" text="Hiểu đúng quan điểm Mác – Lênin về dân tộc." />
      <PointCard number="02" title="Thực tiễn Việt Nam" text="54 dân tộc · đoàn kết là nền tảng phát triển." />
      <PointCard number="03" title="Chính trị – an ninh" text="Vùng dân tộc, miền núi: quốc phòng, tài nguyên, sinh thái." />
      <PointCard number="04" title="Trách nhiệm sinh viên" text="Tôn trọng khác biệt · bảo tồn văn hóa · kiểm chứng thông tin." />
    </div>
  </Frame>
);

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
  <Frame staticContent eyebrow="Chương 1 · 1.1" title="Từ thị tộc đến dân tộc">
    <div style={{ position: 'relative', height: '100%' }}>
      <TimelineRule />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '100%', width: '100%' }}>
        <TimelineItem number="01" title="Thị tộc" description="Quan hệ huyết thống · lao động chung." />
        <TimelineItem number="02" title="Bộ lạc" description="Nhiều thị tộc · lãnh thổ chung." />
        <TimelineItem number="03" title="Bộ tộc" description="Ngôn ngữ, văn hóa dần ổn định." />
        <TimelineItem number="04" title="Dân tộc" description="Kinh tế, văn hóa, chính trị gắn kết." />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: '170px 1fr', gap: 24, alignItems: 'center', background: ink.panel, borderLeft: '6px solid var(--osd-accent)', padding: '22px 30px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--osd-accent)' }}>DẤU MỐC</div>
        <div style={{ fontSize: 29, lineHeight: 1.35 }}>Dân tộc = cộng đồng ổn định · kinh tế · lãnh thổ · ngôn ngữ · văn hóa · nhà nước.</div>
      </div>
    </div>
  </Frame>
);

const BranchRow = ({ number, label, detail }: { number: string; label: string; detail?: string }) => (
  <motion.div {...useEntry(0.4 + Number(number) * 0.09)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderLeft: '6px solid var(--osd-accent)', padding: '10px 26px', display: 'flex', alignItems: 'center', gap: 20, height: 92, boxSizing: 'border-box' }}>
    <span style={{ fontSize: 22, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 30 }}>{number}</span>
    <span style={{ fontSize: 30, lineHeight: 1.3, color: ink.text }}>{label}{detail && <small style={{ display: 'block', fontSize: 22, color: ink.muted, marginTop: 3 }}>{detail}</small>}</span>
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
  <Frame staticContent eyebrow="Chương 1 · 1.1" title="Dân tộc theo nghĩa rộng" lead="Cộng đồng ổn định làm thành nhân dân một nước.">
    <div style={{ position: 'relative', height: 622 }}>
      <ConceptBranches />
      <Reveal delay={0.1} style={{ background: 'var(--osd-accent)', color: '#fff', position: 'absolute', left: 0, top: 0, width: 540, height: 622 }}>
        <img src={terracesPhoto} alt="Ruộng bậc thang vùng cao Việt Nam" style={{ width: '100%', height: 246, objectFit: 'cover', objectPosition: 'center 58%', filter: 'saturate(.75)' }} />
        <div style={{ padding: '25px 34px' }}>
          <div style={{ fontSize: 23, letterSpacing: '0.12em' }}>NGHĨA RỘNG · QUỐC GIA</div>
          <div style={{ fontFamily: font.display, fontSize: 37, lineHeight: 1.12, marginTop: 10 }}>Một cộng đồng quốc gia</div>
          <div style={{ fontSize: 23, lineHeight: 1.38, marginTop: 16 }}>Gắn bó bởi lợi ích chính trị, kinh tế và truyền thống lịch sử.</div>
          <div style={{ fontSize: 25, marginTop: 18 }}>Ví dụ: Việt Nam, Nhật Bản</div>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 41, width: 960, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <BranchRow number="01" label="Lãnh thổ ổn định" detail="Không gian sinh sống thuộc chủ quyền quốc gia." />
        <BranchRow number="02" label="Phương thức kinh tế chung" detail="Phân công lao động, trao đổi giữa các vùng." />
        <BranchRow number="03" label="Ngôn ngữ giao tiếp chung" detail="Bên cạnh tiếng nói của từng tộc người." />
        <BranchRow number="04" label="Văn hóa và tâm lý chung" detail="Giá trị lịch sử tạo nên ý thức thống nhất." />
        <BranchRow number="05" label="Một nhà nước chung" detail="Quản lý xã hội, bảo vệ chủ quyền." />
      </div>
    </div>
  </Frame>
);

const EthnieDiagram: Page = () => (
  <Frame staticContent eyebrow="Chương 1 · 1.1" title="Dân tộc theo nghĩa hẹp" lead="Cộng đồng tộc người hình thành trong lịch sử, liên hệ bền vững.">
    <div style={{ position: 'relative', height: 622 }}>
      <ConceptBranches narrow />
      <Reveal delay={0.1} style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 622, boxSizing: 'border-box', background: ink.panel, border: `1px solid ${ink.rule}` }}>
        <img src={wrappingCakePhoto} alt="Gia đình quây quần gói bánh truyền thống" style={{ width: '100%', height: 365, objectFit: 'cover' }} />
        <div style={{ padding: '26px 34px' }}><div style={{ fontFamily: font.display, fontSize: 37, fontWeight: 700 }}>Một cộng đồng tộc người</div><div style={{ fontSize: 27, color: ink.soft, marginTop: 12 }}>Ví dụ: dân tộc Kinh, dân tộc Thái</div></div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 89, width: 960, display: 'flex', flexDirection: 'column', gap: 84 }}>
        <BranchRow number="01" label="Cộng đồng ngôn ngữ" detail="Tiếng mẹ đẻ gắn kết và lưu giữ ký ức." />
        <BranchRow number="02" label="Cộng đồng văn hóa" detail="Phong tục, lễ hội, trang phục, nghệ thuật." />
        <BranchRow number="03" label="Ý thức tự giác" detail="Tự nhận thuộc về một tộc người." />
      </div>
    </div>
  </Frame>
);

const CompareRow = ({ criterion, nation, ethnie, header = false }: { criterion: string; nation: string; ethnie: string; header?: boolean }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 1fr', gap: 24, padding: '12px 22px', minHeight: 72, height: '100%', boxSizing: 'border-box', alignItems: 'center', background: header ? 'var(--osd-accent)' : ink.panel, color: header ? '#fff' : ink.text, border: header ? 'none' : `1px solid ${ink.rule}`, fontSize: 25, lineHeight: 1.28, fontWeight: header ? 700 : 500 }}>
    <div>{criterion}</div><div>{nation}</div><div>{ethnie}</div>
  </div>
);

const TableCompare: Page = () => (
  <Frame eyebrow="Chương 1 · 1.1" title="Một từ, hai phạm vi" lead="Nghĩa rộng: nhân dân một nước. Nghĩa hẹp: từng cộng đồng tộc người.">
    <div style={{ display: 'grid', gridTemplateRows: '72px repeat(5, 1fr)', gap: 10, height: '100%' }}>
      <CompareRow header criterion="Tiêu chí" nation="Nghĩa rộng · Nation" ethnie="Nghĩa hẹp · Ethnie" />
      <CompareRow criterion="Bản chất" nation="Cộng đồng chính trị – xã hội" ethnie="Cộng đồng tộc người" />
      <CompareRow criterion="Phạm vi" nation="Toàn thể nhân dân một quốc gia" ethnie="Từng tộc người, trong hoặc xuyên quốc gia" />
      <CompareRow criterion="Đặc trưng" nation="Lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý, nhà nước" ethnie="Ngôn ngữ, văn hóa, ý thức tự giác" />
      <CompareRow criterion="Gắn kết" nation="Lợi ích chính trị, kinh tế; lịch sử dựng nước" ethnie="Nguồn gốc, ngôn ngữ, văn hóa" />
      <CompareRow criterion="Ví dụ" nation="Việt Nam, Nhật Bản" ethnie="Kinh, Thái" />
    </div>
  </Frame>
);

// One list format for the whole deck: numbered panel, left accent bar,
// short headline and a single keyword line. Every text list uses this.
const PointCard = ({ number, title, text }: { number: string; title: string; text: string }) => (
  <motion.div {...useEntry(0.12 + Number(number) * 0.06)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderLeft: '6px solid var(--osd-accent)', padding: '26px 30px', boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.06em' }}>{number}</span>
      <h3 style={{ fontFamily: font.display, fontSize: 33, lineHeight: 1.18, margin: 0 }}>{title}</h3>
    </div>
    <div style={{ fontSize: 27, lineHeight: 1.4, color: ink.soft, marginTop: 10 }}>{text}</div>
  </motion.div>
);

const IssueDef: Page = () => (
  <Frame eyebrow="Chương 1 · 1.1" title="Vấn đề dân tộc là gì" lead="Quan hệ giữa các tộc người và giữa các quốc gia dân tộc.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 24, height: '100%' }}>
      <PointCard number="01" title="Bình đẳng" text="Địa vị và cách đối xử giữa các cộng đồng." />
      <PointCard number="02" title="Quyền lợi" text="Chính trị, kinh tế, văn hóa, xã hội." />
      <PointCard number="03" title="Chênh lệch phát triển" text="Điều kiện sống và cơ hội giữa các vùng." />
      <PointCard number="04" title="Gắn với giai cấp" text="Quan hệ dân tộc chịu chi phối của lợi ích giai cấp." />
    </div>
  </Frame>
);

const DivMarx = () => <Divider roman="II" label="PHẦN II" sub="Chương 1 · 1.2 – 1.5: Hai xu hướng, cương lĩnh Lênin, Hồ Chí Minh, thời kỳ quá độ" />;

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
  <motion.div {...useEntry(0.1 + Number(number) * 0.1)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderTop: `7px solid ${mode === 'separate' ? '#8b2f2a' : '#2f6671'}`, padding: 34, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div>
      <div style={{ color: mode === 'separate' ? '#8b2f2a' : '#2f6671', fontSize: 24, fontWeight: 700 }}>XU HƯỚNG {number}</div>
      <h3 style={{ fontFamily: font.display, fontSize: 39, lineHeight: 1.18, margin: '12px 0 8px', minHeight: 92 }}>{title}</h3>
      <TrendVisual mode={mode} />
    </div>
    <div>
      <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft }}><strong>Cơ sở:</strong> {cause}</div>
      <div style={{ height: 2, background: ink.rule, margin: '18px 0' }} />
      <div style={{ fontSize: 26, lineHeight: 1.42, color: ink.soft }}><strong>Biểu hiện:</strong> {result}</div>
    </div>
  </motion.div>
);

const TwoTrends: Page = () => (
  <Frame staticContent eyebrow="Chương 1 · 1.2" title="Hai xu hướng khách quan">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, height: '100%' }}>
      <TrendCard number="01" mode="separate" title="Tách ra, lập quốc gia" cause="Ý thức dân tộc · chống áp bức, giành độc lập." result="Đấu tranh giải phóng · thoát đô hộ." />
      <TrendCard number="02" mode="unite" title="Các dân tộc liên hiệp" cause="Sản xuất, công nghệ, giao lưu phá hàng rào." result="Xích lại gần · hợp tác trong nước và quốc tế." />
    </div>
  </Frame>
);

const TrendCell = ({ label, text }: { label: string; text: string }) => (
  <div style={{ background: ink.panel, border: `1px solid ${ink.rule}`, padding: '24px 30px' }}><div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)', marginBottom: 12 }}>{label}</div><div style={{ fontSize: 27, lineHeight: 1.42, color: ink.soft }}>{text}</div></div>
);

const TrendContexts: Page = () => (
  <Frame eyebrow="Chương 1 · 1.2" title="Biểu hiện trong nước và quốc tế">
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gridTemplateRows: '64px 1fr 1fr', gap: 14, height: '100%' }}>
      <div />
      <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--osd-accent)', alignSelf: 'center' }}>TRONG MỘT QUỐC GIA</div>
      <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--osd-accent)', alignSelf: 'center' }}>TRÊN PHẠM VI QUỐC TẾ</div>
      <div style={{ background: 'var(--osd-accent)', color: '#fff', padding: 28, fontFamily: font.display, fontSize: 35, lineHeight: 1.2 }}>01<br />Tách ra</div>
      <TrendCell label="TỰ DO, BÌNH ĐẲNG" text="Từng tộc người phấn đấu vì cộng đồng mình." />
      <TrendCell label="GIẢI PHÓNG DÂN TỘC" text="Chống thực dân, chính sách đô hộ." />
      <div style={{ background: ink.gold, color: '#fff', padding: 28, fontFamily: font.display, fontSize: 35, lineHeight: 1.2 }}>02<br />Liên hiệp</div>
      <TrendCell label="XÍCH LẠI GẦN NHAU" text="Gắn bó, hợp tác trên nhiều lĩnh vực." />
      <TrendCell label="HỢP TÁC KHU VỰC, TOÀN CẦU" text="Liên minh dân tộc ở khu vực, thế giới." />
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
    <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 38, right: 38, top: expanded ? 110 : 134, bottom: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3 style={{ fontFamily: font.display, fontSize: 38, lineHeight: 1.2, margin: 0, minHeight: 138 }}>{title}</h3>
      <p style={{ fontSize: 28, lineHeight: 1.5, margin: '24px 0 0' }}>{detail}</p>
    </Reveal>
  </div>
);

const LeninPillars: Page = () => (
  <Frame staticContent eyebrow="Chương 1 · 1.3" title="Cương lĩnh dân tộc của Lênin">
    <div style={{ position: 'relative', height: 684 }}>
      <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 572, top: 0, width: 536, height: 64, background: ink.panel, border: `1px solid ${ink.rule}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 600 }}>BA NGUYÊN TẮC GẮN BÓ</Reveal>
      <svg width={1680} height={154} style={{ position: 'absolute', top: 0, left: 0 }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth={3}>
          <StrokePath d="M840 64 V104 H268 V154" delay={0.75} />
          <StrokePath d="M840 104 V154" delay={0.85} duration={0.5} />
          <StrokePath d="M840 104 H1412 V154" delay={0.95} />
        </g>
      </svg>
      <PillarCard number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Quyền, nghĩa vụ ngang nhau · chống áp bức, phân biệt." />
      <PillarCard number="02" title="Các dân tộc được quyền tự quyết" detail="Tự chọn đường phát triển · chia tách hoặc liên hiệp." />
      <PillarCard number="03" title="Liên hiệp công nhân các dân tộc" detail="Tự nguyện, bình đẳng · tôn trọng quyền tự quyết." />
    </div>
  </Frame>
);

const LeninDetail: Page = () => (
  <Frame staticContent eyebrow="Chương 1 · 1.3" title="Nội dung của ba nguyên tắc">
    <div style={{ position: 'relative', height: 684 }}>
      <PillarCard expanded number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Mọi dân tộc ngang quyền. Bình đẳng trong pháp luật và đời sống." />
      <PillarCard expanded number="02" title="Các dân tộc được quyền tự quyết" detail="Tự chọn con đường phát triển, đặt trong lợi ích chung; chống chia rẽ." />
      <PillarCard expanded number="03" title="Liên hiệp công nhân các dân tộc" detail="Đoàn kết công nhân các dân tộc; kết nối bình đẳng với tự quyết." />
    </div>
  </Frame>
);

LeninPillars.transition = morphTransition;
LeninDetail.transition = morphTransition;

const HoChiMinh: Page = () => (
  <Frame eyebrow="Chương 1 · 1.4" title="Đoàn kết là sức mạnh sống còn" lead="Độc lập dân tộc gắn với CNXH; giải phóng dân tộc mở đường giải phóng con người.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', alignItems: 'stretch' }}>
      <motion.div {...useEntry(0.15)} style={{ background: 'var(--osd-accent)', color: '#fff', padding: '40px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: font.display, fontSize: 42, lineHeight: 1.3, fontWeight: 700 }}>“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.”</div>
        <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.5, opacity: 0.92 }}>Các dân tộc là anh em một nhà: bình đẳng, đoàn kết, tương trợ.</div>
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.35)', fontSize: 25, lineHeight: 1.5, opacity: 0.92 }}>Chống tư tưởng dân tộc lớn và dân tộc hẹp hòi.</div>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
        <PointCard number="01" title="Chăm lo đời sống" text="Kinh tế, văn hóa, giáo dục, y tế." />
        <PointCard number="02" title="Cán bộ người dân tộc" text="Phát huy vai trò đội ngũ cán bộ thiểu số." />
      </div>
    </div>
  </Frame>
);

const TransitionTraits: Page = () => (
  <Frame eyebrow="Chương 1 · 1.5" title="Từ bình đẳng pháp lý đến đời sống" lead="Quyền bình đẳng đã có, khoảng cách thực tế vẫn còn.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 24, height: '100%' }}>
      <PointCard number="01" title="Bất bình đẳng thực tế" text="Chênh lệch kinh tế – xã hội do lịch sử để lại." />
      <PointCard number="02" title="Gắn với phát triển" text="Cơ sở vật chất, giảm nghèo, chất lượng sống." />
      <PointCard number="03" title="Tàn dư tư tưởng cũ" text="Kỳ thị, tự ti, dân tộc lớn, hẹp hòi." />
      <PointCard number="04" title="Mang tính quốc tế" text="Toàn cầu hóa, biên giới, cư trú xuyên quốc gia." />
    </div>
  </Frame>
);

const DivVN = () => <Divider roman="III" label="PHẦN III" sub="Chương 2 – 3: Đặc điểm, chính sách, thực trạng và giải pháp" />;

const FeatureNode = ({ number, side, children }: { number: string; side: 'left' | 'right'; children: ReactNode }) => (
  <motion.div {...useEntry(0.35 + ((Number(number) - 1) % 3) * 0.14)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderRight: side === 'left' ? '5px solid var(--osd-accent)' : undefined, borderLeft: side === 'right' ? '5px solid var(--osd-accent)' : undefined, height: 146, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 25px', boxSizing: 'border-box' }}>
    <span style={{ fontFamily: font.display, fontSize: 38, color: 'var(--osd-accent)', fontWeight: 700 }}>{number}</span>
    <span style={{ fontSize: 28, lineHeight: 1.36 }}>{children}</span>
  </motion.div>
);

const VNFeatures: Page = () => (
  <Frame staticContent eyebrow="Chương 2 · 2.1" title="Sáu đặc điểm dân tộc Việt Nam">
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '630px 360px 630px', gap: 30, height: 684, alignItems: 'center' }}>
      <svg viewBox="0 0 1680 684" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
        <g fill="none" stroke="var(--osd-accent)" strokeWidth="3" opacity=".65">
          <StrokePath d="M730 230 C660 230 690 172 630 172" delay={0.2} /><StrokePath d="M680 342 H630" delay={0.34} /><StrokePath d="M730 454 C660 454 690 512 630 512" delay={0.48} />
          <StrokePath d="M950 230 C1020 230 990 172 1050 172" delay={0.2} /><StrokePath d="M1000 342 H1050" delay={0.34} /><StrokePath d="M950 454 C1020 454 990 512 1050 512" delay={0.48} />
        </g>
      </svg>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <FeatureNode number="01" side="left">Kinh ~85,3% · 53 dân tộc thiểu số ~14,7% (2019)</FeatureNode>
        <FeatureNode number="02" side="left">Cư trú xen kẽ</FeatureNode>
        <FeatureNode number="03" side="left">Thiểu số ở địa bàn chiến lược</FeatureNode>
      </div>
      <div style={{ position: 'relative', width: 320, height: 320, justifySelf: 'center', borderRadius: '50%', background: ink.panel, border: '8px solid var(--osd-accent)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.12em' }}>VIỆT NAM · 2019</div>
        <div style={{ fontFamily: font.display, fontSize: 112, fontWeight: 700, lineHeight: 1.05 }}>54</div>
        <div style={{ fontSize: 29, fontWeight: 600 }}>dân tộc</div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <FeatureNode number="04" side="right">Trình độ phát triển không đều</FeatureNode>
        <FeatureNode number="05" side="right">Đoàn kết gắn bó lâu đời</FeatureNode>
        <FeatureNode number="06" side="right">Bản sắc riêng · văn hóa thống nhất</FeatureNode>
      </div>
    </div>
  </Frame>
);

const PartyView: Page = () => (
  <Frame eyebrow="Chương 2 · 2.2" title="Quan điểm về vấn đề dân tộc">
    <div style={{ display: 'grid', gridTemplateColumns: '540px 1fr', gap: 40, height: '100%' }}>
      <img src={gatheringPhoto} alt="Sinh hoạt cộng đồng" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '56% center' }} />
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gap: 9 }}>
        <PointCard number="01" title="Chiến lược, lâu dài" text="Cấp bách của cách mạng Việt Nam." />
        <PointCard number="02" title="Bình đẳng, đoàn kết" text="Tương trợ, cùng phát triển; chống chia rẽ." />
        <PointCard number="03" title="Phát triển toàn diện" text="Chính trị, kinh tế, văn hóa, xã hội, QP – AN." />
        <PointCard number="04" title="Ưu tiên vùng khó" text="Hạ tầng, giảm nghèo, phát huy tiềm năng." />
        <PointCard number="05" title="Nhiệm vụ toàn hệ thống" text="Toàn Đảng, toàn dân, toàn quân." />
      </div>
    </div>
  </Frame>
);

const LegalBasis: Page = () => (
  <Frame eyebrow="Chương 2 · 2.2" title="Cơ sở cho chính sách dân tộc" lead="Bốn văn kiện định hướng quyền, chính sách và chương trình hành động.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 24, height: '100%' }}>
      <PointCard number="01" title="Hiến pháp 2013 · Điều 5" text="Cấm kỳ thị · quyền dùng tiếng nói, chữ viết · bảo tồn bản sắc." />
      <PointCard number="02" title="Nghị quyết 24-NQ/TW · 2003" text="Công tác dân tộc là chiến lược · gắn phát triển với QP – AN." />
      <PointCard number="03" title="Đại hội XIII · 2021" text="Giải quyết quan hệ dân tộc · phát huy đại đoàn kết." />
      <PointCard number="04" title="Nghị quyết 120/2020/QH14" text="Chương trình mục tiêu quốc gia vùng dân tộc, 2021–2030." />
    </div>
  </Frame>
);

const PolicyCard = ({ number, title, detail, image, alt, expanded = false }: { number: string; title: string; detail: string; image: string; alt: string; expanded?: boolean }) => (
  <div style={{ position: 'absolute', left: (Number(number) - 1) * (expanded ? 857 : 340), top: expanded ? 0 : 150, width: expanded ? 823 : 320, height: expanded ? 650 : 526 }}>
    <MorphElement id={`policy-${number}`}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: ink.panel, borderTop: '6px solid var(--osd-accent)', boxSizing: 'border-box' }} />
    </MorphElement>
    <Reveal delay={MORPH_MS / 1000} style={{ position: 'absolute', left: 0, right: 0, top: 6 }}>
      <img src={image} alt={alt} style={{ display: 'block', width: '100%', height: expanded ? 310 : 230, objectFit: 'cover', filter: 'saturate(.82)' }} />
    </Reveal>
    <MorphElement id={`policy-number-${number}`}>
      <div style={{ position: 'absolute', left: expanded ? 32 : 22, top: expanded ? 340 : 256, width: 64, height: 28, fontSize: 22, lineHeight: 1.2, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    </MorphElement>
    <Reveal delay={MORPH_MS / 1000 + 0.06} style={{ position: 'absolute', left: expanded ? 32 : 22, right: expanded ? 32 : 22, top: expanded ? 368 : 284 }}>
      <h3 style={{ fontFamily: font.display, fontSize: expanded ? 40 : 30, lineHeight: 1.17, margin: '8px 0 12px', minHeight: 70 }}>{title}</h3>
      <p style={{ fontSize: expanded ? 28 : 24, lineHeight: 1.4, color: ink.soft, margin: 0 }}>{detail}</p>
    </Reveal>
  </div>
);

const PolicyMatrix: Page = () => (
  <Frame staticContent eyebrow="Chương 2 · 2.2" title="Năm lĩnh vực chính sách">
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
        <PolicyCard number="01" title="Chính trị" detail="Bình đẳng, đoàn kết, tôn trọng." image={gatheringPhoto} alt="Sinh hoạt cộng đồng" />
        <PolicyCard number="02" title="Kinh tế" detail="Tiềm năng vùng · thu hẹp chênh lệch." image={bridgePhoto} alt="Cầu đường ở miền núi" />
        <PolicyCard number="03" title="Xã hội" detail="An sinh, giáo dục, y tế." image={schoolPhoto} alt="Trường học miền núi" />
        <PolicyCard number="04" title="Văn hóa" detail="Giữ bản sắc · mở giao lưu." image={craftPhoto} alt="Nghề dệt truyền thống" />
        <PolicyCard number="05" title="Quốc phòng – an ninh" detail="Ổn định · quan hệ quân dân." image={borderPhoto} alt="Cán bộ và người dân trò chuyện" />
    </div>
  </Frame>
);

const PolicyPoliticalEconomic: Page = () => (
  <Frame staticContent eyebrow="Chương 2 · 2.2" title="Chính sách chính trị và kinh tế">
    <div style={{ position: 'relative', height: 684 }}>
      <PolicyCard expanded number="01" title="Chính trị" detail="Bình đẳng, đoàn kết · hệ thống chính trị cơ sở · cán bộ người dân tộc." image={gatheringPhoto} alt="Sinh hoạt cộng đồng" />
      <PolicyCard expanded number="02" title="Kinh tế" detail="Hạ tầng, sinh kế · giảm nghèo bền vững · Chương trình 135 và giai đoạn 2021–2030." image={bridgePhoto} alt="Cầu đường ở miền núi" />
    </div>
  </Frame>
);

PolicyMatrix.transition = morphTransition;
PolicyPoliticalEconomic.transition = morphTransition;

const PolicySocial: Page = () => (
  <Frame eyebrow="Chương 2 · 2.2" title="Chính sách xã hội">
    <div style={{ display: 'grid', gridTemplateColumns: '760px 1fr', gap: 44, height: '100%' }}>
      <img src={schoolPhoto} alt="Trường học miền núi" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '66% center' }} />
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 20, height: '100%' }}>
        <PointCard number="01" title="An sinh" text="Bảo đảm đời sống đồng bào thiểu số." />
        <PointCard number="02" title="Công bằng" text="Bình đẳng qua giáo dục, y tế, giảm nghèo." />
        <PointCard number="03" title="Dân số" text="Chăm sóc sức khỏe và ổn định dân số." />
      </div>
    </div>
  </Frame>
);

const PolicyCulture: Page = () => (
  <Frame eyebrow="Chương 2 · 2.2" title="Chính sách văn hóa">
    <div style={{ display: 'grid', gridTemplateColumns: '650px 1fr', gap: 44, height: '100%' }}>
      <img src={craftPhoto} alt="Nghề dệt truyền thống" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '44% center' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', gap: 14, height: '100%' }}>
        <PointCard number="01" title="Bản sắc" text="Nền văn hóa tiên tiến, đậm đà bản sắc." />
        <PointCard number="02" title="Di sản" text="Giữ gìn, phát huy giá trị truyền thống." />
        <PointCard number="03" title="Dân trí" text="Nâng cao trình độ văn hóa nhân dân." />
        <PointCard number="04" title="Thiết chế" text="Cán bộ, môi trường, thiết chế văn hóa." />
        <PointCard number="05" title="Giao lưu" text="Mở rộng với khu vực và thế giới." />
        <PointCard number="06" title="Đấu tranh" text="Chống tệ nạn và diễn biến hòa bình." />
      </div>
    </div>
  </Frame>
);

const PolicySecurity: Page = () => (
  <Frame eyebrow="Chương 2 · 2.2" title="Chính sách quốc phòng – an ninh">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 44, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ flex: 1 }}><PointCard number="01" title="Bảo vệ Tổ quốc" text="Ổn định chính trị · an ninh · trật tự xã hội." /></div>
        <div style={{ flex: 1 }}><PointCard number="02" title="Quan hệ quân dân" text="Thế trận quốc phòng toàn dân vùng đồng bào." /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', background: ink.panel }}>
        <img src={borderPhoto} alt="Cán bộ và người dân trò chuyện" style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'cover', objectPosition: 'center 35%', filter: 'saturate(.82)' }} />
        <div style={{ padding: '22px 30px', fontSize: 25, lineHeight: 1.4, color: ink.soft }}>Quan hệ quân dân ở vùng đồng bào dân tộc.</div>
      </div>
    </div>
  </Frame>
);

const Achievements: Page = () => (
  <Frame eyebrow="Chương 2 · 2.3" title="Những chuyển biến sau Đổi mới" lead="Tiến bộ về đoàn kết, đời sống và tiếp cận dịch vụ thiết yếu.">
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 18, height: '100%' }}>
      <PointCard number="01" title="Đoàn kết" text="Củng cố · nền tảng ổn định và phát triển." />
      <PointCard number="02" title="Kinh tế – xã hội" text="Hạ tầng đầu tư · hộ nghèo giảm." />
      <PointCard number="03" title="Giáo dục – y tế – văn hóa" text="Dịch vụ mở rộng · di sản được bảo tồn." />
      <PointCard number="04" title="Quốc phòng – an ninh" text="Giữ vững · thế trận lòng dân vững chắc." />
    </div>
  </Frame>
);

const Challenges: Page = () => (
  <Frame eyebrow="Chương 2 · 2.4" title="Khoảng cách phát triển vẫn còn" lead="Tiến bộ chưa đồng đều giữa các địa bàn và cộng đồng.">
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: 18, height: '100%' }}>
      <PointCard number="01" title="Nghèo, tái nghèo" text="Sinh kế chưa ổn định · tỷ lệ còn cao." />
      <PointCard number="02" title="Hạ tầng, nhân lực" text="Thiếu và yếu · tiếp cận dịch vụ khó khăn." />
      <PointCard number="03" title="Chính sách, thực hiện" text="Chồng chéo, dàn trải · năng lực cơ sở hạn chế." />
      <PointCard number="04" title="Đất đai, khí hậu" text="Thiếu đất sản xuất · di cư tự phát." />
    </div>
  </Frame>
);

const CulturalChallenges: Page = () => (
  <Frame eyebrow="Chương 2 · 2.4" title="Giữ bản sắc, củng cố niềm tin" lead="Hai thách thức về văn hóa và thông tin.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, flex: 1 }}>
        <PointCard number="05" title="Mai một văn hóa" text="Thị trường, hội nhập làm suy giảm tiếng nói, nghề truyền thống." />
        <PointCard number="06" title="Thông tin chia rẽ" text="Tin sai lệch lợi dụng khác biệt dân tộc, tôn giáo." />
      </div>
      <div style={{ borderLeft: `6px solid ${ink.gold}`, padding: '24px 32px', fontSize: 30, lineHeight: 1.4, background: ink.panel }}>Giải pháp: cải thiện đời sống · gìn giữ văn hóa · phát huy vai trò cộng đồng.</div>
    </div>
  </Frame>
);

const SolutionsA: Page = () => (
  <Frame eyebrow="Chương 3 · 3.1 – 3.2" title="Mở rộng cơ hội phát triển" lead="Đồng bào là chủ thể quyết định và thực hiện phát triển.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, height: '100%' }}>
      <PointCard number="01" title="Nâng cao nhận thức" text="Lãnh đạo của Đảng · hệ thống chính trị cơ sở · cán bộ gần dân." />
      <PointCard number="02" title="Giảm nghèo bền vững" text="Hạ tầng, sinh kế · đất ở, nhà ở, nước sinh hoạt." />
      <PointCard number="03" title="Đầu tư giáo dục" text="Trường nội trú, bán trú · đào tạo nghề · thu hút nhân lực." />
    </div>
  </Frame>
);

const SolutionsB: Page = () => (
  <Frame eyebrow="Chương 3 · 3.2" title="Phát triển đi cùng gìn giữ" lead="Văn hóa, an ninh và cách thực hiện chính sách.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, height: '100%' }}>
      <PointCard number="04" title="Bảo tồn bản sắc" text="Di sản gắn du lịch bền vững · sinh kế cộng đồng." />
      <PointCard number="05" title="Quốc phòng, an ninh" text="Phát triển gắn bảo vệ biên giới · chống lợi dụng chia rẽ." />
      <PointCard number="06" title="Thực hiện hiệu quả" text="Rà soát chồng chéo · phân cấp · giám sát · đồng bào tham gia." />
    </div>
  </Frame>
);

const Practice: Page = () => (
  <Frame eyebrow="Liên hệ thực tiễn" title="Sinh viên làm ba việc">
    <div style={{ display: 'grid', gridTemplateColumns: '620px 1fr', gap: 48, height: '100%' }}>
      <div style={{ background: ink.panel }}>
        <img src={volunteersPhoto} alt="Sinh viên tình nguyện cùng đồng bào vùng cao" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '53% center' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 18, height: '100%' }}>
        <PointCard number="01" title="Học đúng" text="Nắm quan điểm Mác – Lênin, Hồ Chí Minh · hiểu 54 dân tộc." />
        <PointCard number="02" title="Tôn trọng" text="Tìm hiểu ngôn ngữ, lễ hội, trang phục · tránh định kiến." />
        <PointCard number="03" title="Cảnh giác" text="Kiểm chứng thông tin · không tiếp tay nội dung chia rẽ." />
      </div>
    </div>
  </Frame>
);

const Summary: Page = () => (
  <Frame eyebrow="Tổng kết" title="Ba điểm cần nhớ">
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 22, height: '100%' }}>
      <PointCard number="01" title="Hai nghĩa của dân tộc" text="Nation: nhân dân một nước · Ethnie: cộng đồng tộc người." />
      <PointCard number="02" title="Cương lĩnh và đại đoàn kết" text="Bình đẳng · tự quyết · liên hiệp công nhân." />
      <PointCard number="03" title="Bình đẳng gắn phát triển" text="Thu hẹp khoảng cách · tôn trọng bản sắc · củng cố đoàn kết." />
    </div>
  </Frame>
);

// A home board and a separate arena share progress within this game page.
type QuizQuestion = { topic: string; question: string; options: readonly [string, string, string, string]; correct: number; explanation: string };
const quizQuestions: readonly QuizQuestion[] = [
  { topic: 'Khởi động · Chương 1', question: 'Thứ tự hình thành các cộng đồng người là gì?', options: ['Bộ lạc → thị tộc → dân tộc → bộ tộc', 'Thị tộc → bộ lạc → bộ tộc → dân tộc', 'Thị tộc → bộ tộc → bộ lạc → dân tộc', 'Dân tộc → bộ tộc → bộ lạc → thị tộc'], correct: 1, explanation: 'Tiến trình được trình bày: thị tộc, bộ lạc, bộ tộc rồi đến dân tộc.' },
  { topic: 'Giải mã khái niệm · Chương 1', question: '“Dân tộc” theo nghĩa rộng chỉ cộng đồng nào?', options: ['Những người cùng một dòng họ', 'Một cộng đồng tộc người', 'Nhân dân của một nước', 'Những người cùng tôn giáo'], correct: 2, explanation: 'Nghĩa rộng nói đến cộng đồng quốc gia; ví dụ là Việt Nam hoặc Nhật Bản.' },
  { topic: 'Nhớ đúng, chọn nhanh · Chương 1', question: 'Dân tộc theo nghĩa rộng có mấy đặc trưng cơ bản?', options: ['3 đặc trưng', '5 đặc trưng', '4 đặc trưng', '6 đặc trưng'], correct: 1, explanation: 'Năm đặc trưng: lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý và nhà nước.' },
  { topic: 'Bắt đúng từ khóa · Chương 1', question: 'Đâu là một đặc trưng của dân tộc theo nghĩa hẹp?', options: ['Ý thức tự giác tộc người', 'Có nhà nước riêng', 'Có lãnh thổ riêng biệt', 'Có một nền kinh tế độc lập'], correct: 0, explanation: 'Nghĩa hẹp có ba đặc trưng: ngôn ngữ, văn hóa và ý thức tự giác tộc người.' },
  { topic: 'Đổi góc nhìn · Chương 2', question: 'Hai xu hướng khách quan của quan hệ dân tộc là gì?', options: ['Đô thị hóa và công nghiệp hóa', 'Cạnh tranh và khép kín', 'Đồng hóa và phân biệt', 'Tách ra độc lập và liên hiệp lại'], correct: 3, explanation: 'Hai xu hướng là hình thành dân tộc độc lập và các dân tộc xích lại gần, liên hiệp với nhau.' },
  { topic: 'Tìm nguyên nhân · Chương 2', question: 'Yếu tố nào thúc đẩy các dân tộc liên hiệp lại?', options: ['Phát triển sản xuất, công nghệ, giao lưu', 'Sống biệt lập với thế giới', 'Áp bức và phân biệt dân tộc', 'Ngăn cản hợp tác quốc tế'], correct: 0, explanation: 'Lực lượng sản xuất, khoa học công nghệ và giao lưu phát triển thúc đẩy hợp tác giữa các dân tộc.' },
  { topic: 'Bộ ba nguyên tắc · Chương 2', question: 'Bộ ba nào thuộc cương lĩnh dân tộc của Lênin?', options: ['Lãnh thổ – kinh tế – nhà nước', 'Độc lập – khép kín – tự cung tự cấp', 'Bình đẳng – tự quyết – liên hiệp công nhân', 'Ngôn ngữ – văn hóa – huyết thống'], correct: 2, explanation: 'Cương lĩnh gồm bình đẳng, quyền tự quyết và liên hiệp công nhân các dân tộc.' },
  { topic: 'Hiểu chứ không học vẹt · Chương 2', question: 'Quyền tự quyết của dân tộc được hiểu như thế nào?', options: ['Can thiệp vào công việc dân tộc khác', 'Bắt buộc phải tách thành nước riêng', 'Tự chọn con đường phát triển', 'Từ chối mọi hình thức liên hiệp'], correct: 2, explanation: 'Tự quyết là tự chọn con đường phát triển, quyết định chia tách hoặc liên hiệp; không đồng nghĩa bắt buộc chia tách.' },
  { topic: 'Tự hào Việt Nam · Chương 3', question: 'Cộng đồng các dân tộc Việt Nam có bao nhiêu dân tộc?', options: ['50 dân tộc', '52 dân tộc', '56 dân tộc', '54 dân tộc'], correct: 3, explanation: 'Việt Nam là quốc gia thống nhất của 54 dân tộc, mỗi dân tộc có bản sắc riêng.' },
  { topic: 'Về đích · Chương 3', question: 'Chính sách dân tộc trong bài được chia thành mấy lĩnh vực?', options: ['5 lĩnh vực', '3 lĩnh vực', '4 lĩnh vực', '6 lĩnh vực'], correct: 0, explanation: 'Năm lĩnh vực: chính trị, kinh tế, xã hội, văn hóa và quốc phòng – an ninh.' },
  { topic: 'Đối chiếu ví dụ · Chương 1', question: 'Cặp ví dụ nào đúng với “dân tộc theo nghĩa rộng”?', options: ['Người Kinh – người Thái', 'Việt Nam – Nhật Bản', 'Thị tộc – bộ lạc', 'Làng – bản'], correct: 1, explanation: 'Nghĩa rộng lấy quốc gia làm ví dụ: Việt Nam, Nhật Bản. Kinh, Thái là ví dụ của nghĩa hẹp.' },
  { topic: 'Loại trừ · Chương 1', question: 'Đặc trưng nào KHÔNG được nêu riêng cho dân tộc theo nghĩa hẹp?', options: ['Cộng đồng ngôn ngữ', 'Có chung một nhà nước', 'Cộng đồng văn hóa', 'Ý thức tự giác tộc người'], correct: 1, explanation: 'Nhà nước là đặc trưng của nghĩa rộng; nghĩa hẹp chỉ nêu ngôn ngữ, văn hóa và ý thức tự giác.' },
  { topic: 'Trong một quốc gia · Chương 2', question: 'Trong một quốc gia, xu hướng “tách ra” gắn với điều gì?', options: ['Nỗ lực giành tự do, bình đẳng của từng tộc người', 'Xây dựng liên minh toàn cầu', 'Phát triển khoa học công nghệ', 'Mở rộng giao lưu văn hóa'], correct: 0, explanation: 'Trong một quốc gia, xu hướng tách ra là nỗ lực của từng tộc người vì tự do, bình đẳng và phát triển của cộng đồng mình.' },
  { topic: 'Phạm vi quốc tế · Chương 2', question: 'Trên phạm vi quốc tế, xu hướng “liên hiệp” biểu hiện ra sao?', options: ['Đấu tranh giành độc lập', 'Hợp tác, liên minh khu vực và toàn cầu', 'Khép kín biên giới', 'Chia tách thành nhiều quốc gia'], correct: 1, explanation: 'Trên phạm vi quốc tế, các dân tộc hợp tác và hình thành liên minh ở phạm vi khu vực hoặc toàn cầu.' },
  { topic: 'Nguyên tắc bình đẳng · Chương 2', question: 'Nguyên tắc “bình đẳng” trong cương lĩnh Lênin yêu cầu điều gì?', options: ['Mọi dân tộc có quyền, nghĩa vụ ngang nhau; chống phân biệt', 'Dân tộc lớn lãnh đạo dân tộc nhỏ', 'Đồng hóa ngôn ngữ các tộc người', 'Mỗi dân tộc một nhà nước riêng'], correct: 0, explanation: 'Bình đẳng là quyền và nghĩa vụ ngang nhau; trong một quốc gia cần được pháp luật bảo đảm, chống áp bức và phân biệt.' },
  { topic: 'Sức mạnh đoàn kết · Chương 2', question: '“Liên hiệp công nhân các dân tộc” dựa trên cơ sở nào?', options: ['Ép buộc và đồng hóa', 'Tự nguyện, bình đẳng, tôn trọng lẫn nhau', 'Lợi ích của dân tộc đa số', 'Can thiệp công việc nội bộ'], correct: 1, explanation: 'Liên hiệp trên cơ sở tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc.' },
  { topic: 'Chung sống · Chương 3', question: 'Dân cư các tộc người ở Việt Nam phân bố ra sao?', options: ['Sống tách biệt trong vùng khép kín', 'Cư trú xen kẽ với nhau', 'Chỉ tập trung ở đồng bằng', 'Chỉ ở khu vực biên giới'], correct: 1, explanation: 'Một trong sáu đặc điểm là các tộc người cư trú xen kẽ với nhau trên cùng lãnh thổ.' },
  { topic: 'Trách nhiệm chung · Chương 3', question: 'Theo quan điểm của Đảng, công tác dân tộc là nhiệm vụ của ai?', options: ['Riêng cơ quan dân tộc', 'Toàn Đảng, toàn dân, toàn quân và cả hệ thống chính trị', 'Chính quyền vùng dân tộc thiểu số', 'Các tổ chức quốc tế'], correct: 1, explanation: 'Công tác dân tộc được xác định là nhiệm vụ của toàn Đảng, toàn dân, toàn quân và hệ thống chính trị.' },
  { topic: 'Giữ gìn bản sắc · Chương 3', question: 'Chính sách văn hóa nhấn mạnh điều gì?', options: ['Giữ gìn, phát huy giá trị văn hóa truyền thống', 'Xóa bỏ phong tục các tộc người', 'Hạn chế giao lưu văn hóa', 'Đồng phục hóa đời sống tinh thần'], correct: 0, explanation: 'Chính sách văn hóa giữ gìn, phát huy giá trị truyền thống, nâng trình độ văn hóa và mở rộng giao lưu.' },
  { topic: 'Việc mình làm được · Liên hệ', question: 'Việc làm nào phù hợp với sinh viên?', options: ['Chia sẻ tin chưa kiểm chứng', 'Tìm hiểu, tôn trọng văn hóa các dân tộc', 'Kỳ thị khác biệt vùng miền', 'Tránh tiếp xúc với bạn dân tộc khác'], correct: 1, explanation: 'Tìm hiểu lịch sử, ngôn ngữ, văn hóa; tôn trọng khác biệt; kiểm chứng thông tin trước khi chia sẻ.' },
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
  <motion.button ref={buttonRef} type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} aria-label={`Câu ${number}: ${done ? 'đã xong' : selected ? 'đang chọn' : 'chưa xong'}`} aria-pressed={selected} whileHover={reducedMotion ? undefined : { y: -5, rotate: number % 2 ? -2 : 2 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} style={{ height: 112, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: selected ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, borderBottom: `5px solid ${done ? ink.gold : ink.rule}`, borderRadius: 12, background: done ? ink.accentSoft : ink.panel, color: done ? 'var(--osd-accent)' : ink.text, fontFamily: font.body, cursor: 'pointer' }}>
    <span style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}>{pad2(number)} {done ? '✓' : ''}</span>
    <span style={{ fontSize: 22, fontWeight: 600, color: done ? 'var(--osd-accent)' : ink.muted }}>{done ? 'đã hoàn thành' : 'mở câu hỏi'}</span>
  </motion.button>
  );
};

const QuizBoard = ({ done, selected, onSelect, buttonRefs }: { done: boolean[]; selected: number; onSelect: (index: number) => void; buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]> }) => (
  <div role="group" aria-label="Chọn câu hỏi" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
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

const QuizAnswer = ({ index, question, wrong, done, busy, kicked, onChoose, buttonRef }: { index: number; question: QuizQuestion; wrong: boolean; done: boolean; busy: boolean; kicked: boolean; onChoose: (index: number) => void; buttonRef?: Ref<HTMLButtonElement> }) => {
  const reducedMotion = useReducedMotion();
  const correct = done && index === question.correct;
  const disabled = wrong || done || busy;
  return (
    <div style={{ position: 'relative', height: 112 }}>
    {wrong && <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', border: `1px dashed ${ink.rule}`, borderRadius: 6, fontSize: 24, color: ink.muted }}>{'ABCD'[index]} · Đã loại</div>}
    <div className={kicked ? 'answer-kicked' : undefined} data-quiz-answer={index} style={{ position: 'relative', zIndex: kicked ? 5 : 0, visibility: wrong && !kicked ? 'hidden' : 'visible' }}>
    <motion.button ref={buttonRef} type="button" disabled={disabled} onClick={(event) => { event.stopPropagation(); onChoose(index); }} aria-label={`${'ABCD'[index]}. ${question.options[index]}${correct ? ' (đáp án đúng)' : wrong ? ' (đã thử, chưa đúng)' : ''}`} aria-describedby="cnxh-quiz-feedback" whileHover={disabled || reducedMotion ? undefined : { y: -3 }} whileTap={disabled || reducedMotion ? undefined : { scale: 0.99 }} animate={{ backgroundColor: correct ? ink.accentSoft : ink.panel }} transition={{ duration: reducedMotion ? 0 : 0.2 }} style={{ width: '100%', height: 112, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, textAlign: 'left', padding: '16px 22px', border: correct ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, borderRadius: 'var(--osd-radius)', color: ink.text, fontFamily: font.body, cursor: disabled ? 'default' : 'pointer' }}>
      <span aria-hidden="true" style={{ flexShrink: 0, width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: 14, border: correct ? '2px solid var(--osd-accent)' : `1px solid ${ink.rule}`, background: correct ? 'var(--osd-accent)' : ink.panel, color: correct ? '#fff' : 'var(--osd-accent)', fontFamily: font.display, fontWeight: 700, fontSize: 28 }}>{correct ? '✓' : 'ABCD'[index]}</span>
      <span style={{ fontSize: 26, lineHeight: 1.35, fontWeight: 500, textDecoration: wrong ? 'line-through' : 'none', color: wrong ? ink.muted : ink.text }}>{question.options[index]}</span>
    </motion.button>
    </div>
    </div>
  );
};

type FerrisMood = 'idle' | 'angry' | 'happy';

// Original SVG illustration of Ferris: chapter costumes are roles, not ethnic dress.
const Ferris = ({ chapter, mood }: { chapter: number; mood: FerrisMood }) => (
  <svg viewBox="0 0 440 380" role="img" aria-label={`Ferris ${mood === 'angry' ? 'đang giận' : mood === 'happy' ? 'vui mừng' : 'đang đi dạo'}`} style={{ width: '100%', overflow: 'visible' }}>
    <g stroke="#74392b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <g fill="none" stroke="#d65c38" strokeWidth="14">
        <path className="ferris-kick-leg" style={{ transformOrigin: '135px 245px' }} d="M135 245 L85 264 L64 291" />
        <path className="ferris-step-left" style={{ transformOrigin: '139px 265px' }} d="M139 265 L105 295 L104 318" />
        <path className="ferris-step-right" style={{ transformOrigin: '305px 245px' }} d="M305 245 L355 264 L376 291 M301 265 L335 295 L336 318" />
      </g>
      <g className="ferris-claw" style={{ transformOrigin: '125px 215px' }}>
        <path d="M133 218 Q80 226 61 163" fill="none" stroke="#e77c42" strokeWidth="22" />
        <path d="M64 179 C15 171 15 104 49 83 L58 127 L85 92 C112 137 101 168 64 179Z" fill="#f7944b" />
      </g>
      <g style={{ transformOrigin: '315px 215px' }} className="ferris-wave">
        <path d="M307 218 Q360 226 379 163" fill="none" stroke="#e77c42" strokeWidth="22" />
        <path d="M376 179 C425 171 425 104 391 83 L382 127 L355 92 C328 137 339 168 376 179Z" fill="#f7944b" />
      </g>
      <path d="M103 221 L91 202 L115 195 L108 173 L135 173 C151 128 289 128 305 173 L332 173 L325 195 L349 202 L337 221 C345 310 95 310 103 221Z" fill={mood === 'angry' ? '#ef7044' : '#f7944b'} />
      <path d="M128 251 Q220 280 312 251 L306 298 Q220 329 134 298Z" fill={chapter === 1 ? '#285565' : chapter === 2 ? '#495d50' : '#8b2f2a'} />
      {chapter === 1 ? <g><path d="M137 152 L220 121 L303 152 L220 180Z" fill="#285565" /><path d="M279 163 V198" stroke="#d3a849" /><path d="M190 269 L220 280 L250 269 V310 L220 321 L190 310Z" fill="#fff4d6" strokeWidth="4" /><path d="M220 282 V316" strokeWidth="3" /></g>
        : chapter === 2 ? <g><path d="M141 154 C140 91 301 91 299 154Z" fill="#d6ad52" /><path d="M131 156 H309 M220 110 V149" stroke="#846330" /><path d="M158 260 V291 M282 260 V291" stroke="#dbc7a3" /><rect x="190" y="273" width="60" height="32" rx="5" fill="#dbc7a3" strokeWidth="4" /></g>
        : <g><ellipse cx="220" cy="139" rx="82" ry="21" fill="#8b2f2a" /><ellipse cx="220" cy="133" rx="57" ry="11" fill="#b45343" strokeWidth="4" /><path d="M212 268 L228 280 V311" fill="none" stroke="#e9c477" strokeWidth="4" /><circle cx="235" cy="290" r="3" fill="#e9c477" stroke="none" /></g>}
      <ellipse cx="177" cy="211" rx="18" ry="25" fill="#fff7e9" strokeWidth="4" /><ellipse cx="263" cy="211" rx="18" ry="25" fill="#fff7e9" strokeWidth="4" />
      <ellipse cx="181" cy="214" rx="7" ry="12" fill="#352c28" stroke="none" /><ellipse cx="259" cy="214" rx="7" ry="12" fill="#352c28" stroke="none" />
      <g fill="none" stroke="#263c3c" strokeWidth="5"><rect x="151" y="190" width="53" height="46" rx="15" /><rect x="236" y="190" width="53" height="46" rx="15" /><path d="M204 207 Q220 199 236 207 M140 198 L151 203 M289 203 L300 198" /></g>
      {mood === 'angry' ? <g><path d="M156 181 L193 194 M247 194 L284 181 M203 248 Q220 234 237 248" fill="none" /><path d="M321 110 V129 M312 120 H331" stroke="#8b2f2a" /></g>
        : <path d={mood === 'happy' ? 'M198 239 Q220 278 242 239Z' : 'M204 242 Q220 258 236 242'} fill={mood === 'happy' ? '#74392b' : 'none'} strokeWidth="5" />}
      <ellipse cx="146" cy="239" rx="12" ry="6" fill="#d45c3e" stroke="none" /><ellipse cx="294" cy="239" rx="12" ry="6" fill="#d45c3e" stroke="none" />
    </g>
  </svg>
);

const CelebrationPiece = ({ x, y, color, delay = 0 }: { x: number; y: number; color: string; delay?: number }) => (
  <i className="cnxh-confetti" style={{ '--dx': `${x}px`, '--dy': `${y}px`, '--fall': `${340 + Math.abs(x) / 3}px`, background: color, animationDelay: `${delay}ms` } as CSSProperties} />
);

const quizMotionCSS = `
  .cnxh-quiz button:focus-visible { outline: 4px solid #8b2f2a; outline-offset: 5px; }
  .cnxh-quiz .ferris-idle { animation: cnxh-patrol 5s ease-in-out infinite; }
  .cnxh-quiz .ferris-idle .ferris-step-left, .cnxh-quiz .ferris-angry .ferris-step-left { animation: cnxh-step .24s ease-in-out infinite alternate; }
  .cnxh-quiz .ferris-idle .ferris-step-right, .cnxh-quiz .ferris-angry .ferris-step-right { animation: cnxh-step .24s ease-in-out infinite alternate-reverse; }
  .cnxh-quiz .ferris-angry { animation: cnxh-approach 2.2s ease-in-out both; }
  .cnxh-quiz .ferris-angry .ferris-kick-leg { animation: cnxh-kick 2.2s ease-in-out both; }
  .cnxh-quiz .ferris-happy { animation: cnxh-jump 1.4s linear both; }
  .cnxh-quiz .ferris-happy .ferris-wave { animation: cnxh-wave .28s ease-in-out 5 alternate; }
  .cnxh-quiz .answer-kicked { animation: cnxh-fly 2.2s linear both; }
  .cnxh-quiz .question-happy { animation: cnxh-correct .65s ease both; }
  .cnxh-quiz .cnxh-confetti { position:absolute; left:50%; top:55%; width:13px; height:22px; border-radius:3px; animation:cnxh-gravity 1.4s linear both; }
  @keyframes cnxh-patrol { 0%,100% { transform:translateX(0); } 25% { transform:translate(-36px,-5px) rotate(-2deg); } 75% { transform:translate(28px,-5px) rotate(2deg); } }
  @keyframes cnxh-step { from { transform:rotate(-9deg); } to { transform:rotate(12deg); } }
  @keyframes cnxh-approach { 0% { transform:translate(0,0); } 35%,56% { transform:translate(var(--kick-x),var(--kick-y)); } 42% { transform:translate(var(--kick-x),var(--kick-y)) rotate(7deg); } 47% { transform:translate(var(--kick-x),var(--kick-y)) rotate(-5deg); } 95%,100% { transform:translate(0,0); } }
  @keyframes cnxh-kick { 0%,35%,65%,100% { transform:rotate(0); } 41% { transform:rotate(-35deg); } 46%,53% { transform:rotate(48deg); } }
  @keyframes cnxh-fly { 0%,45% { transform:translate(0,0) rotate(0); opacity:1; } 57% { transform:translate(-210px,-125px) rotate(-16deg); } 69% { transform:translate(-480px,-140px) rotate(-32deg); } 81% { transform:translate(-850px,10px) rotate(-55deg); opacity:1; } 95%,100% { transform:translate(-1500px,500px) rotate(-90deg); opacity:0; } }
  @keyframes cnxh-jump { 10% { transform:translateY(10px) scale(1.06,.9); } 27% { transform:translateY(-100px) rotate(-8deg); } 42% { transform:translateY(-135px) rotate(5deg); } 58% { transform:translateY(-100px) rotate(9deg); } 74% { transform:translateY(8px) scale(1.08,.9); } 86% { transform:translateY(-20px); } 100% { transform:none; } }
  @keyframes cnxh-wave { to { transform:rotate(24deg); } }
  @keyframes cnxh-correct { 45% { transform:translateY(-8px); box-shadow:0 16px 0 #b88a3b33; } }
  @keyframes cnxh-gravity { 0% { transform:translate(0,0) rotate(0); opacity:0; } 10% { opacity:1; } 42% { transform:translate(calc(var(--dx) * .55),var(--dy)) rotate(160deg); } 65% { transform:translate(calc(var(--dx) * .8),calc(var(--dy) + 50px)) rotate(290deg); opacity:1; } 100% { transform:translate(var(--dx),var(--fall)) rotate(480deg); opacity:0; } }
  @media (prefers-reduced-motion: reduce) { .cnxh-quiz *, .cnxh-quiz *::before { animation:none !important; } .cnxh-quiz .cnxh-confetti { display:none; } }
`;

const Quiz: Page = () => {
  const active = useIsActivePage();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLButtonElement>(null);
  const boardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const answerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const answerLock = useRef(false);
  const actorRef = useRef<HTMLDivElement>(null);
  const lastReply = useRef(-1);
  const [reply, setReply] = useState('');
  const [kickedIndex, setKickedIndex] = useState(-1);
  const [kickTarget, setKickTarget] = useState({ x: 0, y: 0 });
  const [screen, setScreen] = useState<'home' | 'arena'>('home');
  const [selected, setSelected] = useState(0);
  const [wrong, setWrong] = useState<number[][]>(() => quizQuestions.map(() => []));
  const [done, setDone] = useState<boolean[]>(() => quizQuestions.map(() => false));
  const [reaction, setReaction] = useState<{ mood: FerrisMood; id: number }>({ mood: 'idle', id: 0 });
  const question = quizQuestions[selected];
  const isDone = done[selected];
  const tried = wrong[selected];
  const completed = done.filter(Boolean).length;
  const allDone = completed === quizQuestions.length;
  const busy = reaction.mood !== 'idle';
  const chapter = question.topic.includes('Chương 3') || question.topic.includes('Liên hệ') ? 3 : question.topic.includes('Chương 2') ? 2 : 1;

  useEffect(() => {
    if (!active) {
      answerLock.current = false;
      setReaction(previous => ({ ...previous, mood: 'idle' }));
      return;
    }
    if (!busy) return;
    const timer = window.setTimeout(() => {
      answerLock.current = false;
      setReaction(previous => ({ ...previous, mood: 'idle' }));
    }, reducedMotion ? 100 : reaction.mood === 'angry' ? 2250 : 1450);
    return () => window.clearTimeout(timer);
  }, [active, busy, reaction.id, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    if (screen === 'home') boardRefs.current[selected]?.focus({ preventScroll: true });
    else if (isDone || busy) homeRef.current?.focus({ preventScroll: true });
    else answerRefs.current[[0, 1, 2, 3].find(index => !tried.includes(index)) ?? 0]?.focus({ preventScroll: true });
  }, [active, screen, selected, isDone, busy, tried]);

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

  const clearReaction = () => { answerLock.current = false; setReply(''); setKickedIndex(-1); setReaction(previous => ({ mood: 'idle', id: previous.id + 1 })); };
  const chooseQuestion = (index: number) => { if (!active) return; clearReaction(); setSelected(index); setScreen('arena'); };
  const goHome = () => { if (!active) return; clearReaction(); setScreen('home'); };
  const chooseAnswer = (answer: number) => {
    if (!active || isDone || answerLock.current || tried.includes(answer)) return;
    answerLock.current = true;
    const correct = answer === question.correct;
    if (!correct) {
      const replies = ['Khoan, đọc kỹ lại nào!', 'Câu này dễ nhầm thật.', 'Chưa trúng rồi. Chọn lại nhé!', 'Đáp án này chưa đúng đâu.', 'Ơ kìa, nghĩ thêm chút nữa!', 'Còn đáp án khác mà!', 'Mình cho thử lại đấy!', 'Nhìn lại từ khóa trong câu hỏi nhé.'];
      const candidates = replies.map((_, index) => index).filter(index => index !== lastReply.current);
      const nextReply = candidates[Math.floor(Math.random() * candidates.length)];
      lastReply.current = nextReply;
      setReply(replies[nextReply]);
      setKickedIndex(answer);
      const target = answerRefs.current[answer]?.getBoundingClientRect();
      const actor = actorRef.current?.getBoundingClientRect();
      const scale = (rootRef.current?.getBoundingClientRect().width ?? 1920) / 1920;
      if (target && actor) setKickTarget({ x: (target.right - actor.left) / scale - 48, y: (target.top + target.height / 2 - actor.top) / scale - 264 });
    } else setReply('Đúng rồi!');
    setReaction(previous => ({ mood: correct ? 'happy' : 'angry', id: previous.id + 1 }));
    if (correct) setDone(previous => previous.map((value, index) => index === selected ? true : value));
    else setWrong(previous => previous.map((list, index) => index === selected ? [...list, answer] : list));
  };
  const reset = () => { if (!active) return; clearReaction(); setWrong(quizQuestions.map(() => [])); setDone(quizQuestions.map(() => false)); setSelected(0); setScreen('home'); };

  return (
    <div ref={rootRef} className="cnxh-quiz" data-osd-interactive="true" style={fill} onClick={event => event.stopPropagation()}>
      <style>{quizMotionCSS}</style>
      <Mark /><Eyebrow>Trò chơi ôn tập</Eyebrow>
      <h2 style={{ position: 'absolute', left: P, top: 138, margin: 0, fontFamily: font.display, fontSize: 58, lineHeight: 1.15 }}>{screen === 'home' ? 'Chọn câu hỏi' : `Câu ${pad2(selected + 1)}`}</h2>
      <div style={{ position: 'absolute', right: P, top: 142, display: 'flex', alignItems: 'center', gap: 30 }}>
        <span style={{ fontSize: 26, color: ink.soft }}>{allDone ? 'Hoàn thành 20 / 20 ✦' : `Đã hoàn thành ${completed} / 20`}</span>
        {screen === 'arena' && <QuizAction buttonRef={homeRef} onClick={goHome}>⌂ Home · Chọn câu</QuizAction>}
      </div>
      <div style={{ position: 'absolute', left: P, right: P, top: 234, height: 4, background: ink.rule }}><div style={{ width: `${completed / quizQuestions.length * 100}%`, height: '100%', background: ink.gold, transition: reducedMotion ? 'none' : 'width .4s ease' }} /></div>

      {screen === 'home' ? <>
        <div style={{ position: 'absolute', left: P, top: 282, width: 1120 }}>
          <p style={{ margin: '0 0 26px', fontSize: 28, lineHeight: 1.5, color: ink.soft }}>Chọn một ô bất kỳ. Trả lời sai có thể thử lại.<br />Mỗi câu đúng sẽ được đánh dấu trên bảng.</p>
          <QuizBoard done={done} selected={selected} onSelect={chooseQuestion} buttonRefs={boardRefs} />
        </div>
        <div style={{ position: 'absolute', left: 1320, top: 310, width: 450, textAlign: 'center' }}>
          <div className={active ? 'ferris-idle' : undefined}><Ferris chapter={allDone ? 3 : 1} mood={allDone ? 'happy' : 'idle'} /></div>
          <p style={{ fontFamily: font.display, fontSize: 34 }}>{allDone ? 'Xong cả 20 câu rồi!' : 'Chọn câu nào trước nhỉ?'}</p>
          {allDone && <QuizAction onClick={reset}>Chơi lại từ đầu ↻</QuizAction>}
        </div>
      </> : <>
        <div style={{ position: 'absolute', left: P, top: 282, width: 1190 }}>
          <div key={`${selected}-${reaction.id}`} className={`question-${reaction.mood}`} data-quiz-question style={{ position: 'relative', zIndex: 2, boxSizing: 'border-box', minHeight: 224, padding: '26px 32px', border: `1px solid ${ink.rule}`, borderLeft: '7px solid var(--osd-accent)', background: ink.panel, borderRadius: 12 }}>
            <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)' }}>{question.topic}</div>
            <h3 style={{ fontFamily: font.display, fontSize: 42, lineHeight: 1.25, margin: '16px 0 0' }}>{question.question}</h3>
          </div>
          <div role="group" aria-label="Chọn một đáp án, sai được thử lại" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 24 }}>
            <QuizAnswer index={0} question={question} wrong={tried.includes(0)} done={isDone} busy={busy} kicked={reaction.mood === 'angry' && kickedIndex === 0} onChoose={chooseAnswer} buttonRef={node => { answerRefs.current[0] = node; }} />
            <QuizAnswer index={1} question={question} wrong={tried.includes(1)} done={isDone} busy={busy} kicked={reaction.mood === 'angry' && kickedIndex === 1} onChoose={chooseAnswer} buttonRef={node => { answerRefs.current[1] = node; }} />
            <QuizAnswer index={2} question={question} wrong={tried.includes(2)} done={isDone} busy={busy} kicked={reaction.mood === 'angry' && kickedIndex === 2} onChoose={chooseAnswer} buttonRef={node => { answerRefs.current[2] = node; }} />
            <QuizAnswer index={3} question={question} wrong={tried.includes(3)} done={isDone} busy={busy} kicked={reaction.mood === 'angry' && kickedIndex === 3} onChoose={chooseAnswer} buttonRef={node => { answerRefs.current[3] = node; }} />
          </div>
          <div id="cnxh-quiz-feedback" role="status" aria-live="polite" style={{ marginTop: 26, minHeight: 130, fontSize: 28, lineHeight: 1.45 }}>
            <strong style={{ color: 'var(--osd-accent)' }}>{isDone ? 'Chính xác.' : tried.length ? 'Chọn một đáp án khác nhé.' : ''}</strong>
            {isDone && <div style={{ marginTop: 8, color: ink.soft, fontSize: 27 }}>{question.explanation}</div>}
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1380, top: 293, width: 400, textAlign: 'center' }}>
          <div role="status" aria-live="polite" data-ferris-speech style={{ minHeight: 74, fontFamily: font.display, fontSize: 30, lineHeight: 1.25, color: 'var(--osd-accent)' }}>{reply || (isDone ? 'Đúng rồi!' : '')}</div>
          <div style={{ position: 'relative', marginTop: 36 }}>
            <div style={{ position: 'absolute', bottom: 20, left: 70, right: 70, height: 24, borderRadius: '50%', background: '#d7cfbf' }} />
            <div ref={actorRef} style={{ position: 'relative', zIndex: 8, pointerEvents: 'none', '--kick-x': `${kickTarget.x}px`, '--kick-y': `${kickTarget.y}px` } as CSSProperties}>
              <div key={`${selected}-${reaction.id}`} className={active ? `ferris-${reaction.mood}` : undefined}><Ferris chapter={chapter} mood={isDone && !busy ? 'happy' : reaction.mood} /></div>
            </div>
            {reaction.mood === 'happy' && !reducedMotion && <div key={reaction.id} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <CelebrationPiece x={-280} y={-190} color="#8b2f2a" /><CelebrationPiece x={220} y={-240} color="#b88a3b" />
              <CelebrationPiece x={-170} y={-280} color="#285565" delay={30} /><CelebrationPiece x={310} y={-160} color="#8b2f2a" delay={60} />
              <CelebrationPiece x={-90} y={-310} color="#b88a3b" delay={50} /><CelebrationPiece x={130} y={-290} color="#285565" delay={20} />
              <CelebrationPiece x={-330} y={-120} color="#b88a3b" delay={80} /><CelebrationPiece x={270} y={-100} color="#285565" delay={100} />
              <CelebrationPiece x={-210} y={-210} color="#e77c42" delay={120} /><CelebrationPiece x={80} y={-260} color="#8b2f2a" delay={80} />
            </div>}
          </div>
        </div>
      </>}
      <Footer />
    </div>
  );
};

const Closing: Page = () => (
  <div style={fill}>
    <img src={communityPhoto} alt="Minh họa cộng đồng vùng núi Việt Nam" style={{ position: 'absolute', right: 0, top: 0, width: 850, height: 1080, objectFit: 'cover', objectPosition: '74% center' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1160, height: 1080, background: 'linear-gradient(90deg, #f3efe6 82%, rgba(243,239,230,0))' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 180, background: 'linear-gradient(0deg, #f3efe6 0%, #f3efe6 50%, rgba(243,239,230,0) 100%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', left: P, top: 240, width: 1020 }}>
      <motion.div {...useEntry(0.05, 'fade')} style={{ width: 100, height: 8, background: 'var(--osd-accent)', marginBottom: 52 }} />
      <motion.h1 {...useEntry(0.12)} style={{ margin: 0, fontFamily: font.display, fontSize: 112, lineHeight: 1.1 }}>Cảm ơn<br />đã lắng nghe</motion.h1>
      <motion.p {...useEntry(0.22)} style={{ fontSize: 33, lineHeight: 1.5, color: ink.soft, maxWidth: 850, marginTop: 40 }}>Mời giảng viên và các bạn đặt câu hỏi hoặc góp ý.</motion.p>
    </div>
    <Footer />
  </div>
);

export const meta: SlideMeta = {
  title: 'Version 2 - Vấn đề dân tộc trong thời kỳ quá độ lên CNXH',
  createdAt: '2026-10-19T13:53:01.521Z',
};

export const notes: (string | undefined)[] = [
  'Chào thầy cô và các bạn. Nhóm 3 trình bày đề tài “Vấn đề dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội”. Bài đi theo đúng ba chương của tiểu luận: cơ sở lý luận, thực trạng và chính sách ở Việt Nam, phương hướng và giải pháp. Slide chỉ giữ từ khóa; phần giải thích nằm trong tiểu luận và các ghi chú này.',
  'Mở đầu, tiểu luận nêu bốn lý do chọn đề tài: lý luận, thực tiễn Việt Nam, chính trị – an ninh và trách nhiệm sinh viên. Nhấn mạnh ý thực tiễn: 54 dân tộc, đoàn kết là nền tảng phát triển. Có thể dẫn một ví dụ gần gũi về tôn trọng khác biệt.',
  'Chuyển sang chương 1: khái niệm, đặc trưng của dân tộc và nội dung vấn đề dân tộc.',
  'Mục 1.1: dân tộc là sản phẩm phát triển lâu dài, đi từ thị tộc, bộ lạc, bộ tộc đến dân tộc. Mỗi hình thức chỉ nêu một nét: huyết thống, lãnh thổ, ngôn ngữ – văn hóa, rồi kinh tế – chính trị gắn kết.',
  'Nghĩa rộng (Nation) chỉ nhân dân một nước. Năm đặc trưng: lãnh thổ ổn định, phương thức kinh tế chung, ngôn ngữ giao tiếp, văn hóa – tâm lý, một nhà nước. Ví dụ Việt Nam, Nhật Bản. Nhấn mạnh đây là cộng đồng chính trị – xã hội.',
  'Nghĩa hẹp (Ethnie) chỉ một cộng đồng tộc người. Ba đặc trưng: ngôn ngữ, văn hóa, ý thức tự giác tộc người. Ví dụ Kinh, Thái. Ý thức tự giác là tiêu chí quan trọng để xác định thành phần dân tộc.',
  'Bảng 1.1 trong tiểu luận so sánh hai nghĩa theo bản chất, phạm vi, đặc trưng, yếu tố gắn kết và ví dụ. Đọc theo hàng để thấy Nation là cộng đồng quốc gia, còn Ethnie là cộng đồng tộc người.',
  'Mục 1.1 tiếp: vấn đề dân tộc là những vấn đề nảy sinh trong quan hệ giữa các tộc người và giữa các quốc gia – bình đẳng, quyền lợi, chênh lệch phát triển. Vấn đề dân tộc luôn gắn với vấn đề giai cấp.',
  'Phần II: quan điểm Mác – Lênin, gồm hai xu hướng khách quan, cương lĩnh dân tộc, tư tưởng Hồ Chí Minh và đặc điểm thời kỳ quá độ (mục 1.2 – 1.5).',
  'Mục 1.2: hai xu hướng khách quan. Một là tách ra lập quốc gia dân tộc độc lập, gắn với ý thức dân tộc và đấu tranh chống áp bức. Hai là liên hiệp lại khi sản xuất, công nghệ và giao lưu phá hàng rào ngăn cách.',
  'Hai xu hướng biểu hiện trong một quốc gia và trên phạm vi quốc tế. Trong nước là nỗ lực phát triển của từng tộc người và hợp tác giữa họ; quốc tế là giải phóng dân tộc và liên minh khu vực, toàn cầu. Dưới CNXH, hai xu hướng có thể hài hòa trên cơ sở bình đẳng, tự nguyện.',
  'Mục 1.3: cương lĩnh dân tộc của Lênin có ba nội dung: các dân tộc hoàn toàn bình đẳng, các dân tộc có quyền tự quyết, liên hiệp công nhân tất cả các dân tộc. Ba nội dung gắn bó, không tách rời.',
  'Giải thích từng nguyên tắc. Bình đẳng là quyền và nghĩa vụ ngang nhau, phải có trong pháp luật và đời sống. Tự quyết là tự chọn con đường phát triển, chia tách hay liên hiệp, đặt trong lợi ích chung. Liên hiệp công nhân là sợi dây kết nối, bảo đảm định hướng.',
  'Mục 1.4: tư tưởng Hồ Chí Minh. Độc lập dân tộc gắn với CNXH; các dân tộc là anh em một nhà, bình đẳng, đoàn kết, tương trợ. Người nhấn mạnh đại đoàn kết, chăm lo đời sống, phát huy cán bộ người dân tộc và chống tư tưởng dân tộc lớn, hẹp hòi.',
  'Mục 1.5: đặc điểm của vấn đề dân tộc trong thời kỳ quá độ. Bình đẳng pháp lý đã có nhưng bất bình đẳng thực tế còn; vấn đề dân tộc gắn với giai cấp và phát triển; còn tàn dư tư tưởng cũ; và chịu tác động quốc tế. Nhiệm vụ là thu hẹp khoảng cách, củng cố đoàn kết.',
  'Phần III: dân tộc và quan hệ dân tộc ở Việt Nam – đặc điểm, chính sách, thực trạng và giải pháp (chương 2 – 3 của tiểu luận).',
  'Mục 2.1: sáu đặc điểm. Kinh khoảng 85,3%, 53 dân tộc thiểu số khoảng 14,7% (Tổng điều tra 2019); cư trú xen kẽ; thiểu số ở địa bàn chiến lược; trình độ phát triển không đều; đoàn kết lâu đời; mỗi dân tộc có bản sắc riêng.',
  'Mục 2.2: năm quan điểm của Đảng. Vấn đề dân tộc là chiến lược, lâu dài và cấp bách; bình đẳng, đoàn kết, tương trợ, cùng phát triển; phát triển toàn diện; ưu tiên vùng khó khăn; công tác dân tộc là nhiệm vụ của cả hệ thống chính trị.',
  'Bốn căn cứ pháp lý – chính sách: Điều 5 Hiến pháp 2013; Nghị quyết 24-NQ/TW năm 2003; Đại hội XIII năm 2021; Nghị quyết 120/2020/QH14 về chương trình mục tiêu quốc gia 2021–2030. Chương trình 135 là ví dụ giai đoạn trước.',
  'Chính sách dân tộc được triển khai trên năm lĩnh vực: chính trị, kinh tế, xã hội, văn hóa, quốc phòng – an ninh. Chuyển ý: mỗi lĩnh vực có mục tiêu riêng nhưng đều nhằm bình đẳng và phát triển.',
  'Chính trị: bình đẳng, đoàn kết, củng cố hệ thống chính trị cơ sở, đào tạo và sử dụng cán bộ người dân tộc. Kinh tế: đầu tư hạ tầng, sinh kế, giảm nghèo bền vững; ví dụ Chương trình 135 và chương trình mục tiêu quốc gia 2021–2030.',
  'Xã hội: bảo đảm an sinh, công bằng qua giáo dục, y tế, giảm nghèo và dân số. Có thể nhắc hệ thống trường dân tộc nội trú, bán trú và chế độ đãi ngộ học sinh, sinh viên dân tộc thiểu số.',
  'Văn hóa: xây dựng nền văn hóa tiên tiến, đậm đà bản sắc; giữ gìn tiếng nói, chữ viết, lễ hội, nghệ thuật; nâng cao dân trí; đào tạo cán bộ văn hóa; mở rộng giao lưu; đấu tranh chống tệ nạn và diễn biến hòa bình.',
  'Quốc phòng – an ninh: giữ ổn định chính trị, trật tự xã hội, an ninh biên giới; tăng cường quan hệ quân dân, xây dựng thế trận quốc phòng toàn dân ở vùng đồng bào. Đây là điều kiện để phát triển bền vững.',
  'Mục 2.3: thành tựu sau gần bốn mươi năm Đổi mới. Khối đại đoàn kết được củng cố; hạ tầng và đời sống cải thiện, hộ nghèo giảm; giáo dục, y tế mở rộng; văn hóa được bảo tồn; quốc phòng – an ninh giữ vững. Đây là đánh giá định tính, không phải mọi địa bàn đều như nhau.',
  'Mục 2.4: hạn chế, thách thức. Khoảng cách phát triển còn lớn, nguy cơ tái nghèo; hạ tầng, nhân lực, tiếp cận dịch vụ còn yếu; chính sách chồng chéo, năng lực thực hiện hạn chế; áp lực đất đai, di cư, khí hậu. Nguyên nhân gồm điều kiện tự nhiên, xuất phát điểm, nguồn lực và tổ chức thực hiện.',
  'Hai thách thức còn lại: nguy cơ mai một văn hóa trước thị trường và hội nhập; thông tin sai lệch lợi dụng khác biệt dân tộc, tôn giáo để chia rẽ. Cần phân biệt tôn trọng khác biệt với lan truyền định kiến, và bảo đảm đồng bào là chủ thể bảo tồn.',
  'Chương 3, giải pháp 1–3: nâng cao nhận thức và năng lực hệ thống chính trị cơ sở; phát triển kinh tế – xã hội, giảm nghèo bền vững; ưu tiên giáo dục – đào tạo và nguồn nhân lực. Nhấn mạnh đồng bào tham gia quyết định, không chỉ nhận hỗ trợ.',
  'Giải pháp 4–6: bảo tồn, phát huy bản sắc văn hóa gắn với du lịch bền vững và sinh kế; giữ vững quốc phòng, an ninh, chống lợi dụng dân tộc, tôn giáo; hoàn thiện cơ chế, chính sách, phân cấp và giám sát hiệu quả thực hiện.',
  'Kết luận của tiểu luận: sinh viên cần nâng cao nhận thức, tôn trọng đa dạng văn hóa, tích cực xây dựng khối đại đoàn kết và cảnh giác trước thông tin xuyên tạc. Ba việc trên slide tương ứng với ba hành động cụ thể.',
  'Tổng kết ba điểm, không đọc lại số liệu: xác định đúng hai nghĩa của dân tộc; nắm mối liên hệ giữa cương lĩnh và đại đoàn kết; chuyển bình đẳng pháp lý thành cơ hội phát triển thực tế, tôn trọng bản sắc.',
  'Mời cả lớp chọn một câu và trả lời A, B, C hoặc D. Trả lời sai thì đáp án đó bị loại và được thử lại; trả lời đúng sẽ hiện giải thích. Bấm Home để chọn câu khác; bảng giữ lại các câu đã hoàn thành. Có thể chơi lại sau 20 câu.',
  'Cảm ơn thầy cô và các bạn đã lắng nghe. Mời đặt câu hỏi hoặc góp ý.',
];

export default [
  Cover,
  WhyThisTopic,
  DivConcept,
  ConceptTimeline,
  NationDiagram,
  EthnieDiagram,
  TableCompare,
  IssueDef,
  DivMarx,
  TwoTrends,
  TrendContexts,
  LeninPillars,
  LeninDetail,
  HoChiMinh,
  TransitionTraits,
  DivVN,
  VNFeatures,
  PartyView,
  LegalBasis,
  PolicyMatrix,
  PolicyPoliticalEconomic,
  PolicySocial,
  PolicyCulture,
  PolicySecurity,
  Achievements,
  Challenges,
  CulturalChallenges,
  SolutionsA,
  SolutionsB,
  Practice,
  Summary,
  Quiz,
  Closing,
] satisfies Page[];
