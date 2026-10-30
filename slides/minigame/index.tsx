import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useCallback, useEffect, useState } from 'react';
import posterImg from './assets/1wupukr1tqlckmswsr9pqpmc9ltgvnluxob3psst9i8retew1kyplb0zqohoehfe6jt1.jpg';
import mapImg from './assets/1wupukr1tqizabfjv9nsiimtnom21au7dlm1jrpfjky8ggvwtkkblparjedjaugtp6x2.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// Design system
// ─────────────────────────────────────────────────────────────────────────────

export const design: DesignSystem = {
  palette: { bg: '#1A1C2C', text: '#F4F4F4', accent: '#FFCD75' },
  fonts: {
    display: '"VT323", monospace',
    body: '"Be Vietnam Pro", system-ui, sans-serif',
  },
  typeScale: { hero: 124, body: 32 },
  radius: 0,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap';
const FONT_LINK_ID = 'osd-webfont-minigame';

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
// Scoped CSS
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
.mg-btn { transition: transform 90ms steps(2, end), filter 90ms linear; }
.mg-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
.mg-btn:active { transform: translateY(3px); }
.mg-tile { transition: transform 120ms steps(2, end), filter 120ms linear; }
.mg-tile:hover { transform: translateY(-5px); filter: brightness(1.08); }
.mg-chest { position: relative; display: block; }
.mg-chest-glow { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,205,117,.34) 0%, rgba(255,205,117,0) 70%); opacity: 0; transition: opacity 160ms linear; pointer-events: none; z-index: 0; }
.mg-chest-body { position: absolute; left: 0; z-index: 2; }
.mg-chest-body-closed,
.mg-chest-body-open { position: absolute; left: 0; top: 0; transition: opacity 80ms steps(1, end); }
.mg-chest-body-open { opacity: 0; }
.mg-chest-lid { position: absolute; left: 0; top: 0; z-index: 1; transform-origin: 50% 100%; transition: transform 160ms steps(3, end); }
.mg-chest-lid-closed,
.mg-chest-lid-open { position: absolute; left: 0; top: 0; transition: opacity 80ms steps(1, end); }
.mg-chest-lid-open { opacity: 0; }
.mg-chest-coin { position: absolute; opacity: 0; transform: translate(-50%, 0); z-index: 3; pointer-events: none; }
.mg-chest:hover .mg-chest-glow,
.mg-tile:hover .mg-chest-glow,
.mg-tile:focus-visible .mg-chest-glow,
.mg-chest-force-open .mg-chest-glow { opacity: 1; }
.mg-chest:hover .mg-chest-body-closed,
.mg-tile:hover .mg-chest-body-closed,
.mg-tile:focus-visible .mg-chest-body-closed,
.mg-chest-force-open .mg-chest-body-closed { opacity: 0; }
.mg-chest:hover .mg-chest-body-open,
.mg-tile:hover .mg-chest-body-open,
.mg-tile:focus-visible .mg-chest-body-open,
.mg-chest-force-open .mg-chest-body-open { opacity: 1; }
.mg-chest:hover .mg-chest-lid,
.mg-tile:hover .mg-chest-lid,
.mg-tile:focus-visible .mg-chest-lid,
.mg-chest-force-open .mg-chest-lid { transform: translateY(calc(-1 * var(--mg-chest-lift, 2px))) rotate(-6deg); }
.mg-chest:hover .mg-chest-lid-closed,
.mg-tile:hover .mg-chest-lid-closed,
.mg-tile:focus-visible .mg-chest-lid-closed,
.mg-chest-force-open .mg-chest-lid-closed { opacity: 0; }
.mg-chest:hover .mg-chest-lid-open,
.mg-tile:hover .mg-chest-lid-open,
.mg-tile:focus-visible .mg-chest-lid-open,
.mg-chest-force-open .mg-chest-lid-open { opacity: 1; }
.mg-chest:hover .mg-chest-coin,
.mg-tile:hover .mg-chest-coin,
.mg-tile:focus-visible .mg-chest-coin { animation: mg-chest-coin .8s steps(5, end) both; }
.mg-opt { transition: background 120ms linear, border-color 120ms linear, transform 120ms steps(2, end); }
.mg-opt:hover { transform: translateX(4px); }
.mg-in { animation: mg-in .36s steps(4, end) both; }
.mg-pop { animation: mg-pop .34s steps(3, end) both; }
.mg-bob { animation: mg-bob 1.7s steps(2, end) infinite; }
.mg-bob-slow { animation: mg-bob 2.6s steps(2, end) infinite; }
.mg-blink { animation: mg-blink 1s steps(1, end) infinite; }
.mg-float { animation: mg-float 3.2s steps(4, end) infinite; }
.mg-twinkle { animation: mg-twinkle 3s steps(1, end) infinite; }
.mg-shake { animation: mg-shake .3s steps(2, end) both; }
.mg-tile-open { animation: mg-tile-open .46s steps(4, end) both; }
.mg-scan { position: absolute; inset: 0; z-index: 80; pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(5,4,12,.16) 0 2px, transparent 2px 4px);
  opacity: .45; }
