import { createPool } from './index.ts';
import { seedDatabaseIfEmpty } from './seed.ts';

export async function ensureDatabaseSchema() {
  const pool = createPool();
  try {
    // 1. Check if public tables already exist
    const checkResult = await pool.query(`
      SELECT count(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('brands', 'users', 'models', 'device_categories');
    `);
    const tableCount = Number(checkResult.rows[0]?.count || 0);

    // If tables already exist (e.g. Cloud SQL or pre-provisioned database), skip DDL completely
    // to avoid "permission denied for schema public" on users without DDL privileges
    if (tableCount >= 2) {
      await seedDatabaseIfEmpty();
      return;
    }

    // Otherwise (e.g. on fresh self-hosted VPS), attempt table creation
    try {
      console.log('Verifying / initializing PostgreSQL database tables...');
      await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        name TEXT,
        role TEXT NOT NULL DEFAULT 'ADMIN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        customer_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        whatsapp TEXT,
        email TEXT,
        city TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS device_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        tagline TEXT,
        description TEXT,
        image_url TEXT,
        icon TEXT,
        has_brands BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        category_id INTEGER,
        category_slug TEXT DEFAULT 'mobile',
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        logo_url TEXT,
        description TEXT,
        seo_title TEXT,
        seo_description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS models (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER,
        category_id INTEGER,
        category_slug TEXT DEFAULT 'mobile',
        series TEXT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        image_url TEXT,
        description TEXT,
        display_issues TEXT,
        seo_title TEXT,
        seo_description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT,
        image_url TEXT,
        description TEXT,
        price_estimate TEXT,
        estimated_duration TEXT,
        warranty_info TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS model_services (
        id SERIAL PRIMARY KEY,
        model_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        custom_price TEXT,
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        customer_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_mobile TEXT NOT NULL,
        customer_whatsapp TEXT,
        customer_email TEXT,
        customer_city TEXT,
        customer_address TEXT,
        brand_id INTEGER,
        brand_name TEXT NOT NULL,
        model_id INTEGER,
        model_name TEXT NOT NULL,
        service_id INTEGER,
        service_name TEXT NOT NULL,
        preferred_date TEXT,
        preferred_time TEXT,
        additional_note TEXT,
        status TEXT NOT NULL DEFAULT 'New',
        whatsapp_clicked BOOLEAN DEFAULT FALSE,
        whatsapp_clicked_at TIMESTAMP,
        source TEXT DEFAULT 'website',
        device_metadata TEXT,
        internal_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_statuses (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL DEFAULT '#00B2A2',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS service_centers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT,
        map_url TEXT,
        timing TEXT,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cms_sections (
        id SERIAL PRIMARY KEY,
        section_type TEXT NOT NULL,
        title TEXT,
        subtitle TEXT,
        description TEXT,
        content_json TEXT,
        image_url TEXT,
        button_text TEXT,
        button_url TEXT,
        alignment TEXT DEFAULT 'center',
        sort_order INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customer_form_fields (
        id SERIAL PRIMARY KEY,
        field_key TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        placeholder TEXT,
        field_type TEXT DEFAULT 'text',
        is_required BOOLEAN DEFAULT TRUE,
        is_enabled BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image TEXT,
        author TEXT,
        category TEXT,
        tags TEXT,
        status TEXT DEFAULT 'published',
        seo_title TEXT,
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        page_target TEXT DEFAULT 'home',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        review TEXT NOT NULL,
        photo_url TEXT,
        device_repaired TEXT,
        is_featured BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS custom_pages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        seo_title TEXT,
        seo_description TEXT,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS media_items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        alt_text TEXT,
        category TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        caption TEXT,
        image_url TEXT NOT NULL,
        before_image_url TEXT,
        category_slug TEXT DEFAULT 'mobile',
        category_id INTEGER,
        brand_slug TEXT,
        brand_id INTEGER,
        show_on_homepage BOOLEAN DEFAULT TRUE,
        homepage_order INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
      );
    `);
      console.log('PostgreSQL database tables verified successfully.');
    } catch (ddlError: any) {
      console.warn('Notice: DDL execution skipped or restricted by database permissions:', ddlError?.message || ddlError);
    }

    // Seed default records if empty
    await seedDatabaseIfEmpty();
  } catch (err: any) {
    console.warn('Database bootstrap notice:', err?.message || err);
  }
}
