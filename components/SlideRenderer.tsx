import React, { forwardRef } from 'react';
import { SlideData, Theme } from '../types';
import { Layout, CheckCircle, BarChart3, Users, Zap, ArrowLeft, Target, ShieldCheck, ListOrdered, ArrowRightLeft, MessageCircleQuestion } from 'lucide-react';
import { THEMES } from '../constants';

interface Props {
  slide: SlideData;
  themeIndex: number;
  logo?: string;
  scale?: number;
  uniqueId?: string;
}

const SlideRenderer = forwardRef<HTMLDivElement, Props>(({ slide, themeIndex, logo, scale = 1, uniqueId = 'main' }, ref) => {
  const theme = THEMES[themeIndex] || THEMES[0];
  const isDark = theme.textColor.includes('white');

  const renderIcon = (type: string) => {
    const iconClass = `w-8 h-8 ${isDark ? 'text-white/80' : 'text-blue-500'}`;
    switch (type) {
      case 'hero': return <Zap className={iconClass} />;
      case 'grid': return <Layout className={iconClass} />;
      case 'stat': return <BarChart3 className={iconClass} />;
      case 'feature': return <Target className={iconClass} />;
      case 'testimonial': return <Users className={iconClass} />;
      case 'steps': return <ListOrdered className={iconClass} />;
      case 'comparison': return <ArrowRightLeft className={iconClass} />;
      case 'q-and-a': return <MessageCircleQuestion className={iconClass} />;
      default: return <CheckCircle className={iconClass} />;
    }
  };

  const isBackgroundImg = slide.imagePlacement === 'background';
  const containerId = `slide-container-${slide.id}-${uniqueId}`;

  return (
    <div 
      ref={ref}
      id={containerId}
      className={`slide-card slide-shadow`}
      style={{ 
        transform: `scale(${scale})`,
        background: isBackgroundImg && slide.image ? 'none' : theme.gradient
      }}
    >
      {/* Inject Custom CSS if exists */}
      {slide.customCss && (
        <style dangerouslySetInnerHTML={{ 
          __html: slide.customCss.replace(/(\.slide-[a-z-]+|\.item-[a-z-]+|\.cta-[a-z-]+)/g, `#${containerId} $1`) 
        }} />
      )}

      {/* Full Background Image Option */}
      {isBackgroundImg && slide.image && (
        <>
          <img src={slide.image} className="slide-bg-image" alt="Background" />
          <div className="slide-overlay" />
        </>
      )}

      {/* Background Decorative Mesh */}
      {!isBackgroundImg && (
        <>
          <div className="slide-mesh-top">
            <div className="mesh-blob-1"></div>
          </div>
          <div className="slide-mesh-bottom">
            <div className="mesh-blob-2"></div>
          </div>
        </>
      )}

      {/* Top Branding (Logo) */}
      {logo && (
        <div className="logo-overlay">
          <img src={logo} alt="Logo" className="slide-logo" />
        </div>
      )}

      <div className="slide-content-wrapper">
        {/* Badge */}
        <div className={`slide-badge ${isDark || isBackgroundImg ? '' : ''} ${theme.badgeBg} ${theme.badgeText}`} style={{ borderColor: isDark || isBackgroundImg ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.1)' }}>
          {renderIcon(slide.type)}
          <span className="slide-badge-text">{slide.type.toUpperCase()}</span>
        </div>

        {/* Title */}
        <h2 className={`slide-title ${isBackgroundImg ? 'text-white' : theme.textColor}`}>
          {slide.title}
        </h2>

        {/* Subtitle */}
        {slide.subtitle && (
          <p className={`slide-subtitle ${isDark || isBackgroundImg ? 'text-white/80' : 'text-slate-500'}`}>
            {slide.subtitle}
          </p>
        )}

        {/* Slide Image - Content Mode */}
        {slide.image && slide.imagePlacement !== 'background' && (
          <div className="slide-image-box">
            <img src={slide.image} alt="Slide Content" />
          </div>
        )}

        {/* Grid/List Content */}
        {slide.content && slide.content.length > 0 && (
          <div className={`item-grid ${slide.type === 'steps' ? 'is-steps' : 'is-grid'}`}>
            {slide.content.map((item, idx) => (
              <div key={idx} className={`item-card`} style={{ 
                backgroundColor: isDark || isBackgroundImg ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
                borderColor: isDark || isBackgroundImg ? 'rgba(255,255,255,0.1)' : 'rgba(226, 232, 240, 1)'
              }}>
                <div className={`item-icon-box ${isDark || isBackgroundImg ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'}`}>
                  {slide.type === 'steps' ? idx + 1 : <CheckCircle className="w-4 h-4" />}
                </div>
                <span className={`item-text ${isDark || isBackgroundImg ? 'text-white' : 'text-slate-700'}`}>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {slide.footer && (
          <div className="cta-container">
            <button 
              className="cta-button"
              style={{ background: isDark || isBackgroundImg ? 'rgba(255,255,255,0.2)' : theme.accentColor, backdropFilter: 'blur(10px)' }}
            >
              <span className="slide-cta-text">{slide.footer}</span>
              <ArrowLeft className="w-5 h-5 slide-cta-icon" />
            </button>
          </div>
        )}
      </div>

      {/* Design Footer */}
      <footer className={`design-footer ${isDark || isBackgroundImg ? 'is-dark' : 'is-light'}`} style={{ backgroundColor: theme.accentColor }}>
        <span className="footer-left">منصة المستثمر</span>
        <span className="footer-right">al_investor.com</span>
      </footer>
    </div>
  );
});

SlideRenderer.displayName = 'SlideRenderer';

export default SlideRenderer;