.mg-dither { background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.035) 0 2px, transparent 2px 4px); }
@keyframes mg-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes mg-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
@keyframes mg-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes mg-twinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes mg-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(2px); } }
@keyframes mg-tile-open { 0% { transform: scale(.86); filter: brightness(2.2); } 60% { transform: scale(1.03); } 100% { transform: scale(1); filter: none; } }
@keyframes mg-pop { 0% { transform: scale(.92); opacity: .4; } 60% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
@keyframes mg-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mg-chest-coin { 0% { opacity: 0; transform: translate(-50%, 4px) scale(.8); } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, -26px) scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .mg-bob,.mg-bob-slow,.mg-blink,.mg-float,.mg-twinkle,.mg-shake,.mg-tile-open,.mg-in,.mg-pop,.mg-chest-lid,.mg-chest-body-closed,.mg-chest-body-open,.mg-chest-lid-closed,.mg-chest-lid-open,.mg-chest-coin,.mg-chest-glow { animation: none !important; transition: none !important; }
}
`;

const STYLE_ID = 'osd-styles-minigame';

if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== CSS) style.textContent = CSS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Palette, type, helpers
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy: '#1A1C2C',
  plum: '#5D275D',
  red: '#B13E53',
  orange: '#EF7D57',
  yellow: '#FFCD75',
  lime: '#A7F070',
  green: '#38B764',
  teal: '#257179',
  deep: '#29366F',
  blue: '#3B5DC9',
  sky: '#41A6F6',
  cyan: '#73EFF7',
  white: '#F4F4F4',
  silver: '#94B0C2',
  slate: '#566C86',
  ink: '#333C57',
  dark: '#0E0F1A',
} as const;

const F = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  pixel: '"Press Start 2P", monospace',
  mono: '"VT323", monospace',
};

const P = 8;
const TOTAL_PAGES = 4;
const PAGE = { cover: 1, rules: 2, game: 3, knowledge: 4 } as const;

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
};

const abs = (left: number, top: number, extra?: CSSProperties): CSSProperties => ({
  position: 'absolute',
  left,
  top,
  ...extra,
});

const notch = (n = P) =>
  `polygon(${n}px 0, calc(100% - ${n}px) 0, calc(100% - ${n}px) ${n}px, 100% ${n}px, 100% calc(100% - ${n}px), calc(100% - ${n}px) calc(100% - ${n}px), calc(100% - ${n}px) 100%, ${n}px 100%, ${n}px calc(100% - ${n}px), 0 calc(100% - ${n}px), 0 ${n}px, ${n}px ${n}px)`;

const goPage = (page: number) => {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
  const url = new URL(window.location.href);
  url.searchParams.set('p', String(clamped));
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const pad2 = (n: number) => String(n).padStart(2, '0');

// ─────────────────────────────────────────────────────────────────────────────
// Question bank - 22 MC + 7 essay, split by image
// ─────────────────────────────────────────────────────────────────────────────

type MCQuestion = {
  kind: 'mc';
  topic: string;
  text: string;
  options: string[];
  answer: number;
  explain: string;
};

type EssayQuestion = {
  kind: 'essay';
  topic: string;
  text: string;
  hint: string;
  sample: string;
};

type Question = MCQuestion | EssayQuestion;

const mc = (
  topic: string,
  text: string,
  options: string[],
  answer: number,
  explain: string,
): Question => ({ kind: 'mc', topic, text, options, answer, explain });

const essay = (topic: string, text: string, hint: string, sample: string): Question => ({
  kind: 'essay',
  topic,
  text,
  hint,
  sample,
});

const POOL_ONE: Question[] = [
  mc(
    'CHƯƠNG I',
    'Theo quan điểm của chủ nghĩa Mác - Lênin, các hình thức cộng đồng người từ thấp đến cao là:',
    [
      'Bộ lạc - thị tộc - bộ tộc - dân tộc',
      'Thị tộc - bộ lạc - bộ tộc - dân tộc',
      'Thị tộc - bộ tộc - bộ lạc - dân tộc',
      'Bộ tộc - bộ lạc - thị tộc - dân tộc',
    ],
    1,
    'Thứ tự đúng: thị tộc → bộ lạc → bộ tộc → dân tộc.',
  ),
  mc(
    'CHƯƠNG I',
    '“Một cộng đồng người ổn định làm thành nhân dân một nước, có lãnh thổ riêng, nền kinh tế thống nhất, có ngôn ngữ chung và có ý thức về sự thống nhất của mình” là khái niệm dân tộc theo:',
    ['Nghĩa rộng (Nation)', 'Nghĩa hẹp (Ethnie)', 'Bộ tộc', 'Bộ lạc'],
    0,
    'Đây là định nghĩa dân tộc theo nghĩa rộng (Nation).',
  ),
  mc(
    'CHƯƠNG I',
    'Dân tộc Kinh, dân tộc Thái là ví dụ của dân tộc theo:',
    ['Nghĩa rộng (Nation)', 'Nghĩa hẹp (Ethnie)', 'Quốc gia đa dân tộc', 'Bộ tộc'],
    1,
    'Kinh, Thái là các tộc người - dân tộc theo nghĩa hẹp (Ethnie).',
  ),
  mc(
    'CHƯƠNG I',
    'Đặc trưng nào dưới đây chỉ có trong nghĩa rộng, không có trong nghĩa hẹp?',
    ['Ý thức tự giác tộc người', 'Cộng đồng về văn hóa', 'Có chung một nhà nước', 'Cộng đồng về ngôn ngữ'],
    2,
    'Chỉ dân tộc theo nghĩa rộng mới có đặc trưng chung một nhà nước.',
  ),
  mc(
    'CHƯƠNG I',
    'Số đặc trưng cơ bản của dân tộc theo nghĩa rộng và theo nghĩa hẹp lần lượt là:',
    ['5 và 3', '3 và 5', '5 và 5', '4 và 3'],
    0,
    'Nghĩa rộng có 5 đặc trưng; nghĩa hẹp có 3 đặc trưng.',
  ),
  mc(
    'CHƯƠNG II',
    'Xu hướng cộng đồng dân cư muốn tách ra để hình thành cộng đồng dân tộc độc lập có nguyên nhân là:',
    [
      'Sự thức tỉnh về ý thức dân tộc',
      'Sự phát triển của lực lượng sản xuất và khoa học công nghệ',
      'Nhu cầu xóa bỏ hàng rào ngăn cách giữa các dân tộc',
      'Quá trình hội nhập trong xã hội tư bản',
    ],
    0,
    'Nguyên nhân là sự thức tỉnh về ý thức dân tộc.',
  ),
  mc(
    'CHƯƠNG II',
    'Xu hướng các dân tộc liên hiệp lại với nhau xuất hiện do:',
    [
      'Sự thức tỉnh về ý thức dân tộc',
      'Sự phát triển của lực lượng sản xuất, khoa học công nghệ, hội nhập, xuất hiện nhu cầu xóa bỏ hàng rào ngăn cách giữa các dân tộc',
      'Phong trào đấu tranh giải phóng dân tộc',
      'Sự thoát khỏi áp bức bóc lột của thực dân, đế quốc',
    ],
    1,
    'Đó là do sự phát triển của lực lượng sản xuất, khoa học công nghệ và nhu cầu hội nhập.',
  ),
  mc(
    'CHƯƠNG II',
    'Trong phạm vi một quốc gia, xu hướng thứ hai của quan hệ dân tộc biểu hiện là:',
    [
      'Nỗ lực của từng tộc người đi đến tự do, bình đẳng, phồn vinh của dân tộc mình',
      'Phong trào đấu tranh giải phóng dân tộc, giành độc lập',
      'Các dân tộc hợp tác hình thành liên minh khu vực',
      'Xuất hiện những động lực thúc đẩy các dân tộc xích lại gần nhau trên mọi lĩnh vực',
    ],
    3,
    'Đó là biểu hiện của xu hướng liên hiệp, xích lại gần nhau.',
  ),
  mc(
    'CHƯƠNG II',
    'Ngày nay, trong phạm vi quốc tế, xu hướng thứ hai biểu hiện là:',
    [
      'Phong trào đấu tranh giải phóng dân tộc, chống chủ nghĩa đế quốc',
      'Nỗ lực của từng tộc người đi đến tự do, bình đẳng',
      'Các dân tộc hợp tác với nhau, hình thành liên minh dân tộc ở phạm vi khu vực hoặc toàn cầu',
      'Giành độc lập dân tộc, chống chính sách đô hộ dưới mọi hình thức',
    ],
    2,
    'Trong phạm vi quốc tế, xu hướng liên hiệp tạo ra các liên minh khu vực hoặc toàn cầu.',
  ),
  mc(
    'CƯƠNG LĨNH',
    'Nội dung nào KHÔNG thuộc Cương lĩnh dân tộc của Lênin?',
    [
      'Các dân tộc hoàn toàn bình đẳng',
      'Các dân tộc được quyền tự quyết',
      'Liên hiệp công nhân tất cả các dân tộc',
      'Các dân tộc lớn được ưu tiên phát triển trước',
    ],
    3,
    'Cương lĩnh gồm: bình đẳng, tự quyết, liên hiệp công nhân các dân tộc.',
  ),
  mc(
    'CƯƠNG LĨNH',
    'Nội dung nào thuộc quyền tự quyết của các dân tộc?',
    [
      'Tự quyết việc chia tách hoặc liên hiệp với dân tộc khác',
      'Chỉ có quyền tách ra thành quốc gia độc lập',
      'Được can thiệp vào công việc nội bộ của dân tộc khác',
      'Áp đặt con đường phát triển cho dân tộc nhỏ hơn',
    ],
    0,
    'Tự quyết gồm cả việc chia tách hoặc liên hiệp với dân tộc khác.',
  ),
  mc(
    'CƯƠNG LĨNH',
    '“Liên hiệp công nhân tất cả các dân tộc” là:',
    [
      'Quyền chia tách của các dân tộc',
      'Mục đích đấu tranh của giai cấp công nhân thế giới',
      'Biện pháp giúp dân tộc lớn đứng đầu các dân tộc khác',
      'Nghĩa vụ riêng của dân tộc thiểu số',
    ],
    1,
    'Đây là mục đích đấu tranh của giai cấp công nhân thế giới.',
  ),
  essay(
    'TỰ LUẬN · C1',
    'Phân biệt dân tộc theo nghĩa rộng và nghĩa hẹp.',
    'Nghĩa rộng gắn với quốc gia - 5 đặc trưng; nghĩa hẹp gắn với tộc người - 3 đặc trưng.',
    'Nghĩa rộng (Nation): cộng đồng người ổn định làm thành nhân dân một nước; có lãnh thổ riêng, nền kinh tế thống nhất, ngôn ngữ chung, ý thức thống nhất; gắn bó bởi lợi ích chính trị, kinh tế, truyền thống văn hóa và đấu tranh chung. 5 đặc trưng: lãnh thổ ổn định; phương thức sinh hoạt kinh tế; ngôn ngữ giao tiếp; văn hóa - tâm lý; một nhà nước. Ví dụ: Việt Nam, Nhật Bản.\nNghĩa hẹp (Ethnie): cộng đồng tộc người hình thành trong lịch sử, liên hệ chặt chẽ, có ý thức tự giác tộc người, ngôn ngữ và văn hóa. 3 đặc trưng: ngôn ngữ; văn hóa; ý thức tự giác tộc người. Ví dụ: Kinh, Thái.',
  ),
  essay(
    'TỰ LUẬN · C2',
    'Trình bày hai xu hướng khách quan của sự phát triển quan hệ dân tộc và biểu hiện ngày nay.',
    'Hai xu hướng: tách ra - liên hiệp; biểu hiện trong quốc gia và quốc tế.',
    'Xu hướng 1 - tách ra: hình thành cộng đồng dân tộc độc lập; nguyên nhân là sự thức tỉnh ý thức dân tộc; biểu hiện: đấu tranh giải phóng dân tộc, thoát áp bức thực dân, đế quốc.\nXu hướng 2 - liên hiệp: do phát triển lực lượng sản xuất, khoa học - công nghệ, hội nhập, nhu cầu xóa bỏ hàng rào ngăn cách; biểu hiện: hợp tác, liên minh khu vực/toàn cầu.\nTrong quốc gia: mỗi tộc người nỗ lực tự do, bình đẳng, phồn vinh; đồng thời xích lại gần nhau.\nQuốc tế: giải phóng dân tộc, chống đô hộ; đồng thời hợp tác, liên minh.',
  ),
  essay(
    'TỰ LUẬN · C3',
    'Nêu ba nội dung của Cương lĩnh dân tộc của chủ nghĩa Mác - Lênin.',
    'Bình đẳng - tự quyết - liên hiệp công nhân tất cả các dân tộc.',
    'Các dân tộc hoàn toàn bình đẳng: quyền và nghĩa vụ ngang nhau; bình đẳng pháp lý trong quốc gia; không dân tộc nào áp bức dân tộc khác; chống phân biệt chủng tộc, dân tộc cực đoan.\nCác dân tộc được quyền tự quyết: tự quyết định con đường phát triển; chia tách hoặc liên hiệp; chống can thiệp vào công việc nội bộ.\nLiên hiệp công nhân tất cả các dân tộc: mục đích đấu tranh của giai cấp công nhân thế giới; tự nguyện, bình đẳng, tôn trọng quyền tự quyết và lợi ích các dân tộc.',
  ),
];

const POOL_TWO: Question[] = [
  mc(
    'CHƯƠNG III',
    'Trong quan hệ quốc tế, quyền bình đẳng giữa các dân tộc có nghĩa là:',
    [
      'Mỗi dân tộc chỉ có quyền, không có nghĩa vụ',
      'Quyền bình đẳng chỉ được ghi trên giấy tờ',
      'Không một dân tộc nào có quyền áp bức, bóc lột dân tộc khác',
      'Dân tộc lớn có quyền quyết định thay dân tộc nhỏ',
    ],
    2,
    'Bình đẳng quốc tế: không dân tộc nào được áp bức dân tộc khác.',
  ),
  mc(
    'CHƯƠNG III',
    'Điều nào KHÔNG phải đặc điểm dân tộc ở Việt Nam?',
    [
      'Có sự chênh lệch về số dân giữa các tộc người',
      'Các dân tộc cư trú xen kẽ nhau',
      'Có trình độ phát triển không đều',
      'Các dân tộc cư trú tách biệt hoàn toàn theo từng vùng',
    ],
    3,
    'Các dân tộc Việt Nam cư trú xen kẽ, không tách biệt hoàn toàn.',
  ),
  mc(
    'CHƯƠNG III',
    'Các dân tộc thiểu số ở Việt Nam phân bố chủ yếu ở:',
    ['Địa bàn có vị trí chiến lược quan trọng', 'Các đô thị lớn', 'Đồng bằng ven biển', 'Các khu công nghiệp tập trung'],
    0,
    'Nhiều dân tộc thiểu số sống ở vùng biên giới, địa bàn chiến lược.',
  ),
  mc(
    'CHƯƠNG III',
    'Việt Nam là quốc gia đa dân tộc với bao nhiêu dân tộc anh em?',
    ['45', '54', '63', '64'],
    1,
    'Việt Nam có 54 dân tộc anh em.',
  ),
  mc(
    'CHƯƠNG III',
    'Truyền thống nào của các dân tộc Việt Nam được nêu trong bài?',
    [
      'Chỉ giữ bản sắc riêng, ít giao lưu',
      'Tự phát triển độc lập từng vùng',
      'Đoàn kết, gắn bó lâu đời trong cộng đồng dân tộc - quốc gia thống nhất',
      'Mỗi dân tộc một hệ thống chính trị riêng',
    ],
    2,
    'Đoàn kết, gắn bó lâu đời là truyền thống quý báu của các dân tộc.',
  ),
  mc(
    'CHƯƠNG III',
    'Theo quan điểm của Đảng, vấn đề dân tộc và đoàn kết dân tộc là:',
    [
      'Vấn đề chỉ đặt ra trong chiến tranh',
      'Vấn đề tạm thời của vùng miền núi',
      'Vấn đề chỉ của các dân tộc thiểu số',
      'Vấn đề chiến lược cơ bản, lâu dài, đồng thời là vấn đề cấp bách hiện nay của cách mạng Việt Nam',
    ],
    3,
    'Đảng xác định đây là vấn đề chiến lược, lâu dài và cấp bách.',
  ),
  mc(
    'CHÍNH SÁCH',
    'Khi ưu tiên đầu tư phát triển kinh tế - xã hội vùng dân tộc và miền núi, trước hết cần tập trung vào:',
    [
      'Giao thông và cơ sở hạ tầng, xóa đói giảm nghèo',
      'Phát triển công nghiệp nặng',
      'Mở rộng đô thị hóa',
      'Phát triển thương mại xuất khẩu',
    ],
    0,
    'Ưu tiên giao thông, hạ tầng và xóa đói giảm nghèo trước hết.',
  ),
  mc(
    'CHÍNH SÁCH',
    '“Thông qua các chương trình, dự án phát triển kinh tế vùng dân tộc thiểu số, thúc đẩy kinh tế thị trường định hướng xã hội chủ nghĩa” thuộc chính sách về:',
    ['Chính trị', 'Kinh tế', 'Văn hóa', 'An ninh - quốc phòng'],
    1,
    'Đây là nội dung thuộc chính sách kinh tế.',
  ),
  mc(
    'CHÍNH SÁCH',
    'Nội dung nào thuộc chính sách về an ninh - quốc phòng?',
    [
      'Nâng cao nhận thức của đồng bào về tầm quan trọng của đoàn kết dân tộc',
      'Mở rộng giao lưu văn hóa với quốc gia, khu vực, thế giới',
      'Tăng cường quan hệ quân dân, tạo thế trận quốc phòng toàn dân vùng đồng bào dân tộc sinh sống',
      'Thực hiện chính sách xã hội, đảm bảo an sinh xã hội',
    ],
    2,
    'Tăng cường quan hệ quân dân, xây dựng thế trận quốc phòng toàn dân.',
  ),
  mc(
    'CHÍNH SÁCH',
    'Chính sách xã hội thực hiện bình đẳng, công bằng thông qua phát triển kinh tế - xã hội, xóa đói giảm nghèo và các lĩnh vực nào?',
    ['Dân số, y tế, giáo dục', 'Thương mại, tài chính, ngân hàng', 'Công nghiệp, nông nghiệp, dịch vụ', 'Giao thông, bưu chính, viễn thông'],
    0,
    'Dân số, y tế, giáo dục là các lĩnh vực của chính sách xã hội.',
  ),
  essay(
    'TỰ LUẬN · C4',
    'Nêu các đặc điểm dân tộc ở Việt Nam. Đặc điểm nào liên quan trực tiếp đến quốc phòng, an ninh?',
    'Sáu đặc điểm; đặc điểm thứ ba gắn với vị trí chiến lược.',
    'Sáu đặc điểm: chênh lệch số dân; cư trú xen kẽ; dân tộc thiểu số phân bố ở địa bàn chiến lược; trình độ phát triển không đều; truyền thống đoàn kết gắn bó; mỗi dân tộc có bản sắc văn hóa riêng.\nLiên quan trực tiếp đến quốc phòng - an ninh: đặc điểm thứ ba. Vùng dân tộc thiểu số và miền núi giữ vị trí chiến lược về quốc phòng, an ninh, tài nguyên, môi trường; các thế lực thù địch thường lợi dụng vấn đề dân tộc để chống phá, chia rẽ.',
  ),
  essay(
    'TỰ LUẬN · C5',
    'Trình bày chính sách dân tộc của Đảng và Nhà nước Việt Nam trên các lĩnh vực.',
    'Chính trị - kinh tế - xã hội - văn hóa - an ninh quốc phòng.',
    'Chính trị: bình đẳng, đoàn kết, tôn trọng, giúp nhau cùng phát triển; nâng cao nhận thức về đoàn kết dân tộc.\nKinh tế: phát triển kinh tế - xã hội miền núi, vùng đồng bào dân tộc; phát huy tiềm năng, thu hẹp khoảng cách; thúc đẩy kinh tế thị trường định hướng XHCN.\nXã hội: an sinh xã hội; bình đẳng, công bằng; xóa đói giảm nghèo; dân số, y tế, giáo dục.\nVăn hóa: giữ gìn, phát huy giá trị văn hóa truyền thống; xây dựng đời sống văn hóa; giao lưu văn hóa; chống diễn biến hòa bình trên mặt trận văn hóa - tư tưởng.\nAn ninh - quốc phòng: ổn định chính trị, an ninh, trật tự; tăng cường quan hệ quân dân, thế trận quốc phòng toàn dân.',
  ),
  essay(
    'TỰ LUẬN · C6',
    'Quan điểm của Đảng về vấn đề dân tộc có những nội dung nào? Vì sao phải ưu tiên đầu tư cho vùng dân tộc và miền núi?',
    'Năm quan điểm; ưu tiên vì địa bàn chiến lược và chênh lệch phát triển.',
    'Năm quan điểm: (1) vấn đề dân tộc và đoàn kết dân tộc là chiến lược cơ bản, lâu dài, cấp bách; (2) bình đẳng, đoàn kết, tương trợ, cùng CNH - HĐH, xây dựng và bảo vệ Tổ quốc; (3) phát triển toàn diện chính trị, kinh tế, văn hóa, xã hội, an ninh - quốc phòng; (4) ưu tiên đầu tư kinh tế - xã hội, trước hết giao thông, hạ tầng, xóa đói giảm nghèo; (5) công tác dân tộc là nhiệm vụ của toàn Đảng, toàn dân, toàn quân, các cấp, các ngành.\nVì sao ưu tiên: vùng dân tộc thiểu số có vị trí chiến lược, trình độ phát triển không đều; cần thu hẹp khoảng cách, ổn định chính trị - xã hội.',
  ),
  essay(
    'LIÊN HỆ',
    'Là sinh viên, bạn có thể làm gì để giữ gìn khối đại đoàn kết dân tộc, bảo tồn bản sắc văn hóa và chống thông tin xuyên tạc trên không gian mạng?',
    'Nhận thức đúng, không chia sẻ thông tin xuyên tạc, tôn trọng bản sắc.',
    'Nhận thức đúng quan điểm Mác - Lênin và chính sách dân tộc của Đảng, Nhà nước.\nKhông chia sẻ, không tin thông tin kích động chia rẽ, xuyên tạc.\nTôn trọng, giữ gìn và giới thiệu bản sắc văn hóa các dân tộc; tham gia hoạt động đoàn kết, giao lưu văn hóa.',
  ),
];

const POOLS: Question[][] = [POOL_ONE, POOL_TWO];

const STAGE_META = [
  {
    label: 'Ảnh 1',
    zone: 'KHU RỪNG KÝ ỨC',
    answer: '54 DÂN TỘC',
    answer2: 'VIỆT NAM',
    subtitle: 'Mỗi dân tộc một bản sắc cùng chung bức tranh.',
    image: posterImg,
    imgW: 1080,
    imgH: 654,
    variant: 'forest' as const,
  },
  {
    label: 'Ảnh 2',
    zone: 'ĐỈNH NÚI KÝ ỨC',
    answer: 'BẢN ĐỒ PHÂN BỐ',
    answer2: '54 DÂN TỘC',
    subtitle: '54 dân tộc - 8 vùng miền - một Việt Nam thống nhất.',
    image: mapImg,
    imgW: 680,
    imgH: 718,
    variant: 'ridge' as const,
  },
];

const layoutFor = (stage: 1 | 2) =>
  stage === 1
    ? { cols: 4, rows: 2, w: 250, h: 300, gap: 24, top: 178 }
    : { cols: 2, rows: 4, w: 280, h: 148, gap: 20, top: 178 };

const fragmentStyle = (stage: 1 | 2, index: number): CSSProperties => {
  const { cols, rows } = layoutFor(stage);
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    backgroundImage: `url(${STAGE_META[stage - 1].image})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${cols === 1 ? 0 : (col / (cols - 1)) * 100}% ${
      rows === 1 ? 0 : (row / (rows - 1)) * 100
    }%`,
    backgroundRepeat: 'no-repeat',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Game store
// ─────────────────────────────────────────────────────────────────────────────

type Player = {
  id: string;
  name: string;
  /** Points earned in each profile (index 0 = profile 1, index 1 = profile 2). */
  score: [number, number];
};

type Award = {
  playerId: string;
  stage: 1 | 2;
  amount: number;
  source: 'question' | 'guess';
};

type GameStore = {
  opened: boolean[][];
  used: number[][];
  players: Player[];
  turnId: string | null;
  awards: Award[];
  guessed: boolean[];
  finished: boolean[];
  stage: 1 | 2;
  runId: number;
};

const STORAGE_KEY = 'osd-minigame-quest-v3';
const ROSTER_KEY = 'osd-minigame-roster-v1';
const emptyRow = () => Array.from({ length: 8 }, () => false);

const sanitizeName = (value: string) => value.replace(/\s+/g, ' ').trim();

const createPlayerId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const loadRoster = (): { id: string; name: string }[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(ROSTER_KEY) ?? 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    return raw.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const { id, name } = entry as { id?: unknown; name?: unknown };
      if (typeof id !== 'string' || typeof name !== 'string') return [];
      const clean = sanitizeName(name);
      if (!clean || seen.has(id)) return [];
      seen.add(id);
      return [{ id, name: clean }];
    });
  } catch {
    return [];
  }
};

const saveRoster = (players: Player[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      ROSTER_KEY,
      JSON.stringify(players.map(({ id, name }) => ({ id, name }))),
    );
  } catch {
    // Roster persistence is best-effort; play continues without it.
  }
};

const playerTotal = (player: Player) => player.score[0] + player.score[1];

const playerValue = (player: Player, stage?: 1 | 2) =>
  stage ? player.score[stage - 1] : playerTotal(player);

const rankPlayers = (players: Player[], stage?: 1 | 2) =>
  [...players].sort(
    (a, b) =>
      playerValue(b, stage) - playerValue(a, stage) ||
      playerTotal(b) - playerTotal(a) ||
      a.name.localeCompare(b.name, 'vi'),
  );

const appendPlayers = (
  prev: GameStore,
  values: string[],
): { players: Player[]; firstId: string | null } => {
  const players = [...prev.players];
  let firstId: string | null = null;
  for (const value of values) {
    const name = sanitizeName(value);
    if (!name) continue;
    const existing = players.find(
      (player) => player.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'),
    );
    if (existing) {
      firstId ??= existing.id;
      continue;
    }
    const player: Player = { id: createPlayerId(), name, score: [0, 0] };
    players.push(player);
    firstId ??= player.id;
  }
  saveRoster(players);
  return { players, firstId };
};

const resetPlayerScores = (players: Player[]) =>
  players.map((player) => ({ ...player, score: [0, 0] as [number, number] }));

const defaultStore = (players: Player[] = []): GameStore => ({
  opened: [emptyRow(), emptyRow()],
  used: [[], []],
  players: resetPlayerScores(players),
  turnId: null,
  awards: [],
  guessed: [false, false],
  finished: [false, false],
  stage: 1,
  runId: 0,
});

const readScorePair = (value: unknown): [number, number] => {
  const source = Array.isArray(value) ? value : [];
  return [0, 1].map((index) => {
    const n = source[index];
    return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0;
  }) as [number, number];
};

const readPlayers = (value: unknown): Player[] | null => {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const { id, name, score } = entry as { id?: unknown; name?: unknown; score?: unknown };
    if (typeof id !== 'string' || typeof name !== 'string') return [];
    const clean = sanitizeName(name);
    if (!clean || seen.has(id)) return [];
    seen.add(id);
    return [{ id, name: clean, score: readScorePair(score) }];
  });
};

const loadStore = (): GameStore => {
  const base = defaultStore();
  if (typeof window === 'undefined') return base;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<GameStore> | null;
    if (!raw) {
      return defaultStore(
        loadRoster().map((entry) => ({ ...entry, score: [0, 0] as [number, number] })),
      );
    }
    const parsedPlayers = readPlayers((raw as { players?: unknown }).players);
    const players =
      parsedPlayers ??
      loadRoster().map((entry) => ({ ...entry, score: [0, 0] as [number, number] }));
    const playerIds = new Set(players.map((player) => player.id));
    const awards = Array.isArray(raw.awards)
      ? raw.awards.filter((award): award is Award => {
          if (!award || typeof award !== 'object') return false;
          const { playerId, stage, amount, source } = award as Partial<Award>;
          return (
            typeof playerId === 'string' &&
            playerIds.has(playerId) &&
            (stage === 1 || stage === 2) &&
            typeof amount === 'number' &&
            amount > 0 &&
            (source === 'question' || source === 'guess')
          );
        })
      : [];
    return {
      opened: [0, 1].map((r) => Array.from({ length: 8 }, (_, i) => Boolean(raw.opened?.[r]?.[i]))),
      used: [0, 1].map((r) => {
        const row = raw.used?.[r];
        return Array.from(
          new Set(
            (Array.isArray(row) ? row : []).filter(
              (n): n is number =>
                typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < POOLS[r].length,
            ),
          ),
        );
      }),
      players,
      turnId: typeof raw.turnId === 'string' && playerIds.has(raw.turnId) ? raw.turnId : null,
      awards,
      guessed: [Boolean(raw.guessed?.[0]), Boolean(raw.guessed?.[1])],
      finished: [Boolean(raw.finished?.[0]), Boolean(raw.finished?.[1])],
      stage: raw.stage === 2 ? 2 : 1,
      runId: typeof raw.runId === 'number' ? raw.runId : 0,
    };
  } catch {
    return base;
  }
};

const saveStore = (state: GameStore) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The game still works within one page if sessionStorage is unavailable.
  }
};

const listeners = new Set<() => void>();
const broadcast = () => listeners.forEach((fn) => fn());

const useGameStore = () => {
  const [state, setState] = useState<GameStore>(() => loadStore());

  useEffect(() => {
    const sync = () => setState(loadStore());
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const update = useCallback(
    (patch: Partial<GameStore> | ((prev: GameStore) => Partial<GameStore>)) => {
      const prev = loadStore();
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      saveStore(next);
      broadcast();
      setState(next);
    },
    [],
  );

  return [state, update] as const;
};

const resetGame = () => {
  const current = loadStore();
  saveStore({ ...defaultStore(current.players), runId: current.runId + 1 });
  broadcast();
  goPage(PAGE.cover);
};

const startGame = () => {
  const current = loadStore();
  saveStore({ ...defaultStore(current.players), runId: current.runId + 1 });
  broadcast();
  goPage(PAGE.game);
};

const withOpened = (opened: boolean[][], stageIdx: number, tile: number) =>
  opened.map((row, r) => (r === stageIdx ? row.map((value, i) => (i === tile ? true : value)) : row));

const bumpPlayer = (player: Player, stage: 1 | 2, amount: number): Player => ({
  ...player,
  score: [
    stage === 1 ? Math.max(0, player.score[0] + amount) : player.score[0],
    stage === 2 ? Math.max(0, player.score[1] + amount) : player.score[1],
  ],
});

const answerLabel = (q: MCQuestion) => `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;

