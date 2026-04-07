import React from 'react';
import { useContent } from '../ContentContext';

const QualitySection: React.FC = () => {
    const { content } = useContent();
    const q = content.qualitySection;

    if (!q) return null;

    return (
        <section className="bg-gray-50 py-20 px-6 lg:px-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image column */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-200 flex items-center justify-center">
                    {q.image ? (
                        <img src={q.image} alt={q.heading} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Upload image from CMS</span>
                        </div>
                    )}
                    {/* Badge overlay */}
                    {q.imageBadge && (
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg max-w-[200px]">
                            <p className="text-red-600 font-bold text-sm">{q.imageBadge}</p>
                            {q.imageBadgeSubtext && (
                                <p className="text-gray-600 text-xs mt-1 leading-snug">{q.imageBadgeSubtext}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Text column */}
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        {q.heading}{' '}
                        {q.subheading && (
                            <span className="text-red-600 italic">{q.subheading}</span>
                        )}
                    </h2>

                    {q.bullets && q.bullets.length > 0 && (
                        <ul className="mt-8 space-y-4">
                            {q.bullets.map((b, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-red-600 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{b.title}</p>
                                        <p className="text-gray-500 text-sm mt-0.5">{b.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </section>
    );
};

export default QualitySection;
