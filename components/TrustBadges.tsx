import React from 'react';
import { useContent } from '../ContentContext';

const TrustBadges: React.FC = () => {
    const { content } = useContent();
    const badges = content.trustBadges || [];

    if (badges.length === 0) return null;

    return (
        <section className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex items-center gap-3 px-8 py-4 sm:py-2 w-full sm:w-auto justify-start sm:justify-center">
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-red-50 rounded-full overflow-hidden p-3">
                                {(badge.icon && (badge.icon.startsWith('/') || badge.icon.startsWith('http'))) ? (
                                    <img src={badge.icon} alt={badge.title} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-xl" role="img" aria-label={badge.title}>{badge.icon}</span>
                                )}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">{badge.title}</p>
                                <p className="text-xs text-gray-500">{badge.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
