import { Router, Request, Response } from 'express';
import { db } from '../db/index.ts';
import {
  deviceCategories,
  brands,
  models,
  services,
  modelServices,
  orders,
  customers,
  orderStatuses,
  customerFormFields,
  serviceCenters,
  cmsSections,
  blogs,
  faqs,
  testimonials,
  customPages,
  mediaItems,
  galleryItems,
  siteSettings,
  users,
  customerEnquiries,
} from '../db/schema.ts';
import { eq, desc, asc, sql, and, like, or, ilike } from 'drizzle-orm';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { ensureDatabaseSchema } from '../db/initDb.ts';
import { DEFAULT_PAGE_SEO_MAP, getSchemaTemplate } from '../lib/seo.ts';
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_CONTACT_CONTENT,
} from '../lib/pageContent.ts';

export const apiRouter = Router();

// Auto-initialize tables and seed on first request or startup
let hasInitializedDb = false;
apiRouter.use(async (_req, _res, next) => {
  if (!hasInitializedDb) {
    hasInitializedDb = true;
    try {
      await ensureDatabaseSchema();
    } catch (e) {
      console.error('Database schema initialization failed:', e);
    }
  }
  next();
});

// Helper to get site setting
async function getSetting(key: string, defaultValue: string = ''): Promise<string> {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    return res[0]?.value || defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Global bootstrap config (Site settings, categories, active brands, services, form fields)
apiRouter.get('/public/bootstrap', async (_req: Request, res: Response) => {
  try {
    const [allSettings, allCategories, allBrands, allServices, allFormFields, allStatuses] = await Promise.all([
      db.select().from(siteSettings),
      db.select().from(deviceCategories).where(eq(deviceCategories.isActive, true)).orderBy(asc(deviceCategories.sortOrder)),
      db.select().from(brands).where(eq(brands.isActive, true)).orderBy(asc(brands.sortOrder), asc(brands.name)),
      db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.sortOrder), asc(services.name)),
      db.select().from(customerFormFields).where(eq(customerFormFields.isEnabled, true)).orderBy(asc(customerFormFields.sortOrder)),
      db.select().from(orderStatuses).where(eq(orderStatuses.isActive, true)).orderBy(asc(orderStatuses.sortOrder)),
    ]);

    const settingsMap: Record<string, string> = {};
    allSettings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json({
      settings: settingsMap,
      categories: allCategories,
      brands: allBrands,
      services: allServices,
      formFields: allFormFields,
      orderStatuses: allStatuses,
    });
  } catch (error: any) {
    console.error('Failed to fetch bootstrap data:', error);
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Device Categories
apiRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(deviceCategories)
      .where(eq(deviceCategories.isActive, true))
      .orderBy(asc(deviceCategories.sortOrder), asc(deviceCategories.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Category detail: returns category, brands (if category hasBrands), and models (if no brands or all category models)
apiRouter.get('/categories/:slug', async (req: Request, res: Response) => {
  try {
    const cat = await db
      .select()
      .from(deviceCategories)
      .where(eq(deviceCategories.slug, req.params.slug))
      .limit(1);

    if (!cat[0]) return res.status(404).json({ error: 'Device category not found' });
    const category = cat[0];

    // Brands under this category
    const categoryBrands = await db
      .select()
      .from(brands)
      .where(
        and(
          or(eq(brands.categorySlug, category.slug), eq(brands.categoryId, category.id)),
          eq(brands.isActive, true)
        )
      )
      .orderBy(asc(brands.sortOrder), asc(brands.name));

    // Models under this category
    const categoryModels = await db
      .select()
      .from(models)
      .where(
        and(
          or(eq(models.categorySlug, category.slug), eq(models.categoryId, category.id)),
          eq(models.isActive, true)
        )
      )
      .orderBy(asc(models.sortOrder), asc(models.name));

    res.json({
      category,
      brands: categoryBrands,
      models: categoryModels,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch category details' });
  }
});

// Category brands
apiRouter.get('/categories/:categorySlug/brands', async (req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(brands)
      .where(and(eq(brands.categorySlug, req.params.categorySlug), eq(brands.isActive, true)))
      .orderBy(asc(brands.sortOrder), asc(brands.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brands for category' });
  }
});

// Brand detail in a category
apiRouter.get('/categories/:categorySlug/brands/:brandSlug', async (req: Request, res: Response) => {
  try {
    const categorySlug = req.params.categorySlug || 'mobile';
    const brandSlug = req.params.brandSlug;

    // Look up brand in this specific category, with alias flexibility (e.g. samsung / samsung-mobile, apple / iphone)
    const brand = await db
      .select()
      .from(brands)
      .where(
        and(
          eq(brands.categorySlug, categorySlug),
          or(
            eq(brands.slug, brandSlug),
            eq(brands.slug, `${brandSlug}-mobile`),
            eq(brands.slug, `${brandSlug}-tablet`),
            eq(brands.slug, brandSlug.replace('-mobile', '').replace('-tablet', '')),
            ilike(brands.name, brandSlug)
          )
        )
      )
      .limit(1);

    if (!brand[0]) return res.status(404).json({ error: 'Brand not found' });

    // STRICTLY query models belonging to this brand AND this specific categorySlug
    const brandModels = await db
      .select()
      .from(models)
      .where(
        and(
          eq(models.brandId, brand[0].id),
          eq(models.categorySlug, categorySlug),
          eq(models.isActive, true)
        )
      )
      .orderBy(asc(models.sortOrder), asc(models.name));

    const cat = await db
      .select()
      .from(deviceCategories)
      .where(eq(deviceCategories.slug, categorySlug))
      .limit(1);

    res.json({ category: cat[0] || null, brand: brand[0], models: brandModels });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brand models' });
  }
});

// Brands general
apiRouter.get('/brands', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.query;
    let query = db.select().from(brands).where(eq(brands.isActive, true));
    if (categorySlug) {
      query = db.select().from(brands).where(and(eq(brands.categorySlug, String(categorySlug)), eq(brands.isActive, true)));
    }
    const data = await query.orderBy(asc(brands.sortOrder), asc(brands.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

apiRouter.get('/brands/:slug', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.query;
    const catSlug = String(categorySlug || 'mobile');
    const brandSlug = req.params.slug;

    // Prioritize categorySlug (defaulting to mobile)
    let brand = await db
      .select()
      .from(brands)
      .where(
        and(
          eq(brands.categorySlug, catSlug),
          or(
            eq(brands.slug, brandSlug),
            eq(brands.slug, `${brandSlug}-mobile`),
            eq(brands.slug, brandSlug.replace('-mobile', '')),
            ilike(brands.name, brandSlug)
          )
        )
      )
      .limit(1);

    if (!brand[0]) {
      // Fallback: match without category
      brand = await db
        .select()
        .from(brands)
        .where(
          or(
            eq(brands.slug, brandSlug),
            ilike(brands.name, brandSlug)
          )
        )
        .limit(1);
    }

    if (!brand[0]) return res.status(404).json({ error: 'Brand not found' });

    const targetCategorySlug = brand[0].categorySlug || catSlug;

    // Strictly fetch models for this category
    const brandModels = await db
      .select()
      .from(models)
      .where(
        and(
          eq(models.brandId, brand[0].id),
          eq(models.categorySlug, targetCategorySlug),
          eq(models.isActive, true)
        )
      )
      .orderBy(asc(models.sortOrder), asc(models.name));

    res.json({ brand: brand[0], models: brandModels });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brand details' });
  }
});

// Models for a brand or category
apiRouter.get('/models', async (req: Request, res: Response) => {
  try {
    const { brandId, categorySlug } = req.query;
    let conditions = [eq(models.isActive, true)];

    if (brandId) {
      conditions.push(eq(models.brandId, Number(brandId)));
    }
    if (categorySlug) {
      conditions.push(eq(models.categorySlug, String(categorySlug)));
    }

    const data = await db
      .select()
      .from(models)
      .where(and(...conditions))
      .orderBy(asc(models.sortOrder), asc(models.name));

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Model details + display services + display issues
apiRouter.get('/models/:slug', async (req: Request, res: Response) => {
  try {
    const model = await db.select().from(models).where(eq(models.slug, req.params.slug)).limit(1);
    if (!model[0]) return res.status(404).json({ error: 'Model not found' });

    const m = model[0];

    // Find brand (if assigned)
    let brand = null;
    if (m.brandId) {
      const bRes = await db.select().from(brands).where(eq(brands.id, m.brandId)).limit(1);
      brand = bRes[0] || null;
    }

    // Find category
    let category = null;
    if (m.categoryId) {
      const cRes = await db.select().from(deviceCategories).where(eq(deviceCategories.id, m.categoryId)).limit(1);
      category = cRes[0] || null;
    } else if (m.categorySlug) {
      const cRes = await db.select().from(deviceCategories).where(eq(deviceCategories.slug, m.categorySlug)).limit(1);
      category = cRes[0] || null;
    }

    // Get linked display services
    const linked = await db
      .select({
        service: services,
      })
      .from(modelServices)
      .innerJoin(services, eq(modelServices.serviceId, services.id))
      .where(and(eq(modelServices.modelId, m.id), eq(modelServices.isActive, true), eq(services.isActive, true)))
      .orderBy(asc(services.sortOrder), asc(services.name));

    let availableServices: any[] = [];
    if (linked.length > 0) {
      availableServices = linked.map((l) => ({
        id: l.service.id,
        name: l.service.name,
        slug: l.service.slug,
        icon: l.service.icon,
        imageUrl: l.service.imageUrl,
        description: l.service.description,
      }));
    } else {
      const allActive = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true))
        .orderBy(asc(services.sortOrder), asc(services.name));
      availableServices = allActive.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        icon: s.icon,
        imageUrl: s.imageUrl,
        description: s.description,
      }));
    }

    // Parse display issues
    let parsedIssues: string[] = [];
    if (m.displayIssues) {
      try {
        parsedIssues = JSON.parse(m.displayIssues);
      } catch {
        parsedIssues = m.displayIssues.split(',').map((s) => s.trim());
      }
    }
    if (parsedIssues.length === 0) {
      parsedIssues = [
        'Display Damaged',
        'Display Touch Glass Broken',
        'Green Screen Issue',
        'Touch Not Responding Issue',
        'Green & Pink Line Issue',
        'Black Screen Issue',
        'Display Flickering Issue',
        'Other Display-Related Issue',
        'Foldable Phone Hinge & Flex Cable Issue',
      ];
    }

    res.json({
      model: m,
      brand,
      category,
      displayIssues: parsedIssues,
      services: availableServices,
    });
  } catch (error: any) {
    console.error('Failed to fetch model details:', error);
    res.status(500).json({ error: 'Failed to fetch model details' });
  }
});

// Services
apiRouter.get('/services', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder), asc(services.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

apiRouter.get('/services/:slug', async (req: Request, res: Response) => {
  try {
    const serv = await db.select().from(services).where(eq(services.slug, req.params.slug)).limit(1);
    if (!serv[0]) return res.status(404).json({ error: 'Service not found' });
    res.json(serv[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Service Centers
apiRouter.get('/service-centers', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(serviceCenters)
      .where(eq(serviceCenters.isActive, true))
      .orderBy(asc(serviceCenters.city), asc(serviceCenters.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service centers' });
  }
});

// CMS Sections for Homepage Builder
apiRouter.get('/cms-sections', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(cmsSections)
      .where(eq(cmsSections.isVisible, true))
      .orderBy(asc(cmsSections.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch CMS sections' });
  }
});

// Form Fields
apiRouter.get('/form-fields', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(customerFormFields)
      .where(eq(customerFormFields.isEnabled, true))
      .orderBy(asc(customerFormFields.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
});

// Blogs
apiRouter.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(blogs)
      .where(eq(blogs.status, 'published'))
      .orderBy(desc(blogs.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

apiRouter.get('/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const post = await db.select().from(blogs).where(eq(blogs.slug, req.params.slug)).limit(1);
    if (!post[0]) return res.status(404).json({ error: 'Blog not found' });
    res.json(post[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// FAQs
apiRouter.get('/faqs', async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    let query = db.select().from(faqs).where(eq(faqs.isActive, true));
    if (page) {
      query = db
        .select()
        .from(faqs)
        .where(and(eq(faqs.isActive, true), or(eq(faqs.pageTarget, String(page)), eq(faqs.pageTarget, 'all'))));
    }
    const data = await query.orderBy(asc(faqs.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch faqs' });
  }
});

// Testimonials (Public GET and POST)
apiRouter.get('/testimonials', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(desc(testimonials.isFeatured), desc(testimonials.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

apiRouter.post('/testimonials', async (req: Request, res: Response) => {
  try {
    const { customerName, rating, review, deviceRepaired, photoUrl } = req.body;
    if (!customerName || !review) {
      return res.status(400).json({ error: 'Customer name and review text are required.' });
    }

    const trimmedName = String(customerName).trim();
    const trimmedReview = String(review).trim();
    const numRating = Math.round(Number(rating));

    // Validate rating
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    if (trimmedReview.length < 15) {
      return res.status(400).json({ error: 'Please provide at least 15 characters describing your display repair experience.' });
    }

    // Strict validation: Reject unrelated repair topics
    const unrelatedRegex = /\b(battery|charging\s*port|charger|camera|speaker|microphone|mic\b|motherboard|logic\s*board|audio\s*jack|back\s*panel)\b/i;
    if (unrelatedRegex.test(trimmedReview)) {
      return res.status(400).json({
        error: 'QASWA TELECOM strictly specializes in display repair. Reviews must focus exclusively on display, touchscreen, glass, green screen, line, or panel restoration experiences.',
      });
    }

    // Strict validation: Must contain display-related terms
    const displayRegex = /(display|screen|glass|touch|oled|amoled|digitizer|flicker|green\s*line|pink\s*line|line|lines|green\s*screen|crack|cracked|broken|black\s*screen|hinge|foldable|refurbish|lamination|panel|pixel|pixels|bezel)/i;
    if (!displayRegex.test(trimmedReview)) {
      return res.status(400).json({
        error: 'Please ensure your review describes a display repair experience (e.g. touch glass, green screen, vertical lines, OLED restoration, or touchscreen repair).',
      });
    }

    const inserted = await db
      .insert(testimonials)
      .values({
        customerName: trimmedName,
        rating: numRating,
        review: trimmedReview,
        deviceRepaired: deviceRepaired ? String(deviceRepaired).trim() : 'Flagship Device',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        isFeatured: false,
        isPublished: true,
        date: 'Just now',
      })
      .returning();

    res.status(201).json({ success: true, testimonial: inserted[0] });
  } catch (error: any) {
    console.error('Failed to submit testimonial:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ==========================================
// GALLERY ENDPOINTS (Public)
// ==========================================
// Homepage Gallery slideshow images (Only published, showOnHomepage=true, ordered by homepageOrder)
apiRouter.get('/gallery/homepage', async (_req: Request, res: Response) => {
  try {
    let items = await db
      .select()
      .from(galleryItems)
      .where(and(eq(galleryItems.isPublished, true), eq(galleryItems.showOnHomepage, true)))
      .orderBy(asc(galleryItems.homepageOrder), asc(galleryItems.sortOrder), desc(galleryItems.id));

    // Fallback: If no items have showOnHomepage, take top published items
    if (items.length === 0) {
      items = await db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.isPublished, true))
        .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.id))
        .limit(10);
    }
    res.json(items);
  } catch (error: any) {
    console.error('Failed to fetch homepage gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// Dedicated Gallery Page: supports filter by category, brand, pagination
apiRouter.get('/gallery', async (req: Request, res: Response) => {
  try {
    const { category, brand } = req.query;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 12);
    const offset = (page - 1) * limit;

    // Fetch all published gallery items for determining available filter options and total counts
    const allPublished = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.isPublished, true))
      .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.id));

    // Filter available categories and brands (only categories & brands that have published gallery images)
    const availableCategorySlugs = Array.from(new Set(allPublished.map(i => i.categorySlug).filter(Boolean))) as string[];
    const availableBrandSlugs = Array.from(new Set(allPublished.map(i => i.brandSlug).filter(Boolean))) as string[];

    // Apply filtering
    let filtered = allPublished;
    if (category && category !== 'all') {
      filtered = filtered.filter(i => i.categorySlug?.toLowerCase() === (category as string).toLowerCase());
    }
    if (brand && brand !== 'all') {
      filtered = filtered.filter(i => i.brandSlug?.toLowerCase() === (brand as string).toLowerCase());
    }

    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    res.json({
      items,
      total,
      hasMore,
      page,
      limit,
      availableCategories: availableCategorySlugs,
      availableBrands: availableBrandSlugs,
    });
  } catch (error: any) {
    console.error('Failed to fetch gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Contact Us Form Submission
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      deviceBrand,
      deviceModel,
      displayIssue,
      message,
    } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !deviceBrand || !deviceModel || !displayIssue) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields: Full Name, Phone, Brand, Model, and Display Issue.',
      });
    }

    // Phone validation
    const cleanPhone = String(phoneNumber).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number.',
      });
    }

    // 1. Create or find customer
    let customerId: number | null = null;
    try {
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.mobile, cleanPhone))
        .limit(1);

      if (existingCustomer[0]) {
        customerId = existingCustomer[0].id;
        await db
          .update(customers)
          .set({
            name: String(fullName).trim(),
            email: email ? String(email).trim() : existingCustomer[0].email,
            updatedAt: new Date(),
          })
          .where(eq(customers.id, customerId));
      } else {
        const uniqueCustId = `CUST-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newCust = await db
          .insert(customers)
          .values({
            customerId: uniqueCustId,
            name: String(fullName).trim(),
            mobile: cleanPhone,
            email: email ? String(email).trim() : null,
          })
          .returning();
        customerId = newCust[0]?.id || null;
      }
    } catch (cErr) {
      console.warn('Customer upsert non-fatal note:', cErr);
    }

    // 2. Generate unique reference code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `QAS-INQ-${dateStr}-${randCode}`;

    // 3. Save as contact enquiry order
    await db.insert(orders).values({
      orderNumber,
      customerId,
      customerName: String(fullName).trim(),
      customerMobile: cleanPhone,
      customerEmail: email ? String(email).trim() : null,
      customerCity: 'Mumbai Lab',
      customerAddress: 'Direct Web Inquiry',
      brandName: String(deviceBrand).trim(),
      modelName: String(deviceModel).trim(),
      serviceName: String(displayIssue).trim(),
      status: 'Inquiry Received',
      additionalNote: message ? String(message).trim() : 'Contact form web inquiry',
      whatsappClicked: false,
    });

    res.json({
      success: true,
      orderNumber,
      message: 'Thank you! Your display repair inquiry has been recorded. Our technician will review your case shortly.',
    });
  } catch (error: any) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact inquiry. Please try calling or reaching out via WhatsApp.',
    });
  }
});


// Custom Pages
apiRouter.get('/custom-pages/:slug', async (req: Request, res: Response) => {
  try {
    const page = await db
      .select()
      .from(customPages)
      .where(and(eq(customPages.slug, req.params.slug), eq(customPages.isPublished, true)))
      .limit(1);
    if (!page[0]) return res.status(404).json({ error: 'Page not found' });
    res.json(page[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Track Order (Customer facing)
apiRouter.get('/track-order', async (req: Request, res: Response) => {
  try {
    const { orderNumber, mobile } = req.query;
    if (!orderNumber || !mobile) {
      return res.status(400).json({ error: 'Please provide both Order ID and Mobile Number' });
    }

    const cleanOrderNumber = String(orderNumber).trim().toUpperCase();
    const cleanMobile = String(mobile).replace(/\D/g, '');

    const found = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, cleanOrderNumber))
      .limit(1);

    if (!found[0]) {
      return res.status(404).json({ error: 'No order found with the provided details.' });
    }

    const dbMobileClean = found[0].customerMobile.replace(/\D/g, '');
    if (!dbMobileClean.endsWith(cleanMobile.slice(-10))) {
      return res.status(403).json({ error: 'Mobile number does not match order records.' });
    }

    // Return sanitized status info for the customer
    res.json({
      orderNumber: found[0].orderNumber,
      customerName: found[0].customerName,
      brandName: found[0].brandName,
      modelName: found[0].modelName,
      serviceName: found[0].serviceName,
      preferredDate: found[0].preferredDate,
      preferredTime: found[0].preferredTime,
      status: found[0].status,
      createdAt: found[0].createdAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// ==========================================
// CUSTOMER ISSUE SELECTION & WHATSAPP TRACKING
// ==========================================
/**
 * Customer Flow: Device -> Brand -> Model -> Display Issue -> Proceed With WhatsApp
 * 1. Validate device category, brand, model, and display issue.
 * 2. Save enquiry to PostgreSQL database with exact server date, time, and timestamp.
 * 3. Retrieve business WhatsApp number from settings.
 * 4. Generate professional WhatsApp message and wa.me redirect link.
 * 5. Return success and WhatsApp URL.
 */
apiRouter.post('/enquiries', async (req: Request, res: Response) => {
  try {
    const {
      deviceCategory,
      brand,
      model,
      displayIssue,
      displayIssues,
      customerName,
      customerPhone,
      customerMessage,
    } = req.body;

    if (!deviceCategory || !brand || !model || (!displayIssue && (!displayIssues || displayIssues.length === 0))) {
      return res.status(400).json({
        success: false,
        error: 'Please select device category, brand, model, and at least one display issue.',
      });
    }

    // Parse multiple issues
    let issuesList: string[] = [];
    if (Array.isArray(displayIssues) && displayIssues.length > 0) {
      issuesList = displayIssues.map((s: any) => String(s).trim()).filter(Boolean);
    } else if (typeof displayIssue === 'string') {
      if (displayIssue.includes('•')) {
        issuesList = displayIssue.split('•').map((s) => s.trim()).filter(Boolean);
      } else if (displayIssue.includes(',')) {
        issuesList = displayIssue.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (displayIssue.includes(' + ')) {
        issuesList = displayIssue.split(' + ').map((s) => s.trim()).filter(Boolean);
      } else if (displayIssue.trim()) {
        issuesList = [displayIssue.trim()];
      }
    }

    if (issuesList.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least one display issue.',
      });
    }

    const displayIssueDbText = issuesList.join(', ');

    const now = new Date();
    // Consistent date & time formatted in Indian Standard Time (IST, UTC+5:30)
    const enquiryDate = now.toLocaleDateString('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }); // e.g. "3 Oct 2026"

    const enquiryTime = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }); // e.g. "07:30 PM"

    const [inserted] = await db
      .insert(customerEnquiries)
      .values({
        customerName: customerName ? String(customerName).trim() : null,
        customerPhone: customerPhone ? String(customerPhone).trim() : null,
        deviceCategory: String(deviceCategory).trim(),
        brand: String(brand).trim(),
        model: String(model).trim(),
        displayIssue: displayIssueDbText,
        customerMessage: customerMessage ? String(customerMessage).trim() : null,
        status: 'New',
        whatsappStatus: 'Sent',
        enquiryDate,
        enquiryTime,
      })
      .returning();

    if (!inserted) {
      throw new Error('Failed to record customer enquiry in database.');
    }

    // Retrieve verified Business WhatsApp number from site settings
    const businessWhatsApp = await getSetting('WHATSAPP_NUMBER', '9324316048');
    const cleanDestinationNumber = businessWhatsApp.replace(/\D/g, '');

    // Format WhatsApp message strictly per requirement:
    // If multiple issues:
    // "Display Issues:
    // • Display Damaged
    // • Touch Not Responding Issue
    // • Green & Pink Line Issue"
    let issuesBlock = '';
    if (issuesList.length > 1) {
      issuesBlock = `Display Issues:\n` + issuesList.map((iss) => `• ${iss}`).join('\n') + `\n`;
    } else {
      issuesBlock = `Display Issue: ${issuesList[0]}\n`;
    }

    let msg = `Hello QASWA TELECOM, I would like to enquire about a display repair.\n\n` +
      `Device Category: ${inserted.deviceCategory}\n` +
      `Brand: ${inserted.brand}\n` +
      `Model: ${inserted.model}\n` +
      issuesBlock;

    if (inserted.customerName) {
      msg += `Customer Name: ${inserted.customerName}\n`;
    }
    if (inserted.customerPhone) {
      msg += `Contact: ${inserted.customerPhone}\n`;
    }
    if (inserted.customerMessage) {
      msg += `Note: ${inserted.customerMessage}\n`;
    }

    msg += `\nPlease let me know the next steps.`;

    const whatsappUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(msg)}`;

    res.status(201).json({
      success: true,
      enquiry: inserted,
      whatsappUrl,
      whatsappMessage: msg,
    });
  } catch (error: any) {
    console.error('Error creating customer enquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to record customer enquiry' });
  }
});

// Admin endpoints for Customer Enquiries
apiRouter.get('/admin/enquiries', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { search, deviceCategory, brand, displayIssue, status, date } = req.query;

    let query = db.select().from(customerEnquiries);
    const conditions = [];

    if (deviceCategory && deviceCategory !== 'all') {
      conditions.push(eq(customerEnquiries.deviceCategory, String(deviceCategory)));
    }
    if (brand && brand !== 'all') {
      conditions.push(eq(customerEnquiries.brand, String(brand)));
    }
    if (displayIssue && displayIssue !== 'all') {
      conditions.push(eq(customerEnquiries.displayIssue, String(displayIssue)));
    }
    if (status && status !== 'all') {
      conditions.push(eq(customerEnquiries.status, String(status)));
    }
    if (date && date !== 'all') {
      conditions.push(like(customerEnquiries.enquiryDate, `%${date}%`));
    }
    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      conditions.push(
        or(
          like(customerEnquiries.customerName, term),
          like(customerEnquiries.customerPhone, term),
          like(customerEnquiries.brand, term),
          like(customerEnquiries.model, term),
          like(customerEnquiries.displayIssue, term)
        )
      );
    }

    const items = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(customerEnquiries.id))
      : await query.orderBy(desc(customerEnquiries.id));

    res.json(items);
  } catch (err: any) {
    console.error('Failed to fetch enquiries:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

apiRouter.patch('/admin/enquiries/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, customerName, customerPhone, customerMessage } = req.body;
    const updateData: any = { updatedAt: new Date() };

    if (status) updateData.status = status;
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (customerMessage !== undefined) updateData.customerMessage = customerMessage;

    const [updated] = await db
      .update(customerEnquiries)
      .set(updateData)
      .where(eq(customerEnquiries.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({ success: true, enquiry: updated });
  } catch (err: any) {
    console.error('Failed to update enquiry:', err);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

apiRouter.delete('/admin/enquiries/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(customerEnquiries).where(eq(customerEnquiries.id, id));
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: any) {
    console.error('Failed to delete enquiry:', err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// ==========================================
// THE MAIN BOOKING / WHATSAPP FLOW (CRITICAL)
// ==========================================
/**
 * STEP 1: Select Brand
 * STEP 2: Select Model
 * STEP 3: Select Service
 * STEP 4: Customer Details
 * STEP 5: Review Details
 * STEP 6: Proceed with WhatsApp
 *
 * Backend Requirement:
 * 1. Validate all submitted fields.
 * 2. Create/find customer record in PostgreSQL.
 * 3. Generate unique order number (e.g. RNX-YYYYMMDD-XXXXXX).
 * 4. Save complete order/enquiry in PostgreSQL FIRST.
 * 5. Record whatsapp_clicked = true and whatsapp_clicked_at = now.
 * 6. Generate WhatsApp message containing submitted data.
 * 7. Generate WhatsApp redirect URL (https://wa.me/...).
 * 8. Return response.
 * If database save fails: DO NOT redirect to WhatsApp, return error!
 */
apiRouter.post('/orders/booking', async (req: Request, res: Response) => {
  try {
    const {
      brandId,
      brandName,
      modelId,
      modelName,
      serviceId,
      serviceName,
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      city,
      address,
      preferredDate,
      preferredTime,
      additionalNote,
    } = req.body;

    // Validate essential selections
    if (!brandName || !modelName || !serviceName) {
      return res.status(400).json({
        success: false,
        error: 'Please select Brand, Model, and Service.',
      });
    }

    // Validate enabled & required fields from DB customerFormFields
    const formFields = await db
      .select()
      .from(customerFormFields)
      .where(and(eq(customerFormFields.isEnabled, true), eq(customerFormFields.isRequired, true)));

    for (const field of formFields) {
      const val = req.body[field.fieldKey];
      if (!val || String(val).trim() === '') {
        return res.status(400).json({
          success: false,
          error: `${field.label} is required.`,
        });
      }
    }

    // 1. Find or create Customer in PostgreSQL
    const cleanMobile = String(mobileNumber).trim();
    let customerRecord = await db
      .select()
      .from(customers)
      .where(eq(customers.mobile, cleanMobile))
      .limit(1);

    let customerId: number;
    if (customerRecord.length > 0) {
      customerId = customerRecord[0].id;
      // Update details if provided
      await db
        .update(customers)
        .set({
          name: fullName.trim(),
          whatsapp: (whatsappNumber || cleanMobile).trim(),
          ...(email ? { email: email.trim() } : {}),
          ...(city ? { city: city.trim() } : {}),
          ...(address ? { address: address.trim() } : {}),
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId));
    } else {
      const uniqueCustId = `CUST-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCust = await db
        .insert(customers)
        .values({
          customerId: uniqueCustId,
          name: fullName.trim(),
          mobile: cleanMobile,
          whatsapp: (whatsappNumber || cleanMobile).trim(),
          email: email?.trim() || null,
          city: city?.trim() || null,
          address: address?.trim() || null,
        })
        .returning();
      customerId = newCust[0].id;
    }

    // 2. Generate unique order number (e.g. RNX-YYYYMMDD-XXXXXX)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `RNX-${yyyy}${mm}${dd}-${randomHex}`;

    // 3. Save order to PostgreSQL FIRST!
    const insertedOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId,
        customerName: fullName.trim(),
        customerMobile: cleanMobile,
        customerWhatsapp: (whatsappNumber || cleanMobile).trim(),
        customerEmail: email?.trim() || null,
        customerCity: city?.trim() || null,
        customerAddress: address?.trim() || null,
        brandId: brandId ? Number(brandId) : null,
        brandName: brandName.trim(),
        modelId: modelId ? Number(modelId) : null,
        modelName: modelName.trim(),
        serviceId: serviceId ? Number(serviceId) : null,
        serviceName: serviceName.trim(),
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        additionalNote: additionalNote?.trim() || null,
        status: 'New',
        whatsappClicked: true, // Marked as whatsapp redirect requested
        whatsappClickedAt: new Date(),
        source: 'website',
        deviceMetadata: req.headers['user-agent'] || 'Unknown Device',
        internalNotes: 'Enquiry initiated via website booking wizard.',
      })
      .returning();

    if (!insertedOrder[0]) {
      throw new Error('Failed to record order in database.');
    }

    // 4. Retrieve Business WhatsApp Number from Settings
    const businessWhatsApp = await getSetting('WHATSAPP_NUMBER', '9324316048');
    const brandSiteName = await getSetting('SITE_NAME', 'Qaswa Telecom');

    // Clean destination phone number (remove +, spaces, dashes)
    const cleanDestinationNumber = businessWhatsApp.replace(/\D/g, '');

    // 5. Build dynamic WhatsApp Message
    const lines = [
      `Hello ${brandSiteName},`,
      ``,
      `I would like to enquire about a mobile repair service.`,
      ``,
      `*Order ID:* ${orderNumber}`,
      ``,
      `*Customer Information:*`,
      `• Name: ${fullName.trim()}`,
      `• Mobile: ${cleanMobile}`,
    ];

    if (whatsappNumber && whatsappNumber.trim() !== cleanMobile) {
      lines.push(`• WhatsApp: ${whatsappNumber.trim()}`);
    }
    if (email && email.trim()) {
      lines.push(`• Email: ${email.trim()}`);
    }
    if (city && city.trim()) {
      lines.push(`• City: ${city.trim()}`);
    }
    if (address && address.trim()) {
      lines.push(`• Address: ${address.trim()}`);
    }

    lines.push(``);
    lines.push(`*Repair Request:*`);
    lines.push(`• Brand: ${brandName.trim()}`);
    lines.push(`• Model: ${modelName.trim()}`);
    lines.push(`• Service: ${serviceName.trim()}`);

    if (preferredDate || preferredTime) {
      lines.push(``);
      lines.push(`*Appointment Preference:*`);
      if (preferredDate) lines.push(`• Preferred Date: ${preferredDate}`);
      if (preferredTime) lines.push(`• Preferred Time: ${preferredTime}`);
    }

    if (additionalNote && additionalNote.trim()) {
      lines.push(``);
      lines.push(`*Additional Note:*`);
      lines.push(`${additionalNote.trim()}`);
    }

    lines.push(``);
    lines.push(`Thank you.`);

    const messageText = lines.join('\n');
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodedMessage}`;

    // Return success with order details and generated WhatsApp redirect link
    res.status(201).json({
      success: true,
      orderNumber,
      whatsappUrl,
      order: insertedOrder[0],
      message: 'Enquiry successfully saved in database. Continuing to WhatsApp.',
    });
  } catch (error: any) {
    console.error('CRITICAL: Order booking database save failed:', error);
    // Explicitly do not provide WhatsApp URL if database save fails
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
      details: error.message,
    });
  }
});

// ==========================================
// 2. ADMIN API ENDPOINTS (Protected /admin routes)
// ==========================================

// Dashboard Statistics
apiRouter.get('/admin/stats', async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrdersRes,
      todayOrdersRes,
      newOrdersRes,
      confirmedOrdersRes,
      completedOrdersRes,
      cancelledOrdersRes,
      totalCustomersRes,
      recentOrders,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(sql`${orders.createdAt} >= ${today}`),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'New')),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'Confirmed')),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'Completed')),
      db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'Cancelled')),
      db.select({ count: sql<number>`count(*)` }).from(customers),
      db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
    ]);

    // Popular brands
    const popularBrands = await db
      .select({
        name: orders.brandName,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.brandName)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // Popular services
    const popularServices = await db
      .select({
        name: orders.serviceName,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.serviceName)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    // Popular models
    const popularModels = await db
      .select({
        name: orders.modelName,
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .groupBy(orders.modelName)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    res.json({
      totalOrders: Number(totalOrdersRes[0]?.count || 0),
      todayOrders: Number(todayOrdersRes[0]?.count || 0),
      newOrders: Number(newOrdersRes[0]?.count || 0),
      confirmedOrders: Number(confirmedOrdersRes[0]?.count || 0),
      completedOrders: Number(completedOrdersRes[0]?.count || 0),
      cancelledOrders: Number(cancelledOrdersRes[0]?.count || 0),
      totalCustomers: Number(totalCustomersRes[0]?.count || 0),
      popularBrands,
      popularServices,
      popularModels,
      recentOrders,
    });
  } catch (error: any) {
    console.error('Failed to get admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Admin Orders: Search, Filter, Sort, Pagination
apiRouter.get('/admin/orders', async (req: Request, res: Response) => {
  try {
    const { status, brand, search } = req.query;

    let conditions: any[] = [];

    if (status && status !== 'all') {
      conditions.push(eq(orders.status, String(status)));
    }
    if (brand && brand !== 'all') {
      conditions.push(eq(orders.brandName, String(brand)));
    }
    if (search && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`;
      conditions.push(
        or(
          like(orders.orderNumber, term),
          like(orders.customerName, term),
          like(orders.customerMobile, term),
          like(orders.modelName, term),
          like(orders.serviceName, term)
        )
      );
    }

    let query = db.select().from(orders);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query.orderBy(desc(orders.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Order detail with customer and history
apiRouter.get('/admin/orders/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order[0]) return res.status(404).json({ error: 'Order not found' });

    let customer = null;
    let customerOrders: any[] = [];
    if (order[0].customerId) {
      const cust = await db.select().from(customers).where(eq(customers.id, order[0].customerId)).limit(1);
      customer = cust[0] || null;
      customerOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.customerId, order[0].customerId))
        .orderBy(desc(orders.createdAt));
    }

    res.json({
      order: order[0],
      customer,
      customerHistory: customerOrders,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Update order status and notes
apiRouter.patch('/admin/orders/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, internalNotes } = req.body;

    const updated = await db
      .update(orders)
      .set({
        ...(status ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
apiRouter.delete('/admin/orders/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(orders).where(eq(orders.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Admin Customers
apiRouter.get('/admin/customers', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(customers).orderBy(desc(customers.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Admin Device Categories CRUD
apiRouter.get('/admin/categories', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(deviceCategories).orderBy(asc(deviceCategories.sortOrder), asc(deviceCategories.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch device categories' });
  }
});

apiRouter.post('/admin/categories', async (req: Request, res: Response) => {
  try {
    const { name, slug, tagline, description, imageUrl, icon, hasBrands, isActive, sortOrder } = req.body;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db
      .insert(deviceCategories)
      .values({
        name,
        slug: finalSlug,
        tagline,
        description,
        imageUrl,
        icon: icon || 'Smartphone',
        hasBrands: hasBrands !== false,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create device category' });
  }
});

apiRouter.put('/admin/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, slug, tagline, description, imageUrl, icon, hasBrands, isActive, sortOrder } = req.body;
    const updated = await db
      .update(deviceCategories)
      .set({
        name,
        slug,
        tagline,
        description,
        imageUrl,
        icon,
        hasBrands: hasBrands !== false,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .where(eq(deviceCategories.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update device category' });
  }
});

apiRouter.delete('/admin/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(deviceCategories).where(eq(deviceCategories.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete device category' });
  }
});

// Admin Brands CRUD
apiRouter.get('/admin/brands', async (req: Request, res: Response) => {
  try {
    const { categorySlug, categoryId } = req.query;
    let query = db
      .select({
        id: brands.id,
        categoryId: brands.categoryId,
        categorySlug: brands.categorySlug,
        categoryName: deviceCategories.name,
        name: brands.name,
        slug: brands.slug,
        logoUrl: brands.logoUrl,
        description: brands.description,
        seoTitle: brands.seoTitle,
        seoDescription: brands.seoDescription,
        isActive: brands.isActive,
        sortOrder: brands.sortOrder,
        createdAt: brands.createdAt,
      })
      .from(brands)
      .leftJoin(deviceCategories, eq(brands.categoryId, deviceCategories.id));

    if (categorySlug) {
      query = query.where(eq(brands.categorySlug, String(categorySlug))) as any;
    } else if (categoryId) {
      query = query.where(eq(brands.categoryId, Number(categoryId))) as any;
    }

    const data = await query.orderBy(asc(brands.sortOrder), asc(brands.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

apiRouter.post('/admin/brands', async (req: Request, res: Response) => {
  try {
    const { categoryId, categorySlug, name, slug, logoUrl, description, seoTitle, seoDescription, isActive, sortOrder } = req.body;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db
      .insert(brands)
      .values({
        categoryId: categoryId ? Number(categoryId) : null,
        categorySlug: categorySlug || 'mobile',
        name,
        slug: finalSlug,
        logoUrl,
        description,
        seoTitle,
        seoDescription,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create brand' });
  }
});

apiRouter.put('/admin/brands/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { categoryId, categorySlug, name, slug, logoUrl, description, seoTitle, seoDescription, isActive, sortOrder } = req.body;
    const updated = await db
      .update(brands)
      .set({
        categoryId: categoryId ? Number(categoryId) : null,
        categorySlug: categorySlug || 'mobile',
        name,
        slug,
        logoUrl,
        description,
        seoTitle,
        seoDescription,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .where(eq(brands.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update brand' });
  }
});

apiRouter.delete('/admin/brands/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(brands).where(eq(brands.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete brand' });
  }
});

// Admin Models CRUD
apiRouter.get('/admin/models', async (req: Request, res: Response) => {
  try {
    const { brandId, categorySlug, categoryId } = req.query;
    let query = db
      .select({
        id: models.id,
        brandId: models.brandId,
        brandName: brands.name,
        categoryId: models.categoryId,
        categoryName: deviceCategories.name,
        categorySlug: models.categorySlug,
        series: models.series,
        name: models.name,
        slug: models.slug,
        imageUrl: models.imageUrl,
        description: models.description,
        displayIssues: models.displayIssues,
        seoTitle: models.seoTitle,
        seoDescription: models.seoDescription,
        isActive: models.isActive,
        sortOrder: models.sortOrder,
      })
      .from(models)
      .leftJoin(brands, eq(models.brandId, brands.id))
      .leftJoin(deviceCategories, or(eq(models.categoryId, deviceCategories.id), eq(models.categorySlug, deviceCategories.slug)));

    let conditions: any[] = [];
    if (brandId) {
      conditions.push(eq(models.brandId, Number(brandId)));
    }
    if (categorySlug) {
      conditions.push(eq(models.categorySlug, String(categorySlug)));
    }
    if (categoryId) {
      conditions.push(eq(models.categoryId, Number(categoryId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const data = await query.orderBy(asc(models.sortOrder), asc(models.name));

    // Also attach linked service IDs for each model
    const allLinks = await db.select().from(modelServices).where(eq(modelServices.isActive, true));
    const serviceIdsByModel: Record<number, number[]> = {};
    for (const link of allLinks) {
      if (!serviceIdsByModel[link.modelId]) {
        serviceIdsByModel[link.modelId] = [];
      }
      serviceIdsByModel[link.modelId].push(link.serviceId);
    }

    const enriched = data.map((m) => ({
      ...m,
      serviceIds: serviceIdsByModel[m.id] || [],
    }));

    res.json(enriched);
  } catch (error: any) {
    console.error('Failed to fetch admin models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

apiRouter.post('/admin/models', async (req: Request, res: Response) => {
  try {
    const {
      brandId,
      categoryId,
      categorySlug,
      series,
      name,
      slug,
      imageUrl,
      description,
      displayIssues,
      seoTitle,
      seoDescription,
      isActive,
      sortOrder,
      serviceIds,
    } = req.body;

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalIssues = Array.isArray(displayIssues)
      ? JSON.stringify(displayIssues)
      : typeof displayIssues === 'string'
      ? displayIssues
      : null;

    const created = await db
      .insert(models)
      .values({
        brandId: brandId ? Number(brandId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        categorySlug: categorySlug || 'mobile',
        series: series || null,
        name,
        slug: finalSlug,
        imageUrl,
        description,
        displayIssues: finalIssues,
        seoTitle,
        seoDescription,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .returning();

    // Link services if provided
    if (Array.isArray(serviceIds)) {
      for (const sId of serviceIds) {
        await db.insert(modelServices).values({
          modelId: created[0].id,
          serviceId: Number(sId),
          isActive: true,
        });
      }
    }

    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create model' });
  }
});

apiRouter.put('/admin/models/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      brandId,
      categoryId,
      categorySlug,
      series,
      name,
      slug,
      imageUrl,
      description,
      displayIssues,
      seoTitle,
      seoDescription,
      isActive,
      sortOrder,
      serviceIds,
    } = req.body;

    const finalIssues = Array.isArray(displayIssues)
      ? JSON.stringify(displayIssues)
      : typeof displayIssues === 'string'
      ? displayIssues
      : null;

    const updated = await db
      .update(models)
      .set({
        brandId: brandId ? Number(brandId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        categorySlug: categorySlug || 'mobile',
        series: series || null,
        name,
        slug,
        imageUrl,
        description,
        displayIssues: finalIssues,
        seoTitle,
        seoDescription,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .where(eq(models.id, id))
      .returning();

    if (Array.isArray(serviceIds)) {
      await db.delete(modelServices).where(eq(modelServices.modelId, id));
      for (const sId of serviceIds) {
        await db.insert(modelServices).values({
          modelId: id,
          serviceId: Number(sId),
          isActive: true,
        });
      }
    }

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update model' });
  }
});

apiRouter.delete('/admin/models/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(modelServices).where(eq(modelServices.modelId, id));
    await db.delete(models).where(eq(models.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete model' });
  }
});

// Admin Services CRUD
apiRouter.get('/admin/services', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

apiRouter.post('/admin/services', async (req: Request, res: Response) => {
  try {
    const { name, slug, icon, imageUrl, description, priceEstimate, estimatedDuration, warrantyInfo, isActive, sortOrder } =
      req.body;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db
      .insert(services)
      .values({
        name,
        slug: finalSlug,
        icon: icon || 'Smartphone',
        imageUrl,
        description,
        priceEstimate,
        estimatedDuration,
        warrantyInfo,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create service' });
  }
});

apiRouter.put('/admin/services/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, slug, icon, imageUrl, description, priceEstimate, estimatedDuration, warrantyInfo, isActive, sortOrder } =
      req.body;
    const updated = await db
      .update(services)
      .set({
        name,
        slug,
        icon,
        imageUrl,
        description,
        priceEstimate,
        estimatedDuration,
        warrantyInfo,
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      })
      .where(eq(services.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update service' });
  }
});

apiRouter.delete('/admin/services/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(modelServices).where(eq(modelServices.serviceId, id));
    await db.delete(services).where(eq(services.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete service' });
  }
});

// Admin Customer Form Fields
apiRouter.get('/admin/form-fields', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(customerFormFields).orderBy(asc(customerFormFields.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch form fields' });
  }
});

apiRouter.put('/admin/form-fields/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { label, placeholder, isRequired, isEnabled, sortOrder } = req.body;
    const updated = await db
      .update(customerFormFields)
      .set({
        label,
        placeholder,
        isRequired: Boolean(isRequired),
        isEnabled: Boolean(isEnabled),
        sortOrder: Number(sortOrder) || 0,
      })
      .where(eq(customerFormFields.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update form field' });
  }
});

// Admin Order Statuses
apiRouter.get('/admin/order-statuses', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(orderStatuses).orderBy(asc(orderStatuses.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch statuses' });
  }
});

apiRouter.post('/admin/order-statuses', async (req: Request, res: Response) => {
  try {
    const { name, color, sortOrder, isActive } = req.body;
    const created = await db
      .insert(orderStatuses)
      .values({
        name,
        color: color || '#00B2A2',
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create status' });
  }
});

apiRouter.put('/admin/order-statuses/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, color, sortOrder, isActive } = req.body;
    const updated = await db
      .update(orderStatuses)
      .set({
        name,
        color,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      })
      .where(eq(orderStatuses.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update status' });
  }
});

apiRouter.delete('/admin/order-statuses/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(orderStatuses).where(eq(orderStatuses.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete status' });
  }
});

// Admin CMS Sections (Homepage Builder)
apiRouter.get('/admin/cms-sections', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(cmsSections).orderBy(asc(cmsSections.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch CMS sections' });
  }
});

apiRouter.post('/admin/cms-sections', async (req: Request, res: Response) => {
  try {
    const { sectionType, title, subtitle, description, contentJson, imageUrl, buttonText, buttonUrl, alignment, sortOrder, isVisible } =
      req.body;
    const created = await db
      .insert(cmsSections)
      .values({
        sectionType,
        title,
        subtitle,
        description,
        contentJson: typeof contentJson === 'object' ? JSON.stringify(contentJson) : contentJson,
        imageUrl,
        buttonText,
        buttonUrl,
        alignment: alignment || 'center',
        sortOrder: Number(sortOrder) || 0,
        isVisible: isVisible !== false,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create section' });
  }
});

apiRouter.put('/admin/cms-sections/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { sectionType, title, subtitle, description, contentJson, imageUrl, buttonText, buttonUrl, alignment, sortOrder, isVisible } =
      req.body;
    const updated = await db
      .update(cmsSections)
      .set({
        sectionType,
        title,
        subtitle,
        description,
        contentJson: typeof contentJson === 'object' ? JSON.stringify(contentJson) : contentJson,
        imageUrl,
        buttonText,
        buttonUrl,
        alignment,
        sortOrder: Number(sortOrder) || 0,
        isVisible: isVisible !== false,
        updatedAt: new Date(),
      })
      .where(eq(cmsSections.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update section' });
  }
});

apiRouter.delete('/admin/cms-sections/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(cmsSections).where(eq(cmsSections.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete section' });
  }
});

// Admin Service Centers
apiRouter.get('/admin/service-centers', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(serviceCenters).orderBy(asc(serviceCenters.name));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch service centers' });
  }
});

apiRouter.post('/admin/service-centers', async (req: Request, res: Response) => {
  try {
    const { name, city, address, phone, whatsapp, mapUrl, timing, imageUrl, isActive } = req.body;
    const created = await db
      .insert(serviceCenters)
      .values({
        name,
        city,
        address,
        phone,
        whatsapp,
        mapUrl,
        timing,
        imageUrl,
        isActive: isActive !== false,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create service center' });
  }
});

apiRouter.put('/admin/service-centers/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, city, address, phone, whatsapp, mapUrl, timing, imageUrl, isActive } = req.body;
    const updated = await db
      .update(serviceCenters)
      .set({
        name,
        city,
        address,
        phone,
        whatsapp,
        mapUrl,
        timing,
        imageUrl,
        isActive: isActive !== false,
      })
      .where(eq(serviceCenters.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update service center' });
  }
});

apiRouter.delete('/admin/service-centers/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(serviceCenters).where(eq(serviceCenters.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete service center' });
  }
});

// Admin Blogs CRUD
apiRouter.get('/admin/blogs', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

apiRouter.post('/admin/blogs', async (req: Request, res: Response) => {
  try {
    const { title, slug, content, excerpt, featuredImage, author, category, tags, status, seoTitle, seoDescription } =
      req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db
      .insert(blogs)
      .values({
        title,
        slug: finalSlug,
        content,
        excerpt,
        featuredImage,
        author: author || 'Admin',
        category: category || 'Repairs',
        tags,
        status: status || 'published',
        seoTitle,
        seoDescription,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create blog' });
  }
});

apiRouter.put('/admin/blogs/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, content, excerpt, featuredImage, author, category, tags, status, seoTitle, seoDescription } =
      req.body;
    const updated = await db
      .update(blogs)
      .set({
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        author,
        category,
        tags,
        status,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update blog' });
  }
});

apiRouter.delete('/admin/blogs/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(blogs).where(eq(blogs.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete blog' });
  }
});

// Admin FAQs CRUD
apiRouter.get('/admin/faqs', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch faqs' });
  }
});

apiRouter.post('/admin/faqs', async (req: Request, res: Response) => {
  try {
    const { question, answer, category, pageTarget, sortOrder, isActive } = req.body;
    const created = await db
      .insert(faqs)
      .values({
        question,
        answer,
        category: category || 'General',
        pageTarget: pageTarget || 'home',
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create faq' });
  }
});

apiRouter.put('/admin/faqs/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { question, answer, category, pageTarget, sortOrder, isActive } = req.body;
    const updated = await db
      .update(faqs)
      .set({
        question,
        answer,
        category,
        pageTarget,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      })
      .where(eq(faqs.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update faq' });
  }
});

apiRouter.delete('/admin/faqs/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(faqs).where(eq(faqs.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete faq' });
  }
});

// Admin Testimonials CRUD
apiRouter.get('/admin/testimonials', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

apiRouter.post('/admin/testimonials', async (req: Request, res: Response) => {
  try {
    const { customerName, rating, review, photoUrl, deviceRepaired, isFeatured, isPublished, date } = req.body;
    const created = await db
      .insert(testimonials)
      .values({
        customerName,
        rating: Number(rating) || 5,
        review,
        photoUrl,
        deviceRepaired,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== false,
        date: date || new Date().toISOString().split('T')[0],
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create testimonial' });
  }
});

apiRouter.put('/admin/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { customerName, rating, review, photoUrl, deviceRepaired, isFeatured, isPublished, date } = req.body;
    const updated = await db
      .update(testimonials)
      .set({
        customerName,
        rating: Number(rating) || 5,
        review,
        photoUrl,
        deviceRepaired,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== false,
        date,
      })
      .where(eq(testimonials.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update testimonial' });
  }
});

apiRouter.delete('/admin/testimonials/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(testimonials).where(eq(testimonials.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete testimonial' });
  }
});

// Admin Gallery CRUD
apiRouter.get('/admin/gallery', async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder), asc(galleryItems.homepageOrder), desc(galleryItems.id));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

apiRouter.post('/admin/gallery', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // Support single or multiple items
    if (Array.isArray(body)) {
      const inserted = [];
      for (const item of body) {
        if (!item.imageUrl) continue;
        const resItem = await db
          .insert(galleryItems)
          .values({
            title: item.title || 'Display Repair',
            caption: item.caption || null,
            imageUrl: item.imageUrl,
            beforeImageUrl: item.beforeImageUrl || null,
            categorySlug: item.categorySlug || 'mobile',
            categoryId: item.categoryId ? Number(item.categoryId) : null,
            brandSlug: item.brandSlug || null,
            brandId: item.brandId ? Number(item.brandId) : null,
            showOnHomepage: item.showOnHomepage !== false,
            homepageOrder: Number(item.homepageOrder) || 0,
            sortOrder: Number(item.sortOrder) || 0,
            isPublished: item.isPublished !== false,
          })
          .returning();
        inserted.push(resItem[0]);
      }
      return res.status(201).json(inserted);
    }

    const {
      title,
      caption,
      imageUrl,
      beforeImageUrl,
      categorySlug,
      categoryId,
      brandSlug,
      brandId,
      showOnHomepage,
      homepageOrder,
      sortOrder,
      isPublished,
    } = body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const created = await db
      .insert(galleryItems)
      .values({
        title: title || 'Display Repair',
        caption: caption || null,
        imageUrl,
        beforeImageUrl: beforeImageUrl || null,
        categorySlug: categorySlug || 'mobile',
        categoryId: categoryId ? Number(categoryId) : null,
        brandSlug: brandSlug || null,
        brandId: brandId ? Number(brandId) : null,
        showOnHomepage: showOnHomepage !== false,
        homepageOrder: Number(homepageOrder) || 0,
        sortOrder: Number(sortOrder) || 0,
        isPublished: isPublished !== false,
      })
      .returning();

    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create gallery item' });
  }
});

apiRouter.put('/admin/gallery/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      caption,
      imageUrl,
      beforeImageUrl,
      categorySlug,
      categoryId,
      brandSlug,
      brandId,
      showOnHomepage,
      homepageOrder,
      sortOrder,
      isPublished,
    } = req.body;

    const updated = await db
      .update(galleryItems)
      .set({
        title,
        caption,
        imageUrl,
        beforeImageUrl,
        categorySlug,
        categoryId: categoryId ? Number(categoryId) : null,
        brandSlug,
        brandId: brandId ? Number(brandId) : null,
        showOnHomepage: Boolean(showOnHomepage),
        homepageOrder: Number(homepageOrder) || 0,
        sortOrder: Number(sortOrder) || 0,
        isPublished: Boolean(isPublished),
        updatedAt: new Date(),
      })
      .where(eq(galleryItems.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update gallery item' });
  }
});

apiRouter.delete('/admin/gallery/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete gallery item' });
  }
});

apiRouter.post('/admin/gallery/reorder', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      for (const itm of items) {
        const updateData: any = { updatedAt: new Date() };
        if (typeof itm.sortOrder === 'number') updateData.sortOrder = itm.sortOrder;
        if (typeof itm.homepageOrder === 'number') updateData.homepageOrder = itm.homepageOrder;
        if (typeof itm.showOnHomepage === 'boolean') updateData.showOnHomepage = itm.showOnHomepage;
        await db.update(galleryItems).set(updateData).where(eq(galleryItems.id, itm.id));
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reorder gallery items' });
  }
});

// Admin Custom Pages CRUD
apiRouter.get('/admin/custom-pages', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(customPages).orderBy(asc(customPages.title));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch custom pages' });
  }
});

apiRouter.post('/admin/custom-pages', async (req: Request, res: Response) => {
  try {
    const { title, slug, content, seoTitle, seoDescription, isPublished } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = await db
      .insert(customPages)
      .values({
        title,
        slug: finalSlug,
        content,
        seoTitle,
        seoDescription,
        isPublished: isPublished !== false,
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create page' });
  }
});

apiRouter.put('/admin/custom-pages/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, slug, content, seoTitle, seoDescription, isPublished } = req.body;
    const updated = await db
      .update(customPages)
      .set({
        title,
        slug,
        content,
        seoTitle,
        seoDescription,
        isPublished: isPublished !== false,
        updatedAt: new Date(),
      })
      .where(eq(customPages.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update page' });
  }
});

apiRouter.delete('/admin/custom-pages/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(customPages).where(eq(customPages.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete page' });
  }
});

// Admin Media Library CRUD
apiRouter.get('/admin/media', async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(mediaItems).orderBy(desc(mediaItems.createdAt));
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

apiRouter.post('/admin/media', async (req: Request, res: Response) => {
  try {
    const { name, url, altText, category } = req.body;
    const created = await db
      .insert(mediaItems)
      .values({
        name,
        url,
        altText,
        category: category || 'general',
      })
      .returning();
    res.status(201).json(created[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add media item' });
  }
});

apiRouter.delete('/admin/media/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(mediaItems).where(eq(mediaItems.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete media item' });
  }
});

// Admin Media Stats & Storage Summary
apiRouter.get('/admin/media/stats', async (_req: Request, res: Response) => {
  try {
    const all = await db.select().from(mediaItems);
    const categoryCounts: Record<string, number> = {};
    all.forEach((item) => {
      const cat = item.category || 'general';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    res.json({
      total: all.length,
      categories: categoryCounts,
      latest: all.slice(0, 5),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch media stats' });
  }
});

// Admin Link Media to CMS / Pages
apiRouter.post('/admin/media/:id/link-cms', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const media = await db.select().from(mediaItems).where(eq(mediaItems.id, id)).limit(1);
    if (!media.length) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    const mediaItem = media[0];
    const { target, sectionId, entityId, slideTitle, slideSubtitle } = req.body;

    if (!target) {
      return res.status(400).json({ error: 'Target CMS location is required' });
    }

    let message = 'Linked successfully';

    if (target === 'home-hero') {
      const saved = (await getSavedPageContent('home')) || DEFAULT_HOME_CONTENT;
      const currentSlides = saved.hero?.slides || DEFAULT_HOME_CONTENT.hero.slides;
      const newSlide = {
        image: mediaItem.url,
        title: slideTitle || mediaItem.name || 'Micro-Soldering & Display Repair',
        subtitle: slideSubtitle || 'State-of-the-Art Repair Lab',
        badge: 'NEW REPAIR CAPABILITY',
        stats: 'ISO Class Cleanroom Facility',
      };
      saved.hero = {
        ...saved.hero,
        slides: [...currentSlides, newSlide],
      };
      await savePageContentHelper('home', saved);
      message = 'Added as a new slide to Homepage Hero slideshow';
    } else if (target === 'home-cleanroom') {
      const saved = (await getSavedPageContent('home')) || DEFAULT_HOME_CONTENT;
      saved.aboutSection = {
        ...(saved.aboutSection || DEFAULT_HOME_CONTENT.aboutSection),
        imageUrl: mediaItem.url,
      };
      await savePageContentHelper('home', saved);
      message = 'Set as Homepage Cleanroom Lab Showcase Image';
    } else if (target === 'home-gallery') {
      const saved = (await getSavedPageContent('home')) || DEFAULT_HOME_CONTENT;
      const currentGallery = saved.repairGallery?.images || DEFAULT_HOME_CONTENT.repairGallery.images;
      const newItem = {
        beforeUrl: mediaItem.url,
        afterUrl: mediaItem.url,
        title: slideTitle || mediaItem.name || 'Motherboard Trace Reconstruction',
        device: slideSubtitle || 'Flagship Smartphone',
        repairType: 'Component Level Micro-Soldering',
      };
      saved.repairGallery = {
        ...(saved.repairGallery || DEFAULT_HOME_CONTENT.repairGallery),
        images: [...currentGallery, newItem],
      };
      await savePageContentHelper('home', saved);
      message = 'Added to Homepage Before / After Repair Gallery';
    } else if (target === 'about-hero' || target === 'about-story') {
      const saved = (await getSavedPageContent('about')) || DEFAULT_ABOUT_CONTENT;
      saved.story = {
        ...(saved.story || DEFAULT_ABOUT_CONTENT.story),
        imageUrl: mediaItem.url,
      };
      await savePageContentHelper('about', saved);
      message = 'Set as About Us Story / Facility Image';
    } else if (target === 'about-lab1' || target === 'about-lab2') {
      const saved = (await getSavedPageContent('about')) || DEFAULT_ABOUT_CONTENT;
      const currentImages = [...(saved.gallery?.images || DEFAULT_ABOUT_CONTENT.gallery.images)];
      const imgIdx = target === 'about-lab1' ? 0 : 1;
      const newImg = {
        url: mediaItem.url,
        title: slideTitle || (imgIdx === 0 ? 'Stereo Microscope Micro-Soldering' : 'Cleanroom Laminar Flow Bench'),
        caption: slideSubtitle || 'Precision diagnostics and component-level rework station',
      };
      if (currentImages[imgIdx]) {
        currentImages[imgIdx] = newImg;
      } else {
        currentImages.push(newImg);
      }
      saved.gallery = {
        ...(saved.gallery || DEFAULT_ABOUT_CONTENT.gallery),
        images: currentImages,
      };
      await savePageContentHelper('about', saved);
      message = `Set as About Us Cleanroom Photo ${imgIdx + 1}`;
    } else if (target === 'contact-store') {
      const saved = (await getSavedPageContent('contact')) || DEFAULT_CONTACT_CONTENT;
      saved.storeShowcase = {
        ...(saved.storeShowcase || DEFAULT_CONTACT_CONTENT.storeShowcase),
        imageUrl: mediaItem.url,
      };
      await savePageContentHelper('contact', saved);
      message = 'Set as Contact Us Lab / Store Showcase Image';
    } else if (target === 'cms-section' && sectionId) {
      await db
        .update(cmsSections)
        .set({ imageUrl: mediaItem.url, updatedAt: new Date() })
        .where(eq(cmsSections.id, Number(sectionId)));
      message = `Updated CMS Section #${sectionId} image`;
    } else if (target === 'service-center' && entityId) {
      await db
        .update(serviceCenters)
        .set({ imageUrl: mediaItem.url })
        .where(eq(serviceCenters.id, Number(entityId)));
      message = `Updated Service Center #${entityId} image`;
    } else if (target === 'brand' && entityId) {
      await db
        .update(brands)
        .set({ logoUrl: mediaItem.url })
        .where(eq(brands.id, Number(entityId)));
      message = `Updated Brand #${entityId} logo`;
    } else if (target === 'service' && entityId) {
      await db
        .update(services)
        .set({ imageUrl: mediaItem.url })
        .where(eq(services.id, Number(entityId)));
      message = `Updated Service #${entityId} image`;
    } else if (target === 'blog' && entityId) {

      await db
        .update(blogs)
        .set({ featuredImage: mediaItem.url, updatedAt: new Date() })
        .where(eq(blogs.id, Number(entityId)));
      message = `Updated Blog #${entityId} featured image`;
    } else {
      return res.status(400).json({ error: 'Invalid target or missing identifier' });
    }

    res.json({
      success: true,
      message,
      target,
      mediaUrl: mediaItem.url,
    });
  } catch (error: any) {
    console.error('Failed to link media to CMS:', error);
    res.status(500).json({ error: error.message || 'Failed to link media item' });
  }
});

// Admin Settings (WhatsApp number, Header, Footer, Theme, SEO)
apiRouter.get('/admin/settings', async (_req: Request, res: Response) => {
  try {
    const all = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    all.forEach((s) => {
      map[s.key] = s.value;
    });
    res.json(map);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

apiRouter.post('/admin/settings', async (req: Request, res: Response) => {
  try {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
      await db
        .insert(siteSettings)
        .values({ key, value: strVal })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: strVal },
        });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update settings' });
  }
});

// ==========================================
// SEO MANAGEMENT ENDPOINTS
// ==========================================

// Helper to fetch saved SEO configs map from DB
async function getSavedSeoMap(): Promise<Record<string, any>> {
  try {
    const record = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'SEO_CONFIG_PAGES'))
      .limit(1);
    if (record[0]?.value) {
      return JSON.parse(record[0].value);
    }
  } catch (e) {
    console.error('Error reading SEO_CONFIG_PAGES:', e);
  }
  return {};
}

// 1. Get all pages with SEO metadata (Admin)
apiRouter.get('/admin/seo', async (_req: Request, res: Response) => {
  try {
    const savedMap = await getSavedSeoMap();

    // Fetch dynamic content to include all pages in SEO management
    const [dbBrands, dbServices, dbPages, dbBlogs] = await Promise.all([
      db.select({ name: brands.name, slug: brands.slug, seoTitle: brands.seoTitle, seoDescription: brands.seoDescription })
        .from(brands)
        .where(eq(brands.isActive, true)),
      db.select({ name: services.name, slug: services.slug })
        .from(services)
        .where(eq(services.isActive, true)),
      db.select({ title: customPages.title, slug: customPages.slug, seoTitle: customPages.seoTitle, seoDescription: customPages.seoDescription })
        .from(customPages)
        .where(eq(customPages.isPublished, true)),
      db.select({ title: blogs.title, slug: blogs.slug, seoTitle: blogs.seoTitle, seoDescription: blogs.seoDescription })
        .from(blogs)
        .where(eq(blogs.status, 'published')),
    ]);

    const pagesList: any[] = [];
    const processedPaths = new Set<string>();

    // 1. Add standard baseline pages
    for (const [path, baseline] of Object.entries(DEFAULT_PAGE_SEO_MAP)) {
      processedPaths.add(path);
      const saved = savedMap[path] || {};
      pagesList.push({
        ...baseline,
        ...saved,
        path,
        isCustom: false,
      });
    }

    // 2. Add brand pages from DB
    for (const b of dbBrands) {
      const path = `/brands/${b.slug}`;
      if (!processedPaths.has(path)) {
        processedPaths.add(path);
        const saved = savedMap[path] || {};
        pagesList.push({
          path,
          pageName: `${b.name} Screen Repair`,
          category: 'Brands',
          title: saved.title || b.seoTitle || `${b.name} Flagship Display Repair | QASWA TELECOM`,
          description:
            saved.description ||
            b.seoDescription ||
            `Certified cleanroom screen repair, glass refurbishing, and laser bonding for ${b.name} devices. 100% optical clarity and warranty.`,
          keywords: `${b.name.toLowerCase()} screen repair, ${b.name.toLowerCase()} display replacement, fix ${b.name.toLowerCase()} screen`,
          ogImage: saved.ogImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
          ogType: 'website',
          canonicalUrl: saved.canonicalUrl || '',
          robots: saved.robots || 'index, follow',
          twitterCard: saved.twitterCard || 'summary_large_image',
          schemaType: saved.schemaType || 'Service',
          schemaJson: saved.schemaJson || getSchemaTemplate('Service', { path, title: `${b.name} Display Repair` }),
          updatedAt: saved.updatedAt,
          isCustom: false,
          ...saved,
        });
      }
    }

    // 3. Add service pages from DB
    for (const s of dbServices) {
      const path = `/services/${s.slug}`;
      if (!processedPaths.has(path)) {
        processedPaths.add(path);
        const saved = savedMap[path] || {};
        pagesList.push({
          path,
          pageName: s.name,
          category: 'Services',
          title: saved.title || `${s.name} Service | QASWA TELECOM`,
          description:
            saved.description ||
            `Expert ${s.name} service for flagship smartphones and smartwatches at QASWA TELECOM cleanroom lab.`,
          keywords: `${s.name.toLowerCase()}, mobile screen service, display fix Mumbai`,
          ogImage: saved.ogImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
          ogType: 'website',
          canonicalUrl: saved.canonicalUrl || '',
          robots: saved.robots || 'index, follow',
          twitterCard: saved.twitterCard || 'summary_large_image',
          schemaType: saved.schemaType || 'Service',
          schemaJson: saved.schemaJson || getSchemaTemplate('Service', { path, title: s.name }),
          updatedAt: saved.updatedAt,
          isCustom: false,
          ...saved,
        });
      }
    }

    // 4. Add custom pages from DB
    for (const p of dbPages) {
      const path = `/${p.slug}`;
      if (!processedPaths.has(path)) {
        processedPaths.add(path);
        const saved = savedMap[path] || {};
        pagesList.push({
          path,
          pageName: p.title,
          category: 'Custom',
          title: saved.title || p.seoTitle || `${p.title} | QASWA TELECOM`,
          description: saved.description || p.seoDescription || `${p.title} - Official information from QASWA TELECOM.`,
          keywords: `${p.title.toLowerCase()}, qaswa telecom`,
          ogImage: saved.ogImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
          ogType: 'website',
          canonicalUrl: saved.canonicalUrl || '',
          robots: saved.robots || 'index, follow',
          twitterCard: saved.twitterCard || 'summary',
          schemaType: saved.schemaType || 'WebPage',
          schemaJson: saved.schemaJson || getSchemaTemplate('WebPage', { path, title: p.title }),
          updatedAt: saved.updatedAt,
          isCustom: true,
          ...saved,
        });
      }
    }

    // 5. Add any custom URLs saved directly in savedMap that weren't in the list
    for (const [path, saved] of Object.entries(savedMap)) {
      if (!processedPaths.has(path)) {
        processedPaths.add(path);
        pagesList.push({
          path,
          pageName: saved.pageName || path,
          category: saved.category || 'Custom',
          title: saved.title || `${saved.pageName || path} | QASWA TELECOM`,
          description: saved.description || '',
          keywords: saved.keywords || '',
          ogImage: saved.ogImage || '',
          ogType: saved.ogType || 'website',
          canonicalUrl: saved.canonicalUrl || '',
          robots: saved.robots || 'index, follow',
          twitterCard: saved.twitterCard || 'summary_large_image',
          schemaType: saved.schemaType || 'WebPage',
          schemaJson: saved.schemaJson || getSchemaTemplate('WebPage', { path, title: saved.pageName || path }),
          updatedAt: saved.updatedAt,
          isCustom: true,
          ...saved,
        });
      }
    }

    res.json(pagesList);
  } catch (error: any) {
    console.error('Error fetching admin SEO list:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch SEO metadata' });
  }
});

// 2. Save / update single page SEO (Admin)
apiRouter.post('/admin/seo', async (req: Request, res: Response) => {
  try {
    const {
      path,
      pageName,
      category,
      title,
      description,
      keywords,
      canonicalUrl,
      ogImage,
      ogType,
      twitterCard,
      robots,
      author,
      schemaType,
      schemaJson,
    } = req.body;

    if (!path) {
      return res.status(400).json({ error: 'Page path is required' });
    }

    // Validate JSON if schemaJson is provided
    if (schemaJson && typeof schemaJson === 'string' && schemaJson.trim() !== '') {
      try {
        JSON.parse(schemaJson);
      } catch (err: any) {
        return res.status(400).json({ error: `Invalid Schema JSON-LD format: ${err.message}` });
      }
    }

    const savedMap = await getSavedSeoMap();

    const updatedConfig = {
      path,
      pageName: pageName || savedMap[path]?.pageName || path,
      category: category || savedMap[path]?.category || 'General',
      title: title?.trim() || '',
      description: description?.trim() || '',
      keywords: keywords?.trim() || '',
      canonicalUrl: canonicalUrl?.trim() || '',
      ogImage: ogImage?.trim() || '',
      ogType: ogType || 'website',
      twitterCard: twitterCard || 'summary_large_image',
      robots: robots || 'index, follow',
      author: author?.trim() || '',
      schemaType: schemaType || 'WebPage',
      schemaJson: schemaJson?.trim() || '',
      updatedAt: new Date().toISOString(),
    };

    savedMap[path] = updatedConfig;

    // Persist to siteSettings table
    await db
      .insert(siteSettings)
      .values({ key: 'SEO_CONFIG_PAGES', value: JSON.stringify(savedMap) })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: JSON.stringify(savedMap) },
      });

    // Also sync to brands / customPages if matching
    if (path.startsWith('/brands/')) {
      const brandSlug = path.replace('/brands/', '');
      await db
        .update(brands)
        .set({ seoTitle: title, seoDescription: description })
        .where(eq(brands.slug, brandSlug))
        .catch(() => {});
    } else if (path !== '/' && !path.includes('/')) {
      const pageSlug = path.replace(/^\//, '');
      await db
        .update(customPages)
        .set({ seoTitle: title, seoDescription: description })
        .where(eq(customPages.slug, pageSlug))
        .catch(() => {});
    }

    res.json({ success: true, page: updatedConfig });
  } catch (error: any) {
    console.error('Error saving SEO page config:', error);
    res.status(500).json({ error: error.message || 'Failed to save SEO config' });
  }
});

// 3. Reset page SEO to system defaults (Admin)
apiRouter.post('/admin/seo/reset', async (req: Request, res: Response) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ error: 'Path is required' });
    }

    const savedMap = await getSavedSeoMap();
    delete savedMap[path];

    await db
      .insert(siteSettings)
      .values({ key: 'SEO_CONFIG_PAGES', value: JSON.stringify(savedMap) })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: JSON.stringify(savedMap) },
      });

    const fallback = DEFAULT_PAGE_SEO_MAP[path] || {
      path,
      pageName: path,
      title: `${path} | QASWA TELECOM`,
      description: '',
      keywords: '',
      schemaType: 'WebPage',
      schemaJson: getSchemaTemplate('WebPage', { path }),
    };

    res.json({ success: true, default: fallback });
  } catch (error: any) {
    console.error('Error resetting SEO page:', error);
    res.status(500).json({ error: error.message || 'Failed to reset SEO page' });
  }
});

