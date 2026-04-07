import React from 'react';
import { useContent } from '../ContentContext';
import Logo from './Logo';

const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { content } = useContent();
    const about = content.about;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero banner */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="about-pat" x="10" y="10" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="2" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#about-pat)" />
                </svg>

                <div className="relative max-w-3xl mx-auto text-center">
                    <button
                        onClick={() => onNavigate('home')}
                        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-8 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </button>

                    <div className="flex justify-center mb-6">
                        <Logo
                            src={content.branding.logoTop}
                            className="h-auto w-auto object-contain"
                            style={{ maxHeight: '80px', maxWidth: '80px' }}
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold">{about.title}</h1>
                    {about.subtitle && (
                        <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">{about.subtitle}</p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
                {about.whoWeAre && (
                    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Who We Are</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.whoWeAre}</p>
                    </div>
                )}

                {about.mission && (
                    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.mission}</p>
                    </div>
                )}

                {about.vision && (
                    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.vision}</p>
                    </div>
                )}

                {/* CTA back to shop */}
                <div className="text-center pt-8">
                    <button
                        onClick={() => onNavigate('shop')}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                        Shop Our Products →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
