
import { SlideData, Theme } from './types';

export const DEFAULT_COLOR = '#2563EB';

export const THEMES: Theme[] = [
  {
    name: "أزرق عميق (زيتي)",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    textColor: "text-white",
    accentColor: "#3b82f6",
    badgeBg: "bg-blue-500/20",
    badgeText: "text-blue-300"
  },
  {
    name: "أرجواني ملكي",
    gradient: "linear-gradient(135deg, #2e1065 0%, #701a75 100%)",
    textColor: "text-white",
    accentColor: "#d946ef",
    badgeBg: "bg-fuchsia-500/20",
    badgeText: "text-fuchsia-300"
  },
  {
    name: "غروب دافئ",
    gradient: "linear-gradient(135deg, #451a03 0%, #92400e 100%)",
    textColor: "text-white",
    accentColor: "#f59e0b",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-200"
  },
  {
    name: "زمردي فاخر",
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    textColor: "text-white",
    accentColor: "#10b981",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-300"
  },
  {
    name: "كلاسيك فاتح",
    gradient: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    textColor: "text-slate-900",
    accentColor: "#2563eb",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600"
  }
];

export const LOGOS = [
  '/logooo/logo-1.png',
  '/logooo/logo-2.png',
  '/logooo/logo-3.png',
  '/logooo/logo-4.png'
];

export const INITIAL_SLIDES: SlideData[] = [
  {
    id: '1',
    type: 'hero',
    title: 'حول فكرتك إلى واقع ملموس مع خبرائنا',
    subtitle: 'نحن نساعدك على بناء العلامة التجارية التي تحلم بها بأحدث تقنيات التصميم والذكاء الاصطناعي.',
    accentColor: DEFAULT_COLOR,
    footer: 'احجز استشارتك المجانية'
  },
  {
    id: '2',
    type: 'grid',
    title: 'لماذا تختار منصتنا؟',
    subtitle: 'نقدم لك حلولاً متكاملة تختصر عليك الوقت والجهد في رحلتك الريادية.',
    content: [
      'سرعة فائقة في الإنجاز',
      'دقة عالية في النتائج',
      'دعم فني على مدار الساعة',
      'تكلفة تنافسية ومدروسة'
    ],
    accentColor: DEFAULT_COLOR
  }
];
