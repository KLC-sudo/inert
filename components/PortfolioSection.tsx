import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useContent } from '../ContentContext';

/* ─── Lightbox ─────────────────────────────────────────────────────────────── */
interface LightboxProps {
    images: string[];
    startIndex: number;
    title: string;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, title, onClose }) => {
    const [idx, setIdx] = useState(startIndex);

    const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
    const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next, onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition-colors"
                aria-label="Close"
            >
                ×
            </button>

            {images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium z-10">
                    {idx + 1} / {images.length}
                </div>
            )}

            <div
                className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                <img
                    key={idx}
                    src={images[idx]}
                    alt={`${title} – ${idx + 1}`}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={e => { e.stopPropagation(); prev(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors z-10"
                        aria-label="Previous"
                    >‹</button>
                    <button
                        onClick={e => { e.stopPropagation(); next(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors z-10"
                        aria-label="Next"
                    >›</button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => { e.stopPropagation(); setIdx(i); }}
                                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/30'}`}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Card Carousel (arrows hidden until hover) ──────────────────────────────── */
const PortfolioCarousel: React.FC<{
    images: string[];
    title: string;
    onExpand: (index: number) => void;
}> = ({ images, title, onExpand }) => {
    const [current, setCurrent] = useState(0);
    const [hovered, setHovered] = useState(false);

    if (images.length === 0) return null;

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent(c => (c - 1 + images.length) % images.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent(c => (c + 1) % images.length);
    };

    return (
        <div
            className="w-full h-full relative select-none cursor-zoom-in"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onExpand(current)}
        >
            <img
                src={images[current]}
                alt={`${title} – ${current + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Expand hint — hover only */}
            <div className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center transition-opacity z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-white text-sm leading-none">⤢</span>
            </div>

            {/* Carousel nav — only when hovered AND multiple images */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg z-10 transition-all duration-200 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
                        aria-label="Previous image"
                    >‹</button>
                    <button
                        onClick={next}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg z-10 transition-all duration-200 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}
                        aria-label="Next image"
                    >›</button>
                    {/* Dots always subtle at bottom */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => { e.stopPropagation(); setCurrent(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/30'}`}
                                aria-label={`Image ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* ─── Main Section ──────────────────────────────────────────────────────────── */
const INITIAL_VISIBLE = 6;

const PortfolioSection: React.FC = () => {
    const { content } = useContent();
    const [lightbox, setLightbox] = useState<{ images: string[]; index: number; title: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [showAll, setShowAll] = useState(false);

    const items = content.portfolioItems || [];

    // Derive unique category filters from live CMS data
    const filters = useMemo(() => {
        const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
        return ['All', ...cats];
    }, [items]);

    // Reset filter if it no longer exists in the data
    useEffect(() => {
        if (activeFilter !== 'All' && !filters.includes(activeFilter)) {
            setActiveFilter('All');
        }
    }, [filters, activeFilter]);

    const filtered = activeFilter === 'All' ? items : items.filter(i => i.category === activeFilter);
    const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
    const hasMore = filtered.length > INITIAL_VISIBLE;

    return (
        <section className="py-24 relative overflow-hidden" id="portfolio">
            <div className="absolute inset-0 dot-pattern text-slate-100 dark:text-slate-800 opacity-20 -z-10"></div>
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary mb-4">{content.portfolioSubtitle}</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold">{content.portfolioTitle}</h3>
                    </div>
                    {/* Dynamic filter pills from CMS categories */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                                className={`px-5 py-2 rounded-full border font-bold transition-all active:scale-95 text-sm ${
                                    activeFilter === cat
                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visible.map((item, idx) => {
                        const allImages = [item.image, ...(item.additionalImages || [])].filter(Boolean) as string[];
                        return (
                            <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                                <PortfolioCarousel
                                    images={allImages}
                                    title={item.title}
                                    onExpand={(imgIdx) => setLightbox({ images: allImages, index: imgIdx, title: item.title })}
                                />
                                {/* Info overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 pointer-events-none">
                                    <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{item.category}</span>
                                    <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                                    <p className="text-slate-300 text-sm mt-2">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Show more / less toggle */}
                <div className="mt-16 text-center">
                    {hasMore && !showAll && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="bg-primary/10 dark:bg-primary/5 text-primary border border-primary/20 px-10 py-4 rounded-2xl font-bold hover:bg-primary hover:text-slate-900 transition-all"
                        >
                            Explore All Projects ({filtered.length - INITIAL_VISIBLE} more)
                        </button>
                    )}
                    {showAll && filtered.length > INITIAL_VISIBLE && (
                        <button
                            onClick={() => setShowAll(false)}
                            className="border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-900 hover:text-white transition-all"
                        >
                            Show Less
                        </button>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <Lightbox
                    images={lightbox.images}
                    startIndex={lightbox.index}
                    title={lightbox.title}
                    onClose={() => setLightbox(null)}
                />
            )}
        </section>
    );
};

export default PortfolioSection;
