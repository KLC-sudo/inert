import React from 'react';

// Icons
const BookOpenIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const ComputerDesktopIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
);

const AcademicCapIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
    </svg>
);

const MagnifyingGlassIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const BeakerIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const CpuChipIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 15v1.5M12 4.5v-1.5m0 18v-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5v10.5h-7.5z" />
    </svg>
);

interface IconRendererProps {
    iconName: string;
    className?: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className = "w-[75px] h-[75px] mb-4" }) => {
    // If iconName is a URL (starts with '/'), render it as an image
    if (iconName && iconName.startsWith('/')) {
        return <img src={iconName} className={className} alt="Icon" />;
    }

    // Otherwise, render predefined icons
    switch (iconName) {
        case 'BookOpenIcon':
            return <BookOpenIcon className={className} />;
        case 'ComputerDesktopIcon':
            return <ComputerDesktopIcon className={className} />;
        case 'AcademicCapIcon':
            return <AcademicCapIcon className={className} />;
        case 'MagnifyingGlassIcon':
            return <MagnifyingGlassIcon className={className} />;
        case 'BeakerIcon':
            return <BeakerIcon className={className} />;
        case 'CpuChipIcon':
            return <CpuChipIcon className={className} />;
        case 'StakeholderCapacityDevelopment':
            return <img src="/icons/Stakeholder Capacity Development.svg" className={className} alt="Stakeholder Capacity Development" />;
        case 'PolicyAndTransformation':
            return <img src="/icons/Policy and Transformation.svg" className={className} alt="Policy and Transformation" />;
        case 'ParticipatoryContextualized':
            return <img src="/icons/Participatory & Contextualized.svg" className={className} alt="Participatory & Contextualized" />;
        case 'CapacityFocused':
            return <img src="/icons/Capacity-Focused.svg" className={className} alt="Capacity-Focused" />;
        case 'NGOs':
            return <img src="/icons/Non-Governmental Organizations (NGOs).svg" className={className} alt="NGOs" />;
        case 'DevelopmentPartners':
            return <img src="/icons/Development Partners and Donors.svg" className={className} alt="Development Partners" />;
        case 'CommunityOrganizations':
            return <img src="/icons/Community-Based Organizations.svg" className={className} alt="Community Organizations" />;
        default:
            return null;
    }
};

export default IconRenderer;