// ─────────────────────────────────────────────────────────────────────────────
// Pixel art
// ─────────────────────────────────────────────────────────────────────────────

type Sprite = { rows: string[] };

const PAL: Record<string, string> = {
  k: C.dark,
  0: C.navy,
  1: C.plum,
  2: C.red,
  3: C.orange,
  4: C.yellow,
  5: C.lime,
  6: C.green,
  7: C.teal,
  8: C.deep,
  9: C.blue,
  a: C.sky,
  b: C.cyan,
  c: C.white,
  d: C.silver,
  e: C.slate,
  f: C.ink,
  g: C.yellow,
  G: '#B8862A',
  l: C.white,
  s: '#FFCCAA',
  h: C.red,
  w: '#6B4328',
  W: C.orange,
  p: C.teal,
  P: C.green,
  r: C.red,
  m: C.cyan,
  y: C.yellow,
};

const CHEST_BODY_CLOSED: Sprite = {
  rows: [
    '.kkkkkkkkkkkkkk.',
    '.kWWwwwwwwwwWWk.',
    '.kWWwwwwwwwwWWk.',
    '.kWwwkkkkkkwwWk.',
    '.kWwwkggggkwwWk.',
    '.kWwwkkkkkkwwWk.',
    '.kWWwwwwwwwwWWk.',
    '.kWWwwwwwwwwWWk.',
    '.kkkkkkkkkkkkkk.',
    '..kk........kk..',
  ],
};

const CHEST_BODY_OPEN: Sprite = {
  rows: [
    '.kWWWWWWWWWWWWk.',
    '.kWggG4ggG4ggWk.',
    '.kWG4ggG4ggGgWk.',
    '.kWwwkkkkkkwwWk.',
    '.kWwwkggggkwwWk.',
    '.kWwwkkkkkkwwWk.',
    '.kWWwwwwwwwwWWk.',
    '.kWWwwwwwwwwWWk.',
    '.kkkkkkkkkkkkkk.',
    '..kk........kk..',
  ],
};

const CHEST_LID: Sprite = {
  rows: [
    '....kkkkkkkk....',
    '..kkggggggggkk..',
    '.kGGgGGGGGGgGGk.',
  ],
};

const CHEST_LID_OPEN: Sprite = {
  rows: [
    '..kkkkkkkkkkkk..',
    '.kggggggggggggk.',
    '.kwwwwwwwwwwwwk.',
  ],
};

const HERO: Sprite = {
  rows: [
    '......00.............',
    '.....0220............',
    '....022220...........',
    '...02222220..........',
    '...02888880..........',
    '...02848840..........',
    '...02888880..........',
    '...02222220..........',
    '..0222222220.........',
    '..0222222222ddeeee...',
    '..0221112220.....e...',
    '.02221112220....eeeee',
    '.02211111220....e444e',
    '.022111112220...e434e',
    '0222111112220...e3c3e',
    '0221111111220...e434e',
    '02222222222220..e444e',
    '.000ee00ee000...eeeee',
    '...0ee0.0ee0.....eee.',
    '...000..000..........',
  ],
};

const MIMIC: Sprite = {
  rows: [
    '..kkkkkkkkkkkk..',
    '.kWWWWWWWWWWWWk.',
    '.kWkkWWWWkkWWWk.',
    '.kWkkWWWWkkWWWk.',
    '.kWWWWWWWWWWWWk.',
    '.kkkkkkkkkkkkkk.',
    '.kWggggggggggWk.',
    '.kWgkckckckcgWk.',
    '.kWggggggggggWk.',
    '.kkkkkkkkkkkkkk.',
    '..kk........kk..',
  ],
};

const SLIME: Sprite = {
  rows: [
    '....0000....',
    '..00566600..',
    '.0656666660.',
    '.0566666660.',
    '0666k666k660',
    '066666666660',
    '067666666760',
    '.0777777770.',
    '..00000000..',
  ],
};

const SKULL: Sprite = {
  rows: [
    '..cccc..',
    '.cccccc.',
    'c00cc00c',
    'c00cc00c',
    'ccc00ccc',
    '.cccccc.',
    '.c0c0c0.',
    '..dddd..',
  ],
};

const TROPHY: Sprite = {
  rows: [
    '.44444444.',
    '4.c44443.4',
    '4.c44443.4',
    '.4c444434.',
    '..444443..',
    '...4443...',
    '....43....',
    '....43....',
    '..444443..',
    '..333333..',
  ],
};

const HEART: Sprite = {
  rows: [
    '.22222.',
    '2222222',
    '2c222c2',
    '.22222.',
    '..222..',
    '...2...',
  ],
};

const BROKEN_HEART: Sprite = {
  rows: [
    '.222.222.',
    '222222222',
    '2c22222c2',
    '.222.222.',
    '..22.22..',
    '...2.2...',
    '....2....',
  ],
};

const LANTERN: Sprite = {
  rows: [
    '...e...',
    '..e.e..',
    '.eeeee.',
    '.e444e.',
    '.e434e.',
    '.e3c3e.',
    '.e434e.',
    '.e444e.',
    '.eeeee.',
    '..eee..',
  ],
};

const GAMEPAD: Sprite = {
  rows: [
    '...eeeeee...',
    '..e444444e..',
    '.eeeeeeeeee.',
    'eccce22eccee',
    'eecce22eccee',
    '.eeeeeeeeee.',
    '..ee....ee..',
  ],
};

const FLAME: Sprite = {
  rows: [
    '...kk...',
    '..k44k..',
    '.k4444k.',
    '.k4444k.',
    'k444443k',
    'k4444443',
    'k44ccc43',
    'k444c443',
    '.k44443.',
    '..k333k.',
  ],
};

const CHECK: Sprite = {
  rows: [
    '......5',
    '.....55',
    '5...55.',
    '55.55..',
    '.555...',
    '..5....',
  ],
};

const CROSS: Sprite = {
  rows: [
    'cc...cc',
    '.cc.cc.',
    '..ccc..',
    '..ccc..',
    '.cc.cc.',
    'cc...cc',
  ],
};

const ARROW_RIGHT: Sprite = {
  rows: [
    '......c',
    '.....cc',
    '....ccc',
    'ccccccc',
    '....ccc',
    '.....cc',
    '......c',
  ],
};

const MOON: Sprite = {
  rows: [
    '...kkkkk...',
    '..klllllk..',
    '.klllllllk.',
    '.klllllllk.',
    'klllllllllk',
    'klllllllllk',
    'klllllllllk',
    '.klllllllk.',
    '.klllllllk.',
    '..klllllk..',
    '...kkkkk...',
  ],
};

const PINE: Sprite = {
  rows: [
    '....k....',
    '...kpk...',
    '..kpppk..',
    '.kpppppk.',
    '..kpppk..',
    '.kpppppk.',
    'kpppppppk',
    '.kpppppk.',
    '..kpppk..',
    '.kpppppk.',
    'kpppppppk',
    '....w....',
    '...www...',
  ],
};

const HOURGLASS: Sprite = {
  rows: [
    'kkkkkkkkk',
    'kgggggggk',
    'kGlllllGk',
    '.kGlllGk.',
    '..kGlGk..',
    '...kGk...',
    '...kGk...',
    '..kGlGk..',
    '.kGlllGk.',
    'kGlllllGk',
    'kgggggggk',
    'kkkkkkkkk',
  ],
};

const COIN: Sprite = {
  rows: ['..kkkk..', '.kggggk.', 'kgllllgk', 'kgllllgk', 'kgllllgk', '.kggggk.', '..kkkk..'],
};

const STAR: Sprite = {
  rows: ['...k...', '..kgk..', '.kgggk.', 'kgggggk', '.kgggk.', '..kgk..', '...k...'],
};

const PixelSprite = ({
  sprite,
  scale = 4,
  className,
  style,
  swap,
}: {
  sprite: Sprite;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  swap?: Record<string, string>;
}) => {
  const shadows: string[] = [];
  sprite.rows.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const color = swap?.[ch] ?? PAL[ch];
      if (!color) return;
      shadows.push(`${x * scale}px ${y * scale}px 0 0 ${color}`);
    });
  });
  const w = Math.max(...sprite.rows.map((row) => row.length));
  return (
    <div
      aria-hidden
      className={className}
      style={{
        width: w * scale,
        height: sprite.rows.length * scale,
        position: 'relative',
        flex: '0 0 auto',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: scale,
          height: scale,
          boxShadow: shadows.join(', '),
        }}
      />
    </div>
  );
};

const Chest = ({
  scale = 13,
  className,
  style,
  open = false,
}: {
  scale?: number;
  className?: string;
  style?: CSSProperties;
  open?: boolean;
}) => {
  const w =
    Math.max(
      ...CHEST_LID.rows.map((row) => row.length),
      ...CHEST_BODY_CLOSED.rows.map((row) => row.length),
      ...CHEST_BODY_OPEN.rows.map((row) => row.length),
    ) * scale;
  const bodyTop = CHEST_LID.rows.length * scale;
  const bodyRows = Math.max(CHEST_BODY_CLOSED.rows.length, CHEST_BODY_OPEN.rows.length);
  const h = bodyTop + bodyRows * scale;
  const chestStyle = {
    width: w,
    height: h,
    flex: '0 0 auto',
    '--mg-chest-lift': `${Math.max(2, Math.round(scale * 0.15))}px`,
    ...style,
  } as CSSProperties;
  return (
    <div
      className={`mg-chest${open ? ' mg-chest-force-open' : ''}${className ? ` ${className}` : ''}`}
      style={chestStyle}
    >
      <div className="mg-chest-glow" style={{ inset: -scale * 2 }} />
      <div className="mg-chest-body" style={{ top: bodyTop, width: w, height: bodyRows * scale }}>
        <PixelSprite
          sprite={CHEST_BODY_CLOSED}
          scale={scale}
          className="mg-chest-body-closed"
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
        <PixelSprite
          sprite={CHEST_BODY_OPEN}
          scale={scale}
          className="mg-chest-body-open"
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
      </div>
      <div className="mg-chest-lid" style={{ width: w, height: CHEST_LID.rows.length * scale }}>
        <PixelSprite
          sprite={CHEST_LID}
          scale={scale}
          className="mg-chest-lid-closed"
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
        <PixelSprite
          sprite={CHEST_LID_OPEN}
          scale={scale}
          className="mg-chest-lid-open"
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
      </div>
      <div className="mg-chest-coin" style={{ left: w / 2, top: bodyTop + scale * 0.5 }}>
        <PixelSprite sprite={COIN} scale={Math.max(2, Math.round(scale / 5))} />
      </div>
    </div>
  );
};

const IconText = ({ icon, children, gap = 8 }: { icon: ReactNode; children: ReactNode; gap?: number }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap, lineHeight: 1, verticalAlign: 'middle' }}>
    {icon}
    <span>{children}</span>
  </span>
);

const medalSwap = (rank: number): Record<string, string> | undefined => {
  if (rank === 0) return undefined;
  if (rank === 1) return { 4: C.silver, 3: C.slate, c: C.white };
  return { 4: C.orange, 3: '#8A5A20', c: C.white };
};

const Medal = ({ rank, scale = 2 }: { rank: number; scale?: number }) => (
  <PixelSprite sprite={TROPHY} scale={scale} swap={medalSwap(rank)} />
);

const Hero = ({ style, className }: { style?: CSSProperties; className?: string }) => (
  <PixelSprite sprite={HERO} scale={7} className={className} style={style} />
);

// ─────────────────────────────────────────────────────────────────────────────
// Landscape
// ─────────────────────────────────────────────────────────────────────────────

const ridgePoly = (heights: number[]) => {
  const step = 100 / heights.length;
  const pts: string[] = ['0% 100%'];
  heights.forEach((h, i) => {
    pts.push(`${(i * step).toFixed(2)}% ${h}%`);
    pts.push(`${((i + 1) * step).toFixed(2)}% ${h}%`);
  });
  pts.push('100% 100%');
  return `polygon(${pts.join(', ')})`;
};

const STAR_SHADOW = (() => {
  const out: string[] = [];
  for (let i = 0; i < 52; i += 1) {
    const x = (i * 197 + 43) % 1900;
    const y = (i * 113 + 19) % 520;
    const spread = i % 11 === 0 ? 3 : i % 5 === 0 ? 2 : 1;
    out.push(`${x}px ${y}px 0 ${spread}px ${i % 9 === 0 ? C.yellow : '#FFF3CF'}`);
  }
  return out.join(', ');
})();