// 4. Bulk save / import SEO configs (Admin)
apiRouter.post('/admin/seo/bulk', async (req: Request, res: Response) => {
  try {
    const { configs } = req.body;
    if (!configs || typeof configs !== 'object') {
      return res.status(400).json({ error: 'Configs dictionary or array is required' });
    }

    const savedMap = await getSavedSeoMap();

    if (Array.isArray(configs)) {
      for (const item of configs) {
        if (item.path) {
          savedMap[item.path] = { ...item, updatedAt: new Date().toISOString() };
        }
      }
    } else {
      for (const [path, item] of Object.entries(configs)) {
        savedMap[path] = { ...(item as any), path, updatedAt: new Date().toISOString() };
      }
    }

    await db
      .insert(siteSettings)
      .values({ key: 'SEO_CONFIG_PAGES', value: JSON.stringify(savedMap) })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: JSON.stringify(savedMap) },
      });

    res.json({ success: true, count: Object.keys(savedMap).length });
  } catch (error: any) {
    console.error('Error in bulk SEO save:', error);
    res.status(500).json({ error: error.message || 'Failed to bulk save SEO configs' });
  }
});

// 5. Public SEO endpoint
apiRouter.get('/public/seo', async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string | undefined;
    const savedMap = await getSavedSeoMap();

    if (path) {
      const config = savedMap[path] || DEFAULT_PAGE_SEO_MAP[path] || DEFAULT_PAGE_SEO_MAP['/'];
      return res.json(config);
    }

    // Merge baseline with saved
    const merged: Record<string, any> = { ...DEFAULT_PAGE_SEO_MAP };
    for (const [p, item] of Object.entries(savedMap)) {
      merged[p] = { ...merged[p], ...item };
    }

    res.json(merged);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch public SEO' });
  }
});

