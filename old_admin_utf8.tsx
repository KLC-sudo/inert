import React, { useState, useEffect } from 'react';
import { useContent } from '../../ContentContext';

const ImageUpload: React.FC<{
    label: string;
    currentImage?: string;
    onUpload: (url: string) => void;
    uniqueId?: string;
}> = ({ label, currentImage, onUpload, uniqueId }) => {
    const { uploadImage } = useContent();
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            const url = await uploadImage(file, filename);
            onUpload(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    const inputId = uniqueId || `upload-${label.replace(/\s+/g, '-')}`;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center space-x-4">
                {currentImage && (
                    <div className="relative">
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="h-20 w-20 object-contain border-2 border-green-500 rounded bg-gray-50 p-1"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            Γ£ô
                        </div>
                    </div>
                )}
                <div className="flex flex-col space-y-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={inputId}
                        disabled={uploading}
                    />
                    <label
                        htmlFor={inputId}
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? 'Uploading...' : currentImage ? 'Change Image' : 'Choose Image'}
                    </label>
                    {currentImage && (
                        <span className="text-xs text-green-600 font-medium">Γ£ô Image uploaded</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
    const { content, updateContent, saveChanges } = useContent();
    const [activeTab, setActiveTab] = useState('branding');
    const [analytics, setAnalytics] = useState<any>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    // Fetch analytics when analytics tab is opened
    useEffect(() => {
        if (activeTab === 'analytics' && !analytics) {
            fetchAnalytics();
        }
    }, [activeTab]);

    const fetchAnalytics = async () => {
        setLoadingAnalytics(true);
        try {
            const response = await fetch('/api/analytics/stats');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    // Services CRUD
    const handleServicesChange = (index: number, field: string, value: any) => {
        const newServices = [...content.services];
        newServices[index] = { ...newServices[index], [field]: value };
        updateContent({ ...content, services: newServices });
    };

    const addService = () => {
        const newService = {
            icon: 'BookOpenIcon',
            title: 'New Service',
            description: 'Service description here'
        };
        updateContent({ ...content, services: [...content.services, newService] });
    };

    const deleteService = (index: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const newServices = content.services.filter((_, i) => i !== index);
            updateContent({ ...content, services: newServices });
        }
    };

    // Team CRUD
    const handleTeamChange = (index: number, field: string, value: string) => {
        const newTeam = [...content.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        updateContent({ ...content, team: newTeam });
    };

    const addTeamMember = () => {
        const newMember = {
            name: 'New Team Member',
            role: 'Role description'
        };
        updateContent({ ...content, team: [...content.team, newMember] });
    };

    const deleteTeamMember = (index: number) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            const newTeam = content.team.filter((_, i) => i !== index);
            updateContent({ ...content, team: newTeam });
        }
    };

    // Approach CRUD
    const handleApproachChange = (index: number, field: string, value: string) => {
        const newApproach = [...content.approach];
        newApproach[index] = { ...newApproach[index], [field]: value };
        updateContent({ ...content, approach: newApproach });
    };

    const addApproach = () => {
        const newItem = {
            icon: 'BeakerIcon',
            title: 'New Approach',
            description: 'Approach description'
        };
        updateContent({ ...content, approach: [...content.approach, newItem] });
    };

    const deleteApproach = (index: number) => {
        if (confirm('Are you sure you want to delete this approach item?')) {
            const newApproach = content.approach.filter((_, i) => i !== index);
            updateContent({ ...content, approach: newApproach });
        }
    };

    // Partners CRUD
    const handlePartnerChange = (index: number, field: string, value: string) => {
        const newPartners = [...content.partners];
        newPartners[index] = { ...newPartners[index], [field]: value };
        updateContent({ ...content, partners: newPartners });
    };

    const addPartner = () => {
        const newPartner = {
            name: 'New Partner',
            icon: 'AcademicCapIcon'
        };
        updateContent({ ...content, partners: [...content.partners, newPartner] });
    };

    const deletePartner = (index: number) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            const newPartners = content.partners.filter((_, i) => i !== index);
            updateContent({ ...content, partners: newPartners });
        }
    };

    // Nav Links CRUD
    const handleNavLinkChange = (index: number, field: string, value: string) => {
        const newNavLinks = [...content.navLinks];
        newNavLinks[index] = { ...newNavLinks[index], [field]: value };
        updateContent({ ...content, navLinks: newNavLinks });
    };

    const addNavLink = () => {
        const newLink = {
            name: 'New Link',
            href: '#new'
        };
        updateContent({ ...content, navLinks: [...content.navLinks, newLink] });
    };

    const deleteNavLink = (index: number) => {
        if (confirm('Are you sure you want to delete this navigation link?')) {
            const newNavLinks = content.navLinks.filter((_, i) => i !== index);
            updateContent({ ...content, navLinks: newNavLinks });
        }
    };

    // Portfolio CRUD
    const handlePortfolioChange = (index: number, field: string, value: string) => {
        const newPortfolio = [...(content.portfolioItems || [])];
        newPortfolio[index] = { ...newPortfolio[index], [field]: value };
        updateContent({ ...content, portfolioItems: newPortfolio });
    };

    const addPortfolioItem = () => {
        const newItem = {
            image: '',
            category: 'Motion',
            title: 'New Project',
            description: 'Project description'
        };
        updateContent({ ...content, portfolioItems: [...(content.portfolioItems || []), newItem] });
    };

    const deletePortfolioItem = (index: number) => {
        if (confirm('Are you sure you want to delete this portfolio item?')) {
            const newPortfolio = (content.portfolioItems || []).filter((_, i) => i !== index);
            updateContent({ ...content, portfolioItems: newPortfolio });
        }
    };

    // Arsenal CRUD
    const handleArsenalChange = (index: number, field: string, value: any) => {
        const newArsenal = [...(content.arsenalItems || [])];
        newArsenal[index] = { ...newArsenal[index], [field]: value };
        updateContent({ ...content, arsenalItems: newArsenal });
    };

    const addArsenalItem = () => {
        const newItem = { name: 'New Tool', color: '', isItalic: false };
        updateContent({ ...content, arsenalItems: [...(content.arsenalItems || []), newItem] });
    };

    const deleteArsenalItem = (index: number) => {
        if (confirm('Delete this arsenal item?')) {
            const newArsenal = (content.arsenalItems || []).filter((_, i) => i !== index);
            updateContent({ ...content, arsenalItems: newArsenal });
        }
    };



    const handleBrandingChange = (field: string, value: string | number) => {
        updateContent({
            ...content,
            branding: { ...content.branding, [field]: value }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">BBox Admin</h1>
                <div className="flex gap-3">
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            ≡ƒÜ¬ Logout
                        </button>
                    )}
                    <button
                        onClick={saveChanges}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors shadow-sm"
                    >
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
                {['branding', 'hero', 'services', 'portfolio', 'arsenal', 'trust-badges', 'about', 'navigation', 'team', 'analytics', 'contact'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold capitalize transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-pdi-red text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        {tab.replace(/-/g, ' ')}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {activeTab === 'branding' && (
                    <div className="max-w-2xl space-y-8">
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Logo Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <ImageUpload
                                        label="Top Navigation Logo"
                                        currentImage={content.branding.logoTop}
                                        onUpload={(url) => handleBrandingChange('logoTop', url)}
                                    />
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Logo Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[32, 48, 64, 80, 100, 120, 150].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleBrandingChange('logoTopSize', size)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${content.branding.logoTopSize === size
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {size}px
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ImageUpload
                                        label="Footer Logo"
                                        currentImage={content.branding.logoBottom}
                                        onUpload={(url) => handleBrandingChange('logoBottom', url)}
                                    />
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[64, 80, 100, 120, 150, 180, 200, 250].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => handleBrandingChange('logoBottomSize', size)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${content.branding.logoBottomSize === size
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {size}px
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="max-w-4xl space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">About Section Content</h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="aboutVisible"
                                    checked={content.aboutVisible}
                                    onChange={(e) => updateContent({ ...content, aboutVisible: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="aboutVisible" className="text-sm font-medium text-gray-700">
                                    Show this section on homepage
                                </label>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                <input
                                    type="text"
                                    value={content.about.title}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, title: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={content.about.subtitle}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, subtitle: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Who We Are</label>
                                <textarea
                                    rows={5}
                                    value={content.about.whoWeAre}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, whoWeAre: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Our Mission</label>
                                <textarea
                                    rows={3}
                                    value={content.about.mission}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, mission: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Our Vision</label>
                                <textarea
                                    rows={3}
                                    value={content.about.vision}
                                    onChange={(e) => updateContent({ ...content, about: { ...content.about, vision: e.target.value } })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-8">
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.servicesTitle}
                                        onChange={(e) => updateContent({ ...content, servicesTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.servicesSubtitle}
                                        onChange={(e) => updateContent({ ...content, servicesSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Services</h3>
                            <button
                                onClick={addService}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Service
                            </button>
                        </div>
                        {content.services.map((service, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteService(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    Γ£ò
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={service.title}
                                            onChange={(e) => handleServicesChange(idx, 'title', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Heroicon name)</label>
                                        <input
                                            type="text"
                                            value={service.icon}
                                            onChange={(e) => handleServicesChange(idx, 'icon', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={2}
                                            value={service.description}
                                            onChange={(e) => handleServicesChange(idx, 'description', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <ImageUpload
                                            label="Service Image (optional)"
                                            currentImage={service.image}
                                            onUpload={(url) => handleServicesChange(idx, 'image', url)}
                                            uniqueId={`service-img-${idx}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Portfolio Items</h3>
                            <button
                                onClick={addPortfolioItem}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Project
                            </button>
                        </div>
                        {(content.portfolioItems || []).map((item, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative space-y-6">
                                <button
                                    onClick={() => deletePortfolioItem(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    Γ£ò
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handlePortfolioChange(idx, 'title', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={item.category}
                                                onChange={(e) => handlePortfolioChange(idx, 'category', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                rows={3}
                                                value={item.description}
                                                onChange={(e) => handlePortfolioChange(idx, 'description', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 border-l border-gray-200 pl-6">
                                        <div>
                                            <ImageUpload
                                                label="Main Image"
                                                currentImage={item.image}
                                                onUpload={(url) => handlePortfolioChange(idx, 'image', url)}
                                                uniqueId={`portfolio-img-${idx}`}
                                            />
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images Gallery</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {(item.additionalImages || []).map((addImg, imgIdx) => (
                                                    <div key={imgIdx} className="relative group">
                                                        <img src={addImg} alt={`add-img-${imgIdx}`} className="h-16 w-16 object-cover rounded-md border border-gray-300" />
                                                        <button
                                                            onClick={() => {
                                                                const newImages = [...(item.additionalImages || [])];
                                                                newImages.splice(imgIdx, 1);
                                                                const newPortfolio = [...(content.portfolioItems || [])];
                                                                newPortfolio[idx] = { ...newPortfolio[idx], additionalImages: newImages };
                                                                updateContent({ ...content, portfolioItems: newPortfolio });
                                                            }}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Γ£ò
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <ImageUpload
                                                label=""
                                                onUpload={(url) => {
                                                    const newImages = [...(item.additionalImages || []), url];
                                                    const newPortfolio = [...(content.portfolioItems || [])];
                                                    newPortfolio[idx] = { ...newPortfolio[idx], additionalImages: newImages };
                                                    updateContent({ ...content, portfolioItems: newPortfolio });
                                                }}
                                                uniqueId={`portfolio-addimg-${idx}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'arsenal' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Creative Arsenal</h3>
                            </div>
                            <button
                                onClick={addArsenalItem}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Tool
                            </button>
                        </div>
                        {(content.arsenalItems || []).map((item, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteArsenalItem(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    Γ£ò
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleArsenalChange(idx, 'name', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color (optional)</label>
                                                <input
                                                    type="text"
                                                    value={item.color || ''}
                                                    onChange={(e) => handleArsenalChange(idx, 'color', e.target.value)}
                                                    placeholder="e.g. #FF0000"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 pt-6">
                                                <input
                                                    type="checkbox"
                                                    id={`italic-${idx}`}
                                                    checked={item.isItalic || false}
                                                    onChange={(e) => handleArsenalChange(idx, 'isItalic', e.target.checked)}
                                                    className="w-5 h-5 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`italic-${idx}`} className="text-sm font-medium text-gray-700">
                                                    Italic Text
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-l border-gray-200 pl-6">
                                        <ImageUpload
                                            label="Tool Logo / Image"
                                            currentImage={item.image}
                                            onUpload={(url) => handleArsenalChange(idx, 'image', url)}
                                            uniqueId={`arsenal-img-${idx}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'navigation' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Navigation Links</h3>
                            <button
                                onClick={addNavLink}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Link
                            </button>
                        </div>
                        {content.navLinks.map((link, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteNavLink(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    Γ£ò
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Name</label>
                                        <input
                                            type="text"
                                            value={link.name}
                                            onChange={(e) => handleNavLinkChange(idx, 'name', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Target (href)</label>
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => handleNavLinkChange(idx, 'href', e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'hero' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Hero Slides</h3>
                            <button
                                onClick={() => {
                                    const newSlide = { bgType: 'svg' as const, svgPatternIndex: 0, badge: '', heading: 'New Heading.', headingAccent: 'New Accent.', subtext: '', primaryCta: { label: 'Shop Now', href: '#services' }, secondaryCta: { label: 'Learn More', href: '#about' } };
                                    updateContent({ ...content, heroSlides: [...(content.heroSlides || []), newSlide] });
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Slide
                            </button>
                        </div>
                        {(content.heroSlides || []).map((slide, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative space-y-4">
                                <button
                                    onClick={() => { if (confirm('Delete this slide?')) updateContent({ ...content, heroSlides: content.heroSlides.filter((_, i) => i !== idx) }); }}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold" title="Delete"
                                >Γ£ò</button>
                                <p className="font-semibold text-gray-700">Slide {idx + 1}</p>
                                {/* --- Background type toggle --- */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
                                    <div className="flex gap-3">
                                        {(['image', 'svg'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], bgType: type }; updateContent({ ...content, heroSlides: s }); }}
                                                className={`px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${(slide.bgType ?? (slide.bgImage ? 'image' : 'svg')) === type ? 'border-pdi-red bg-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                            >
                                                {type === 'image' ? '\uD83D\uDDBC\uFE0F Photo / Image' : '\u2736 SVG Pattern'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* --- Image background --- */}
                                {(slide.bgType ?? (slide.bgImage ? 'image' : 'svg')) === 'image' && (
                                    <div className="space-y-2">
                                        <ImageUpload
                                            label="Background Image"
                                            currentImage={slide.bgImage || undefined}
                                            onUpload={(url) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], bgImage: url }; updateContent({ ...content, heroSlides: s }); }}
                                            uniqueId={`hero-bg-${idx}`}
                                        />
                                        {slide.bgImage && (
                                            <button onClick={() => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], bgImage: '' }; updateContent({ ...content, heroSlides: s }); }} className="text-xs text-red-500 hover:underline">Remove image</button>
                                        )}
                                    </div>
                                )}

                                {/* --- SVG pattern picker --- */}
                                {(slide.bgType ?? (slide.bgImage ? 'image' : 'svg')) === 'svg' && (
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Choose Pattern</label>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                            {['Diagonal Lines', 'Dots', 'Zigzag', 'Circles', 'Triangles', 'Diamond Grid'].map((name, pidx) => (
                                                <button
                                                    key={pidx}
                                                    onClick={() => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], svgPatternIndex: pidx, customSvg: '' }; updateContent({ ...content, heroSlides: s }); }}
                                                    className={`p-2 rounded-lg border-2 text-xs font-semibold transition-all text-center ${(slide.svgPatternIndex ?? 0) === pidx && !slide.customSvg ? 'border-pdi-red bg-red-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Or paste custom SVG code (overrides picker above)</label>
                                            <textarea
                                                rows={3}
                                                value={slide.customSvg || ''}
                                                onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], customSvg: e.target.value }; updateContent({ ...content, heroSlides: s }); }}
                                                className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-blue-600 focus:border-blue-600"
                                                placeholder="<svg>...</svg>"
                                            />
                                            {slide.customSvg && <button onClick={() => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], customSvg: '' }; updateContent({ ...content, heroSlides: s }); }} className="text-xs text-red-500 hover:underline">Clear custom SVG</button>}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text (optional)</label>
                                        <input type="text" value={slide.badge || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], badge: e.target.value }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="e.g. FRESH QUALITY SINCE 2018" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading (first line)</label>
                                        <input type="text" value={slide.heading} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], heading: e.target.value }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading Accent (red italic line)</label>
                                        <input type="text" value={slide.headingAccent || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], headingAccent: e.target.value }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Label</label>
                                        <input type="text" value={slide.primaryCta?.label || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], primaryCta: { ...s[idx].primaryCta!, label: e.target.value } }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Link</label>
                                        <input type="text" value={slide.primaryCta?.href || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], primaryCta: { ...s[idx].primaryCta!, href: e.target.value } }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Label</label>
                                        <input type="text" value={slide.secondaryCta?.label || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], secondaryCta: { ...s[idx].secondaryCta!, label: e.target.value } }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtext / Tagline</label>
                                        <textarea rows={2} value={slide.subtext || ''} onChange={(e) => { const s = [...content.heroSlides]; s[idx] = { ...s[idx], subtext: e.target.value }; updateContent({ ...content, heroSlides: s }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'trust-badges' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Trust Badges</h3>
                            <button
                                onClick={() => updateContent({ ...content, trustBadges: [...(content.trustBadges || []), { icon: 'Γ¡É', title: 'New Badge', subtitle: 'Badge description' }] })}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >+ Add Badge</button>
                        </div>
                        {(content.trustBadges || []).map((badge, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button onClick={() => { if (confirm('Delete badge?')) updateContent({ ...content, trustBadges: content.trustBadges.filter((_, i) => i !== idx) }); }} className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold">Γ£ò</button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji or Image)</label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={badge.icon}
                                                placeholder="Emoji or URL"
                                                onChange={(e) => { const b = [...content.trustBadges]; b[idx] = { ...b[idx], icon: e.target.value }; updateContent({ ...content, trustBadges: b }); }}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600"
                                            />
                                            <div className="text-xs text-center text-gray-500">- OR -</div>
                                            <ImageUpload
                                                label="Upload Icon"
                                                currentImage={(badge.icon && (badge.icon.startsWith('/') || badge.icon.startsWith('http'))) ? badge.icon : ''}
                                                onUpload={(url) => { const b = [...content.trustBadges]; b[idx] = { ...b[idx], icon: url }; updateContent({ ...content, trustBadges: b }); }}
                                                uniqueId={`trust-badge-${idx}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input type="text" value={badge.title} onChange={(e) => { const b = [...content.trustBadges]; b[idx] = { ...b[idx], title: e.target.value }; updateContent({ ...content, trustBadges: b }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input type="text" value={badge.subtitle} onChange={(e) => { const b = [...content.trustBadges]; b[idx] = { ...b[idx], subtitle: e.target.value }; updateContent({ ...content, trustBadges: b }); }} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}




                {activeTab === 'team' && (
                    <div className="space-y-8">
                        {/* Section Metadata */}
                        <div className="p-6 border border-gray-200 rounded-xl bg-blue-50/30">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">Section Settings</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                    <input
                                        type="text"
                                        value={content.teamTitle}
                                        onChange={(e) => updateContent({ ...content, teamTitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                    <textarea
                                        rows={2}
                                        value={content.teamSubtitle}
                                        onChange={(e) => updateContent({ ...content, teamSubtitle: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="teamVisible"
                                        checked={content.teamVisible}
                                        onChange={(e) => updateContent({ ...content, teamVisible: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="teamVisible" className="text-sm font-medium text-gray-700">
                                        Show this section on homepage
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Team Members</h3>
                            <button
                                onClick={addTeamMember}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Member
                            </button>
                        </div>
                        {content.team.map((member, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative">
                                <button
                                    onClick={() => deleteTeamMember(idx)}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                    title="Delete"
                                >
                                    Γ£ò
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <input
                                                type="text"
                                                value={member.role}
                                                onChange={(e) => handleTeamChange(idx, 'role', e.target.value)}
                                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center border-l border-gray-200 pl-6">
                                        <ImageUpload
                                            label="Team Photo"
                                            currentImage={member.image}
                                            onUpload={(url) => handleTeamChange(idx, 'image', url)}
                                            uniqueId={`team-photo-${idx}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}





                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Visitor Analytics</h3>
                            <button
                                onClick={fetchAnalytics}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                ≡ƒöä Refresh
                            </button>
                        </div>

                        {loadingAnalytics ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Loading analytics...</p>
                            </div>
                        ) : analytics ? (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Total Page Views</div>
                                        <div className="text-3xl font-bold">{analytics.totalPageViews.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Unique Visitors (All Time)</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.allTime.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Visitors This Month</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.month.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                                        <div className="text-sm opacity-90 mb-1">Visitors Today</div>
                                        <div className="text-3xl font-bold">{analytics.uniqueVisitors.today.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Top Pages */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-slate-900 mb-4">Top Pages</h4>
                                    <div className="space-y-2">
                                        {analytics.topPages.map((page: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <span className="text-gray-700 font-mono text-sm">{page.path}</span>
                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{page.count} views</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Referrers */}
                                {analytics.topReferrers.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-slate-900 mb-4">Top Referrers</h4>
                                        <div className="space-y-2">
                                            {analytics.topReferrers.map((ref: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-700 text-sm">{ref.referrer}</span>
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{ref.count} visits</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Visitors */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-slate-900 mb-4">Recent Visitors (Last 500)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Time</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">IP Address</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Page</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Referrer</th>
                                                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.recentVisitors.map((visitor: any, idx: number) => (
                                                    <tr
                                                        key={idx}
                                                        className={`border-b border-gray-100 hover:bg-gray-50 ${visitor.isMalicious || visitor.isBlacklisted ? 'bg-red-50' : ''
                                                            }`}
                                                    >
                                                        <td className="p-3 text-gray-600">{new Date(visitor.timestamp).toLocaleString()}</td>
                                                        <td className="p-3 font-mono text-gray-700 font-semibold">{visitor.ip}</td>
                                                        <td className="p-3 font-mono text-gray-700">{visitor.path}</td>
                                                        <td className="p-3 text-gray-600 truncate max-w-xs">{visitor.referrer}</td>
                                                        <td className="p-3">
                                                            {visitor.isMalicious || visitor.isBlacklisted ? (
                                                                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                                    ≡ƒÜ½ THREAT
                                                                </span>
                                                            ) : (
                                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                                    Γ£ô Safe
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No analytics data available yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Contact Channels</h3>
                                <p className="text-sm text-gray-500 mt-1">Add any contact method. Each gets a card on the Contact page.</p>
                            </div>
                            <button
                                onClick={() => {
                                    const items = (content as any).contactItems || [];
                                    updateContent({ ...content, contactItems: [...items, { label: 'New Channel', value: '', href: '', iconSvg: 'phone', icon: '' }] } as any);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                + Add Channel
                            </button>
                        </div>

                        {((content as any).contactItems || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 relative space-y-4">
                                <button
                                    onClick={() => {
                                        const items = [...((content as any).contactItems || [])];
                                        items.splice(idx, 1);
                                        updateContent({ ...content, contactItems: items } as any);
                                    }}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-bold"
                                >Γ£ò</button>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                                        <input
                                            type="text"
                                            value={item.label}
                                            placeholder="e.g. WhatsApp"
                                            onChange={(e) => {
                                                const items = [...((content as any).contactItems || [])];
                                                items[idx] = { ...items[idx], label: e.target.value };
                                                updateContent({ ...content, contactItems: items } as any);
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Display Value</label>
                                        <input
                                            type="text"
                                            value={item.value}
                                            placeholder="e.g. +256 123 456 789"
                                            onChange={(e) => {
                                                const items = [...((content as any).contactItems || [])];
                                                items[idx] = { ...items[idx], value: e.target.value };
                                                updateContent({ ...content, contactItems: items } as any);
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Link (href) ΓÇö optional</label>
                                        <input
                                            type="text"
                                            value={item.href || ''}
                                            placeholder="mailto:... / tel:... / https://wa.me/..."
                                            onChange={(e) => {
                                                const items = [...((content as any).contactItems || [])];
                                                items[idx] = { ...items[idx], href: e.target.value };
                                                updateContent({ ...content, contactItems: items } as any);
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Built-in Icon</label>
                                        <select
                                            value={item.iconSvg || 'phone'}
                                            onChange={(e) => {
                                                const items = [...((content as any).contactItems || [])];
                                                items[idx] = { ...items[idx], iconSvg: e.target.value };
                                                updateContent({ ...content, contactItems: items } as any);
                                            }}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600 bg-white"
                                        >
                                            <option value="mail">Γ£ë Email</option>
                                            <option value="phone">≡ƒô₧ Phone</option>
                                            <option value="map">≡ƒôì Address / Map</option>
                                            <option value="whatsapp">≡ƒÆ¼ WhatsApp</option>
                                            <option value="globe">≡ƒîÉ Website</option>
                                            <option value="instagram">≡ƒô╕ Instagram</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Custom Icon Image (overrides built-in)</label>
                                        <ImageUpload
                                            currentImage={item.icon || ''}
                                            onUpload={(url) => {
                                                const items = [...((content as any).contactItems || [])];
                                                items[idx] = { ...items[idx], icon: url };
                                                updateContent({ ...content, contactItems: items } as any);
                                            }}
                                            label="Custom Icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Legacy sync fields (hidden, kept for server compat) */}
                        <details className="mt-6">
                            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Legacy contact fields (advanced)</summary>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input type="email" value={content.contactInfo.email} onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, email: e.target.value } })} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                    <input type="text" value={content.contactInfo.phone} onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, phone: e.target.value } })} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                                    <input type="text" value={content.contactInfo.address} onChange={(e) => updateContent({ ...content, contactInfo: { ...content.contactInfo, address: e.target.value } })} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600" />
                                </div>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