const Backdrop = ({
  children,
  dim = 0,
  variant = 'forest',
  moon = true,
  moonTop = 96,
  moonOpacity = 0.8,
}: {
  children: ReactNode;
  dim?: number;
  variant?: 'forest' | 'ridge';
  moon?: boolean;
  moonTop?: number;
  moonOpacity?: number;
}) => {
  const forest = variant === 'forest';
  return (
    <div
      style={{
        ...fill,
        background: forest
          ? `linear-gradient(180deg, ${C.navy} 0%, #1C2144 42%, #29366F 72%, #3B5DC9 100%)`
          : `linear-gradient(180deg, ${C.navy} 0%, #1A1C2C 34%, #29366F 68%, #5D275D 100%)`,
        color: 'var(--osd-text)',
        fontFamily: F.body,
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, boxShadow: STAR_SHADOW, zIndex: 0 }} />
      <div
        className="mg-twinkle"
        style={{ position: 'absolute', left: 24, top: 24, width: 1, height: 1, boxShadow: STAR_SHADOW, opacity: 0.45, zIndex: 0 }}
      />
      {moon && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 160,
              top: moonTop - 34,
              width: 310,
              height: 310,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,205,117,.16) 0%, rgba(255,205,117,0) 70%)',
              zIndex: 0,
            }}
          />
          <PixelSprite
            sprite={MOON}
            scale={12}
            style={{ position: 'absolute', right: 196, top: moonTop, opacity: moonOpacity, zIndex: 0 }}
          />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          left: -40,
          right: -40,
          bottom: 64,
          height: 400,
          background: forest ? C.teal : C.plum,
          clipPath: ridgePoly([58, 52, 62, 48, 56, 44, 60, 50, 64, 46, 58, 52]),
          opacity: 0.35,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -40,
          right: -40,
          bottom: 0,
          height: 300,
          background: forest ? C.deep : C.navy,
          clipPath: ridgePoly([66, 58, 70, 54, 64, 60, 72, 56, 68, 62, 70, 58]),
          opacity: 0.82,
          zIndex: 2,
        }}
      />
      {forest && (
        <>
          <PixelSprite sprite={PINE} scale={6} style={{ position: 'absolute', left: 96, bottom: 88, opacity: 0.85, zIndex: 3 }} />
          <PixelSprite sprite={PINE} scale={5} style={{ position: 'absolute', left: 220, bottom: 90, opacity: 0.65, zIndex: 3 }} />
          <PixelSprite sprite={PINE} scale={7} style={{ position: 'absolute', right: 130, bottom: 86, opacity: 0.7, zIndex: 3 }} />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 84,
          background: `linear-gradient(180deg, ${C.teal} 0 8px, ${C.dark} 8px 100%)`,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 40%, transparent 46%, rgba(14,15,26,.62) 100%)',
        }}
      />
      {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(14,15,26,${dim})`, zIndex: 6 }} />}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Navigation lock - the deck is driven by its own in-slide buttons, so the
// player's keyboard / edge-click / wheel / swipe navigation is muted while
// this slide is being presented. Editing in the dev viewer is untouched.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  ' ',
  'Spacebar',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

const NAV_PASSTHROUGH =
  'a, button, input, textarea, select, label, summary, iframe, video, audio, embed, object, [role="button"], [role="link"], [contenteditable="true"], [data-osd-interactive], [data-osd-chrome]';

const EDGE_NAV_RATIO = 0.3;

// Mirrors @open-slide/core: interaction passthroughs, and the swipe thresholds.
const WHEEL_IGNORE = 'input, textarea, select, [contenteditable="true"], [data-wheel-nav-ignore]';
const SWIPE_MIN_PX = 50;
const SWIPE_MAX_MS = 600;
const SWIPE_FLICK_VELOCITY = 0.4;
const SWIPE_MIN_FLICK_PX = 24;

const isPresenting = () =>
  typeof document !== 'undefined' &&
  !document.querySelector('[data-inspector-root]') &&
  !!document.querySelector('[data-osd-canvas]');

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || target.matches('input, textarea'));

const isChromeTarget = (target: EventTarget | null) =>
  target instanceof Element && !!target.closest('[data-osd-chrome]');

const useLockExternalNavigation = () => {
  const active = useIsActivePage();

  useEffect(() => {
    if (!active || typeof window === 'undefined') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isPresenting() || event.isComposing || event.keyCode === 229) return;
      if (isTypingTarget(event.target) || isChromeTarget(event.target)) return;
      if (!NAV_KEYS.has(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const onClick = (event: MouseEvent) => {
      if (!isPresenting() || event.button !== 0 || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest(NAV_PASSTHROUGH)) return;
      if (window.getSelection()?.toString()) return;
      const ratio = window.innerWidth === 0 ? 0 : event.clientX / window.innerWidth;
      if (ratio < EDGE_NAV_RATIO || ratio > 1 - EDGE_NAV_RATIO) {
        event.stopImmediatePropagation();
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!isPresenting() || event.defaultPrevented || event.ctrlKey) return;
      if (!(event.target instanceof Element) || event.target.closest(WHEEL_IGNORE)) return;
      if (isChromeTarget(event.target)) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    let touchStart: { x: number; y: number; t: number } | null = null;

    const onTouchStart = (event: TouchEvent) => {
      if (!isPresenting() || isChromeTarget(event.target) || event.touches.length !== 1) {
        touchStart = null;
        return;
      }
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY, t: performance.now() };
    };

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart;
      touchStart = null;
      if (!start || !isPresenting() || isChromeTarget(event.target)) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) <= Math.abs(dy)) return;
      const dt = performance.now() - start.t;
      const velocity = Math.abs(dx) / Math.max(dt, 1);
      const committed =
        (Math.abs(dx) >= SWIPE_MIN_PX && dt <= SWIPE_MAX_MS) ||
        (velocity >= SWIPE_FLICK_VELOCITY && Math.abs(dx) >= SWIPE_MIN_FLICK_PX);
      if (committed) event.stopImmediatePropagation();
    };

    const onTouchCancel = () => {
      touchStart = null;
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('click', onClick, true);
    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    window.addEventListener('touchstart', onTouchStart, { capture: true, passive: true });
    window.addEventListener('touchend', onTouchEnd, true);
    window.addEventListener('touchcancel', onTouchCancel, true);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('wheel', onWheel, true);
      window.removeEventListener('touchstart', onTouchStart, true);
      window.removeEventListener('touchend', onTouchEnd, true);
      window.removeEventListener('touchcancel', onTouchCancel, true);
    };
  }, [active]);
};

// ─────────────────────────────────────────────────────────────────────────────
// UI primitives
// ─────────────────────────────────────────────────────────────────────────────

const Screen = ({
  children,
  hud = true,
  interactive = true,
}: {
  children: ReactNode;
  hud?: boolean;
  interactive?: boolean;
}) => {
  useLockExternalNavigation();

  return (
    <div
      data-osd-interactive={interactive ? 'true' : undefined}
      onClick={interactive ? (event) => event.stopPropagation() : undefined}
      style={{
        ...fill,
        background: 'var(--osd-bg)',
        color: 'var(--osd-text)',
        fontFamily: F.body,
      }}
    >
      {children}
      {hud && <Hud />}
      <div className="mg-scan" />
    </div>
  );
};

const Hud = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <>
      <div style={abs(120, 1014, { zIndex: 90, display: 'flex', gap: 16, fontFamily: F.mono, fontSize: 22, color: C.slate, letterSpacing: 1 })}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <PixelSprite sprite={HEART} scale={2} />
          <PixelSprite sprite={HEART} scale={2} />
          <PixelSprite sprite={HEART} scale={2} />
        </span>
        <span>CNXHKH / NHÓM 3 · PIXEL QUEST</span>
      </div>
      <div style={{ position: 'absolute', right: 120, top: 1014, zIndex: 90, fontFamily: F.mono, fontSize: 22, color: C.slate }}>
        STAGE <span style={{ color: C.silver }}>{pad2(current)}/{pad2(total)}</span>
      </div>
    </>
  );
};

const Kicker = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.pixel, fontSize: 14, lineHeight: 1.5, letterSpacing: 1, color: C.yellow, textTransform: 'uppercase' }}>
    <span style={{ background: C.yellow, color: C.navy, padding: '6px 10px' }}>CNXHKH</span>
    <span>{children}</span>
  </div>
);

const PageTitle = ({ children, color = C.white, shadow = C.plum }: { children: ReactNode; color?: string; shadow?: string }) => (
  <h2 style={{ fontFamily: F.display, fontSize: 84, fontWeight: 400, lineHeight: 0.9, letterSpacing: 1, margin: 0, color, textShadow: `6px 6px 0 ${shadow}` }}>
    {children}
  </h2>
);

const PixelBox = ({
  x,
  y,
  w,
  h,
  fill: boxFill = C.deep,
  edge = C.white,
  shade = true,
  children,
  style,
  className,
}: {
  x?: number;
  y?: number;
  w: number;
  h: number;
  fill?: string;
  edge?: string;
  shade?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      ...(x !== undefined && y !== undefined ? abs(x, y) : { position: 'relative' }),
      width: w,
      height: h,
      ...style,
    }}
  >
    {shade && (
      <div style={{ position: 'absolute', left: P, top: P, width: w, height: h, background: 'rgba(0,0,0,.5)', clipPath: notch(P) }} />
    )}
    <div style={{ position: 'absolute', inset: 0, background: edge, clipPath: notch(P) }} />
    <div
      style={{
        position: 'absolute',
        inset: P,
        background: boxFill,
        boxShadow: `inset 0 ${P}px 0 rgba(255,255,255,.08), inset 0 -${P}px 0 rgba(0,0,0,.32)`,
        clipPath: notch(P),
      }}
    />
    <div style={{ position: 'absolute', inset: P * 2, overflow: 'hidden' }}>{children}</div>
  </div>
);

const buttonTones = {
  gold: { bg: C.yellow, fg: C.navy, shadow: '#B8862A' },
  mint: { bg: C.lime, fg: C.navy, shadow: C.green },
  coral: { bg: C.red, fg: C.white, shadow: C.plum },
  ghost: { bg: 'rgba(26,28,44,.94)', fg: C.white, shadow: C.dark },
  dark: { bg: C.deep, fg: C.white, shadow: C.dark },
} as const;

const PixelButton = ({
  children,
  onClick,
  tone = 'gold',
  fontSize = 26,
  style,
  disabled = false,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: keyof typeof buttonTones;
  fontSize?: number;
  style?: CSSProperties;
  disabled?: boolean;
  ariaLabel?: string;
}) => {
  const t = buttonTones[tone];
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="mg-btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: F.mono,
        fontSize,
        letterSpacing: 1,
        lineHeight: 1,
        color: t.fg,
        background: t.bg,
        border: `4px solid ${C.dark}`,
        boxShadow: `inset 0 -6px 0 rgba(0,0,0,.22), 0 6px 0 ${t.shadow}, 0 6px 0 4px ${C.dark}`,
        padding: '14px 24px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const Chip = ({
  children,
  text,
  tone = 'dark',
}: {
  children?: ReactNode;
  text?: string;
  tone?: 'gold' | 'dark' | 'lime';
}) => {
  const t = {
    gold: { bg: C.yellow, fg: C.navy, edge: '#B8862A' },
    dark: { bg: 'rgba(26,28,44,.9)', fg: C.white, edge: C.slate },
    lime: { bg: C.lime, fg: C.navy, edge: C.green },
  }[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: F.mono, fontSize: 22, letterSpacing: 1, color: t.fg, background: t.bg, border: `3px solid ${t.edge}`, boxShadow: `0 0 0 2px ${C.dark}`, padding: '6px 12px', whiteSpace: 'nowrap' }}>
      {children ?? text}
    </span>
  );
};

const Badge = ({
  children,
  label,
  tone = 'dark',
}: {
  children?: ReactNode;
  label?: string;
  tone?: 'gold' | 'dark' | 'lime';
}) => <Chip tone={tone}>{children ?? label}</Chip>;

const TimerBar = ({
  remaining,
  total,
  started,
  locked,
}: {
  remaining: number;
  total: number;
  started: boolean;
  locked: boolean;
}) => {
  const danger = started && remaining <= Math.min(5, Math.ceil(total / 3));
  const pips = Math.min(total, 30);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontFamily: F.mono, fontSize: 36, color: danger ? C.red : C.yellow, minWidth: 62, textAlign: 'right', lineHeight: 1 }}>
        {remaining}s
      </span>
      <div style={{ display: 'flex', gap: total > 20 ? 2 : 4 }}>
        {Array.from({ length: pips }, (_, i) => (
          <div
            key={i}
            style={{
              width: total > 20 ? 6 : 9,
              height: 22,
              background: i < remaining ? (danger ? C.red : C.yellow) : C.dark,
              border: `2px solid ${C.dark}`,
              opacity: locked ? 0.65 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ProgressPips = ({ opened }: { opened: boolean[] }) => {
  const count = opened.filter(Boolean).length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {opened.map((value, index) => (
        <div key={index} style={{ width: 15, height: 22, background: value ? C.yellow : C.dark, border: `3px solid ${C.dark}`, boxShadow: value ? `inset 0 0 0 2px #B8862A` : 'none' }} />
      ))}
      <span style={{ fontFamily: F.mono, fontSize: 28, color: C.white, marginLeft: 6 }}>
        {/* @slide-comment id="c-10aeea26" ts="2026-10-30T09:38:27.257Z" text="eyJub3RlIjoiWMOzYSBwaOG6p24gbsOgeSDEkWkiLCJwYWdlIjoyfQ" */}
        {count}/8</span>
    </div>
  );
};

const Toast = ({ children }: { children: ReactNode }) => (
  <div
    className="mg-pop"
    style={{
      position: 'absolute',
      left: '50%',
      bottom: 118,
      transform: 'translateX(-50%)',
      zIndex: 75,
      background: C.dark,
      color: C.white,
      border: `3px solid ${C.yellow}`,
      boxShadow: `0 0 0 3px ${C.dark}`,
      padding: '10px 24px',
      fontFamily: F.mono,
      fontSize: 25,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Player picker / scoreboard
// ─────────────────────────────────────────────────────────────────────────────

const TurnChip = ({
  player,
  onOpen,
}: {
  player: Player | null;
  onOpen: () => void;
}) => (
  <button
    type="button"
    onClick={onOpen}
    aria-label={player ? `Đổi người trả lời: ${player.name}` : 'Chọn người trả lời'}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 12px',
      background: player ? 'rgba(255,205,117,.12)' : 'rgba(177,62,83,.18)',
      border: `2px solid ${player ? C.yellow : C.red}`,
      color: C.white,
      fontFamily: F.mono,
      fontSize: 19,
      letterSpacing: 1,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ color: player ? C.yellow : C.orange }}>LƯỢT</span>
    <span
      style={{
        maxWidth: 190,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontFamily: F.body,
        fontSize: 22,
        fontWeight: 600,
      }}
    >
      {player ? player.name : 'CHỌN NGƯỜI'}
    </span>
    {player && <span style={{ color: C.lime, fontFamily: F.pixel, fontSize: 16 }}>{playerTotal(player)}Đ</span>}
  </button>
);

const PlayerPicker = ({
  open,
  players,
  title = 'AI TRẢ LỜI CÂU NÀY?',
  subtitle,
  onPick,
  onAdd,
  onClose,
}: {
  open: boolean;
  players: Player[];
  title?: string;
  subtitle: string;
  onPick: (id: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  if (!open) return null;

  const submit = () => {
    const clean = sanitizeName(name);
    if (!clean) return;
    onAdd(clean);
    setName('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 110px',
        background: 'rgba(5,4,12,.95)',
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 1500,
          maxHeight: 860,
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 30px',
          background: C.navy,
          border: `5px solid ${C.dark}`,
          boxShadow: `0 0 0 4px ${C.yellow}, 0 18px 0 rgba(0,0,0,.5)`,
          clipPath: notch(10),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: 30, lineHeight: 1.2, letterSpacing: 1, color: C.yellow }}>
              {title}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 22, color: C.silver, marginTop: 8 }}>
              {subtitle} · Chọn tên có sẵn hoặc nhập tên mới.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chọn người trả lời"
            style={{
              width: 52,
              height: 52,
              flex: '0 0 auto',
              border: `3px solid ${C.slate}`,
              background: C.dark,
              color: C.white,
              fontFamily: F.mono,
              fontSize: 26,
              cursor: 'pointer',
            }}
          >
            <PixelSprite sprite={CROSS} scale={4} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 180,
            maxHeight: 500,
            overflowY: 'auto',
            marginTop: 20,
            paddingRight: 4,
          }}
        >
          {players.length === 0 ? (
            <div
              style={{
                border: `3px dashed ${C.slate}`,
                padding: '34px 24px',
                textAlign: 'center',
                fontFamily: F.mono,
                fontSize: 24,
                color: C.silver,
                lineHeight: 1.5,
              }}
            >
              Chưa có người chơi trong danh sách.
              <br />
              Nhập tên mới ở bên dưới để bắt đầu tính điểm.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className="mg-opt"
                  onClick={() => onPick(player.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: 6,
                    minWidth: 0,
                    minHeight: 78,
                    padding: '10px 14px',
                    background: 'rgba(26,28,44,.94)',
                    border: `3px solid ${C.ink}`,
                    color: C.white,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: F.body,
                      fontSize: 24,
                      fontWeight: 600,
                    }}
                  >
                    {player.name}
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: 19, color: C.yellow }}>
                    {playerTotal(player)}Đ
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 18 }}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              submit();
            }}
            placeholder="Nhập tên mới…"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '12px 16px',
              fontFamily: F.body,
              fontSize: 24,
              color: C.white,
              background: 'rgba(14,15,26,.94)',
              border: `3px solid ${C.slate}`,
              outline: 'none',
            }}
          />
          <PixelButton
            tone="mint"
            fontSize={22}
            onClick={submit}
            disabled={!sanitizeName(name)}
          >
            + THÊM &amp; CHỌN
          </PixelButton>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 16,
            marginTop: 12,
          }}
        >
          <span style={{ fontFamily: F.mono, fontSize: 19, color: C.slate }}>
            TỔNG {players.length} NGƯỜI
          </span>
        </div>
      </div>
    </div>
  );
};

