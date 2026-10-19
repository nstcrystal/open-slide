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
    <img src={vietnamPhoto} alt="Bản đồ Việt Nam ghép từ hình ảnh con người và văn hóa" style={{ position: 'absolute', right: 40, top: 0, width: 760, height: 1080, objectFit: 'contain', mixBlendMode: 'multiply' }} />
    <motion.div {...useEntry(0.05)} style={{ position: 'absolute', left: P, top: 94, fontSize: 24, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--osd-accent)' }}>CHỦ NGHĨA XÃ HỘI KHOA HỌC / NHÓM 3</motion.div>
    <div style={{ position: 'absolute', left: P, top: 240, width: 1010 }}>
      <motion.div {...useEntry(0.1, 'fade')} style={{ width: 96, height: 8, background: 'var(--osd-accent)', marginBottom: 38, transformOrigin: 'left' }} />
      <motion.h1 {...useEntry(0.15)} style={{ margin: 0, fontFamily: font.display, fontSize: 93, lineHeight: 1.07, letterSpacing: '-0.04em', fontWeight: 700 }}>Vấn đề dân tộc<br />trong thời kỳ<br />quá độ lên CNXH</motion.h1>
      <motion.p {...useEntry(0.24)} style={{ margin: '34px 0 0', maxWidth: 870, fontSize: 30, lineHeight: 1.45, color: ink.soft }}>Từ hai nghĩa của dân tộc, cương lĩnh Lênin đến 54 dân tộc Việt Nam: thực trạng, chính sách và giải pháp.</motion.p>
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

const WhyThisTopic: Page = () => (
  <Frame eyebrow="Mở đầu" title="Vì sao cần hiểu đúng vấn đề dân tộc?" lead="Từ kiến thức lý luận đến cách cùng nhau học tập, sinh sống và phát triển trong một quốc gia đa dân tộc.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      <IssueCard number="01" title="Có cơ sở để nhìn nhận" text="Quan điểm Mác – Lênin giúp phân tích quan hệ dân tộc, thay vì chỉ nhìn từ những khác biệt về văn hóa." />
      <IssueCard number="02" title="Hiểu thực tiễn Việt Nam" text="54 dân tộc cùng xây dựng đất nước; đoàn kết và cơ hội phát triển là nền tảng của sự ổn định lâu dài." />
      <IssueCard number="03" title="Gắn phát triển với an ninh" text="Vùng dân tộc thiểu số và miền núi có vai trò quan trọng về quốc phòng, tài nguyên và môi trường." />
      <IssueCard number="04" title="Nhận rõ trách nhiệm sinh viên" text="Tôn trọng khác biệt, bảo tồn giá trị văn hóa và kiểm chứng thông tin trước khi chia sẻ." />
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
  <motion.div {...useEntry(0.4 + Number(number) * 0.09)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, padding: '10px 26px', display: 'flex', alignItems: 'center', gap: 28, height: 92, boxSizing: 'border-box' }}>
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
        <img src={terracesPhoto} alt="Ruộng bậc thang vùng cao Việt Nam" style={{ width: '100%', height: 246, objectFit: 'cover', objectPosition: 'center 58%', filter: 'saturate(.75)' }} />
        <div style={{ padding: '25px 34px' }}>
          <div style={{ fontSize: 23, letterSpacing: '0.12em' }}>NGHĨA RỘNG · QUỐC GIA</div>
          <div style={{ fontFamily: font.display, fontSize: 45, lineHeight: 1.12, marginTop: 10 }}>Một cộng đồng quốc gia</div>
          <div style={{ fontSize: 23, lineHeight: 1.38, marginTop: 16 }}>Gắn bó bởi quyền lợi chính trị, kinh tế, truyền thống văn hóa và lịch sử dựng nước, giữ nước.</div>
          <div style={{ fontSize: 25, marginTop: 18 }}>Ví dụ: Việt Nam, Nhật Bản</div>
        </div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 41, width: 960, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <BranchRow number="01" label="Có chung vùng lãnh thổ ổn định" detail="Không gian sinh sống thuộc chủ quyền của một quốc gia." />
        <BranchRow number="02" label="Có chung phương thức sinh hoạt kinh tế" detail="Phân công lao động và trao đổi gắn kết các vùng, địa phương." />
        <BranchRow number="03" label="Có chung ngôn ngữ giao tiếp" detail="Ngôn ngữ chung tồn tại bên cạnh tiếng nói của từng tộc người." />
        <BranchRow number="04" label="Có chung nền văn hóa và tâm lý" detail="Lịch sử và các giá trị chung tạo nên ý thức thống nhất." />
        <BranchRow number="05" label="Có chung một nhà nước" detail="Tổ chức quyền lực chính trị quản lý xã hội và bảo vệ chủ quyền." />
      </div>
    </div>
  </Frame>
);

