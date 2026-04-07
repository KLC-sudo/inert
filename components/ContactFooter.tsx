
import React from 'react';
import { useContent } from '../ContentContext';
import Logo from './Logo';

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
);
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


const ContactFooter: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
    const { content } = useContent();

    return (
        <div className="bg-background-light dark:bg-background-dark">
            <section className="py-24 relative overflow-hidden" id="contact">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-primary p-12 md:p-20 rounded-[3rem] relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-40"></div>
                        <h2 className="text-slate-900 text-4xl md:text-6xl font-black mb-6 relative z-10 leading-tight">
                            Ready to set your <br />brand in motion?
                        </h2>
                        <p className="text-slate-900/70 text-lg md:text-xl font-medium mb-10 max-w-2xl relative z-10">
                            Let's collaborate and create something that defies expectations. Our team is ready for the next challenge.
                        </p>
                        <button
                            onClick={() => onNavigate && onNavigate('onboarding')}
                            className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all relative z-10 shadow-2xl"
                        >
                            Start a Project
                        </button>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <img
                            alt={content.branding.brandName || "Inertia Studio"}
                            className="h-8 w-auto"
                            src={content.branding.logoBottom}
                            style={{ maxHeight: `${content.branding.logoBottomSize || 32}px` }}
                        />
                        <p className="text-slate-500 dark:text-slate-500 text-sm">© {new Date().getFullYear()} {content.branding.brandName || "Inertia Studio"}. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a className="text-slate-400 hover:text-primary transition-colors font-bold" href="#">Instagram</a>
                        <a className="text-slate-400 hover:text-primary transition-colors font-bold" href="#">Behance</a>
                        <a className="text-slate-400 hover:text-primary transition-colors font-bold" href="#">Dribbble</a>
                        <a className="text-slate-400 hover:text-primary transition-colors font-bold" href="#">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactFooter;
