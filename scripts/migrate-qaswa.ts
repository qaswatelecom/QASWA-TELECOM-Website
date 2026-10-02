import { db } from '../src/db/index.ts';
import {
  brands,
  models,
  services,
  modelServices,
  siteSettings,
  faqs,
  testimonials,
  cmsSections,
} from '../src/db/schema.ts';
import { eq, sql } from 'drizzle-orm';

export async function migrateToQaswaDisplaySpecialist() {
  console.log('--- Migrating Database to QASWA TELECOM Display Specialist ---');

  // 1. Update Site Settings
  const settingsList = [
    { key: 'SITE_NAME', value: 'QASWA TELECOM' },
    { key: 'SITE_TAGLINE', value: 'Display Repair Specialists for Flagship Devices' },
    { key: 'SITE_PHONE', value: '+91 9324316048' },
    { key: 'SITE_EMAIL', value: 'telecomqaswa@gmail.com' },
    { key: 'SITE_ADDRESS', value: 'Shop No. 4, Tech Plaza, Main Market' },
    { key: 'WHATSAPP_NUMBER', value: '9324316048' },
    {
      key: 'THEME_CONFIG',
      value: JSON.stringify({
        primaryColor: '#00B2A2',
        accentColor: '#008F82',
        brandName: 'QASWA TELECOM',
      }),
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
        address: 'Shop No. 4, Tech Plaza, Main Market',
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
      key: 'SEO_CONFIG',
      value: JSON.stringify({
        defaultTitle: 'QASWA TELECOM - Display Repair Specialists for Flagship Devices',
        defaultDescription:
          'Expert display repair solutions for premium smartphones, Apple Watch, iPad, and tablets. Specialized optical bonding, touch glass replacement, and green screen repair.',
        ogImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
      }),
    },
  ];

  for (const s of settingsList) {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, s.key));
    if (existing.length > 0) {
      await db.update(siteSettings).set({ value: s.value }).where(eq(siteSettings.key, s.key));
    } else {
      await db.insert(siteSettings).values(s);
    }
  }
  console.log('Site settings updated.');

  // 2. Clear out old orders, model services, and non-display services
  const { orders } = await import('../src/db/schema.ts');
  await db.delete(orders);
  await db.delete(modelServices);
  await db.delete(services);

  // 3. Insert Exclusive 7 Display Repair Services
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

  const insertedServices = await db.insert(services).values(displayServices).returning();
  console.log(`Inserted ${insertedServices.length} display services.`);

  // 4. Update Device Categories (Brands)
  await db.delete(models);
  await db.delete(brands);

  const deviceCategories = [
    {
      name: 'iPhone',
      slug: 'iphone',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Specialized display repairs for Apple iPhone Super Retina XDR OLED panels, Ceramic Shield glass, and TrueTone calibration.',
      seoTitle: 'iPhone Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Expert display repairs for iPhone 15 Pro Max, 14 Pro, 13 Pro and all flagship Apple models. Green screen fix, touch glass and OLED restoration.',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'Samsung Galaxy',
      slug: 'samsung-galaxy',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      description: 'Specialized display solutions for Samsung Galaxy S-Series Dynamic AMOLED 2X, Z Fold, and Z Flip foldable panels.',
      seoTitle: 'Samsung Galaxy Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Expert display repairs for Samsung Galaxy S24 Ultra, S23 Ultra, Z Fold 5, and Z Flip 5. Green line repair and OLED glass replacement.',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Google Pixel',
      slug: 'google-pixel',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      description: 'Precision display repair for Google Pixel Actua & Super Actua OLED screens, under-display fingerprint alignment, and touch glass.',
      seoTitle: 'Google Pixel Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Specialized display repairs for Google Pixel 8 Pro, 8, Fold, 7 Pro. Digitizer calibration and pristine OLED restoration.',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'OnePlus',
      slug: 'oneplus',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_RGB_RED_copy.svg',
      description: 'Specialized vertical green line elimination, 120Hz LTPO Fluid AMOLED restoration, and touch glass replacement for OnePlus flagships.',
      seoTitle: 'OnePlus Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Expert display repairs for OnePlus 12, 11, Open, 10 Pro. Green line laser repair and original AMOLED touch glass refurbishing.',
      sortOrder: 4,
      isActive: true,
    },
    {
      name: 'Apple Watch',
      slug: 'apple-watch',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Micro-precision sapphire crystal touch glass refurbishing and OLED display repair for Apple Watch Ultra, Series 9, and Series 8.',
      seoTitle: 'Apple Watch Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Dedicated display and sapphire glass repair for Apple Watch Ultra 2, Series 9, 8, 7. Preserving Force Touch and display sensors.',
      sortOrder: 5,
      isActive: true,
    },
    {
      name: 'iPad',
      slug: 'ipad',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Liquid Retina XDR and Ultra Retina Tandem OLED display repairs, laminated digitizer replacement, and Apple Pencil sensitivity preservation.',
      seoTitle: 'iPad Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Specialized display repair for iPad Pro M4/M2, iPad Air, and iPad Mini. TrueTone programming and seamless glass restoration.',
      sortOrder: 6,
      isActive: true,
    },
    {
      name: 'Premium Tablets',
      slug: 'premium-tablets',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      description: 'High-end display repairs for Samsung Galaxy Tab S9 Ultra, Microsoft Surface Pro, and other flagship tablet AMOLED panels.',
      seoTitle: 'Premium Tablet Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Specialized large-screen display repairs for Samsung Galaxy Tab S9 Ultra, Surface Pro, and flagship high-refresh rate tablet displays.',
      sortOrder: 7,
      isActive: true,
    },
  ];

  const insertedBrands = await db.insert(brands).values(deviceCategories).returning();
  console.log(`Inserted ${insertedBrands.length} device categories.`);

  // 5. Insert Flagship Models for Each Category
  const modelsByCategory: Record<string, string[]> = {
    'iphone': [
      'iPhone 15 Pro Max',
      'iPhone 15 Pro',
      'iPhone 15 Plus',
      'iPhone 15',
      'iPhone 14 Pro Max',
      'iPhone 14 Pro',
      'iPhone 14 Plus',
      'iPhone 14',
      'iPhone 13 Pro Max',
      'iPhone 13 Pro',
      'iPhone 13',
      'iPhone 12 Pro Max',
    ],
    'samsung-galaxy': [
      'Galaxy S24 Ultra',
      'Galaxy S24+',
      'Galaxy S24',
      'Galaxy S23 Ultra',
      'Galaxy S23+',
      'Galaxy S23',
      'Galaxy Z Fold 5',
      'Galaxy Z Flip 5',
      'Galaxy Z Fold 4',
      'Galaxy S22 Ultra',
    ],
    'google-pixel': [
      'Pixel 8 Pro',
      'Pixel 8',
      'Pixel Fold',
      'Pixel 7 Pro',
      'Pixel 7',
      'Pixel 7a',
      'Pixel 6 Pro',
      'Pixel 6',
    ],
    'oneplus': [
      'OnePlus 12',
      'OnePlus 12R',
      'OnePlus Open',
      'OnePlus 11 5G',
      'OnePlus 10 Pro',
      'OnePlus 9 Pro',
      'OnePlus 9',
    ],
    'apple-watch': [
      'Apple Watch Ultra 2',
      'Apple Watch Ultra',
      'Apple Watch Series 9 (45mm)',
      'Apple Watch Series 9 (41mm)',
      'Apple Watch Series 8 (45mm)',
      'Apple Watch Series 8 (41mm)',
      'Apple Watch Series 7 (45mm)',
      'Apple Watch SE (2nd Gen)',
    ],
    'ipad': [
      'iPad Pro 13" (M4 OLED)',
      'iPad Pro 11" (M4 OLED)',
      'iPad Pro 12.9" (6th Gen M2)',
      'iPad Pro 11" (4th Gen M2)',
      'iPad Air 13" (M2)',
      'iPad Air 11" (M2)',
      'iPad mini (6th Gen)',
      'iPad (10th Gen)',
    ],
    'premium-tablets': [
      'Galaxy Tab S9 Ultra (14.6" AMOLED)',
      'Galaxy Tab S9+ (12.4" AMOLED)',
      'Galaxy Tab S9 (11" AMOLED)',
      'Microsoft Surface Pro 9',
      'Galaxy Tab S8 Ultra',
      'Lenovo Tab Extreme (14.5" OLED)',
    ],
  };

  const allModelRows: any[] = [];
  for (const b of insertedBrands) {
    const modelNames = modelsByCategory[b.slug] || [];
    for (let i = 0; i < modelNames.length; i++) {
      const mName = modelNames[i];
      const cleanName = mName.toLowerCase().replace(/\+/g, '-plus').replace(/"/g, 'inch').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const mSlug = `${b.slug}-${cleanName}`;
      allModelRows.push({
        brandId: b.id,
        name: mName,
        slug: mSlug,
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
        description: `Precision display repair and touch glass refurbishing for ${mName}.`,
        seoTitle: `${mName} Display Repair Specialists | QASWA TELECOM`,
        seoDescription: `Specialized display repair services for ${mName}. Green screen, vertical lines, cracked glass, and digitizer solutions.`,
        sortOrder: i + 1,
        isActive: true,
      });
    }
  }

  const insertedModels = await db.insert(models).values(allModelRows).returning();
  console.log(`Inserted ${insertedModels.length} flagship device models.`);

  // 6. Connect Models to Display Services
  const modelServiceRows: any[] = [];
  for (const m of insertedModels) {
    for (const s of insertedServices) {
      modelServiceRows.push({
        modelId: m.id,
        serviceId: s.id,
        customPrice: null, // No pricing displayed per restrictions
        isActive: true,
      });
    }
  }
  await db.insert(modelServices).values(modelServiceRows);
  console.log(`Linked ${modelServiceRows.length} model-service relationships.`);

  // 7. Update FAQs
  await db.delete(faqs);
  const displayFaqs = [
    {
      question: 'What types of repairs does QASWA TELECOM specialize in?',
      answer:
        'QASWA TELECOM specializes exclusively in display repairs for high-end flagship devices, including Apple iPhone, Samsung Galaxy S and Z series, Google Pixel, OnePlus, Apple Watch, iPad, and premium tablets. We do not provide general mobile repairs like battery, charging port, or motherboard servicing.',
      category: 'Specialization',
      page: 'home',
      sortOrder: 1,
      isActive: true,
    },
    {
      question: 'Can you fix green screen or white screen issues on flagship phones?',
      answer:
        'Yes. We specialize in green screen and white display malfunction repairs on flagship OLED and AMOLED screens (such as iPhone, Samsung Galaxy S-series, and OnePlus) using advanced laser micro-bonding equipment without requiring an entirely new display assembly.',
      category: 'Display Issues',
      page: 'home',
      sortOrder: 2,
      isActive: true,
    },
    {
      question: 'Can you replace only the broken touch glass if the OLED still works?',
      answer:
        'Yes! If your OLED panel and touch functionality are intact and only the outer glass is cracked, our specialized optical laminating (OCA) process allows us to replace just the outer glass, preserving your original factory display panel and TrueTone calibration.',
      category: 'Touch Glass',
      page: 'home',
      sortOrder: 3,
      isActive: true,
    },
    {
      question: 'Can you fix vertical or horizontal display lines?',
      answer:
        'Yes, display lines caused by flex cable degradation or bonding detachment are handled in our specialized lab through display flex trace re-bonding machines.',
      category: 'Display Lines',
      page: 'home',
      sortOrder: 4,
      isActive: true,
    },
    {
      question: 'Do you repair Apple Watch and iPad displays?',
      answer:
        'Yes, we provide dedicated display and sapphire glass refurbishing for Apple Watch Ultra and Series models, as well as Liquid Retina and OLED display repairs for iPad Pro, iPad Air, and premium Android tablets.',
      category: 'Supported Devices',
      page: 'home',
      sortOrder: 5,
      isActive: true,
    },
    {
      question: 'How do I get in touch with QASWA TELECOM?',
      answer:
        'You can reach us directly via WhatsApp (+91 9324316048), call us at +91 9324316048, visit our repair center at Shop No. 4, Tech Plaza, Main Market, or submit your device details through our online booking enquiry form.',
      category: 'Contact',
      page: 'home',
      sortOrder: 6,
      isActive: true,
    },
  ];
  await db.insert(faqs).values(displayFaqs);
  console.log('Inserted display-specific FAQs.');

  // 8. Update Testimonials (Sample placeholders focusing on display repairs)
  await db.delete(testimonials);
  const sampleTestimonials = [
    {
      customerName: 'Farhan Shaikh',
      deviceRepaired: 'iPhone 15 Pro Max',
      rating: 5,
      review:
        'Had shattered the outer glass of my iPhone 15 Pro Max. Qaswa Telecom restored the glass flawlessly while keeping my original Super Retina OLED panel and True Tone intact.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      isFeatured: true,
      isPublished: true,
      date: '2 days ago',
    },
    {
      customerName: 'Rohan Mehta',
      deviceRepaired: 'Samsung Galaxy S23 Ultra',
      rating: 5,
      review:
        'My S23 Ultra suddenly developed a bright green screen. Other shops told me to change the whole screen at exorbitant cost. Qaswa Telecom resolved the display issue using their laser bonding equipment perfectly.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      isFeatured: true,
      isPublished: true,
      date: '1 week ago',
    },
    {
      customerName: 'Pooja Kulkarni',
      deviceRepaired: 'Apple Watch Ultra',
      rating: 5,
      review:
        'Cracked the sapphire crystal on my Apple Watch Ultra. The team did a microscopic glass replacement. Touch response and display brightness are 100% factory grade.',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      isFeatured: true,
      isPublished: true,
      date: '2 weeks ago',
    },
    {
      customerName: 'Adil Mansoori',
      deviceRepaired: 'OnePlus 11 5G',
      rating: 5,
      review:
        'Got the persistent green line on my OnePlus 11 display. Qaswa Telecom repaired the display flex cable seamlessly. True display specialists!',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      isFeatured: true,
      isPublished: true,
      date: '3 weeks ago',
    },
  ];
  await db.insert(testimonials).values(sampleTestimonials);
  console.log('Inserted display testimonials.');

  console.log('--- Migration completed successfully! ---');
}

migrateToQaswaDisplaySpecialist()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
