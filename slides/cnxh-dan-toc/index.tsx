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

const STYLE_ID = 'osd-styles-cnxh-dan-toc';
const CSS = `
  .cnx { animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-fill-mode: both; }
  [data-still] .cnx { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .cnx { animation: none !important; } }
  @keyframes cnx-rise { from { opacity: 0; transform: translateY(10px); } }
  @keyframes cnx-fade { from { opacity: 0; } }
  @keyframes cnx-scale { from { opacity: 0; transform: scale(0.96); } }
  @keyframes cnx-stamp { from { opacity: 0; transform: scale(0.7) rotate(-8deg); } }
  @keyframes cnx-draw { from { width: 0; } }
  .cnx-rise { animation-name: cnx-rise; animation-duration: 0.6s; }
  .cnx-fade { animation-name: cnx-fade; animation-duration: 0.5s; }
  .cnx-scale { animation-name: cnx-scale; animation-duration: 0.5s; }
  .cnx-stamp { animation-name: cnx-stamp; animation-duration: 0.4s; }
  .cnx-draw { width: 100%; animation-name: cnx-draw; animation-duration: 0.7s; }
`;
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== CSS) style.textContent = CSS;
}

const Styles = () => <style>{CSS}</style>;

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

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: CSSProperties = {};

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      className="cnx cnx-fade"
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
        animationDelay: '0.25s',
      }}
    >
      <span>CNXH KHOA HỌC · DÂN TỘC</span>
      <span>
        {pad2(current)} / {pad2(total)}
      </span>
    </div>
  );
};

