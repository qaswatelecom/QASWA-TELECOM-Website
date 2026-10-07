import { useEffect } from 'react';
import { PageSeoConfig } from '../types/index.ts';

export interface LocalBusinessSchemaParams {
  name: string;
  telephone?: string;
  email?: string;
  address?: string;
  city?: string;
  url?: string;
  image?: string;
  description?: string;
}

export interface ServiceSchemaParams {
  name: string;
  description?: string;
  serviceType?: string;
  providerName?: string;
  providerUrl?: string;
  url?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Injects or updates a JSON-LD schema script inside document <head>.
 */
export function injectJsonLd(id: string, schema: Record<string, any>): void {
  if (typeof document === 'undefined') return;

  const scriptId = `json-ld-${id}`;
  let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Removes a JSON-LD schema script by ID from document <head>.
 */
export function removeJsonLd(id: string): void {
  if (typeof document === 'undefined') return;
  const scriptId = `json-ld-${id}`;
  const scriptElement = document.getElementById(scriptId);
  if (scriptElement && scriptElement.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement);
  }
}

/**
 * Hook to inject JSON-LD schema on mount/update and cleanup on unmount
 */
export function useJsonLd(id: string, schema: Record<string, any> | null): void {
  useEffect(() => {
    if (schema) {
      injectJsonLd(id, schema);
    } else {
      removeJsonLd(id);
    }

    return () => {
      removeJsonLd(id);
    };
  }, [id, schema]);
}

/**
 * Generates Schema.org LocalBusiness structured data
 */
export function generateLocalBusinessSchema(params: LocalBusinessSchemaParams): Record<string, any> {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ElectronicsRepairShop'],
    '@id': `${params.url || currentOrigin}/#localbusiness`,
    name: params.name || 'QASWA TELECOM',
    description:
      params.description ||
      'Display repair specialists for flagship smartphones, iPads, Apple Watches, and tablets in Borivali West, Mumbai. Specialized cleanroom optical lamination and laser bonding.',
    telephone: params.telephone || '+91 9324316048',
    email: params.email || 'telecomqaswa@gmail.com',
    url: params.url || currentOrigin,
    image: params.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    logo: `${currentOrigin}/qaswa-logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        params.address ||
        'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West',
      addressLocality: params.city || 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400092',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.2288,
      longitude: 72.8541,
    },
    hasMap: 'https://share.google/JdvLGimvQe18jUJNp',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:00',
        closes: '21:00',
      },
    ],
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Borivali West, Mumbai',
      },
      {
        '@type': 'City',
        name: 'Mumbai',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Flagship Display Repair Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Display Damaged (Broken / Cracked Screen)',
            description: 'Original display assembly restoration for cracked and broken smartphone screens in Borivali West, Mumbai.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Touch Glass Broken (Touch Glass Replacement)',
            description: 'Preserve original factory OLED panel with precision cleanroom optical OCA lamination.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Green & Pink Vertical Lines Laser Repair',
            description: 'Advanced laser flex bonding to eliminate vertical green and pink lines on OLED displays.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Green Screen & White Screen Recovery',
            description: 'Panel controller and flex bonding restoration for blank, white, or green screen malfunctions.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Touch Digitizer Not Responding & Ghost Touch Fix',
            description: 'Touch layer digitizer restoration and calibration for responsive touch interaction.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Display Flickering & Tint Malfunction Fix',
            description: 'Restore stable display illumination and eliminate flickering, color tint, or brightness fluctuation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Foldable Phone Hinge & Flex Cable Display Issue',
            description: 'Ultra-thin glass (UTG) alignment and internal flex cable bonding for foldable smartphones.',
          },
        },
      ],
    },
  };
}

/**
 * Generates Schema.org Service structured data
 */
export function generateServiceSchema(params: ServiceSchemaParams): Record<string, any> {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: params.serviceType || 'Display Repair Service',
    name: params.name,
    description: params.description || `Specialized ${params.name} service for flagship devices at QASWA TELECOM in Borivali West, Mumbai.`,
    url: params.url || (typeof window !== 'undefined' ? window.location.href : currentOrigin),
    provider: {
      '@type': ['LocalBusiness', 'ElectronicsRepairShop'],
      name: params.providerName || 'QASWA TELECOM',
      url: params.providerUrl || currentOrigin,
      telephone: '+91 9324316048',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400092',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Mumbai',
    },
  };
}

/**
 * Generates Schema.org FAQPage structured data
 */
export function generateFaqSchema(faqs: FaqItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org Brand structured data
 */
export function generateBrandSchema(params: { name: string; description?: string; url?: string }): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: params.name,
    description: params.description,
    url: params.url,
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates Schema.org JSON templates based on schema type
 */
export function getSchemaTemplate(
  type: string,
  pageData?: { path?: string; title?: string; description?: string; siteName?: string }
): string {
  const siteName = pageData?.siteName || 'QASWA TELECOM';
  const path = pageData?.path || '/';
  const title = pageData?.title || `${siteName} | Display Repair Specialists in Borivali West, Mumbai`;
  const desc =
    pageData?.description ||
    'Display repair specialists for flagship smartphones, iPads, Apple Watches, and tablets in Borivali West, Mumbai.';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
  const url = `${origin}${path}`;

  switch (type) {
    case 'LocalBusiness':
      return JSON.stringify(
        generateLocalBusinessSchema({
          name: siteName,
          description: desc,
          url,
        }),
        null,
        2
      );

    case 'Service':
      return JSON.stringify(
        generateServiceSchema({
          name: title,
          description: desc,
          url,
          providerName: siteName,
          providerUrl: origin,
        }),
        null,
        2
      );

    case 'FAQPage':
      return JSON.stringify(
        generateFaqSchema([
          {
            question: 'Can you fix green and white vertical lines without replacing the entire screen?',
            answer:
              'Yes! Using advanced cleanroom pulse laser bonding, we can restore disconnected ITO traces in OLED panels without replacing the original screen assembly.',
          },
          {
            question: 'What is the difference between cracked glass and a damaged display?',
            answer:
              'If the outer glass is broken but the AMOLED/Retina picture is completely clear and touch functions normally, only the outer glass needs replacement. If there are lines, black spots, flickering, or no picture, the display panel requires repair.',
          },
          {
            question: 'Where is QASWA TELECOM located in Mumbai?',
            answer:
              'QASWA TELECOM is located at Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092. Open everyday from 11:00 AM to 9:00 PM.',
          },
        ]),
        null,
        2
      );

    case 'BreadcrumbList':
      return JSON.stringify(
        generateBreadcrumbSchema([
          { name: 'Home', url: origin },
          { name: title, url },
        ]),
        null,
        2
      );

    case 'Article':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: desc,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
          author: {
            '@type': 'Organization',
            name: siteName,
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${origin}/qaswa-logo.svg`,
            },
          },
        },
        null,
        2
      );

    default:
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: desc,
          url,
        },
        null,
        2
      );
  }
}