const EthnieDiagram: Page = () => (
  <Frame staticContent eyebrow="Chương I · 1" title="Dân tộc theo nghĩa hẹp" lead="Dân tộc theo nghĩa hẹp là cộng đồng tộc người hình thành trong lịch sử, có liên hệ bền vững.">
    <div style={{ position: 'relative', height: 622 }}>
      <ConceptBranches narrow />
      <Reveal delay={0.1} style={{ position: 'absolute', left: 0, top: 0, width: 540, height: 622, boxSizing: 'border-box', background: ink.panel, border: `1px solid ${ink.rule}` }}>
        <img src={wrappingCakePhoto} alt="Gia đình quây quần gói bánh truyền thống" style={{ width: '100%', height: 365, objectFit: 'cover' }} />
        <div style={{ padding: '26px 34px' }}><div style={{ fontFamily: font.display, fontSize: 43, fontWeight: 700 }}>Một cộng đồng tộc người</div><div style={{ fontSize: 27, color: ink.soft, marginTop: 12 }}>Ví dụ: dân tộc Kinh, dân tộc Thái</div></div>
      </Reveal>
      <div style={{ position: 'absolute', left: 720, top: 89, width: 960, display: 'flex', flexDirection: 'column', gap: 84 }}>
        <BranchRow number="01" label="Cộng đồng về ngôn ngữ" detail="Tiếng mẹ đẻ gắn kết thành viên và lưu giữ ký ức cộng đồng." />
        <BranchRow number="02" label="Cộng đồng về văn hóa" detail="Phong tục, lễ hội, trang phục và nghệ thuật tạo nên bản sắc riêng." />
        <BranchRow number="03" label="Ý thức tự giác tộc người" detail="Mỗi người tự nhận mình thuộc về một tộc người nhất định." />
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
  <Frame eyebrow="Chương I · 1" title="Một từ, hai phạm vi khác nhau" lead="Nghĩa rộng nói về nhân dân một quốc gia; nghĩa hẹp nói về từng cộng đồng tộc người.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'center' }}>
      <CompareRow header criterion="Tiêu chí" nation="Nghĩa rộng · Nation" ethnie="Nghĩa hẹp · Ethnie" />
      <CompareRow criterion="Bản chất" nation="Cộng đồng chính trị – xã hội, quốc gia dân tộc" ethnie="Cộng đồng tộc người" />
      <CompareRow criterion="Phạm vi" nation="Toàn thể nhân dân một quốc gia" ethnie="Từng tộc người, trong hoặc xuyên quốc gia" />
      <CompareRow criterion="Đặc trưng" nation="Lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý, nhà nước" ethnie="Ngôn ngữ, văn hóa, ý thức tự giác" />
      <CompareRow criterion="Gắn kết" nation="Quyền lợi chính trị, kinh tế; truyền thống dựng nước, giữ nước" ethnie="Nguồn gốc, ngôn ngữ, văn hóa, ý thức tự giác" />
    </div>
  </Frame>
);

const IssueCard = ({ number, title, text }: { number: string; title: string; text: string }) => (
  <motion.div {...useEntry(0.12 + Number(number) * 0.08)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderTop: '7px solid var(--osd-accent)', padding: '30px 32px', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 37, lineHeight: 1.2, margin: '10px 0 14px' }}>{title}</h3>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft }}>{text}</div>
  </motion.div>
);

const IssueDef: Page = () => (
  <Frame eyebrow="Chương I · 1" title="Vấn đề dân tộc là gì" lead="Quan hệ giữa các tộc người trong một nước, và giữa các quốc gia dân tộc với nhau.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', alignItems: 'start' }}>
      <IssueCard number="01" title="Địa vị bình đẳng" text="Các cộng đồng có được tôn trọng và đối xử bình đẳng trong quan hệ với nhau hay không?" />
      <IssueCard number="02" title="Quyền lợi của cộng đồng" text="Quyền tham gia chính trị, phát triển kinh tế và giữ gìn văn hóa được bảo đảm như thế nào?" />
      <IssueCard number="03" title="Chênh lệch phát triển" text="Khoảng cách về điều kiện sống và cơ hội phát triển giữa các vùng, các dân tộc cần được giải quyết." />
      <IssueCard number="04" title="Gắn với vấn đề giai cấp" text="Theo quan điểm Mác – Lênin, quan hệ dân tộc chịu tác động của lợi ích và quan hệ giai cấp." />
    </div>
  </Frame>
);

const DivMarx = () => <Divider roman="II" label="CHƯƠNG II" sub="Hai xu hướng, cương lĩnh Lênin, Hồ Chí Minh và thời kỳ quá độ" />;

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
      <TrendCard number="01" mode="separate" title="Tách ra, lập quốc gia độc lập" cause="Ý thức dân tộc thức tỉnh; chống áp bức, giành độc lập ở thuộc địa." result="Đấu tranh giải phóng, thoát đô hộ, lập quốc gia dân tộc riêng." />
      <TrendCard number="02" mode="unite" title="Các dân tộc liên hiệp lại" cause="Sản xuất, khoa học công nghệ và giao lưu phá hàng rào ngăn cách." result="Xích lại gần, hợp tác trong một nước và giữa các nước." />
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
      <PillarCard number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Quyền và nghĩa vụ ngang nhau, chống áp bức và phân biệt dân tộc." />
      <PillarCard number="02" title="Các dân tộc được quyền tự quyết" detail="Tự chọn con đường phát triển, quyết định việc chia tách hoặc liên hiệp." />
      <PillarCard number="03" title="Liên hiệp công nhân các dân tộc" detail="Liên hiệp tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích chung." />
    </div>
  </Frame>
);

const LeninDetail: Page = () => (
  <Frame staticContent eyebrow="Chương II · 2.2" title="Nội dung của ba nguyên tắc">
    <div style={{ position: 'relative', height: 684 }}>
      <PillarCard expanded number="01" title="Các dân tộc hoàn toàn bình đẳng" detail="Dù đông hay ít người, các dân tộc đều có quyền và nghĩa vụ ngang nhau. Bình đẳng phải được bảo đảm trong pháp luật và trong đời sống." />
      <PillarCard expanded number="02" title="Các dân tộc được quyền tự quyết" detail="Tự lựa chọn con đường phát triển, phân lập hoặc tự nguyện liên hiệp. Theo Lênin, cần xem xét trên lập trường công nhân, chống lợi dụng để chia rẽ." />
      <PillarCard expanded number="03" title="Liên hiệp công nhân các dân tộc" detail="Công nhân các dân tộc đoàn kết vì giải phóng dân tộc và giai cấp. Đây là sợi dây kết nối việc thực hiện bình đẳng với quyền tự quyết." />
    </div>
  </Frame>
);

LeninPillars.transition = morphTransition;
LeninDetail.transition = morphTransition;

