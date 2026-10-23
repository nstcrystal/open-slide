import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import posterImg from './assets/1wupukr1tqlckmswsr9pqpmc9ltgvnluxob3psst9i8retew1kyplb0zqohoehfe6jt1.jpg';
import mapImg from './assets/1wupukr1tqizabfjv9nsiimtnom21au7dlm1jrpfjky8ggvwtkkblparjedjaugtp6x2.jpg';

// ─────────────────────────────────────────────────────────────────────────────
// Design system
// ─────────────────────────────────────────────────────────────────────────────

export const design: DesignSystem = {
  palette: { bg: '#191a33', text: '#f4e8c1', accent: '#ffcf5c' },
  fonts: {
    display: '"Handjet", "VT323", monospace',
    body: '"Be Vietnam Pro", system-ui, sans-serif',
  },
  typeScale: { hero: 168, body: 32 },
  radius: 0,
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Handjet:wght@400..900&family=VT323&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap';
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
.mg-tile { transition: transform 120ms steps(2, end), box-shadow 120ms linear, border-color 120ms linear; }
.mg-tile:hover { transform: translateY(-6px); }
.mg-opt { transition: background 120ms linear, border-color 120ms linear, transform 120ms steps(2, end); }
.mg-opt:hover { transform: translateX(4px); }
.mg-in { animation: mg-in .36s steps(4, end) both; }
.mg-pop { animation: mg-pop .34s steps(3, end) both; }
.mg-bob { animation: mg-bob 1.7s steps(2, end) infinite; }
.mg-bob-slow { animation: mg-bob 2.6s steps(2, end) infinite; }
.mg-blink { animation: mg-blink 1s steps(1, end) infinite; }
.mg-float { animation: mg-float 3.2s steps(4, end) infinite; }
.mg-twinkle { animation: mg-twinkle 3s steps(1, end) infinite; }
.mg-hop { animation: mg-hop .42s steps(3, end) both; }
.mg-shake { animation: mg-shake .3s steps(2, end) both; }
.mg-tile-open { animation: mg-tile-open .46s steps(4, end) both; }
.mg-cell { animation: mg-cell .34s steps(1, end) forwards; }
.mg-scan { position: absolute; inset: 0; z-index: 80; pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(5,4,12,.22) 0 2px, transparent 2px 4px);
  opacity: .45; }
.mg-dither { background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0 2px, transparent 2px 4px); }
@keyframes mg-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes mg-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
@keyframes mg-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes mg-twinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes mg-hop { 0% { transform: translateY(0); } 40% { transform: translateY(-38px); } 70% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
@keyframes mg-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-10px); } 40% { transform: translateX(9px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(3px); } }
@keyframes mg-tile-open { 0% { transform: scale(.86); filter: brightness(2.2); } 60% { transform: scale(1.03); } 100% { transform: scale(1); filter: none; } }
@keyframes mg-pop { 0% { transform: scale(.92); opacity: .4; } 60% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
@keyframes mg-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mg-cell { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .mg-bob,.mg-bob-slow,.mg-blink,.mg-float,.mg-twinkle,.mg-hop,.mg-shake,.mg-tile-open,.mg-in,.mg-pop { animation: none !important; }
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
// Palette, fonts, layout
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  night: 'var(--osd-bg)',
  night2: '#232447',
  ink: '#0b0a14',
  panel: '#15122a',
  parchment: 'var(--osd-text)',
  cream: '#fff6da',
  gold: 'var(--osd-accent)',
  goldDark: '#b8862a',
  moss: '#5fb37a',
  pine: '#2f5d50',
  wood: '#8b5e3c',
  woodLight: '#b06b3c',
  coral: '#ff6b6b',
  coralDark: '#a8322c',
  mint: '#8ff0c0',
  muted: '#b9ac8e',
  dim: '#2a2440',
  purple: '#6c5b9e',
};

const F = {
  display: 'var(--osd-font-display)',
  body: 'var(--osd-font-body)',
  mono: '"VT323", monospace',
};

const PAGE = {
  cover: 1,
  rules: 2,
  board1: 3,
  q1: 4,
  reveal1: 16,
  board2: 17,
  q2: 18,
  reveal2: 30,
  knowledge: 31,
} as const;

const TOTAL_PAGES = 31;
const QUESTION_COUNT = 12;

type Round = 1 | 2;

const roundMeta: Record<
  Round,
  {
    zone: string;
    image: string;
    imageW: number;
    imageH: number;
    answer: string;
    answerLine2?: string;
    subtitle: string;
    variant: 'forest' | 'mountain';
  }
> = {
  1: {
    zone: 'KHU RỪNG KÝ ỨC',
    image: posterImg,
    imageW: 1920,
    imageH: 1163,
    answer: '54 DÂN TỘC',
    answerLine2: 'VIỆT NAM',
    subtitle: 'Mỗi dân tộc một bản sắc – cùng chung một bức tranh.',
    variant: 'forest',
  },
  2: {
    zone: 'ĐỈNH NÚI BẢN ĐỒ',
    image: mapImg,
    imageW: 705,
    imageH: 745,
    answer: 'BẢN ĐỒ PHÂN BỐ',
    answerLine2: '54 DÂN TỘC',
    subtitle: '8 vùng miền – 54 dân tộc anh em.',
    variant: 'mountain',
  },
};

const ri = (round: Round) => round - 1;
const boardPage = (round: Round) => (round === 1 ? PAGE.board1 : PAGE.board2);
const revealPage = (round: Round) => (round === 1 ? PAGE.reveal1 : PAGE.reveal2);
const questionStart = (round: Round) => (round === 1 ? PAGE.q1 : PAGE.q2);

const goPage = (page: number) => {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
  const url = new URL(window.location.href);
  url.searchParams.set('p', String(clamped));
  window.history.replaceState(window.history.state, '', url.toString());
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// ─────────────────────────────────────────────────────────────────────────────
// Game state (sessionStorage + a tiny cross-page subscription store)
// ─────────────────────────────────────────────────────────────────────────────

type GameState = {
  opened: boolean[][];
  used: number[][];
  activeTile: number | null;
  lastOpened: string;
  guessed: boolean[];
  score: number[];
};

const STORAGE_KEY = 'osd-minigame-quest-v1';
const listeners = new Set<() => void>();

const emptyRow = () => Array.from({ length: 8 }, () => false);

const defaultState = (): GameState => ({
  opened: [emptyRow(), emptyRow()],
  used: [[], []],
  activeTile: null,
  lastOpened: '',
  guessed: [false, false],
  score: [0, 0],
});

const loadState = (): GameState => {
  const base = defaultState();
  if (typeof window === 'undefined') return base;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<GameState> | null;
    if (!raw) return base;
    return {
      opened: [0, 1].map((r) =>
        Array.from({ length: 8 }, (_, i) => Boolean(raw.opened?.[r]?.[i])),
      ),
      used: [0, 1].map((r) => {
        const row = raw.used?.[r];
        const arr = Array.isArray(row) ? row : [];
        return Array.from(
          new Set(
            arr.filter(
              (n): n is number =>
                typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < QUESTION_COUNT,
            ),
          ),
        );
      }),
      activeTile:
        typeof raw.activeTile === 'number' && raw.activeTile >= 0 && raw.activeTile < 8
          ? raw.activeTile
          : null,
      lastOpened: typeof raw.lastOpened === 'string' ? raw.lastOpened : '',
      guessed: [Boolean(raw.guessed?.[0]), Boolean(raw.guessed?.[1])],
      score: [0, 1].map((r) => {
        const n = raw.score?.[r];
        return typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0;
      }),
    };
  } catch {
    return base;
  }
};

const saveState = (state: GameState) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage can be unavailable (private mode / quota); the game still
    // works within a single page, it just won't survive navigation.
  }
};

const broadcast = () => {
  listeners.forEach((fn) => fn());
};

