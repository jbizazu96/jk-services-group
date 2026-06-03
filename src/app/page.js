"use client";

import { useState, useEffect } from "react";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategoryServicesPage from "@/components/home/CategoryServicesPage";
import PortfolioSection from "@/components/home/PortfolioSection";
import TeamSection from "@/components/home/TeamSection";
import AboutSection from "@/components/home/AboutSection";
import FAQSection from "@/components/home/FAQSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";
import ConsultationModal from "@/components/home/modals/ConsultationModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationType, setConsultationType] = useState("General");

  /* ==========================================
     SCROLL TO PORTFOLIO WHEN RETURNING
  ========================================== */
  useEffect(() => {
    const scrollToGallery = () => {
      if (window.location.hash === "#gallery") {
        const section = document.getElementById("gallery");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    // Run immediately
    scrollToGallery();

    // Run again after components finish rendering
    const timer = setTimeout(scrollToGallery, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* ==========================================
     OPEN SERVICE BOOKING
  ========================================== */
  const openServiceBooking = (serviceName) => {
    setConsultationType(serviceName);
    setIsModalOpen(true);
  };

  /* ==========================================
     OPEN GENERAL BOOKING
  ========================================== */
  const openGeneralBooking = () => {
    setConsultationType("General");
    setIsModalOpen(true);
  };

  /* ==========================================
     PAGE
  ========================================== */
  return (
    <main className="bg-black text-white overflow-hidden">
      {/* NAVIGATION */}
      <Navbar />

      {/* HERO */}
      <HeroSection
        setBookingModalGS={openGeneralBooking}
      />

      {/* SERVICES */}
      <CategoryServicesPage
        onBookService={openServiceBooking}
      />

      {/* PORTFOLIO */}
      <PortfolioSection />

      {/* TEAM */}
      <TeamSection />

      {/* ABOUT */}
      <AboutSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection
        setBookingModalGS={openGeneralBooking}
      />

      {/* FOOTER */}
      <FooterSection />

      {/* CONSULTATION MODAL */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        consultationType={consultationType}
      />
    </main>
  );
}