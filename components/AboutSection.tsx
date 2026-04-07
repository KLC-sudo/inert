import React from 'react';
import { useContent } from '../ContentContext';

const AboutSection: React.FC = () => {
    const { content } = useContent();

    return (
        <section id="about" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
                        {content.about.title}
                    </h2>
                    <p className="mt-4 text-lg text-pdi-gray max-w-2xl mx-auto">
                        {content.about.subtitle}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-pdi-dark-blue mb-4">Who We Are</h3>
                        <p className="text-base text-pdi-gray leading-relaxed whitespace-pre-line">
                            {content.about.whoWeAre}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-pdi-dark-blue mb-4">Our Mission</h3>
                        <p className="text-base text-pdi-gray leading-relaxed whitespace-pre-line">
                            {content.about.mission}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-pdi-dark-blue mb-4">Our Vision</h3>
                        <p className="text-base text-pdi-gray leading-relaxed whitespace-pre-line">
                            {content.about.vision}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