/**
 * Baseline default SEO map for all pages across the website
 */
export const DEFAULT_PAGE_SEO_MAP: Record<string, PageSeoConfig> = {
  '/': {
    path: '/',
    pageName: 'Home',
    category: 'Core',
    title: 'QASWA TELECOM | Display Repair Specialists in Borivali West, Mumbai',
    description:
      'Specialized display repair in Borivali West, Mumbai for Apple iPhone, Samsung Galaxy, Google Pixel, OnePlus, iPad, Apple Watch & tablets. Precision OCA lamination & laser bonding.',
    keywords:
      'display repair, mobile display repair, smartphone display repair, iPhone display repair, Samsung display repair, display repair specialist, display repair in Mumbai, display repair in Borivali West',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    author: 'QASWA TELECOM Tech Team',
    schemaType: 'LocalBusiness',
    schemaJson: getSchemaTemplate('LocalBusiness', {
      path: '/',
      title: 'QASWA TELECOM | Display Repair Specialists in Borivali West, Mumbai',
    }),
  },
  '/categories/mobile': {
    path: '/categories/mobile',
    pageName: 'Mobile Display Repair',
    category: 'Core',
    title: 'Smartphone Display Repair in Mumbai | QASWA TELECOM Borivali West',
    description:
      'Specialized mobile display repair in Borivali West, Mumbai. Original OLED panel restoration, cracked touch glass replacement, and green line laser bonding for flagship phones.',
    keywords:
      'mobile display repair, smartphone display repair in Mumbai, OLED screen repair, cracked touch glass fix Borivali, iPhone screen repair Mumbai',
    ogImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/categories/mobile',
      title: 'Smartphone Display Repair in Mumbai',
    }),
  },
  '/categories/ipad': {
    path: '/categories/ipad',
    pageName: 'iPad Display Repair',
    category: 'Core',
    title: 'iPad Display Repair in Mumbai | Ultra Retina & Liquid Retina | QASWA TELECOM',
    description:
      'Specialized iPad display repair in Borivali West, Mumbai. Tandem OLED & Liquid Retina XDR screen restoration, touch digitizer glass replacement, and Apple Pencil sensitivity preservation.',
    keywords:
      'iPad display repair, iPad screen replacement Mumbai, iPad Pro screen repair Borivali, Liquid Retina display repair, iPad mini touch glass',
    ogImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/categories/ipad',
      title: 'iPad Display Repair in Mumbai',
    }),
  },
  '/categories/apple-watch': {
    path: '/categories/apple-watch',
    pageName: 'Apple Watch Display Repair',
    category: 'Core',
    title: 'Apple Watch Display Repair in Mumbai | Sapphire Crystal & OLED | QASWA TELECOM',
    description:
      'Precision Apple Watch display repair in Borivali West, Mumbai. Sapphire crystal touch glass refurbishing, OLED screen replacement, and Force Touch sensor calibration for Ultra, Series & SE.',
    keywords:
      'Apple Watch display repair, Apple Watch screen repair Mumbai, Apple Watch Ultra glass replacement, Apple Watch Series OLED fix Borivali',
    ogImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/categories/apple-watch',
      title: 'Apple Watch Display Repair in Mumbai',
    }),
  },
  '/categories/tablet': {
    path: '/categories/tablet',
    pageName: 'Tablet Display Repair',
    category: 'Core',
    title: 'Tablet Display Repair in Mumbai | Flagship AMOLED & Glass | QASWA TELECOM',
    description:
      'Specialized large-screen display repairs for Samsung Galaxy Tab, OnePlus Pad, Xiaomi Pad, and Lenovo Tab AMOLED panels in Borivali West, Mumbai.',
    keywords:
      'tablet display repair, tablet screen replacement Mumbai, Samsung Galaxy Tab screen repair, Android tablet display glass Borivali',
    ogImage: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/categories/tablet',
      title: 'Tablet Display Repair in Mumbai',
    }),
  },
  '/brands': {
    path: '/brands',
    pageName: 'Brands We Repair',
    category: 'Brands',
    title: 'Mobile Brands We Repair | Display Repair Specialists in Mumbai | QASWA TELECOM',
    description:
      'Explore supported smartphone brands for precision display repair in Mumbai: Apple iPhone, Samsung Galaxy, OnePlus, Google Pixel, Vivo, Oppo, Xiaomi, and more.',
    keywords:
      'iPhone display repair Mumbai, Samsung screen repair, OnePlus display repair, Pixel screen replacement, Vivo display repair Borivali',
    ogImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/brands',
      title: 'Mobile Brands We Repair | Display Repair Specialists',
    }),
  },
  '/services': {
    path: '/services',
    pageName: 'Display Repair Services',
    category: 'Services',
    title: 'Display Repair Services in Borivali West, Mumbai | QASWA TELECOM',
    description:
      'Explore display repair services: Outer Touch Glass Refurbishing, Green & Pink Line Laser Repair, Touch Digitizer Restoration, and OLED Panel Replacement in Mumbai.',
    keywords:
      'display repair services Mumbai, touch glass replacement, green line laser repair, AMOLED screen replacement Borivali West',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/services',
      title: 'Display Repair Services in Borivali West, Mumbai',
    }),
  },
  '/services/line-issue': {
    path: '/services/line-issue',
    pageName: 'Green & Pink Line Laser Repair',
    category: 'Services',
    title: 'Green & Pink Line Display Laser Repair in Mumbai | QASWA TELECOM',
    description:
      'Micro-laser flex bonding to repair vertical green, pink, or white lines on Samsung, OnePlus, and iPhone OLED screens without replacing the original display panel in Mumbai.',
    keywords:
      'green line screen repair, pink line display fix, laser bonding mobile display Mumbai, AMOLED line issue repair Borivali',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/services/line-issue',
      title: 'Green & Pink Line Display Laser Repair in Mumbai',
    }),
  },
  '/services/glass-replacement': {
    path: '/services/glass-replacement',
    pageName: 'Outer Touch Glass Replacement',
    category: 'Services',
    title: 'Outer Touch Glass Replacement & OCA Lamination | QASWA TELECOM Mumbai',
    description:
      'Cracked glass but touch and OLED display still working? Keep your original factory panel with precision cleanroom OCA glass replacement in Borivali West, Mumbai.',
    keywords:
      'touch glass replacement Mumbai, OCA lamination screen, cracked glass repair Borivali, original OLED glass replacement',
    ogImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/services/glass-replacement',
      title: 'Outer Touch Glass Replacement & OCA Lamination',
    }),
  },
  '/about': {
    path: '/about',
    pageName: 'About Us',
    category: 'Legal',
    title: 'About QASWA TELECOM | Display Repair Specialists in Borivali West, Mumbai',
    description:
      'Learn about QASWA TELECOM, leading display repair specialists in Borivali West, Mumbai. Dedicated cleanroom technology for flagship smartphones, iPads, Apple Watches & tablets.',
    keywords:
      'about Qaswa Telecom, display repair specialists Mumbai, mobile screen repair Borivali West, flagship phone display lab',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Organization',
    schemaJson: getSchemaTemplate('Organization', {
      path: '/about',
      title: 'About QASWA TELECOM | Display Repair Specialists in Borivali West, Mumbai',
    }),
  },
  '/contact': {
    path: '/contact',
    pageName: 'Contact Us',
    category: 'Legal',
    title: 'Contact QASWA TELECOM | Display Repair Center in Borivali West, Mumbai',
    description:
      'Visit QASWA TELECOM at Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai 400092. Open everyday 11:00 AM – 9:00 PM for display repair enquiries.',
    keywords:
      'contact Qaswa Telecom, display repair shop Borivali West, mobile screen repair address Mumbai, Thakkar shopping centre phone repair',
    ogImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'LocalBusiness',
    schemaJson: getSchemaTemplate('LocalBusiness', {
      path: '/contact',
      title: 'Contact QASWA TELECOM | Display Repair Center in Borivali West, Mumbai',
    }),
  },
  '/faqs': {
    path: '/faqs',
    pageName: 'FAQs',
    category: 'Legal',
    title: 'Display Repair FAQs | QASWA TELECOM Borivali West, Mumbai',
    description:
      'Frequently asked questions about smartphone, iPad, Apple Watch, and tablet display repair, cracked touch glass replacement, green line fixes, and OLED restoration in Mumbai.',
    keywords:
      'display repair FAQ, screen replacement questions Mumbai, green line fix FAQ, OLED vs touch glass repair',
    ogImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary',
    schemaType: 'FAQPage',
    schemaJson: getSchemaTemplate('FAQPage', {
      path: '/faqs',
      title: 'Display Repair FAQs | QASWA TELECOM Borivali West, Mumbai',
    }),
  },
  '/gallery': {
    path: '/gallery',
    pageName: 'Repair Gallery',
    category: 'Content',
    title: 'Cleanroom Repair Gallery | QASWA TELECOM Borivali West, Mumbai',
    description:
      'View high-precision cleanroom optical lamination, laser bonding, and display repair work at QASWA TELECOM in Borivali West, Mumbai.',
    keywords:
      'display repair gallery, screen repair photos Mumbai, laser bonding cleanroom, mobile repair laboratory Borivali',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/gallery',
      title: 'Cleanroom Repair Gallery | QASWA TELECOM Borivali West, Mumbai',
    }),
  },
  '/testimonials': {
    path: '/testimonials',
    pageName: 'Customer Reviews',
    category: 'Content',
    title: 'Customer Reviews & Display Repair Testimonials | QASWA TELECOM Mumbai',
    description:
      'Read verified customer feedback and display repair experiences for iPhone, Galaxy Ultra, and foldable screens repaired at QASWA TELECOM in Borivali West, Mumbai.',
    keywords:
      'Qaswa Telecom customer reviews, display repair feedback Mumbai, screen replacement reviews Borivali West',
    ogImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/testimonials',
      title: 'Customer Reviews & Display Repair Testimonials',
    }),
  },
  '/blogs': {
    path: '/blogs',
    pageName: 'Blogs & Articles',
    category: 'Content',
    title: 'Display Repair Articles & Technical Guides | QASWA TELECOM Mumbai',
    description:
      'Expert technical guides on OLED display repairs, vertical line issues, touchscreen digitizer troubleshooting, and front glass refurbishing in Mumbai.',
    keywords:
      'display repair blog, OLED green line guide, touch glass replacement article, smartphone display troubleshooting',
    ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/blogs',
      title: 'Display Repair Articles & Technical Guides',
    }),
  },
  '/terms': {
    path: '/terms',
    pageName: 'Terms & Conditions',
    category: 'Legal',
    title: 'Terms & Conditions | QASWA TELECOM Mumbai',
    description:
      'Terms of service, customer intake guidelines, and diagnostic policies for display repair services at QASWA TELECOM in Borivali West, Mumbai.',
    keywords: 'repair terms, service policies, customer intake conditions, Qaswa Telecom Mumbai',
    ogImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/terms',
      title: 'Terms & Conditions | QASWA TELECOM Mumbai',
    }),
  },
};