// ==========================================
// PAGE CONTENT MANAGEMENT ENDPOINTS
// (HomePage, About Us, Contact Us)
// ==========================================

// Helper to get saved page content from DB
async function getSavedPageContent(page: 'home' | 'about' | 'contact'): Promise<any> {
  try {
    const key = `PAGE_CONTENT_${page.toUpperCase()}`;
    const record = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    if (record[0]?.value) {
      return JSON.parse(record[0].value);
    }
  } catch (e) {
    console.error(`Error reading ${page} page content from DB:`, e);
  }
  return null;
}

// Helper to save page content to DB & synchronize with CMS sections
async function savePageContentHelper(page: 'home' | 'about' | 'contact', content: any): Promise<void> {
  const key = `PAGE_CONTENT_${page.toUpperCase()}`;
  const jsonStr = JSON.stringify(content);

  // 1. Update siteSettings
  await db
    .insert(siteSettings)
    .values({ key, value: jsonStr })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: jsonStr },
    });

  // 2. Update cmsSections row for consistency
  const sectionType = `page_content_${page}`;
  const existingSection = await db
    .select()
    .from(cmsSections)
    .where(eq(cmsSections.sectionType, sectionType))
    .limit(1);

  const title = content.hero?.title || content.title || `${page.toUpperCase()} Page`;
  const subtitle = content.hero?.subtitle || content.subtitle || '';
  const description = content.hero?.badge || content.description || '';
  const imageUrl = content.hero?.slides?.[0]?.image || content.story?.imageUrl || content.storeShowcase?.imageUrl || null;

  if (existingSection.length > 0) {
    await db
      .update(cmsSections)
      .set({
        title,
        subtitle,
        description,
        contentJson: jsonStr,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(cmsSections.id, existingSection[0].id));
  } else {
    await db.insert(cmsSections).values({
      sectionType,
      title,
      subtitle,
      description,
      contentJson: jsonStr,
      imageUrl,
      sortOrder: page === 'home' ? 1 : page === 'about' ? 2 : 3,
      isVisible: true,
    });
  }

  // 3. If contact page updated, synchronize core contact info keys in siteSettings
  if (page === 'contact' && content.info) {
    const infoUpdates: Record<string, string> = {};
    if (content.info.phone) infoUpdates['SITE_PHONE'] = content.info.phone;
    if (content.info.address) infoUpdates['SITE_ADDRESS'] = content.info.address;
    if (content.info.email) infoUpdates['SITE_EMAIL'] = content.info.email;
    if (content.info.whatsapp) infoUpdates['WHATSAPP_NUMBER'] = content.info.whatsapp;

    for (const [sKey, sVal] of Object.entries(infoUpdates)) {
      await db
        .insert(siteSettings)
        .values({ key: sKey, value: sVal })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: sVal },
        });
    }
  }
}