const HoChiMinh: Page = () => (
  <Frame eyebrow="Chương II · Tư tưởng Hồ Chí Minh" title="Đoàn kết là sức mạnh sống còn" lead="Độc lập dân tộc gắn liền với chủ nghĩa xã hội, giải phóng dân tộc mở đường cho giải phóng giai cấp và con người.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', alignItems: 'stretch' }}>
      <motion.div {...useEntry(0.15)} style={{ background: 'var(--osd-accent)', color: '#fff', padding: '40px 38px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: font.display, fontSize: 42, lineHeight: 1.3, fontWeight: 700 }}>“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.”</div>
        <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.5, opacity: 0.92 }}>Các dân tộc là anh em một nhà: Bình đẳng, đoàn kết, tương trợ, cùng xây dựng và bảo vệ Tổ quốc.</div>
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.35)', fontSize: 25, lineHeight: 1.5, opacity: 0.92 }}>Chống tư tưởng dân tộc lớn và dân tộc hẹp hòi.</div>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
        <IssueCard number="01" title="Chăm lo đời sống" text="Phát triển kinh tế, văn hóa, giáo dục, y tế cho đồng bào thiểu số." />
        <IssueCard number="02" title="Cán bộ người dân tộc" text="Phát huy vai trò đội ngũ cán bộ người dân tộc thiểu số." />
      </div>
    </div>
  </Frame>
);

const TraitCard = ({ number, title, text }: { number: string; title: string; text: string }) => (
  <motion.div {...useEntry(0.12 + Number(number) * 0.08)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderLeft: '7px solid var(--osd-accent)', padding: '28px 30px', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 35, lineHeight: 1.2, margin: '10px 0 12px' }}>{title}</h3>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft }}>{text}</div>
  </motion.div>
);

const TransitionTraits: Page = () => (
  <Frame eyebrow="Chương II · Thời kỳ quá độ" title="Từ bình đẳng pháp lý đến đời sống" lead="Quyền bình đẳng được xác lập không có nghĩa khoảng cách phát triển giữa các dân tộc đã được xóa bỏ.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', alignItems: 'start' }}>
      <TraitCard number="01" title="Khoảng cách thực tế còn tồn tại" text="Điều kiện lịch sử để lại chênh lệch về kinh tế và xã hội; thu hẹp khoảng cách là nhiệm vụ lâu dài." />
      <TraitCard number="02" title="Giải quyết bằng phát triển" text="Bình đẳng cần đi cùng đầu tư cơ sở vật chất, giảm nghèo và nâng cao chất lượng cuộc sống." />
      <TraitCard number="03" title="Khắc phục định kiến dân tộc" text="Tư tưởng kỳ thị, tự ti hoặc đề cao dân tộc mình vẫn có thể tồn tại và gây chia rẽ cộng đồng." />
      <TraitCard number="04" title="Chịu tác động từ quốc tế" text="Toàn cầu hóa và quan hệ xuyên biên giới ảnh hưởng đến quan hệ dân tộc trong nước." />
    </div>
  </Frame>
);

const DivVN = () => <Divider roman="III" label="CHƯƠNG III" sub="54 dân tộc: Thực trạng, chính sách và giải pháp" />;

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
        <FeatureNode number="01" side="left">Kinh ~85,3%, 53 dân tộc thiểu số ~14,7% (2019)</FeatureNode>
        <FeatureNode number="02" side="left">Cư trú xen kẽ với nhau</FeatureNode>
        <FeatureNode number="03" side="left">Dân tộc thiểu số chủ yếu ở địa bàn chiến lược</FeatureNode>
      </div>
      <div style={{ position: 'relative', width: 320, height: 320, justifySelf: 'center', borderRadius: '50%', background: ink.panel, border: '8px solid var(--osd-accent)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.12em' }}>VIỆT NAM · 2019</div>
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

const BasisCard = ({ number, title, text }: { number: string; title: string; text: string }) => (
  <motion.div {...useEntry(0.12 + Number(number) * 0.08)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderTop: '7px solid var(--osd-accent)', padding: '28px 30px', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 34, lineHeight: 1.2, margin: '10px 0 12px' }}>{title}</h3>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: ink.soft }}>{text}</div>
  </motion.div>
);

const LegalBasis: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Cơ sở cho chính sách dân tộc" lead="Bốn văn kiện được sử dụng trong tiểu luận để làm rõ quyền, định hướng và chương trình hành động.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', alignItems: 'start' }}>
      <BasisCard number="01" title="Hiến pháp 2013 · Điều 5" text="Cấm kỳ thị, chia rẽ dân tộc; bảo đảm quyền dùng tiếng nói, chữ viết và giữ gìn bản sắc văn hóa." />
      <BasisCard number="02" title="Nghị quyết 24-NQ/TW · 2003" text="Xác định công tác dân tộc là vấn đề chiến lược; gắn phát triển kinh tế – xã hội với quốc phòng, an ninh." />
      <BasisCard number="03" title="Đại hội XIII · 2021" text="Khẳng định việc giải quyết quan hệ dân tộc và phát huy đại đoàn kết là nhiệm vụ trọng yếu, thường xuyên." />
      <BasisCard number="04" title="Nghị quyết 120/2020/QH14" text="Phê duyệt chủ trương đầu tư chương trình mục tiêu quốc gia cho vùng dân tộc thiểu số và miền núi, 2021–2030." />
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
  <Frame staticContent eyebrow="Chương III · 3.2" title="Năm lĩnh vực chính sách">
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
      <PolicyCard expanded number="01" title="Chính trị" detail="Bảo đảm bình đẳng và đoàn kết; củng cố hệ thống chính trị cơ sở, đào tạo và sử dụng cán bộ người dân tộc thiểu số." image={gatheringPhoto} alt="Sinh hoạt cộng đồng" />
      <PolicyCard expanded number="02" title="Kinh tế" detail="Đầu tư hạ tầng, hỗ trợ sản xuất và sinh kế để giảm nghèo bền vững. Chương trình 135 trước đây và chương trình mục tiêu quốc gia 2021–2030 là các ví dụ." image={bridgePhoto} alt="Cầu đường ở miền núi" />
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