const Mark = () => (
  <div
    className="cnx cnx-stamp"
    style={{
      position: 'absolute',
      left: P,
      top: 88,
      width: 24,
      height: 24,
      borderRadius: 'var(--osd-radius)',
      background: 'var(--osd-accent)',
      animationDelay: '0.05s',
    }}
  />
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    className="cnx cnx-rise"
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
  </div>
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
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      <Mark />
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="cnx cnx-rise"
        style={{
          position: 'absolute',
          left: P,
          top: 128,
          margin: 0,
          fontFamily: font.display,
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.08,
          animationDelay: '0.06s',
          maxWidth: 1500,
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className="cnx cnx-rise"
          style={{
            position: 'absolute',
            left: P,
            top: 216,
            margin: 0,
            maxWidth: 1400,
            fontSize: 26,
            lineHeight: 1.5,
            color: ink.soft,
            animationDelay: '0.12s',
          }}
        >
          {lead}
        </p>
      )}
      <div
        style={{
          position: 'absolute',
          left: P,
          right: P,
          top: lead ? 300 : 256,
          bottom: 140,
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

const Divider = ({ roman, label, sub }: { roman: string; label: string; sub?: string }) => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
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
        <div
          className="cnx cnx-fade"
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
        </div>
        <div
          className="cnx cnx-stamp"
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--osd-radius)',
            background: 'var(--osd-accent)',
            marginBottom: 40,
            animationDelay: '0.05s',
          }}
        />
        <div
          className="cnx cnx-rise"
          style={{
            fontFamily: font.display,
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--osd-accent)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 24,
            animationDelay: '0.1s',
          }}
        >
          {label}
        </div>
        <h2
          className="cnx cnx-rise"
          style={{
            margin: 0,
            fontFamily: font.display,
            fontSize: 86,
            fontWeight: 700,
            lineHeight: 1.05,
            color: 'var(--osd-text)',
            maxWidth: 1300,
            animationDelay: '0.16s',
          }}
        >
          {roman === 'I' && 'Khái niệm, đặc trưng cơ bản của dân tộc'}
          {roman === 'II' && 'Chủ nghĩa Mác – Lênin về vấn đề dân tộc'}
          {roman === 'III' && 'Dân tộc và quan hệ dân tộc ở Việt Nam'}
        </h2>
        {sub && (
          <p
            className="cnx cnx-rise"
            style={{
              marginTop: 32,
              maxWidth: 980,
              fontSize: 30,
              lineHeight: 1.5,
              color: ink.soft,
              animationDelay: '0.22s',
            }}
          >
            {sub}
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Pages
// ─────────────────────────────────────────────────────────────────────────────
const Cover: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 18,
          height: '100%',
          background: 'var(--osd-accent)',
        }}
      />
      <div
        className="cnx cnx-stamp"
        style={{
          position: 'absolute',
          left: 120,
          top: 110,
          padding: '8px 16px',
          border: '2px solid var(--osd-accent)',
          color: 'var(--osd-accent)',
          fontFamily: font.mono,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        CNXH KHOA HỌC
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 260,
          right: 160,
        }}
      >
        <div
          className="cnx cnx-fade"
          style={{
            fontSize: 24,
            color: ink.muted,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 28,
            animationDelay: '0.1s',
          }}
        >
          MỤC 3 · VẤN ĐỀ DÂN TỘC
        </div>
        <h1
          className="cnx cnx-rise"
          style={{
            margin: 0,
            fontFamily: font.display,
            fontSize: 'var(--osd-size-hero)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            animationDelay: '0.16s',
          }}
        >
          Vấn đề dân tộc trong thời kỳ quá độ lên CNXH
        </h1>
        <div
          className="cnx cnx-draw"
          style={{
            height: 4,
            background: 'var(--osd-accent)',
            marginTop: 44,
            maxWidth: 420,
            animationDelay: '0.45s',
          }}
        />
        <p
          className="cnx cnx-rise"
          style={{
            marginTop: 40,
            maxWidth: 1100,
            fontSize: 34,
            lineHeight: 1.5,
            color: ink.soft,
            animationDelay: '0.3s',
          }}
        >
          Từ lý thuyết Mác – Lênin đến đặc điểm và chính sách dân tộc ở Việt Nam — một vấn đề cốt lõi của khối đại đoàn kết dân tộc.
        </p>
      </div>
      <div
        className="cnx cnx-rise"
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          bottom: 110,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          animationDelay: '0.5s',
        }}
      >
        <div>
          <div style={{ fontSize: 22, color: ink.muted, marginBottom: 8 }}>NHÓM THUYẾT TRÌNH</div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Thu Nhớ · Thảo My · Thảo Nguyên · Sơn</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, color: ink.muted, marginBottom: 8 }}>TIỂU LUẬN & PP</div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Trường Sơn · Nhất Vũ · Hoàng Thiện · Quang Chiến · Văn Duy</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const WhyTopic: Page = () => (
  <Frame eyebrow="Giới thiệu" title="Lý do chọn đề tài" lead="Bốn lý do làm cho vấn đề dân tộc vừa là lý thuyết, vừa là thực tiễn và trách nhiệm của chúng ta.">
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 32,
        height: '100%',
      }}
    >
      {[
        { n: 'I', t: 'Về mặt lý luận', d: 'Vấn đề dân tộc là nội dung cốt lõi của chủ nghĩa xã hội khoa học; cơ sở khoa học để nhìn nhận xung đột sắc tộc, ly khai và chủ nghĩa dân tộc cực đoan.' },
        { n: 'II', t: 'Về mặt thực tiễn Việt Nam', d: 'Việt Nam có 54 dân tộc anh em; đoàn kết dân tộc là yếu tố quyết định thắng lợi trong quá khứ và nền tảng phát triển bền vững hiện nay.' },
        { n: 'III', t: 'Về mặt chính trị – an ninh', d: 'Vùng dân tộc thiểu số, miền núi giữ vị trí chiến lược; các thế lực thù địch thường lợi dụng vấn đề dân tộc để chia rẽ.' },
        { n: 'IV', t: 'Về mặt trách nhiệm sinh viên', d: 'Nhận thức đúng để giữ gìn khối đại đoàn kết, bảo tồn bản sắc văn hóa và chống thông tin xuyên tạc trên mạng.' },
      ].map((x, i) => (
        <div
          key={x.n}
          className="cnx cnx-rise"
          style={{
            background: ink.panel,
            border: `1px solid ${ink.rule}`,
            borderRadius: 'var(--osd-radius)',
            padding: 32,
            display: 'flex',
            gap: 24,
            animationDelay: `${0.18 + i * 0.08}s`,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: 72,
              fontWeight: 700,
              color: 'var(--osd-accent)',
              lineHeight: 1,
            }}
          >
            {x.n}
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 10 }}>{x.t}</div>
            <div style={{ fontSize: 24, lineHeight: 1.45, color: ink.soft }}>{x.d}</div>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

const DivConcept = () => <Divider roman="I" label="CHƯƠNG I" sub="Khái niệm dân tộc và đặc trưng cơ bản của nó." />;

const ConceptTimeline: Page = () => (
  <Frame eyebrow="Chương I" title="Dân tộc là quá trình phát triển" lead="Theo quan điểm Mác – Lênin, xã hội loài người trải qua các hình thức cộng đồng từ thấp đến cao.">
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'stretch' }}>
        <Steps>
          {[
            { n: '01', t: 'Thị tộc', d: 'Cộng đồng huyết thống gần gũi nhất, gắn với sản xuất hái lượm, săn bắt.' },
            { n: '02', t: 'Bộ lạc', d: 'Nhiều thị tộc liên kết, bắt đầu có phân công lao động và tín ngưỡng chung.' },
            { n: '03', t: 'Bộ tộc', d: 'Cộng đồng lớn hơn, lãnh thổ rõ hơn, văn hóa và ngôn ngữ tương đối ổn định.' },
            { n: '04', t: 'Dân tộc', d: 'Hình thức cao nhất: lãnh thổ, kinh tế thống nhất, ngôn ngữ chung, ý thức tự giác.' },
          ].map((x, i) => (
            <Step key={x.n}>
              <div
                className="cnx cnx-rise"
                style={{
                  flex: 1,
                  background: ink.panel,
                  border: '1px solid ' + ink.rule,
                  borderTop: '4px solid var(--osd-accent)',
                  borderRadius: 'var(--osd-radius)',
                  padding: 28,
                  minHeight: 260,
                  animationDelay: `${0.12 + i * 0.1}s`,
                }}
              >
                <div style={{ fontFamily: font.mono, fontSize: 30, color: 'var(--osd-accent)', marginBottom: 14 }}>{x.n}</div>
                <div style={{ fontFamily: font.display, fontSize: 34, fontWeight: 700, marginBottom: 14 }}>{x.t}</div>
                <div style={{ fontSize: 22, lineHeight: 1.5, color: ink.soft }}>{x.d}</div>
              </div>
            </Step>
          ))}
        </Steps>
      </div>
      <div style={{ position: 'relative', height: 6, background: ink.rule, borderRadius: 3 }}>
        <div className="cnx cnx-draw" style={{ position: 'absolute', left: 0, top: 0, height: 6, background: 'var(--osd-accent)', borderRadius: 3, animationDelay: '0.3s' }} />
      </div>
    </div>
  </Frame>
);

