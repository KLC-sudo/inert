import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../ContentContext';

// ---- Built-in SVG patterns (same 6 from the old SvgPatternSection) ----
// Each renders over a dark gradient background so it looks good on a hero
const BUILTIN_PATTERNS = [
    // 0: Diagonal Lines
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p0-${uid}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M 0 5 L 80 5 M 0 15 L 80 15 M 0 25 L 80 25 M 0 35 L 80 35 M 0 45 L 80 45 M 0 55 L 80 55 M 0 65 L 80 65 M 0 75 L 80 75" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p0-${uid})`} />
        </svg>
    ),
    // 1: Dots
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p1-${uid}`} x="10" y="10" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="#FECACA" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p1-${uid})`} />
        </svg>
    ),
    // 2: Zigzag
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p2-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0,10 L 10,0 M 10,20 L 20,10" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p2-${uid})`} />
        </svg>
    ),
    // 3: Circles
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p3-${uid}`} width="50" height="50" patternUnits="userSpaceOnUse">
                    <circle cx="25" cy="25" r="10" stroke="#FECACA" strokeWidth="1" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p3-${uid})`} />
        </svg>
    ),
    // 4: Triangles
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p4-${uid}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 15 30 L 30 0 Z" fill="rgba(254, 202, 202, 0.5)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p4-${uid})`} />
        </svg>
    ),
    // 5: Grid
    (uid: string) => (
        <svg key={uid} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <defs>
                <pattern id={`p5-${uid}`} width="25" height="25" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <path d="M 12.5 0 L 12.5 25 M 0 12.5 L 25 12.5" stroke="#FECACA" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p5-${uid})`} />
        </svg>
    ),
];

export const PATTERN_NAMES = [
    'Diagonal Lines',
    'Dots',
    'Zigzag',
    'Circles',
    'Triangles',
    'Diamond Grid',
];

interface SlideBackgroundProps {
    slide: {
        bgType?: 'image' | 'svg';
        bgImage?: string;
        svgPatternIndex?: number;
        customSvg?: string;
    };
    uid: string;
}

const SlideBackground: React.FC<SlideBackgroundProps> = ({ slide, uid }) => {
    const bgType = slide.bgType ?? (slide.bgImage ? 'image' : 'svg');

    if (bgType === 'image' && slide.bgImage) {
        return (
            <img src={slide.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        );
    }

    // SVG mode: dark base + pattern overlay
    const patternIdx = slide.svgPatternIndex ?? 0;
    const renderFn = BUILTIN_PATTERNS[patternIdx] ?? BUILTIN_PATTERNS[0];

    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {slide.customSvg
                ? <div className="absolute inset-0 w-full h-full" dangerouslySetInnerHTML={{ __html: slide.customSvg }} />
                : renderFn(uid)}
        </div>
    );
};

const PAGE_KEYS = ['home', 'about', 'contact', 'onboarding'];

interface HeroSectionProps {
    onNavigate?: (page: string) => void;
}

// Smart CTA: routes to in-app page or anchor
const CtaButton: React.FC<{
    label: string;
    href: string;
    primary: boolean;
    onNavigate?: (page: string) => void;
}> = ({ label, href, primary, onNavigate }) => {
    const baseStyle = primary
        ? 'inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-xl'
        : 'inline-flex items-center gap-2 border border-slate-200 text-slate-900 hover:bg-slate-50 font-bold py-3.5 px-8 rounded-full transition-all duration-300';

    if (PAGE_KEYS.includes(href)) {
        return (
            <button onClick={() => onNavigate?.(href)} className={baseStyle}>
                {label}{primary ? ' →' : ''}
            </button>
        );
    }
    return (
        <a href={href} className={baseStyle}>
            {label}{primary ? ' →' : ''}
        </a>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
    const { content } = useContent();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const slides = content.heroSlides || [];

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
        }, 50); // 1% every 50ms = 5s total
        return () => clearInterval(interval);
    }, [slides.length]);

    useEffect(() => {
        if (progress >= 100) {
            setCurrentIndex((i) => (i + 1) % slides.length);
        }
    }, [progress, slides.length]);

    if (slides.length === 0) return null;

    const slide = slides[currentIndex];

    const handleCtaClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (['about', 'contact', 'onboarding'].includes(href)) {
            onNavigate?.(href);
        } else {
            const id = href.replace('#', '');
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="relative pt-32 pb-16 overflow-hidden hero-gradient min-h-[90vh] flex items-center">
            <div className="absolute inset-0 dot-pattern text-slate-200 opacity-40 -z-10"></div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    {slide.badge && (
                        <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{slide.badge}</span>
                        </div>
                    )}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-slate-900">
                        {slide.heading} <br />
                        {slide.headingAccent && <span className="text-primary italic">{slide.headingAccent}</span>}
                        {(slide as any).headingSuffix && <span>{(slide as any).headingSuffix}</span>}
                    </h1>
                    {slide.subtext && (
                        <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                            {slide.subtext}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-4">
                        {slide.primaryCta && (
                            <button
                                onClick={(e) => handleCtaClick(e, slide.primaryCta!.href)}
                                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black flex items-center group transition-all transform hover:scale-105 shadow-xl"
                            >
                                {slide.primaryCta.label}
                                <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
                            </button>
                        )}
                        {slide.secondaryCta && (
                            <button
                                onClick={(e) => handleCtaClick(e, slide.secondaryCta!.href)}
                                className="border bg-white px-8 py-4 rounded-xl font-black text-slate-900 hover:bg-slate-50 transition-all transform hover:scale-105 shadow-sm"
                            >
                                {slide.secondaryCta.label}
                            </button>
                        )}
                    </div>
                    {slides.length > 1 && (
                        <div className="mt-12">
                            <div className="w-64 h-1 bg-slate-200/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-80"
                                    style={{ width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 50ms linear' }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                    <img
                        alt={slide.heading}
                        className="relative z-10 w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-500"
                        src={slide.bgImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                    />
                </div>
            </div>
        </header>
    );
};

export default HeroSection;