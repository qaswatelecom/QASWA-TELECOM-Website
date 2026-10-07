import { Request, Response } from 'express';
import { db } from '../db/index.ts';
import {
  deviceCategories,
  brands,
  models,
  services,
  blogs,
  customPages,
  siteSettings,
} from '../db/schema.ts';
import { eq, and, sql } from 'drizzle-orm';

export async function getProductionBaseUrl(req: Request): Promise<string> {
  try {
    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'SITE_URL'))
      .limit(1);

    if (setting[0]?.value) {
      return setting[0].value.replace(/\/$/, '');
    }
  } catch (e) {
    // ignore
  }

  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }

  const host = req.get('host');
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  if (host && !host.includes('localhost') && !host.includes('0.0.0.0')) {
    return `${protocol}://${host}`;
  }

  return 'https://qaswatelecom.com';
}

export async function handleSitemapXml(req: Request, res: Response) {
  try {
    const baseUrl = await getProductionBaseUrl(req);
    const currentDate = new Date().toISOString().split('T')[0];

    const [allCategories, allBrands, allModels, allServices, allBlogs, allPages] =
      await Promise.all([
        db
          .select({ slug: deviceCategories.slug })
          .from(deviceCategories)
          .where(eq(deviceCategories.isActive, true)),
        db
          .select({ slug: brands.slug, name: brands.name, categorySlug: brands.categorySlug })
          .from(brands)
          .where(eq(brands.isActive, true)),
        db
          .select({ slug: models.slug, categorySlug: models.categorySlug })
          .from(models)
          .where(eq(models.isActive, true)),
        db
          .select({ slug: services.slug })
          .from(services)
          .where(eq(services.isActive, true)),
        db
          .select({ slug: blogs.slug, updatedAt: blogs.updatedAt })
          .from(blogs)
          .where(eq(blogs.status, 'published')),
        db
          .select({ slug: customPages.slug, updatedAt: customPages.updatedAt })
          .from(customPages)
          .where(eq(customPages.isPublished, true)),
      ]);

    const urlList: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [
      // 1. Core Homepage
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: currentDate },

      // 2. Primary Device Categories
      { loc: `${baseUrl}/categories/mobile`, priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/categories/ipad`, priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/categories/apple-watch`, priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/categories/tablet`, priority: '0.9', changefreq: 'weekly', lastmod: currentDate },

      // 3. Core Informational & Service Landing Pages
      { loc: `${baseUrl}/brands`, priority: '0.85', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/services`, priority: '0.85', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/contact`, priority: '0.85', changefreq: 'monthly', lastmod: currentDate },
      { loc: `${baseUrl}/about`, priority: '0.80', changefreq: 'monthly', lastmod: currentDate },
      { loc: `${baseUrl}/faqs`, priority: '0.80', changefreq: 'weekly', lastmod: currentDate },
      { loc: `${baseUrl}/blogs`, priority: '0.75', changefreq: 'daily', lastmod: currentDate },
      { loc: `${baseUrl}/gallery`, priority: '0.70', changefreq: 'monthly', lastmod: currentDate },
      { loc: `${baseUrl}/testimonials`, priority: '0.70', changefreq: 'monthly', lastmod: currentDate },
      { loc: `${baseUrl}/terms`, priority: '0.40', changefreq: 'yearly', lastmod: currentDate },
    ];

    // Additional active categories from DB if not already added
    allCategories.forEach((c) => {
      const path = `${baseUrl}/categories/${c.slug}`;
      if (!urlList.some((u) => u.loc === path)) {
        urlList.push({ loc: path, priority: '0.9', changefreq: 'weekly', lastmod: currentDate });
      }
    });

    // Brand Landing Pages (Organized by category)
    allBrands.forEach((b) => {
      const catSlug = b.categorySlug || 'mobile';
      const bSlugLower = (b.slug || '').toLowerCase();
      const bNameLower = (b.name || '').toLowerCase();
      const targetBrandSlug =
        bSlugLower === 'apple' || bSlugLower === 'iphone' || bNameLower === 'apple'
          ? 'apple-iphone'
          : b.slug;

      urlList.push({
        loc: `${baseUrl}/repair-models/${catSlug}/${targetBrandSlug}`,
        priority: '0.90',
        changefreq: 'weekly',
        lastmod: currentDate,
      });
      urlList.push({
        loc: `${baseUrl}/categories/${catSlug}/${b.slug}`,
        priority: '0.85',
        changefreq: 'weekly',
        lastmod: currentDate,
      });
      // Also alias /brands/:slug
      if (catSlug === 'mobile') {
        urlList.push({
          loc: `${baseUrl}/brands/${b.slug}`,
          priority: '0.80',
          changefreq: 'weekly',
          lastmod: currentDate,
        });
      }
    });

    // Dedicated Model Display Repair Pages
    allModels.forEach((m) => {
      urlList.push({
        loc: `${baseUrl}/repair/${m.slug}`,
        priority: '0.85',
        changefreq: 'weekly',
        lastmod: currentDate,
      });
      urlList.push({
        loc: `${baseUrl}/models/${m.slug}`,
        priority: '0.80',
        changefreq: 'weekly',
        lastmod: currentDate,
      });
    });

    // Display Repair Service Pages
    allServices.forEach((s) => {
      urlList.push({
        loc: `${baseUrl}/services/${s.slug}`,
        priority: '0.75',
        changefreq: 'weekly',
        lastmod: currentDate,
      });
    });

    // Published Blog Articles
    allBlogs.forEach((b) => {
      const modDate = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : currentDate;
      urlList.push({
        loc: `${baseUrl}/blogs/${b.slug}`,
        priority: '0.70',
        changefreq: 'weekly',
        lastmod: modDate,
      });
    });

    // Published Custom Pages
    allPages.forEach((p) => {
      const modDate = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : currentDate;
      urlList.push({
        loc: `${baseUrl}/${p.slug}`,
        priority: '0.60',
        changefreq: 'monthly',
        lastmod: modDate,
      });
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urlList.forEach((item) => {
      xml += `  <url>\n`;
      xml += `    <loc>${item.loc}</loc>\n`;
      if (item.lastmod) xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}

export async function handleRobotsTxt(req: Request, res: Response) {
  try {
    const baseUrl = await getProductionBaseUrl(req);
    const txt = [
      '# QASWA TELECOM Robots Directives',
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /admin/',
      'Disallow: /api/',
      'Allow: /api/sitemap.xml',
      'Allow: /api/robots.txt',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
      '',
    ].join('\n');

    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=86400');
    res.send(txt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('User-agent: *\nAllow: /\n');
  }
}