const useGame = () => {
  const [state, setState] = useState<GameState>(() => loadState());

  useEffect(() => {
    const sync = () => setState(loadState());
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const update = useCallback(
    (patch: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => {
      const prev = loadState();
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      saveState(next);
      broadcast();
      setState(next);
    },
    [],
  );

  return [state, update] as const;
};

const withOpened = (opened: boolean[][], round: Round, tile: number) =>
  opened.map((row, r) =>
    r === ri(round) ? row.map((value, i) => (i === tile ? true : value)) : row,
  );

const withUsed = (used: number[][], round: Round, index: number) =>
  used.map((row, r) => (r === ri(round) && !row.includes(index) ? [...row, index] : row));

const scoreForRound = (state: GameState, round: Round) => state.score[ri(round)];

const totalScore = (state: GameState) => state.score[0] + state.score[1];

const resetGame = () => {
  saveState(defaultState());
  broadcast();
  goPage(PAGE.cover);
};

const firstUnused = (used: number[]) => {
  for (let i = 0; i < QUESTION_COUNT; i += 1) {
    if (!used.includes(i)) return i;
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Questions — 12 per round, ordered easy → hard
// ─────────────────────────────────────────────────────────────────────────────

type Question = {
  kind: 'mc' | 'tf';
  text: string;
  options: string[];
  answer: number;
  explain: string;
};

const ROUND_ONE: Question[] = [
  {
    kind: 'mc',
    text: 'Theo quan điểm của chủ nghĩa Mác – Lênin, các hình thức cộng đồng người từ thấp đến cao là:',
    options: [
      'Bộ lạc – thị tộc – bộ tộc – dân tộc',
      'Thị tộc – bộ lạc – bộ tộc – dân tộc',
      'Thị tộc – bộ tộc – bộ lạc – dân tộc',
      'Bộ tộc – bộ lạc – thị tộc – dân tộc',
    ],
    answer: 1,
    explain: 'Thứ tự đúng: thị tộc → bộ lạc → bộ tộc → dân tộc.',
  },
  {
    kind: 'mc',
    text: 'Dân tộc Kinh, dân tộc Thái là ví dụ của dân tộc theo:',
    options: ['Nghĩa rộng (Nation)', 'Nghĩa hẹp (Ethnie)', 'Quốc gia đa dân tộc', 'Bộ tộc'],
    answer: 1,
    explain: 'Kinh, Thái là các tộc người – dân tộc theo nghĩa hẹp (Ethnie).',
  },
  {
    kind: 'mc',
    text: 'Số đặc trưng cơ bản của dân tộc theo nghĩa rộng và nghĩa hẹp lần lượt là:',
    options: ['5 và 3', '3 và 5', '5 và 5', '4 và 3'],
    answer: 0,
    explain: 'Nghĩa rộng có 5 đặc trưng; nghĩa hẹp có 3 đặc trưng.',
  },
  {
    kind: 'mc',
    text: '“Một cộng đồng người ổn định làm thành nhân dân một nước, có lãnh thổ riêng, nền kinh tế thống nhất, có ngôn ngữ chung và có ý thức về sự thống nhất của mình” là khái niệm dân tộc theo:',
    options: ['Nghĩa rộng (Nation)', 'Nghĩa hẹp (Ethnie)', 'Bộ tộc', 'Bộ lạc'],
    answer: 0,
    explain: 'Đây là định nghĩa dân tộc theo nghĩa rộng (Nation).',
  },
  {
    kind: 'mc',
    text: 'Nội dung nào KHÔNG thuộc Cương lĩnh dân tộc của Lênin?',
    options: [
      'Các dân tộc hoàn toàn bình đẳng',
      'Các dân tộc được quyền tự quyết',
      'Liên hiệp công nhân tất cả các dân tộc',
      'Các dân tộc lớn được ưu tiên phát triển trước',
    ],
    answer: 3,
    explain: 'Cương lĩnh gồm: bình đẳng, tự quyết, liên hiệp công nhân các dân tộc.',
  },
  {
    kind: 'mc',
    text: 'Đặc trưng nào dưới đây chỉ có trong nghĩa rộng, không có trong nghĩa hẹp?',
    options: [
      'Ý thức tự giác tộc người',
      'Cộng đồng về văn hóa',
      'Có chung một nhà nước',
      'Cộng đồng về ngôn ngữ',
    ],
    answer: 2,
    explain: 'Chỉ dân tộc theo nghĩa rộng mới có đặc trưng chung một nhà nước.',
  },
  {
    kind: 'mc',
    text: 'Nội dung nào thuộc quyền tự quyết của các dân tộc?',
    options: [
      'Tự quyết việc chia tách hoặc liên hiệp với dân tộc khác',
      'Chỉ có quyền tách ra thành quốc gia độc lập',
      'Được can thiệp vào công việc nội bộ của dân tộc khác',
      'Áp đặt con đường phát triển cho dân tộc nhỏ hơn',
    ],
    answer: 0,
    explain: 'Tự quyết gồm cả việc chia tách hoặc liên hiệp với dân tộc khác.',
  },
  {
    kind: 'mc',
    text: '“Liên hiệp công nhân tất cả các dân tộc” là:',
    options: [
      'Quyền chia tách của các dân tộc',
      'Mục đích đấu tranh của giai cấp công nhân thế giới',
      'Biện pháp giúp dân tộc lớn đứng đầu các dân tộc khác',
      'Nghĩa vụ riêng của dân tộc thiểu số',
    ],
    answer: 1,
    explain: 'Đây là mục đích đấu tranh của giai cấp công nhân thế giới.',
  },
  {
    kind: 'mc',
    text: 'Xu hướng cộng đồng dân cư muốn tách ra để hình thành cộng đồng dân tộc độc lập có nguyên nhân là:',
    options: [
      'Sự thức tỉnh về ý thức dân tộc',
      'Sự phát triển của lực lượng sản xuất và khoa học công nghệ',
      'Nhu cầu xóa bỏ hàng rào ngăn cách giữa các dân tộc',
      'Quá trình hội nhập trong xã hội tư bản',
    ],
    answer: 0,
    explain: 'Nguyên nhân là sự thức tỉnh về ý thức dân tộc.',
  },
  {
    kind: 'mc',
    text: 'Trong phạm vi một quốc gia, xu hướng thứ hai của quan hệ dân tộc biểu hiện là:',
    options: [
      'Nỗ lực của từng tộc người đi đến tự do, bình đẳng, phồn vinh của dân tộc mình',
      'Phong trào đấu tranh giải phóng dân tộc, giành độc lập',
      'Các dân tộc hợp tác hình thành liên minh khu vực',
      'Xuất hiện những động lực thúc đẩy các dân tộc xích lại gần nhau trên mọi lĩnh vực',
    ],
    answer: 3,
    explain: 'Đó là biểu hiện của xu hướng liên hiệp, xích lại gần nhau.',
  },
  {
    kind: 'tf',
    text: 'Dân tộc (Ethnie) là cộng đồng người ổn định làm thành nhân dân một nước, có chung một nhà nước.',
    options: ['ĐÚNG', 'SAI'],
    answer: 1,
    explain: 'Đó là định nghĩa dân tộc theo nghĩa rộng; Ethnie không cần chung nhà nước.',
  },
  {
    kind: 'tf',
    text: 'Cương lĩnh dân tộc của chủ nghĩa Mác – Lênin có ba nội dung: bình đẳng, tự quyết, liên hiệp công nhân tất cả các dân tộc.',
    options: ['ĐÚNG', 'SAI'],
    answer: 0,
    explain: 'Ba nội dung: bình đẳng – tự quyết – liên hiệp công nhân tất cả các dân tộc.',
  },
];

const ROUND_TWO: Question[] = [
  {
    kind: 'mc',
    text: 'Việt Nam là quốc gia đa dân tộc với bao nhiêu dân tộc anh em?',
    options: ['45', '54', '63', '64'],
    answer: 1,
    explain: 'Việt Nam có 54 dân tộc anh em.',
  },
  {
    kind: 'mc',
    text: 'Điều nào KHÔNG phải đặc điểm dân tộc ở Việt Nam?',
    options: [
      'Có sự chênh lệch về số dân giữa các tộc người',
      'Các dân tộc cư trú xen kẽ nhau',
      'Có trình độ phát triển không đều',
      'Các dân tộc cư trú tách biệt hoàn toàn theo từng vùng',
    ],
    answer: 3,
    explain: 'Các dân tộc Việt Nam cư trú xen kẽ, không tách biệt hoàn toàn.',
  },
  {
    kind: 'mc',
    text: 'Các dân tộc thiểu số ở Việt Nam phân bố chủ yếu ở:',
    options: [
      'Địa bàn có vị trí chiến lược quan trọng',
      'Các đô thị lớn',
      'Đồng bằng ven biển',
      'Các khu công nghiệp tập trung',
    ],
    answer: 0,
    explain: 'Nhiều dân tộc thiểu số sống ở vùng biên giới, địa bàn chiến lược.',
  },
  {
    kind: 'mc',
    text: 'Truyền thống nào của các dân tộc Việt Nam được nêu trong bài?',
    options: [
      'Chỉ giữ bản sắc riêng, ít giao lưu',
      'Tự phát triển độc lập từng vùng',
      'Đoàn kết, gắn bó lâu đời trong cộng đồng dân tộc – quốc gia thống nhất',
      'Mỗi dân tộc một hệ thống chính trị riêng',
    ],
    answer: 2,
    explain: 'Đoàn kết, gắn bó lâu đời là truyền thống quý báu của các dân tộc.',
  },
  {
    kind: 'mc',
    text: 'Theo quan điểm của Đảng, vấn đề dân tộc và đoàn kết dân tộc là:',
    options: [
      'Vấn đề chỉ đặt ra trong chiến tranh',
      'Vấn đề tạm thời của vùng miền núi',
      'Vấn đề chỉ của các dân tộc thiểu số',
      'Vấn đề chiến lược cơ bản, lâu dài, đồng thời là vấn đề cấp bách hiện nay của cách mạng Việt Nam',
    ],
    answer: 3,
    explain: 'Đảng xác định đây là vấn đề chiến lược, lâu dài và cấp bách.',
  },
  {
    kind: 'mc',
    text: 'Trong quan hệ quốc tế, quyền bình đẳng giữa các dân tộc có nghĩa là:',
    options: [
      'Mỗi dân tộc chỉ có quyền, không có nghĩa vụ',
      'Quyền bình đẳng chỉ được ghi trên giấy tờ',
      'Không một dân tộc nào có quyền áp bức, bóc lột dân tộc khác',
      'Dân tộc lớn có quyền quyết định thay dân tộc nhỏ',
    ],
    answer: 2,
    explain: 'Bình đẳng quốc tế: không dân tộc nào được áp bức dân tộc khác.',
  },
  {
    kind: 'mc',
    text: 'Khi ưu tiên đầu tư phát triển kinh tế – xã hội vùng dân tộc và miền núi, trước hết cần tập trung vào:',
    options: [
      'Giao thông và cơ sở hạ tầng, xóa đói giảm nghèo',
      'Phát triển công nghiệp nặng',
      'Mở rộng đô thị hóa',
      'Phát triển thương mại xuất khẩu',
    ],
    answer: 0,
    explain: 'Ưu tiên giao thông, hạ tầng và xóa đói giảm nghèo trước hết.',
  },
  {
    kind: 'mc',
    text: '“Thông qua các chương trình, dự án phát triển kinh tế vùng dân tộc thiểu số, thúc đẩy kinh tế thị trường định hướng xã hội chủ nghĩa” thuộc chính sách về:',
    options: ['Chính trị', 'Kinh tế', 'Văn hóa', 'An ninh – quốc phòng'],
    answer: 1,
    explain: 'Đây là nội dung thuộc chính sách kinh tế.',
  },
  {
    kind: 'mc',
    text: 'Nội dung nào thuộc chính sách về an ninh – quốc phòng?',
    options: [
      'Nâng cao nhận thức của đồng bào về tầm quan trọng của đoàn kết dân tộc',
      'Mở rộng giao lưu văn hóa với quốc gia, khu vực, thế giới',
      'Tăng cường quan hệ quân dân, tạo thế trận quốc phòng toàn dân vùng đồng bào dân tộc sinh sống',
      'Thực hiện chính sách xã hội, đảm bảo an sinh xã hội',
    ],
    answer: 2,
    explain: 'Tăng cường quan hệ quân dân, xây dựng thế trận quốc phòng toàn dân.',
  },
  {
    kind: 'mc',
    text: 'Chính sách xã hội thực hiện bình đẳng, công bằng thông qua phát triển kinh tế – xã hội, xóa đói giảm nghèo và các lĩnh vực nào?',
    options: [
      'Dân số, y tế, giáo dục',
      'Thương mại, tài chính, ngân hàng',
      'Công nghiệp, nông nghiệp, dịch vụ',
      'Giao thông, bưu chính, viễn thông',
    ],
    answer: 0,
    explain: 'Dân số, y tế, giáo dục là các lĩnh vực của chính sách xã hội.',
  },
  {
    kind: 'tf',
    text: 'Các dân tộc ở Việt Nam cư trú xen kẽ nhau.',
    options: ['ĐÚNG', 'SAI'],
    answer: 0,
    explain: 'Đúng. Các dân tộc ở Việt Nam cư trú xen kẽ nhau.',
  },
  {
    kind: 'tf',
    text: 'Các dân tộc ở Việt Nam có trình độ phát triển đồng đều.',
    options: ['ĐÚNG', 'SAI'],
    answer: 1,
    explain: 'Sai. Trình độ phát triển giữa các dân tộc không đều.',
  },
];

const questionBank = (round: Round) => (round === 1 ? ROUND_ONE : ROUND_TWO);

// ─────────────────────────────────────────────────────────────────────────────
// Pixel-art engine
// ─────────────────────────────────────────────────────────────────────────────

type Sprite = { rows: string[] };

const PAL: Record<string, string> = {
  k: C.ink,
  w: '#6b4328',
  W: C.woodLight,
  g: C.gold,
  G: C.goldDark,
  l: C.cream,
  s: '#f0b07a',
  h: '#d1493f',
  c: C.moss,
  b: '#7a4a2a',
  y: C.gold,
  p: '#1f3b34',
  P: '#2f5d50',
  r: C.coral,
  d: C.purple,
  m: '#8b5e8f',
};

const CHEST: Sprite = {
  rows: [
    '....kkkk....',
    '...kggggk...',
    '..kWWWWWWk..',
    '.kWWWWWWWWk.',
    '.kkkkkkkkkk.',
    '.kWwwwwwwWk.',
    '.kWwwggwwWk.',
    '.kWwwwwwwWk.',
    '.kkkkkkkkkk.',
    '..kkkkkkkk..',
  ],
};

const CHEST_OPEN: Sprite = {
  rows: [
    '..kkkkkkkk..',
    '.kggggggggk.',
    'kggllllllggk',
    '.kggggggggk.',
    '.kkkkkkkkkk.',
    '.kWwwwwwwWk.',
    '.kWwwggwwWk.',
    '.kWwwwwwwWk.',
    '.kkkkkkkkkk.',
    '..kkkkkkkk..',
  ],
};

const MIMIC: Sprite = {
  rows: [
    '..kkkkkkkkkkkk..',
    '.kWWWWWWWWWWWWk.',
    '.kWWkkWWWWkkWWk.',
    '.kWWkkWWWWkkWWk.',
    '.kWWWWWWWWWWWWk.',
    '.kkkkkkkkkkkkkk.',
    '.kWWWWWWWWWWWWk.',
    '.kWWWWrrrrWWWWk.',
    '.kWWWWrrrrWWWWk.',
    '.kkkkkkkkkkkkkk.',
    '..kkkkkkkkkkkk..',
  ],
};

const HERO: Sprite = {
  rows: [
    '....kkkk....',
    '...khhhhk...',
    '..khhhhhhk..',
    '..kkkkkkkk..',
    '...kssssk...',
    '...kskksk...',
    '...kssssk...',
    '....kssk....',
    '...kyyyyk...',
    '..kcccccck..',
    '.kcccccccck.',
    '.kcccccccck.',
    '.kcccccccck.',
    '..kcccccck..',
    '...kk..kk...',
    '...bb..bb...',
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
}: {
  sprite: Sprite;
  scale?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const shadows: string[] = [];
  sprite.rows.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const color = PAL[ch];
      if (!color) return;
      shadows.push(`${x * scale}px ${y * scale}px 0 0 ${color}`);
    });
  });
  const w = Math.max(...sprite.rows.map((r) => r.length));
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

// ─────────────────────────────────────────────────────────────────────────────
// Small UI pieces
// ─────────────────────────────────────────────────────────────────────────────

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
};

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

const starShadow = (() => {
  const out: string[] = [];
  for (let i = 0; i < 62; i += 1) {
    const x = (i * 197 + 43) % 1900;
    const y = (i * 113 + 19) % 560;
    const spread = i % 11 === 0 ? 3 : i % 5 === 0 ? 2 : 1;
    out.push(`${x}px ${y}px 0 ${spread}px ${i % 9 === 0 ? C.gold : '#fff3cf'}`);
  }
  return out.join(', ');
})();

const Ridge = ({
  heights,
  color,
  height,
  bottom = 94,
  opacity = 1,
}: {
  heights: number[];
  color: string;
  height: number;
  bottom?: number;
  opacity?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: -40,
      right: -40,
      bottom,
      height,
      background: color,
      clipPath: ridgePoly(heights),
      opacity,
      zIndex: 1,
    }}
  />
);

const FIREFLIES = [
  { x: 220, y: 430, d: 0 },
  { x: 520, y: 560, d: 0.8 },
  { x: 1180, y: 470, d: 1.5 },
  { x: 1520, y: 610, d: 0.4 },
  { x: 1760, y: 380, d: 1.1 },
];

const World = ({
  variant,
  dim = 0,
  children,
  moon = true,
  moonOpacity = 0.75,
  moonTop = 96,
}: {
  variant: 'forest' | 'mountain';
  dim?: number;
  children: ReactNode;
  moon?: boolean;
  moonOpacity?: number;
  moonTop?: number;
}) => {
  const forest = variant === 'forest';
  return (
    <div
      style={{
        ...fill,
        background: forest
          ? `linear-gradient(180deg, ${C.night} 0%, #262347 38%, #4a3a63 66%, #8a5568 88%, #c07a5a 100%)`
          : `linear-gradient(180deg, ${C.night} 0%, #151d3e 42%, #2d3d6b 72%, #5a6b9a 100%)`,
        color: 'var(--osd-text)',
        fontFamily: F.body,
      }}
    >
      <div
        style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, boxShadow: starShadow, zIndex: 0 }}
      />
      <div
        className="mg-twinkle"
        style={{
          position: 'absolute',
          left: 30,
          top: 30,
          width: 1,
          height: 1,
          boxShadow: starShadow,
          opacity: 0.5,
          zIndex: 0,
          animationDelay: '-1.4s',
        }}
      />
      {moon && (
        <>
          <div
            style={{
              position: 'absolute',
              right: 190,
              top: moonTop - 26,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,236,180,.20) 0%, rgba(255,236,180,0) 68%)',
              zIndex: 0,
            }}
          />
          <PixelSprite
            sprite={MOON}
            scale={12}
            style={{ position: 'absolute', right: 220, top: moonTop, opacity: moonOpacity, zIndex: 0 }}
          />
        </>
      )}
      <Ridge
        heights={forest ? [58, 52, 62, 48, 56, 44, 60, 50, 64, 46, 58, 52] : [40, 54, 36, 60, 44, 66, 38, 58, 48, 62, 42, 56]}
        color={forest ? '#3b3159' : '#36466f'}
        height={380}
        opacity={0.65}
      />
      <Ridge
        heights={forest ? [66, 58, 70, 54, 64, 60, 72, 56, 68, 62, 70, 58] : [56, 68, 46, 74, 58, 78, 50, 70, 60, 74, 52, 66]}
        color={forest ? '#2b2545' : '#24335a'}
        height={280}
        opacity={0.9}
      />
      <Ridge
        heights={forest ? [76, 70, 82, 66, 78, 72, 84, 68, 80, 74, 82, 70] : [70, 80, 62, 84, 72, 88, 66, 82, 74, 84, 68, 78]}
        color={forest ? '#161426' : '#141d36'}
        height={180}
      />
      {forest && (
        <>
          <PixelSprite sprite={PINE} scale={7} style={{ position: 'absolute', left: 120, bottom: 98, opacity: 0.9, zIndex: 2 }} />
          <PixelSprite sprite={PINE} scale={5} style={{ position: 'absolute', left: 250, bottom: 100, opacity: 0.7, zIndex: 2 }} />
          <PixelSprite sprite={PINE} scale={8} style={{ position: 'absolute', right: 160, bottom: 98, opacity: 0.75, zIndex: 2 }} />
          <PixelSprite sprite={PINE} scale={5} style={{ position: 'absolute', right: 320, bottom: 100, opacity: 0.55, zIndex: 2 }} />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 112,
          zIndex: 3,
          background: 'linear-gradient(180deg, #3c6b52 0 16px, #23301f 16px 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '16px 0 0',
            opacity: 0.55,
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 2px, transparent 2px 48px), repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 32px)',
          }}
        />
      </div>
      {FIREFLIES.map((f, i) => (
        <div
          key={i}
          className="mg-float"
          style={{
            position: 'absolute',
            left: f.x,
            top: f.y,
            width: 8,
            height: 8,
            background: C.gold,
            boxShadow: `0 0 14px ${C.gold}`,
            zIndex: 2,
            animationDelay: `${f.d}s`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 38%, transparent 48%, rgba(5,4,12,.62) 100%)',
        }}
      />
      {dim > 0 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: `rgba(8,6,16,${dim})` }} />
      )}
      {children}
      <div className="mg-scan" />
    </div>
  );
};

