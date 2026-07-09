"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Added for the loader

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
  
  // ==========================================
  //     LOADING STATE FOR HOME PAGE
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIX: If the user is coming back from an internal page, skip the loading screen
    // document.referrer checks where they came from.
    const isReturningUser = document.referrer && document.referrer.includes(window.location.origin);
    
    if (isReturningUser) {
      setIsLoading(false); // Skip the timer entirely
    } else {
      // Only show loader if they opened the site fresh
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200); // Adjust time as needed

      return () => clearTimeout(timer);
    }
  }, []);

  /* ==========================================
     SCROLL TO SECTIONS WHEN RETURNING
  ========================================== */
  useEffect(() => {
    // We move this inside a setTimeout to ensure the DOM has finished rendering
    // after isLoading becomes false.
    const scrollToSection = () => {
      const hash = window.location.hash;

      if (hash === "#gallery") {
        const section = document.getElementById("gallery");
        if (section) {
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100); // Small delay to ensure DOM is ready
        }
      }

      if (hash === "#services") {
        const section = document.getElementById("services");
        if (section) {
          setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    };

    // Only attempt to scroll after loading is completely done
    if (!isLoading) {
      scrollToSection();
    }

  }, [isLoading]);

 
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

  // ==========================================
  //     BRANDED LOADING SCREEN
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Ambient Glows (Matches your dark theme) */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        {/* =====================================
            LOGO LOADER
        ===================================== */}
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center p-8 relative z-10"
        >
          {/* Orbiting Container */}
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            
            {/* Dotted Orbit Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30"
            />
            
            {/* Inner Ring */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-yellow-400/10"
            />
            
            {/* Rotating glowing dots */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
            </motion.div>

            {/* Central Logo Image */}
            <div className="relative w-16 h-16 z-10 bg-black/80 backdrop-blur-md rounded-full border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.15)] flex items-center justify-center overflow-hidden">
              <img 
                src="/images/logo1.webp" 
                alt="J&K Services Logo" 
                className="w-12 h-12 object-contain" 
              />
            </div>
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-lg font-medium text-gray-300 mb-1 tracking-wide">
              Loading the page
            </h3>
            <div className="flex items-center justify-center gap-1 mt-2">
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} 
                className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              />
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} 
                className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              />
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} 
                className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              />
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    );
  }

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