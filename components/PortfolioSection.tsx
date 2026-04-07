import React, { useState } from 'react';
import { useContent } from '../ContentContext';

const PortfolioCarousel: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
    const [current, setCurrent] = useState(0);
    const allImages = images;
    if (allImages.length === 0) return null;

    const prev = () => setCurrent((c) => (c - 1 + allImages.length) % allImages.length);
    const next = () => setCurrent((c) => (c + 1) % allImages.length);

    return (
        <div className="w-full h-full relative select-none">
            <img
                src={allImages[current]}
                alt={`${title} - ${current + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {allImages.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none z-10 transition-colors"
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none z-10 transition-colors"
                        aria-label="Next image"
                    >
                        ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {allImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const PortfolioSection: React.FC = () => {
    const { content } = useContent();

    return (
        <section className="py-24 relative overflow-hidden" id="portfolio">
            <div className="absolute inset-0 dot-pattern text-slate-100 dark:text-slate-800 opacity-20 -z-10"></div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-secondary mb-4">{content.portfolioSubtitle}</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold">{content.portfolioTitle}</h3>
                    </div>
                    <div className="flex space-x-4">
                        <button className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95">All</button>
                        <button className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95">Motion</button>
                        <button className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95">3D</button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(content.portfolioItems || []).map((item, idx) => {
                        const allImages = [item.image, ...(item.additionalImages || [])].filter(Boolean) as string[];
                        return (
                            <div key={idx} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 shadow-sm">
                                <PortfolioCarousel images={allImages} title={item.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 pointer-events-none">
                                    <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{item.category}</span>
                                    <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                                    <p className="text-slate-300 text-sm mt-2">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-16 text-center">
                    <button className="bg-primary/10 dark:bg-primary/5 text-primary border border-primary/20 px-10 py-4 rounded-2xl font-bold hover:bg-primary hover:text-slate-900 transition-all">
                        Explore All Projects
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;
