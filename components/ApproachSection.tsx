
import React from 'react';
import { useContent } from '../ContentContext';
import IconRenderer from './IconRenderer';
import type { Approach } from '../types';

const ApproachCard: React.FC<{ approach: Approach; isSingle: boolean }> = ({ approach, isSingle }) => {
    if (isSingle) {
        // Centered layout for single item: icon on top, text below
        return (
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="bg-pdi-red/10 p-6 rounded-full mb-6">
                    <IconRenderer iconName={approach.icon} className="w-[75px] h-[75px]" />
                </div>
                <h4 className="text-2xl font-bold text-pdi-dark-blue mb-4">{approach.title}</h4>
                <p className="text-pdi-gray text-lg whitespace-pre-line leading-relaxed">{approach.description}</p>
            </div>
        );
    }

    // Horizontal layout for multiple items: icon on left, text on right
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-pdi-red/10 p-3 rounded-full">
                <IconRenderer iconName={approach.icon} className="w-[75px] h-[75px]" />
            </div>
            <div>
                <h4 className="text-lg font-bold text-pdi-dark-blue">{approach.title}</h4>
                <p className="text-pdi-gray mt-1 whitespace-pre-line">{approach.description}</p>
            </div>
        </div>
    );
};


const ApproachSection: React.FC = () => {
    const { content } = useContent();
    const isSingleItem = content.approach.length === 1;

    return (
        <section id="approach" className="py-20 bg-pdi-light-gray scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
                            {content.approachTitle}
                        </h2>
                        <p className="mt-4 text-lg text-pdi-gray whitespace-pre-line">
                            {content.approachSubtitle}
                        </p>
                    </div>
                    <div className={isSingleItem ? "" : "grid md:grid-cols-2 gap-8"}>
                        {content.approach.map((item, index) => (
                            <ApproachCard key={index} approach={item} isSingle={isSingleItem} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApproachSection;