const CulturePoint = ({ text }: { text: string }) => (
  <div style={{ background: ink.panel, borderLeft: '5px solid var(--osd-accent)', padding: '13px 24px', fontSize: 25, lineHeight: 1.35 }}>{text}</div>
);

const PolicyCulture: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách văn hóa">
    <div style={{ display: 'grid', gridTemplateColumns: '650px 1fr', gap: 44, height: '100%' }}>
      <img src={craftPhoto} alt="Nghề dệt truyền thống" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '44% center' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <CulturePoint text="Xây dựng nền văn hóa Việt Nam tiên tiến, đậm đà bản sắc dân tộc." />
        <CulturePoint text="Giữ gìn và phát huy giá trị văn hóa truyền thống của các tộc người." />
        <CulturePoint text="Nâng cao trình độ văn hóa cho nhân dân các dân tộc." />
        <CulturePoint text="Đào tạo cán bộ văn hóa, xây dựng môi trường và thiết chế văn hóa phù hợp." />
        <CulturePoint text="Mở rộng giao lưu văn hóa với quốc gia, khu vực và thế giới." />
        <CulturePoint text="Đấu tranh chống tệ nạn xã hội và diễn biến hòa bình trên mặt trận văn hóa – tư tưởng." />
      </div>
    </div>
  </Frame>
);

const PolicySecurity: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách quốc phòng – an ninh">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', gap: 44, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        <div style={{ background: ink.panel, borderLeft: '7px solid var(--osd-accent)', padding: 38 }}><div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, marginBottom: 20 }}>Bảo vệ Tổ quốc</div><div style={{ fontSize: 30, lineHeight: 1.48 }}>Bảo đảm ổn định chính trị, an ninh và trật tự an toàn xã hội ở vùng đồng bào dân tộc.</div></div>
        <div style={{ background: ink.panel, borderLeft: '7px solid var(--osd-accent)', padding: 38 }}>
          <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 700, marginBottom: 20 }}>Quan hệ quân dân</div><div style={{ fontSize: 30, lineHeight: 1.48 }}>Tăng cường gắn bó quân dân, tạo thế trận quốc phòng toàn dân tại địa bàn cư trú.</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', background: ink.panel }}>
        <img src={borderPhoto} alt="Cán bộ và người dân trò chuyện" style={{ width: '100%', height: 520, objectFit: 'cover', objectPosition: 'center 35%', filter: 'saturate(.82)' }} />
        <div style={{ padding: '22px 30px', fontSize: 25, lineHeight: 1.4, color: ink.soft }}>Quan hệ quân dân ở vùng đồng bào dân tộc.</div>
      </div>
    </div>
  </Frame>
);

const FactRow = ({ number, text }: { number: string; text: string }) => (
  <motion.div {...useEntry(0.1 + Number(number) * 0.07)} style={{ display: 'flex', gap: 22, alignItems: 'center', background: ink.panel, border: `1px solid ${ink.rule}`, padding: '20px 28px' }}>
    <span style={{ fontFamily: font.display, fontSize: 38, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 56 }}>{number}</span>
    <span style={{ fontSize: 27, lineHeight: 1.4 }}>{text}</span>
  </motion.div>
);

const Achievements: Page = () => (
  <Frame eyebrow="Chương III · Thực trạng" title="Những chuyển biến sau Đổi mới" lead="Tiểu luận ghi nhận tiến bộ về đoàn kết, điều kiện sống và khả năng tiếp cận các dịch vụ thiết yếu.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', height: '100%' }}>
      <FactRow number="01" text="Khối đại đoàn kết được củng cố, tạo nền tảng cho ổn định và phát triển." />
      <FactRow number="02" text="Hạ tầng được đầu tư, tỷ lệ hộ nghèo giảm và đời sống từng bước cải thiện." />
      <FactRow number="03" text="Mạng lưới trường học và cơ sở khám chữa bệnh được mở rộng ở vùng xa." />
      <FactRow number="04" text="Văn hóa các dân tộc được quan tâm bảo tồn; nhiều di sản được phát huy giá trị." />
      <FactRow number="05" text="Quốc phòng, an ninh được giữ vững; sự gắn bó với nhân dân vùng biên được tăng cường." />
    </div>
  </Frame>
);

const Challenges: Page = () => (
  <Frame eyebrow="Chương III · Thực trạng" title="Khoảng cách phát triển vẫn còn" lead="Những tiến bộ đạt được chưa đồng đều giữa các địa bàn và cộng đồng dân tộc.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', height: '100%' }}>
      <FactRow number="01" text="Tỷ lệ nghèo còn cao; nhiều hộ có nguy cơ tái nghèo khi sinh kế thiếu ổn định." />
      <FactRow number="02" text="Một số nơi thiếu hạ tầng, nhân lực và điều kiện tiếp cận giáo dục, y tế." />
      <FactRow number="03" text="Một số chính sách còn chồng chéo; nguồn lực và năng lực thực hiện còn hạn chế." />
      <FactRow number="04" text="Thiếu đất sản xuất, di cư tự phát và biến đổi khí hậu gây sức ép lên sinh kế." />
    </div>
  </Frame>
);

