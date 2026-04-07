
import React from 'react';

export interface Service {
  icon: string;
  title: string;
  description: string;
  subItems?: string[];
  image?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
}

export interface Approach {
  title: string;
  description: string;
  icon: string;
}

export interface Partner {
  name: string;
  icon: string;
}

export interface ContactItem {
  label: string;      // e.g. "Email", "WhatsApp", "Address"
  value: string;      // Display value
  href?: string;      // Optional link: mailto:, tel:, https://wa.me/...
  icon?: string;      // Custom uploaded image URL
  iconSvg?: string;  // Built-in key: mail | phone | map | whatsapp | globe | instagram
}

export interface GalleryImage {
  image: string;
  caption?: string;
  alt: string;
}

export interface Branding {
  logoTop: string;
  logoBottom: string;
  logoTopSize: number;      // Size in pixels (32-250)
  logoBottomSize: number;   // Size in pixels (32-250)
  brandName?: string;       // Text beside logo e.g. "ANKER CHICKEN"
}

export interface About {
  title: string;
  subtitle: string;
  whoWeAre: string;
  mission: string;
  vision: string;
}

// Hero slide — supports multiple slides (carousel)
export interface HeroSlide {
  bgType?: 'image' | 'svg';  // 'image' = uploaded photo, 'svg' = built-in/custom pattern
  bgImage?: string;          // Upload path (used when bgType='image')
  svgPatternIndex?: number;  // 0-5 for built-in SVG patterns (used when bgType='svg')
  customSvg?: string;        // Raw SVG markup override (used when bgType='svg')
  badge?: string;            // e.g. "FRESH QUALITY SINCE 2018"
  heading: string;           // Main headline
  headingAccent?: string;    // Second line shown in red italic
  subtext?: string;          // Short tagline below heading
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface TrustBadge {
  icon: string;             // emoji or icon name
  title: string;
  subtitle: string;
}


export interface PortfolioItem {
  image: string;
  category: string;
  title: string;
  description: string;
  additionalImages?: string[];
}

export interface CreativeArsenalItem {
  name: string;
  color?: string;
  isItalic?: boolean;
  image?: string;
}

export interface Content {
  // Section metadata
  servicesTitle: string;
  servicesSubtitle: string;
  approachTitle: string;
  approachSubtitle: string;
  partnersTitle: string;
  partnersSubtitle: string;
  partnersVisible: boolean;
  teamTitle: string;
  teamSubtitle: string;
  teamVisible: boolean;
  aboutVisible: boolean;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryVisible: boolean;

  // Portfolio & Arsenal
  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioItems: PortfolioItem[];
  arsenalTitle: string;
  arsenalItems: CreativeArsenalItem[];

  // New sections
  shopNowHref: string;
  heroSlides: HeroSlide[];
  trustBadges: TrustBadge[];

  // Content arrays
  navLinks: { name: string; href: string }[];
  branding: Branding;
  about: About;
  services: Service[];
  team: TeamMember[];
  approach: Approach[];
  partners: Partner[];
  gallery: GalleryImage[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  contactItems?: ContactItem[];

  // Checkout Configuration
  checkoutWhatsApp?: string;
  checkoutEmail?: string;
}