const Compare: Page = () => (
  <Frame eyebrow="Chương I" title="Hai nghĩa của khái niệm dân tộc" lead="Phân biệt Nation (nghĩa rộng) và Ethnie (nghĩa hẹp) theo các đặc trưng cơ bản.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, height: '100%' }}>
      <div
        className="cnx cnx-rise"
        style={{ background: ink.panel, border: '1px solid ' + ink.rule, borderRadius: 'var(--osd-radius)', padding: 36, animationDelay: '0.16s' }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Nghĩa rộng · Nation</div>
        <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700, marginBottom: 20 }}>Cộng đồng người một nước</div>
        <ul style={{ margin: 0, paddingLeft: 28, fontSize: 26, lineHeight: 1.6, color: ink.soft }}>
          <li>Chung vùng lãnh thổ ổn định</li>
          <li>Chung phương thức sinh hoạt kinh tế</li>
          <li>Chung ngôn ngữ giao tiếp</li>
          <li>Chung nền văn hóa và tâm lý</li>
          <li>Chung một nhà nước</li>
        </ul>
        <div style={{ marginTop: 24, fontSize: 22, color: ink.muted, fontStyle: 'italic' }}>Ví dụ: dân tộc Việt Nam, dân tộc Nhật Bản.</div>
      </div>
      <div
        className="cnx cnx-rise"
        style={{ background: ink.panel, border: '1px solid ' + ink.rule, borderRadius: 'var(--osd-radius)', padding: 36, animationDelay: '0.24s' }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Nghĩa hẹp · Ethnie</div>
        <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 700, marginBottom: 20 }}>Cộng đồng tộc người</div>
        <ul style={{ margin: 0, paddingLeft: 28, fontSize: 26, lineHeight: 1.6, color: ink.soft }}>
          <li>Cộng đồng về ngôn ngữ</li>
          <li>Cộng đồng về văn hóa</li>
          <li>Ý thức tự giác dân tộc</li>
        </ul>
        <div style={{ marginTop: 24, fontSize: 22, color: ink.muted, fontStyle: 'italic' }}>Ví dụ: dân tộc Kinh, dân tộc Thái.</div>
      </div>
    </div>
  </Frame>
);

