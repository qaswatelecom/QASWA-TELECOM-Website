import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { PersistentBottomBar } from './components/layout/PersistentBottomBar.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { MobileRepairPage } from './pages/MobileRepairPage.tsx';
import { BrandsPage } from './pages/BrandsPage.tsx';
import { BrandDetailPage } from './pages/BrandDetailPage.tsx';
import { CategoryDetailPage } from './pages/CategoryDetailPage.tsx';
import { ModelDetailPage } from './pages/ModelDetailPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetailPage.tsx';
import { ServiceCentersPage } from './pages/ServiceCentersPage.tsx';
import { TrackOrderPage } from './pages/TrackOrderPage.tsx';
import { BlogsPage } from './pages/BlogsPage.tsx';
import { BlogDetailPage } from './pages/BlogDetailPage.tsx';
import { TestimonialsPage } from './pages/TestimonialsPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { IssuesPage } from './pages/IssuesPage.tsx';
import { CustomPage } from './pages/CustomPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { useAuth } from './context/AuthContext.tsx';
import { generateLocalBusinessSchema, useJsonLd, useDynamicPageSeo } from './lib/seo.ts';

const AppContent: React.FC = () => {
  const { currentPath, settings } = useApp();
  const { isAdmin } = useAuth();

  // Apply dynamic SEO metadata (titles, meta tags, and schema.org JSON-LD) for every page
  useDynamicPageSeo(currentPath, undefined, settings);

  // Injects LocalBusiness schema into document head for QASWA TELECOM
  const localBusinessSchema = React.useMemo(() => {
    return generateLocalBusinessSchema({
      name: settings.SITE_NAME || 'QASWA TELECOM',
      telephone: settings.SITE_PHONE || '+91 9324316048',
      email: settings.SITE_EMAIL || 'telecomqaswa@gmail.com',
      address:
        settings.SITE_ADDRESS ||
        'Shop No-8, 1st Floor, Thakkar Shopping Centre, S.V Road, Borivali West, Mumbai, PIN-400092',
      description:
        settings.SITE_TAGLINE ||
        'Display Repair Specialists for flagship smartphones, iPads, Apple Watches, and tablets in Borivali West, Mumbai.',
    });
  }, [settings]);

  useJsonLd('localbusiness', localBusinessSchema);

  // Route matching helper
  const renderRoute = () => {
    // Explicit Admin Login route
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }

    // Admin dashboard routes (secured)
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      if (!isAdmin) {
        return <AdminLoginPage />;
      }
      return <AdminPage />;
    }

    // Customer routes
    let content: React.ReactNode = null;

    if (currentPath === '/' || currentPath === '') {
      content = <HomePage />;
    } else if (currentPath === '/mobile-repair') {
      content = <MobileRepairPage />;
    } else if (currentPath === '/categories' || currentPath === '/brands') {
      content = <BrandsPage />;
    } else if (
      currentPath === '/mobile' ||
      currentPath === '/repair-brands' ||
      currentPath === '/repair-brands/'
    ) {
      content = <CategoryDetailPage categorySlug="mobile" />;
    } else if (currentPath === '/ipad' || currentPath === '/repair/ipad') {
      if (typeof window !== 'undefined' && window.location.pathname === '/ipad') {
        window.history.replaceState({}, '', '/repair/ipad');
      }
      content = <CategoryDetailPage categorySlug="ipad" />;
    } else if (currentPath === '/apple-watch' || currentPath === '/repair/apple-watch') {
      if (typeof window !== 'undefined' && window.location.pathname === '/apple-watch') {
        window.history.replaceState({}, '', '/repair/apple-watch');
      }
      content = <CategoryDetailPage categorySlug="apple-watch" />;
    } else if (currentPath === '/tablet' || currentPath === '/repair/tablet') {
      if (typeof window !== 'undefined' && window.location.pathname === '/tablet') {
        window.history.replaceState({}, '', '/repair/tablet');
      }
      content = <CategoryDetailPage categorySlug="tablet" />;
    } else if (currentPath.startsWith('/categories/')) {
      const rest = currentPath.replace('/categories/', '');
      const parts = rest.split('/');
      if (parts.length >= 2) {
        if (parts[0] === 'ipad' || parts[0] === 'apple-watch') {
          // Direct model route (e.g. /categories/ipad/ipad-pro-13-m4 or /categories/apple-watch/apple-watch-ultra-2)
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/categories/')) {
            window.history.replaceState({}, '', `/repair/${parts[1]}`);
          }
          content = <ModelDetailPage modelSlug={parts[1]} />;
        } else {
          // e.g. /categories/mobile/apple or /categories/tablet/samsung
          const targetBrand = parts[1] === 'apple' || parts[1] === 'iphone' ? 'apple-iphone' : parts[1];
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/categories/')) {
            window.history.replaceState({}, '', `/repair-models/${parts[0]}/${targetBrand}`);
          }
          content = <BrandDetailPage categorySlug={parts[0]} brandSlug={targetBrand} />;
        }
      } else {
        // e.g. /categories/mobile, /categories/ipad
        const targetPath = parts[0] === 'mobile' ? '/repair-brands' : `/repair/${parts[0]}`;
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/categories/')) {
          window.history.replaceState({}, '', targetPath);
        }
        content = <CategoryDetailPage categorySlug={parts[0]} />;
      }
    } else if (currentPath.startsWith('/repair-models/')) {
      const rest = currentPath.replace('/repair-models/', '');
      const parts = rest.split('/');
      if (parts.length >= 2) {
        // e.g. /repair-models/mobile/apple-iphone or /repair-models/tablet/samsung
        content = <BrandDetailPage categorySlug={parts[0]} brandSlug={parts[1]} />;
      } else if (parts.length === 1 && parts[0]) {
        if (parts[0] === 'mobile' || parts[0] === 'tablet' || parts[0] === 'ipad' || parts[0] === 'apple-watch') {
          content = <CategoryDetailPage categorySlug={parts[0]} />;
        } else {
          content = <BrandDetailPage categorySlug="mobile" brandSlug={parts[0]} />;
        }
      }
    } else if (currentPath.startsWith('/repair/')) {
      const slug = currentPath.replace('/repair/', '');
      content = <ModelDetailPage modelSlug={slug} />;
    } else if (currentPath.startsWith('/models/') || currentPath.startsWith('/model/')) {
      const slug = currentPath.replace(/^\/(models|model)\//, '');
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `/repair/${slug}`);
      }
      content = <ModelDetailPage modelSlug={slug} />;
    } else if (currentPath.startsWith('/brands/')) {
      const slug = currentPath.replace('/brands/', '');
      content = <BrandDetailPage categorySlug="mobile" brandSlug={slug} />;
    } else if (currentPath.startsWith('/repair-brands/')) {
      const slug = currentPath.replace('/repair-brands/', '');
      content = <BrandDetailPage categorySlug="mobile" brandSlug={slug} />;
    } else if (currentPath === '/services') {
      content = <ServicesPage />;
    } else if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '');
      content = <ServiceDetailPage serviceSlug={slug} />;
    } else if (currentPath === '/service-centers') {
      content = <ServiceCentersPage />;
    } else if (currentPath === '/track-order') {
      content = <TrackOrderPage />;
    } else if (currentPath === '/blogs') {
      content = <BlogsPage />;
    } else if (currentPath.startsWith('/blogs/')) {
      const slug = currentPath.replace('/blogs/', '');
      content = <BlogDetailPage slug={slug} />;
    } else if (currentPath === '/gallery') {
      content = <GalleryPage />;
    } else if (currentPath === '/testimonials' || currentPath === '/reviews') {
      content = <TestimonialsPage />;
    } else if (currentPath === '/contact' || currentPath === '/contact-us') {
      content = <ContactPage />;
    } else if (currentPath === '/about' || currentPath === '/about-us') {
      content = <AboutPage />;
    } else if (currentPath === '/terms' || currentPath === '/terms-and-conditions') {
      content = <TermsPage />;
    } else if (currentPath === '/faqs' || currentPath === '/faq') {
      content = <FaqPage />;
    } else if (currentPath === '/issues' || currentPath === '/display-issues') {
      content = <IssuesPage />;
    } else {
      // Custom dynamic pages fallback
      const slug = currentPath.replace(/^\//, '');
      content = <CustomPage slug={slug} />;
    }

    return (
      <div className="flex min-h-screen flex-col bg-[#FFFFFF] text-[#111827] dark:bg-[#0B1110] dark:text-[#F9FAFB] transition-colors duration-200">
        <Header />
        <main className="flex-1">{content}</main>
        <Footer />
        <PersistentBottomBar />
      </div>
    );
  };

  return <>{renderRoute()}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