/**
 * Resolves dynamic fallback SEO metadata for parameterized routes like /models/:slug or /categories/:cat/:brand
 */
export function resolveDynamicSeo(
  path: string,
  siteName: string = 'QASWA TELECOM'
): Partial<PageSeoConfig> | null {
  const cleanPath = path.replace(/\/$/, '') || '/';

  // 1. Direct match in static map
  if (DEFAULT_PAGE_SEO_MAP[cleanPath]) {
    return DEFAULT_PAGE_SEO_MAP[cleanPath];
  }

  // 2. Admin routes: Strictly noindex, nofollow
  if (cleanPath.startsWith('/admin')) {
    return {
      path: cleanPath,
      pageName: 'Admin',
      category: 'Admin',
      title: `Admin Portal | ${siteName}`,
      description: 'Administrative access area for QASWA TELECOM management.',
      robots: 'noindex, nofollow',
      canonicalUrl: '',
    };
  }

  // 3. Category alias /mobile, /repair-brands, /ipad, /repair/ipad, /apple-watch, /repair/apple-watch, /tablet, /repair/tablet
  if (cleanPath === '/mobile' || cleanPath === '/repair-brands') return DEFAULT_PAGE_SEO_MAP['/categories/mobile'];
  if (cleanPath === '/ipad' || cleanPath === '/repair/ipad') return DEFAULT_PAGE_SEO_MAP['/categories/ipad'];
  if (cleanPath === '/apple-watch' || cleanPath === '/repair/apple-watch') return DEFAULT_PAGE_SEO_MAP['/categories/apple-watch'];
  if (cleanPath === '/tablet' || cleanPath === '/repair/tablet') return DEFAULT_PAGE_SEO_MAP['/categories/tablet'];

  // 4. Model route: /repair/:slug or /models/:slug
  if (cleanPath.startsWith('/repair/') || cleanPath.startsWith('/models/')) {
    const slug = cleanPath.startsWith('/repair/')
      ? cleanPath.replace('/repair/', '')
      : cleanPath.replace('/models/', '');
    const modelName = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/Iphone/g, 'iPhone')
      .replace(/Ipad/g, 'iPad')
      .replace(/Pro Max/g, 'Pro Max')
      .replace(/5g/gi, '5G');

    return {
      path: cleanPath,
      pageName: `${modelName} Display Repair`,
      category: 'Models',
      title: `${modelName} Display Repair in Mumbai | ${siteName}`,
      description: `Specialized display repair solutions for ${modelName} in Borivali West, Mumbai. Screen replacement, cracked touch glass refurbishing, and OLED panel restoration.`,
      keywords: `${modelName} display repair, ${modelName} screen repair Mumbai, ${modelName} glass replacement, ${modelName} green line fix Borivali`,
      ogType: 'website',
      robots: 'index, follow',
      schemaType: 'Service',
      schemaJson: getSchemaTemplate('Service', {
        path: cleanPath,
        title: `${modelName} Display Repair in Mumbai`,
        description: `Dedicated display repair services for ${modelName} in Borivali West, Mumbai.`,
        siteName,
      }),
    };
  }

  // 5. Category Brand route: /repair-models/:cat/:brand or /categories/mobile/:brandSlug
  if (cleanPath.startsWith('/repair-models/') || cleanPath.startsWith('/categories/')) {
    const prefix = cleanPath.startsWith('/repair-models/') ? '/repair-models/' : '/categories/';
    const parts = cleanPath.replace(prefix, '').split('/');
    if (parts.length >= 2) {
      const catSlug = parts[0];
      const secondPart = parts[1];

      // iPad or Apple Watch direct model
      if (catSlug === 'ipad' || catSlug === 'apple-watch') {
        const itemTitle = secondPart
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
          .replace(/Ipad/g, 'iPad');

        return {
          path: cleanPath,
          pageName: itemTitle,
          category: 'Models',
          title: `${itemTitle} Display Repair in Mumbai | ${siteName}`,
          description: `Specialized display repair for ${itemTitle} in Borivali West, Mumbai. Screen replacement, touch glass refurbishing, and optical lamination.`,
          robots: 'index, follow',
          schemaType: 'Service',
        };
      }

      // Brand route (e.g. /repair-models/mobile/apple-iphone or /categories/mobile/apple)
      let brandName = secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
      if (secondPart === 'apple-iphone' || secondPart === 'apple' || secondPart === 'iphone') {
        brandName = 'Apple iPhone';
      } else if (secondPart === 'google-pixel') {
        brandName = 'Google Pixel';
      } else if (secondPart.includes('-')) {
        brandName = secondPart
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      }
      const catName = catSlug === 'tablet' ? 'Tablet' : 'Mobile';
      return {
        path: cleanPath,
        pageName: `${brandName} Display Repair`,
        category: 'Brands',
        title: `${brandName} ${catName} Display Repair in Mumbai | ${siteName}`,
        description: `Specialized display repair for ${brandName} ${catName.toLowerCase()} devices in Borivali West, Mumbai. Original OLED panel restoration, cracked touch glass replacement, and green line fix.`,
        keywords: `${brandName} display repair Mumbai, ${brandName} screen replacement, ${brandName} touch glass repair Borivali West`,
        robots: 'index, follow',
        schemaType: 'Service',
      };
    }
  }

  // 6. Brand alias route: /brands/:brandSlug
  if (cleanPath.startsWith('/brands/')) {
    const slug = cleanPath.replace('/brands/', '');
    const brandName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
      path: cleanPath,
      pageName: `${brandName} Display Repair`,
      category: 'Brands',
      title: `${brandName} Mobile Display Repair in Mumbai | ${siteName}`,
      description: `Specialized display repair for ${brandName} smartphones in Borivali West, Mumbai. Original OLED panel restoration, cracked touch glass replacement, and green line fix.`,
      robots: 'index, follow',
      schemaType: 'Service',
    };
  }

  // 7. Service route: /services/:serviceSlug
  if (cleanPath.startsWith('/services/')) {
    const slug = cleanPath.replace('/services/', '');
    const serviceName = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      path: cleanPath,
      pageName: serviceName,
      category: 'Services',
      title: `${serviceName} in Mumbai | ${siteName}`,
      description: `Specialized ${serviceName} in Borivali West, Mumbai. Original display restoration, cleanroom OCA bonding, and precision diagnosis at ${siteName}.`,
      robots: 'index, follow',
      schemaType: 'Service',
    };
  }

  // 8. Blog route: /blogs/:slug
  if (cleanPath.startsWith('/blogs/')) {
    const slug = cleanPath.replace('/blogs/', '');
    const blogTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      path: cleanPath,
      pageName: blogTitle,
      category: 'Blogs',
      title: `${blogTitle} | ${siteName} Mumbai`,
      description: `Read technical insights and guides on ${blogTitle} by the display engineering specialists at ${siteName} in Mumbai.`,
      robots: 'index, follow',
      schemaType: 'Article',
    };
  }

  return null;
}

