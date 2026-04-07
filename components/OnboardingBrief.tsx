import React, { useState } from 'react';
import { useContent } from '../ContentContext';

const OnboardingBrief: React.FC = () => {
    const { content } = useContent();

    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [projectBrief, setProjectBrief] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [clientData, setClientData] = useState({ name: '', phone: '', email: '', location: '' });

    const services = [
        { id: '3D Motion & VFX', title: '3D Motion & VFX', description: 'Stunning visuals that pop.', icon: 'movie' },
        { id: 'UI/UX Design', title: 'UI/UX Design', description: 'Clean, intuitive interfaces.', icon: 'devices' },
        { id: 'Web & App Dev', title: 'Web & App Dev', description: 'Scalable, fast performance.', icon: 'code' },
        { id: 'Graphic Design', title: 'Graphic Design', description: 'Identity for the next era.', icon: 'auto_awesome' },
    ];

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const isStep2Valid = projectBrief.trim() !== '' && budget.trim() !== '' && timeline.trim() !== '';
    const isStep3Valid = clientData.name.trim() !== '' && (clientData.phone.trim() !== '' || clientData.email.trim() !== '');

    const whatsappItem = content.contactItems?.find((i: any) => i.label === 'WhatsApp');
    const emailItem = content.contactItems?.find((i: any) => i.label === 'Email');

    const generateMessage = () => {
        return `Hi Inertia Team, I'm ${clientData.name} from ${clientData.location || 'unknown'}. 
I'm interested in: ${selectedServices.join(', ')}.
Project Brief: ${projectBrief || 'Not specified'}
Budget Expectation: ${currency} ${budget || 'Not specified'}
Timeline Expectation: ${timeline || 'Not specified'}

Please get back to me!`;
    };

    const handleWhatsApp = () => {
        if (!whatsappItem) return;
        const msg = encodeURIComponent(generateMessage());
        window.open(`${whatsappItem.href}?text=${msg}`, '_blank');
    };

    const handleEmail = () => {
        if (!emailItem) return;
        const subject = encodeURIComponent(`New Project Inquiry from ${clientData.name}`);
        const body = encodeURIComponent(generateMessage());
        window.open(`${emailItem.href}?subject=${subject}&body=${body}`, '_blank');
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden" id="brief-builder">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header Phase */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
                        Turn your <span className="text-primary italic">vision</span> into <span className="text-secondary">motion.</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Skip the boring forms. Use our interactive brief builder to define your project needs and get a custom quote in minutes.
                    </p>
                </div>

                {/* Progress Bar Gradient */}
                <div className="flex justify-center mb-16">
                    <div className="h-1 w-64 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-80"></div>
                </div>

                {/* Main Interactive Card */}
                <div className="bg-slate-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100 transition-all duration-500 min-h-[500px]">
                    <div className="grid md:grid-cols-[1fr_1.5fr] h-full min-h-[500px]">

                        {/* Left Info Panel */}
                        <div className="p-10 md:p-14 flex flex-col justify-between bg-white border-r border-slate-100">
                            <div>
                                {/* Step Indicators */}
                                <div className="flex space-x-2.5 mb-10">
                                    {[1, 2, 3, 4].map(num => (
                                        <div
                                            key={num}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === num ? 'bg-primary shadow-[0_0_12px_rgba(0,229,255,0.6)]' : step > num ? 'bg-slate-900' : 'bg-slate-200'}`}
                                        ></div>
                                    ))}
                                </div>

                                {step === 1 && (
                                    <>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">The Spark</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            Every great project starts with a single need. Select one or more areas you need help with.
                                        </p>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">The Scope</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            Give us a rough idea of your timeline and budget expectations so we can align our resources.
                                        </p>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">The Details</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            Tell us who you are. We need your name and at least one way to reach you (email or phone).
                                        </p>
                                    </>
                                )}
                                {step === 4 && (
                                    <>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">The Connection</h3>
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                            You're all set! Choose how you'd like to reach out. We've prepared a summary of your brief.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Pro Tip Card */}
                            {step === 1 && (
                                <div className="mt-12 bg-white shadow-sm border border-slate-100 p-5 rounded-3xl flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-400 flex-shrink-0">
                                        <span className="material-icons text-xl">emoji_objects</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Pro Tip</h4>
                                        <p className="text-[13px] font-bold text-slate-700 leading-snug">
                                            Not sure what you need? Select everything that sounds relevant and we'll help you narrow it down.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {step > 1 && (
                                <div className="mt-12">
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-icons text-[16px]">arrow_back</span> Go Back
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Interactive Panel */}
                        <div className="p-10 md:p-14 relative bg-white flex flex-col justify-center">
                            {/* Subtle Grid Background */}
                            <div className="absolute inset-0 bg-[#f8fafc] [mask-image:linear-gradient(to_bottom,white_40%,transparent)] pointer-events-none">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#slate-200_1px,transparent_1px),linear-gradient(to_bottom,#slate-200_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
                            </div>

                            <div className="relative z-10 w-full">
                                {step === 1 && (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                        <h4 className="text-xl font-bold text-slate-900 mb-6">What do you need help with?</h4>
                                        <div className="grid sm:grid-cols-2 gap-4 p-4">
                                            {services.map((service) => (
                                                <button
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={`p-5 text-left rounded-[1.5rem] border-2 transition-all duration-300 bg-white group hover:shadow-lg relative ${selectedServices.includes(service.id)
                                                        ? 'border-slate-900 ring-1 ring-slate-900 shadow-[0_5px_15px_rgba(0,0,0,0.08)] scale-[1.02] z-20'
                                                        : 'border-slate-100 hover:border-slate-200 z-10'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className={`material-icons text-[24px] transition-colors ${selectedServices.includes(service.id) ? 'text-primary' : 'text-slate-400 group-hover:text-slate-900'
                                                            }`}>
                                                            {service.icon}
                                                        </span>
                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedServices.includes(service.id) ? 'bg-slate-900 border-slate-900' : 'bg-transparent border-slate-200 group-hover:border-slate-300'
                                                            }`}>
                                                            {selectedServices.includes(service.id) && <span className="material-icons text-white text-[14px]">check</span>}
                                                        </div>
                                                    </div>
                                                    <h5 className="font-bold text-slate-900 mb-1 text-sm">{service.title}</h5>
                                                    <p className="text-[12px] font-medium text-slate-500 line-clamp-1">{service.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                        <div className={`mt-12 transition-all duration-500 flex justify-end ${selectedServices.length > 0 ? 'opacity-100' : 'opacity-0 h-0 pointer-events-none overflow-hidden'}`}>
                                            <button onClick={() => setStep(2)} className="bg-primary text-slate-900 font-bold px-8 py-3.5 rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                                Next Step
                                                <span className="material-icons text-sm">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">A Brief About Your Project *</label>
                                            <textarea
                                                value={projectBrief}
                                                onChange={(e) => setProjectBrief(e.target.value)}
                                                placeholder="Tell us a bit about what you want to achieve..."
                                                rows={3}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Estimated Budget *</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                    className="px-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-bold text-slate-900 cursor-pointer"
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="UGX">UGX</option>
                                                    <option value="KSH">KSH</option>
                                                    <option value="TSH">TSH</option>
                                                    <option value="RWF">RWF</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    value={budget}
                                                    min="0"
                                                    onChange={(e) => setBudget(e.target.value)}
                                                    placeholder="e.g. 5000"
                                                    className="flex-1 px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Ideal Timeline *</label>
                                            <input
                                                type="date"
                                                value={timeline}
                                                onChange={(e) => setTimeline(e.target.value)}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                            />
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={() => setStep(3)}
                                                disabled={!isStep2Valid}
                                                className={`font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-xl ${isStep2Valid ? 'bg-primary text-slate-900 hover:scale-105 shadow-primary/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                                            >
                                                Next Step
                                                <span className="material-icons text-sm">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                value={clientData.name}
                                                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={clientData.location}
                                                onChange={(e) => setClientData({ ...clientData, location: e.target.value })}
                                                placeholder="City, Country"
                                                className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={clientData.email}
                                                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={clientData.phone}
                                                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                                                    placeholder="+1 234 567 890"
                                                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-slate-900"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">* Name is required. Please provide either an Email or Phone number.</p>

                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={() => setStep(4)}
                                                disabled={!isStep3Valid}
                                                className={`font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-xl ${isStep3Valid ? 'bg-primary text-slate-900 hover:scale-105 shadow-primary/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                    }`}
                                            >
                                                Final Step
                                                <span className="material-icons text-sm">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="text-center animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
                                            <span className="material-icons text-4xl text-green-500">task_alt</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-2">Ready to Connect!</h4>
                                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                                            Choose your preferred method to send your brief to our team.
                                        </p>

                                        <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                            {whatsappItem && (
                                                <button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 transition-colors">
                                                    <span className="material-icons">chat</span>
                                                    Send via WhatsApp
                                                </button>
                                            )}
                                            {emailItem && (
                                                <button onClick={handleEmail} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-colors">
                                                    <span className="material-icons">mail</span>
                                                    Send via Email
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Background ambient glows matching reference */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none"></div>
        </section>
    );
};

export default OnboardingBrief;