// 1. Public endpoint to fetch page content (HomePage, About Us, Contact Us)
apiRouter.get('/public/page-content', async (req: Request, res: Response) => {
  try {
    const pageParam = (req.query.page as string || '').toLowerCase();
    
    if (pageParam === 'home') {
      const saved = await getSavedPageContent('home');
      return res.json({ ...DEFAULT_HOME_CONTENT, ...(saved || {}) });
    }
    if (pageParam === 'about') {
      const saved = await getSavedPageContent('about');
      return res.json({ ...DEFAULT_ABOUT_CONTENT, ...(saved || {}) });
    }
    if (pageParam === 'contact') {
      const saved = await getSavedPageContent('contact');
      return res.json({ ...DEFAULT_CONTACT_CONTENT, ...(saved || {}) });
    }

    // Return all three pages
    const [savedHome, savedAbout, savedContact] = await Promise.all([
      getSavedPageContent('home'),
      getSavedPageContent('about'),
      getSavedPageContent('contact'),
    ]);

    res.json({
      home: { ...DEFAULT_HOME_CONTENT, ...(savedHome || {}) },
      about: { ...DEFAULT_ABOUT_CONTENT, ...(savedAbout || {}) },
      contact: { ...DEFAULT_CONTACT_CONTENT, ...(savedContact || {}) },
    });
  } catch (error: any) {
    console.error('Error in /public/page-content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

// 2. Admin endpoint to fetch all page content
apiRouter.get('/admin/page-content', async (_req: Request, res: Response) => {
  try {
    const [savedHome, savedAbout, savedContact] = await Promise.all([
      getSavedPageContent('home'),
      getSavedPageContent('about'),
      getSavedPageContent('contact'),
    ]);

    res.json({
      home: { ...DEFAULT_HOME_CONTENT, ...(savedHome || {}) },
      about: { ...DEFAULT_ABOUT_CONTENT, ...(savedAbout || {}) },
      contact: { ...DEFAULT_CONTACT_CONTENT, ...(savedContact || {}) },
    });
  } catch (error: any) {
    console.error('Error fetching admin page content:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch page content' });
  }
});

// 3. Admin endpoint to save/update page content
apiRouter.post('/admin/page-content', async (req: Request, res: Response) => {
  try {
    const { page, content } = req.body;
    if (!page || !['home', 'about', 'contact'].includes(page)) {
      return res.status(400).json({ error: 'Valid page (home, about, or contact) is required' });
    }
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content object is required' });
    }

    const key = `PAGE_CONTENT_${page.toUpperCase()}`;
    await savePageContentHelper(page, content);

    // Also synchronize additional contact hours/maps if present
    if (page === 'contact' && content.info) {
      const extraUpdates: Record<string, string> = {};
      if (content.info.operatingHours) extraUpdates['BUSINESS_HOURS'] = content.info.operatingHours;
      if (content.info.googleMapsUrl) extraUpdates['GOOGLE_MAPS_URL'] = content.info.googleMapsUrl;

      for (const [k, v] of Object.entries(extraUpdates)) {
        await db
          .insert(siteSettings)
          .values({ key: k, value: v })
          .onConflictDoUpdate({
            target: siteSettings.key,
            set: { value: v },
          });
      }
    }


    res.json({ success: true, page, content });
  } catch (error: any) {
    console.error('Error saving page content:', error);
    res.status(500).json({ error: error.message || 'Failed to save page content' });
  }
});

// 4. Admin endpoint to reset page content to default
apiRouter.post('/admin/page-content/reset', async (req: Request, res: Response) => {
  try {
    const { page } = req.body;
    if (!page || !['home', 'about', 'contact'].includes(page)) {
      return res.status(400).json({ error: 'Valid page is required' });
    }

    const key = `PAGE_CONTENT_${page.toUpperCase()}`;
    await db.delete(siteSettings).where(eq(siteSettings.key, key));

    const defaultContent =
      page === 'home'
        ? DEFAULT_HOME_CONTENT
        : page === 'about'
        ? DEFAULT_ABOUT_CONTENT
        : DEFAULT_CONTACT_CONTENT;

    res.json({ success: true, page, defaultContent });
  } catch (error: any) {
    console.error('Error resetting page content:', error);
    res.status(500).json({ error: error.message || 'Failed to reset page content' });
  }
});

// Dynamic sitemap.xml generator
apiRouter.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const [allBrands, allModels, allServices, allBlogs, allPages] = await Promise.all([
      db.select({ slug: brands.slug }).from(brands).where(eq(brands.isActive, true)),
      db.select({ slug: models.slug }).from(models).where(eq(models.isActive, true)),
      db.select({ slug: services.slug }).from(services).where(eq(services.isActive, true)),
      db.select({ slug: blogs.slug }).from(blogs).where(eq(blogs.status, 'published')),
      db.select({ slug: customPages.slug }).from(customPages).where(eq(customPages.isPublished, true)),
    ]);

    const baseUrl = process.env.APP_URL || 'https://qaswatelecom.com';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticRoutes = ['', '/mobile-repair', '/brands', '/services', '/gallery', '/testimonials', '/service-centers', '/blogs', '/track-order'];
    staticRoutes.forEach((r) => {
      xml += `  <url><loc>${baseUrl}${r}</loc><priority>0.8</priority></url>\n`;
    });

    allBrands.forEach((b) => {
      xml += `  <url><loc>${baseUrl}/brands/${b.slug}</loc><priority>0.7</priority></url>\n`;
    });
    allServices.forEach((s) => {
      xml += `  <url><loc>${baseUrl}/services/${s.slug}</loc><priority>0.7</priority></url>\n`;
    });
    allBlogs.forEach((b) => {
      xml += `  <url><loc>${baseUrl}/blogs/${b.slug}</loc><priority>0.6</priority></url>\n`;
    });
    allPages.forEach((p) => {
      xml += `  <url><loc>${baseUrl}/${p.slug}</loc><priority>0.5</priority></url>\n`;
    });

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic robots.txt
apiRouter.get('/robots.txt', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://qaswatelecom.com';
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${baseUrl}/api/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});