/**
 * Applies dynamic SEO metadata to document head
 */
export function applyDynamicSeo(
  seo: Partial<PageSeoConfig>,
  siteName: string = 'QASWA TELECOM'
): void {
  if (typeof document === 'undefined') return;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';

  // 1. Title
  if (seo.title) {
    const fullTitle = seo.title.includes(siteName) ? seo.title : `${seo.title} | ${siteName}`;
    document.title = fullTitle;

    setMetaProperty('og:title', fullTitle);
    setMetaName('twitter:title', fullTitle);
  }

  // 2. Description
  if (seo.description) {
    setMetaName('description', seo.description);
    setMetaProperty('og:description', seo.description);
    setMetaName('twitter:description', seo.description);
  }

  // 3. Keywords
  if (seo.keywords) {
    setMetaName('keywords', seo.keywords);
  }

  // 4. Robots
  if (seo.robots) {
    setMetaName('robots', seo.robots);
  }

  // 5. Author
  if (seo.author) {
    setMetaName('author', seo.author);
  }

  // 6. Canonical URL
  const canonicalUrl =
    seo.canonicalUrl || (typeof window !== 'undefined' ? `${origin}${window.location.pathname}` : '');
  if (canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
    setMetaProperty('og:url', canonicalUrl);
  }

  // 7. OG Image & Twitter Image
  if (seo.ogImage) {
    setMetaProperty('og:image', seo.ogImage);
    setMetaName('twitter:image', seo.ogImage);
  }

  // 8. OpenGraph Type & Site Name
  if (seo.ogType) {
    setMetaProperty('og:type', seo.ogType);
  }
  setMetaProperty('og:site_name', siteName);

  // 9. Twitter Card
  setMetaName('twitter:card', seo.twitterCard || 'summary_large_image');

  // 10. Injects Structured Data (JSON-LD)
  if (seo.schemaJson) {
    try {
      const parsed = typeof seo.schemaJson === 'string' ? JSON.parse(seo.schemaJson) : seo.schemaJson;
      injectJsonLd('page-dynamic-schema', parsed);
    } catch (e) {
      console.warn('Invalid schema JSON in dynamic SEO config:', e);
    }
  } else {
    removeJsonLd('page-dynamic-schema');
  }
}

