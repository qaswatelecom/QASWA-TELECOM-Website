import { db } from './index.ts';
import {
  brands,
  models,
  services,
  modelServices,
  orderStatuses,
  customerFormFields,
  serviceCenters,
  cmsSections,
  blogs,
  faqs,
  testimonials,
  customPages,
  siteSettings,
  customers,
  orders,
  mediaItems,
  galleryItems,
} from './schema.ts';
import { count } from 'drizzle-orm';

export async function seedDatabaseIfEmpty() {
  try {
    // Check if media library needs initialization
    const existingMedia = await db.select({ value: count() }).from(mediaItems);
    if (!existingMedia[0]?.value || existingMedia[0].value === 0) {
      await db.insert(mediaItems).values([
        {
          name: 'Cleanroom Stereo Microscope Station',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
          altText: 'Micro-soldering and high-magnification optical inspection workstation',
          category: 'cleanroom',
        },
        {
          name: 'Laser Display Glass Separation Machine',
          url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
          altText: 'Cold laser separation unit for curved OLED screens',
          category: 'cleanroom',
        },
        {
          name: 'Cleanroom Dust-Free Laminar Flow Booth',
          url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          altText: 'ISO Class 5 dust-free pressurized chamber for OCA screen lamination',
          category: 'banners',
        },
        {
          name: 'Motherboard Component Level Re-balling',
          url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1200&q=80',
          altText: 'BGA chip reballing and precision soldering station',
          category: 'gallery',
        },
        {
          name: 'QASWA Flagship Store & Service Desk',
          url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          altText: 'Diagnostic front desk and customer intake workstation',
          category: 'store',
        },
        {
          name: 'Precision Motherboard Trace Microscope View',
          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          altText: 'Detailed microscopic view of smartphone circuit board',
          category: 'gallery',
        },
      ]);
      console.log('Seeded default media library items.');
    }

    // Check if gallery items need initialization
    const existingGallery = await db.select({ value: count() }).from(galleryItems);
    if (!existingGallery[0]?.value || existingGallery[0].value === 0) {
      await db.insert(galleryItems).values([
        {
          title: 'iPhone 15 Pro Max Ceramic Shield & Super Retina XDR OLED Refurbishing',
          caption: 'OCA optical de-bonding and factory-grade outer glass lamination preserving authentic Super Retina XDR display panel and TrueTone sensor.',
          imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'apple',
          showOnHomepage: true,
          homepageOrder: 1,
          sortOrder: 1,
          isPublished: true,
        },
        {
          title: 'Samsung Galaxy S24 Ultra Dynamic AMOLED 2X Laser Flex Repair',
          caption: 'Precision laser micro-welding of inner flex traces to resolve green line malfunction without replacing the original factory display assembly.',
          imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'samsung',
          showOnHomepage: true,
          homepageOrder: 2,
          sortOrder: 2,
          isPublished: true,
        },
        {
          title: 'Apple Watch Ultra 2 Sapphire Crystal Display Refurbishing',
          caption: 'Micro-precision sapphire crystal separation and high-pressure autoclave de-aeration with water-resistance gasket sealing.',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000&q=80',
          categorySlug: 'apple-watch',
          brandSlug: 'apple',
          showOnHomepage: true,
          homepageOrder: 3,
          sortOrder: 3,
          isPublished: true,
        },
        {
          title: 'iPad Pro 13-inch (M4) Tandem OLED Digitizer Lamination',
          caption: 'Cleanroom optical bonding restoring full digitizer touch sensitivity and Apple Pencil Pro latency calibration.',
          imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80',
          categorySlug: 'ipad',
          brandSlug: 'apple',
          showOnHomepage: true,
          homepageOrder: 4,
          sortOrder: 4,
          isPublished: true,
        },
        {
          title: 'Google Pixel 8 Pro Super Actua OLED Display Restoration',
          caption: 'Sub-zero cold separation and precision OCA glass replacement preserving the under-display ultrasonic fingerprint sensor.',
          imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'google-pixel',
          showOnHomepage: true,
          homepageOrder: 5,
          sortOrder: 5,
          isPublished: true,
        },
        {
          title: 'Samsung Galaxy Z Fold 5 Inner UTG Folding Screen Restoration',
          caption: 'Specialized Ultra Thin Glass de-lamination and flexible polyimide trace repair with zero hinge crease lifting.',
          imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'samsung',
          showOnHomepage: true,
          homepageOrder: 6,
          sortOrder: 6,
          isPublished: true,
        },
        {
          title: 'iPhone 14 Pro Dynamic Island OLED Flex Bonding',
          caption: 'Chip-On-Film (COF) bonding machine trace realignment solving vertical colored lines across Dynamic Island.',
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'apple',
          showOnHomepage: true,
          homepageOrder: 7,
          sortOrder: 7,
          isPublished: true,
        },
        {
          title: 'Apple Watch Series 9 Curved Edge OLED Glass Restoration',
          caption: 'Preserving original Always-On Retina LTPO OLED with zero touch lag and perfect edge curvature.',
          imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000&q=80',
          categorySlug: 'apple-watch',
          brandSlug: 'apple',
          showOnHomepage: false,
          homepageOrder: 8,
          sortOrder: 8,
          isPublished: true,
        },
        {
          title: 'Samsung Galaxy Tab S9 Ultra 14.6" Dynamic AMOLED 2X Display Fix',
          caption: 'Large-format optical OCA lamination in class-100 dust-free laminar booth with S-Pen active digitizer calibration.',
          imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1000&q=80',
          categorySlug: 'tablet',
          brandSlug: 'samsung',
          showOnHomepage: false,
          homepageOrder: 9,
          sortOrder: 9,
          isPublished: true,
        },
        {
          title: 'OnePlus 12 2K ProXDR Curved Display Glass Refurbishing',
          caption: 'Seamless curved screen glass replacement with precision UV optical adhesive and 4500 nits peak brightness preservation.',
          imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1000&q=80',
          beforeImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
          categorySlug: 'mobile',
          brandSlug: 'oneplus',
          showOnHomepage: false,
          homepageOrder: 10,
          sortOrder: 10,
          isPublished: true,
        },
      ]);
      console.log('Seeded default display repair gallery items.');
    }

    const brandCount = await db.select({ value: count() }).from(brands);
    if (brandCount[0]?.value && brandCount[0].value > 0) {
      console.log('Database already initialized for QASWA TELECOM.');
      return;
    }


    console.log('Starting initial database seeding for QASWA TELECOM Display Specialist...');

    // 1. Site Settings
    const defaultSettings = [
      { key: 'WHATSAPP_NUMBER', value: '9324316048' },
      { key: 'SITE_NAME', value: 'QASWA TELECOM' },
      { key: 'SITE_TAGLINE', value: 'Display Repair Specialists for Flagship Devices' },
      { key: 'SITE_PHONE', value: '+91 9324316048' },
      { key: 'SITE_EMAIL', value: 'telecomqaswa@gmail.com' },
      {
        key: 'SITE_ADDRESS',
        value:
          'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
      },
      {
        key: 'BUSINESS_HOURS',
        value: 'Everyday: 11:00 AM – 9:00 PM',
      },
      {
        key: 'GOOGLE_MAPS_URL',
        value: 'https://share.google/JdvLGimvQe18jUJNp',
      },
      {
        key: 'HEADER_CONFIG',
        value: JSON.stringify({
          logoText: 'QASWA TELECOM',
          logoSubtext: 'Display Repair Specialists',
          navItems: [
            { id: '1', label: 'Home', url: '/#hero' },
            { id: '2', label: 'About Us', url: '/#about' },
            { id: '3', label: 'Devices', url: '/#devices' },
            { id: '4', label: 'Display Repairs', url: '/#repairs' },
            { id: '5', label: 'Gallery', url: '/#gallery' },
            { id: '6', label: 'FAQs', url: '/#faqs' },
            { id: '7', label: 'Contact Us', url: '/#contact' },
          ],
        }),
      },
      {
        key: 'FOOTER_CONFIG',
        value: JSON.stringify({
          companyName: 'QASWA TELECOM',
          description:
            'QASWA TELECOM is a specialized mobile repair service focused exclusively on display repairs for high-end flagship devices: Apple iPhone, Samsung Galaxy S and Z series, Google Pixel, OnePlus, Apple Watch, iPad, and premium tablets.',
          phone: '+91 9324316048',
          email: 'telecomqaswa@gmail.com',
          address:
            'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
          whatsappNumber: '9324316048',
          copyright: '© 2026 QASWA TELECOM. All Rights Reserved. Display Repair Specialists for Flagship Devices.',
          socialLinks: {
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            twitter: 'https://x.com',
            linkedin: 'https://linkedin.com',
          },
        }),
      },
      {
        key: 'THEME_CONFIG',
        value: JSON.stringify({
          primaryColor: '#00B2A2',
          accentColor: '#008F82',
          brandName: 'QASWA TELECOM',
        }),
      },
      {
        key: 'SEO_CONFIG',
        value: JSON.stringify({
          defaultTitle: 'QASWA TELECOM - Display Repair Specialists for Flagship Devices',
          defaultDescription:
            'Expert display repair solutions for premium smartphones, Apple Watch, iPad, and tablets. Specialized optical bonding, touch glass replacement, and green screen repair.',
          ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
        }),
      },
    ];

    for (const s of defaultSettings) {
      await db.insert(siteSettings).values(s).onConflictDoNothing();
    }

    // 2. Order Statuses
    const defaultStatuses = [
      { name: 'New', color: '#00B2A2', sortOrder: 1, isActive: true },
      { name: 'Diagnosis In Progress', color: '#3B82F6', sortOrder: 2, isActive: true },
      { name: 'Display Refurbishing', color: '#F59E0B', sortOrder: 3, isActive: true },
      { name: 'Testing & Calibration', color: '#8B5CF6', sortOrder: 4, isActive: true },
      { name: 'Ready for Collection', color: '#10B981', sortOrder: 5, isActive: true },
      { name: 'Completed', color: '#059669', sortOrder: 6, isActive: true },
      { name: 'Cancelled', color: '#EF4444', sortOrder: 7, isActive: true },
    ];
    for (const st of defaultStatuses) {
      await db.insert(orderStatuses).values(st).onConflictDoNothing();
    }

    // 3. Customer Form Fields
    const defaultFormFields = [
      { fieldKey: 'fullName', label: 'Full Name', placeholder: 'e.g. John Doe', fieldType: 'text', isRequired: true, isEnabled: true, sortOrder: 1 },
      { fieldKey: 'mobileNumber', label: 'Mobile Number', placeholder: 'e.g. +91 9324316048', fieldType: 'tel', isRequired: true, isEnabled: true, sortOrder: 2 },
      { fieldKey: 'whatsappNumber', label: 'WhatsApp Number', placeholder: 'e.g. +91 9324316048', fieldType: 'tel', isRequired: false, isEnabled: true, sortOrder: 3 },
      { fieldKey: 'email', label: 'Email Address', placeholder: 'e.g. john@example.com', fieldType: 'email', isRequired: false, isEnabled: true, sortOrder: 4 },
      { fieldKey: 'city', label: 'City', placeholder: 'e.g. Mumbai', fieldType: 'text', isRequired: true, isEnabled: true, sortOrder: 5 },
      { fieldKey: 'preferredDate', label: 'Preferred Date', placeholder: 'Select date', fieldType: 'date', isRequired: true, isEnabled: true, sortOrder: 6 },
      { fieldKey: 'preferredTime', label: 'Preferred Time', placeholder: 'Select time slot', fieldType: 'time', isRequired: true, isEnabled: true, sortOrder: 7 },
      { fieldKey: 'additionalNote', label: 'Display Issue Description', placeholder: 'e.g. Green vertical line appeared after software update', fieldType: 'textarea', isRequired: false, isEnabled: true, sortOrder: 8 },
    ];
    for (const field of defaultFormFields) {
      await db.insert(customerFormFields).values(field).onConflictDoNothing();
    }

    // 4. Exclusive 7 Display Repair Services
    const displayServices = [
      {
        name: 'Broken or Cracked Displays',
        slug: 'broken-cracked-displays',
        icon: 'Smartphone',
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
        description: 'Precision de-bonding, frame alignment, and pristine OEM-grade display restoration for severely cracked or shattered screens.',
        priceEstimate: null,
        estimatedDuration: '45 - 60 mins',
        warrantyInfo: null,
        sortOrder: 1,
      },
      {
        name: 'Touch Glass Replacement',
        slug: 'touch-glass-replacement',
        icon: 'Layers',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
        description: 'Refurbishing the top glass layer while preserving the original factory OLED/AMOLED panel and TrueTone calibration beneath.',
        priceEstimate: null,
        estimatedDuration: '60 - 90 mins',
        warrantyInfo: null,
        sortOrder: 2,
      },
      {
        name: 'Green Screen Issues',
        slug: 'green-screen-issues',
        icon: 'Sparkles',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        description: 'Laser micro-welding and flex bonding to resolve green screen of death and display blanking on flagship AMOLED & Super Retina screens.',
        priceEstimate: null,
        estimatedDuration: '60 mins',
        warrantyInfo: null,
        sortOrder: 3,
      },
      {
        name: 'Display Lines (Vertical & Horizontal)',
        slug: 'display-lines',
        icon: 'Activity',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        description: 'Advanced display flex trace bonding to eliminate single or multiple colored vertical and horizontal display lines without full screen swap.',
        priceEstimate: null,
        estimatedDuration: '60 - 90 mins',
        warrantyInfo: null,
        sortOrder: 4,
      },
      {
        name: 'Touchscreen Issues',
        slug: 'touchscreen-issues',
        icon: 'Fingerprint',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
        description: 'Resolving ghost touches, unresponsive touch regions, and digitizer lag with micro-soldered touch controller inspection and calibration.',
        priceEstimate: null,
        estimatedDuration: '45 mins',
        warrantyInfo: null,
        sortOrder: 5,
      },
      {
        name: 'Black Screen & Display Malfunction',
        slug: 'black-screen-malfunction',
        icon: 'EyeOff',
        imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&q=80',
        description: 'Comprehensive display power rail diagnostics, backlight/OLED illumination restoration, and display connector repair.',
        priceEstimate: null,
        estimatedDuration: '45 - 60 mins',
        warrantyInfo: null,
        sortOrder: 6,
      },
      {
        name: 'Other Display-Related Problems',
        slug: 'other-display-problems',
        icon: 'Wrench',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80',
        description: 'Specialized diagnosis for display flicker, color banding, TrueTone reprogramming, and display ambient sensor realignment.',
        priceEstimate: null,
        estimatedDuration: 'Upon Diagnosis',
        warrantyInfo: null,
        sortOrder: 7,
      },
    ];

    const insertedServices: any[] = [];
    for (const serv of displayServices) {
      const res = await db.insert(services).values(serv).returning();
      insertedServices.push(res[0]);
    }

    // 5. Device Categories (Brands)
    const deviceCategories = [
      {
        name: 'iPhone',
        slug: 'iphone',
        logoUrl: '/brands/apple.svg',
        description: 'Specialized display repairs for Apple iPhone Super Retina XDR OLED panels, Ceramic Shield glass, and TrueTone calibration.',
        seoTitle: 'iPhone Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Expert display repairs for iPhone 15 Pro Max, 14 Pro, 13 Pro and all flagship Apple models. Green screen fix, touch glass and OLED restoration.',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Samsung Galaxy',
        slug: 'samsung-galaxy',
        logoUrl: '/brands/samsung.svg',
        description: 'Specialized display solutions for Samsung Galaxy S-Series Dynamic AMOLED 2X, Z Fold, and Z Flip foldable panels.',
        seoTitle: 'Samsung Galaxy Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Expert display repairs for Samsung Galaxy S24 Ultra, S23 Ultra, Z Fold 5, and Z Flip 5. Green line repair and OLED glass replacement.',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Google Pixel',
        slug: 'google-pixel',
        logoUrl: '/brands/google-pixel.svg',
        description: 'Precision display repair for Google Pixel Actua & Super Actua OLED screens, under-display fingerprint alignment, and touch glass.',
        seoTitle: 'Google Pixel Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Specialized display repairs for Google Pixel 8 Pro, 8, Fold, 7 Pro. Digitizer calibration and pristine OLED restoration.',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'OnePlus',
        slug: 'oneplus',
        logoUrl: '/brands/oneplus.svg',
        description: 'Specialized vertical green line elimination, 120Hz LTPO Fluid AMOLED restoration, and touch glass replacement for OnePlus flagships.',
        seoTitle: 'OnePlus Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Expert display repairs for OnePlus 12, 11, Open, 10 Pro. Green line laser repair and original AMOLED touch glass refurbishing.',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Apple Watch',
        slug: 'apple-watch',
        logoUrl: '/brands/apple.svg',
        description: 'Micro-precision sapphire crystal touch glass refurbishing and OLED display repair for Apple Watch Ultra, Series 9, and Series 8.',
        seoTitle: 'Apple Watch Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Dedicated display and sapphire glass repair for Apple Watch Ultra 2, Series 9, 8, 7. Preserving Force Touch and display sensors.',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'iPad',
        slug: 'ipad',
        logoUrl: '/brands/apple.svg',
        description: 'Liquid Retina XDR and Ultra Retina Tandem OLED display repairs, laminated digitizer replacement, and Apple Pencil sensitivity preservation.',
        seoTitle: 'iPad Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Specialized display repair for iPad Pro M4/M2, iPad Air, and iPad Mini. TrueTone programming and seamless glass restoration.',
        sortOrder: 6,
        isActive: true,
      },
      {
        name: 'Premium Tablets',
        slug: 'premium-tablets',
        logoUrl: '/brands/samsung.svg',
        description: 'High-end display repairs for Samsung Galaxy Tab S9 Ultra, Microsoft Surface Pro, and other flagship tablet AMOLED panels.',
        seoTitle: 'Premium Tablet Display Repair Specialists | QASWA TELECOM',
        seoDescription: 'Specialized large-screen display repairs for Samsung Galaxy Tab S9 Ultra, Surface Pro, and flagship high-refresh rate tablet displays.',
        sortOrder: 7,
        isActive: true,
      },
    ];

    const insertedBrands: any[] = [];
    for (const b of deviceCategories) {
      const res = await db.insert(brands).values(b).returning();
      insertedBrands.push(res[0]);
    }

    // 6. Models
    const modelsByCategory: Record<string, string[]> = {
      'iphone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 13 Pro Max', 'iPhone 13 Pro'],
      'samsung-galaxy': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5'],
      'google-pixel': ['Pixel 8 Pro', 'Pixel 8', 'Pixel Fold', 'Pixel 7 Pro', 'Pixel 7'],
      'oneplus': ['OnePlus 12', 'OnePlus 12R', 'OnePlus Open', 'OnePlus 11 5G', 'OnePlus 10 Pro'],
      'apple-watch': ['Apple Watch Ultra 2', 'Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch Series 8'],
      'ipad': ['iPad Pro 13" (M4 OLED)', 'iPad Pro 11" (M4 OLED)', 'iPad Pro 12.9" (M2)', 'iPad Air 13" (M2)', 'iPad mini (6th Gen)'],
      'premium-tablets': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Microsoft Surface Pro 9'],
    };

    const insertedModels: any[] = [];
    for (const b of insertedBrands) {
      const modelNames = modelsByCategory[b.slug] || [];
      for (let i = 0; i < modelNames.length; i++) {
        const mName = modelNames[i];
        const cleanName = mName.toLowerCase().replace(/\+/g, '-plus').replace(/"/g, 'inch').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const mSlug = `${b.slug}-${cleanName}`;
        const res = await db.insert(models).values({
          brandId: b.id,
          name: mName,
          slug: mSlug,
          imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
          description: `Precision display repair and touch glass refurbishing for ${mName}.`,
          seoTitle: `${mName} Display Repair Specialists | QASWA TELECOM`,
          seoDescription: `Specialized display repair services for ${mName}. Green screen, vertical lines, cracked glass, and digitizer solutions.`,
          sortOrder: i + 1,
          isActive: true,
        }).returning();
        insertedModels.push(res[0]);
      }
    }

    // 7. Link Models to Display Services
    for (const m of insertedModels) {
      for (const s of insertedServices) {
        await db.insert(modelServices).values({
          modelId: m.id,
          serviceId: s.id,
          customPrice: null,
          isActive: true,
        });
      }
    }

    // 8. Service Centers (Precision Display Lab)
    await db.insert(serviceCenters).values({
      name: 'QASWA TELECOM - Flagship Display Repair Center',
      city: 'Mumbai',
      address:
        'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
      phone: '+91 9324316048',
      whatsapp: '9324316048',
      mapUrl: 'https://share.google/JdvLGimvQe18jUJNp',
      timing: 'Everyday: 11:00 AM – 9:00 PM',
      isActive: true,
    });

    console.log('QASWA TELECOM database initialized successfully.');
  } catch (error) {
    console.error('Error during QASWA TELECOM database seeding:', error);
  }
}