const Panel = ({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      background: C.panel,
      border: `4px solid ${C.ink}`,
      boxShadow: `0 0 0 3px ${C.goldDark}, 0 10px 0 rgba(0,0,0,.42)`,
      ...style,
    }}
  >
    {children}
  </div>
);

const Paper = ({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) => (
  <div
    className={className}
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, rgba(120,90,50,.055) 0 1px, transparent 1px 4px), linear-gradient(180deg, #f7ebcd 0%, #ecd9b2 100%)',
      border: `5px solid ${C.ink}`,
      boxShadow: `0 0 0 4px ${C.goldDark}, 0 16px 0 rgba(0,0,0,.45)`,
      color: '#241d16',
      ...style,
    }}
  >
    {children}
  </div>
);

const pixelButtonTone = (tone: 'gold' | 'dark' | 'mint' | 'coral' | 'ghost') => {
  switch (tone) {
    case 'gold':
      return { bg: C.gold, fg: C.ink, shadow: '#b8862a' };
    case 'mint':
      return { bg: C.mint, fg: C.ink, shadow: '#3b8a63' };
    case 'coral':
      return { bg: C.coral, fg: C.ink, shadow: '#8f2c28' };
    case 'ghost':
      return { bg: 'rgba(21,18,42,.9)', fg: C.parchment, shadow: '#07060f' };
    default:
      return { bg: C.night2, fg: C.parchment, shadow: '#07060f' };
  }
};

