import React, { useState, useEffect } from 'react';
import { QaswaHero } from '../components/home/QaswaHero.tsx';
import { FastEasyBookingCard } from '../components/home/FastEasyBookingCard.tsx';
import { ExploreTopBrands } from '../components/home/ExploreTopBrands.tsx';
import { BuzzmeehTrustCards } from '../components/home/BuzzmeehTrustCards.tsx';
import { BuzzmeehNumberedSections } from '../components/home/BuzzmeehNumberedSections.tsx';
import { SearchBrandModal } from '../components/home/SearchBrandModal.tsx';
import { AboutSection } from '../components/home/AboutSection.tsx';
import { RepairProcess } from '../components/home/RepairProcess.tsx';
import { CustomerReviews } from '../components/home/CustomerReviews.tsx';
import { RepairGallery } from '../components/home/RepairGallery.tsx';
import { DisplayBlogs } from '../components/home/DisplayBlogs.tsx';
import { FaqSection } from '../components/home/FaqSection.tsx';
import { ContactSection } from '../components/home/ContactSection.tsx';

export const HomePage: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('Mobile');
  const [selectedFault, setSelectedFault] = useState<string>('Screen Issue (Broken / Cracked)');

  // Handle hash scrolling on page load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleSelectCategory = (catName: string) => {
    setSelectedDevice(catName);
    const bookingEl = document.getElementById('fast-booking-card');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProblem = (device: string, fault: string) => {
    setSelectedDevice(device);
    setSelectedFault(fault);
    const bookingEl = document.getElementById('fast-booking-card');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectModelFromSearch = (modelName: string, category: string) => {
    setSelectedDevice(category);
    const bookingEl = document.getElementById('fast-booking-card');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 sm:pb-0">
      {/* Search Modal */}
      <SearchBrandModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectModel={handleSelectModelFromSearch}
      />

      {/* 1. QASWA TELECOM Hero: Search Bar + Carousel Banner + Device Grid */}
      <section id="hero">
        <QaswaHero
          onSelectCategory={handleSelectCategory}
          onSearchFocus={() => setSearchModalOpen(true)}
        />
      </section>

      {/* 2. Fast & Easy Booking Card */}
      <FastEasyBookingCard
        preselectedDevice={selectedDevice}
        preselectedFault={selectedFault}
      />

      {/* NEW: Explore Top Brands Section (Matching screenshot design) */}
      <ExploreTopBrands />

      {/* 3. One Trusted Place for All Your Flagship Display Repairs (Trust Cards) */}
      <BuzzmeehTrustCards />

      {/* 4. QASWA TELECOM Signature Numbered Showcases (01, 02, 03, 04) with Interactive Problem Grids */}
      <BuzzmeehNumberedSections
        onSelectProblem={handleSelectProblem}
      />

      {/* 5. Cleanroom Engineering & About Us */}
      <AboutSection />

      {/* 6. Simple 4-Step Repair Process */}
      <RepairProcess />

      {/* 7. Customer Testimonials – Automatic Slideshow */}
      <CustomerReviews />

      {/* 8. New Gallery Section on the Homepage (positioned below Customer Testimonials) – Automatic Slideshow */}
      <RepairGallery />

      {/* 9. Blogs & Articles – Automatic Slideshow */}
      <DisplayBlogs />

      {/* 10. Interactive Frequently Asked Questions */}
      <FaqSection />

      {/* 10. Contact Section with Google Maps & Details */}
      <ContactSection />
    </div>
  );
};