const TableCompare: Page = () => (
  <Frame eyebrow="Chương I" title="Bảng phân biệt hai nghĩa" lead="Tóm tắt nhanh để ghi nhớ: Nation = một nước; Ethnie = một tộc người.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, height: '100%', justifyContent: 'center' }}>
      {[
        ['Tiêu chí', 'Nghĩa rộng (Nation)', 'Nghĩa hẹp (Ethnie)'],
        ['Đơn vị', 'Nhân dân một nước', 'Tộc người trong lịch sử'],
        ['Lãnh thổ', 'Có', 'Không phải tiêu chí trung tâm'],
        ['Kinh tế', 'Thống nhất', 'Không bắt buộc'],
        ['Ngôn ngữ', 'Chung', 'Chung trong cộng đồng'],
        ['Nhà nước', 'Có', 'Không'],
        ['Ví dụ', 'Việt Nam, Nhật Bản', 'Kinh, Thái'],
      ].map((row, i) => (
        <div
          key={i}
          className="cnx cnx-rise"
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 1fr',
            gap: 24,
            padding: '16px 24px',
            background: i === 0 ? 'var(--osd-accent)' : i % 2 === 0 ? ink.panel : 'transparent',
            color: i === 0 ? '#fff' : 'var(--osd-text)',
            borderRadius: 'var(--osd-radius)',
            border: i === 0 ? 'none' : '1px solid ' + ink.rule,
            fontSize: i === 0 ? 26 : 24,
            fontWeight: i === 0 ? 700 : 500,
            animationDelay: `${0.15 + i * 0.05}s`,
          }}
        >
          {row.map((c, j) => <div key={j}>{c}</div>)}
        </div>
      ))}
    </div>
  </Frame>
);

const DivMarx = () => <Divider roman="II" label="CHƯƠNG II" sub="Hai xu hướng khách quan và cương lĩnh dân tộc của Lênin." />;