function setMetaName(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property: string, content: string): void {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Initializes Google Analytics 4 (if configured) and Google Search Console verification
 */
export function initAnalyticsAndVerification(
  siteSettingsMap?: Record<string, string | undefined>
): void {
  if (typeof document === 'undefined') return;

  // 1. Google Search Console Verification Meta Tag
  const gscCode =
    siteSettingsMap?.GSC_VERIFICATION ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GSC_VERIFICATION);

  if (gscCode && typeof gscCode === 'string' && gscCode.trim()) {
    setMetaName('google-site-verification', gscCode.trim());
  }

  // 2. Google Analytics 4 Measurement Tag (Only loaded if configured)
  const gaId =
    siteSettingsMap?.GA_MEASUREMENT_ID ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GA_MEASUREMENT_ID);

  if (gaId && typeof gaId === 'string' && gaId.trim().startsWith('G-')) {
    const cleanId = gaId.trim();
    const scriptId = 'ga4-gtag-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = 'ga4-inline-init';
      inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${cleanId}', { send_page_view: true });
      `;
      document.head.appendChild(inlineScript);
    }
  }
}

/**
 * Hook to set page title and meta description for SEO
 */
export function usePageSeo(title: string, description?: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const fullTitle = title.includes('QASWA TELECOM') ? title : `${title} | QASWA TELECOM`;
    document.title = fullTitle;

    if (description) {
      setMetaName('description', description);
      setMetaProperty('og:description', description);
      setMetaName('twitter:description', description);
    }

    setMetaProperty('og:title', fullTitle);
    setMetaName('twitter:title', fullTitle);

    const origin = window.location.origin;
    const currentUrl = `${origin}${window.location.pathname}`;
    setMetaProperty('og:url', currentUrl);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', currentUrl);
  }, [title, description]);
}

/**
 * Hook for pages to automatically consume dynamic page SEO from settings and routes
 */
export function useDynamicPageSeo(
  path?: string,
  customOverride?: Partial<PageSeoConfig>,
  siteSettingsMap?: Record<string, string | undefined>
): void {
  useEffect(() => {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');

    // Run Analytics and Search Console check
    initAnalyticsAndVerification(siteSettingsMap);

    // Try to load any custom configs stored in settings
    let savedConfigs: Record<string, PageSeoConfig> = {};
    if (siteSettingsMap?.SEO_CONFIG_PAGES) {
      try {
        savedConfigs = JSON.parse(siteSettingsMap.SEO_CONFIG_PAGES);
      } catch (e) {
        // ignore
      }
    }

    // Lookup matching config from saved, static map, dynamic resolver, or fallback
    const saved = savedConfigs[currentPath];
    const staticBaseline = DEFAULT_PAGE_SEO_MAP[currentPath];
    const resolvedDynamic = resolveDynamicSeo(currentPath, siteSettingsMap?.SITE_NAME || 'QASWA TELECOM');
    const fallbackBaseline = DEFAULT_PAGE_SEO_MAP['/'];

    const finalConfig: Partial<PageSeoConfig> = {
      ...fallbackBaseline,
      ...resolvedDynamic,
      ...staticBaseline,
      ...saved,
      ...customOverride,
      path: currentPath,
    };

    applyDynamicSeo(finalConfig, siteSettingsMap?.SITE_NAME || 'QASWA TELECOM');

    return () => {
      removeJsonLd('page-dynamic-schema');
    };
  }, [path, customOverride, siteSettingsMap]);
}
