
export type SlideType = 'hero' | 'grid' | 'stat' | 'feature' | 'testimonial' | 'cta' | 'steps' | 'comparison' | 'q-and-a';

export interface Theme {
  name: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface SlideData {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string[];
  footer?: string;
  icon?: string;
  accentColor: string;
  image?: string; 
  imagePlacement?: 'top' | 'background' | 'side';
  customCss?: string;
}

export interface ProjectData {
  projectName: string;
  logo?: string;
  themeIndex: number;
  slides: SlideData[];
}
