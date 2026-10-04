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
    '@type': 'LocalBusiness',
    '@id': `${params.url || currentOrigin}/#localbusiness`,
    name: params.name || 'QASWA TELECOM',
    description:
      params.description ||
      'Display repair specialists for flagship devices: Apple iPhone, Samsung Galaxy, Google Pixel, OnePlus, Apple Watch, iPad, and premium tablets. Specialized cleanroom optical lamination and laser bonding.',
    telephone: params.telephone || '+91 9324316048',
    email: params.email || 'telecomqaswa@gmail.com',
    url: params.url || currentOrigin,
    image: params.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        params.address ||
        'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
      addressLocality: params.city || 'Mumbai',
      postalCode: '400092',
      addressCountry: 'IN',
    },
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
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${params.url || currentOrigin}/#contact-section`,
        inLanguage: 'en',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'Reservation',
        name: 'Display Repair Diagnosis Appointment',
      },
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
    description: params.description || `Specialized ${params.name} service for flagship devices at QASWA TELECOM.`,
    url: params.url || (typeof window !== 'undefined' ? window.location.href : currentOrigin),
    provider: {
      '@type': 'LocalBusiness',
      name: params.providerName || 'QASWA TELECOM',
      url: params.providerUrl || currentOrigin,
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

export interface BreadcrumbItem {
  name: string;
  url: string;
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
  const title = pageData?.title || `${siteName} | Flagship Display Repair`;
  const desc = pageData?.description || 'Display repair specialists for flagship devices.';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qaswatelecom.com';
  const url = `${origin}${path}`;

  switch (type) {
    case 'LocalBusiness':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: siteName,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
          '@id': `${origin}/#localbusiness`,
          url: origin,
          telephone: '+91 9324316048',
          priceRange: '₹₹',
          address: {
            '@type': 'PostalAddress',
            streetAddress:
              'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
            addressLocality: 'Mumbai',
            addressRegion: 'MH',
            postalCode: '400092',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 19.2288,
            longitude: 72.8541,
          },
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
        },
        null,
        2
      );

    case 'Service':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Display Repair & Screen Replacement',
          name: title,
          description: desc,
          url,
          provider: {
            '@type': 'LocalBusiness',
            name: siteName,
            url: origin,
            telephone: '+91 9324316048',
          },
          areaServed: {
            '@type': 'Country',
            name: 'India',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Display Repair Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Laser Screen Line Repair',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Glass Only OCA Replacement',
                },
              },
            ],
          },
        },
        null,
        2
      );

    case 'FAQPage':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Can you fix green and white vertical lines without replacing the entire screen?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! Using our advanced cleanroom pulse laser bonding machine, we can repair disconnected ITO traces in OLED panels without costly full screen replacement.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do you offer a warranty on display repairs?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'All display repairs and touch glass refurbishing at QASWA TELECOM include up to a 6-month certified testing warranty covering optical clarity and touch digitizer function.',
              },
            },
          ],
        },
        null,
        2
      );

    case 'WebPage':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: desc,
          url,
          isPartOf: {
            '@type': 'WebSite',
            name: siteName,
            url: origin,
          },
        },
        null,
        2
      );

    case 'Organization':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: origin,
          logo: `${origin}/qaswa-logo.svg`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91 9324316048',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
          sameAs: [
            'https://instagram.com/qaswatelecom',
            'https://facebook.com/qaswatelecom',
            'https://youtube.com/@qaswatelecom',
          ],
        },
        null,
        2
      );

    case 'BreadcrumbList':
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: origin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: url,
            },
          ],
        },
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
    title: 'QASWA TELECOM | Flagship Display Repair Specialists & Laser Bonding',
    description:
      'Certified display repair specialists for Apple iPhone, Samsung Galaxy S/Z Fold, Google Pixel, OnePlus, Apple Watch & iPad. Cleanroom optical lamination and laser flex bonding.',
    keywords:
      'display repair, screen replacement, touch glass repair, green screen fix, iPhone display repair, Samsung AMOLED repair, Qaswa Telecom Mumbai',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    author: 'QASWA TELECOM Tech Team',
    schemaType: 'LocalBusiness',
    schemaJson: getSchemaTemplate('LocalBusiness', {
      path: '/',
      title: 'QASWA TELECOM | Flagship Display Repair Specialists',
    }),
  },
  '/mobile-repair': {
    path: '/mobile-repair',
    pageName: 'Mobile Repair Booking',
    category: 'Core',
    title: 'Book Flagship Display Repair & Screen Replacement | QASWA TELECOM',
    description:
      'Instant online diagnostic booking for smartphone display issues, line issues, blank screens, and cracked touch glass. Transparent pricing, express walk-in, and warranty.',
    keywords:
      'book mobile repair, screen replacement booking, iPhone repair appointment, Samsung screen repair price, display diagnostic',
    ogImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/mobile-repair',
      title: 'Book Flagship Display Repair & Screen Replacement',
    }),
  },
  '/brands': {
    path: '/brands',
    pageName: 'Supported Brands',
    category: 'Brands',
    title: 'Supported Device Brands | Flagship Display Repair | QASWA TELECOM',
    description:
      'Specialized screen repair and laser bonding for Apple, Samsung, Google Pixel, OnePlus, and smart devices. Original quality displays, OCA bonding & testing warranty.',
    keywords:
      'iPhone screen repair, Samsung display repair, Pixel screen replacement, OnePlus display repair, Apple Watch repair',
    ogImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/brands',
      title: 'Supported Device Brands | Flagship Display Repair',
    }),
  },
  '/brands/apple': {
    path: '/brands/apple',
    pageName: 'Apple iPhone & Watch Repairs',
    category: 'Brands',
    title: 'Apple iPhone, iPad & Apple Watch Display Repair | QASWA TELECOM',
    description:
      'Specialized OLED screen replacement, touch glass refurbishing, and True Tone transfer for iPhone 11 to 16 Pro Max, iPad Pro, and Apple Watch Ultra.',
    keywords: 'iPhone screen repair, iPhone glass replacement, Apple Watch screen repair, iPad display fix',
    ogImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/brands/apple',
      title: 'Apple iPhone, iPad & Apple Watch Display Repair',
    }),
  },
  '/brands/samsung': {
    path: '/brands/samsung',
    pageName: 'Samsung Galaxy & Fold Repairs',
    category: 'Brands',
    title: 'Samsung Galaxy S, Note & Z Fold Display Repair | QASWA TELECOM',
    description:
      'Laser line repair and ultra-thin glass lamination for Samsung Galaxy S21 to S24 Ultra, Z Fold, and Z Flip series. Preserve original Dynamic AMOLED panels.',
    keywords: 'Samsung screen repair, Galaxy S23 Ultra display, Z Fold screen repair, Samsung green line fix',
    ogImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/brands/samsung',
      title: 'Samsung Galaxy S, Note & Z Fold Display Repair',
    }),
  },
  '/services': {
    path: '/services',
    pageName: 'Display Repair Services',
    category: 'Services',
    title: 'Display Repair Services | Glass Replacement & Laser Bonding | QASWA TELECOM',
    description:
      'Explore precision display services: Outer Glass Refurbishing, Green Line Laser Repair, Touch Digitizer Fix, and Complete AMOLED Assembly Replacement.',
    keywords:
      'screen replacement service, green line repair, laser flex bonding, touch digitizer replacement, OCA lamination',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/services',
      title: 'Display Repair Services | Glass Replacement & Laser Bonding',
    }),
  },
  '/services/line-issue': {
    path: '/services/line-issue',
    pageName: 'Green / White Line Laser Repair',
    category: 'Services',
    title: 'Green & White Line Display Laser Repair Service | QASWA TELECOM',
    description:
      'Micro-laser flex bonding to repair vertical green, pink, or white lines on Samsung, OnePlus, and iPhone OLED screens without changing the original display panel.',
    keywords: 'green line fix, vertical line screen repair, laser bonding mobile display, AMOLED line issue',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Service',
    schemaJson: getSchemaTemplate('Service', {
      path: '/services/line-issue',
      title: 'Green & White Line Display Laser Repair Service',
    }),
  },
  '/services/glass-replacement': {
    path: '/services/glass-replacement',
    pageName: 'Outer Glass Replacement (OCA)',
    category: 'Services',
    title: 'Outer Touch Glass Replacement & OCA Lamination | QASWA TELECOM',
    description:
      'Cracked glass but touch and display still working? Keep your original factory OLED panel and save up to 70% with our precision cleanroom OCA glass replacement.',
    keywords: 'glass only repair, touch glass replacement, OCA lamination mobile, cracked screen glass fix',
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
  '/service-centers': {
    path: '/service-centers',
    pageName: 'Service Centers & Labs',
    category: 'Core',
    title: 'Service Centers & Cleanroom Labs | QASWA TELECOM',
    description:
      'Visit our certified walk-in display repair service centers and cleanroom laboratories. Express diagnosis, genuine parts, and post-repair quality testing.',
    keywords:
      'phone repair shop near me, mobile service center Mumbai, display repair lab walk-in, screen repair center',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'LocalBusiness',
    schemaJson: getSchemaTemplate('LocalBusiness', {
      path: '/service-centers',
      title: 'Service Centers & Cleanroom Labs',
    }),
  },
  '/track-order': {
    path: '/track-order',
    pageName: 'Track Order',
    category: 'Core',
    title: 'Track Repair Status | Live Job Sheet Tracker | QASWA TELECOM',
    description:
      'Track real-time status of your display repair device using your Order ID or registered mobile number. Monitor diagnostics, bonding, testing, and dispatch.',
    keywords: 'track repair order, check repair status, mobile repair job sheet tracking, Qaswa repair status',
    ogImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'noindex, follow',
    twitterCard: 'summary',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/track-order',
      title: 'Track Repair Status | Live Job Sheet Tracker',
    }),
  },
  '/blogs': {
    path: '/blogs',
    pageName: 'Blogs & Articles',
    category: 'Content',
    title: 'Display Repair Insights & Technical Blogs | QASWA TELECOM',
    description:
      'Expert articles on smartphone screen technology, OLED green line fixes, glass-only refurbishing, and display maintenance tips from certified technicians.',
    keywords: 'display repair blog, green line fix tutorial, OLED vs AMOLED, phone screen replacement guide',
    ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/blogs',
      title: 'Display Repair Insights & Technical Blogs',
    }),
  },
  '/testimonials': {
    path: '/testimonials',
    pageName: 'Testimonials & Reviews',
    category: 'Content',
    title: 'Customer Reviews & Display Repair Testimonials | QASWA TELECOM',
    description:
      'Read real verified customer reviews and display repair experiences for iPhone, Galaxy Ultra, and foldable screens repaired at QASWA TELECOM.',
    keywords: 'Qaswa Telecom reviews, display repair feedback, customer testimonials screen repair, verified reviews',
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
  '/about': {
    path: '/about',
    pageName: 'About Us',
    category: 'Legal',
    title: 'About QASWA TELECOM | Flagship Display Repair Specialists',
    description:
      'Learn about QASWA TELECOM’s mission, certified cleanroom facility, micro-soldering and laser bonding technology for smartphone and smartwatch displays.',
    keywords: 'about Qaswa Telecom, flagship screen repair company, certified mobile technicians, Mumbai display lab',
    ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'Organization',
    schemaJson: getSchemaTemplate('Organization', {
      path: '/about',
      title: 'About QASWA TELECOM | Flagship Display Repair Specialists',
    }),
  },
  '/contact': {
    path: '/contact',
    pageName: 'Contact Us',
    category: 'Legal',
    title: 'Contact QASWA TELECOM | Support, Enquiries & WhatsApp Dispatch',
    description:
      'Get in touch with QASWA TELECOM technicians for display repair advice, instant quotation, corporate bulk repair, and pickup-drop service across Mumbai.',
    keywords: 'contact Qaswa Telecom, mobile repair helpline, display repair WhatsApp number, phone repair inquiry',
    ogImage: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
    schemaType: 'LocalBusiness',
    schemaJson: getSchemaTemplate('LocalBusiness', {
      path: '/contact',
      title: 'Contact QASWA TELECOM | Support & Enquiries',
    }),
  },
  '/terms': {
    path: '/terms',
    pageName: 'Terms & Conditions',
    category: 'Legal',
    title: 'Terms & Conditions & Repair Warranty Policy | QASWA TELECOM',
    description:
      'Official repair terms, warranty coverage guidelines, diagnostic policies, and customer privacy details at QASWA TELECOM.',
    keywords: 'repair terms, screen repair warranty, display replacement policy, service terms',
    ogImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary',
    schemaType: 'WebPage',
    schemaJson: getSchemaTemplate('WebPage', {
      path: '/terms',
      title: 'Terms & Conditions & Repair Warranty Policy',
    }),
  },
  '/faqs': {
    path: '/faqs',
    pageName: 'FAQs',
    category: 'Legal',
    title: 'Frequently Asked Questions (FAQs) | Display Repair | QASWA TELECOM',
    description:
      'Got questions about display repairs, costs, warranty, repair turnaround time, or data safety? Find answers to commonly asked questions.',
    keywords: 'display repair FAQ, screen replacement questions, phone repair guarantee, display repair cost',
    ogImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
    ogType: 'website',
    canonicalUrl: '',
    robots: 'index, follow',
    twitterCard: 'summary',
    schemaType: 'FAQPage',
    schemaJson: getSchemaTemplate('FAQPage', {
      path: '/faqs',
      title: 'Frequently Asked Questions (FAQs) | Display Repair',
    }),
  },
};

