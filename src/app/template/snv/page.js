"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Camera,
  ChevronDown,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Star,
  Sparkles,
  Menu,
  X,
  CheckCircle2,
  Eye,
  Heart,
  Share2,
} from "lucide-react";

/* ==========================================
   ANIMATION VARIANTS
========================================== */
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const revealFromLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const revealFromRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

/* ==========================================
   PORTFOLIO DATA
========================================== */
const selectedWorks = [
  { id: 1, title: "Golden Hour Wedding", category: "Wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop", size: "tall" },
  { id: 2, title: "Urban Portrait Series", category: "Portrait", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", size: "wide" },
  { id: 3, title: "Mountain Elopement", category: "Wedding", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=600&fit=crop", size: "tall" },
  { id: 4, title: "City Lights Fashion", category: "Fashion", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop", size: "square" },
  { id: 5, title: "Sunset Engagement", category: "Engagement", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=500&fit=crop", size: "wide" },
  { id: 6, title: "Editorial Beauty", category: "Fashion", image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&h=700&fit=crop", size: "tall" },
  { id: 7, title: "Intimate Ceremony", category: "Wedding", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&h=450&fit=crop", size: "wide" },
  { id: 8, title: "Studio Portrait", category: "Portrait", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop", size: "square" },
];

const fullPortfolio = [
  ...selectedWorks,
  { id: 9, title: "Beach Love Story", category: "Engagement", image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500&h=600&fit=crop", size: "tall" },
  { id: 10, title: "Autumn Vibes", category: "Portrait", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=450&fit=crop", size: "wide" },
  { id: 11, title: "Luxury Event", category: "Event", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=500&fit=crop", size: "square" },
  { id: 12, title: "Boho Bridal", category: "Wedding", image: "https://images.unsplash.com/photo-1523438885200-e635ba2d3715?w=500&h=700&fit=crop", size: "tall" },
];

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function PhotographyPage() {
  const [activePage, setActivePage] = useState("HOME");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [hoveredWork, setHoveredWork] = useState(null);

  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setContactSubmitted(false), 4000);
    }
  };

  const scrollToPortfolio = () => {
    setActivePage("HOME");
    setTimeout(() => {
      document.getElementById("selected-works")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navLinks = ["HOME", "PORTFOLIO", "ABOUT", "CONTACT"];

  return (
    <div className="relative min-h-screen bg-black">
      
      {/* ==========================================
          BACKGROUND EFFECTS
      ========================================== */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-950/10 to-black pointer-events-none" />
      <div className="fixed top-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-blue-600/3 blur-[220px] pointer-events-none" />
      <div className="fixed bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-blue-400/5 blur-[150px] pointer-events-none" />

      {/* ==========================================
          HEADER / NAVIGATION
      ========================================== */}
      <motion.header
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl border-b border-blue-900/30 shadow-2xl shadow-blue-900/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-5">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="relative w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 p-[2px] shadow-lg shadow-blue-500/30">
              <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-widest text-white">
              SNV<span className="text-blue-400">PHOTO</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 items-center">
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                onClick={() => setActivePage(link)}
                className={`text-xs font-semibold tracking-[0.2em] transition-all duration-300 relative py-2 ${
                  activePage === link
                    ? "text-blue-400"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link}
                {activePage === link && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-blue-900/30 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => { setActivePage(link); setMobileMenuOpen(false); }}
                    className={`text-sm font-semibold tracking-widest py-3 transition-all ${
                      activePage === link ? "text-blue-400" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          HOME PAGE
      ========================================== */}
      {activePage === "HOME" && (
        <>
          {/* SECTION 1: HERO */}
          <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1600&h=1000&fit=crop"
                alt="SNV Photography Hero"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-flex items-center gap-3 rounded-full border border-blue-500/40 bg-blue-500/10 backdrop-blur-md px-6 py-3 mb-10"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold tracking-[0.3em] text-blue-300 uppercase">
                    Fine Art Photography
                  </span>
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-none"
              >
                SNV{" "}
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                  PHOTO
                </span>
                GRAPHY
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              >
                Capturing timeless moments with artistry and passion. Every frame tells a story worth remembering forever.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(59,130,246,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePage("PORTFOLIO")}
                  className="group relative rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-10 py-5 text-white font-semibold tracking-wider overflow-hidden shadow-2xl shadow-blue-600/30"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    VIEW PORTFOLIO
                    <motion.span
                      animate={{ x: [0, 8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
              <span className="text-xs text-gray-500 tracking-[0.3em] uppercase">Scroll</span>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-6 h-10 rounded-full border-2 border-blue-500/30 flex items-start justify-center p-1.5"
              >
                <motion.div className="w-1.5 h-3 rounded-full bg-blue-400" />
              </motion.div>
            </motion.div>
          </section>

          {/* SECTION 2: SELECTED WORKS */}
          <section id="selected-works" className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-20"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-5 py-2 mb-8">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
                    Featured Work
                  </span>
                </motion.div>
                <motion.h2
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                >
                  SELECTED{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    WORKS
                  </span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-xl mx-auto font-light">
                  A curated collection of our finest moments captured through the lens.
                </motion.p>
              </motion.div>

              {/* Masonry Grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
              >
                {selectedWorks.map((work) => (
                  <motion.div
                    key={work.id}
                    variants={fadeInUp}
                    onMouseEnter={() => setHoveredWork(work.id)}
                    onMouseLeave={() => setHoveredWork(null)}
                    className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative w-full">
                      <Image
                        src={work.image}
                        alt={work.title}
                        width={600}
                        height={work.size === "tall" ? 800 : work.size === "wide" ? 400 : 500}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: hoveredWork === work.id ? 1 : 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 transition-opacity"
                      >
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredWork === work.id ? 0 : 20, opacity: hoveredWork === work.id ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-blue-400 text-sm tracking-widest uppercase mb-2"
                        >
                          {work.category}
                        </motion.p>
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredWork === work.id ? 0 : 20, opacity: hoveredWork === work.id ? 1 : 0 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                          className="text-white text-2xl font-bold"
                        >
                          {work.title}
                        </motion.h3>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: hoveredWork === work.id ? 0 : 20, opacity: hoveredWork === work.id ? 1 : 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="flex gap-3 mt-4"
                        >
                          <button className="rounded-full bg-white/20 backdrop-blur-md p-2 hover:bg-white/30 transition-all">
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                          <button className="rounded-full bg-white/20 backdrop-blur-md p-2 hover:bg-white/30 transition-all">
                            <Heart className="w-4 h-4 text-white" />
                          </button>
                          <button className="rounded-full bg-white/20 backdrop-blur-md p-2 hover:bg-white/30 transition-all">
                            <Share2 className="w-4 h-4 text-white" />
                          </button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* SECTION 3: FOOTER */}
          <Footer
            contactForm={contactForm}
            setContactForm={setContactForm}
            contactSubmitted={contactSubmitted}
            handleContactSubmit={handleContactSubmit}
          />
        </>
      )}

      {/* ==========================================
          PORTFOLIO PAGE
      ========================================== */}
      {activePage === "PORTFOLIO" && (
        <section className="py-24 px-6 min-h-screen bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-5 py-2 mb-8">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
                  Our Collection
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                PORT
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  FOLIO
                </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-xl mx-auto font-light">
                Explore our complete collection of photographic stories and visual narratives.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {fullPortfolio.map((work) => (
                <motion.div
                  key={work.id}
                  variants={fadeInUp}
                  onMouseEnter={() => setHoveredWork(work.id)}
                  onMouseLeave={() => setHoveredWork(null)}
                  className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <div className="relative w-full">
                    <Image
                      src={work.image}
                      alt={work.title}
                      width={600}
                      height={work.size === "tall" ? 800 : work.size === "wide" ? 400 : 500}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <motion.div
                      initial={false}
                      animate={{ opacity: hoveredWork === work.id ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8"
                    >
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: hoveredWork === work.id ? 0 : 20, opacity: hoveredWork === work.id ? 1 : 0 }}
                        className="text-blue-400 text-sm tracking-widest uppercase mb-2"
                      >
                        {work.category}
                      </motion.p>
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: hoveredWork === work.id ? 0 : 20, opacity: hoveredWork === work.id ? 1 : 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-white text-2xl font-bold"
                      >
                        {work.title}
                      </motion.h3>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          ABOUT PAGE
      ========================================== */}
      {activePage === "ABOUT" && (
        <section className="py-24 px-6 min-h-screen bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                ABOUT{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  SNV PHOTOGRAPHY
                </span>
              </motion.h1>
            </motion.div>

            {/* Owner Card + Vision */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-5 gap-10 mb-20"
            >
              <motion.div variants={scaleIn} className="md:col-span-2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-blue-900/30 shadow-2xl shadow-blue-900/10">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&h=800&fit=crop"
                  alt="SNV Photographer"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>

              <motion.div variants={revealFromRight} className="md:col-span-3 flex flex-col justify-center p-8 rounded-3xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-900/20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                  THE{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    VISION
                  </span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light mb-4">
                  At SNV Photography, we believe every moment is a work of art waiting to be captured. Our vision is to freeze time in its most beautiful form — transforming fleeting instants into eternal memories.
                </p>
                <p className="text-white/80 leading-relaxed font-light">
                  With over a decade of experience in portrait, wedding, and editorial photography, we bring an unmatched passion for storytelling through the lens. Every click is intentional. Every frame is meaningful.
                </p>
              </motion.div>
            </motion.div>

            {/* Three Cards */}
                <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-8"
                >
                {[
                    {
                    title: "MY APPROACH",
                    message: "I take a documentary-style approach, blending into your day to capture authentic, unposed moments. The result is a gallery that feels real, emotional, and uniquely yours.",
                    },
                    {
                    title: "WHY SNV PHOTOGRAPHY",
                    message: "We don't just take photos — we create heirlooms. Our commitment to quality, creativity, and client experience sets us apart in every way.",
                    },
                    {
                    title: "LET'S CONNECT",
                    message: "Every great project starts with a conversation. I'd love to hear about your vision and how we can bring it to life together through stunning imagery.",
                    },
                ].map((card, i) => (
                    <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -8, borderColor: "rgba(59,130,246,0.8)", boxShadow: "0 20px 40px rgba(59,130,246,0.2)" }}
                    className="rounded-2xl bg-gradient-to-br from-gray-600 to-gray-500 border border-blue-500/40 p-8 transition-all duration-300 shadow-xl shadow-blue-900/20"
                    >
                    <h3 className="text-xl font-bold text-white mb-4 tracking-wider">{card.title}</h3>
                    <p className="text-gray-300 leading-relaxed font-light">{card.message}</p>
                    </motion.div>
                ))}
                </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          CONTACT PAGE
      ========================================== */}
     {activePage === "CONTACT" && (
      <section className="relative py-24 px-6 min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[150px]" />
            <div className="absolute bottom-20 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[150px]" />
            </div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-5 py-2 mb-8">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
                  Get Started
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                LET'S{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  CONNECT
                </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-xl mx-auto font-light">
                Ready to create something beautiful together? Reach out and let's start the conversation.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-10">
              {/* Left - Contact Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealFromLeft}
                className="
                        md:col-span-3
                        rounded-3xl
                        bg-black/80
                        backdrop-blur-xl
                        border border-blue-500/40
                        p-8 md:p-10
                        shadow-[0_0_50px_rgba(59,130,246,0.25)]
                        "
              >
                <h2 className="text-2xl font-bold text-white mb-8 tracking-wider">
                  SEND A <span className="text-blue-400">MESSAGE</span>
                </h2>

                {contactSubmitted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="rounded-full bg-blue-500/20 p-5 inline-flex mb-6">
                      <CheckCircle2 className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/80">We'll get back to you within 24-48 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm text-white/80 mb-2 tracking-wider uppercase text-xs">Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="
                                w-full
                                rounded-xl
                                bg-slate-950/60
                                border border-blue-500/20
                                px-5 py-4
                                text-white
                                placeholder:text-gray-500
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-500/20
                                outline-none
                                transition-all
                                "
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80 mb-2 tracking-wider uppercase text-xs">Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="
                            w-full
                            rounded-xl
                            bg-slate-950/60
                            border border-blue-500/20
                            px-5 py-4
                            text-white
                            placeholder:text-gray-500
                            focus:border-blue-400
                            focus:ring-2
                            focus:ring-blue-500/20
                            outline-none
                            transition-all
                            "
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/80 mb-2 tracking-wider uppercase text-xs">Message *</label>
                      <textarea
                        rows={5}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="
                                w-full
                                rounded-xl
                                bg-slate-950/60
                                border border-blue-500/15
                                px-5 py-4
                                text-white
                                placeholder:text-gray-500
                                focus:border-blue-400
                                focus:ring-2
                                focus:ring-blue-500/20
                                outline-none
                                transition-all
                                "
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-white font-semibold tracking-wider hover:from-blue-500 hover:to-blue-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                    >
                      <Send className="w-5 h-5" />
                      SEND MESSAGE
                    </motion.button>
                  </form>
                )}
              </motion.div>

              {/* Right - Info Cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealFromRight}
                className="md:col-span-2 space-y-6"
              >
                {/* Get In Touch */}
                <div className="
                    rounded-2xl
                    bg-black/70
                    backdrop-blur-xl
                    border border-blue-500/40
                    p-7
                    shadow-[0_0_25px_rgba(59,130,246,0.15)]
                    ">
                  <h3 className="text-lg font-bold text-white mb-5 tracking-wider">GET IN TOUCH</h3>
                  <div className="space-y-4">
                    <a href="mailto:hello@snvphoto.com" className="flex items-center gap-3 text-white/80 hover:text-blue-400 transition-colors">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">hello@snvphoto.com</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-white/80 hover:text-blue-400 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      <span className="text-sm">@snvphotography</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 text-white/80 hover:text-blue-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
                      <span className="text-sm">@snvphoto</span>
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="
                        rounded-2xl
                        bg-slate-950
                        border border-blue-500/40
                        p-7
                        shadow-[0_0_35px_rgba(59,130,246,0.18)]
                        ">
                  <h3 className="
                        text-xl
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-white
                        mb-4
                        ">RESPONSE TIME</h3>
                  <p className="text-white/80 text-sm leading-relaxed font-light">
                    I typically respond within <span className="text-blue-400 font-semibold">24-48 hours</span>. For urgent inquiries, please mention it in your message.
                  </p>
                </div>

                {/* Collaborations */}
                <div className="
                        rounded-2xl
                        bg-black/70
                        backdrop-blur-xl
                        border border-blue-500/40
                        p-7
                        shadow-[0_0_25px_rgba(59,130,246,0.15)]
                        ">
                  <h3 className="
                        text-xl
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-white
                        mb-4
                        ">COLLABORATIONS</h3>
                  <p className="text-white/80 text-sm leading-relaxed font-light">
                    I'm always open to creative collaborations with brands, artists, and fellow photographers. Let's make something extraordinary together.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer for non-home pages */}
      {activePage !== "HOME" && (
        <Footer
          contactForm={contactForm}
          setContactForm={setContactForm}
          contactSubmitted={contactSubmitted}
          handleContactSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
}

/* ==========================================
   FOOTER COMPONENT
========================================== */
function Footer({ contactForm, setContactForm, contactSubmitted, handleContactSubmit }) {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-black to-blue-950/30 text-gray-300 pt-20 pb-8 px-6 border-t border-blue-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 p-[2px] shadow-lg shadow-blue-500/20">
                <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                  <Camera className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                SNV<span className="text-blue-400">PHOTO</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Capturing timeless moments with artistry and passion. Every frame tells a story.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider mb-6 uppercase">Quick Links</h4>
            <div className="space-y-3 text-sm">
              {["HOME", "PORTFOLIO", "ABOUT", "CONTACT"].map((link) => (
                <a key={link} href="#" className="block text-gray-500 hover:text-blue-400 transition-colors">{link}</a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider mb-6 uppercase">Contact</h4>
            <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /> hello@snvphoto.com</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /> (555) 123-4567</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Los Angeles, CA</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-semibold text-sm tracking-wider mb-6 uppercase">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-4 font-light">Stay updated with our latest work and offers.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg bg-white/5 border border-blue-900/20 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 outline-none"
              />
              <button className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-500 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-blue-900/20 text-center"
        >
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex justify-center gap-6 mb-4">
                    {/* Instagram */}
                    <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    {/* Twitter/X */}
                    <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
                    </a>
                    {/* Camera */}
                    <a href="#" className="text-gray-600 hover:text-blue-400 transition-colors">
                        <Camera className="w-5 h-5" />
                    </a>
                    </div>
          </div>
          <p className="text-gray-600 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} SNV PHOTOGRAPHY. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}