const StageLeaderboard = ({
  players,
  stage,
  limit = 3,
  emptyLabel = 'Chưa có người chơi.',
}: {
  players: Player[];
  stage?: 1 | 2;
  limit?: number;
  emptyLabel?: string;
}) => {
  const ranked = rankPlayers(players, stage).slice(0, limit);
  if (ranked.length === 0) {
    return (
      <div style={{ fontFamily: F.mono, fontSize: 20, color: C.slate, padding: '10px 0' }}>
        {emptyLabel}
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ranked.map((player, index) => {
        const points = playerValue(player, stage);
        return (
          <div
            key={player.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 14px',
              background: index === 0 ? 'rgba(255,205,117,.1)' : 'rgba(26,28,44,.9)',
              border: `2px solid ${index === 0 ? C.yellow : C.ink}`,
            }}
          >
            <span style={{ width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              {index < 3 ? <Medal rank={index} /> : `${index + 1}.`}
            </span>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: F.body,
                fontSize: 22,
                fontWeight: 600,
                color: C.white,
              }}
            >
              {player.name}
            </span>
            <span
              style={{
                fontFamily: F.pixel,
                fontSize: 17,
                color: points > 0 ? C.yellow : C.slate,
                whiteSpace: 'nowrap',
              }}
            >
              {points}Đ
            </span>
          </div>
        );
      })}
    </div>
  );
};

const PlayersPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [store, update] = useGameStore();
  const [bulk, setBulk] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!open) {
      setBulk('');
      setConfirmClear(false);
    }
  }, [open]);

  if (!open) return null;

  const ranked = rankPlayers(store.players);
  const rankedIds = new Map(ranked.map((player, index) => [player.id, index]));
  const lastAward = store.awards[store.awards.length - 1] ?? null;
  const lastPlayer = lastAward
    ? store.players.find((player) => player.id === lastAward.playerId)
    : null;

  const addNames = () => {
    const values = bulk.split(/[\n,;]+/);
    if (!values.some((value) => sanitizeName(value))) return;
    update((prev) => ({ players: appendPlayers(prev, values).players }));
    setBulk('');
  };

  const removePlayer = (id: string) => {
    update((prev) => {
      const players = prev.players.filter((player) => player.id !== id);
      saveRoster(players);
      return {
        players,
        turnId: prev.turnId === id ? null : prev.turnId,
        awards: prev.awards.filter((award) => award.playerId !== id),
      };
    });
  };

  const clearPlayers = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    update(() => {
      saveRoster([]);
      return { players: [], turnId: null, awards: [] };
    });
    setConfirmClear(false);
  };

  const undoLast = () => {
    update((prev) => {
      const last = prev.awards[prev.awards.length - 1];
      if (!last) return {};
      return {
        awards: prev.awards.slice(0, -1),
        players: prev.players.map((player) =>
          player.id === last.playerId ? bumpPlayer(player, last.stage, -last.amount) : player,
        ),
      };
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
        background: 'rgba(5,4,12,.84)',
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 1520,
          maxHeight: 900,
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 30px',
          background: C.navy,
          border: `5px solid ${C.dark}`,
          boxShadow: `0 0 0 4px ${C.yellow}, 0 18px 0 rgba(0,0,0,.5)`,
          clipPath: notch(10),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: 30, lineHeight: 1.2, letterSpacing: 1, color: C.yellow }}>
              NGƯỜI CHƠI &amp; BẢNG ĐIỂM
            </div>
            <div style={{ fontFamily: F.body, fontSize: 22, color: C.silver, marginTop: 8 }}>
              Chọn người trước mỗi câu. Điểm +10 / +20 cộng trực tiếp cho người đó.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng điểm"
            style={{
              width: 52,
              height: 52,
              flex: '0 0 auto',
              border: `3px solid ${C.slate}`,
              background: C.dark,
              color: C.white,
              fontFamily: F.mono,
              fontSize: 26,
              cursor: 'pointer',
            }}
          >
            <PixelSprite sprite={CROSS} scale={4} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <textarea
            value={bulk}
            onChange={(event) => setBulk(event.target.value)}
            rows={2}
            placeholder="Mỗi dòng một tên hoặc cách nhau dấu phẩy…"
            style={{
              flex: 1,
              minWidth: 0,
              resize: 'none',
              padding: '10px 14px',
              fontFamily: F.body,
              fontSize: 21,
              lineHeight: 1.35,
              color: C.white,
              background: 'rgba(14,15,26,.94)',
              border: `3px solid ${C.slate}`,
              outline: 'none',
            }}
          />
          <PixelButton
            tone="mint"
            fontSize={21}
            onClick={addNames}
            disabled={!bulk.split(/[\n,;]+/).some((value) => sanitizeName(value))}
          >
            + THÊM TÊN
          </PixelButton>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 150px 150px 150px 70px',
            gap: 8,
            marginTop: 18,
            padding: '0 12px 8px',
            fontFamily: F.mono,
            fontSize: 18,
            color: C.slate,
            borderBottom: `2px solid ${C.ink}`,
          }}
        >
          <span>HẠNG</span>
          <span>TÊN</span>
          <span style={{ textAlign: 'right' }}>Ảnh 1</span>
          <span style={{ textAlign: 'right' }}>Ảnh 2</span>
          <span style={{ textAlign: 'right' }}>TỔNG</span>
          <span />
        </div>

        <div style={{ flex: 1, minHeight: 120, maxHeight: 430, overflowY: 'auto', marginTop: 6 }}>
          {ranked.length === 0 ? (
            <div
              style={{
                border: `3px dashed ${C.slate}`,
                padding: '30px 24px',
                textAlign: 'center',
                fontFamily: F.mono,
                fontSize: 23,
                color: C.silver,
              }}
            >
              Chưa có người chơi. Nhập tên ở phía trên.
            </div>
          ) : (
            ranked.map((player) => {
              const rank = (rankedIds.get(player.id) ?? 0) + 1;
              const top = rank <= 3;
              return (
                <div
                  key={player.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr 150px 150px 150px 70px',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 12px',
                    borderBottom: `1px solid ${C.ink}`,
                    background: rank === 1 ? 'rgba(255,205,117,.07)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: F.pixel,
                      fontSize: 15,
                      color: top ? C.yellow : C.slate,
                    }}
                  >
                    {rank <= 3 ? <Medal rank={rank - 1} /> : pad2(rank)}
                  </span>
                  <span
                    style={{
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: F.body,
                      fontSize: 23,
                      fontWeight: 600,
                      color: C.white,
                    }}
                  >
                    {player.name}
                  </span>
                  <span style={{ textAlign: 'right', fontFamily: F.mono, fontSize: 22, color: C.silver }}>
                    {player.score[0]}Đ
                  </span>
                  <span style={{ textAlign: 'right', fontFamily: F.mono, fontSize: 22, color: C.silver }}>
                    {player.score[1]}Đ
                  </span>
                  <span
                    style={{
                      textAlign: 'right',
                      fontFamily: F.pixel,
                      fontSize: 18,
                      color: playerTotal(player) > 0 ? C.yellow : C.slate,
                    }}
                  >
                    {playerTotal(player)}Đ
                  </span>
                  <button
                    type="button"
                    onClick={() => removePlayer(player.id)}
                    aria-label={`Xoá ${player.name}`}
                    style={{
                      justifySelf: 'end',
                      width: 40,
                      height: 36,
                      border: `2px solid ${C.slate}`,
                      background: 'transparent',
                      color: C.orange,
                      fontFamily: F.mono,
                      fontSize: 22,
                      cursor: 'pointer',
                    }}
                  >
                    <PixelSprite sprite={CROSS} scale={2} swap={{ c: C.orange }} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginTop: 18,
            flexWrap: 'wrap',
          }}
        >
          <PixelButton
            tone="ghost"
            fontSize={20}
            onClick={undoLast}
            disabled={!lastAward}
          >
            ↶ HOÀN TÁC
            {lastAward && lastPlayer ? ` +${lastAward.amount} · ${lastPlayer.name}` : ''}
          </PixelButton>
          <PixelButton tone="coral" fontSize={20} onClick={clearPlayers}>
            {confirmClear ? 'CHẮC CHẮN XOÁ HẾT?' : 'XOÁ HẾT NGƯỜI CHƠI'}
          </PixelButton>
          <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 20, color: C.slate }}>
            {store.players.length} NGƯỜI · {store.awards.length} LẦN CỘNG ĐIỂM
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Home board
// ─────────────────────────────────────────────────────────────────────────────

const Tile = ({
  stage,
  index,
  opened,
  flash,
  disabled,
  onSelect,
}: {
  stage: 1 | 2;
  index: number;
  opened: boolean;
  flash: boolean;
  disabled: boolean;
  onSelect: () => void;
}) => {
  const { w, h } = layoutFor(stage);
  const num = pad2(index + 1);
  const wide = stage === 2;
  return (
    <button
      type="button"
      className="mg-tile"
      aria-label={`Mở mảnh ${num}`}
      disabled={disabled || opened}
      onClick={onSelect}
      style={{
        position: 'relative',
        width: w,
        height: h,
        padding: 0,
        border: `4px solid ${opened ? C.yellow : C.dark}`,
        background: opened ? C.dark : C.navy,
        boxShadow: opened
          ? `0 0 0 3px #B8862A, 0 10px 0 rgba(0,0,0,.4), 0 0 24px rgba(255,205,117,.16)`
          : `0 0 0 3px ${C.ink}, 0 10px 0 rgba(0,0,0,.4)`,
        cursor: opened || disabled ? 'default' : 'pointer',
        overflow: 'hidden',
        clipPath: notch(8),
      }}
    >
      {opened ? (
        <div className={flash ? 'mg-tile-open' : undefined} style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 6, ...fragmentStyle(stage, index), backgroundClip: 'padding-box', border: `3px solid ${C.yellow}` }} />
        </div>
      ) : (
        <div className="mg-dither" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: wide ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: wide ? 18 : 0 }}>
          <div style={{ fontFamily: F.mono, fontSize: wide ? 14 : 12, color: C.yellow, opacity: 0.9 }}>MẢNH {num}</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: wide ? 0 : 10 }}>
            <div style={{ position: 'absolute', width: wide ? 120 : 150, height: wide ? 120 : 150, background: 'radial-gradient(circle, rgba(255,205,117,.13), transparent 70%)' }} />
            <Chest scale={wide ? 7 : 13} className="mg-bob" />
          </div>
          <div style={{ fontFamily: F.mono, fontSize: wide ? 20 : 24, color: C.silver, letterSpacing: 1, marginTop: wide ? 0 : 8 }}>
            CHỌN ĐỂ MỞ
          </div>
        </div>
      )}
    </button>
  );
};