const PixelButton = ({
  children,
  onClick,
  tone = 'gold',
  fontSize = 30,
  style,
  disabled = false,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'gold' | 'dark' | 'mint' | 'coral' | 'ghost';
  fontSize?: number;
  style?: CSSProperties;
  disabled?: boolean;
  ariaLabel?: string;
}) => {
  const t = pixelButtonTone(tone);
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
        border: `4px solid ${C.ink}`,
        boxShadow: `inset 0 -7px 0 rgba(0,0,0,.22), 0 6px 0 ${t.shadow}, 0 6px 0 4px ${C.ink}`,
        padding: '16px 28px',
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

const HudBar = ({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      top: 28,
      left: 40,
      right: 40,
      height: 84,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(17,14,30,.93)',
      border: `4px solid ${C.ink}`,
      boxShadow: `0 0 0 3px rgba(184,134,42,.7), 0 8px 0 rgba(0,0,0,.35)`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>{left}</div>
    {center && (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {center}
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>{right}</div>
  </div>
);

const RoundLabel = ({ round }: { round: Round }) => (
  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
    <span style={{ fontFamily: F.display, fontSize: 32, fontWeight: 800, color: C.gold, letterSpacing: 2 }}>
      VÒNG {round}
    </span>
    <span style={{ fontFamily: F.mono, fontSize: 23, color: C.muted, letterSpacing: 1, marginTop: 3 }}>
      {roundMeta[round].zone}
    </span>
  </div>
);

const Pips = ({ opened }: { opened: boolean[] }) => {
  const count = opened.filter(Boolean).length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      {opened.map((value, index) => (
        <div
          key={index}
          style={{
            width: 17,
            height: 24,
            background: value ? C.gold : C.dim,
            border: `3px solid ${C.ink}`,
            boxShadow: value ? `inset 0 0 0 2px ${C.goldDark}` : 'none',
          }}
        />
      ))}
      <span style={{ fontFamily: F.mono, fontSize: 30, color: C.parchment, marginLeft: 8 }}>
        {count}/8
      </span>
    </div>
  );
};

const TimerBar = ({
  remaining,
  started,
  locked,
}: {
  remaining: number;
  started: boolean;
  locked: boolean;
}) => {
  const danger = started && remaining <= 5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 40,
          color: danger ? C.coral : C.gold,
          minWidth: 68,
          textAlign: 'right',
          lineHeight: 1,
        }}
      >
        {remaining}s
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 15 }, (_, i) => {
          const on = i < remaining;
          return (
            <div
              key={i}
              style={{
                width: 9,
                height: 26,
                background: on ? (danger ? C.coral : C.gold) : C.dim,
                border: `2px solid ${C.ink}`,
                opacity: locked ? 0.65 : 1,
              }}
            />
          );
        })}
      </div>
      <span
        style={{
          fontFamily: F.mono,
          fontSize: 22,
          color: started ? C.muted : C.gold,
          letterSpacing: 1,
          minWidth: 86,
        }}
      >
        {locked ? 'KHOÁ' : started ? 'ĐANG CHẠY' : 'SẴN SÀNG'}
      </span>
    </div>
  );
};

const fadeDelay = (i: number) => ({ '--mg-d': `${i * 18}ms` }) as CSSProperties;

const Mosaic = ({ cols = 20, rows = 12 }: { cols?: number; rows?: number }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      pointerEvents: 'none',
      zIndex: 6,
    }}
  >
    {Array.from({ length: cols * rows }, (_, i) => (
      <div
        key={i}
        className="mg-cell"
        style={{
          background: '#100d1e',
          ...fadeDelay((i % cols) + Math.floor(i / cols)),
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Board
// ─────────────────────────────────────────────────────────────────────────────

const layoutFor = (round: Round) =>
  round === 1
    ? { cols: 4, rows: 2, w: 250, h: 300, gap: 24, top: 150 }
    : { cols: 2, rows: 4, w: 280, h: 148, gap: 20, top: 150 };

const fragmentStyle = (round: Round, index: number): CSSProperties => {
  const { cols, rows } = layoutFor(round);
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    backgroundImage: `url(${roundMeta[round].image})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${cols === 1 ? 0 : (col / (cols - 1)) * 100}% ${
      rows === 1 ? 0 : (row / (rows - 1)) * 100
    }%`,
    backgroundRepeat: 'no-repeat',
  };
};

const Tile = ({
  round,
  index,
  opened,
  justOpened,
  disabled,
  onClick,
}: {
  round: Round;
  index: number;
  opened: boolean;
  justOpened: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  const { w, h } = layoutFor(round);
  const wide = round === 2;
  const num = String(index + 1).padStart(2, '0');

  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <button
        type="button"
        className="mg-tile"
        onClick={onClick}
        disabled={disabled || opened}
        aria-label={`Mở rương số ${index + 1}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: 0,
          border: `4px solid ${opened ? C.gold : C.ink}`,
          background: opened
            ? C.ink
            : 'linear-gradient(180deg, #2a2342 0%, #1a1730 100%)',
          boxShadow: opened
            ? `0 0 0 3px ${C.goldDark}, 0 10px 0 rgba(0,0,0,.4), 0 0 26px rgba(255,207,92,.15)`
            : `0 0 0 3px #06050c, 0 10px 0 rgba(0,0,0,.42)`,
          cursor: opened || disabled ? 'default' : 'pointer',
          overflow: 'hidden',
        }}
      >
        {opened ? (
          <div className={justOpened ? 'mg-tile-open' : undefined} style={{ position: 'absolute', inset: 0 }}>
            <div style={{ position: 'absolute', inset: 8, ...fragmentStyle(round, index), border: `3px solid ${C.gold}`, backgroundClip: 'padding-box' }} />
            <div style={{ position: 'absolute', inset: 8, background: 'linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)' }} />
            <div style={{ position: 'absolute', left: 12, top: 12, fontFamily: F.mono, fontSize: wide ? 22 : 24, color: C.cream, background: 'rgba(11,10,20,.8)', border: `2px solid ${C.goldDark}`, padding: '2px 7px' }}>
              {num}
            </div>
            <div style={{ position: 'absolute', right: 12, bottom: 12, fontFamily: F.mono, fontSize: wide ? 22 : 24, color: C.ink, background: C.gold, border: `2px solid ${C.ink}`, padding: '2px 8px', transform: 'rotate(-4deg)' }}>
              ĐÃ MỞ ✓
            </div>
            {justOpened && (
              <div style={{ position: 'absolute', left: 12, bottom: 12, fontFamily: F.display, fontSize: 20, fontWeight: 800, letterSpacing: 1, color: C.mint }}>
                MẢNH MỚI!
              </div>
            )}
          </div>
        ) : (
          <div className="mg-dither" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: wide ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: wide ? 18 : 0 }}>
            {wide ? (
              <>
                <div style={{ fontFamily: F.display, fontSize: 62, fontWeight: 800, color: C.gold, opacity: 0.9, width: 64, textAlign: 'center' }}>
                  {num}
                </div>
                <PixelSprite sprite={CHEST} scale={9} className="mg-bob" />
              </>
            ) : (
              <>
                <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: 2, color: C.gold, opacity: 0.8 }}>
                  MẢNH {num}
                </div>
                <div style={{ position: 'absolute', fontFamily: F.display, fontSize: 180, fontWeight: 800, color: 'rgba(255,207,92,.07)', lineHeight: 1, top: 42 }}>
                  ?
                </div>
                <PixelSprite sprite={CHEST} scale={16} className="mg-bob" style={{ marginTop: 10 }} />
                <div style={{ position: 'absolute', bottom: 16, fontFamily: F.mono, fontSize: 24, color: C.muted, letterSpacing: 2 }}>
                  CHẠM ĐỂ MỞ
                </div>
              </>
            )}
          </div>
        )}
      </button>
      <div
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          bottom: -14,
          height: 14,
          background: 'linear-gradient(180deg, #5fb37a 0 5px, #3c6b52 5px 100%)',
          border: `3px solid ${C.ink}`,
          boxShadow: '0 5px 0 rgba(0,0,0,.35)',
        }}
      />
    </div>
  );
};

const QuestLog = ({ text, action }: { text: string; action?: ReactNode }) => (
  <div
    style={{
      position: 'absolute',
      left: 280,
      right: 64,
      top: 840,
      height: 92,
      zIndex: 25,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 26px',
      background: 'linear-gradient(180deg, #f7ebcd 0%, #ecd9b2 100%)',
      border: `4px solid ${C.ink}`,
      boxShadow: `0 0 0 3px ${C.goldDark}, 0 8px 0 rgba(0,0,0,.4)`,
      color: '#241d16',
    }}
  >
    <span className="mg-blink" style={{ fontFamily: F.mono, fontSize: 34, color: '#7a4a2a', lineHeight: 1 }}>
      ▶
    </span>
    <span style={{ fontFamily: F.mono, fontSize: 31, lineHeight: 1.15, flex: 1 }}>{text}</span>
    {action}
  </div>
);

const GuessModal = ({
  round,
  onClose,
  onCorrect,
  onWrong,
}: {
  round: Round;
  onClose: () => void;
  onCorrect: () => void;
  onWrong: () => void;
}) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={`Đoán ảnh bí mật vòng ${round}`}
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 70,
      background: 'rgba(6,4,14,.78)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 80,
    }}
  >
    <Paper className="mg-pop" style={{ width: 1000, padding: 48 }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: '#7a4a2a' }}>
        VÒNG {round} · LƯỢT ĐOÁN ẢNH
      </div>
      <div style={{ fontFamily: F.display, fontSize: 72, fontWeight: 800, lineHeight: 0.95, marginTop: 12 }}>
        BỨC TRANH BÍ MẬT
        <br />
        LÀ GÌ?
      </div>
      <p style={{ fontFamily: F.body, fontSize: 25, lineHeight: 1.6, margin: '20px 0 0', color: '#4a3a28' }}>
        Mời đội chơi đưa ra đáp án. MC theo dõi tối đa <strong>2 lượt/người</strong>. Trả lời đúng nhận{' '}
        <strong>+20 điểm</strong> và kết thúc vòng.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <PixelButton tone="mint" onClick={onCorrect} fontSize={30}>
          ✓ ĐOÁN ĐÚNG
        </PixelButton>
        <PixelButton tone="coral" onClick={onWrong} fontSize={30}>
          ✕ ĐOÁN SAI
        </PixelButton>
        <PixelButton tone="ghost" onClick={onClose} fontSize={30} style={{ marginLeft: 'auto' }}>
          ĐÓNG
        </PixelButton>
      </div>
    </Paper>
  </div>
);

const RescueModal = ({
  remaining,
  onOpenAll,
  onClose,
}: {
  remaining: number;
  onOpenAll: () => void;
  onClose: () => void;
}) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Mở nốt các rương còn lại"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 70,
      background: 'rgba(6,4,14,.78)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 80,
    }}
  >
    <Paper className="mg-pop" style={{ width: 920, padding: 46 }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: '#7a4a2a' }}>
        HẾT CÂU HỎI CỦA VÒNG
      </div>
      <div style={{ fontFamily: F.display, fontSize: 60, fontWeight: 800, lineHeight: 1, marginTop: 12 }}>
        CÒN {remaining} RƯƠNG CHƯA MỞ
      </div>
      <p style={{ fontFamily: F.body, fontSize: 24, lineHeight: 1.6, margin: '18px 0 0', color: '#4a3a28' }}>
        Ngân hàng 12 câu đã dùng hết. MC có thể mở nốt các rương còn lại để công bố bức tranh và giữ nhịp chương trình. Các rương mở nốt không tính điểm.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 30 }}>
        <PixelButton tone="gold" onClick={onOpenAll} fontSize={28}>
          MỞ NỐT {remaining} RƯƠNG →
        </PixelButton>
        <PixelButton tone="ghost" onClick={onClose} fontSize={28}>
          QUAY LẠI
        </PixelButton>
      </div>
    </Paper>
  </div>
);

const Hero = ({ style, className }: { style?: CSSProperties; className?: string }) => (
  <PixelSprite sprite={HERO} scale={7} className={className} style={style} />
);

