import { db } from './index.ts';
import { deviceCategories, brands, models, services, modelServices } from './schema.ts';
import { eq, and } from 'drizzle-orm';

const DISPLAY_ISSUES = JSON.stringify([
  'Display Damaged (Broken / Cracked Screen)',
  'Touch Glass Broken (OLED Panel Working)',
  'Green Screen / White Screen / Blank Display',
  'Green & Pink Vertical Lines Laser Repair',
  'Touch Digitizer Not Responding / Ghost Touch',
  'Display Flickering & Tint Malfunction',
]);

export async function ensureCoreDeviceCategories() {
  try {
    // 1. Core Device Categories
    const categoryData = [
      {
        name: 'Mobile',
        slug: 'mobile',
        tagline: 'Flagship Smartphone OLED & Display Specialists',
        description:
          'Specialized display repairs for Apple iPhone, Samsung Galaxy, Google Pixel, OnePlus, Vivo, Oppo, Xiaomi, and other flagship smartphones with original AMOLED panels and laser bonding.',
        imageUrl:
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
        icon: 'Smartphone',
        hasBrands: true,
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'iPad',
        slug: 'ipad',
        tagline: 'Ultra Retina Tandem OLED & Liquid Retina XDR',
        description:
          'Precision display repair, laminated digitizer restoration, and Apple Pencil sensitivity preservation for iPad Pro, iPad Air, iPad mini, and standard iPad generations.',
        imageUrl:
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
        icon: 'Tablet',
        hasBrands: false,
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Apple Watch',
        slug: 'apple-watch',
        tagline: 'Sapphire Crystal & Retinal OLED Calibration',
        description:
          'Micro-precision sapphire crystal touch glass refurbishing, OLED display repair, and Force Touch sensor calibration for Apple Watch Ultra, Series, and SE generations.',
        imageUrl:
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
        icon: 'Watch',
        hasBrands: false,
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Tablet',
        slug: 'tablet',
        tagline: 'Flagship Large-Format AMOLED & Display Glass',
        description:
          'Specialized large-screen display repairs for Samsung Galaxy Tab, OnePlus Pad, Xiaomi Pad, Lenovo Tab, and flagship tablet AMOLED panels.',
        imageUrl:
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
        icon: 'Tablet',
        hasBrands: true,
        sortOrder: 4,
        isActive: true,
      },
    ];

    const catMap: Record<string, number> = {};

    for (const cat of categoryData) {
      const existing = await db
        .select()
        .from(deviceCategories)
        .where(eq(deviceCategories.slug, cat.slug))
        .limit(1);

      if (existing.length > 0) {
        catMap[cat.slug] = existing[0].id;
      } else {
        const inserted = await db.insert(deviceCategories).values(cat).returning();
        catMap[cat.slug] = inserted[0].id;
      }
    }

    // 2. Ensure iPad and Apple Watch models exist
    const directModels = [
      // iPad Models
      {
        name: 'iPad Pro 13-inch (M4 Tandem OLED)',
        slug: 'ipad-pro-13-inch-m4',
        series: 'iPad Pro',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: 'Ultra Retina Tandem OLED display repair and glass refurbishing.',
      },
      {
        name: 'iPad Pro 11-inch (M4 Tandem OLED)',
        slug: 'ipad-pro-11-inch-m4',
        series: 'iPad Pro',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: 'Ultra Retina Tandem OLED display restoration.',
      },
      {
        name: 'iPad Pro 12.9-inch (M2 Liquid Retina XDR)',
        slug: 'ipad-pro-12-9-inch-m2',
        series: 'iPad Pro',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: 'Mini-LED Liquid Retina XDR screen replacement and touch glass bonding.',
      },
      {
        name: 'iPad Pro 11-inch (M2 Liquid Retina)',
        slug: 'ipad-pro-11-inch-m2',
        series: 'iPad Pro',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: '120Hz ProMotion Liquid Retina display repair.',
      },
      {
        name: 'iPad Air 13-inch (M2)',
        slug: 'ipad-air-13-inch-m2',
        series: 'iPad Air',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
        description: '13-inch Liquid Retina display glass refurbishing.',
      },
      {
        name: 'iPad Air 11-inch (M2)',
        slug: 'ipad-air-11-inch-m2',
        series: 'iPad Air',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
        description: 'Fully laminated Liquid Retina display repair.',
      },
      {
        name: 'iPad mini (7th Gen / A17 Pro)',
        slug: 'ipad-mini-7th-gen',
        series: 'iPad mini',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: 'Liquid Retina display glass replacement and TrueTone calibration.',
      },
      {
        name: 'iPad mini (6th Gen)',
        slug: 'ipad-mini-6th-gen',
        series: 'iPad mini',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: '8.3-inch Liquid Retina display repair.',
      },
      {
        name: 'iPad (10th Gen)',
        slug: 'ipad-10th-gen',
        series: 'iPad',
        categorySlug: 'ipad',
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
        description: '10.9-inch display and touch digitizer glass replacement.',
      },

      // Apple Watch Models
      {
        name: 'Apple Watch Ultra 3',
        slug: 'apple-watch-ultra-3',
        series: 'Apple Watch Ultra',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
        description: 'Sapphire crystal screen replacement and 3000-nit OLED display calibration.',
      },
      {
        name: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        series: 'Apple Watch Ultra',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
        description: 'Sapphire crystal glass refurbishing and OLED display repair.',
      },
      {
        name: 'Apple Watch Ultra',
        slug: 'apple-watch-ultra',
        series: 'Apple Watch Ultra',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
        description: 'Original sapphire crystal front glass replacement.',
      },
      {
        name: 'Apple Watch Series 10',
        slug: 'apple-watch-series-10',
        series: 'Apple Watch Series',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
        description: 'Wide-angle OLED curved panel display repair.',
      },
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        series: 'Apple Watch Series',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
        description: '2000-nit edge-to-edge curved OLED screen replacement.',
      },
      {
        name: 'Apple Watch Series 8',
        slug: 'apple-watch-series-8',
        series: 'Apple Watch Series',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
        description: 'Curved OLED screen repair and touch glass refurbishing.',
      },
      {
        name: 'Apple Watch SE (2nd Gen)',
        slug: 'apple-watch-se-2nd-gen',
        series: 'Apple Watch SE',
        categorySlug: 'apple-watch',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
        description: 'Retina OLED screen replacement and Ion-X front glass repair.',
      },
    ];

    for (const m of directModels) {
      const existing = await db.select().from(models).where(eq(models.slug, m.slug)).limit(1);
      if (existing.length === 0) {
        await db.insert(models).values({
          name: m.name,
          slug: m.slug,
          series: m.series,
          categorySlug: m.categorySlug,
          categoryId: catMap[m.categorySlug] || null,
          imageUrl: m.imageUrl,
          description: m.description,
          displayIssues: DISPLAY_ISSUES,
          seoTitle: `${m.name} Display Repair Specialists | QASWA TELECOM`,
          seoDescription: `Dedicated display repair solutions for ${m.name}.`,
          isActive: true,
          sortOrder: 1,
        });
      }
    }
  } catch (err) {
    console.error('ensureCoreDeviceCategories error:', err);
  }
}
