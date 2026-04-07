import React from 'react';
import { useContent } from '../ContentContext';

const CreativeArsenal: React.FC = () => {
    const { content } = useContent();

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900/80">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-10">{content.arsenalTitle}</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {(content.arsenalItems || []).map((item, idx) => (
                        item.image ? (
                            <img key={idx} src={item.image} alt={item.name} title={item.name} className="h-10 md:h-12 object-contain select-none pointer-events-none" />
                        ) : (
                            <span key={idx} className={`text-2xl font-black ${item.isItalic ? 'italic' : ''} ${item.color || ''}`}>
                                {item.name}
                            </span>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreativeArsenal;