const TwoTrends: Page = () => (
  <Frame eyebrow="Chương II · 2.1" title="Hai xu hướng khách quan" lead="Trong quá trình phát triển, quan hệ dân tộc vận động theo hai hướng khách quan.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px 1fr', gap: 24, height: '100%', alignItems: 'center' }}>
      <div
        className="cnx cnx-rise"
        style={{ background: ink.panel, border: '1px solid ' + ink.rule, borderRadius: 'var(--osd-radius)', padding: 32, minHeight: 280, animationDelay: '0.18s' }}
      >
        <div style={{ fontSize: 22, color: 'var(--osd-accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Xu hướng 1</div>
        <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 700, marginBottom: 14 }}>Tách ra để độc lập</div>
        <div style={{ fontSize: 24, lineHeight: 1.5, color: ink.soft }}>Cộng đồng dân cư muốn tách ra để hình thành cộng đồng dân tộc độc lập — biểu hiện ly khai, tự quyết.</div>
      </div>
      <div
        className="cnx cnx-scale"
        style={{ textAlign: 'center', fontSize: 96, color: 'var(--osd-accent)', fontWeight: 700, animationDelay: '0.3s' }}
      >
        ⇄
      </div>
      <div
        className="cnx cnx-rise"
        style={{ background: ink.panel, border: '1px solid ' + ink.rule, borderRadius: 'var(--osd-radius)', padding: 32, minHeight: 280, animationDelay: '0.26s' }}
      >
        <div style={{ fontSize: 22, color: 'var(--osd-accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Xu hướng 2</div>
        <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 700, marginBottom: 14 }}>Liên hiệp lại với nhau</div>
        <div style={{ fontSize: 24, lineHeight: 1.5, color: ink.soft }}>Các dân tộc trong từng quốc gia, thậm chí nhiều quốc gia muốn liên hiệp lại — biểu hiện đoàn kết, hội nhập.</div>
      </div>
    </div>
  </Frame>
);

const LeninPillars: Page = () => (
  <Frame eyebrow="Chương II · 2.2" title="Cương lĩnh dân tộc của Lênin" lead="Ba nguyên tắc xuyên suốt, được áp dụng vào điều kiện cụ thể của từng quốc gia.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, height: '100%', alignItems: 'stretch' }}>
      {[
        { n: '01', t: 'Bình đẳng dân tộc', d: 'Các dân tộc hoàn toàn bình đẳng; không dân tộc nào áp bức dân tộc khác.' },
        { n: '02', t: 'Quyền tự quyết', d: 'Các dân tộc được quyền tự quyết, kể cả quyền ly khai; nhưng cần đặt trong bối cảnh lợi ích chung.' },
        { n: '03', t: 'Liên hiệp công nhân', d: 'Liên hiệp công nhân tất cả các dân tộc; đoàn kết lực lượng lao động là sức mạnh cách mạng.' },
      ].map((x, i) => (
        <div
          key={x.n}
          className="cnx cnx-rise"
          style={{
            background: 'var(--osd-accent)',
            color: '#fff',
            borderRadius: 'var(--osd-radius)',
            padding: 36,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            animationDelay: `${0.16 + i * 0.1}s`,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 44, fontWeight: 700, opacity: 0.7 }}>{x.n}</div>
          <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>{x.t}</div>
          <div style={{ fontSize: 24, lineHeight: 1.5, opacity: 0.92 }}>{x.d}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const DivVN = () => <Divider roman="III" label="CHƯƠNG III" sub="Dân tộc và quan hệ dân tộc ở Việt Nam." />;

const VNFeatures: Page = () => (
  <Frame eyebrow="Chương III · 3.1" title="Đặc điểm dân tộc ở Việt Nam" lead="Những đặc điểm này lý giải tại sao đoàn kết dân tộc là vấn đề chiến lược ở Việt Nam.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, height: '100%', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          'Chênh lệch về số dân giữa các tộc người',
          'Các dân tộc cư trú xen kẽ nhau',
          'Dân tộc thiểu số phân bố ở vùng chiến lược quan trọng',
          'Trình độ phát triển không đều giữa các dân tộc',
          'Truyền thống đoàn kết gắn bó lâu đời trong quốc gia thống nhất',
          'Mỗi dân tộc có bản sắc văn hóa riêng, góp phần phong phú văn hóa Việt Nam',
        ].map((x, i) => (
          <div
            key={i}
            className="cnx cnx-rise"
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: '1px solid ' + ink.rule,
              animationDelay: `${0.16 + i * 0.07}s`,
            }}
          >
            <div style={{ fontFamily: font.mono, fontSize: 26, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 44 }}>{pad2(i + 1)}</div>
            <div style={{ fontSize: 26, lineHeight: 1.45, color: ink.soft }}>{x}</div>
          </div>
        ))}
      </div>
      <div
        className="cnx cnx-scale"
        style={{
          background: ink.panel,
          border: '1px solid ' + ink.rule,
          borderRadius: 'var(--osd-radius)',
          padding: 32,
          textAlign: 'center',
          animationDelay: '0.4s',
        }}
      >
        <div style={{ fontFamily: font.display, fontSize: 120, fontWeight: 700, color: 'var(--osd-accent)', lineHeight: 1 }}>54</div>
        <div style={{ fontSize: 24, color: ink.soft, marginTop: 12, lineHeight: 1.4 }}>dân tộc anh em cùng chung một quốc gia thống nhất</div>
      </div>
    </div>
  </Frame>
);