const Board = ({ round }: { round: Round }) => {
  const [state, update] = useGame();
  const [guessOpen, setGuessOpen] = useState(false);
  const [rescueOpen, setRescueOpen] = useState(false);
  const [hopping, setHopping] = useState<number | null>(null);
  const [heroPos, setHeroPos] = useState({ left: 120, top: 812 });
  const [toast, setToast] = useState('');
  const [flashTile, setFlashTile] = useState<number | null>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const layout = layoutFor(round);
  const opened = state.opened[ri(round)];
  const used = state.used[ri(round)];
  const count = opened.filter(Boolean).length;
  const guessed = state.guessed[ri(round)];
  const roundOver = guessed || count === 8;
  const roundScore = scoreForRound(state, round);
  const gridW = layout.cols * layout.w + (layout.cols - 1) * layout.gap;
  const gridH = layout.rows * layout.h + (layout.rows - 1) * layout.gap;
  const gridLeft = (1920 - gridW) / 2;
  const nextQuestion = firstUnused(used);
  const nextTile = opened.findIndex((value) => !value);

  useEffect(() => {
    const [r, t] = state.lastOpened.split('-');
    if (Number(r) !== round) return;
    const tile = Number(t);
    if (!Number.isInteger(tile) || tile < 0 || tile > 7) return;
    setFlashTile(tile);
    flashTimer.current = setTimeout(() => setFlashTile(null), 2600);
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, [state.lastOpened, round]);

  useEffect(
    () => () => {
      if (navTimer.current) clearTimeout(navTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  const showToast = (text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };

  const chooseTile = (index: number) => {
    if (opened[index] || hopping !== null || roundOver) return;
    if (nextQuestion === null) {
      setRescueOpen(true);
      return;
    }
    const col = index % layout.cols;
    const row = Math.floor(index / layout.cols);
    setHopping(index);
    setHeroPos({
      left: gridLeft + col * (layout.w + layout.gap) + layout.w / 2 - 42,
      top: layout.top + row * (layout.h + layout.gap) + layout.h - 92,
    });
    update({ activeTile: index });
    navTimer.current = setTimeout(() => {
      goPage(questionStart(round) + nextQuestion);
    }, 430);
  };

  const openAll = () => {
    update((prev) => ({
      opened: prev.opened.map((row, r) =>
        r === ri(round) ? row.map(() => true) : row,
      ),
      lastOpened: `${round}-${nextTile}`,
      activeTile: null,
    }));
    setRescueOpen(false);
    goPage(revealPage(round));
  };

  const correctGuess = () => {
    if (count === 8) {
      setGuessOpen(false);
      goPage(revealPage(round));
      return;
    }
    update((prev) => {
      const already = prev.guessed[ri(round)];
      return {
        guessed: prev.guessed.map((value, i) => (i === ri(round) ? true : value)),
        score: prev.score.map((value, i) => (i === ri(round) && !already ? value + 20 : value)),
      };
    });
    setGuessOpen(false);
    goPage(revealPage(round));
  };

  const wrongGuess = () => {
    setGuessOpen(false);
    showToast('Đã ghi nhận lượt đoán sai — MC theo dõi 2 lượt/người.');
  };

  const logText = roundOver
    ? guessed
      ? 'Vòng đã kết thúc bằng lượt đoán đúng. Mời công bố bức tranh!'
      : 'Đã mở đủ 8 mảnh! Mời công bố bức tranh.'
    : count > 0
      ? `Còn ${8 - count} rương chưa mở. Chọn một rương để nhận câu hỏi.`
      : 'Chọn một rương bất kỳ để bắt đầu. Trả lời đúng mới mở được mảnh ghép!';

  return (
    <World variant={roundMeta[round].variant} moonOpacity={0.42} moonTop={146}>
      <HudBar
        left={
          <>
            <RoundLabel round={round} />
            <div style={{ width: 2, height: 42, background: 'rgba(244,232,193,.16)' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
              <span style={{ fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 1 }}>ĐIỂM</span>
              <span style={{ fontFamily: F.mono, fontSize: 38, color: C.gold, lineHeight: 1 }}>
                {roundScore}
              </span>
            </div>
          </>
        }
        center={<Pips opened={opened} />}
        right={
          roundOver ? (
            <PixelButton tone="gold" fontSize={27} onClick={() => goPage(revealPage(round))}>
              {guessed ? 'XEM ĐÁP ÁN →' : 'CÔNG BỐ ĐÁP ÁN →'}
            </PixelButton>
          ) : (
            <PixelButton
              tone="gold"
              fontSize={27}
              onClick={() => setGuessOpen(true)}
              ariaLabel="Đoán ảnh bí mật"
            >
              ? ĐOÁN ẢNH
            </PixelButton>
          )
        }
      />

      <div
        style={{
          position: 'absolute',
          left: gridLeft,
          top: layout.top,
          width: gridW,
          height: gridH,
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.cols}, ${layout.w}px)`,
          gridTemplateRows: `repeat(${layout.rows}, ${layout.h}px)`,
          gap: layout.gap,
        }}
      >
        {Array.from({ length: 8 }, (_, index) => (
          <Tile
            key={index}
            round={round}
            index={index}
            opened={opened[index]}
            justOpened={flashTile === index}
            disabled={hopping !== null || roundOver}
            onClick={() => chooseTile(index)}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', left: 96, top: 812, zIndex: 20 }}>
        <Hero
          className={hopping !== null ? 'mg-hop' : 'mg-bob-slow'}
          style={{
            left: hopping !== null ? heroPos.left - 96 : 24,
            top: hopping !== null ? heroPos.top - 812 : 0,
            position: 'absolute',
            transition: 'left 420ms steps(6, end), top 420ms steps(6, end)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 112,
            width: 150,
            height: 14,
            background: 'linear-gradient(180deg, #5fb37a 0 5px, #3c6b52 5px 100%)',
            border: `3px solid ${C.ink}`,
            boxShadow: '0 5px 0 rgba(0,0,0,.35)',
          }}
        />
      </div>

      <QuestLog
        text={logText}
        action={
          roundOver ? (
            <PixelButton tone="gold" fontSize={24} onClick={() => goPage(revealPage(round))}>
              XEM ĐÁP ÁN →
            </PixelButton>
          ) : nextQuestion === null ? (
            <PixelButton tone="coral" fontSize={24} onClick={() => setRescueOpen(true)}>
              MỞ NỐT
            </PixelButton>
          ) : undefined
        }
      />

      {toast && (
        <div
          className="mg-pop"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 112,
            transform: 'translateX(-50%)',
            zIndex: 65,
            background: C.ink,
            color: C.parchment,
            border: `3px solid ${C.gold}`,
            boxShadow: `0 0 0 3px ${C.ink}`,
            padding: '12px 26px',
            fontFamily: F.mono,
            fontSize: 26,
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}

      {guessOpen && (
        <GuessModal
          round={round}
          onClose={() => setGuessOpen(false)}
          onCorrect={correctGuess}
          onWrong={wrongGuess}
        />
      )}
      {rescueOpen && (
        <RescueModal
          remaining={8 - count}
          onOpenAll={openAll}
          onClose={() => setRescueOpen(false)}
        />
      )}
    </World>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Question screen
// ─────────────────────────────────────────────────────────────────────────────

const DoneQuestion = ({ round, index }: { round: Round; index: number }) => {
  const q = questionBank(round)[index];
  const [state] = useGame();
  return (
    <World variant={roundMeta[round].variant} dim={0.4} moon={false}>
      <HudBar
        left={
          <>
            <RoundLabel round={round} />
            <div style={{ width: 2, height: 42, background: 'rgba(244,232,193,.16)' }} />
            <span style={{ fontFamily: F.mono, fontSize: 26, color: C.muted, letterSpacing: 1 }}>
              CÂU {String(index + 1).padStart(2, '0')} / 12
            </span>
          </>
        }
        center={<Pips opened={state.opened[ri(round)]} />}
      />
      <Paper
        className="mg-in"
        style={{ position: 'absolute', left: 360, top: 230, width: 1200, padding: 46, zIndex: 20 }}
      >
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: '#7a4a2a' }}>
          CÂU HỎI ĐÃ HOÀN THÀNH
        </div>
        <p style={{ fontFamily: F.body, fontSize: 32, lineHeight: 1.5, margin: '18px 0', whiteSpace: 'pre-line' }}>
          {q.text}
        </p>
        <div style={{ background: 'rgba(95,179,122,.18)', border: '3px solid #3b8a63', padding: '14px 18px', fontFamily: F.body, fontSize: 24 }}>
          <strong>Đáp án:</strong> {q.options[q.answer]}
        </div>
        <p style={{ fontFamily: F.body, fontSize: 22, color: '#4a3a28', marginTop: 14 }}>{q.explain}</p>
        <PixelButton
          tone="gold"
          fontSize={26}
          onClick={() => goPage(boardPage(round))}
          style={{ marginTop: 22 }}
        >
          ← VỀ BÀN CHƠI
        </PixelButton>
      </Paper>
    </World>
  );
};

const QuestionScreen = ({ round, index }: { round: Round; index: number }) => {
  const q = questionBank(round)[index];
  const [state, update] = useGame();
  const active = useIsActivePage();
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(15);
  const [answeredHere, setAnsweredHere] = useState(false);
  const [opening, setOpening] = useState(false);

  const openedHere = state.opened[ri(round)];
  const usedHere = state.used[ri(round)];
  const roundScore = scoreForRound(state, round);
  const activeTile = state.activeTile ?? openedHere.findIndex((value) => !value);
  const tileNumber = activeTile >= 0 ? String(activeTile + 1).padStart(2, '0') : '--';

  useEffect(() => {
    if (!active) return;
    if (state.activeTile === null) {
      const next = state.opened[ri(round)].findIndex((value) => !value);
      if (next >= 0) update({ activeTile: next });
    }
  }, [active, state.activeTile, state.opened, round, update]);

  useEffect(() => {
    if (!active) return;
    if (state.guessed[ri(round)] || openedHere.every(Boolean)) {
      goPage(revealPage(round));
    }
  }, [active, openedHere, round, state.guessed]);

  useEffect(() => {
    if (!active || !started || locked) return;
    if (remaining <= 0) {
      setLocked(true);
      setTimedOut(true);
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [active, started, locked, remaining]);

  const usedBefore = usedHere.includes(index) && !answeredHere;
  if (usedBefore) return <DoneQuestion round={round} index={index} />;

  const correct = locked && !timedOut && picked === q.answer;
  const wrong = locked && !correct;
  const isLastUnused = firstUnused(usedHere) === index && usedHere.length === QUESTION_COUNT - 1;

  const answer = (value: number) => {
    if (locked) return;
    setStarted(true);
    setPicked(value);
    setLocked(true);
    setTimedOut(false);
  };

  const undo = () => {
    setPicked(null);
    setLocked(false);
    setTimedOut(false);
    setStarted(false);
    setRemaining(15);
  };

  const markUsed = () => {
    update((prev) => ({ used: withUsed(prev.used, round, index) }));
  };

  const openTile = () => {
    if (opening) return;
    const tile = state.activeTile ?? state.opened[ri(round)].findIndex((value) => !value);
    const nextOpened = withOpened(state.opened, round, tile >= 0 ? tile : 0);
    const complete = nextOpened[ri(round)].every(Boolean);
    setOpening(true);
    update((prev) => {
      const current = prev.activeTile ?? prev.opened[ri(round)].findIndex((value) => !value);
      const wasOpen = current >= 0 && prev.opened[ri(round)][current];
      const openedState = withOpened(prev.opened, round, current >= 0 ? current : 0);
      return {
        used: withUsed(prev.used, round, index),
        opened: openedState,
        lastOpened: current >= 0 ? `${round}-${current}` : prev.lastOpened,
        activeTile: null,
        score: prev.score.map((value, i) => (i === ri(round) && current >= 0 && !wasOpen ? value + 10 : value)),
      };
    });
    setAnsweredHere(true);
    setTimeout(() => goPage(complete ? revealPage(round) : boardPage(round)), 380);
  };

  const leaveWrong = () => {
    if (opening) return;
    setOpening(true);
    const next = firstUnused([...usedHere, index]);
    markUsed();
    setAnsweredHere(true);
    goPage(next === null ? boardPage(round) : questionStart(round) + next);
  };

  const correctAnswerLabel = `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
  const statusColor = correct ? C.mint : C.coral;
  const feedback = !locked
    ? started
      ? 'Đang tính giờ... chọn đáp án của đội chơi.'
      : 'MC đọc câu hỏi, sau đó bấm BẮT ĐẦU 15 giây.'
    : correct
      ? 'CHÍNH XÁC! +10 ĐIỂM'
      : timedOut
        ? 'HẾT GIỜ!'
        : 'CHƯA ĐÚNG!';

  return (
    <World variant={roundMeta[round].variant} dim={0.4} moon={false}>
      <HudBar
        left={
          <>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: F.display, fontSize: 32, fontWeight: 800, color: C.gold, letterSpacing: 2 }}>
                MẢNH {tileNumber}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 1, marginTop: 3 }}>
                VÒNG {round} · {roundMeta[round].zone}
              </span>
            </div>
            <div style={{ width: 2, height: 42, background: 'rgba(244,232,193,.16)' }} />
            <span style={{ fontFamily: F.mono, fontSize: 26, color: C.parchment }}>
              CÂU {String(index + 1).padStart(2, '0')}/12
            </span>
          </>
        }
        center={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: F.mono, fontSize: 24, color: C.muted, letterSpacing: 1 }}>
              {q.kind === 'tf' ? 'ĐÚNG / SAI' : 'TRẮC NGHIỆM'}
            </span>
            <span style={{ width: 2, height: 28, background: 'rgba(244,232,193,.16)' }} />
            <span style={{ fontFamily: F.mono, fontSize: 24, color: C.gold, letterSpacing: 1 }}>
              ĐIỂM {roundScore}
            </span>
          </div>
        }
        right={<TimerBar remaining={remaining} started={started} locked={locked} />}
      />

      <Panel style={{ position: 'absolute', left: 64, top: 150, width: 400, height: 730, zIndex: 20, padding: 22 }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: 2, color: C.gold, textAlign: 'center' }}>
          RƯƠNG QUỶ · GIỮ MẢNH {tileNumber}
        </div>
        <div style={{ position: 'relative', height: 246, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <div style={{ position: 'absolute', inset: 22, background: 'radial-gradient(circle, rgba(255,107,107,.18), transparent 70%)' }} />
          <PixelSprite sprite={MIMIC} scale={14} className={wrong ? 'mg-shake' : 'mg-bob'} />
          <div
            style={{
              position: 'absolute',
              right: -4,
              top: 8,
              background: C.parchment,
              color: '#241d16',
              border: `3px solid ${C.ink}`,
              padding: '6px 10px',
              fontFamily: F.mono,
              fontSize: 19,
              transform: 'rotate(3deg)',
              maxWidth: 150,
              lineHeight: 1.1,
            }}
          >
            Trả lời đúng để lấy mảnh!
          </div>
        </div>

        <div style={{ position: 'relative', height: 252, border: `3px solid ${C.goldDark}`, overflow: 'hidden', background: C.ink }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              ...fragmentStyle(round, activeTile >= 0 ? activeTile : 0),
              filter: 'blur(11px) saturate(.65) brightness(.5)',
              transform: 'scale(1.14)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,7,18,.34)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: F.display, fontSize: 128, fontWeight: 800, color: 'rgba(255,207,92,.8)', lineHeight: 1 }}>
              ?
            </span>
          </div>
          <div style={{ position: 'absolute', left: 10, bottom: 8, fontFamily: F.mono, fontSize: 20, color: C.parchment, letterSpacing: 1 }}>
            MẢNH {tileNumber} · CHƯA MỞ
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 21, color: C.muted, lineHeight: 1.2 }}>
          <PixelSprite sprite={COIN} scale={4} />
          <span>ĐÚNG +10Đ · SAI 0Đ</span>
        </div>
        <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 20, color: 'rgba(244,232,193,.45)', lineHeight: 1.25 }}>
          15 giây mỗi câu. Hết giờ xem như trả lời sai.
        </div>
      </Panel>

      <div style={{ position: 'absolute', left: 500, top: 150, width: 1356, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: C.gold }}>
            CÂU HỎI {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ height: 2, flex: 1, background: 'rgba(255,207,92,.22)' }} />
          {isLastUnused && (
            <span style={{ fontFamily: F.mono, fontSize: 22, color: C.coral, letterSpacing: 1 }}>
              CÂU CUỐI CỦA NGÂN HÀNG
            </span>
          )}
        </div>
        <h2
          style={{
            fontFamily: F.body,
            fontSize: 46,
            fontWeight: 600,
            lineHeight: 1.3,
            margin: 0,
            color: C.parchment,
            textShadow: '0 3px 0 rgba(0,0,0,.35)',
            minHeight: 120,
          }}
        >
          {q.text}
        </h2>

        <div
          className={wrong && !timedOut ? 'mg-shake' : undefined}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}
        >
          {q.options.map((option, i) => {
            const isAnswer = locked && i === q.answer;
            const isPicked = picked === i;
            const isWrongPick = locked && isPicked && i !== q.answer;
            const dimmed = locked && !isAnswer && !isWrongPick;
            return (
              <button
                key={i}
                type="button"
                className="mg-opt"
                onClick={() => answer(i)}
                disabled={locked}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  width: '100%',
                  minHeight: 92,
                  padding: '16px 22px',
                  textAlign: 'left',
                  background: isAnswer
                    ? 'rgba(143,240,192,.14)'
                    : isWrongPick
                      ? 'rgba(255,107,107,.13)'
                      : 'rgba(21,18,42,.9)',
                  border: `3px solid ${
                    isAnswer ? C.mint : isWrongPick ? C.coral : 'rgba(255,207,92,.28)'
                  }`,
                  boxShadow: isAnswer
                    ? '0 0 0 3px rgba(143,240,192,.3)'
                    : isWrongPick
                      ? '0 0 0 3px rgba(255,107,107,.3)'
                      : 'none',
                  opacity: dimmed ? 0.42 : 1,
                  cursor: locked ? 'default' : 'pointer',
                  color: C.parchment,
                }}
              >
                <span
                  style={{
                    width: 54,
                    height: 54,
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isAnswer ? C.mint : isWrongPick ? C.coral : C.gold,
                    color: C.ink,
                    border: `3px solid ${C.ink}`,
                    fontFamily: F.display,
                    fontSize: 32,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {q.kind === 'tf' ? (i === 0 ? 'Đ' : 'S') : String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontFamily: F.body, fontSize: 30, fontWeight: 500, lineHeight: 1.35, flex: 1 }}>
                  {option}
                </span>
                {isAnswer && <span style={{ fontFamily: F.mono, fontSize: 34, color: C.mint }}>✓</span>}
                {isWrongPick && <span style={{ fontFamily: F.mono, fontSize: 34, color: C.coral }}>✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: 900,
          height: 96,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '0 24px',
          background: 'rgba(17,14,30,.95)',
          border: `4px solid ${C.ink}`,
          boxShadow: `0 0 0 3px rgba(184,134,42,.55), 0 8px 0 rgba(0,0,0,.4)`,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontFamily: F.mono, fontSize: 31, color: locked ? statusColor : C.parchment, letterSpacing: 1 }}>
              {feedback}
            </span>
            {locked && !correct && (
              <button
                type="button"
                onClick={undo}
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.gold,
                  fontFamily: F.mono,
                  fontSize: 22,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                ↺ Chọn lại
              </button>
            )}
          </div>
          {locked && (
            <div style={{ fontFamily: F.body, fontSize: 20, lineHeight: 1.35, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {correct
                ? q.explain
                : `Đáp án đúng: ${correctAnswerLabel}. ${q.explain}`}
            </div>
          )}
          {!locked && (
            <div style={{ fontFamily: F.body, fontSize: 18, color: 'rgba(244,232,193,.5)', marginTop: 3 }}>
              {started ? 'Hết 15 giây hệ thống tự khoá đáp án.' : 'Bấm BẮT ĐẦU để bắt đầu đồng hồ 15 giây.'}
            </div>
          )}
        </div>

        {!locked ? (
          <PixelButton
            tone="gold"
            fontSize={31}
            onClick={() => setStarted(true)}
            disabled={started}
            style={{ minWidth: 300, justifyContent: 'center' }}
          >
            {started ? '⏳ ĐANG TÍNH GIỜ' : '▶ BẮT ĐẦU 15s'}
          </PixelButton>
        ) : correct ? (
          <PixelButton tone="mint" fontSize={29} onClick={openTile} style={{ minWidth: 300 }}>
            {openedHere.filter(Boolean).length + 1 >= 8 ? 'XEM KẾT QUẢ →' : 'MỞ RƯƠNG →'}
          </PixelButton>
        ) : (
          <PixelButton tone="coral" fontSize={29} onClick={leaveWrong} style={{ minWidth: 300 }}>
            CÂU TIẾP THEO →
          </PixelButton>
        )}
      </div>
    </World>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Reveal
// ─────────────────────────────────────────────────────────────────────────────

const Reveal = ({ round }: { round: Round }) => {
  const [state] = useGame();
  const [revealed, setRevealed] = useState(false);
  const meta = roundMeta[round];
  const count = state.opened[ri(round)].filter(Boolean).length;
  const guessed = state.guessed[ri(round)];
  const roundScore = scoreForRound(state, round);
  const total = totalScore(state);
  const imgW = round === 1 ? 1080 : 680;
  const imgH = round === 1 ? 654 : 718;

  const publish = () => setRevealed(true);

  return (
    <World variant={meta.variant} dim={0.42} moonOpacity={0.52} moonTop={132}>
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 34,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: F.display, fontSize: 36, fontWeight: 800, color: C.gold, letterSpacing: 2 }}>
            VÒNG {round}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: 24, color: C.muted, letterSpacing: 2 }}>
            {meta.zone} · CÔNG BỐ BỨC TRANH
          </span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 24, color: C.parchment, letterSpacing: 1 }}>
          {count}/8 MẢNH
        </span>
      </div>

      <div style={{ position: 'absolute', left: 80, top: 180, width: imgW, height: imgH, zIndex: 20 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `5px solid ${C.ink}`,
            boxShadow: `0 0 0 4px ${C.goldDark}, 0 16px 0 rgba(0,0,0,.45)`,
            overflow: 'hidden',
            background: C.ink,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, ...fragmentStyleFull(round) }} />
          {revealed && <Mosaic key="reveal" />}
          {!revealed && (
            <div
              className="mg-dither"
              style={{
                position: 'absolute',
                inset: 0,
                background: '#12101f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
              }}
            >
              <div style={{ fontFamily: F.display, fontSize: 230, fontWeight: 800, color: 'rgba(255,207,92,.24)', lineHeight: 0.8 }}>
                ?
              </div>
              <PixelButton tone="gold" fontSize={30} onClick={publish}>
                CÔNG BỐ ĐÁP ÁN
              </PixelButton>
              <span style={{ fontFamily: F.mono, fontSize: 22, color: C.muted }}>
                {count === 8 ? 'ĐÃ MỞ ĐỦ 8 MẢNH · MỜI ĐOÁN LẦN CUỐI' : `MỚI MỞ ${count}/8 MẢNH`}
              </span>
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: -16,
            background: C.gold,
            color: C.ink,
            border: `3px solid ${C.ink}`,
            padding: '4px 12px',
            fontFamily: F.mono,
            fontSize: 22,
            letterSpacing: 1,
            transform: 'rotate(-2deg)',
          }}
        >
          {round === 1 ? 'POSTER 54 DÂN TỘC' : 'BẢN ĐỒ PHÂN BỐ'}
        </div>
      </div>

      <div style={{ position: 'absolute', left: round === 1 ? 1240 : 860, top: 180, width: round === 1 ? 620 : 1000, zIndex: 20 }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: 4, color: C.gold }}>
          ĐÁP ÁN VÒNG {round}
        </div>
        {revealed ? (
          <div className="mg-pop">
            <h2 style={{ fontFamily: F.display, fontSize: round === 1 ? 88 : 82, fontWeight: 800, lineHeight: 0.92, margin: '14px 0 0', color: C.parchment, textShadow: '0 6px 0 rgba(0,0,0,.4)' }}>
              {meta.answer}
              {meta.answerLine2 && (
                <>
                  <br />
                  <span style={{ color: C.gold }}>{meta.answerLine2}</span>
                </>
              )}
            </h2>
            <p style={{ fontFamily: F.mono, fontSize: 28, lineHeight: 1.35, color: C.muted, margin: '18px 0 0' }}>
              {meta.subtitle}
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 82, fontWeight: 800, lineHeight: 0.92, margin: 0, color: 'rgba(244,232,193,.5)' }}>
              BỨC TRANH
              <br />
              ĐÃ LỘ DIỆN?
            </h2>
            <p style={{ fontFamily: F.mono, fontSize: 27, lineHeight: 1.4, color: C.muted, margin: '18px 0 0' }}>
              Mời cả lớp đưa ra lượt đoán cuối. MC bấm công bố khi đã chốt đáp án.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34 }}>
          <Badge label={`${count}/8 MẢNH ĐÃ MỞ`} tone={count === 8 ? 'mint' : 'dark'} />
          {guessed && <Badge label="+20Đ ĐOÁN ĐÚNG" tone="gold" />}
          {round === 1 ? (
            <Badge label={`ĐIỂM VÒNG: ${roundScore}Đ`} tone="dark" />
          ) : (
            <Badge label={`TỔNG 2 VÒNG: ${total}Đ`} tone="dark" />
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 42, alignItems: 'center' }}>
          {revealed ? (
            <PixelButton
              tone="gold"
              fontSize={30}
              onClick={() => goPage(round === 1 ? PAGE.board2 : PAGE.knowledge)}
            >
              {round === 1 ? 'SANG VÒNG 2 →' : 'XEM KIẾN THỨC →'}
            </PixelButton>
          ) : (
            <PixelButton tone="gold" fontSize={30} onClick={publish}>
              CÔNG BỐ ĐÁP ÁN →
            </PixelButton>
          )}
          <PixelButton tone="ghost" fontSize={24} onClick={() => goPage(boardPage(round))}>
            ← BÀN CHƠI
          </PixelButton>
        </div>
      </div>
    </World>
  );
};

