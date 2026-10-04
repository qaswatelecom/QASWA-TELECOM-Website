import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';

export interface HeroSlide {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
}

export interface DeviceCategoryItem {
  id: string;
  name: string;
  sub: string;
  image: string;
}

export interface TrustCardItem {
  title: string;
  desc: string;
  iconName?: string;
}

export interface GalleryItem {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  device: string;
  repairType: string;
}

export interface HomePageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    slides: HeroSlide[];
    deviceCategories: DeviceCategoryItem[];
  };
  trustCards: {
    badge: string;
    title: string;
    subtitle: string;
    cards: TrustCardItem[];
  };
  aboutSection: {
    badge: string;
    title: string;
    description: string;
    secondaryText: string;
    imageUrl: string;
    floatingBadgeTitle: string;
    floatingBadgeDesc: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
  };
  repairGallery: {
    badge: string;
    title: string;
    subtitle: string;
    images: GalleryItem[];
  };
  ctaBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
}

export interface AboutExpertiseItem {
  title: string;
  desc: string;
}

export interface AboutGalleryItem {
  url: string;
  title: string;
  caption: string;
}

export interface AboutPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  story: {
    badge: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    imageUrl: string;
  };
  specialization: {
    badge: string;
    title: string;
    description: string;
    items: AboutExpertiseItem[];
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    images: AboutGalleryItem[];
  };
  mission: {
    badge: string;
    title: string;
    description: string;
    stats: {
      stat1Value: string;
      stat1Label: string;
      stat2Value: string;
      stat2Label: string;
      stat3Value: string;
      stat3Label: string;
      stat4Value: string;
      stat4Label: string;
    };
  };
}

