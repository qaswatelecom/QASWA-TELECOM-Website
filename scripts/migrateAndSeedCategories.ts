import dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/db/index.ts';
import { deviceCategories, brands, models, services, modelServices } from '../src/db/schema.ts';
import { eq, and } from 'drizzle-orm';

const DISPLAY_ISSUES = JSON.stringify([
  'Cracked or Shattered Front Glass (Touch & OLED Working)',
  'Green Line / Vertical & Horizontal Display Lines',
  'OLED Black Screen / Blank Display Malfunction',
  'Touch Digitizer Not Responding / Ghost Touch',
  'Flickering, Pink Tint or Distorted Display',
  'TrueTone & Ambient Light Sensor Calibration Required',
  'Pressure Damage / Internal Display Bleed',
]);

async function run() {
  console.log('Seeding four main device categories and connected brands/models...');

  // 1. Device Categories
  const categoryData = [
    {
      name: 'Mobile',
      slug: 'mobile',
      tagline: 'Flagship Smartphone OLED & Display Specialists',
      description: 'Specialized display repairs for Apple, Samsung, OnePlus, Google Pixel, Vivo, Oppo, Xiaomi, and other flagship smartphones with original AMOLED panels and laser bonding.',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      icon: 'Smartphone',
      hasBrands: true,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'iPad',
      slug: 'ipad',
      tagline: 'Ultra Retina Tandem OLED & Liquid Retina XDR',
      description: 'Precision display repair, laminated digitizer restoration, and Apple Pencil sensitivity preservation for iPad Pro, iPad Air, iPad mini, and standard iPad generations.',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      icon: 'Tablet',
      hasBrands: false,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Apple Watch',
      slug: 'apple-watch',
      tagline: 'Sapphire Crystal & Retinal OLED Calibration',
      description: 'Micro-precision sapphire crystal touch glass refurbishing, OLED display repair, and Force Touch sensor calibration for Apple Watch Ultra, Series, and SE generations.',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
      icon: 'Watch',
      hasBrands: false,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'Tablet',
      slug: 'tablet',
      tagline: 'Flagship Large-Format AMOLED & Display Glass',
      description: 'Specialized large-screen display repairs for Samsung Galaxy Tab, OnePlus Pad, Xiaomi Pad, Lenovo Tab, and flagship tablet AMOLED panels.',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
      icon: 'Tablet',
      hasBrands: true,
      sortOrder: 4,
      isActive: true,
    },
  ];

  const catMap: Record<string, number> = {};

  for (const cat of categoryData) {
    const existing = await db.select().from(deviceCategories).where(eq(deviceCategories.slug, cat.slug)).limit(1);
    if (existing.length > 0) {
      await db.update(deviceCategories).set(cat).where(eq(deviceCategories.id, existing[0].id));
      catMap[cat.slug] = existing[0].id;
      console.log(`Updated category: ${cat.name} (id: ${existing[0].id})`);
    } else {
      const inserted = await db.insert(deviceCategories).values(cat).returning();
      catMap[cat.slug] = inserted[0].id;
      console.log(`Inserted category: ${cat.name} (id: ${inserted[0].id})`);
    }
  }

  // 2. Mobile Brands
  const mobileBrandsData = [
    {
      name: 'Apple',
      slug: 'apple',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Dedicated display repair solutions for Apple iPhone flagship devices with Super Retina XDR OLED panels, Ceramic Shield glass, and TrueTone calibration.',
      seoTitle: 'Apple iPhone Display Repair | QASWA TELECOM',
      seoDescription: 'Specialized display repairs for Apple iPhone models. Screen replacement, cracked glass, and green line fix.',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'Samsung',
      slug: 'samsung-mobile',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      description: 'Expert display repairs for Samsung Galaxy S-Series Dynamic AMOLED 2X, Z Fold, and Z Flip foldable panels.',
      seoTitle: 'Samsung Galaxy Display Repair | QASWA TELECOM',
      seoDescription: 'Specialized display repairs for Samsung Galaxy S24 Ultra, S23 Ultra, Z Fold, Z Flip. Green line repair and OLED glass replacement.',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'OnePlus',
      slug: 'oneplus',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_RGB_RED_copy.svg',
      description: 'Vertical green line elimination, 120Hz Fluid AMOLED restoration, and precision touch glass replacement for OnePlus flagships.',
      seoTitle: 'OnePlus Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Laser flex bonding green line repair and AMOLED screen repair for OnePlus 12, Open, 11, 10 Pro.',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'Google Pixel',
      slug: 'google-pixel',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      description: 'Precision display repair for Google Pixel Actua & Super Actua OLED screens, under-display fingerprint sensor alignment, and touch glass.',
      seoTitle: 'Google Pixel Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Dedicated display repairs for Google Pixel 9 Pro, 8 Pro, Fold, 7 Pro. Digitizer calibration and pristine OLED restoration.',
      sortOrder: 4,
      isActive: true,
    },
    {
      name: 'Vivo',
      slug: 'vivo',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png',
      description: 'Curved AMOLED screen repair and Zeiss optical display calibration for Vivo X-Series and Fold flagships.',
      seoTitle: 'Vivo Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Specialized display repairs for Vivo X100 Pro, X Fold 3 Pro, V30 Pro. Original AMOLED panel refurbishing.',
      sortOrder: 5,
      isActive: true,
    },
    {
      name: 'Oppo',
      slug: 'oppo',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
      description: 'Specialized OLED display repairs for Oppo Find X Series, Find N Foldables, and Reno Series.',
      seoTitle: 'Oppo Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Expert display solutions for Oppo Find X7 Ultra, Find N3, and Reno 12 Pro.',
      sortOrder: 6,
      isActive: true,
    },
    {
      name: 'Xiaomi',
      slug: 'xiaomi-mobile',
      categorySlug: 'mobile',
      categoryId: catMap['mobile'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
      description: 'Flagship 2K WQHD+ AMOLED display repair, ceramic screen glass replacement, and high-refresh display restoration.',
      seoTitle: 'Xiaomi Display Repair Specialists | QASWA TELECOM',
      seoDescription: 'Display repairs for Xiaomi 14 Ultra, 14, 13 Pro. Display glass and screen restoration.',
      sortOrder: 7,
      isActive: true,
    },
  ];

  // 3. Tablet Brands
  const tabletBrandsData = [
    {
      name: 'Samsung',
      slug: 'samsung-tablet',
      categorySlug: 'tablet',
      categoryId: catMap['tablet'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      description: 'Specialized large-format Dynamic AMOLED 2X display repairs for Samsung Galaxy Tab S10, S9 Ultra, and Plus models.',
      seoTitle: 'Samsung Galaxy Tab Display Repair | QASWA TELECOM',
      seoDescription: 'Expert display repairs for Samsung Galaxy Tab S10 Ultra, S9 Ultra, S8. Large glass OCA lamination.',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'OnePlus',
      slug: 'oneplus-tablet',
      categorySlug: 'tablet',
      categoryId: catMap['tablet'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1_Line_RGB_RED_copy.svg',
      description: 'High-refresh 3K ReadFit display repair and stylus touch digitizer replacement for OnePlus Pad 2 and OnePlus Pad.',
      seoTitle: 'OnePlus Pad Display Repair | QASWA TELECOM',
      seoDescription: 'Precision display and touch screen restoration for OnePlus Pad 2 and OnePlus Pad Go.',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Xiaomi',
      slug: 'xiaomi-tablet',
      categorySlug: 'tablet',
      categoryId: catMap['tablet'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
      description: '144Hz 3K display restoration, precision optical lamination, and touch digitizer repair for Xiaomi Pad 6S Pro and Pad 6.',
      seoTitle: 'Xiaomi Pad Display Repair | QASWA TELECOM',
      seoDescription: 'Specialized display repair for Xiaomi Pad 6S Pro 12.4, Xiaomi Pad 6, and Redmi Pad Pro.',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'Lenovo',
      slug: 'lenovo-tablet',
      categorySlug: 'tablet',
      categoryId: catMap['tablet'],
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg',
      description: 'Large-screen 3K OLED tablet display repair and optical bonding for Lenovo Tab P12 Pro and Legion Tab series.',
      seoTitle: 'Lenovo Tab Display Repair | QASWA TELECOM',
      seoDescription: 'Specialized display repair for Lenovo Tab P12 Pro, Legion Tab, and Tab M11.',
      sortOrder: 4,
      isActive: true,
    },
  ];

  const brandMap: Record<string, number> = {};

  const allBrandsToSeed = [...mobileBrandsData, ...tabletBrandsData];
  for (const b of allBrandsToSeed) {
    const existing = await db
      .select()
      .from(brands)
      .where(and(eq(brands.slug, b.slug), eq(brands.categorySlug, b.categorySlug)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(brands).set(b).where(eq(brands.id, existing[0].id));
      brandMap[b.slug] = existing[0].id;
      console.log(`Updated brand: ${b.name} (${b.slug}) (id: ${existing[0].id})`);
    } else {
      const inserted = await db.insert(brands).values(b).returning();
      brandMap[b.slug] = inserted[0].id;
      console.log(`Inserted brand: ${b.name} (${b.slug}) (id: ${inserted[0].id})`);
    }
  }

  // 4. Models to Seed
  // Structure:
  // - Category models (iPad, Apple Watch)
  // - Brand models (Mobile, Tablet)
  const modelsData: Array<{
    name: string;
    slug: string;
    series?: string;
    categorySlug: string;
    brandSlug?: string;
    imageUrl: string;
    description: string;
  }> = [
    // Mobile - Apple
    {
      name: 'iPhone 17 Pro Max',
      slug: 'iphone-17-pro-max',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      description: 'Flagship Super Retina XDR OLED display repair with Ceramic Shield, ProMotion 120Hz, and TrueTone sensor calibration.',
    },
    {
      name: 'iPhone 17 Pro',
      slug: 'iphone-17-pro',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      description: 'Super Retina XDR OLED screen replacement and outer glass refurbishing with original panel preservation.',
    },
    {
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
      description: 'Precision display repair for iPhone 16 Pro Max OLED panel, bezel glass lamination, and TrueTone restoration.',
    },
    {
      name: 'iPhone 16 Pro',
      slug: 'iphone-16-pro',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
      description: 'Expert display solutions for iPhone 16 Pro. Cracked glass refurbishing and OLED screen restoration.',
    },
    {
      name: 'iPhone 16 Plus',
      slug: 'iphone-16-plus',
      series: 'iPhone',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
      description: 'High-luminance Super Retina OLED display repair, touch digitizer replacement, and glass lamination.',
    },
    {
      name: 'iPhone 16',
      slug: 'iphone-16',
      series: 'iPhone',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
      description: 'Ceramic shield glass refurbishing and original OLED display repair for iPhone 16.',
    },
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80',
      description: 'Cleanroom display repair for iPhone 15 Pro Max. Glass separation, OCA lamination, and TrueTone sync.',
    },
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80',
      description: 'Specialized OLED and front glass repair for iPhone 15 Pro.',
    },
    {
      name: 'iPhone 14 Pro Max',
      slug: 'iphone-14-pro-max',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
      description: 'Dynamic Island OLED repair and front touch glass refurbishing for iPhone 14 Pro Max.',
    },
    {
      name: 'iPhone 13 Pro Max',
      slug: 'iphone-13-pro-max',
      series: 'iPhone Pro',
      categorySlug: 'mobile',
      brandSlug: 'apple',
      imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
      description: 'White screen and green screen flex bonding laser repair, 120Hz ProMotion display restoration.',
    },

    // Mobile - Samsung
    {
      name: 'Galaxy S24 Ultra',
      slug: 'galaxy-s24-ultra',
      series: 'Galaxy S',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      description: 'Corning Gorilla Armor flat Dynamic AMOLED 2X display repair with anti-reflective optical glass bonding.',
    },
    {
      name: 'Galaxy S24+',
      slug: 'galaxy-s24-plus',
      series: 'Galaxy S',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      description: 'Dynamic AMOLED 2X QHD+ screen replacement and cracked glass restoration for Galaxy S24+.',
    },
    {
      name: 'Galaxy S24',
      slug: 'galaxy-s24',
      series: 'Galaxy S',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      description: 'Compact flagship AMOLED display repair, touch digitizer calibration, and original panel restoration.',
    },
    {
      name: 'Galaxy S23 Ultra',
      slug: 'galaxy-s23-ultra',
      series: 'Galaxy S',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      description: 'Curved edge Dynamic AMOLED 2X display glass repair and green line vertical laser repair.',
    },
    {
      name: 'Galaxy Z Fold 6',
      slug: 'galaxy-z-fold-6',
      series: 'Galaxy Z Fold',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Foldable Ultra Thin Glass (UTG) inner screen repair, hinge crease calibration, and cover AMOLED screen replacement.',
    },
    {
      name: 'Galaxy Z Fold 5',
      slug: 'galaxy-z-fold-5',
      series: 'Galaxy Z Fold',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Inner 7.6-inch folding display restoration and zero-gap hinge flex cable display repair.',
    },
    {
      name: 'Galaxy Z Flip 6',
      slug: 'galaxy-z-flip-6',
      series: 'Galaxy Z Flip',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Flex Window cover screen and internal foldable Dynamic AMOLED display repair.',
    },
    {
      name: 'Galaxy Z Flip 5',
      slug: 'galaxy-z-flip-5',
      series: 'Galaxy Z Flip',
      categorySlug: 'mobile',
      brandSlug: 'samsung-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Folding glass display repair and black screen malfunction fix for Galaxy Z Flip 5.',
    },

    // Mobile - OnePlus
    {
      name: 'OnePlus 12',
      slug: 'oneplus-12',
      series: 'OnePlus Flagship',
      categorySlug: 'mobile',
      brandSlug: 'oneplus',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: '2K 120Hz ProXDR Fluid AMOLED screen restoration, Aqua Touch calibration, and vertical green line fix.',
    },
    {
      name: 'OnePlus 12R',
      slug: 'oneplus-12r',
      series: 'OnePlus Flagship',
      categorySlug: 'mobile',
      brandSlug: 'oneplus',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: '4th-gen LTPO AMOLED display repair and front glass refurbishing.',
    },
    {
      name: 'OnePlus Open',
      slug: 'oneplus-open',
      series: 'OnePlus Foldable',
      categorySlug: 'mobile',
      brandSlug: 'oneplus',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Dual ProXDR folding display repair, ultra-thin glass lamination, and hinge display alignment.',
    },
    {
      name: 'OnePlus 11 5G',
      slug: 'oneplus-11-5g',
      series: 'OnePlus Flagship',
      categorySlug: 'mobile',
      brandSlug: 'oneplus',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: 'Vertical green line laser bonding repair and curved AMOLED front glass replacement.',
    },
    {
      name: 'OnePlus 10 Pro',
      slug: 'oneplus-10-pro',
      series: 'OnePlus Flagship',
      categorySlug: 'mobile',
      brandSlug: 'oneplus',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: 'Curved 3D touch glass replacement and green screen issue repair for OnePlus 10 Pro.',
    },

    // Mobile - Google Pixel
    {
      name: 'Pixel 9 Pro Fold',
      slug: 'pixel-9-pro-fold',
      series: 'Pixel Foldable',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Super Actua Flex foldable OLED display repair, outer screen lamination, and crease alignment.',
    },
    {
      name: 'Pixel 9 Pro XL',
      slug: 'pixel-9-pro-xl',
      series: 'Pixel Pro',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Super Actua LTPO OLED screen replacement with optical fingerprint recalibration.',
    },
    {
      name: 'Pixel 9 Pro',
      slug: 'pixel-9-pro',
      series: 'Pixel Pro',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Precision display repair and ultrasonic touch glass bonding for Pixel 9 Pro.',
    },
    {
      name: 'Pixel 9',
      slug: 'pixel-9',
      series: 'Pixel',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Actua OLED display glass replacement and original panel refurbishing.',
    },
    {
      name: 'Pixel 8 Pro',
      slug: 'pixel-8-pro',
      series: 'Pixel Pro',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Super Actua OLED display repair, green screen fix, and touch digitizer restoration.',
    },
    {
      name: 'Pixel 8',
      slug: 'pixel-8',
      series: 'Pixel',
      categorySlug: 'mobile',
      brandSlug: 'google-pixel',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      description: 'Actua OLED screen repair and under-display fingerprint optical alignment.',
    },

    // Mobile - Vivo
    {
      name: 'Vivo X100 Pro',
      slug: 'vivo-x100-pro',
      series: 'Vivo X',
      categorySlug: 'mobile',
      brandSlug: 'vivo',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      description: '8T LTPO curved AMOLED display repair and front optical glass lamination for Vivo X100 Pro.',
    },
    {
      name: 'Vivo X100',
      slug: 'vivo-x100',
      series: 'Vivo X',
      categorySlug: 'mobile',
      brandSlug: 'vivo',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      description: 'Curved AMOLED screen repair and touch glass refurbishing for Vivo X100.',
    },
    {
      name: 'Vivo X Fold 3 Pro',
      slug: 'vivo-x-fold-3-pro',
      series: 'Vivo Foldable',
      categorySlug: 'mobile',
      brandSlug: 'vivo',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Armor Glass outer display and UTG folding inner AMOLED screen repair for Vivo X Fold 3 Pro.',
    },
    {
      name: 'Vivo V30 Pro',
      slug: 'vivo-v30-pro',
      series: 'Vivo V',
      categorySlug: 'mobile',
      brandSlug: 'vivo',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      description: '3D curved AMOLED display replacement and glass refurbishing for Vivo V30 Pro.',
    },

    // Mobile - Oppo
    {
      name: 'Find X7 Ultra',
      slug: 'oppo-find-x7-ultra',
      series: 'Oppo Find',
      categorySlug: 'mobile',
      brandSlug: 'oppo',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: 'Quad HD+ LTPO curved display repair and high-luminance AMOLED panel restoration.',
    },
    {
      name: 'Find N3 Flip',
      slug: 'oppo-find-n3-flip',
      series: 'Oppo Foldable',
      categorySlug: 'mobile',
      brandSlug: 'oppo',
      imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
      description: 'Vertical cover screen and inner folding AMOLED display repair for Oppo Find N3 Flip.',
    },
    {
      name: 'Reno 12 Pro',
      slug: 'oppo-reno-12-pro',
      series: 'Oppo Reno',
      categorySlug: 'mobile',
      brandSlug: 'oppo',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
      description: 'Infinite View curved OLED display repair and splash touch sensitivity calibration.',
    },

    // Mobile - Xiaomi
    {
      name: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      series: 'Xiaomi Flagship',
      categorySlug: 'mobile',
      brandSlug: 'xiaomi-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&q=80',
      description: 'Xiaomi Shield Glass curved AMOLED display repair and C8 luminescent panel replacement.',
    },
    {
      name: 'Xiaomi 14',
      slug: 'xiaomi-14',
      series: 'Xiaomi Flagship',
      categorySlug: 'mobile',
      brandSlug: 'xiaomi-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&q=80',
      description: 'Ultra-thin bezel LTPO OLED screen replacement and touch digitizer calibration.',
    },
    {
      name: 'Xiaomi 13 Pro',
      slug: 'xiaomi-13-pro',
      series: 'Xiaomi Flagship',
      categorySlug: 'mobile',
      brandSlug: 'xiaomi-mobile',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&q=80',
      description: '2K curved AMOLED screen repair and vertical line laser repair for Xiaomi 13 Pro.',
    },

    // iPad Models (Direct Category)
    {
      name: 'iPad Pro 13-inch (M4 Tandem OLED)',
      slug: 'ipad-pro-13-inch-m4',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Breakthrough Ultra Retina Tandem OLED display repair, nano-texture glass lamination, and Apple Pencil Pro sensitivity restoration.',
    },
    {
      name: 'iPad Pro 11-inch (M4 Tandem OLED)',
      slug: 'ipad-pro-11-inch-m4',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Ultra Retina Tandem OLED display restoration and laminated digitizer glass repair.',
    },
    {
      name: 'iPad Pro 12.9-inch (M2 Liquid Retina XDR)',
      slug: 'ipad-pro-12-9-inch-m2',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Mini-LED Liquid Retina XDR screen replacement, 10,000 local dimming zone calibration, and touch glass bonding.',
    },
    {
      name: 'iPad Pro 11-inch (M2 Liquid Retina)',
      slug: 'ipad-pro-11-inch-m2',
      series: 'iPad Pro',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: '120Hz ProMotion Liquid Retina display repair and laminated touch digitizer replacement.',
    },
    {
      name: 'iPad Air 13-inch (M2)',
      slug: 'ipad-air-13-inch-m2',
      series: 'iPad Air',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '13-inch Liquid Retina display glass refurbishing and TrueTone optical calibration.',
    },
    {
      name: 'iPad Air 11-inch (M2)',
      slug: 'ipad-air-11-inch-m2',
      series: 'iPad Air',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: 'Fully laminated Liquid Retina display repair with anti-reflective coating.',
    },
    {
      name: 'iPad mini (7th Gen / A17 Pro)',
      slug: 'ipad-mini-7th-gen',
      series: 'iPad mini',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: 'Liquid Retina display glass replacement, jelly scroll elimination, and Apple Pencil Pro sync.',
    },
    {
      name: 'iPad mini (6th Gen)',
      slug: 'ipad-mini-6th-gen',
      series: 'iPad mini',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      description: '8.3-inch Liquid Retina display repair and front glass refurbishing for iPad mini 6.',
    },
    {
      name: 'iPad (10th Gen)',
      slug: 'ipad-10th-gen',
      series: 'iPad',
      categorySlug: 'ipad',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '10.9-inch Liquid Retina display and separate touch digitizer glass replacement.',
    },

    // Apple Watch Models (Direct Category)
    {
      name: 'Apple Watch Ultra 3',
      slug: 'apple-watch-ultra-3',
      series: 'Apple Watch Ultra',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Micro-precision sapphire crystal flat screen replacement, 3000-nit LTPO OLED calibration, and water-resistance seal restoration.',
    },
    {
      name: 'Apple Watch Ultra 2',
      slug: 'apple-watch-ultra-2',
      series: 'Apple Watch Ultra',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Sapphire crystal glass refurbishing and 3000-nit OLED display repair for Apple Watch Ultra 2.',
    },
    {
      name: 'Apple Watch Ultra',
      slug: 'apple-watch-ultra',
      series: 'Apple Watch Ultra',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Original sapphire crystal front glass replacement and touch digitizer repair.',
    },
    {
      name: 'Apple Watch Series 10',
      slug: 'apple-watch-series-10',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: 'Wide-angle OLED curved panel display repair and Ion-X / sapphire glass refurbishing.',
    },
    {
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: '2000-nit edge-to-edge curved OLED screen replacement and Force Touch calibration.',
    },
    {
      name: 'Apple Watch Series 8',
      slug: 'apple-watch-series-8',
      series: 'Apple Watch Series',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
      description: 'Curved OLED screen repair and crack touch glass refurbishing for Apple Watch Series 8.',
    },
    {
      name: 'Apple Watch SE (2nd Gen)',
      slug: 'apple-watch-se-2nd-gen',
      series: 'Apple Watch SE',
      categorySlug: 'apple-watch',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
      description: 'Retina OLED screen replacement and Ion-X front glass repair for Apple Watch SE.',
    },

    // Tablet - Samsung
    {
      name: 'Galaxy Tab S10 Ultra',
      slug: 'galaxy-tab-s10-ultra',
      series: 'Galaxy Tab S',
      categorySlug: 'tablet',
      brandSlug: 'samsung-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: 'Massive 14.6-inch Dynamic AMOLED 2X display repair with anti-reflective glass and S-Pen latency calibration.',
    },
    {
      name: 'Galaxy Tab S10+',
      slug: 'galaxy-tab-s10-plus',
      series: 'Galaxy Tab S',
      categorySlug: 'tablet',
      brandSlug: 'samsung-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.4-inch Dynamic AMOLED 2X display restoration and touch digitizer replacement.',
    },
    {
      name: 'Galaxy Tab S9 Ultra',
      slug: 'galaxy-tab-s9-ultra',
      series: 'Galaxy Tab S',
      categorySlug: 'tablet',
      brandSlug: 'samsung-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: 'Optical autoclave OCA lamination and AMOLED screen replacement for Tab S9 Ultra.',
    },
    {
      name: 'Galaxy Tab S9+',
      slug: 'galaxy-tab-s9-plus',
      series: 'Galaxy Tab S',
      categorySlug: 'tablet',
      brandSlug: 'samsung-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.4-inch AMOLED display glass refurbishing and digitizer repair.',
    },
    {
      name: 'Galaxy Tab S9 FE',
      slug: 'galaxy-tab-s9-fe',
      series: 'Galaxy Tab FE',
      categorySlug: 'tablet',
      brandSlug: 'samsung-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '90Hz LCD screen repair, touch glass lamination, and S-Pen sensor restoration.',
    },

    // Tablet - OnePlus
    {
      name: 'OnePlus Pad 2',
      slug: 'oneplus-pad-2',
      series: 'OnePlus Pad',
      categorySlug: 'tablet',
      brandSlug: 'oneplus-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.1-inch 3K 144Hz ReadFit display repair and stylus touch digitizer replacement.',
    },
    {
      name: 'OnePlus Pad',
      slug: 'oneplus-pad',
      series: 'OnePlus Pad',
      categorySlug: 'tablet',
      brandSlug: 'oneplus-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '7:5 ratio 144Hz display glass refurbishing and screen replacement.',
    },
    {
      name: 'OnePlus Pad Go',
      slug: 'oneplus-pad-go',
      series: 'OnePlus Pad',
      categorySlug: 'tablet',
      brandSlug: 'oneplus-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '2.4K eye-care display repair and touch panel restoration for OnePlus Pad Go.',
    },

    // Tablet - Xiaomi
    {
      name: 'Xiaomi Pad 6S Pro 12.4',
      slug: 'xiaomi-pad-6s-pro',
      series: 'Xiaomi Pad',
      categorySlug: 'tablet',
      brandSlug: 'xiaomi-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.4-inch 3K 144Hz 3:2 display repair with Corning Gorilla Glass 5 lamination.',
    },
    {
      name: 'Xiaomi Pad 6',
      slug: 'xiaomi-pad-6',
      series: 'Xiaomi Pad',
      categorySlug: 'tablet',
      brandSlug: 'xiaomi-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: 'WQHD+ 144Hz display repair and Smart Pen touch digitizer calibration.',
    },
    {
      name: 'Redmi Pad Pro',
      slug: 'redmi-pad-pro',
      series: 'Redmi Pad',
      categorySlug: 'tablet',
      brandSlug: 'xiaomi-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.1-inch 2.5K 120Hz large display repair and touch glass replacement.',
    },

    // Tablet - Lenovo
    {
      name: 'Lenovo Tab P12 Pro',
      slug: 'lenovo-tab-p12-pro',
      series: 'Lenovo Tab',
      categorySlug: 'tablet',
      brandSlug: 'lenovo-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '12.6-inch 2K AMOLED 120Hz display repair, Precision Pen 3 sync, and optical bonding.',
    },
    {
      name: 'Lenovo Legion Tab',
      slug: 'lenovo-legion-tab',
      series: 'Lenovo Legion',
      categorySlug: 'tablet',
      brandSlug: 'lenovo-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '8.8-inch QHD+ 144Hz gaming tablet display repair and bypass touch glass calibration.',
    },
    {
      name: 'Lenovo Tab M11',
      slug: 'lenovo-tab-m11',
      series: 'Lenovo Tab',
      categorySlug: 'tablet',
      brandSlug: 'lenovo-tablet',
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
      description: '11-inch 90Hz WUXGA display repair and touch digitizer refurbishing.',
    },
  ];

  // Get all active display services for linking
  const activeServices = await db.select().from(services).where(eq(services.isActive, true));

  let sortOrderCounter = 1;
  for (const m of modelsData) {
    const catId = catMap[m.categorySlug];
    const brId = m.brandSlug ? brandMap[m.brandSlug] : null;

    const modelRecord = {
      name: m.name,
      slug: m.slug,
      series: m.series || null,
      categorySlug: m.categorySlug,
      categoryId: catId,
      brandId: brId,
      imageUrl: m.imageUrl,
      description: m.description,
      displayIssues: DISPLAY_ISSUES,
      seoTitle: `${m.name} Display Repair Specialists | QASWA TELECOM`,
      seoDescription: `Dedicated display repair solutions for ${m.name}. Screen replacement, cracked glass, green line fix, and touch digitizer restoration.`,
      isActive: true,
      sortOrder: sortOrderCounter++,
    };

    const existing = await db.select().from(models).where(eq(models.slug, m.slug)).limit(1);
    let currentModelId: number;

    if (existing.length > 0) {
      await db.update(models).set(modelRecord).where(eq(models.id, existing[0].id));
      currentModelId = existing[0].id;
      console.log(`Updated model: ${m.name} (${m.slug})`);
    } else {
      const inserted = await db.insert(models).values(modelRecord).returning();
      currentModelId = inserted[0].id;
      console.log(`Inserted model: ${m.name} (${m.slug})`);
    }

    // Link all active display repair services to this model
    for (const serv of activeServices) {
      const existingLink = await db
        .select()
        .from(modelServices)
        .where(and(eq(modelServices.modelId, currentModelId), eq(modelServices.serviceId, serv.id)))
        .limit(1);

      if (existingLink.length === 0) {
        await db.insert(modelServices).values({
          modelId: currentModelId,
          serviceId: serv.id,
          customPrice: null,
          isActive: true,
        });
      }
    }
  }

  console.log('Migration and seeding completed successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
