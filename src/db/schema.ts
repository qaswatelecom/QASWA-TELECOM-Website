import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('ADMIN'), // 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  customerId: text('customer_id').notNull().unique(),
  name: text('name').notNull(),
  mobile: text('mobile').notNull(),
  whatsapp: text('whatsapp'),
  email: text('email'),
  city: text('city'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const deviceCategories = pgTable('device_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tagline: text('tagline'),
  description: text('description'),
  imageUrl: text('image_url'),
  icon: text('icon'),
  hasBrands: boolean('has_brands').default(true),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => deviceCategories.id),
  categorySlug: text('category_slug').default('mobile'),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  logoUrl: text('logo_url'),
  description: text('description'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const models = pgTable('models', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => brands.id),
  categoryId: integer('category_id').references(() => deviceCategories.id),
  categorySlug: text('category_slug').default('mobile'),
  series: text('series'),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  description: text('description'),
  displayIssues: text('display_issues'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon'),
  imageUrl: text('image_url'),
  description: text('description'),
  priceEstimate: text('price_estimate'),
  estimatedDuration: text('estimated_duration'),
  warrantyInfo: text('warranty_info'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const modelServices = pgTable('model_services', {
  id: serial('id').primaryKey(),
  modelId: integer('model_id').references(() => models.id).notNull(),
  serviceId: integer('service_id').references(() => services.id).notNull(),
  customPrice: text('custom_price'),
  isActive: boolean('is_active').default(true),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerId: integer('customer_id').references(() => customers.id),
  customerName: text('customer_name').notNull(),
  customerMobile: text('customer_mobile').notNull(),
  customerWhatsapp: text('customer_whatsapp'),
  customerEmail: text('customer_email'),
  customerCity: text('customer_city'),
  customerAddress: text('customer_address'),
  brandId: integer('brand_id').references(() => brands.id),
  brandName: text('brand_name').notNull(),
  modelId: integer('model_id').references(() => models.id),
  modelName: text('model_name').notNull(),
  serviceId: integer('service_id').references(() => services.id),
  serviceName: text('service_name').notNull(),
  preferredDate: text('preferred_date'),
  preferredTime: text('preferred_time'),
  additionalNote: text('additional_note'),
  status: text('status').notNull().default('New'),
  whatsappClicked: boolean('whatsapp_clicked').default(false),
  whatsappClickedAt: timestamp('whatsapp_clicked_at'),
  source: text('source').default('website'),
  deviceMetadata: text('device_metadata'),
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderStatuses = pgTable('order_statuses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull().default('#00B2A2'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
});

export const serviceCenters = pgTable('service_centers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  mapUrl: text('map_url'),
  timing: text('timing'),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cmsSections = pgTable('cms_sections', {
  id: serial('id').primaryKey(),
  sectionType: text('section_type').notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  description: text('description'),
  contentJson: text('content_json'),
  imageUrl: text('image_url'),
  buttonText: text('button_text'),
  buttonUrl: text('button_url'),
  alignment: text('alignment').default('center'),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const customerFormFields = pgTable('customer_form_fields', {
  id: serial('id').primaryKey(),
  fieldKey: text('field_key').notNull().unique(),
  label: text('label').notNull(),
  placeholder: text('placeholder'),
  fieldType: text('field_type').default('text'),
  isRequired: boolean('is_required').default(true),
  isEnabled: boolean('is_enabled').default(true),
  sortOrder: integer('sort_order').default(0),
});

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  author: text('author'),
  category: text('category'),
  tags: text('tags'),
  status: text('status').default('published'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').default('General'),
  pageTarget: text('page_target').default('home'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').default(5),
  review: text('review').notNull(),
  photoUrl: text('photo_url'),
  deviceRepaired: text('device_repaired'),
  isFeatured: boolean('is_featured').default(true),
  isPublished: boolean('is_published').default(true),
  date: text('date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customPages = pgTable('custom_pages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mediaItems = pgTable('media_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  altText: text('alt_text'),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  caption: text('caption'),
  imageUrl: text('image_url').notNull(),
  beforeImageUrl: text('before_image_url'),
  categorySlug: text('category_slug').default('mobile'),
  categoryId: integer('category_id').references(() => deviceCategories.id),
  brandSlug: text('brand_slug'),
  brandId: integer('brand_id').references(() => brands.id),
  showOnHomepage: boolean('show_on_homepage').default(true),
  homepageOrder: integer('homepage_order').default(0),
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
});

// Relations
export const deviceCategoriesRelations = relations(deviceCategories, ({ many }) => ({
  brands: many(brands),
  models: many(models),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  category: one(deviceCategories, {
    fields: [brands.categoryId],
    references: [deviceCategories.id],
  }),
  models: many(models),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
  category: one(deviceCategories, {
    fields: [models.categoryId],
    references: [deviceCategories.id],
  }),
  modelServices: many(modelServices),
}));

export const modelServicesRelations = relations(modelServices, ({ one }) => ({
  model: one(models, {
    fields: [modelServices.modelId],
    references: [models.id],
  }),
  service: one(services, {
    fields: [modelServices.serviceId],
    references: [services.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  brand: one(brands, {
    fields: [orders.brandId],
    references: [brands.id],
  }),
  model: one(models, {
    fields: [orders.modelId],
    references: [models.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));