const SolutionCard = ({ number, title, text }: { number: string; title: string; text: string }) => (
  <motion.div {...useEntry(0.12 + Number(number) * 0.08)} style={{ background: ink.panel, border: `1px solid ${ink.rule}`, borderLeft: '7px solid var(--osd-accent)', padding: '26px 28px', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--osd-accent)' }}>{number}</div>
    <h3 style={{ fontFamily: font.display, fontSize: 33, lineHeight: 1.2, margin: '8px 0 10px' }}>{title}</h3>
    <div style={{ fontSize: 30, lineHeight: 1.5, color: ink.soft }}>{text}</div>
  </motion.div>
);

const CulturalChallenges: Page = () => (
  <Frame eyebrow="Chương III · Thực trạng" title="Giữ bản sắc, củng cố niềm tin" lead="Bên cạnh kinh tế, tiểu luận nhấn mạnh hai thách thức đối với đời sống văn hóa và quan hệ cộng đồng.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
      <IssueCard number="05" title="Nguy cơ mai một văn hóa" text="Tác động của thị trường và hội nhập có thể làm suy giảm tiếng nói, nghề truyền thống và những giá trị văn hóa của cộng đồng." />
      <IssueCard number="06" title="Thông tin gây chia rẽ" text="Thông tin sai lệch lợi dụng khác biệt dân tộc, tôn giáo có thể làm gia tăng định kiến và gây tổn hại đến đoàn kết." />
    </div>
    <div style={{ marginTop: 48, borderLeft: `6px solid ${ink.gold}`, padding: '24px 32px', fontSize: 32, lineHeight: 1.5, background: ink.panel }}>Giải pháp cần vừa cải thiện điều kiện sống, vừa tạo điều kiện để người dân gìn giữ văn hóa và tham gia xây dựng cộng đồng.</div>
  </Frame>
);

const SolutionsA: Page = () => (
  <Frame eyebrow="Chương III · Giải pháp 1–3" title="Mở rộng cơ hội phát triển" lead="Đồng bào cần được tham gia quyết định và thực hiện các hoạt động phát triển tại cộng đồng mình.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, height: '100%', alignItems: 'start' }}>
      <SolutionCard number="01" title="Nâng cao năng lực cơ sở" text="Tăng cường sự lãnh đạo của Đảng, phổ biến chính sách dân tộc và xây dựng đội ngũ cán bộ gần dân, hiểu nhu cầu của dân." />
      <SolutionCard number="02" title="Giảm nghèo bền vững" text="Đầu tư hạ tầng và sinh kế theo lợi thế địa phương; giải quyết nhu cầu thiết yếu về đất sản xuất, nhà ở và nước sinh hoạt." />
      <SolutionCard number="03" title="Đầu tư cho giáo dục" text="Củng cố trường nội trú, bán trú; đào tạo nghề phù hợp và thu hút giáo viên, bác sĩ về công tác tại vùng khó khăn." />
    </div>
  </Frame>
);

const SolutionsB: Page = () => (
  <Frame eyebrow="Chương III · Giải pháp 4–6" title="Phát triển đi cùng gìn giữ" lead="Bảo tồn văn hóa, bảo đảm an ninh và cải thiện cách thực hiện chính sách cần được triển khai đồng thời.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, height: '100%', alignItems: 'start' }}>
      <SolutionCard number="04" title="Bảo tồn bản sắc văn hóa" text="Gắn bảo tồn di sản với du lịch bền vững và sinh kế cộng đồng; phát huy giá trị tốt đẹp, từng bước loại bỏ hủ tục." />
      <SolutionCard number="05" title="Củng cố quốc phòng, an ninh" text="Kết hợp phát triển với bảo vệ vùng biên; tăng gắn bó quân dân và ngăn việc lợi dụng dân tộc, tôn giáo để chia rẽ." />
      <SolutionCard number="06" title="Thực hiện chính sách hiệu quả" text="Rà soát chính sách chồng chéo; phân cấp gắn trách nhiệm giải trình và giám sát, với sự tham gia của chính đồng bào." />
    </div>
  </Frame>
);

const Practice: Page = () => (
  <Frame eyebrow="Liên hệ thực tiễn" title="Sinh viên làm ba việc">
    <div style={{ display: 'grid', gridTemplateColumns: '620px 1fr', gap: 48, height: '100%' }}>
      <div style={{ background: ink.panel }}>
        <img src={volunteersPhoto} alt="Sinh viên tình nguyện cùng đồng bào vùng cao" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '53% center' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ borderBottom: `1px solid ${ink.rule}`, paddingBottom: 22 }}><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>01 / HỌC ĐÚNG</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Nắm quan điểm Mác – Lênin và Hồ Chí Minh về dân tộc; hiểu 54 dân tộc, không học vẹt.</div></div>
        <div style={{ borderBottom: `1px solid ${ink.rule}`, paddingBottom: 22 }}><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>02 / TÔN TRỌNG</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Tìm hiểu ngôn ngữ, lễ hội, trang phục từng tộc người; tránh định kiến vùng miền.</div></div>
        <div><div style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>03 / CẢNH GIÁC</div><div style={{ fontSize: 29, lineHeight: 1.4, marginTop: 8 }}>Kiểm chứng trước khi chia sẻ; không tiếp tay cho nội dung kích động chia rẽ.</div></div>
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
      <SummaryPoint number="01">Dân tộc có thể chỉ nhân dân một quốc gia hoặc một tộc người. Cần xác định đúng nghĩa trong từng ngữ cảnh.</SummaryPoint>
      <SummaryPoint number="02">Cương lĩnh Lênin gắn bình đẳng, tự quyết với liên hiệp công nhân; tư tưởng Hồ Chí Minh nhấn mạnh đại đoàn kết.</SummaryPoint>
      <SummaryPoint number="03">Ở Việt Nam, bảo đảm bình đẳng cần đi cùng thu hẹp khoảng cách phát triển, tôn trọng bản sắc và củng cố đoàn kết.</SummaryPoint>
    </div>
  </Frame>
);