const fragmentStyleFull = (round: Round): CSSProperties => ({
  backgroundImage: `url(${roundMeta[round].image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const Badge = ({ label, tone }: { label: string; tone: 'gold' | 'mint' | 'dark' }) => {
  const map = {
    gold: { bg: C.gold, fg: C.ink, border: C.goldDark },
    mint: { bg: C.mint, fg: C.ink, border: '#3b8a63' },
    dark: { bg: 'rgba(21,18,42,.9)', fg: C.parchment, border: C.goldDark },
  } as const;
  const t = map[tone];
  return (
    <span
      style={{
        fontFamily: F.mono,
        fontSize: 23,
        letterSpacing: 1,
        background: t.bg,
        color: t.fg,
        border: `3px solid ${t.border}`,
        boxShadow: `0 0 0 2px ${C.ink}`,
        padding: '7px 12px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Cover / Rules / Knowledge
// ─────────────────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <World variant="forest" moonOpacity={0.95} moonTop={74}>
    <div className="mg-in" style={{ position: 'absolute', left: 120, top: 206, width: 1010, zIndex: 20 }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 5, color: C.gold }}>
        MINIGAME · CNXHKH NHÓM 3
      </div>
      <h1
        style={{
          fontFamily: F.display,
          fontSize: 186,
          fontWeight: 800,
          lineHeight: 0.78,
          letterSpacing: 2,
          margin: '22px 0 0',
          color: C.parchment,
          textShadow: '7px 7px 0 #0b0a14, 0 0 40px rgba(255,207,92,.16)',
        }}
      >
        PIXEL
        <br />
        <span style={{ color: C.gold }}>QUEST</span>
      </h1>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 28 }}>
        <span style={{ fontFamily: F.display, fontSize: 54, fontWeight: 800, color: C.parchment, letterSpacing: 3 }}>
          8 MẢNH KÝ ỨC
        </span>
        <span style={{ fontFamily: F.mono, fontSize: 27, color: C.muted }}>54 DÂN TỘC VIỆT NAM</span>
      </div>
      <p style={{ fontFamily: F.body, fontSize: 27, lineHeight: 1.6, color: '#d8cbaa', maxWidth: 820, margin: '14px 0 0' }}>
        Hai vùng đất. Tám rương khoá. Một bức tranh bí mật. Trả lời đúng, mở rương, ghép mảnh — và đoán xem bức tranh là gì.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 34 }}>
        <PixelButton tone="gold" fontSize={34} onClick={() => goPage(PAGE.rules)} style={{ padding: '20px 34px' }}>
          ▶ BẮT ĐẦU
        </PixelButton>
        <span className="mg-blink" style={{ fontFamily: F.mono, fontSize: 24, color: C.gold, letterSpacing: 2 }}>
          PRESS START
        </span>
      </div>
    </div>

    <div style={{ position: 'absolute', right: 190, top: 170, zIndex: 12 }}>
      <div style={{ position: 'relative', width: 470, height: 470 }}>
        <PixelSprite sprite={CHEST} scale={22} className="mg-bob" style={{ position: 'absolute', left: 88, top: 212 }} />
        <div
          className="mg-bob-slow"
          style={{
            position: 'absolute',
            left: 190,
            top: 0,
            fontFamily: F.display,
            fontSize: 150,
            fontWeight: 800,
            color: 'rgba(255,207,92,.7)',
            lineHeight: 1,
            textShadow: '5px 5px 0 rgba(11,10,20,.7)',
          }}
        >
          ?
        </div>
        <Hero style={{ position: 'absolute', left: 4, top: 236 }} />
        <PixelSprite sprite={COIN} scale={7} className="mg-float" style={{ position: 'absolute', left: 14, top: 180 }} />
        <PixelSprite sprite={STAR} scale={8} className="mg-twinkle" style={{ position: 'absolute', right: 70, top: 300 }} />
      </div>
    </div>

    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 132, zIndex: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
      <Chip text="8 RƯƠNG · 2 VÒNG" />
      <Chip text="15 GIÂY / CÂU" />
      <Chip text="ĐÚNG +10Đ" />
      <Chip text="ĐOÁN ẢNH +20Đ" />
      <span style={{ fontFamily: F.mono, fontSize: 23, color: 'rgba(244,232,193,.72)', marginLeft: 'auto' }}>
        VÒNG 1 KHU RỪNG KÝ ỨC → VÒNG 2 ĐỈNH NÚI BẢN ĐỒ
      </span>
    </div>
  </World>
);

const Chip = ({ text }: { text: string }) => (
  <span
    style={{
      fontFamily: F.mono,
      fontSize: 23,
      letterSpacing: 1,
      color: C.parchment,
      background: 'rgba(17,14,30,.82)',
      border: `3px solid ${C.goldDark}`,
      boxShadow: `0 0 0 2px ${C.ink}`,
      padding: '8px 14px',
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </span>
);

const Rules: Page = () => (
  <World variant="forest" dim={0.35} moon={false}>
    <Paper style={{ position: 'absolute', left: 200, top: 118, width: 1520, height: 846, padding: 54, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: 4, color: '#7a4a2a' }}>HƯỚNG DẪN NHANH</div>
          <h2 style={{ fontFamily: F.display, fontSize: 76, fontWeight: 800, lineHeight: 0.9, margin: '8px 0 0', letterSpacing: 1 }}>
            LUẬT CHƠI
          </h2>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 26, color: '#6a5540', textAlign: 'right', lineHeight: 1.3 }}>
          2 VÒNG · 8 RƯƠNG MỖI VÒNG
          <br />
          <span style={{ fontSize: 21 }}>Thi đấu cá nhân · MC ghi điểm</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 34 }}>
        <RuleCard
          icon={<PixelSprite sprite={CHEST} scale={7} />}
          value="8"
          label="RƯƠNG / VÒNG"
          desc="Trả lời đúng mới mở được một mảnh ghép."
        />
        <RuleCard
          icon={<PixelSprite sprite={HOURGLASS} scale={6} />}
          value="15"
          label="GIÂY / CÂU"
          desc="Hết giờ xem như trả lời sai và mất lượt."
        />
        <RuleCard
          icon={<PixelSprite sprite={COIN} scale={6} />}
          value="10"
          label="ĐIỂM / CÂU ĐÚNG"
          desc="Sai hoặc quá giờ: 0 điểm, chuyển lượt."
        />
        <RuleCard
          icon={<PixelSprite sprite={STAR} scale={7} />}
          value="+20"
          label="ĐOÁN ẢNH"
          desc="Tối đa 2 lượt/người. Đoán đúng kết thúc vòng."
        />
      </div>

      <div
        style={{
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(122,74,42,.08)',
          border: '3px solid rgba(122,74,42,.28)',
          padding: '14px 18px',
          fontFamily: F.body,
          fontSize: 24,
          lineHeight: 1.4,
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: 28, color: '#7a4a2a' }}>!</span>
        <span>
          Kết thúc vòng khi <strong>mở hết 8 rương</strong> hoặc <strong>có người đoán đúng ảnh bí mật</strong>. Điểm được cộng dồn qua cả 2 vòng.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34 }}>
        <span style={{ fontFamily: F.mono, fontSize: 23, color: '#6a5540', letterSpacing: 1 }}>
          VÒNG 1: KHU RỪNG KÝ ỨC &nbsp;→&nbsp; VÒNG 2: ĐỈNH NÚI BẢN ĐỒ
        </span>
        <PixelButton tone="gold" fontSize={30} onClick={() => goPage(PAGE.board1)}>
          ▶ VÀO RỪNG
        </PixelButton>
      </div>
    </Paper>
  </World>
);

const RuleCard = ({
  icon,
  value,
  label,
  desc,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  desc: string;
}) => (
  <div
    style={{
      background: 'linear-gradient(180deg, #232447 0%, #15122a 100%)',
      border: `4px solid ${C.ink}`,
      boxShadow: `0 0 0 3px ${C.goldDark}, 0 8px 0 rgba(0,0,0,.35)`,
      padding: 20,
      color: C.parchment,
      minHeight: 336,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {icon}
      <span style={{ fontFamily: F.mono, fontSize: 19, color: 'rgba(244,232,193,.4)', letterSpacing: 1 }}>
        {String(Number(value.replace('+', '')) || 0).padStart(2, '0')}
      </span>
    </div>
    <div style={{ fontFamily: F.display, fontSize: 76, fontWeight: 800, lineHeight: 0.9, color: C.gold, marginTop: 14 }}>
      {value}
    </div>
    <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: 1, color: C.parchment, marginTop: 4 }}>{label}</div>
    <div style={{ fontFamily: F.body, fontSize: 21, lineHeight: 1.45, color: C.muted, marginTop: 12 }}>{desc}</div>
  </div>
);

const Knowledge: Page = () => {
  const [state] = useGame();
  const total = totalScore(state);
  return (
    <World variant="mountain" dim={0.38} moon={false}>
      <Paper style={{ position: 'absolute', left: 140, top: 96, width: 1640, height: 888, padding: 0, zIndex: 20 }}>
        <div
          style={{
            height: 86,
            background: C.ink,
            color: C.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 44px',
            borderBottom: `4px solid ${C.goldDark}`,
          }}
        >
          <span style={{ fontFamily: F.display, fontSize: 46, fontWeight: 800, letterSpacing: 3 }}>QUEST COMPLETE</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: F.mono, fontSize: 24, color: C.gold, letterSpacing: 1 }}>
              TỔNG ĐIỂM: {total}Đ
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 18, color: C.muted, letterSpacing: 2 }}>
              CNXHKH · NHÓM 3
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 38, padding: '38px 44px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <div
              style={{
                width: 480,
                height: 508,
                border: `5px solid ${C.ink}`,
                boxShadow: `0 0 0 4px ${C.goldDark}, 0 12px 0 rgba(0,0,0,.3)`,
                backgroundImage: `url(${mapImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div style={{ fontFamily: F.mono, fontSize: 21, color: '#6a5540', marginTop: 12, textAlign: 'center', letterSpacing: 1 }}>
              BẢN ĐỒ PHÂN BỐ CÁC DÂN TỘC THEO VÙNG MIỀN
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: 4, color: '#7a4a2a' }}>
              ĐIỀU CÒN LẠI SAU MINIGAME
            </div>
            <h2
              style={{
                fontFamily: F.display,
                fontSize: 92,
                fontWeight: 800,
                lineHeight: 0.86,
                margin: '10px 0 0',
                color: '#241d16',
                letterSpacing: 1,
              }}
            >
              54 DÂN TỘC
              <br />
              <span style={{ color: '#8b2f2a' }}>MỘT VIỆT NAM</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 28 }}>
              <Stat value="54" label="DÂN TỘC ANH EM" />
              <Stat value="02" label="XU HƯỚNG QUAN HỆ DÂN TỘC" />
              <Stat value="05" label="LĨNH VỰC CHÍNH SÁCH" />
            </div>

            <div
              style={{
                marginTop: 26,
                borderLeft: '6px solid #b8862a',
                paddingLeft: 20,
                fontFamily: F.body,
                fontSize: 28,
                lineHeight: 1.55,
                color: '#3a2c1e',
              }}
            >
              “Mỗi dân tộc là một mảnh ghép — đoàn kết, tôn trọng và giữ gìn bản sắc làm nên bức tranh Việt Nam thống nhất.”
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
              <Badge label="CHÍNH TRỊ" tone="dark" />
              <Badge label="KINH TẾ" tone="dark" />
              <Badge label="XÃ HỘI" tone="dark" />
              <Badge label="VĂN HÓA" tone="dark" />
              <Badge label="AN NINH – QUỐC PHÒNG" tone="dark" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 30 }}>
              <PixelButton
                tone="gold"
                fontSize={28}
                onClick={() => {
                  resetGame();
                }}
              >
                ↺ CHƠI LẠI
              </PixelButton>
              <PixelButton tone="ghost" fontSize={24} onClick={() => goPage(PAGE.reveal2)}>
                ← XEM LẠI ĐÁP ÁN
              </PixelButton>
            </div>
          </div>
        </div>
      </Paper>
    </World>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div
    style={{
      background: 'linear-gradient(180deg, #232447 0%, #15122a 100%)',
      border: `3px solid ${C.ink}`,
      boxShadow: `0 0 0 2px ${C.goldDark}, 0 6px 0 rgba(0,0,0,.3)`,
      padding: '10px 14px',
      color: C.parchment,
    }}
  >
    <div style={{ fontFamily: F.display, fontSize: 54, fontWeight: 800, lineHeight: 0.9, color: C.gold }}>{value}</div>
    <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: 1, color: C.muted, marginTop: 4 }}>{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page assembly
// ─────────────────────────────────────────────────────────────────────────────

const BoardOne: Page = () => <Board round={1} />;
const BoardTwo: Page = () => <Board round={2} />;
const RevealOne: Page = () => <Reveal round={1} />;
const RevealTwo: Page = () => <Reveal round={2} />;

const makeQuestionPage = (round: Round, index: number): Page => {
  const QuestionPage: Page = () => <QuestionScreen round={round} index={index} />;
  return QuestionPage;
};

const Q1_01 = makeQuestionPage(1, 0);
const Q1_02 = makeQuestionPage(1, 1);
const Q1_03 = makeQuestionPage(1, 2);
const Q1_04 = makeQuestionPage(1, 3);
const Q1_05 = makeQuestionPage(1, 4);
const Q1_06 = makeQuestionPage(1, 5);
const Q1_07 = makeQuestionPage(1, 6);
const Q1_08 = makeQuestionPage(1, 7);
const Q1_09 = makeQuestionPage(1, 8);
const Q1_10 = makeQuestionPage(1, 9);
const Q1_11 = makeQuestionPage(1, 10);
const Q1_12 = makeQuestionPage(1, 11);

const Q2_01 = makeQuestionPage(2, 0);
const Q2_02 = makeQuestionPage(2, 1);
const Q2_03 = makeQuestionPage(2, 2);
const Q2_04 = makeQuestionPage(2, 3);
const Q2_05 = makeQuestionPage(2, 4);
const Q2_06 = makeQuestionPage(2, 5);
const Q2_07 = makeQuestionPage(2, 6);
const Q2_08 = makeQuestionPage(2, 7);
const Q2_09 = makeQuestionPage(2, 8);
const Q2_10 = makeQuestionPage(2, 9);
const Q2_11 = makeQuestionPage(2, 10);
const Q2_12 = makeQuestionPage(2, 11);

export const transition: SlideTransition = {
  duration: 230,
  exit: { duration: 230, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 230,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Pixel Quest — Minigame 8 mảnh ghép',
  createdAt: '2026-10-22T15:22:27.018Z',
};

const questionNotes = (list: Question[]) =>
  list.map(
    (q, i) =>
      `Câu ${i + 1}/${QUESTION_COUNT} — ${q.text}\nĐáp án: ${
        q.kind === 'tf' ? q.options[q.answer] : `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`
      }\n${q.explain}`,
  );

export const notes: (string | undefined)[] = [
  'Mở màn: chào lớp, giới thiệu Pixel Quest — 2 vòng, 8 rương mỗi vòng. Bấm BẮT ĐẦU để sang luật chơi.',
  'Đọc nhanh 4 thẻ luật: 8 rương/vòng, 15 giây/câu, đúng +10, đoán ảnh +20 (2 lượt/người). Nhấn VÀO RỪNG.',
  'Bàn chơi vòng 1 (poster 54 dân tộc). Mời một bạn chọn rương. Nhấn vào rương để nhân vật nhảy tới và mở câu hỏi.',
  ...questionNotes(ROUND_ONE),
  'Công bố đáp án vòng 1: poster 54 dân tộc. Nếu có người đoán đúng, cộng +20. Bấm SANG VÒNG 2.',
  'Bàn chơi vòng 2 (bản đồ phân bố). Nhắc lại: sai không mở được rương. Mời lượt chơi mới.',
  ...questionNotes(ROUND_TWO),
  'Công bố đáp án vòng 2: bản đồ phân bố 54 dân tộc theo 8 vùng miền. Tổng kết điểm của cả 2 vòng.',
  'Chốt kiến thức: 54 dân tộc, 8 vùng phân bố, 5 lĩnh vực chính sách. Nhấn mạnh thông điệp mỗi dân tộc là một mảnh ghép. Bấm CHƠI LẠI nếu cần.',
];

export default [
  Cover,
  Rules,
  BoardOne,
  Q1_01,
  Q1_02,
  Q1_03,
  Q1_04,
  Q1_05,
  Q1_06,
  Q1_07,
  Q1_08,
  Q1_09,
  Q1_10,
  Q1_11,
  Q1_12,
  RevealOne,
  BoardTwo,
  Q2_01,
  Q2_02,
  Q2_03,
  Q2_04,
  Q2_05,
  Q2_06,
  Q2_07,
  Q2_08,
  Q2_09,
  Q2_10,
  Q2_11,
  Q2_12,
  RevealTwo,
  Knowledge,
] satisfies Page[];