export interface ContactPageContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  info: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    operatingHours: string;
    googleMapsUrl: string;
  };
  noticeCard: {
    badge: string;
    title: string;
    description: string;
    walkinNotice: string;
  };
  storeShowcase: {
    title: string;
    subtitle: string;
    imageUrl: string;
    caption: string;
  };
}

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  hero: {
    badge: 'Dedicated Display Cleanroom',
    title: 'Flagship Display Repairs',
    subtitle: 'Specialized In-Lab Cleanroom Service & Fast Turnaround',
    searchPlaceholder: 'Search by phone model or tablet (e.g. iPhone 15 Pro, S24 Ultra)...',
    slides: [
      {
        title: 'Flagship Display Repairs',
        subtitle: 'Specialized In-Lab Cleanroom Service & Fast Turnaround',
        badge: 'Dedicated Display Cleanroom',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
      },
      {
        title: 'Green Screen & Lines Fix',
        subtitle: 'Laser Flex Micro-Bonding Station Saves Original AMOLED Panels',
        badge: 'Laser Flex Restoration',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      },
      {
        title: 'Touch Glass Replacement',
        subtitle: 'OCA Optical De-Bonding Retains Authentic 120Hz & TrueTone',
        badge: 'Optical OCA Lamination',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      },
      {
        title: 'Apple Watch & Tablets',
        subtitle: 'Sapphire Crystal & Liquid Retina Precision Refurbishment',
        badge: 'Wearables & Tablets Lab',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      },
    ],
    deviceCategories: [
      {
        id: 'mobile',
        name: 'Mobile',
        sub: 'iPhone, Galaxy, Pixel',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80',
      },
      {
        id: 'ipad',
        name: 'iPad',
        sub: 'Pro, Air, Mini',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80',
      },
      {
        id: 'apple-watch',
        name: 'Apple Watch',
        sub: 'Ultra 2 & Series',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80',
      },
      {
        id: 'tablets',
        name: 'Tablet',
        sub: 'Galaxy Tab & Surface',
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&q=80',
      },
      {
        id: 'samsung-fold',
        name: 'Foldables',
        sub: 'Z Fold, Flip, Open',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80',
      },
      {
        id: 'pixel-oneplus',
        name: 'OnePlus & Pixel',
        sub: 'ProXDR & Actua',
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&q=80',
      },
    ],
  },
  trustCards: {
    badge: 'Why Choose Us',
    title: 'One Trusted Place for All Your Flagship Display Repairs',
    subtitle: 'Advanced optical equipment, verified cleanroom technicians, and zero data risk.',
    cards: [
      {
        title: 'Display Specialists',
        desc: 'Exclusively dedicated to display restoration—we do not dilute focus on unrelated phone repairs.',
      },
      {
        title: 'Laser Flex Micro-Bonding',
        desc: 'Advanced laser stations fix vertical green/pink lines and blank screens without replacing the panel.',
      },
      {
        title: '100% Data Safety',
        desc: 'Your device data remains strictly untouched. No factory reset or PIN code required for screen repairs.',
      },
      {
        title: 'Certified Testing Warranty',
        desc: 'Every refurbished display is thoroughly tested for touch accuracy, TrueTone, and optical clarity.',
      },
    ],
  },
  aboutSection: {
    badge: 'Exclusive Display Craft',
    title: 'Pioneering Display Repair for High-End Flagship Devices',
    description:
      'At QASWA TELECOM, we believe that modern flagship devices demand laser focus. Rather than offering broad, multi-purpose mobile repairs, our laboratory specializes exclusively in display-related engineering for premium devices.',
    secondaryText:
      'Flagship screens—whether Apple Super Retina XDR OLEDs, Samsung Dynamic AMOLED 2X panels, or Ultra-Thin Glass foldables—are intricate optical systems. Replacing an entire assembly when only the outer glass is cracked or a flex trace is damaged wastes original panels. We preserve authentic factory displays through precision de-bonding, OCA lamination, and laser trace restoration.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=80',
    floatingBadgeTitle: 'Dedicated Display Cleanroom',
    floatingBadgeDesc: 'OCA vacuum laminators & laser flex micro-welding stations',
    pillar1Title: 'Original Panel Preservation',
    pillar1Desc: 'Retains 120Hz ProMotion, TrueTone, and factory color gamut.',
    pillar2Title: 'Laser Trace Micro-Bonding',
    pillar2Desc: 'Resolves green screen of death and vertical line defects directly.',
  },
  repairGallery: {
    badge: 'Visual Proof',
    title: 'Before & After Display Restorations',
    subtitle: 'Real flagship screens refurbished in our optical cleanroom.',
    images: [
      {
        beforeUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
        afterUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        title: 'iPhone 15 Pro Max',
        device: 'Apple Super Retina XDR',
        repairType: 'OCA Glass Refurbishing',
      },
      {
        beforeUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
        afterUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
        title: 'Galaxy S23 Ultra',
        device: 'Dynamic AMOLED 2X',
        repairType: 'Vertical Green Line Laser Fix',
      },
      {
        beforeUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
        afterUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
        title: 'Apple Watch Ultra',
        device: 'Sapphire Crystal OLED',
        repairType: 'Touch Digitizer & Glass Restoration',
      },
    ],
  },
  ctaBanner: {
    title: 'Experiencing Display Issues on Your Flagship Device?',
    subtitle: 'Speak directly with our senior technicians or book an express cleanroom slot.',
    buttonText: 'Book Display Repair',
    buttonUrl: '/mobile-repair',
  },
};

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  hero: {
    badge: 'EXCLUSIVE DISPLAY REPAIR SPECIALIST',
    title: 'About QASWA TELECOM',
    subtitle:
      'A dedicated repair laboratory focused exclusively on flagship smartphone, Apple Watch, iPad, and tablet display restoration. We believe that modern high-refresh-rate displays demand specialized optical engineering.',
  },
  story: {
    badge: 'Background & Foundation',
    title: 'Our Story',
    paragraph1:
      'Operating from our specialized service facility at Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092, QASWA TELECOM was established to solve a critical gap in the device servicing industry: the lack of dedicated, focused expertise for delicate modern display hardware.',
    paragraph2:
      'While conventional mobile repair shops attempt broad repairs across batteries, charging ports, speakers, and logic boards, our team recognized that advanced displays—such as Super Retina XDR OLEDs, Dynamic AMOLED 2X, and tandem OLEDs—require surgical cleanroom equipment, micro-laser bonding stations, and optical autoclaves.',
    paragraph3:
      'By maintaining a single, uninterrupted focus on display-related problems, we provide device owners with transparent diagnostics and specialized procedures designed to preserve original display panels whenever technically feasible.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  },
  specialization: {
    badge: 'Laser-Sharp Focus',
    title: 'Our Specialization',
    description:
      'We do not service batteries, charging ports, cameras, motherboards, or software. Our entire lab space, equipment investment, and technician training are dedicated exclusively to display-related issues:',
    items: [
      {
        title: 'Broken Display Repairs',
        desc: 'Restoration of physically cracked or broken AMOLED and Super Retina panels, retaining original display housing and authentic internal components.',
      },
      {
        title: 'Touch Glass Replacement',
        desc: 'Precision optical de-bonding using tungsten-molybdenum wire to separate broken outer glass without replacing the functional original OLED beneath.',
      },
      {
        title: 'Green Display Issues',
        desc: 'Targeted laser micro-bonding for sudden green tint, white screen blanking, or display synchronization failures on flexible AMOLED panels.',
      },
      {
        title: 'Display Lines (Vertical & Horizontal)',
        desc: 'Micro-welding flex cable conductive traces to eliminate colored lines without the expense of an entire replacement screen unit.',
      },
      {
        title: 'Touchscreen & Digitizer Problems',
        desc: 'Re-aligning capacitive digitizer grids, curing ghost touches, and restoring seamless touch response across flat and curved edge displays.',
      },
      {
        title: 'Other Display Malfunctions',
        desc: 'Troubleshooting low brightness, display flickering, TrueTone sensor transfer, and ambient light calibration on flagship hardware.',
      },
    ],
  },
  gallery: {
    badge: 'Cleanroom Facility',
    title: 'Inside Our Dedicated Cleanroom Facility',
    subtitle:
      'Dust-free laminar airflow hoods, pulse laser welding, and cryogenic curved glass separators.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
        title: 'Cleanroom Optical Lamination',
        caption: 'Dust-free autoclave chamber for optical clear adhesive (OCA) bonding.',
      },
      {
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        title: 'Laser Flex Micro-Bonding',
        caption: 'Infrared laser welding station for repairing severed flexible display traces.',
      },
      {
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
        title: 'Curved Glass Separator',
        caption: 'Ultra-thin molybdenum wire separation preserving genuine OLED substrates.',
      },
      {
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
        title: 'Apple Watch Sapphire Lab',
        caption: 'Precision micro-jigs designed specifically for smartwatch curved glass.',
      },
    ],
  },
  mission: {
    badge: 'Quality Standards',
    title: 'Our Mission & Quality Guarantee',
    description:
      'We are committed to delivering optical perfection and customer transparency. If your display cannot be saved through glass-only refurbishing or laser bonding, we communicate clearly before performing any procedure.',
    stats: {
      stat1Value: '45,000+',
      stat1Label: 'Displays Refurbished',
      stat2Value: '100%',
      stat2Label: 'Touch & TrueTone Retained',
      stat3Value: '99.4%',
      stat3Label: 'Cleanroom Success Rate',
      stat4Value: 'Up to 6M',
      stat4Label: 'Warranty Coverage',
    },
  },
};

