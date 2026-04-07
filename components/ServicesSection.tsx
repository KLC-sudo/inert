
import React from 'react';
import { useContent } from '../ContentContext';
import IconRenderer from './IconRenderer';
import type { Service } from '../types';

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col h-full">
    <IconRenderer iconName={service.icon} />
    <h3 className="text-xl font-bold text-pdi-dark-blue mb-3">{service.title}</h3>
    <p className="text-pdi-gray leading-relaxed flex-grow whitespace-pre-line">{service.description}</p>
    {service.subItems && (
      <ul className="mt-4 space-y-2 list-inside list-disc text-pdi-gray">
        {service.subItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

const ServicesSection: React.FC = () => {
  const { content } = useContent();

  const hoverColors = ['hover:border-primary', 'hover:border-secondary', 'hover:border-accent', 'hover:border-primary'];
  const bgColors = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10', 'bg-primary/10'];
  const textColors = ['text-primary', 'text-secondary', 'text-accent', 'text-primary'];

  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-4">{content.servicesTitle}</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold">{content.servicesSubtitle}</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(content.services || []).map((service, idx) => (
            <div key={idx} className={`group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm ${hoverColors[idx % 4]} transition-all duration-300`}>
              <div className={`w-16 h-16 rounded-2xl ${bgColors[idx % 4]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden`}>
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-contain p-3" />
                ) : (
                  <span className={`material-icons ${textColors[idx % 4]} text-3xl`}>
                    {service.icon.includes('/') ? 'view_in_ar' : service.icon.replace('Icon', '').toLowerCase() || 'view_in_ar'}
                  </span>
                )}
              </div>
              <h4 className="text-xl font-bold mb-3">{service.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
