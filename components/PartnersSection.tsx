
import React from 'react';
import { useContent } from '../ContentContext';
import IconRenderer from './IconRenderer';
import type { Partner } from '../types';

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
    <div className="flex justify-center mb-4">
      <IconRenderer iconName={partner.icon} className="w-[75px] h-[75px] text-pdi-red" />
    </div>
    <h4 className="font-semibold text-pdi-dark-blue">{partner.name}</h4>
  </div>
);

const PartnersSection: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="partners" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
            {content.partnersTitle}
          </h2>
          <p className="mt-4 text-lg text-pdi-gray max-w-2xl mx-auto whitespace-pre-line">
            {content.partnersSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {content.partners.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