// A home board and a separate arena share progress within this game page.
type QuizQuestion = { topic: string; question: string; options: readonly [string, string, string, string]; correct: number; explanation: string };
const quizQuestions: readonly QuizQuestion[] = [
  { topic: 'Khởi động · Chương I', question: 'Thứ tự hình thành các cộng đồng người là gì?', options: ['Bộ lạc → thị tộc → dân tộc → bộ tộc', 'Thị tộc → bộ lạc → bộ tộc → dân tộc', 'Thị tộc → bộ tộc → bộ lạc → dân tộc', 'Dân tộc → bộ tộc → bộ lạc → thị tộc'], correct: 1, explanation: 'Tiến trình được trình bày: thị tộc, bộ lạc, bộ tộc rồi đến dân tộc.' },
  { topic: 'Giải mã khái niệm · Chương I', question: '“Dân tộc” theo nghĩa rộng chỉ cộng đồng nào?', options: ['Những người cùng một dòng họ', 'Một cộng đồng tộc người', 'Nhân dân của một nước', 'Những người cùng tôn giáo'], correct: 2, explanation: 'Nghĩa rộng nói đến cộng đồng quốc gia; ví dụ là Việt Nam hoặc Nhật Bản.' },
  { topic: 'Nhớ đúng, chọn nhanh · Chương I', question: 'Dân tộc theo nghĩa rộng có mấy đặc trưng cơ bản?', options: ['3 đặc trưng', '5 đặc trưng', '4 đặc trưng', '6 đặc trưng'], correct: 1, explanation: 'Năm đặc trưng: lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý và nhà nước.' },
  { topic: 'Bắt đúng từ khóa · Chương I', question: 'Đâu là một đặc trưng của dân tộc theo nghĩa hẹp?', options: ['Ý thức tự giác tộc người', 'Có nhà nước riêng', 'Có lãnh thổ riêng biệt', 'Có một nền kinh tế độc lập'], correct: 0, explanation: 'Nghĩa hẹp có ba đặc trưng: ngôn ngữ, văn hóa và ý thức tự giác tộc người.' },
  { topic: 'Đổi góc nhìn · Chương II', question: 'Hai xu hướng khách quan của quan hệ dân tộc là gì?', options: ['Đô thị hóa và công nghiệp hóa', 'Cạnh tranh và khép kín', 'Đồng hóa và phân biệt', 'Tách ra độc lập và liên hiệp lại'], correct: 3, explanation: 'Hai xu hướng là hình thành dân tộc độc lập và các dân tộc xích lại gần, liên hiệp với nhau.' },
  { topic: 'Tìm nguyên nhân · Chương II', question: 'Yếu tố nào thúc đẩy các dân tộc liên hiệp lại?', options: ['Phát triển sản xuất, công nghệ, giao lưu', 'Sống biệt lập với thế giới', 'Áp bức và phân biệt dân tộc', 'Ngăn cản hợp tác quốc tế'], correct: 0, explanation: 'Lực lượng sản xuất, khoa học công nghệ và giao lưu phát triển thúc đẩy hợp tác giữa các dân tộc.' },
  { topic: 'Bộ ba nguyên tắc · Chương II', question: 'Bộ ba nào thuộc cương lĩnh dân tộc của Lênin?', options: ['Lãnh thổ – kinh tế – nhà nước', 'Độc lập – khép kín – tự cung tự cấp', 'Bình đẳng – tự quyết – liên hiệp công nhân', 'Ngôn ngữ – văn hóa – huyết thống'], correct: 2, explanation: 'Cương lĩnh gồm bình đẳng, quyền tự quyết và liên hiệp công nhân các dân tộc.' },
  { topic: 'Hiểu chứ không học vẹt · Chương II', question: 'Quyền tự quyết của dân tộc được hiểu như thế nào?', options: ['Can thiệp vào công việc dân tộc khác', 'Bắt buộc phải tách thành nước riêng', 'Tự chọn con đường phát triển', 'Từ chối mọi hình thức liên hiệp'], correct: 2, explanation: 'Tự quyết là tự chọn con đường phát triển, quyết định chia tách hoặc liên hiệp; không đồng nghĩa bắt buộc chia tách.' },
  { topic: 'Tự hào Việt Nam · Chương III', question: 'Cộng đồng các dân tộc Việt Nam có bao nhiêu dân tộc?', options: ['50 dân tộc', '52 dân tộc', '56 dân tộc', '54 dân tộc'], correct: 3, explanation: 'Việt Nam là quốc gia thống nhất của 54 dân tộc, mỗi dân tộc có bản sắc riêng.' },
  { topic: 'Về đích · Chương III', question: 'Chính sách dân tộc trong bài được chia thành mấy lĩnh vực?', options: ['5 lĩnh vực', '3 lĩnh vực', '4 lĩnh vực', '6 lĩnh vực'], correct: 0, explanation: 'Năm lĩnh vực: chính trị, kinh tế, xã hội, văn hóa và quốc phòng – an ninh.' },
  { topic: 'Đối chiếu ví dụ · Chương I', question: 'Cặp ví dụ nào đúng với “dân tộc theo nghĩa rộng”?', options: ['Người Kinh – người Thái', 'Việt Nam – Nhật Bản', 'Thị tộc – bộ lạc', 'Làng – bản'], correct: 1, explanation: 'Nghĩa rộng lấy quốc gia làm ví dụ: Việt Nam, Nhật Bản. Kinh, Thái là ví dụ của nghĩa hẹp.' },
  { topic: 'Loại trừ · Chương I', question: 'Đặc trưng nào KHÔNG được nêu riêng cho dân tộc theo nghĩa hẹp?', options: ['Cộng đồng ngôn ngữ', 'Có chung một nhà nước', 'Cộng đồng văn hóa', 'Ý thức tự giác tộc người'], correct: 1, explanation: 'Nhà nước là đặc trưng của nghĩa rộng; nghĩa hẹp chỉ nêu ngôn ngữ, văn hóa và ý thức tự giác.' },
  { topic: 'Trong một quốc gia · Chương II', question: 'Trong một quốc gia, xu hướng “tách ra” gắn với điều gì?', options: ['Nỗ lực giành tự do, bình đẳng của từng tộc người', 'Xây dựng liên minh toàn cầu', 'Phát triển khoa học công nghệ', 'Mở rộng giao lưu văn hóa'], correct: 0, explanation: 'Trong một quốc gia, xu hướng tách ra là nỗ lực của từng tộc người vì tự do, bình đẳng và phát triển của cộng đồng mình.' },
  { topic: 'Phạm vi quốc tế · Chương II', question: 'Trên phạm vi quốc tế, xu hướng “liên hiệp” biểu hiện ra sao?', options: ['Đấu tranh giành độc lập', 'Hợp tác, liên minh khu vực và toàn cầu', 'Khép kín biên giới', 'Chia tách thành nhiều quốc gia'], correct: 1, explanation: 'Trên phạm vi quốc tế, các dân tộc hợp tác và hình thành liên minh ở phạm vi khu vực hoặc toàn cầu.' },
  { topic: 'Nguyên tắc bình đẳng · Chương II', question: 'Nguyên tắc “bình đẳng” trong cương lĩnh Lênin yêu cầu điều gì?', options: ['Mọi dân tộc có quyền, nghĩa vụ ngang nhau; chống phân biệt', 'Dân tộc lớn lãnh đạo dân tộc nhỏ', 'Đồng hóa ngôn ngữ các tộc người', 'Mỗi dân tộc một nhà nước riêng'], correct: 0, explanation: 'Bình đẳng là quyền và nghĩa vụ ngang nhau; trong một quốc gia cần được pháp luật bảo đảm, chống áp bức và phân biệt.' },
  { topic: 'Sức mạnh đoàn kết · Chương II', question: '“Liên hiệp công nhân các dân tộc” dựa trên cơ sở nào?', options: ['Ép buộc và đồng hóa', 'Tự nguyện, bình đẳng, tôn trọng lẫn nhau', 'Lợi ích của dân tộc đa số', 'Can thiệp công việc nội bộ'], correct: 1, explanation: 'Liên hiệp trên cơ sở tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc.' },
  { topic: 'Chung sống · Chương III', question: 'Dân cư các tộc người ở Việt Nam phân bố ra sao?', options: ['Sống tách biệt trong vùng khép kín', 'Cư trú xen kẽ với nhau', 'Chỉ tập trung ở đồng bằng', 'Chỉ ở khu vực biên giới'], correct: 1, explanation: 'Một trong sáu đặc điểm là các tộc người cư trú xen kẽ với nhau trên cùng lãnh thổ.' },
  { topic: 'Trách nhiệm chung · Chương III', question: 'Theo quan điểm của Đảng, công tác dân tộc là nhiệm vụ của ai?', options: ['Riêng cơ quan dân tộc', 'Toàn Đảng, toàn dân, toàn quân và cả hệ thống chính trị', 'Chính quyền vùng dân tộc thiểu số', 'Các tổ chức quốc tế'], correct: 1, explanation: 'Công tác dân tộc được xác định là nhiệm vụ của toàn Đảng, toàn dân, toàn quân và hệ thống chính trị.' },
  { topic: 'Giữ gìn bản sắc · Chương III', question: 'Chính sách văn hóa nhấn mạnh điều gì?', options: ['Giữ gìn, phát huy giá trị văn hóa truyền thống', 'Xóa bỏ phong tục các tộc người', 'Hạn chế giao lưu văn hóa', 'Đồng phục hóa đời sống tinh thần'], correct: 0, explanation: 'Chính sách văn hóa giữ gìn, phát huy giá trị truyền thống, nâng trình độ văn hóa và mở rộng giao lưu.' },
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
  const chapter = question.topic.includes('Chương III') || question.topic.includes('Liên hệ') ? 3 : question.topic.includes('Chương II') ? 2 : 1;

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
  'Chào giảng viên và các bạn, nhóm 3 trình bày vấn đề dân tộc trong thời kỳ quá độ lên chủ nghĩa xã hội. Bài giữ bố cục ba phần của tài liệu thuyết trình: khái niệm; quan điểm Mác – Lênin; dân tộc và quan hệ dân tộc ở Việt Nam. Các phân tích về Hồ Chí Minh, thực trạng và giải pháp được bổ sung từ tiểu luận.',
  'Vì sao chọn đề tài? Có bốn lý do: hiểu đúng lý luận, nhìn vào thực tiễn quốc gia 54 dân tộc, thấy mối liên hệ giữa phát triển với an ninh và xác định trách nhiệm sinh viên. Không cần đọc lại từng ô; hãy lấy một tình huống gần gũi như tôn trọng khác biệt của bạn học.',
  'Chương I: hai cách hiểu từ dân tộc và vấn đề dân tộc là gì.',
  'Thị tộc, bộ lạc, bộ tộc rồi đến dân tộc. Mỗi ô chỉ nêu nét chính.',
  'Nghĩa rộng là nhân dân một nước: lãnh thổ, kinh tế, ngôn ngữ, văn hóa – tâm lý, nhà nước. Ví dụ Việt Nam, Nhật Bản.',
  'Nghĩa hẹp là tộc người: ngôn ngữ, văn hóa, ý thức tự giác. Ví dụ Kinh, Thái.',
  'Bảng 1.1 trong tiểu luận: bản chất, phạm vi, đặc trưng, yếu tố gắn kết. Đọc theo hàng để thấy Nation khác Ethnie ở đâu.',
  'Vấn đề dân tộc là quan hệ giữa các tộc người và giữa các quốc gia: địa vị bình đẳng, quyền lợi thiết thân, chênh lệch phát triển, gắn với giai cấp.',
  'Chương II: hai xu hướng, cương lĩnh Lênin, Hồ Chí Minh và bốn điểm của thời kỳ quá độ.',
  'Xu hướng tách ra lập quốc gia độc lập; xu hướng liên hiệp lại khi sản xuất, công nghệ và giao lưu phá hàng rào ngăn cách.',
  'Trong một nước là quyền phát triển của từng tộc người và hợp tác giữa họ. Ra quốc tế là giải phóng dân tộc và liên minh khu vực, toàn cầu.',
  'Ba nội dung cương lĩnh: bình đẳng, tự quyết, liên hiệp công nhân các dân tộc.',
  'Bình đẳng ghi trong luật và làm ngoài đời. Tự quyết là tự chọn đường đi, tách hay hiệp, trên lập trường công nhân. Liên hiệp tự nguyện, bình đẳng.',
  'Hồ Chí Minh: độc lập dân tộc gắn chủ nghĩa xã hội; các dân tộc là anh em một nhà; chăm lo đời sống, dùng cán bộ người dân tộc, chống dân tộc lớn và hẹp hòi.',
  'Bình đẳng trong pháp luật là nền tảng, nhưng điều kiện lịch sử khiến cơ hội phát triển thực tế chưa đồng đều. Vì vậy, cần đồng thời đầu tư phát triển, khắc phục định kiến và chú ý tác động quốc tế.',
  'Chương III: 54 dân tộc, bốn căn cứ, năm lĩnh vực chính sách, thực trạng và sáu giải pháp.',
  'Kinh khoảng 85,3%, 53 dân tộc thiểu số khoảng 14,7% theo tổng điều tra 2019. Sáu đặc điểm giữ nguyên, bổ sung số liệu vào ý đầu.',
  'Năm quan điểm của Đảng: đoàn kết là chiến lược lâu dài và cấp bách; bình đẳng cùng phát triển; phát triển toàn diện vùng thiểu số; ưu tiên hạ tầng, giảm nghèo; việc của cả hệ thống chính trị.',
  'Bốn căn cứ được dẫn trong tiểu luận: Điều 5 Hiến pháp 2013; Nghị quyết 24-NQ/TW năm 2003; Văn kiện Đại hội XIII năm 2021; Nghị quyết 120/2020/QH14 phê duyệt chủ trương đầu tư chương trình mục tiêu quốc gia 2021–2030. Chương trình 135 là ví dụ của giai đoạn trước, không phải tên gọi khác của chương trình mới.',
  'Năm lĩnh vực: chính trị, kinh tế, xã hội, văn hóa, quốc phòng – an ninh.',
  'Chính trị là bình đẳng, đoàn kết, tôn trọng. Kinh tế là Chương trình 135 và mục tiêu quốc gia 2021 – 2030, thu hẹp chênh lệch.',
  'Xã hội là an sinh, công bằng qua giáo dục, y tế, giảm nghèo, dân số.',
  'Văn hóa là giữ giá trị truyền thống, nâng trình độ, đào tạo cán bộ, mở giao lưu, chống tệ nạn và diễn biến hòa bình.',
  'Quốc phòng – an ninh là ổn định chính trị, trật tự, quan hệ quân dân, thế trận toàn dân vùng đồng bào.',
  'Theo phần 2.3 của tiểu luận, những thành tựu gồm củng cố đoàn kết, đầu tư hạ tầng, cải thiện đời sống, mở rộng giáo dục và y tế, bảo tồn văn hóa, giữ vững quốc phòng an ninh. Đây là đánh giá định tính, không hàm ý mọi địa bàn đã có mức tiếp cận như nhau.',
  'Bốn nhóm khó khăn về phát triển: nghèo và nguy cơ tái nghèo; thiếu hạ tầng và nhân lực; chính sách chồng chéo và năng lực thực hiện; áp lực đất đai, di cư và khí hậu. Nguyên nhân gồm điều kiện tự nhiên, xuất phát điểm, nguồn lực và tổ chức thực hiện.',
  'Hai thách thức còn lại trong phần 2.4 của tiểu luận là nguy cơ mai một văn hóa và thông tin gây chia rẽ dân tộc, tôn giáo. Phân biệt việc tôn trọng khác biệt với lan truyền định kiến; người dân cần được tham gia bảo tồn và quyết định hướng phát triển của cộng đồng.',
  'Ba giải pháp đầu: nâng cao nhận thức và năng lực hệ thống chính trị cơ sở; đầu tư hạ tầng, sinh kế để giảm nghèo bền vững; giáo dục, đào tạo nghề và thu hút nhân lực. Nhấn mạnh đồng bào là chủ thể tham gia, không chỉ là người nhận hỗ trợ.',
  'Ba giải pháp sau: bảo tồn văn hóa gắn sinh kế; kết hợp phát triển với quốc phòng an ninh; rà soát chính sách, phân cấp gắn trách nhiệm giải trình và giám sát. Sự tham gia của đồng bào và người có uy tín giúp chính sách sát nhu cầu hơn.',
  'Sinh viên làm ba việc theo kết luận tiểu luận: học đúng lý luận, tôn trọng đa dạng văn hóa, cảnh giác tin xuyên tạc.',
  'Kết luận bằng ba ý thay vì đọc lại các con số: xác định đúng hai nghĩa dân tộc; hiểu mối liên hệ giữa các nội dung cương lĩnh và đại đoàn kết; chuyển bình đẳng pháp lý thành cơ hội phát triển thực tế, đồng thời tôn trọng bản sắc.',
  'Mời cả lớp chọn một câu và trả lời bằng A, B, C hoặc D. Nếu trả lời sai, đáp án đó bị loại và cả lớp được thử lại. Ferris đi tới đá đáp án sai, nói một câu ngẫu nhiên rồi quay về. Khi trả lời đúng, phần giải thích hiện bên dưới. Bấm Home để chọn câu khác; bảng giữ lại các câu đã hoàn thành. Sau 20 câu có thể chơi lại từ đầu.',
  'Cảm ơn giảng viên và các bạn. Mời câu hỏi hoặc góp ý.',
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
