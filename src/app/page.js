"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { PopupButton } from "react-calendly";
import React, { useRef, useEffect, useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  Menu,
  X,
  ChevronRight,
  Mic,
  Music,
  Camera,
  Users,
  Network,
  Wrench,
  PenTool,
  Presentation,
} from "lucide-react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function JKServicePage() {
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [donationMenu, setDonationMenu] = React.useState(false);
  const [bookingModal, setBookingModal] = React.useState(false);
  const [bookingModalGS, setBookingModalGS] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState("");
  
  const [openFAQ, setOpenFAQ] = React.useState([]);
  const galleryRef = useRef(null);

  {/* ========== MAKE POP WINDOW TO DISAPPEAR ========== */}
    useEffect(() => {
      const handleScroll = () => {
        setMobileMenu(false);
        setDonationMenu(false);
      };
    
      window.addEventListener("scroll", handleScroll);
    
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    {/* ============== fAQ CONSTANT =============== */}

    const faqData = [
      {
        question: "Who is J&K Service Group?",
        answer:
          "J&K Service Group is a professional multi-service company specializing in event services, networking and IT solutions, photography, videography, DJ entertainment, business consulting, and conference support. Our mission is to deliver premium experiences and reliable solutions tailored to every client’s needs.",
      },
    
      {
        question: "Can I schedule a consultation without paying?",
        answer:
          "Yes. We offer a free 15-minute introductory consultation where clients can discuss their needs, ask questions, and explore possible solutions before committing to a paid consultation or service.",
      },
    
      {
        question: "Are the prices listed on the website final?",
        answer:
          "Not always. The prices displayed on our services are estimated ranges. Final pricing may vary depending on factors such as event size, location, duration, customization, technical requirements, and overall project complexity.",
      },
    
      {
        question: "Do I pay for every consultation after purchasing a service?",
        answer:
          "No. In many cases, once a service agreement is finalized, follow-up discussions directly related to your booked service are included. Additional advanced consultations outside the original project scope may require separate booking.",
      },
    
      {
        question: "Do you travel for events or projects?",
        answer:
          "Yes. We are available for both local and out-of-state projects depending on availability, travel requirements, and scheduling arrangements.",
      },
    
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking as early as possible, especially for weddings, conferences, and large events. Early booking helps secure availability and allows better planning and preparation.",
      },
    
      {
        question: "Do you offer custom packages?",
        answer:
          "Absolutely. We understand every client has unique needs. Custom packages can be created by combining services such as DJ, MC, photography, networking support, videography, and event coordination.",
      },
    
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept secure online payments, card payments, and other approved payment methods depending on the service type and consultation arrangement.",
      },
    ];


  {/* =========== SERVICE CONSTANT ============== */}
  const services = [
    {
      title: "MC Services",
      icon: <Mic className="w-10 h-10" />,
      description:
        "Professional hosting for weddings, conferences, birthdays, and corporate events.",
      price: "$150 - $1,500",
    },
    {
      title: "Event Planning",
      icon: <Calendar className="w-10 h-10" />,
      description:
        "Full event planning and coordination services from beginning to end.",
      price: "$300 - $4,000+",
    },
    {
      title: "DJ Music",
      icon: <Music className="w-10 h-10" />,
      description:
        "Premium DJ services with professional sound and lighting systems.",
      price: "$250 - $2,000+",
    },
    {
      title: "Photography & Videography",
      icon: <Camera className="w-10 h-10" />,
      description:
        "Capture unforgettable moments with cinematic video and photography.",
      price: "$300 - $5,000+",
    },
    {
      title: "Ushers",
      icon: <Users className="w-10 h-10" />,
      description:
        "Professional ushering services for weddings and special events.",
      price: "$75 - $1,000",
    },
    {
      title: "Network Installation",
      icon: <Network className="w-10 h-10" />,
      description:
        "Complete business and residential networking installation solutions.",
      price: "$500 - Custom",
    },
    {
      title: "IT Support",
      icon: <Wrench className="w-10 h-10" />,
      description:
        "Network troubleshooting, upgrades, optimization, and IT consulting.",
      price: "$75/hr - $2,000/month",
    },
    {
      title: "Flyer Design",
      icon: <PenTool className="w-10 h-10" />,
      description:
        "Modern flyer and social media designs for all events and businesses.",
      price: "$50 - $800",
    },
    {
      title: "Conferences",
      icon: <Presentation className="w-10 h-10" />,
      description:
        "Professional speaking engagements and conferences on diverse topics.",
      price: "$200 - Custom",
    },
  ];

  return (
    <main className="bg-black text-white overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="J&K Service Group"
              className="w-14 h-14 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                J&K Service Group
              </h1>

              <p className="text-sm text-gray-300">
                Event • IT • Networking • Media
              </p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#home"
              className="hover:text-yellow-400 transition"
            >
              Home
            </a>

            <a
              href="#services"
              className="hover:text-yellow-400 transition"
            >
              Services
            </a>

            <a
              href="#gallery"
              className="hover:text-yellow-400 transition"
            >
              Gallery
            </a>

            <a
              href="#team"
              className="hover:text-yellow-400 transition"
            >
              Team
            </a>

            <a
              href="#about"
              className="hover:text-yellow-400 transition"
            >
              About
            </a>

            <a
              href="#contact"
              className="hover:text-yellow-400 transition"
            >
              Contact
            </a>

            <div className="relative">

          <button
            onClick={() => setDonationMenu(!donationMenu)}
            className="
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-semibold
              px-6
              py-3
              rounded-full
              transition
              shadow-2xl
            "
          >
            Donate
          </button>

          {donationMenu && (
            <div className="
              absolute
              right-0
              mt-4
              w-64
              bg-black/95
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              p-5
              shadow-2xl
              z-50
            ">

                <h3 className="text-xl font-bold mb-4">
                  Support Our Mission
                </h3>

                <div className="flex flex-col gap-3">

                  <a
                    href="https://buy.stripe.com/8x27sF8IK6at7O5gM5grS00"
                    target="_blank"
                    className="bg-yellow-500 text-black text-center py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
                  >
                    Donate $10
                  </a>

                  <a
                    href="https://buy.stripe.com/fZueV7aQS1Udc4l3ZjgrS03"
                    target="_blank"
                    className="bg-white/10 text-white text-center py-3 rounded-xl hover:bg-white hover:text-black transition"
                  >
                    Donate $25
                  </a>

                  <a
                    href="https://buy.stripe.com/3cI7sF3oqfL39Wd1RbgrS04"
                    target="_blank"
                    className="bg-white/10 text-white text-center py-3 rounded-xl hover:bg-white hover:text-black transition"
                  >
                    Donate $50
                  </a>

                  <a
                    href="https://donate.stripe.com/6oU3cp3oq9mF4BTbrLgrS05"
                    target="_blank"
                    className="border border-yellow-500 text-yellow-400 text-center py-3 rounded-xl hover:bg-yellow-500 hover:text-black transition"
                  >
                    Custom Amount
                  </a>

                </div>
              </div>
            )}

          </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="lg:hidden bg-black/95 border-t border-white/10">
            <div className="flex flex-col p-6 gap-6">
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#gallery">Gallery</a>
              <a href="#team">Team</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>

              <button className="bg-yellow-500 text-black py-3 rounded-full font-semibold">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

              {/* ================= HERO SECTION ================= */}
        <section
          id="home"
          className="
            relative
            min-h-screen
            flex
            items-center
            overflow-hidden
            bg-gradient-to-br
            from-[#f8f8f8]
            via-white
            to-slate-100
            text-black
          "
        >

          {/* SOFT BACKGROUND GLOW */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 blur-[120px] rounded-full"></div>

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/30 blur-[120px] rounded-full"></div>

          {/* HERO VIDEO */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              opacity-[0.10]
            "
          >
            <source src="/videos/net1.mp4" type="video/mp4" />
          </video>

          {/* MAIN CONTENT */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* LEFT SIDE */}
            <div>

              {/* TOP BADGE */}
              <div className="
                inline-flex
                items-center
                gap-3
                bg-white/70
                border
                border-black/10
                rounded-full
                px-5
                py-2
                shadow-lg
                mb-8
              ">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>

                <span className="text-sm tracking-wide font-medium">
                  Professional Multi-Service Company
                </span>
              </div>

              {/* MAIN TITLE */}
              <h1 className="
                text-5xl
                md:text-7xl
                font-black
                leading-tight
              ">
                Turning Your
                <span className="text-yellow-500"> Vision </span>
                Into Reality
              </h1>

              {/* DESCRIPTION */}
              <p className="
                mt-8
                text-xl
                text-gray-700
                leading-relaxed
                max-w-2xl
              ">
                From unforgettable weddings and conferences to
                enterprise-grade networking and IT solutions —
                J&K Service Group delivers professionalism,
                creativity, and excellence.
              </p>

              {/* BUTTONS */}
              <div className="mt-12 flex flex-wrap gap-5">

                {/* BOOK BUTTON */}
                <button
                  onClick={() => setBookingModalGS(true)}
                  className="
                    bg-black
                    hover:bg-yellow-500
                    hover:text-black
                    text-white
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-bold
                    transition
                    shadow-2xl
                    flex
                    items-center
                    gap-2
                  "
                >
                  Book Appointment
                  <ChevronRight />
                </button>

                {/* SERVICES BUTTON */}
                <a
                  href="#services"
                  className="
                    border
                    border-black/20
                    hover:bg-black
                    hover:text-white
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-semibold
                    transition
                    inline-flex
                    items-center
                    justify-center
                  "
                >
                  Explore Services
                </a>

              </div>

              {/* STATS */}
              <div className="mt-16 grid grid-cols-3 gap-8">

                <div>
                  <h3 className="text-4xl font-black text-yellow-500">
                    10+
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Events Served
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-black text-yellow-500">
                    24/7
                  </h3>

                  <p className="text-gray-500 mt-2">
                    IT Support
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-black text-yellow-500">
                    5★
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Client Experience
                  </p>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="flex justify-center mt-16 lg:mt-0">

              <div className="
                bg-white/70
                backdrop-blur-md
                border
                border-black/10
                rounded-[40px]
                p-6 md:p-8 lg:p-10
                shadow-[0_20px_80px_rgba(0,0,0,0.08)]
                w-full max-w-md lg:max-w-lg
              ">

                {/* LOGO */}
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-52 md:w-64 lg:w-72 mx-auto"
                />

                {/* CARDS */}
                <div className="mt-10 space-y-5">

                  {/* CARD 1 */}
                  <div className="
                    bg-white
                    rounded-3xl
                    p-6
                    border
                    border-black/5
                    shadow-lg
                  ">
                    <h3 className="text-xl font-bold">
                      Wedding & Event Services
                    </h3>

                    <p className="text-gray-600 mt-3">
                      MC • DJ • Planning • Photography • Ushers
                    </p>
                  </div>

                  {/* CARD 2 */}
                  <div className="
                    bg-white
                    rounded-3xl
                    p-6
                    border
                    border-black/5
                    shadow-lg
                  ">
                    <h3 className="text-xl font-bold">
                      Networking & IT Solutions
                    </h3>

                    <p className="text-gray-600 mt-3">
                      Installation • Troubleshooting • Consulting
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="
            absolute
            bottom-10
            left-1/2
            -translate-x-1/2
            animate-bounce
          ">
            <div className="
              w-8
              h-14
              border-2
              border-black/40
              rounded-full
              flex
              justify-center
            ">
              <div className="
                w-2
                h-2
                bg-black/50
                rounded-full
                mt-3
              "></div>
            </div>
          </div>

        </section>
{/* ================= SERVICES ================= */}
<section
  id="services"
  className="
    py-28
    relative
    overflow-hidden
    bg-gradient-to-br
    from-black
    via-zinc-900
    to-slate-950
  "
>

  {/* AMBIENT GLOW */}
  <div className="
    absolute
    top-0
    right-0
    w-[500px]
    h-[500px]
    bg-yellow-500/10
    blur-[120px]
    rounded-full
  "></div>

  <div className="
    absolute
    bottom-0
    left-0
    w-[500px]
    h-[500px]
    bg-blue-500/10
    blur-[120px]
    rounded-full
  "></div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">

    {/* TITLE */}
    <div className="text-center mb-20">

      {/* BADGE */}
      <div className="
        inline-flex
        items-center
        gap-2
        bg-white/5
        border
        border-white/10
        rounded-full
        px-5
        py-2
        mb-8
        backdrop-blur-md
      ">
        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>

        <span className="text-yellow-300 text-sm uppercase tracking-wide font-semibold">
          Our Services
        </span>
      </div>

      <h2 className="text-5xl md:text-6xl font-black text-white">
        Premium
        <span className="text-yellow-400"> Solutions</span>
      </h2>

      <p className="text-xl text-gray-400 mt-6 max-w-3xl mx-auto leading-relaxed">
        Professional solutions designed to elevate your events,
        businesses, and digital presence.
      </p>
    </div>

    {/* SERVICES GRID */}
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

      {[
        {
          title: "MC Services",
          image:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400&auto=format&fit=crop",
          description:
            "Professional hosting for weddings, conferences, birthdays, and corporate events.",
          price: "$150 - $1,500",
        },

        {
          title: "Event Planning",
          image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1400&auto=format&fit=crop",
          description:
            "Complete event planning and coordination services from beginning to end.",
          price: "$300 - $4,000+",
        },

        {
          title: "DJ Music",
          image:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1400&auto=format&fit=crop",
          description:
            "Premium DJ services with professional sound and lighting systems.",
          price: "$250 - $2,000+",
        },

        {
          title: "Photography & Videography",
          image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1400&auto=format&fit=crop",
          description:
            "Capture unforgettable moments with cinematic video and photography.",
          price: "$300 - $5,000+",
        },

        {
          title: "Ushers",
          image:
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1400&auto=format&fit=crop",
          description:
            "Professional ushering services for weddings and special events.",
          price: "$75 - $1,000",
        },

        {
          title: "Network Installation",
          image:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
          description:
            "Complete business and residential networking installation solutions.",
          price: "$500 - Custom",
        },

        {
          title: "IT Support",
          image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
          description:
            "Network troubleshooting, upgrades, optimization, and IT consulting.",
          price: "$75/hr - $2,000/month",
        },

        {
          title: "Flyer Design",
          image:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
          description:
            "Modern flyer and social media designs for all events and businesses.",
          price: "$50 - $800",
        },

        {
          title: "Conferences",
          image:
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1400&auto=format&fit=crop",
          description:
            "Professional speaking engagements and conferences on diverse topics.",
          price: "$200 - Custom",
        },
      ].map((service, index) => (
        <div
          key={index}
          className="
            group
            relative
            overflow-hidden
            rounded-[36px]
            h-[500px]
            border
            border-white/10
            hover:border-yellow-500/40
            transition
            duration-500
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          "
        >

          {/* BACKGROUND IMAGE */}
          <img
            src={service.image}
            alt={service.title}
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              group-hover:scale-110
              transition
              duration-700
            "
          />

          {/* OVERLAY */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/50
            to-black/20
          "></div>

          {/* HOVER GLOW */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-br
            from-yellow-500/10
            to-blue-500/10
            opacity-0
            group-hover:opacity-100
            transition
            duration-500
          "></div>

          {/* CONTENT */}
          <div className="
            relative
            z-10
            h-full
            flex
            flex-col
            justify-end
            p-8
          ">

            {/* PRICE */}
            <div className="mb-4">
              <span className="
                bg-yellow-500
                text-black
                px-4
                py-2
                rounded-full
                text-sm
                font-bold
              ">
                {service.price}
              </span>
            </div>

            {/* TITLE */}
            <h3 className="text-3xl font-black mb-4 text-white">
              {service.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="
              text-gray-300
              leading-relaxed
              mb-8
            ">
              {service.description}
            </p>

            {/* BOOK NOW BUTTON */}
            <button
              onClick={() => {
                setSelectedService(service.title);
                setBookingModal(true);
              }}
              className="
                w-full
                bg-yellow-500
                hover:bg-yellow-400
                text-black
                py-4
                rounded-2xl
                font-bold
                text-lg
                transition
                shadow-xl
              "
            >
              Book Now
            </button>

          </div>
        </div>
      ))}

    </div>
  </div>
</section>

{/* ================= GALLERY ================= */}
<section
  id="gallery"
  className="
    py-24
    relative
    overflow-hidden
    bg-gradient-to-br
    from-[#050505]
    via-[#0f172a]
    to-[#111827]
    text-white
  "
>

  {/* AMBIENT GLOWS */}
  <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full"></div>

  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full"></div>

  {/* HEADER */}
  <div className="max-w-7xl mx-auto px-6 mb-16 relative z-20">

    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

      {/* LEFT */}
      <div>

        {/* LABEL */}
        <div className="
          inline-flex
          items-center
          gap-2
          bg-white/5
          border
          border-white/10
          rounded-full
          px-5
          py-2
          mb-6
          backdrop-blur-md
        ">
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>

          <span className="text-yellow-300 tracking-wide text-sm uppercase font-semibold">
            Our Moments
          </span>
        </div>

        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-black leading-tight">
          Events &
          <span className="text-yellow-400"> Experiences</span>
        </h2>
      </div>

      {/* DESCRIPTION */}
      <p className="
        text-gray-300
        text-lg
        max-w-xl
        leading-relaxed
      ">
        Explore highlights from weddings, conferences,
        networking installations, DJ performances,
        photography sessions, and unforgettable moments.
      </p>

    </div>
  </div>

  {/* LEFT BUTTON */}
  <button
    onClick={() => {
      galleryRef.current?.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }}
    className="
      absolute
      left-2 md:left-4
      top-1/2
      -translate-y-1/2
      z-30
      bg-black/60
      hover:bg-yellow-500
      hover:text-black
      border
      border-white/10
      backdrop-blur-xl
      w-12
      h-12
      md:w-14
      md:h-14
      rounded-full
      flex
      items-center
      justify-center
      transition
      shadow-2xl
    "
  >
    <span className="text-xl md:text-2xl font-bold">
      ←
    </span>
  </button>

  {/* RIGHT BUTTON */}
  <button
    onClick={() => {
      galleryRef.current?.scrollBy({
        left: 350,
        behavior: "smooth",
      });
    }}
    className="
      absolute
      right-2 md:right-4
      top-1/2
      -translate-y-1/2
      z-30
      bg-black/60
      hover:bg-yellow-500
      hover:text-black
      border
      border-white/10
      backdrop-blur-xl
      w-12
      h-12
      md:w-14
      md:h-14
      rounded-full
      flex
      items-center
      justify-center
      transition
      shadow-2xl
    "
  >
    <span className="text-xl md:text-2xl font-bold">
      →
    </span>
  </button>

  {/* LEFT FADE */}
  <div className="
    absolute
    left-0
    top-0
    w-32
    h-full
    bg-gradient-to-r
    from-[#050505]
    to-transparent
    z-10
    pointer-events-none
  "></div>

  {/* RIGHT FADE */}
  <div className="
    absolute
    right-0
    top-0
    w-32
    h-full
    bg-gradient-to-l
    from-[#111827]
    to-transparent
    z-10
    pointer-events-none
  "></div>

  {/* SCROLL AREA */}
  <div
    ref={galleryRef}
    className="
      overflow-x-auto
      scrollbar-hide
      snap-x
      snap-mandatory
      relative
      z-20
    "
  >

    <div className="flex gap-8 px-6 w-max pb-4">

      {/* IMAGE */}
      <img
        src="/images/me4.JPG"
        alt="Wedding"
        className="
          w-[380px]
          h-[520px]
          object-cover
          rounded-[36px]
          flex-shrink-0
          snap-center
          hover:scale-[1.02]
          transition
          duration-500
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      />

      {/* IMAGE */}
      <img
        src="/images/Me3.JPG"
        alt="Networking"
        className="
          w-[380px]
          h-[520px]
          object-cover
          rounded-[36px]
          flex-shrink-0
          snap-center
          hover:scale-[1.02]
          transition
          duration-500
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      />

      {/* IMAGE */}
      <img
        src="/images/meoffice.JPG"
        alt="Office"
        className="
          w-[800px]
          h-[520px]
          object-cover
          rounded-[36px]
          flex-shrink-0
          snap-center
          hover:scale-[1.02]
          transition
          duration-500
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      />

      {/* IMAGE */}
      <img
        src="/images/me5.JPG"
        alt="Event"
        className="
          w-[380px]
          h-[520px]
          object-cover
          rounded-[36px]
          flex-shrink-0
          snap-center
          hover:scale-[1.02]
          transition
          duration-500
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      />

      {/* VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          w-[380px]
          h-[520px]
          object-cover
          rounded-[36px]
          flex-shrink-0
          snap-center
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        <source src="/videos/usvideo.MP4" type="video/mp4" />
      </video>

    </div>
  </div>
</section>
{/* ================= TEAM SECTION ================= */}
<section
  id="team"
  className="py-32 bg-gradient-to-b from-black to-slate-950 relative overflow-hidden"
>
  {/* BACKGROUND EFFECTS */}
  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px]" />
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px]" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">

    {/* TITLE */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>

        <span className="text-blue-300 tracking-wide text-sm uppercase">
          Meet Our Team
        </span>
      </div>

      <h2 className="text-5xl md:text-6xl font-black">
        Professionals Behind
        <br />
        The Excellence
      </h2>

      <p className="text-gray-400 text-xl mt-6 max-w-3xl mx-auto">
        A dedicated team passionate about delivering unforgettable
        events and professional technology solutions.
      </p>
    </div>

    {/* TEAM GRID */}
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

      {/* TEAM MEMBER */}
      <div className="group relative overflow-hidden rounded-[36px] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition duration-500">

        <div className="overflow-hidden">
          <img
            src="/images/Me3.JPG"
            alt="Josue Bizazu"
            className="w-full h-130 object-cover group-hover:scale-105 transition duration-700"
          />
        </div>

        <div className="p-8">
          <h3 className="text-3xl font-bold mb-2">
            Josue Bizazu, CEO
          </h3>

          <p className="text-yellow-400 text-lg mb-5">
            Network Engineer, MC, Preacher, and more
          </p>

          <p className="text-gray-400 leading-relaxed">
          A passionate leader, professional MC,
          network engineer, and technology consultant dedicated
          to excellence in both events and IT solutions.
          With years of experience in networking, leadership,
          public speaking, and community engagement, he brings
          professionalism, energy, and vision to every project
          and event he leads.
          </p>
        </div>
        <div style={{ position: "absolute", top: -20, left: -20, background: "#1e40af", borderRadius: 8, padding: "20px 20px", zIndex: 2 }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", position: "relative", left: 20, top: 10}}>5+</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#93c5fd", letterSpacing: "0.1em" , position: "relative", left: 10}}>YEARS EXP.</div>
            </div> 
      </div>
        
      {/* TEAM MEMBER */}
      <div className="group relative overflow-hidden rounded-[36px] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition duration-500">

        <div className="overflow-hidden">
          <img
            src="/images/Kerene.jpeg"
            alt="Event Planner"
            className="w-full h-130 object-cover group-hover:scale-105 transition duration-700"
          />
        </div>

        <div className="p-8">
          <h3 className="text-3xl font-bold mb-2">
            Kerene Bizazu
          </h3>

          <p className="text-yellow-400 text-lg mb-5">
            Universal Banker III, Event Planner, Usher, and more
          </p>

          <p className="text-gray-400 leading-relaxed">
          Universal Banker III with strong
          expertise in customer service, organization, event
          coordination, and time management. Fluent in five
          languages — Lingala, French, English, Portuguese,
          and Spanish — she creates welcoming and professional
          experiences for clients and guests. Her experience
          in ushering and event planning allows her to bring
          structure, elegance, and smooth coordination to every event.
          </p>
        </div>
        <div style={{ position: "absolute", top: -20, left: -20, background: "#1e40af", borderRadius: 8, padding: "20px 20px", zIndex: 2 }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", position: "relative", left: 20, top: 10}}>5+</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#93c5fd", letterSpacing: "0.1em" , position: "relative", left: 10}}>YEARS EXP.</div>
            </div> 
      </div>
      
       {/* TEAM MEMBER */}
       <div className="group relative overflow-hidden rounded-[36px] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition duration-500">

      <div className="overflow-hidden">
        <img
          src="/images/jeremie.jpg"
          alt="Event Planner"
          className="w-full h-130 object-cover group-hover:scale-105 transition duration-700"
        />
      </div>

      <div className="p-8">
        <h3 className="text-3xl font-bold mb-2">
          Jeremie Boko
        </h3>

        <p className="text-yellow-400 text-lg mb-5">
          DJ, Coordinator, and more
        </p>

        <p className="text-gray-400 leading-relaxed">
        Hardworking and highly motivated DJ
        and music professional with experience in live event
        entertainment, sound coordination, and audience engagement.
        Known for his professionalism, teamwork, and energy,
        he creates vibrant atmospheres that make every event
        memorable and enjoyable.
        </p>
      </div>
      <div style={{ position: "absolute", top: -20, left: -20, background: "#1e40af", borderRadius: 8, padding: "20px 20px", zIndex: 2 }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", position: "relative", left: 20, top: 10}}>2+</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#93c5fd", letterSpacing: "0.1em" , position: "relative", left: 10}}>YEARS EXP.</div>
            </div> 
      </div>

      {/* TEAM MEMBER */}
      <div className="group relative overflow-hidden rounded-[36px] bg-white/5 border border-white/10 hover:border-yellow-500/30 transition duration-500">

        <div className="overflow-hidden">
          <img
            src="/images/percy2.png"
            alt="Videographer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
        </div>

        <div className="p-8">
          <h3 className="text-3xl font-bold mb-2">
            Percy Sunda
          </h3>

          <p className="text-yellow-400 text-lg mb-5">
            Photography, Videography, Designer, and more
          </p>

          <p className="text-gray-400 leading-relaxed">
          Talented photographer, videographer,
          and graphic designer with more than 10 years of creative
          experience. He has worked on multiple music video projects,
          weddings, events, and professional media productions.
          His passion for storytelling, visual creativity, and
          attention to detail allows him to capture unforgettable
          moments with cinematic quality and artistic excellence.
          </p>
        </div>
        <div style={{ position: "absolute", top: -20, left: -20, background: "#1e40af", borderRadius: 8, padding: "20px 20px", zIndex: 2 }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", position: "relative", left: 20, top: 10}}>10+</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#93c5fd", letterSpacing: "0.1em" , position: "relative", left: 10}}>YEARS EXP.</div>
            </div> 
      </div>
    </div>
  </div>
</section>

        {/* ================= ABOUT ================= */}
        <section
          id="about"
          className="py-24 px-6 bg-black"
        >
          <div className="max-w-7xl mx-auto">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* IMAGE SIDE */}
              <div className="relative order-1">

                {/* GLOW EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-yellow-500/20 blur-3xl rounded-[40px]"></div>

                {/* IMAGE CARD */}
                <div className="relative bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl overflow-hidden">

                  <img
                    src="/images/logo.png"
                    alt="J&K Service Group"
                    className="
                      w-full
                      max-w-[450px]
                      mx-auto
                      object-contain
                      relative
                      z-10
                    "
                  />
                </div>

                {/* EXPERIENCE BADGE */}
                {/* <div className="
                  absolute
                  -bottom-6
                  right-4
                  md:right-10
                  bg-blue-700
                  rounded-2xl
                  px-6
                  py-4
                  shadow-2xl
                  z-20
                ">
                  <div className="text-3xl font-black text-white">
                    10+
                  </div>

                  <div className="text-xs tracking-[0.2em] text-blue-100">
                    YEARS EXP.
                  </div>
                </div> */}
              </div>

              {/* TEXT SIDE */}
              <div className="order-2">

                {/* LABEL */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>

                  <span className="text-blue-300 tracking-wide text-sm uppercase">
                    Who We Are
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
                  Passion Meets
                  <br />
                  <span className="text-yellow-400">
                    Professionalism
                  </span>
                </h2>

                {/* TEXT */}
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  J&K Services was built on a simple belief:
                  every event deserves to be extraordinary,
                  and every organization deserves reliable
                  technology solutions.
                </p>

                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  With years of hands-on experience in event hosting,
                  networking, IT support, leadership, and media,
                  we combine expertise with dedication in every
                  project we handle.
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-4">

                  {[
                    "Event Expert",
                    "IT Certified",
                    "Community Focused",
                  ].map((tag, index) => (
                    <span
                      key={index}
                      className="
                        px-5
                        py-3
                        rounded-full
                        border
                        border-blue-500/20
                        bg-blue-500/5
                        text-blue-300
                        text-sm
                      "
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

    {/* ================= TESTIMONIALS ================= */}
          <section
            id="testimonials"
            className="
              relative
              py-28
              overflow-hidden
              bg-gradient-to-br
              from-[#1e293b]
              via-[#0f172a]
              to-[#334155]
              text-white
            "
          >

            {/* AMBIENT GLOWS */}
            <div className="
              absolute
              top-0
              left-0
              w-[450px]
              h-[450px]
              bg-yellow-500/10
              blur-[120px]
              rounded-full
            "></div>

            <div className="
              absolute
              bottom-0
              right-0
              w-[450px]
              h-[450px]
              bg-blue-500/10
              blur-[120px]
              rounded-full
            "></div>

            {/* HEADER */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">

              {/* BADGE */}
              <div className="
                inline-flex
                items-center
                gap-2
                bg-white/5
                border
                border-white/10
                rounded-full
                px-5
                py-2
                mb-8
                backdrop-blur-md
              ">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>

                <span className="text-yellow-300 text-sm uppercase tracking-wide font-semibold">
                  Testimonials
                </span>
              </div>

              {/* TITLE */}
              <h2 className="
                text-5xl
                md:text-6xl
                font-black
                leading-tight
              ">
                What Our
                <span className="text-yellow-400"> Clients Say</span>
              </h2>

              {/* DESCRIPTION */}
              <p className="
                mt-6
                text-lg
                text-gray-300
                max-w-3xl
                mx-auto
                leading-relaxed
              ">
                We believe excellence speaks through the experiences
                of our clients. Here are some words from people and
                organizations we’ve proudly served.
              </p>
            </div>

            {/* TESTIMONIAL CARDS */}
            <div className="
              relative
              z-10
              max-w-7xl
              mx-auto
              px-6
              mt-20
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-8
            ">

              {/* CARD 1 */}
              <div className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                rounded-[32px]
                p-8
                transition
                duration-500
                hover:-translate-y-2
                hover:border-yellow-500/40
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              ">

                {/* STARS */}
                <div className="flex gap-1 text-yellow-400 text-xl mb-6">
                  ★★★★★
                </div>

                {/* MESSAGE */}
                <p className="
                  text-gray-300
                  leading-relaxed
                  text-lg
                ">
                  “J&K Service Group transformed our wedding into
                  something unforgettable. Their professionalism,
                  organization, and energy exceeded our expectations.”
                </p>

                {/* CLIENT */}
                <div className="mt-8 flex items-center gap-4">

                  <div className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-yellow-400
                    to-yellow-600
                    flex
                    items-center
                    justify-center
                    text-black
                    font-black
                    text-lg
                  ">
                    A
                  </div>

                  <div>
                    <h4 className="font-bold text-xl">
                      Amanda & Kevin
                    </h4>

                    <p className="text-gray-400">
                      Wedding Clients
                    </p>
                  </div>

                </div>
              </div>

              {/* CARD 2 */}
              <div className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                rounded-[32px]
                p-8
                transition
                duration-500
                hover:-translate-y-2
                hover:border-blue-500/40
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              ">

                {/* STARS */}
                <div className="flex gap-1 text-yellow-400 text-xl mb-6">
                  ★★★★★
                </div>

                {/* MESSAGE */}
                <p className="
                  text-gray-300
                  leading-relaxed
                  text-lg
                ">
                  “Their networking and IT support solved problems
                  we struggled with for months. Reliable, fast,
                  and extremely knowledgeable.”
                </p>

                {/* CLIENT */}
                <div className="mt-8 flex items-center gap-4">

                  <div className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-blue-400
                    to-blue-600
                    flex
                    items-center
                    justify-center
                    text-white
                    font-black
                    text-lg
                  ">
                    M
                  </div>

                  <div>
                    <h4 className="font-bold text-xl">
                      Michael Brown
                    </h4>

                    <p className="text-gray-400">
                      Business Owner
                    </p>
                  </div>

                </div>
              </div>

              {/* CARD 3 */}
              <div className="
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                rounded-[32px]
                p-8
                transition
                duration-500
                hover:-translate-y-2
                hover:border-yellow-500/40
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              ">

                {/* STARS */}
                <div className="flex gap-1 text-yellow-400 text-xl mb-6">
                  ★★★★★
                </div>

                {/* MESSAGE */}
                <p className="
                  text-gray-300
                  leading-relaxed
                  text-lg
                ">
                  “The DJ and MC services brought incredible energy
                  to our conference. Guests were engaged and the
                  atmosphere was exceptional.”
                </p>

                {/* CLIENT */}
                <div className="mt-8 flex items-center gap-4">

                  <div className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-yellow-400
                    to-orange-500
                    flex
                    items-center
                    justify-center
                    text-black
                    font-black
                    text-lg
                  ">
                    S
                  </div>

                  <div>
                    <h4 className="font-bold text-xl">
                      Sarah Johnson
                    </h4>

                    <p className="text-gray-400">
                      Conference Organizer
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </section>

        {/* ================= FAQ SECTION ================= */}
          <section
            id="faq"
            className="
              relative
              py-28
              overflow-hidden
              bg-gradient-to-br
              from-[#f8f8f8]
              via-white
              to-slate-100
              text-black
            "
          >

            {/* BACKGROUND GLOW */}
            <div className="
              absolute
              top-0
              left-0
              w-[450px]
              h-[450px]
              bg-yellow-200/40
              blur-[120px]
              rounded-full
            "></div>

            <div className="
              absolute
              bottom-0
              right-0
              w-[450px]
              h-[450px]
              bg-blue-200/30
              blur-[120px]
              rounded-full
            "></div>

            {/* HEADER */}
            <div className="
              relative
              z-10
              max-w-4xl
              mx-auto
              px-6
              text-center
            ">

              {/* BADGE */}
              <div className="
                inline-flex
                items-center
                gap-2
                bg-yellow-500/10
                border
                border-yellow-500/20
                rounded-full
                px-5
                py-2
                mb-8
                backdrop-blur-md
              ">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>

                <span className="
                  text-yellow-700
                  text-sm
                  uppercase
                  tracking-wide
                  font-semibold
                ">
                  Frequently Asked Questions
                </span>
              </div>

              {/* TITLE */}
              <h2 className="
                text-5xl
                md:text-6xl
                font-black
                leading-tight
              ">
                Questions &
                <span className="text-yellow-500"> Answers</span>
              </h2>

              {/* DESCRIPTION */}
              <p className="
                mt-6
                text-lg
                text-gray-600
                leading-relaxed
                max-w-3xl
                mx-auto
              ">
                Everything you need to know about our services,
                consultations, pricing, and how we work with clients.
              </p>

            </div>

            {/* FAQ CONTENT */}
            <div className="
              relative
              z-10
              max-w-5xl
              mx-auto
              px-6
              mt-20
            ">

              {/* EXPAND ALL BUTTON */}
              <div className="flex justify-end mb-8">

                <button
                  onClick={() => {
                    const allIndexes = faqData.map((_, index) => index);

                    if (openFAQ.length === faqData.length) {
                      setOpenFAQ([]);
                    } else {
                      setOpenFAQ(allIndexes);
                    }
                  }}
                  className="
                    bg-black
                    hover:bg-yellow-500
                    hover:text-black
                    text-white
                    px-6
                    py-3
                    rounded-full
                    font-semibold
                    transition
                    shadow-xl
                  "
                >
                  {openFAQ.length === faqData.length
                    ? "Close All"
                    : "Expand All"}
                </button>

              </div>

              {/* FAQ ITEMS */}
              <div className="space-y-6">

                {faqData.map((faq, index) => (

                  <div
                    key={index}
                    className="
                      bg-white/70
                      backdrop-blur-xl
                      border
                      border-black/5
                      rounded-[28px]
                      overflow-hidden
                      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                      transition
                      duration-300
                      hover:shadow-[0_20px_80px_rgba(0,0,0,0.12)]
                    "
                  >

                    {/* QUESTION */}
                    <button
                      onClick={() => {
                        if (openFAQ.includes(index)) {
                          setOpenFAQ(
                            openFAQ.filter((item) => item !== index)
                          );
                        } else {
                          setOpenFAQ([...openFAQ, index]);
                        }
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        text-left
                        p-8
                      "
                    >

                      <h3 className="
                        text-xl
                        md:text-2xl
                        font-bold
                        pr-6
                      ">
                        {faq.question}
                      </h3>

                      {/* ARROW */}
                      <div
                        className={`
                          text-3xl
                          font-light
                          transition
                          duration-300
                          ${openFAQ.includes(index)
                            ? "rotate-180 text-yellow-500"
                            : "rotate-0 text-black"}
                        `}
                      >
                        ↓
                      </div>

                    </button>

                    {/* ANSWER */}
                    <div
                      className={`
                        overflow-hidden
                        transition-all
                        duration-500
                        ${
                          openFAQ.includes(index)
                            ? "max-h-[500px] opacity-100 pb-8 px-8"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >

                      <p className="
                        text-gray-600
                        leading-relaxed
                        text-lg
                      ">
                        {faq.answer}
                      </p>

                    </div>

                  </div>

                ))}

              </div>
            </div>
          </section>


      {/* ================= SCHEDULE ================= */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-blue-900"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Ready To Work With Us?
          </h2>

          <p className="text-xl mt-8 text-white/90 leading-relaxed">
            Let’s bring your event or business vision to life with professional
            service and unmatched dedication.
          </p>

           <button
            onClick={() => setBookingModalGS(true)}
            className="
              mt-10
              bg-black
              hover:bg-white
              hover:text-black
              text-white
              px-10
              py-5
              rounded-full
              text-xl
              font-bold
              transition
              shadow-2xl
            "
          >
            Schedule Consultation
          </button>
        </div>
      </section>

        {/* ================= BOOKING MODAL ================= */}
        {bookingModal && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              bg-black/80
              backdrop-blur-md
              flex
              items-center
              justify-center
              px-6
            "
          >

            {/* MODAL CARD */}
            <div className="
              bg-zinc-950
              border
              border-white/10
              rounded-[32px]
              p-10
              max-w-lg
              w-full
              relative
              shadow-2xl
            ">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setBookingModal(false)}
                className="
                  absolute
                  top-5
                  right-5
                  text-white
                  hover:text-yellow-400
                  text-2xl
                "
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-4xl font-black mb-4 text-center">
                Choose Your Consultation
              </h2>

              <p className="text-gray-400 text-center mb-10">
                Select your preferred consultation duration.
              </p>

              {/* OPTIONS */}
              <div className="flex flex-col gap-5">


                 {/* Free consultation 15MIN */}
                 <PopupButton
                  url={`https://calendly.com/josuebizazu60/new-meeting-1?a1=${encodeURIComponent(selectedService)}`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="15 Minutes - Free Consultaion"
                  className="
                    bg-blue-500
                    hover:bg-blue-400
                    text-black
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

                {/* 30 MIN */}
                <PopupButton
                  url={`https://calendly.com/josuebizazu60/30min?a1=${encodeURIComponent(selectedService)}`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="30 Minutes - $25"
                  className="
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-black
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

                {/* 1 HOUR */}
                <PopupButton
                  url={`https://calendly.com/josuebizazu60/new-meeting?a1=${encodeURIComponent(selectedService)}`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="1 Hour - $50"
                  className="
                    border
                    border-white/20
                    hover:bg-white
                    hover:text-black
                    text-white
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

              </div>
            </div>
          </div>
        )}



        {/* ================= BOOKING MODAL GS================= */}
        {bookingModalGS && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              bg-black/80
              backdrop-blur-md
              flex
              items-center
              justify-center
              px-6
            "
          >

            {/* MODAL CARD */}
            <div className="
              bg-zinc-950
              border
              border-white/10
              rounded-[32px]
              p-10
              max-w-lg
              w-full
              relative
              shadow-2xl
            ">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setBookingModalGS(false)}
                className="
                  absolute
                  top-5
                  right-5
                  text-white
                  hover:text-yellow-400
                  text-2xl
                "
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-4xl font-black mb-4 text-center">
                Choose Your Consultation
              </h2>

              <p className="text-gray-400 text-center mb-10">
                Select your preferred consultation duration.
              </p>

              {/* OPTIONS */}
              <div className="flex flex-col gap-5">


                 {/* Free consultation 15MIN */}
                 <PopupButton
                  url={`https://calendly.com/josuebizazu60/new-meeting-1?a1=General%20Consultation`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="15 Minutes - Free Consultaion"
                  className="
                    bg-blue-500
                    hover:bg-blue-400
                    text-black
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

                {/* 30 MIN */}
                <PopupButton
                  url={`https://calendly.com/josuebizazu60/30min?a1=General%20Consultation`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="30 Minutes - $25"
                  className="
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-black
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

                {/* 1 HOUR */}
                <PopupButton
                  url={`https://calendly.com/josuebizazu60/new-meeting?a1=General%20Consultation`}
                  rootElement={
                    typeof window !== "undefined"
                      ? document.body
                      : undefined
                  }
                  text="1 Hour - $50"
                  className="
                    border
                    border-white/20
                    hover:bg-white
                    hover:text-black
                    text-white
                    py-5
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    w-full
                  "
                />

              </div>
            </div>
          </div>
        )}



      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="bg-black border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-24 mb-6"
            />

            <p className="text-gray-400 leading-relaxed">
              Professional event, IT, networking, and creative services focused
              on excellence and innovation.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Services</h3>

            <ul className="space-y-3 text-gray-400">
              <li>MC Services</li>
              <li>DJ Music</li>
              <li>Event Planning</li>
              <li>Networking</li>
              <li>IT Support</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>About Us</li>
              <li>Book Appointment</li>
              <li>Pricing</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact</h3>

            <div className="space-y-5 text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="text-yellow-400" size={20} />
                <span>(319) 361-3575</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={20} />
                <span>info@myjkservices.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={20} />
                <span>support@myjkservices.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={20} />
                <span>booking@myjkservices.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-yellow-400" size={20} />
                <span>Available 7 Days a Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 py-6 text-center text-gray-500">
          © 2026 J&K Service Group. All rights reserved.
        </div>
      </footer>
    </main>
  );
}