const PartyView: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Quan điểm của Đảng về vấn đề dân tộc" lead="Đoàn kết dân tộc là đường lối nhất quán, là sức mạnh và động lực của cách mạng Việt Nam.">
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 24 }}>
      <div
        className="cnx cnx-rise"
        style={{
          background: ink.panel,
          borderLeft: '6px solid var(--osd-accent)',
          borderRadius: 'var(--osd-radius)',
          padding: '40px 48px',
          animationDelay: '0.18s',
        }}
      >
        <div style={{ fontFamily: font.display, fontSize: 38, lineHeight: 1.45, fontStyle: 'italic', color: ink.text }}>
          “Đoàn kết là sức mạnh sống còn của cách mạng. Đại đoàn kết dân tộc là chiến lược và là động lực của cách mạng Việt Nam.”
        </div>
        <div style={{ marginTop: 24, fontSize: 24, color: ink.muted }}>— Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginTop: 12,
        }}
      >
        {[
          'Bình đẳng, đoàn kết, tôn trọng và giúp nhau cùng phát triển',
          'Phát huy quyền làm chủ của Nhân dân, bảo vệ bản sắc văn hóa',
          'Chống chia rẽ, xử lý nghiêm các biểu hiện phân biệt đối xử',
          'Kết hợp phát triển kinh tế – xã hội với củng cố quốc phòng – an ninh',
        ].map((x, i) => (
          <div
            key={i}
            className="cnx cnx-rise"
            style={{ fontSize: 26, lineHeight: 1.45, color: ink.soft, animationDelay: `${0.3 + i * 0.07}s` }}
          >
            <span style={{ color: 'var(--osd-accent)', fontWeight: 700, marginRight: 10 }}>•</span>
            {x}
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

const PolicyMatrix: Page = () => (
  <Frame eyebrow="Chương III · 3.2" title="Chính sách dân tộc của Đảng, Nhà nước" lead="Bốn trụ cột chính sách, đi từ chính trị đến an ninh quốc phòng.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 28, height: '100%' }}>
      {[
        { t: 'Chính trị', d: 'Bình đẳng, chống phân biệt; phát huy vai trò già làng, trưởng bản, người có uy tín.' },
        { t: 'Kinh tế', d: 'Xóa đói giảm nghèo; đầu tư hạ tầng, phát triển sản xuất, đào tạo nghề ở vùng dân tộc.' },
        { t: 'Văn hóa', d: 'Bảo tồn bản sắc, phát triển giáo dục song ngữ, chăm sóc sức khỏe và phúc lợi.' },
        { t: 'An ninh quốc phòng', d: 'Củng cố thế trận lòng dân; kết hợp phát triển với bảo đảm chủ quyền biên giới.' },
      ].map((x, i) => (
        <div
          key={x.t}
          className="cnx cnx-rise"
          style={{
            background: ink.panel,
            border: '1px solid ' + ink.rule,
            borderRadius: 'var(--osd-radius)',
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            animationDelay: `${0.16 + i * 0.08}s`,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{x.t}</div>
          <div style={{ fontSize: 26, lineHeight: 1.5, color: ink.soft }}>{x.d}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const Practice: Page = () => (
  <Frame eyebrow="Liên hệ thực tiễn" title="Vấn đề dân tộc hôm nay" lead="Nhận thức đúng phải đi đôi với hành động cụ thể trong thực tiễn.">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, height: '100%', alignItems: 'stretch' }}>
      {[
        { n: '01', t: 'Vùng núi & biên giới', d: 'Đầu tư phát triển, bảo đảm an sinh và củng cố lòng dân ở vùng chiến lược.' },
        { n: '02', t: 'Bảo tồn bản sắc', d: 'Gìn giữ ngôn ngữ, lễ hội và tri thức bản địa trong dòng chảy hiện đại hóa.' },
        { n: '03', t: 'Không gian mạng', d: 'Chống thông tin xuyên tạc, kích động chia rẽ; lan tỏa tinh thần đại đoàn kết.' },
      ].map((x, i) => (
        <div
          key={x.n}
          className="cnx cnx-rise"
          style={{
            background: ink.panel,
            border: '1px solid ' + ink.rule,
            borderRadius: 'var(--osd-radius)',
            padding: 30,
            animationDelay: `${0.16 + i * 0.1}s`,
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 48, color: 'var(--osd-accent)', fontWeight: 700, marginBottom: 16 }}>{x.n}</div>
          <div style={{ fontFamily: font.display, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{x.t}</div>
          <div style={{ fontSize: 23, lineHeight: 1.5, color: ink.soft }}>{x.d}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const Summary: Page = () => (
  <Frame eyebrow="Tổng kết" title="Ba điềm cần nhớ" lead="Từ lý thuyết đến hành động: đoàn kết dân tộc là lợi ích chiến lược và trách nhiệm chung.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center', height: '100%' }}>
      {[
        { n: '01', t: 'Dân tộc là cộng đồng ổn định, có ý thức tự giác; Mác – Lênin đặt nền tảng khoa học cho vấn đề này.' },
        { n: '02', t: 'Hai xu hướng khách quan và cương lĩnh Lênin là kim chỉ nam cho chính sách dân tộc.' },
        { n: '03', t: 'Việt Nam: 54 dân tộc, đoàn kết là sức mạnh; chính sách phải đi đôi với thực tiễn và trách nhiệm của mỗi người.' },
      ].map((x, i) => (
        <div
          key={x.n}
          className="cnx cnx-rise"
          style={{ display: 'flex', gap: 28, alignItems: 'center', animationDelay: `${0.16 + i * 0.1}s` }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'var(--osd-accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: font.mono,
              fontSize: 30,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {x.n}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.45, color: ink.soft }}>{x.t}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const Quiz: Page = () => (
  <Frame eyebrow="Trò chơi" title="Kiểm tra nhanh hiểu bài" lead="Trả lời trước, sau đó mở đáp án từng ý.">
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Steps>
        {[
          { q: 'Câu 1: Theo Mác – Lênin, dân tộc ở nghĩa rộng có bao nhiêu đặc trưng cơ bản?', a: 'Đáp án: 05 đặc trưng (lãnh thổ, kinh tế, ngôn ngữ, văn hóa, nhà nước).' },
          { q: 'Câu 2: Cương lĩnh dân tộc của Lênin gồm những nguyên tắc nào?', a: 'Đáp án: bình đẳng dân tộc, quyền tự quyết, liên hiệp công nhân tất cả các dân tộc.' },
          { q: 'Câu 3: Việt Nam có bao nhiêu dân tộc anh em?', a: 'Đáp án: 54 dân tộc; đoàn kết dân tộc là nền tảng phát triển bền vững.' },
        ].map((x, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <Step>
              <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--osd-text)', marginBottom: 8 }}>{x.q}</div>
            </Step>
            <Step>
              <div style={{ fontSize: 26, color: ink.gold, fontWeight: 600, paddingLeft: 24, borderLeft: '3px solid ' + ink.gold }}>{x.a}</div>
            </Step>
          </div>
        ))}
      </Steps>
    </div>
  </Frame>
);

const Closing: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 28,
        }}
      >
        <div
          className="cnx cnx-stamp"
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--osd-radius)',
            background: 'var(--osd-accent)',
            marginBottom: 8,
          }}
        />
        <h1
          className="cnx cnx-rise"
          style={{
            margin: 0,
            fontFamily: font.display,
            fontSize: 120,
            fontWeight: 700,
            lineHeight: 1.05,
            animationDelay: '0.1s',
          }}
        >
          Cảm ơn đã lắng nghe
        </h1>
        <p
          className="cnx cnx-rise"
          style={{ margin: 0, fontSize: 34, color: ink.soft, maxWidth: 900, animationDelay: '0.18s' }}
        >
          Mọi ý kiến và câu hỏi đều được hoan nghênh. Khối đại đoàn kết dân tộc bắt đầu từ nhận thức đúng của từng chúng ta.
        </p>
        <div
          className="cnx cnx-fade"
          style={{ fontSize: 24, color: ink.muted, marginTop: 24, animationDelay: '0.3s' }}
        >
          Vấn đề dân tộc trong thời kỳ quá độ lên CNXH · Slide trình bày
        </div>
      </div>
      <Footer />
    </div>
  );
};

export const meta: SlideMeta = {
  title: 'Vấn đề dân tộc trong thời kỳ quá độ lên CNXH',
  createdAt: '2026-10-15T13:53:01.521Z',
};

export const notes: (string | undefined)[] = [
  'Chào các bạn, hôm nay nhóm em trình bày về vấn đề dân tộc trong thời kỳ quá độ lên CNXH. Đây là nội dung cốt lõi của chủ nghĩa xã hội khoa học.',
  'Giải thích bốn lý do chọn đề tài: lý luận, thực tiễn Việt Nam, chính trị – an ninh và trách nhiệm sinh viên. Nhấn mạnh ở thực tiễn: 54 dân tộc.',
  'Chương I. D freewaylige moi tu thị tộc đến dân tộc; từng bước giải thích mỗi hình thức cộng đồng.',
  'So sánh hai nghĩa: Nation là một nước, Ethnie là tộc người. Ví dụ để tránh nhầm lẫn.',
  'Tóm tắt bảng phân biệt. Nhắc sinh viên phân tích từng đặc trưng trong tiểu luận.',
  'Chương II. Hai xu hướng: ly khai và liên hiệp. Giải thích biểu hiện trong và ngoài nước.',
  'Ba nguyên tắc cương lĩnh Lênin. Nhấn mạnh quyền tự quyết đặt trong lợi ích chung.',
  'Chương III. Special điểm ở Việt Nam: số dân, phân bố xen kẽ, trình độ không đều.',
  'Quan điểm Đảng: đoàn kết là sức mạnh. Tính côt lõi và nhất quán.',
  'Chính sách bốn lĩnh vực. Nêu ví dụ concrete nếu có thời gian.',
  'Liên hệ thực tiễn: vùng núi, bản sắc, mạng xã hội. Kêu gọi trách nhiệm cá nhân.',
  'Tổng kết ba điềm. Mở sang câu hỏi hoặc trò chơi.',
  'Trò chơi: trả lời và giải thích đáp án. Giữ không khí nhẹ nhàng.',
  'Cảm ơn và mời câu hỏi từ hội đồng.',
];

export default [
  Cover,
  WhyTopic,
  DivConcept,
  ConceptTimeline,
  Compare,
  TableCompare,
  DivMarx,
  TwoTrends,
  LeninPillars,
  DivVN,
  VNFeatures,
  PartyView,
  PolicyMatrix,
  Practice,
  Summary,
  Quiz,
  Closing,
] satisfies Page[];
