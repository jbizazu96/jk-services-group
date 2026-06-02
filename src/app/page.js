"use client";

import { useState } from "react";
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

  // Helper function to open modal with specific service
  const openServiceBooking = (serviceName) => {
    setConsultationType(serviceName);
    setIsModalOpen(true);
  };

  const openGeneralBooking = () => {
    setConsultationType("General");
    setIsModalOpen(true);
  };

  return (
    <main className="bg-black text-white overflow-hidden">
      <Navbar />
      <HeroSection setBookingModalGS={openGeneralBooking} />
      <CategoryServicesPage
        onBookService={openServiceBooking}  // renamed prop
      />
      <PortfolioSection />
      <TeamSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection setBookingModalGS={openGeneralBooking} />
      <FooterSection />

      {/* Single modal for everything */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        consultationType={consultationType}
      />
    </main>
  );
}