const Home = ({
  stage,
  store,
  flashTile,
  onSelect,
  onGuess,
  onOpenPlayers,
}: {
  stage: 1 | 2;
  store: GameStore;
  flashTile: number | null;
  onSelect: (tile: number) => void;
  onGuess: () => void;
  onOpenPlayers: () => void;
}) => {
  const stageIdx = stage - 1;
  const opened = store.opened[stageIdx];
  const used = store.used[stageIdx];
  const count = opened.filter(Boolean).length;
  const remaining = POOLS[stageIdx].length - used.length;
  const layout = layoutFor(stage);
  const gridW = layout.cols * layout.w + (layout.cols - 1) * layout.gap;
  const gridH = layout.rows * layout.h + (layout.rows - 1) * layout.gap;
  const gridLeft = (1920 - gridW) / 2;
  const meta = STAGE_META[stageIdx];
  const disabled = count === 8;

  return (
    <Backdrop variant={meta.variant} dim={0.3} moonOpacity={0.5} moonTop={140}>
      <BackdropHud stage={stage} store={store} onOpenPlayers={onOpenPlayers} />
      <div style={abs(120, 132, { zIndex: 18, display: 'flex', alignItems: 'baseline', gap: 14 })}>
        <span style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: 1, color: C.yellow }}>{meta.label}</span>
        <span style={{ fontFamily: F.display, fontSize: 34, color: C.white, textShadow: `3px 3px 0 ${C.plum}`, lineHeight: 1 }}>{meta.zone}</span>
        <span style={{ fontFamily: F.body, fontSize: 20, color: C.silver }}>Chọn một mảnh để rút câu hỏi ngẫu nhiên.</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: gridLeft,
          top: layout.top,
          width: gridW,
          height: gridH,
          zIndex: 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.cols}, ${layout.w}px)`,
          gridTemplateRows: `repeat(${layout.rows}, ${layout.h}px)`,
          gap: layout.gap,
        }}
      >
        <Tile stage={stage} index={0} opened={opened[0]} flash={flashTile === 0} disabled={disabled} onSelect={() => onSelect(0)} />
        <Tile stage={stage} index={1} opened={opened[1]} flash={flashTile === 1} disabled={disabled} onSelect={() => onSelect(1)} />
        <Tile stage={stage} index={2} opened={opened[2]} flash={flashTile === 2} disabled={disabled} onSelect={() => onSelect(2)} />
        <Tile stage={stage} index={3} opened={opened[3]} flash={flashTile === 3} disabled={disabled} onSelect={() => onSelect(3)} />
        <Tile stage={stage} index={4} opened={opened[4]} flash={flashTile === 4} disabled={disabled} onSelect={() => onSelect(4)} />
        <Tile stage={stage} index={5} opened={opened[5]} flash={flashTile === 5} disabled={disabled} onSelect={() => onSelect(5)} />
        <Tile stage={stage} index={6} opened={opened[6]} flash={flashTile === 6} disabled={disabled} onSelect={() => onSelect(6)} />
        <Tile stage={stage} index={7} opened={opened[7]} flash={flashTile === 7} disabled={disabled} onSelect={() => onSelect(7)} />
      </div>

      <div
        style={abs(150, 842, {
          width: 1620,
          height: 80,
          zIndex: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
          background: 'rgba(14,15,26,.9)',
          border: `3px solid ${C.slate}`,
          boxShadow: `0 0 0 2px ${C.dark}`,
          clipPath: notch(8),
        })}
      >
        {/* @slide-comment id="c-47cdbd93" ts="2026-10-30T09:37:20.648Z" text="eyJub3RlIjoiUGjhuqduIG7DoHkgbsOqbiB0xINuZyBoZWlnaHQgbMOqbiAxIHTDrSDEkeG7gyBwaOG6p24gXCLEkG_DoW4g4bqjbmhcIiDhu58gYsOqbiB0cm9uZyBraMO0bmcgYuG7iyB0csOgbiByYSIsInBhZ2UiOjJ9" */}
        <span className="mg-blink" style={{ display: 'inline-flex', lineHeight: 1 }}><PixelSprite sprite={ARROW_RIGHT} scale={3} swap={{ c: C.yellow }} /></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: 1, color: C.silver, textTransform: 'uppercase' }}>Mảnh đã mở</span>
            <span style={{ fontFamily: F.pixel, fontSize: 16, color: C.yellow }}>{count}/8</span>
          </div>
          <div style={{ width: 2, height: 38, background: C.slate }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: 1, color: C.silver, textTransform: 'uppercase' }}>Câu còn lại</span>
            <span style={{ fontFamily: F.pixel, fontSize: 16, color: C.cyan }}>{remaining}/{POOLS[stageIdx].length}</span>
          </div>
        </div>
        <PixelButton tone="ghost" fontSize={22} onClick={onGuess} ariaLabel="Đoán ảnh bí mật" style={{ marginLeft: 'auto' }}>
          ? ĐOÁN ẢNH
        </PixelButton>
      </div>
    </Backdrop>
  );
};

const BackdropHud = ({
  stage,
  store,
  onOpenPlayers,
}: {
  stage: 1 | 2;
  store: GameStore;
  onOpenPlayers: () => void;
}) => {
  const leader = rankPlayers(store.players)[0];
  const leaderPoints = leader ? playerTotal(leader) : 0;
  return (
  <div
    style={abs(60, 24, {
      width: 1800,
      height: 88,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '0 24px',
      background: 'rgba(14,15,26,.94)',
      border: `4px solid ${C.dark}`,
      boxShadow: `0 0 0 3px ${C.slate}, 0 8px 0 rgba(0,0,0,.35)`,
      clipPath: notch(8),
    })}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ background: C.yellow, color: C.navy, fontFamily: F.pixel, fontSize: 12, padding: '8px 10px' }}>{pad2(stage)}/02</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: F.mono, fontSize: 12, color: C.yellow }}>{STAGE_META[stage - 1].label}</span>
        <span style={{ fontFamily: F.mono, fontSize: 24, color: C.silver, marginTop: 4 }}>{STAGE_META[stage - 1].zone}</span>
      </div>
    </div>
    <div style={{ width: 2, height: 42, background: C.slate }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <span style={{ fontFamily: F.mono, fontSize: 18, color: C.silver }}>DẪN ĐẦU</span>
      {leader && leaderPoints > 0 ? (
        <>
          <span style={{ maxWidth: 210, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F.body, fontSize: 22, fontWeight: 600, color: C.white }}>{leader.name}</span>
          <span style={{ fontFamily: F.pixel, fontSize: 17, color: C.yellow }}>{leaderPoints}Đ</span>
        </>
      ) : (
        <span style={{ fontFamily: F.mono, fontSize: 19, color: C.slate }}>CHƯA CÓ ĐIỂM</span>
      )}
      <PixelButton tone="ghost" fontSize={18} onClick={onOpenPlayers} style={{ padding: '8px 12px' }}>
        <IconText icon={<PixelSprite sprite={TROPHY} scale={2} />}>BẢNG ĐIỂM</IconText>
      </PixelButton>
    </div>
    <div style={{ width: 2, height: 42, background: C.slate }} />
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
      <ProgressPips opened={store.opened[stage - 1]} />
    </div>
  </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Arena
// ─────────────────────────────────────────────────────────────────────────────

type Resolved = {
  correct: boolean;
  chosen: number | null;
  timedOut: boolean;
  essay?: boolean;
};

const Arena = ({
  stage,
  question,
  tile,
  players,
  turnId,
  openedCount,
  remaining,
  onResolve,
  onPickTurn,
  onAddPlayer,
  onOpenPlayers,
  onBack,
}: {
  stage: 1 | 2;
  question: Question;
  tile: number;
  players: Player[];
  turnId: string | null;
  openedCount: number;
  remaining: number;
  onResolve: (correct: boolean) => void;
  onPickTurn: (id: string | null) => void;
  onAddPlayer: (name: string) => void;
  onOpenPlayers: () => void;
  onBack: () => void;
}) => {
  const active = useIsActivePage();
  const total = question.kind === 'essay' ? 30 : 15;
  const [picked, setPicked] = useState<number | null>(null);
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [started, setStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(total);
  const [hintOpen, setHintOpen] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(!turnId);
  const turn = players.find((player) => player.id === turnId) ?? null;

  const resolveMc = useCallback(
    (choice: number | null, timedOut: boolean) => {
      if (resolved) return;
      const correct = !timedOut && choice !== null && choice === question.answer;
      setPicked(choice);
      setResolved({ correct, chosen: choice, timedOut });
      setStarted(true);
      onResolve(correct);
    },
    [onResolve, question.answer, resolved],
  );

  const judgeEssay = useCallback(
    (correct: boolean) => {
      if (resolved) return;
      setResolved({ correct, chosen: null, timedOut: false, essay: true });
      onResolve(correct);
    },
    [onResolve, resolved],
  );

  useEffect(() => {
    if (!active || !started || resolved) return;
    if (remainingTime <= 0) {
      if (question.kind === 'mc') resolveMc(null, true);
      else setTimeUp(true);
      return;
    }
    const timer = setTimeout(() => setRemainingTime((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [active, started, resolved, remainingTime, question.kind, resolveMc]);

  useEffect(() => {
    if (!active || started || resolved || pickerOpen) return;
    setStarted(true);
  }, [active, started, resolved, pickerOpen]);

  const correct = resolved?.correct ?? false;
  const wrong = resolved ? !correct : false;
  const revealed = Boolean(resolved?.correct);
  const status = !resolved
    ? started
      ? 'Đang tính giờ...'
      : 'Chọn người trả lời để bắt đầu tính giờ.'
    : correct
      ? turn
        ? `${question.kind === 'essay' ? 'ĐẠT' : 'CHÍNH XÁC'}! +10 · ${turn.name}`
        : `${question.kind === 'essay' ? 'ĐẠT' : 'CHÍNH XÁC'}! KHÔNG GHI ĐIỂM`
      : resolved.timedOut
        ? 'HẾT GIỜ! KHÔNG CỘNG ĐIỂM'
        : question.kind === 'essay'
          ? 'CHƯA ĐẠT! KHÔNG CỘNG ĐIỂM'
          : 'CHƯA ĐÚNG! KHÔNG CỘNG ĐIỂM';

  const cta = resolved ? (correct && openedCount === 8 ? 'XEM KẾT QUẢ →' : '← QUAY LẠI ẢNH') : null;
  const panelBadge = resolved?.timedOut ? SKULL : wrong ? BROKEN_HEART : question.kind === 'essay' ? HOURGLASS : stage === 1 ? SLIME : MIMIC;
  const panelScale = resolved?.timedOut || wrong ? 8 : revealed ? 10 : question.kind === 'essay' ? 8 : stage === 1 ? 8 : 10;

  return (
    <Backdrop variant={STAGE_META[stage - 1].variant} dim={0.46} moon={false}>
      <div style={abs(60, 24, { width: 1800, height: 84, zIndex: 30, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', background: 'rgba(14,15,26,.94)', border: `4px solid ${C.dark}`, boxShadow: `0 0 0 3px ${C.slate}` })}>
        {!resolved && (
          <>
            <PixelButton tone="ghost" fontSize={20} onClick={onBack} ariaLabel="Quay trở lại ảnh">
              ← QUAY LẠI ẢNH
            </PixelButton>
            <div style={{ width: 2, height: 40, background: C.slate }} />
          </>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow }}>MẢNH {pad2(tile + 1)} · {question.kind === 'essay' ? 'TỰ LUẬN' : 'TRẮC NGHIỆM'}</span>
          <span style={{ fontFamily: F.mono, fontSize: 22, color: C.silver, marginTop: 4 }}>{question.topic} · CÂU CÒN {remaining}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TurnChip player={turn} onOpen={() => setPickerOpen(true)} />
          <PixelButton tone="ghost" fontSize={18} onClick={onOpenPlayers} style={{ padding: '8px 12px' }} ariaLabel="Mở bảng điểm">
            <PixelSprite sprite={TROPHY} scale={2} />
          </PixelButton>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <TimerBar remaining={remainingTime} total={total} started={started} locked={Boolean(resolved)} />
        </div>
      </div>

      <PixelBox x={64} y={146} w={390} h={690} fill={C.navy} edge={C.slate}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '18px 14px' }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, textAlign: 'center', lineHeight: 1.6 }}>
            {revealed ? 'MẢNH ĐÃ MỞ' : question.kind === 'essay' ? 'Ảnh TỰ LUẬN' : 'MẢNH ĐANG GIỮ'}
          </div>
          <div style={{ position: 'relative', width: '100%', height: 250, marginTop: 16, border: `3px solid ${revealed ? C.lime : C.dark}`, overflow: 'hidden', background: C.dark }}>
            <div style={{ position: 'absolute', inset: 0, ...fragmentStyle(stage, tile), filter: revealed ? 'none' : 'blur(12px) saturate(.6) brightness(.5)', transform: revealed ? 'none' : 'scale(1.15)' }} />
            {!revealed && (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,15,26,.4)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: F.display, fontSize: 128, color: 'rgba(255,205,117,.78)', lineHeight: 1 }}>?</span>
                </div>
              </>
            )}
          </div>
          {revealed ? (
            <Chest scale={panelScale} open className={wrong ? 'mg-shake' : 'mg-bob'} style={{ marginTop: 20 }} />
          ) : (
            <PixelSprite sprite={panelBadge} scale={panelScale} className={wrong ? 'mg-shake' : 'mg-bob'} style={{ marginTop: 20 }} />
          )}
          {question.kind === 'essay' && (
            <div style={{ marginTop: 'auto', fontFamily: F.mono, fontSize: 19, color: C.slate, textAlign: 'center', lineHeight: 1.2 }}>
              ĐIỀU HÀNH
              <br />
              ĐỌC - THẢO LUẬN - CHẤM
            </div>
          )}
        </div>
      </PixelBox>

      {question.kind === 'mc' ? (
        <div style={abs(500, 146, { width: 1356, zIndex: 20 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: C.yellow }}>CÂU HỎI</span>
            <span style={{ height: 2, flex: 1, background: 'rgba(255,205,117,.3)' }} />
            <span style={{ fontFamily: F.mono, fontSize: 21, color: C.silver }}>{question.topic}</span>
          </div>
          <h2 style={{ fontFamily: F.body, fontSize: 42, fontWeight: 600, lineHeight: 1.3, margin: 0, color: C.white, minHeight: 112 }}>
            {question.text}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {question.options.map((option, i) => {
              const isAnswer = Boolean(resolved) && i === question.answer;
              const isPicked = picked === i;
              const isWrongPick = Boolean(resolved) && isPicked && i !== question.answer;
              const dimmed = Boolean(resolved) && !isAnswer && !isWrongPick;
              return (
                <button
                  key={i}
                  type="button"
                  className="mg-opt"
                  onClick={() => {
                    setStarted(true);
                    resolveMc(i, false);
                  }}
                  disabled={Boolean(resolved)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    width: '100%',
                    minHeight: 82,
                    padding: '12px 18px',
                    textAlign: 'left',
                    background: isAnswer ? 'rgba(167,240,112,.16)' : isWrongPick ? 'rgba(177,62,83,.18)' : 'rgba(26,28,44,.92)',
                    border: `3px solid ${isAnswer ? C.lime : isWrongPick ? C.red : 'rgba(255,205,117,.34)'}`,
                    boxShadow: isAnswer ? `0 0 0 3px rgba(167,240,112,.22)` : isWrongPick ? `0 0 0 3px rgba(177,62,83,.24)` : 'none',
                    opacity: dimmed ? 0.42 : 1,
                    cursor: resolved ? 'default' : 'pointer',
                    color: C.white,
                    clipPath: notch(6),
                  }}
                >
                  <span style={{ width: 46, height: 46, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAnswer ? C.lime : isWrongPick ? C.red : C.yellow, color: C.navy, border: `3px solid ${C.dark}`, fontFamily: F.pixel, fontSize: 18, lineHeight: 1 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: 27, fontWeight: 500, lineHeight: 1.35, flex: 1 }}>{option}</span>
                  {isAnswer && <PixelSprite sprite={CHECK} scale={3} />}
                  {isWrongPick && <PixelSprite sprite={CROSS} scale={3} swap={{ c: C.red }} />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={abs(500, 146, { width: 1356, zIndex: 20 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: C.yellow }}>THẢO LUẬN · 30s</span>
            <span style={{ height: 2, flex: 1, background: 'rgba(255,205,117,.3)' }} />
            <span style={{ fontFamily: F.mono, fontSize: 21, color: C.silver }}>{question.topic}</span>
          </div>
          <h2 style={{ fontFamily: F.body, fontSize: 40, fontWeight: 600, lineHeight: 1.3, margin: 0, color: C.white, minHeight: 104 }}>
            {question.text}
          </h2>
          {!resolved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <PixelButton tone="ghost" fontSize={24} onClick={() => setHintOpen((value) => !value)}>
                {hintOpen ? 'ẨN GỢI Ý' : 'GỢI Ý'}
              </PixelButton>
              {timeUp && <span style={{ fontFamily: F.mono, fontSize: 24, color: C.orange }}>HẾT 30s - Chấm bài</span>}
            </div>
          )}

          <div style={{ marginTop: 18, minHeight: 240, background: 'rgba(26,28,44,.94)', border: `3px solid ${C.slate}`, padding: '18px 22px', clipPath: notch(8) }}>
            {!hintOpen && !resolved && (
              <div style={{ fontFamily: F.mono, fontSize: 25, color: C.silver, lineHeight: 1.4 }}>
                Bấm <span style={{ color: C.yellow }}>GỢI Ý</span> để mở các ý chính.
              </div>
            )}
            {hintOpen && !resolved && (
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.yellow, marginBottom: 12 }}>GỢI Ý</div>
                <div style={{ fontFamily: F.body, fontSize: 28, lineHeight: 1.45, color: C.white }}>{question.hint}</div>
              </div>
            )}
            {resolved && (
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: correct ? C.lime : C.orange, marginBottom: 10 }}>
                  {correct ? `ĐẠT · +10${turn ? ` · ${turn.name}` : ' · KHÔNG GHI ĐIỂM'}` : 'CHƯA ĐẠT · KHÔNG CỘNG ĐIỂM'}
                </div>
                <div style={{ fontFamily: F.body, fontSize: 22, lineHeight: 1.38, color: C.white, whiteSpace: 'pre-line' }}>{question.sample}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
            <PixelButton tone="mint" fontSize={26} onClick={() => judgeEssay(true)} disabled={Boolean(resolved)}>
              <IconText icon={<PixelSprite sprite={CHECK} scale={3} swap={{ 5: C.navy }} />}>ĐẠT +10</IconText>
            </PixelButton>
            <PixelButton tone="coral" fontSize={26} onClick={() => judgeEssay(false)} disabled={Boolean(resolved)}>
              <IconText icon={<PixelSprite sprite={CROSS} scale={3} />}>CHƯA ĐẠT</IconText>
            </PixelButton>
            {resolved && <span style={{ fontFamily: F.mono, fontSize: 24, color: correct ? C.lime : C.orange, alignSelf: 'center' }}>{correct ? 'Đã mở mảnh!' : 'Câu đã bị dùng - không chọn lại.'}</span>}
          </div>
        </div>
      )}

      <div
        style={abs(64, 892, {
          width: 1792,
          height: 104,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 22px',
          background: 'rgba(14,15,26,.96)',
          border: `4px solid ${C.dark}`,
          boxShadow: `0 0 0 3px ${C.slate}, 0 8px 0 rgba(0,0,0,.4)`,
          clipPath: notch(8),
        })}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: F.mono, fontSize: 28, color: resolved ? (correct ? C.lime : C.orange) : C.white, letterSpacing: 1 }}>
            {status}
          </div>
          <div style={{ fontFamily: F.body, fontSize: 20, lineHeight: 1.3, color: C.silver, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {resolved
              ? question.kind === 'essay'
                ? resolved.correct
                  ? 'Đáp án gợi ý đã hiện bên trên. Mời MC chuyển lượt.'
                  : 'Câu này đã bị dùng. Mời MC quay về bảng ảnh để chọn mảnh khác.'
                : resolved.correct
                  ? question.explain
                  : `Đáp án đúng: ${answerLabel(question)}. ${question.explain}`
              : question.kind === 'essay'
                ? 'Hết 30 giây MC vẫn có thể chấm; câu hỏi không được dùng lại.'
                : 'Chọn đáp án hoặc chờ hết 15 giây. Sai không được chọn lại.'}
          </div>
        </div>
        {resolved ? (
          <PixelButton tone={correct ? 'mint' : 'coral'} fontSize={26} onClick={onBack} style={{ minWidth: 300 }}>
            {cta}
          </PixelButton>
        ) : null}
      </div>

      <PlayerPicker
        open={pickerOpen}
        players={players}
        subtitle={`Mảnh ${pad2(tile + 1)} · ${question.topic}`}
        onPick={(id) => {
          onPickTurn(id);
          setPickerOpen(false);
        }}
        onAdd={(name) => {
          onAddPlayer(name);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Backdrop>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Guess screen
// ─────────────────────────────────────────────────────────────────────────────

const MemoryMosaic = ({ stage, opened }: { stage: 1 | 2; opened: boolean[] }) => {
  const layout = layoutFor(stage);
  const width = stage === 1 ? 720 : 480;
  const height = stage === 1 ? 420 : 560;
  return (
    <div
      style={{
        width,
        height,
        display: 'grid',
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
        gap: 4,
        padding: 6,
        background: C.dark,
        border: `4px solid ${C.dark}`,
        boxShadow: `0 0 0 4px ${C.slate}, 0 12px 0 rgba(0,0,0,.4)`,
        clipPath: notch(8),
      }}
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            background: opened[index] ? C.navy : 'repeating-linear-gradient(45deg, #15182C 0 8px, #1A1C2C 8px 16px)',
            ...(opened[index] ? fragmentStyle(stage, index) : {}),
            backgroundSize: opened[index] ? `${layout.cols * 100}% ${layout.rows * 100}%` : undefined,
            backgroundPosition: opened[index] ? fragmentStyle(stage, index).backgroundPosition : undefined,
            border: `2px solid ${opened[index] ? C.yellow : C.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!opened[index] && <span style={{ fontFamily: F.display, fontSize: 42, color: 'rgba(244,244,244,.16)' }}>?</span>}
          {opened[index] && (
            <span style={{ position: 'absolute', left: 5, bottom: 4, fontFamily: F.mono, fontSize: 17, color: C.white, background: 'rgba(14,15,26,.8)', padding: '0 4px' }}>
              {pad2(index + 1)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const Guess = ({
  stage,
  store,
  forced,
  players,
  turnId,
  onCorrect,
  onWrong,
  onBack,
  onGiveUp,
  onPickTurn,
  onAddPlayer,
  onOpenPlayers,
}: {
  stage: 1 | 2;
  store: GameStore;
  forced: boolean;
  players: Player[];
  turnId: string | null;
  onCorrect: () => void;
  onWrong: () => void;
  onBack: () => void;
  onGiveUp: () => void;
  onPickTurn: (id: string | null) => void;
  onAddPlayer: (name: string) => void;
  onOpenPlayers: () => void;
}) => {
  const opened = store.opened[stage - 1];
  const count = opened.filter(Boolean).length;
  const meta = STAGE_META[stage - 1];
  const [pickerOpen, setPickerOpen] = useState(!turnId);
  const turn = players.find((player) => player.id === turnId) ?? null;
  return (
    <Backdrop variant={meta.variant} dim={0.56} moon={false}>
      <div style={abs(60, 24, { width: 1800, height: 84, zIndex: 30, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', background: 'rgba(14,15,26,.94)', border: `4px solid ${C.dark}`, boxShadow: `0 0 0 3px ${C.slate}` })}>
        <div style={{ background: C.yellow, color: C.navy, fontFamily: F.pixel, fontSize: 11, padding: '8px 10px' }}>{pad2(stage)}/02</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: F.mono, fontSize: 24, color: C.yellow }}>{meta.label} · LƯỢT ĐOÁN</span>
          <span style={{ fontFamily: F.mono, fontSize: 21, color: C.silver, marginTop: 3 }}>
            {forced ? 'ĐÃ HẾT CÂU - BẮT BUỘC ĐOÁN' : 'ĐOÁN SỚM - CÓ THỂ QUAY LẠI BẢNG ẢNH'}
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <TurnChip player={turn} onOpen={() => setPickerOpen(true)} />
          <PixelButton tone="ghost" fontSize={18} onClick={onOpenPlayers} style={{ padding: '8px 12px' }} ariaLabel="Mở bảng điểm">
            <PixelSprite sprite={TROPHY} scale={2} />
          </PixelButton>
        </div>
      </div>

      <div style={abs(stage === 1 ? 100 : 180, 190, { zIndex: 18 })}>
        <MemoryMosaic stage={stage} opened={opened} />
        <div style={{ marginTop: 18, fontFamily: F.mono, fontSize: 24, color: C.silver, textAlign: 'center' }}>
          ĐÃ MỞ <span style={{ color: C.yellow }}>{count}/8</span> MẢNH
        </div>
      </div>

      <PixelBox x={900} y={180} w={860} h={690} fill={C.navy} edge={forced ? C.red : C.yellow}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '34px 30px' }}>
          <div style={{ fontFamily: F.pixel, fontSize: 12, color: forced ? C.orange : C.yellow, lineHeight: 1.6 }}>
            {forced ? 'FINAL GUESS' : 'EARLY GUESS'}
          </div>
          <h2 style={{ fontFamily: F.display, fontSize: 62, fontWeight: 400, lineHeight: 0.94, margin: '12px 0 0', color: C.white, textShadow: `5px 5px 0 ${C.plum}` }}>
            BỨC ẢNH
            <br />
            BÍ MẬT LÀ GÌ?
          </h2>
          <p style={{ fontFamily: F.body, fontSize: 24, lineHeight: 1.55, color: C.silver, margin: '22px 0 0' }}>
            Mời <strong style={{ color: C.white }}>{turn ? turn.name : 'người được chọn'}</strong> đưa ra đáp án. Tối đa <strong style={{ color: C.white }}>2 lượt/người</strong>. Đoán đúng nhận <strong style={{ color: C.yellow }}>+20 điểm</strong> và kết thúc Ảnh.
          </p>
          {!turn && (
            <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 21, color: C.orange, lineHeight: 1.4 }}>
              Chưa chọn người - bấm ô LƯỢT ở trên để chọn trước khi cộng điểm.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34 }}>
            <PixelButton tone="mint" fontSize={27} onClick={onCorrect}>
              <IconText icon={<PixelSprite sprite={CHECK} scale={3} swap={{ 5: C.navy }} />}>ĐOÁN ĐÚNG · +20</IconText>
            </PixelButton>
            <PixelButton tone="coral" fontSize={27} onClick={onWrong}>
              <IconText icon={<PixelSprite sprite={CROSS} scale={3} />}>ĐOÁN SAI</IconText>
            </PixelButton>
            {forced ? (
              <PixelButton tone="ghost" fontSize={24} onClick={onGiveUp}>
                CÔNG BỐ ĐÁP ÁN (KHÔNG CỘNG ĐIỂM)
              </PixelButton>
            ) : (
              <PixelButton tone="ghost" fontSize={24} onClick={onBack}>
                ← QUAY LẠI ẢNH
              </PixelButton>
            )}
          </div>
          <div style={{ marginTop: 'auto', fontFamily: F.mono, fontSize: 21, color: C.slate, lineHeight: 1.4 }}>
            {forced ? 'Không còn câu hỏi. Chỉ còn lượt đoán - hoặc công bố đáp án để đi tiếp.' : 'Có thể đoán bất cứ lúc nào. Đoán sai vẫn được chơi tiếp.'}
          </div>
        </div>
      </PixelBox>

      <PlayerPicker
        open={pickerOpen}
        players={players}
        title="AI ĐOÁN BỨC ẢNH?"
        subtitle={`${meta.label} · Lượt đoán ảnh`}
        onPick={(id) => {
          onPickTurn(id);
          setPickerOpen(false);
        }}
        onAdd={(name) => {
          onAddPlayer(name);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </Backdrop>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Result screen
// ─────────────────────────────────────────────────────────────────────────────

const Result = ({
  stage,
  store,
  onNext,
  onOpenPlayers,
}: {
  stage: 1 | 2;
  store: GameStore;
  onNext: () => void;
  onOpenPlayers: () => void;
}) => {
  const stageIdx = stage - 1;
  const meta = STAGE_META[stageIdx];
  const opened = store.opened[stageIdx];
  const count = opened.filter(Boolean).length;
  const guessed = store.guessed[stageIdx];
  const guessAward = store.awards.find((award) => award.stage === stage && award.source === 'guess');
  const guessPlayer = guessAward
    ? store.players.find((player) => player.id === guessAward.playerId)
    : null;
  return (
    <Backdrop variant={meta.variant} dim={0.5} moon={false}>
      <div style={abs(60, 24, { width: 1800, height: 84, zIndex: 30, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', background: 'rgba(14,15,26,.94)', border: `4px solid ${C.dark}`, boxShadow: `0 0 0 3px ${C.slate}` })}>
        <div style={{ background: C.yellow, color: C.navy, fontFamily: F.pixel, fontSize: 11, padding: '8px 10px' }}>{pad2(stage)}/02</div>
        <span style={{ fontFamily: F.mono, fontSize: 25, color: C.yellow }}>{meta.label} · CÔNG BỐ</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <PixelButton tone="ghost" fontSize={18} onClick={onOpenPlayers} style={{ padding: '8px 12px' }}>
            <IconText icon={<PixelSprite sprite={TROPHY} scale={2} />}>BẢNG ĐIỂM</IconText>
          </PixelButton>
        </div>
      </div>

      <div style={abs(80, 180, { width: meta.imgW, height: meta.imgH, zIndex: 20, border: `5px solid ${C.dark}`, boxShadow: `0 0 0 4px ${C.yellow}, 0 16px 0 rgba(0,0,0,.45)`, overflow: 'hidden', background: C.dark })}>
        <div className="mg-pop" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${meta.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </div>

      <div style={abs(stage === 1 ? 1240 : 860, 196, { width: stage === 1 ? 620 : 980, zIndex: 20 })}>
        <h2 style={{ fontFamily: F.display, fontSize: stage === 1 ? 86 : 78, fontWeight: 400, lineHeight: 0.88, margin: '16px 0 0', color: C.white, textShadow: `6px 6px 0 ${C.plum}` }}>
          {meta.answer}
          <br />
          <span style={{ color: C.yellow }}>{meta.answer2}</span>
        </h2>
        <p style={{ fontFamily: F.body, fontSize: 26, lineHeight: 1.5, color: C.silver, margin: '18px 0 0' }}>{meta.subtitle}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
          <Badge label={`${count}/8 MẢNH`} tone={count === 8 ? 'lime' : 'dark'} />
          {guessed && (
            <Badge
              label={guessPlayer ? `+20Đ · ${guessPlayer.name}` : 'ĐOÁN ĐÚNG · KHÔNG GHI ĐIỂM'}
              tone={guessPlayer ? 'gold' : 'dark'}
            />
          )}
        </div>

        <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(14,15,26,.9)', border: `3px solid ${C.slate}`, clipPath: notch(6) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: F.mono, fontSize: 13, color: C.yellow }}>BẢNG ĐIỂM ẢNH {stage}</span>
            <span style={{ height: 2, flex: 1, background: 'rgba(255,205,117,.25)' }} />
          </div>
          <StageLeaderboard players={store.players} stage={stage} limit={3} emptyLabel="Chưa có ai được cộng điểm." />
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
          <PixelButton tone="gold" fontSize={28} onClick={onNext}>
            {stage === 1 ? 'Bắt đầu ảnh 2 →' : 'XEM KIẾN THỨC →'}
          </PixelButton>
        </div>
      </div>
    </Backdrop>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Cover / Rules / Knowledge
// ─────────────────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <Screen hud={false}>
    <Backdrop variant="forest" moonTop={72}>
      <div style={abs(120, 98, { zIndex: 20 })}>
        <Kicker>MINIGAME · CNXHKH NHÓM 3</Kicker>
      </div>
      <div style={abs(120, 190, { zIndex: 20, width: 1080 })}>
        <h1 style={{ fontFamily: F.pixel, fontSize: 92, lineHeight: 0.92, margin: 0, color: C.yellow, textShadow: `8px 8px 0 ${C.red}, 16px 16px 0 ${C.plum}` }}>
          PIXEL
          <br />
          QUEST
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 30 }}>
          <span style={{ fontFamily: F.display, fontSize: 70, color: C.cyan, textShadow: `4px 4px 0 ${C.deep}`, lineHeight: 1 }}>ĐẤU TRƯỜNG</span>
        </div>
        <p style={{ fontFamily: F.body, fontSize: 27, lineHeight: 1.65, color: '#D7E0F5', maxWidth: 820, margin: '18px 0 0' }}>
          Hai bức ảnh bí mật, mỗi bức ảnh là tám mảnh ký ức cần lật ra.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 34 }}>
          <PixelButton tone="gold" fontSize={30} onClick={() => goPage(PAGE.rules)} style={{ padding: '18px 30px' }}>
            <IconText icon={<PixelSprite sprite={ARROW_RIGHT} scale={3} swap={{ c: C.navy }} />}>BẮT ĐẦU</IconText>
          </PixelButton>
        </div>
        <div className="mg-blink" style={{ fontFamily: F.mono, fontSize: 24, color: C.yellow, letterSpacing: 2, marginTop: 22 }}>
          PRESS START
        </div>
      </div>

      <div style={abs(1260, 210, { width: 560, height: 560, zIndex: 12 })}>
        <Chest scale={15} className="mg-bob" style={{ position: 'absolute', left: 200, top: 250 }} />
        <Hero style={{ position: 'absolute', left: 30, top: 330 }} />
        <div className="mg-float" style={{ position: 'absolute', left: 340, top: 80 }}>
          <PixelSprite sprite={STAR} scale={9} />
        </div>
        <PixelSprite sprite={COIN} scale={7} className="mg-float" style={{ position: 'absolute', left: 70, top: 180 }} />
        <div className="mg-bob-slow" style={{ position: 'absolute', left: 300, top: 460 }}>
          <PixelSprite sprite={SLIME} scale={6} />
        </div>
        <div className="mg-float" style={{ position: 'absolute', left: 480, top: 340 }}>
          <PixelSprite sprite={LANTERN} scale={5} />
        </div>
        <div style={{ position: 'absolute', left: 440, top: 110, fontFamily: F.display, fontSize: 150, color: 'rgba(255,205,117,.48)', lineHeight: 1 }}>
          ?
        </div>
      </div>

      <div style={abs(120, 900, { zIndex: 20, display: 'flex', gap: 12, alignItems: 'center' })}>
        <Chip text="2 Ảnh" />
        <Chip text="8 MẢNH / Ảnh" />
        <Chip text="15s TRẮC NGHIỆM" />
        <Chip text="30s TỰ LUẬN" />
        <span style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: 21, color: 'rgba(244,244,244,.55)' }}>CNXHKH · NHÓM 3</span>
      </div>
    </Backdrop>
  </Screen>
);

const FlowStep = ({
  n,
  title,
  desc,
  accent = C.yellow,
}: {
  n: string;
  title: string;
  desc: string;
  accent?: string;
}) => (
  <div
    style={{
      flex: 1,
      minHeight: 94,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: 'rgba(26,28,44,.9)',
      border: `3px solid ${C.ink}`,
      boxShadow: `inset 0 0 0 2px rgba(255,255,255,.03)`,
    }}
  >
    <span style={{ fontFamily: F.pixel, fontSize: 17, color: accent }}>{n}</span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: F.mono, fontSize: 23, color: C.white, letterSpacing: 1 }}>{title}</div>
      <div style={{ fontFamily: F.body, fontSize: 19, lineHeight: 1.35, color: C.silver, marginTop: 2, whiteSpace: 'pre-line' }}>{desc}</div>
    </div>
  </div>
);


const RuleCard = ({
  icon,
  value,
  label,
  accent = C.yellow,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  accent?: string;
}) => (
  <div
    style={{
      height: 296,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      background: C.navy,
      border: `4px solid ${C.dark}`,
      boxShadow: `0 0 0 3px ${C.slate}, 0 8px 0 rgba(0,0,0,.35)`,
      clipPath: notch(8),
    }}
  >
    <div style={{ height: 78, display: 'flex', alignItems: 'center' }}>
      {icon}
    </div>
    <div style={{ fontFamily: F.pixel, fontSize: 42, lineHeight: 1.1, color: accent, marginTop: 16 }}>{value}</div>
    <div style={{ fontFamily: F.mono, fontSize: 24, color: C.white, marginTop: 6 }}>{label}</div>
  </div>
);

const Rules: Page = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  return (
  <Screen>
    <Backdrop variant="ridge" dim={0.4} moon={false}>
      <div style={abs(120, 54, { zIndex: 20 })}>
        <Kicker>HOW TO PLAY</Kicker>
      </div>
      <PixelBox x={180} y={110} w={1560} h={850} fill={C.navy} edge={C.yellow}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <PageTitle>LUẬT CHƠI</PageTitle>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 24 }}>
            <RuleCard icon={<Chest scale={6} />} value="8" label="MẢNH / Ảnh" />
            <RuleCard icon={<PixelSprite sprite={FLAME} scale={7} />} value="15s/30s" label="TRẮC NGHIỆM/TỰ LUẬN" accent={C.cyan} />
            <RuleCard icon={<PixelSprite sprite={COIN} scale={10} />} value="+10" label="MỖI CÂU ĐÚNG" accent={C.lime} />
            <RuleCard icon={<PixelSprite sprite={TROPHY} scale={7} />} value="+20" label="ĐOÁN ẢNH" accent={C.orange} />
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 20, flex: 1 }}>
            <FlowStep n="01" title="CHỌN MẢNH" desc="Mỗi mảnh rút một câu ngẫu nhiên trong số các câu hỏi." />
            <FlowStep n="02" title="CHỌN NGƯỜI" desc="Chọn tên người chơi trong danh sách hoặc thêm tên mới." accent={C.cyan} />
            <FlowStep n="03" title="MỞ HOẶC ĐOÁN" desc={'Đúng mở mảnh; sai quay lại ảnh.\nHết câu thì đoán.'} accent={C.lime} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: 24 }}>
            <span style={{ fontFamily: F.mono, fontSize: 23, color: C.silver, letterSpacing: 1 }}>Ảnh 1 → Ảnh 2 → TỔNG KẾT</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <PixelButton tone="ghost" fontSize={23} onClick={() => setPanelOpen(true)}>
                <IconText icon={<PixelSprite sprite={GAMEPAD} scale={3} />}>NGƯỜI CHƠI</IconText>
              </PixelButton>
              <PixelButton tone="gold" fontSize={28} onClick={startGame}>
                <IconText icon={<PixelSprite sprite={ARROW_RIGHT} scale={3} swap={{ c: C.navy }} />}>Bắt đầu</IconText>
              </PixelButton>
            </div>
          </div>
        </div>
      </PixelBox>
      <PlayersPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </Backdrop>
  </Screen>
  );
};