/**
 * Applies dynamic SEO metadata to document head
 */
export function applyDynamicSeo(seo: Partial<PageSeoConfig>, siteName: string = 'QASWA TELECOM'): void {
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
  const canonicalUrl = seo.canonicalUrl || (typeof window !== 'undefined' ? `${origin}${window.location.pathname}` : '');
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
 * Hook to set page title and meta description for SEO (backwards-compatible)
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
  }, [title, description]);
}

/**
 * Hook for pages to automatically consume dynamic page SEO from settings
 */
export function useDynamicPageSeo(
  path?: string,
  customOverride?: Partial<PageSeoConfig>,
  siteSettingsMap?: Record<string, string | undefined>
): void {
  useEffect(() => {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');

    // Try to load any custom configs stored in settings
    let savedConfigs: Record<string, PageSeoConfig> = {};
    if (siteSettingsMap?.SEO_CONFIG_PAGES) {
      try {
        savedConfigs = JSON.parse(siteSettingsMap.SEO_CONFIG_PAGES);
      } catch (e) {
        // ignore
      }
    }

    // Lookup matching config or baseline default
    const baseline = DEFAULT_PAGE_SEO_MAP[currentPath] || DEFAULT_PAGE_SEO_MAP['/'];
    const saved = savedConfigs[currentPath];

    const finalConfig: PageSeoConfig = {
      ...baseline,
      ...saved,
      ...customOverride,
      path: currentPath,
    };

    applyDynamicSeo(finalConfig, siteSettingsMap?.SITE_NAME || 'QASWA TELECOM');

    return () => {
      // Cleanup custom dynamic schema when unmounting page
      removeJsonLd('page-dynamic-schema');
    };
  }, [path, customOverride, siteSettingsMap]);
}
