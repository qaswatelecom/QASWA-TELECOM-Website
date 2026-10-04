export interface DeviceCategory {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  hasBrands?: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface Brand {
  id: number;
  categoryId?: number | null;
  categorySlug?: string | null;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface Model {
  id: number;
  brandId?: number | null;
  brandName?: string;
  categoryId?: number | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  series?: string | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  displayIssues?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  priceEstimate?: string | null;
  estimatedDuration?: string | null;
  warrantyInfo?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

export interface ModelService {
  id: number;
  modelId: number;
  serviceId: number;
  customPrice?: string | null;
  isActive: boolean;
}

export interface CustomerFormField {
  id: number;
  fieldKey: string;
  label: string;
  placeholder?: string | null;
  fieldType: 'text' | 'tel' | 'email' | 'date' | 'time' | 'textarea';
  isRequired: boolean;
  isEnabled: boolean;
  sortOrder: number;
}

export interface OrderStatus {
  id: number;
  name: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId?: number | null;
  customerName: string;
  customerMobile: string;
  customerWhatsapp?: string | null;
  customerEmail?: string | null;
  customerCity?: string | null;
  customerAddress?: string | null;
  brandId?: number | null;
  brandName: string;
  modelId?: number | null;
  modelName: string;
  serviceId?: number | null;
  serviceName: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  additionalNote?: string | null;
  status: string;
  whatsappClicked: boolean;
  whatsappClickedAt?: string | null;
  source?: string | null;
  deviceMetadata?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  customerId: string;
  name: string;
  mobile: string;
  whatsapp?: string | null;
  email?: string | null;
  city?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceCenter {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp?: string | null;
  mapUrl?: string | null;
  timing?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface CMSSection {
  id: number;
  sectionType: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  contentJson?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  alignment?: string | null;
  sortOrder: number;
  isVisible: boolean;
  updatedAt?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string | null;
  status: 'draft' | 'published';
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  pageTarget?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  customerName: string;
  rating: number;
  review: string;
  photoUrl?: string | null;
  deviceRepaired?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  date?: string | null;
  createdAt?: string;
}

export interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: number;
  name: string;
  url: string;
  altText?: string | null;
  category?: string | null;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  caption?: string | null;
  imageUrl: string;
  beforeImageUrl?: string | null;
  categorySlug?: string | null;
  categoryId?: number | null;
  brandSlug?: string | null;
  brandId?: number | null;
  showOnHomepage: boolean;
  homepageOrder: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  WHATSAPP_NUMBER?: string;
  SITE_NAME?: string;
  SITE_TAGLINE?: string;
  SITE_PHONE?: string;
  SITE_EMAIL?: string;
  SITE_ADDRESS?: string;
  HEADER_CONFIG?: string;
  FOOTER_CONFIG?: string;
  THEME_CONFIG?: string;
  SEO_CONFIG?: string;
  SEO_CONFIG_PAGES?: string;
  [key: string]: string | undefined;
}

export interface PageSeoConfig {
  path: string;
  pageName: string;
  category?: 'Core' | 'Services' | 'Brands' | 'Content' | 'Legal' | 'Custom' | string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogType: string;
  canonicalUrl?: string;
  robots: string;
  twitterCard?: 'summary_large_image' | 'summary' | string;
  author?: string;
  schemaType: string;
  schemaJson: string;
  updatedAt?: string;
  isCustom?: boolean;
}

export interface CustomerEnquiry {
  id: number;
  customerName?: string | null;
  customerPhone?: string | null;
  customerCity?: string | null;
  deviceCategory: string;
  brand: string;
  model: string;
  displayIssue: string;
  customerMessage?: string | null;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed' | string;
  whatsappStatus: string;
  enquiryDate: string;
  enquiryTime: string;
  createdAt: string;
  updatedAt: string;
}