const Stat = ({ value, label, accent = C.yellow }: { value: string; label: string; accent?: string }) => (
  <div style={{ height: 96, padding: '10px 12px', background: C.deep, border: `3px solid ${C.dark}`, boxShadow: `0 0 0 2px ${C.slate}`, clipPath: notch(6) }}>
    <div style={{ fontFamily: F.pixel, fontSize: 26, lineHeight: 1.1, color: accent }}>{value}</div>
    <div style={{ fontFamily: F.mono, fontSize: 18, color: C.silver, marginTop: 6 }}>{label}</div>
  </div>
);

const Knowledge: Page = () => {
  const [store] = useGameStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const ranked = rankPlayers(store.players);
  return (
    <Screen>
      <Backdrop variant="forest" dim={0.42} moon={false}>
        <div style={abs(120, 54, { zIndex: 20 })}>
          <Kicker>WRAP-UP</Kicker>
        </div>
        <PixelBox x={120} y={108} w={1680} h={870} fill={C.navy} edge={C.yellow}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 84, flex: '0 0 auto', background: C.dark, borderBottom: `4px solid ${C.plum}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '0 30px' }}>
              <span style={{ fontFamily: F.pixel, fontSize: 18, color: C.yellow }}>QUEST COMPLETE</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <PixelButton tone="ghost" fontSize={17} onClick={() => setPanelOpen(true)} style={{ padding: '8px 12px' }}>
                  <IconText icon={<PixelSprite sprite={TROPHY} scale={2} />}>BẢNG ĐIỂM</IconText>
                </PixelButton>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 30, padding: '24px 30px', minHeight: 0 }}>
              <div style={{ width: 620, flex: '0 0 auto' }}>
                <div style={{ width: 600, height: 363, border: `4px solid ${C.dark}`, boxShadow: `0 0 0 3px ${C.yellow}, 0 10px 0 rgba(0,0,0,.35)`, backgroundImage: `url(${posterImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ fontFamily: F.mono, fontSize: 19, color: C.silver, marginTop: 8, textAlign: 'center' }}>Ảnh 1 · POSTER 54 DÂN TỘC</div>
                <div style={{ width: 240, height: 254, margin: '12px auto 0', border: `4px solid ${C.dark}`, boxShadow: `0 0 0 3px ${C.cyan}, 0 8px 0 rgba(0,0,0,.35)`, backgroundImage: `url(${mapImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ fontFamily: F.mono, fontSize: 18, color: C.slate, marginTop: 6, textAlign: 'center' }}>Ảnh 2 · BẢN ĐỒ PHÂN BỐ</div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontFamily: F.display, fontSize: 76, fontWeight: 400, lineHeight: 0.88, margin: '10px 0 0', color: C.white, textShadow: `5px 5px 0 ${C.plum}` }}>
                  54 DÂN TỘC
                  <br />
                  <span style={{ color: C.yellow }}>MỘT VIỆT NAM</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 22 }}>
                  <Stat value="54" label="DÂN TỘC ANH EM" />
                  <Stat value="02" label="XU HƯỚNG QUAN HỆ" accent={C.lime} />
                  <Stat value="05" label="LĨNH VỰC CHÍNH SÁCH" accent={C.cyan} />
                </div>

                <div style={{ marginTop: 20, borderLeft: `5px solid ${C.yellow}`, paddingLeft: 18, fontFamily: F.body, fontSize: 25, lineHeight: 1.55, color: C.white }}>
                  “Mỗi dân tộc là một mảnh ghép - đoàn kết, tôn trọng và giữ gìn bản sắc làm nên bức tranh Việt Nam thống nhất.”
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                  <Badge label="CHÍNH TRỊ" />
                  <Badge label="KINH TẾ" />
                  <Badge label="XÃ HỘI" />
                  <Badge label="VĂN HÓA" />
                  <Badge label="AN NINH - QUỐC PHÒNG" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
                  <PixelButton tone="gold" fontSize={26} onClick={() => { resetGame(); }}>
                    ↺ CHƠI LẠI
                  </PixelButton>
                  <PixelButton tone="ghost" fontSize={22} onClick={() => goPage(PAGE.rules)}>
                    ← XEM LẠI LUẬT
                  </PixelButton>
                </div>

                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,205,117,.07)', border: `2px solid rgba(255,205,117,.22)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: F.mono, fontSize: 20, color: C.yellow, letterSpacing: 1 }}>BẢNG XẾP HẠNG</span>
                    <span style={{ height: 2, flex: 1, background: 'rgba(255,205,117,.24)' }} />
                  </div>
                  {ranked.length === 0 ? (
                    <div style={{ fontFamily: F.mono, fontSize: 19, color: C.slate, marginTop: 8 }}>
                      Chưa có người chơi trong danh sách.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                      {ranked.slice(0, 3).map((player, index) => (
                        <div
                          key={player.id}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding: '8px 12px',
                            background: index === 0 ? 'rgba(255,205,117,.12)' : 'rgba(26,28,44,.8)',
                            border: `2px solid ${index === 0 ? C.yellow : C.ink}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}><Medal rank={index} /></span>
                            <span style={{ marginLeft: 'auto', fontFamily: F.pixel, fontSize: 15, color: playerTotal(player) > 0 ? C.yellow : C.slate }}>
                              {playerTotal(player)}Đ
                            </span>
                          </div>
                          <div style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F.body, fontSize: 20, fontWeight: 600, color: C.white }}>
                            {player.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PixelBox>
        <PlayersPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      </Backdrop>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Game page
// ─────────────────────────────────────────────────────────────────────────────

type ScreenMode = 'home' | 'arena' | 'guess' | 'result';

const Game: Page = () => {
  const [store, update] = useGameStore();
  const stage = store.stage;
  const stageIdx = stage - 1;
  const pool = POOLS[stageIdx];
  const openedCount = store.opened[stageIdx].filter(Boolean).length;
  const usedCount = store.used[stageIdx].length;
  const remaining = pool.length - usedCount;
  const [screen, setScreen] = useState<ScreenMode>(() => (store.finished[store.stage - 1] ? 'result' : 'home'));
  const [current, setCurrent] = useState<{ qIndex: number; tile: number } | null>(null);
  const [forced, setForced] = useState(false);
  const [toast, setToast] = useState('');
  const [flashTile, setFlashTile] = useState<number | null>(null);
  const [playersPanelOpen, setPlayersPanelOpen] = useState(false);

  const finishStage = useCallback(() => {
    update((prev) => ({
      finished: prev.finished.map((value, i) => (i === stageIdx ? true : value)),
    }));
    setScreen('result');
  }, [stageIdx, update]);

  useEffect(() => {
    setScreen(store.finished[store.stage - 1] ? 'result' : 'home');
    setCurrent(null);
    setForced(false);
    setToast('');
    setFlashTile(null);
  }, [store.runId]);

  useEffect(() => {
    if (flashTile === null) return;
    const timer = setTimeout(() => setFlashTile(null), 1800);
    return () => clearTimeout(timer);
  }, [flashTile]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (screen !== 'home') return;
    if (store.finished[stageIdx]) {
      setScreen('result');
      return;
    }
    if (openedCount === 8) {
      finishStage();
      return;
    }
    if (usedCount >= pool.length) {
      update((prev) => ({ turnId: null }));
      setForced(true);
      setScreen('guess');
    }
  }, [screen, store.finished, stageIdx, openedCount, usedCount, pool.length, finishStage, update]);

  const chooseTile = (tile: number) => {
    if (screen !== 'home' || store.opened[stageIdx][tile] || openedCount === 8) return;
    if (usedCount >= pool.length) {
      update((prev) => ({ turnId: null }));
      setForced(true);
      setScreen('guess');
      return;
    }
    const available = pool.map((_, index) => index).filter((index) => !store.used[stageIdx].includes(index));
    if (available.length === 0) {
      update((prev) => ({ turnId: null }));
      setForced(true);
      setScreen('guess');
      return;
    }
    const qIndex = available[Math.floor(Math.random() * available.length)];
    update((prev) => ({
      used: prev.used.map((row, r) => (r === stageIdx ? [...row, qIndex] : row)),
      turnId: null,
    }));
    setCurrent({ qIndex, tile });
    setScreen('arena');
    setToast('');
  };

  const resolveCurrent = useCallback(
    (correct: boolean) => {
      if (!current) return;
      update((prev) => {
        const nextOpened = correct ? withOpened(prev.opened, stageIdx, current.tile) : prev.opened;
        if (!correct) return { opened: prev.opened };
        const amount = 10;
        if (!prev.turnId) return { opened: nextOpened };
        return {
          opened: nextOpened,
          players: prev.players.map((player) =>
            player.id === prev.turnId ? bumpPlayer(player, stage, amount) : player,
          ),
          awards: [
            ...prev.awards,
            { playerId: prev.turnId, stage, amount, source: 'question' as const },
          ],
        };
      });
      if (correct) setFlashTile(current.tile);
    },
    [current, stageIdx, stage, update],
  );

  const returnToImage = () => {
    if (openedCount === 8) {
      finishStage();
      return;
    }
    if (usedCount >= pool.length) {
      update((prev) => ({ turnId: null }));
      setForced(true);
      setScreen('guess');
      return;
    }
    update((prev) => ({ turnId: null }));
    setCurrent(null);
    setScreen('home');
  };

  const openGuess = () => {
    if (openedCount === 8) {
      finishStage();
      return;
    }
    setForced(false);
    update((prev) => ({ turnId: null }));
    setScreen('guess');
  };

  const correctGuess = () => {
    update((prev) => {
      const already = prev.guessed[stageIdx];
      if (!prev.turnId) {
        return {
          guessed: prev.guessed.map((value, i) => (i === stageIdx ? true : value)),
          finished: prev.finished.map((value, i) => (i === stageIdx ? true : value)),
        };
      }
      return {
        guessed: prev.guessed.map((value, i) => (i === stageIdx ? true : value)),
        finished: prev.finished.map((value, i) => (i === stageIdx ? true : value)),
        players: already
          ? prev.players
          : prev.players.map((player) => (player.id === prev.turnId ? bumpPlayer(player, stage, 20) : player)),
        awards: already
          ? prev.awards
          : [...prev.awards, { playerId: prev.turnId, stage, amount: 20, source: 'guess' as const }],
      };
    });
    setScreen('result');
  };

  const wrongGuess = () => {
    setToast('Đã ghi nhận lượt đoán sai');
  };

  const giveUp = () => {
    update((prev) => ({
      finished: prev.finished.map((value, i) => (i === stageIdx ? true : value)),
    }));
    setScreen('result');
  };

  const nextStage = () => {
    if (stage === 1) {
      update((prev) => ({ stage: 2, turnId: null }));
      setCurrent(null);
      setForced(false);
      setScreen('home');
      return;
    }
    goPage(PAGE.knowledge);
  };

  const pickTurn = (id: string | null) => {
    update((prev) => ({ turnId: id && prev.players.some((player) => player.id === id) ? id : null }));
  };

  const addPlayer = (raw: string) => {
    const name = sanitizeName(raw);
    if (!name) return;
    update((prev) => {
      const { players, firstId } = appendPlayers(prev, [name]);
      return { players, turnId: firstId };
    });
  };

  const question = current ? pool[current.qIndex] : null;

  return (
    <Screen>
      {screen === 'arena' && current && question ? (
        <Arena
          stage={stage}
          question={question}
          tile={current.tile}
          players={store.players}
          turnId={store.turnId}
          openedCount={openedCount}
          remaining={remaining}
          onResolve={resolveCurrent}
          onPickTurn={pickTurn}
          onAddPlayer={addPlayer}
          onOpenPlayers={() => setPlayersPanelOpen(true)}
          onBack={returnToImage}
        />
      ) : screen === 'guess' ? (
        <Guess
          stage={stage}
          store={store}
          forced={forced}
          players={store.players}
          turnId={store.turnId}
          onCorrect={correctGuess}
          onWrong={wrongGuess}
          onBack={() => {
            setForced(false);
            update((prev) => ({ turnId: null }));
            setScreen('home');
          }}
          onGiveUp={giveUp}
          onPickTurn={pickTurn}
          onAddPlayer={addPlayer}
          onOpenPlayers={() => setPlayersPanelOpen(true)}
        />
      ) : screen === 'result' ? (
        <Result stage={stage} store={store} onNext={nextStage} onOpenPlayers={() => setPlayersPanelOpen(true)} />
      ) : (
        <Home
          stage={stage}
          store={store}
          flashTile={flashTile}
          onSelect={chooseTile}
          onGuess={openGuess}
          onOpenPlayers={() => setPlayersPanelOpen(true)}
        />
      )}
      {toast && <Toast>{toast}</Toast>}
      <PlayersPanel open={playersPanelOpen} onClose={() => setPlayersPanelOpen(false)} />
    </Screen>
  );
};

export const transition: SlideTransition = {
  duration: 240,
  // Each page is a full screen with its own scenery, so the old screen must
  // clear out before the next one arrives - a cross-fade leaves both visible.
  throughBackground: true,
  exit: {
    duration: 100,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
  },
  enter: {
    duration: 140,
    delay: 100,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Pixel Quest - Minigame 2 Ảnh',
  createdAt: '2026-10-22T15:22:27.018Z',
};

export const notes: (string | undefined)[] = [
  'Mở màn: chào lớp và giới thiệu Pixel Quest. Có 2 Ảnh, mỗi Ảnh 8 mảnh ghép. Trước mỗi câu, MC chọn tên người trả lời; điểm cộng riêng cho từng bạn. Trả lời đúng để mở mảnh; đoán đúng bức tranh nhận +20. Bấm BẮT ĐẦU để sang luật chơi.',
  'Đọc nhanh luật: 8 mảnh mỗi Ảnh; trắc nghiệm 15 giây, tự luận 30 giây. Trước mỗi câu, MC chọn người trong danh sách hoặc thêm tên mới; đúng +10 cho người đó, sai hoặc hết giờ 0 điểm và quay về ảnh, không chọn lại. Hết câu bắt buộc đoán; đoán đúng +20 cho người giữ lượt và sang Ảnh 2. Nút NGƯỜI CHƠI mở bảng điểm, thêm/xoá tên và hoàn tác lần cộng gần nhất. Bấm VÀO Ảnh 1.',
  'Trang chơi gồm cả 2 Ảnh. Chọn một mảnh để rút câu hỏi ngẫu nhiên. Ngay sau đó bảng chọn người hiện ra: chọn tên có sẵn, nhập tên mới, hoặc đóng để câu đó không ghi điểm. Đọc câu. Đồng hồ tự chạy ngay khi chọn người trả lời: 15 giây với trắc nghiệm, 30 giây với tự luận. Đúng: mở mảnh và +10 cho người được chọn. Sai hoặc CHƯA ĐẠT: không cộng điểm, bấm QUAY LẠI ẢNH. Hết câu: bắt buộc đoán; chọn người trước khi đoán, đúng +20. Nút 🏆 BẢNG ĐIỂM xem điểm từng Ảnh, tổng điểm và hoàn tác.',
  'Chốt kiến thức: 54 dân tộc, 2 xu hướng quan hệ dân tộc, 5 lĩnh vực chính sách. Bảng xếp hạng tổng hợp điểm từng bạn; mở 🏆 BẢNG ĐIỂM để xem đầy đủ hoặc hoàn tác. Nhấn mạnh thông điệp mỗi dân tộc là một mảnh ghép của bức tranh Việt Nam thống nhất. Bấm CHƠI LẠI nếu cần - tên người chơi được giữ lại, điểm reset.',
];

export default [Cover, Rules, Game, Knowledge] satisfies Page[];