export const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  hero: {
    badge: 'SPECIALIZED DISPLAY REPAIR LAB',
    title: 'Get in Touch With Us',
    subtitle:
      'QASWA TELECOM specializes exclusively in display diagnostics and optical restoration for high-end flagship smartphones, Apple Watch, iPad, and premium tablets. Submit your device details below or contact our technician desk directly.',
  },
  info: {
    phone: '+91 9324316048',
    whatsapp: '9324316048',
    email: 'telecomqaswa@gmail.com',
    address: 'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
    operatingHours: 'Everyday: 11:00 AM – 9:00 PM',
    googleMapsUrl: 'https://share.google/JdvLGimvQe18jUJNp',
  },
  noticeCard: {
    badge: 'SERVICE SPECIALIZATION NOTICE',
    title: 'Exclusive Display Repairs Only',
    description:
      'Please note: QASWA TELECOM specializes exclusively in display-related services (screen damage, cracked touch glass, green screen/line issues, and digitizers). We do not service batteries, charging ports, speakers, cameras, or motherboard components.',
    walkinNotice:
      'Walk-in customers are welcome during operating hours for instant microscopic inspection and transparent quotes.',
  },
  storeShowcase: {
    title: 'Central Display Laboratory & Walk-in Desk',
    subtitle: 'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    caption:
      'Class 100 cleanroom laminar flow hoods and optical autoclaves located in-house.',
  },
};

/**
 * React hook to retrieve page content dynamically
 * 1. Checks settings from AppContext (loaded via bootstrap)
 * 2. Fetches from /api/public/page-content if needed
 * 3. Deeply merges with default content as reliable fallback
 */
export function usePageContent<T>(page: 'home' | 'about' | 'contact'): {
  content: T;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const { settings } = useApp();
  const settingKey = `PAGE_CONTENT_${page.toUpperCase()}`;

  const defaultContent = useMemo(() => {
    if (page === 'home') return DEFAULT_HOME_CONTENT as unknown as T;
    if (page === 'about') return DEFAULT_ABOUT_CONTENT as unknown as T;
    return DEFAULT_CONTACT_CONTENT as unknown as T;
  }, [page]);

  const [fetchedContent, setFetchedContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedFromSettings = useMemo(() => {
    if (settings[settingKey]) {
      try {
        const parsed = JSON.parse(settings[settingKey] as string);
        return { ...defaultContent, ...parsed } as T;
      } catch (e) {
        console.error(`Failed to parse ${settingKey} from settings:`, e);
      }
    }
    return null;
  }, [settings, settingKey, defaultContent]);

  const fetchLiveContent = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/public/page-content?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setFetchedContent({ ...defaultContent, ...data });
      }
    } catch (e) {
      console.warn(`Could not fetch live content for ${page}:`, e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!parsedFromSettings) {
      fetchLiveContent();
    }
  }, [page, parsedFromSettings]);

  const finalContent = parsedFromSettings || fetchedContent || defaultContent;

  return {
    content: finalContent,
    loading,
    refresh: fetchLiveContent,
  };
}
