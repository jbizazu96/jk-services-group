"use client";

/* ==========================================
   REACT
========================================== */

import {
  useState,
} from "react";

/* ==========================================
   HOME COMPONENTS
========================================== */

import Navbar from "@/components/home/Navbar";

import HeroSection from "@/components/home/HeroSection";

import ServicesSection from "@/components/home/ServicesSection";

import PortfolioSection from "@/components/home/PortfolioSection";

import TeamSection from "@/components/home/TeamSection";

import AboutSection from "@/components/home/AboutSection";

import FAQSection from "@/components/home/FAQSection";

import TestimonialsSection from "@/components/home/TestimonialsSection";

import CTASection from "@/components/home/CTASection";

import FooterSection from "@/components/home/FooterSection";

/* ==========================================
   MODALS
========================================== */

import BookingModal from "@/components/home/modals/BookingModal";

import GeneralBookingModal from "@/components/home/modals/GeneralBookingModal";

/* ==========================================
   PAGE
========================================== */

export default function HomePage() {

  /* ==========================================
     MODAL STATES
  ========================================== */

  const [
    bookingModal,
    setBookingModal,
  ] = useState(false);

  const [
    bookingModalGS,
    setBookingModalGS,
  ] = useState(false);

  const [
    selectedService,
    setSelectedService,
  ] = useState("");

  /* ==========================================
     JSX
  ========================================== */

  return (

    <main className="
      bg-black
      text-white
      overflow-hidden
    ">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <Navbar />

      {/* ==========================================
          HERO
      ========================================== */}

      <HeroSection

        setBookingModalGS={
          setBookingModalGS
        }

      />

      {/* ==========================================
          SERVICES
      ========================================== */}

      <ServicesSection

        setSelectedService={
          setSelectedService
        }

        setBookingModal={
          setBookingModal
        }

      />

      {/* ==========================================
          PORTFOLIO
      ========================================== */}

      <PortfolioSection />

      {/* ==========================================
          TEAM
      ========================================== */}

      <TeamSection />

      {/* ==========================================
          ABOUT
      ========================================== */}

      <AboutSection />

      {/* ==========================================
          TESTIMONIALS
      ========================================== */}

      <TestimonialsSection />

      {/* ==========================================
          FAQ
      ========================================== */}

      <FAQSection />

      {/* ==========================================
          CTA
      ========================================== */}

      <CTASection

        setBookingModalGS={
          setBookingModalGS
        }

      />

      {/* ==========================================
          FOOTER
      ========================================== */}

      <FooterSection />

      {/* ==========================================
          SERVICE BOOKING MODAL
      ========================================== */}

      <BookingModal

        bookingModal={
          bookingModal
        }

        setBookingModal={
          setBookingModal
        }

        selectedService={
          selectedService
        }

      />

      {/* ==========================================
          GENERAL CONSULTATION MODAL
      ========================================== */}

      <GeneralBookingModal

        bookingModalGS={
          bookingModalGS
        }

        setBookingModalGS={
          setBookingModalGS
        }

      />

    </main>

  );
}