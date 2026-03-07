import React, { useState, useRef } from 'react';
import { Plus, Trash2, Wand2, Download, LayoutTemplate, Palette, Type as FontIcon, Save, ChevronRight, ChevronLeft, Sparkles, Image as ImageIcon, Upload, Check, Copy, Maximize2, Square, Code2, Info, Loader2 } from 'lucide-react';
import { SlideData, SlideType } from './types';
import { INITIAL_SLIDES, THEMES, LOGOS } from './constants';
import SlideRenderer from './components/SlideRenderer';
import { generateCarouselContent } from './services/geminiService';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [themeIndex, setThemeIndex] = useState(0);
  const [logo, setLogo] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'content' | 'css'>('content');
  
  const slideImageInputRef = useRef<HTMLInputElement>(null);
  const mainSlideRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex];

  const updateSlide = (id: string, updates: Partial<SlideData>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Date.now().toString(),
      type: 'feature',
      title: 'عنوان الشريحة الجديدة',
      subtitle: 'أضف نصاً مقنعاً هنا',
      accentColor: THEMES[themeIndex].accentColor,
      imagePlacement: 'top',
      customCss: ''
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const duplicateSlide = (idx: number) => {
    const original = slides[idx];
    const copy: SlideData = {
      ...original,
      id: Date.now().toString(),
    };
    const newSlides = [...slides];
    newSlides.splice(idx + 1, 0, copy);
    setSlides(newSlides);
    setCurrentSlideIndex(idx + 1);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'slide') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogo(reader.result as string);
        } else {
          updateSlide(currentSlide.id, { image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const newContent = await generateCarouselContent(prompt);
    if (newContent.length > 0) {
      const generatedSlides: SlideData[] = newContent.map((c, i) => ({
        id: `gen-${Date.now()}-${i}`,
        type: (c.type as SlideType) || 'feature',
        title: c.title || 'عنوان مولد',
        subtitle: c.subtitle || '',
        content: c.content || [],
        footer: c.footer || '',
        accentColor: THEMES[themeIndex].accentColor,
        imagePlacement: 'top',
        customCss: ''
      }));
      setSlides(generatedSlides);
      setCurrentSlideIndex(0);
    }
    setIsGenerating(false);
  };

  const handleExport = async () => {
    if (mainSlideRef.current === null) {
      return;
    }
    setIsExporting(true);
    try {
      // Small delay to ensure any pending renders are complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(mainSlideRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality for social media
        style: {
          transform: 'scale(1)', // Force scale to 1 to capture actual size without scaling artifacts
        }
      });
      
      const link = document.createElement('a');
      link.download = `carousel-slide-${currentSlideIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export slide:', err);
      alert('حدث خطأ أثناء تصدير الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const slideTypes: {label: string, value: SlideType}[] = [
    { label: 'رئيسية', value: 'hero' },
    { label: 'شبكة مميزات', value: 'grid' },
    { label: 'إحصائيات', value: 'stat' },
    { label: 'خطوات', value: 'steps' },
    { label: 'مقارنة', value: 'comparison' },
    { label: 'ميزة واحدة', value: 'feature' },
    { label: 'سؤال وجواب', value: 'q-and-a' },
    { label: 'رأي عميل', value: 'testimonial' },
    { label: 'دعوة للعمل', value: 'cta' },
  ];

  return (
    <div className="app-container" dir="rtl">
      {/* Sidebar Editor */}
      <aside className="sidebar-editor">
        {/* Sidebar Header & AI Generator */}
        <div className="sidebar-header">
          <div className="app-branding">
            <div className="brand-info">
              <div className="brand-icon-box">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h1 className="brand-title">إستوديو الكاروسيل</h1>
                <p className="brand-tagline">تحكم كامل بالإبداع</p>
              </div>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="mini-action-button"
              title="تصدير سريع"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          
          <div className="ai-generator-box">
            <label className="label-text">بناء المحتوى بالذكاء الاصطناعي</label>
            <div className="section-group">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="عن ماذا يتحدث الكاروسيل؟ (مثال: أسرار النجاح المالي)"
                className="ai-input"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="generate-button"
              >
                {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {isGenerating ? 'جاري التفكير...' : 'توليد الكاروسيل بالكامل'}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Tabs Navigation */}
        <div className="tabs-navigation">
          <button 
            onClick={() => setActiveTab('content')}
            className={`tab-button ${activeTab === 'content' ? 'active-content' : ''}`}
          >
            <LayoutTemplate className="w-4 h-4" />
            المحتوى
          </button>
          <button 
            onClick={() => setActiveTab('css')}
            className={`tab-button ${activeTab === 'css' ? 'active-css' : ''}`}
          >
            <Code2 className="w-4 h-4" />
            تخصيص CSS
          </button>
        </div>

        {/* Tabs Content */}
        <div className="tab-scroll-area custom-scrollbar">
          {activeTab === 'content' ? (
            <div className="control-section">
              {/* Themes */}
              <section className="section-group">
                <h3 className="section-header">
                  <Palette className="w-4 h-4" />
                  اختيار القالب اللوني
                </h3>
                <div className="theme-carousel scrollbar-hide">
                  {THEMES.map((theme, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThemeIndex(idx)}
                      className={`theme-thumbnail ${themeIndex === idx ? 'active' : ''}`}
                      style={{ background: theme.gradient }}
                    />
                  ))}
                </div>
              </section>

              {/* Logo Selection Section */}
              <section className="section-group">
                <h3 className="section-header">
                  <ImageIcon className="w-4 h-4" />
                  اختيار الشعار الرسمي
                </h3>
                <div className="logo-selector-grid">
                  {LOGOS.map((l, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLogo(l)}
                      className={`logo-selector-btn ${logo === l ? 'selected' : ''}`}
                    >
                      <img src={l} alt={`شعار ${idx+1}`} />
                    </button>
                  ))}
                </div>
                {logo && (
                  <button 
                    onClick={() => setLogo(undefined)}
                    className="btn-remove-logo"
                  >
                    إزالة الشعار كلياً
                  </button>
                )}
              </section>

              {/* Editor */}
              <section className="section-group">
                <div className="editor-controls-header">
                  <h3 className="section-header">
                    <LayoutTemplate className="w-4 h-4" />
                    محرر الشريحة الحالية
                  </h3>
                  <div className="workspace-actions">
                    <button onClick={() => duplicateSlide(currentSlideIndex)} className="icon-action-btn" title="تكرار">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeSlide(currentSlide.id)} className="icon-action-btn delete" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="section-group">
                  <div className="field-group">
                    <label className="field-label">نمط الشريحة</label>
                    <div className="grid-selector">
                      {slideTypes.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => updateSlide(currentSlide.id, { type: t.value })}
                          className={`style-selector-btn ${currentSlide.type === t.value ? 'active' : ''}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">العنوان</label>
                    <input 
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateSlide(currentSlide.id, { title: e.target.value })}
                      className="standard-input"
                    />
                  </div>

                  <div className="media-container">
                    <label className="field-label">الصورة والتحكم في ظهورها</label>
                    <div className="media-actions">
                      <button 
                        onClick={() => slideImageInputRef.current?.click()}
                        className="upload-box"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="upload-text">{currentSlide.image ? 'تغيير الصورة' : 'رفع صورة'}</span>
                        <input type="file" ref={slideImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'slide')} />
                      </button>
                      {currentSlide.image && (
                        <button onClick={() => updateSlide(currentSlide.id, { image: undefined })} className="icon-action-btn delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    {currentSlide.image && (
                      <div className="placement-toggle">
                        <button 
                          onClick={() => updateSlide(currentSlide.id, { imagePlacement: 'top' })}
                          className={`toggle-button ${currentSlide.imagePlacement !== 'background' ? 'active' : ''}`}
                        >
                          <Square className="w-3 h-3" /> صورة محتوى
                        </button>
                        <button 
                          onClick={() => updateSlide(currentSlide.id, { imagePlacement: 'background' })}
                          className={`toggle-button ${currentSlide.imagePlacement === 'background' ? 'active' : ''}`}
                        >
                          <Maximize2 className="w-3 h-3" /> خلفية كاملة
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="field-group">
                    <label className="field-label">النص الثانوي</label>
                    <textarea 
                      value={currentSlide.subtitle}
                      onChange={(e) => updateSlide(currentSlide.id, { subtitle: e.target.value })}
                      className="standard-textarea"
                    />
                  </div>

                  {(currentSlide.type === 'grid' || currentSlide.type === 'steps') && (
                    <div className="field-group">
                      <label className="field-label">النقاط (مفصولة بفاصلة)</label>
                      <input 
                        type="text"
                        value={currentSlide.content?.join(', ')}
                        onChange={(e) => updateSlide(currentSlide.id, { content: e.target.value.split(',').map(s => s.trim()) })}
                        className="standard-input"
                      />
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="css-customizer">
              {/* CSS Customizer UI */}
              <header className="css-header">
                <Code2 className="w-6 h-6 text-emerald-500" />
                <h3 className="css-title">تخصيص النمط</h3>
              </header>

              <p className="css-hint">
                أضف أكواد CSS مخصصة لهذه الشريحة. يمكنك استهداف العناصر باستخدام الأسماء القياسية، مثال:
              </p>

              <div className="code-snippet">
                <span className="text-blue-400">.slide-title</span> {'{'} color: <span className="text-red-400">red</span>; {'}'}
              </div>

              <div className="relative group">
                <textarea 
                  value={currentSlide.customCss || ''}
                  onChange={(e) => updateSlide(currentSlide.id, { customCss: e.target.value })}
                  placeholder="/* هنا اكتب الـ CSS */"
                  className="css-textarea custom-scrollbar"
                  spellCheck={false}
                />
              </div>

              <div className="info-banner">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="info-text">
                  ملاحظة: يتم تطبيق هذه التنسيقات فقط على الشريحة الحالية. يمكنك استخدام الفئات التالية:
                  <br />
                  <span className="text-white font-mono mt-1 block">.slide-title, .slide-subtitle, .slide-badge, .item-text, .cta-button</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <div className="sidebar-sticky-footer">
           <button 
            onClick={addSlide}
            className="btn-add-full"
          >
            <Plus className="w-6 h-6" />
            إضافة شريحة جديدة
          </button>
        </div>
      </aside>

      {/* Workspace */}
      <main className="main-workspace">
        <header className="workspace-header">
          <div className="workspace-status">
            <h2 className="status-label">مساحة التصميم</h2>
            <div className="status-divider" />
            <div className="slide-count">
              <span>{slides.length} شرائح</span>
            </div>
          </div>
          
          <div className="workspace-actions">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="export-button"
            >
              {isExporting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isExporting ? 'جاري التصدير...' : 'تصدير بصيغة PNG'}
            </button>
          </div>
        </header>

        {/* Canvas Display */}
        <div className="canvas-area">
          <div className="preview-wrapper">
            <SlideRenderer 
              ref={mainSlideRef}
              slide={currentSlide} 
              themeIndex={themeIndex} 
              logo={logo} 
              uniqueId="preview"
            />
            
            {/* Nav Arrows */}
            <button 
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="nav-arrow prev"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <button 
              onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="nav-arrow next"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <footer className="timeline-footer">
          <div className="timeline-list custom-scrollbar">
            {slides.map((slide, idx) => (
              <div key={slide.id} className="thumbnail-container">
                <button
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`thumbnail-card ${currentSlideIndex === idx ? 'active' : ''}`}
                >
                  <div className="thumbnail-render-box">
                    <SlideRenderer 
                      slide={slide} 
                      themeIndex={themeIndex} 
                      logo={logo}
                      uniqueId={`thumb-${idx}`}
                    />
                  </div>
                  <div className="thumbnail-overlay" />
                  <span className="thumbnail-number">
                    {idx + 1}
                  </span>
                </button>
                <div className="thumbnail-controls">
                  <button onClick={() => duplicateSlide(idx)} className="thumb-btn duplicate">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeSlide(slide.id)} className="thumb-btn delete">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={addSlide}
              className="add-slide-placeholder"
            >
              <div className="plus-icon-container">
                <Plus className="w-8 h-8" />
              </div>
              <span className="add-text">جديد</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;