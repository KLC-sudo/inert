import React from 'react';
import { useContent } from '../ContentContext';
import Logo from './Logo';
import { ContactItem } from '../types';

// Built-in SVG icons by key
const BuiltinIcons: Record<string, React.FC<{ className?: string }>> = {
    mail: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
    ),
    phone: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
        </svg>
    ),
    map: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    ),
    whatsapp: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    globe: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    ),
    instagram: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    ),
};

const ContactItemCard: React.FC<{ item: ContactItem }> = ({ item }) => {
    const BuiltinIcon = item.iconSvg ? BuiltinIcons[item.iconSvg] : null;

    const inner = (
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 flex-shrink-0">
                {item.icon ? (
                    <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain" />
                ) : BuiltinIcon ? (
                    <BuiltinIcon className="w-8 h-8 text-red-600" />
                ) : (
                    <span className="text-2xl">📞</span>
                )}
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">{item.label}</h3>
            <p className={`text-sm text-gray-500 leading-snug ${item.href ? 'group-hover:text-red-600 transition-colors' : ''}`}>
                {item.value}
            </p>
        </div>
    );

    if (item.href) {
        return (
            <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group block"
            >
                {inner}
            </a>
        );
    }
    return <div>{inner}</div>;
};

const ContactPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { content } = useContent();

    // Use contactItems if available, fall back to building from legacy contactInfo
    const items: ContactItem[] = (content as any).contactItems?.length
        ? (content as any).contactItems
        : [
            { label: 'Email', value: content.contactInfo.email, href: `mailto:${content.contactInfo.email}`, iconSvg: 'mail' },
            { label: 'Phone', value: content.contactInfo.phone, href: `tel:${content.contactInfo.phone.replace(/\s/g, '')}`, iconSvg: 'phone' },
            { label: 'Address', value: content.contactInfo.address, iconSvg: 'map' },
        ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="contact-pat" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 0,10 L 10,0 M 10,20 L 20,10" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#contact-pat)" />
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
                    <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
                    <p className="mt-4 text-lg text-white/70">We'd love to hear from you. Reach out through any of the channels below.</p>
                </div>
            </div>

            {/* Contact cards */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {items.map((item, i) => (
                        <ContactItemCard key={i} item={item} />
                    ))}
                </div>

                {/* Divider */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <div className="flex justify-center mb-6">
                        <Logo
                            src={content.branding.logoBottom || content.branding.logoTop}
                            className="h-auto w-auto object-contain opacity-80"
                            style={{ maxHeight: '80px', maxWidth: '80px' }}
                        />
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {content.branding.brandName || 'Anker Chicken'}. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
