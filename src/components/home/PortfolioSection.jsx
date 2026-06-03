"use client";

/* ==========================================
   REACT + FRAMER MOTION
========================================== */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ==========================================
   NEXT.JS
========================================== */

import { useRouter } from "next/navigation";

/* ==========================================
   FIREBASE
========================================== */

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ==========================================
   ICONS
========================================== */

import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function PortfolioSection() {
  const router = useRouter();
  const galleryRef = useRef(null);
  const [portfolioCategories, setPortfolioCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /* ==========================================
     LOAD PORTFOLIO CATEGORIES
  ========================================== */

  useEffect(() => {
    loadPortfolioCategories();
  }, []);

  const loadPortfolioCategories = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "portfolioCategories"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPortfolioCategories(items);
      // Set middle card as active on load - NO AUTO SCROLL
      if (items.length > 0) {
        const middleIndex = Math.floor(items.length / 2);
        setActiveIndex(middleIndex);
        // REMOVED: setTimeout(() => scrollToCard(middleIndex), 100);
      }
    } catch (error) {
      console.error("Portfolio Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     SCROLL TO CARD - SMOOTH CENTERING
  ========================================== */

  const scrollToCard = (index) => {
    if (!galleryRef.current) return;
    
    const cards = galleryRef.current.querySelectorAll('.portfolio-card');
    if (cards[index] && cards[index].scrollIntoView) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  /* ==========================================
     NAVIGATION
  ========================================== */

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? portfolioCategories.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex + 1 >= portfolioCategories.length ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToCard(newIndex);
  };

  /* ==========================================
     ANIMATION VARIANTS
  ========================================== */

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (isLoading || portfolioCategories.length === 0) {
    return (
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#0f172a] to-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  /* ==========================================
     JSX
  ========================================== */

  return (
    <section
      id="gallery"
      className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#0f172a] to-[#111827] text-white"
    >
      {/* ==========================================
          BACKGROUND GLOWS
      ========================================== */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md px-5 py-2 mb-6">
                <motion.div animate={pulseDot} className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-300 tracking-wide text-sm uppercase font-semibold">
                  Our Portfolio
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Projects &
                <span className="text-yellow-400"> Portfolio</span>
              </h2>
            </div>

            {/* Description and Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
                Browse our portfolio categories and explore completed projects, events, photography,
                videography, networking installations, and digital solutions.
              </p>
              
              {/* View All Portfolio Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/portfolio")}
                className="flex items-center gap-2 rounded-full bg-yellow-500 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25 whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                View All Portfolio
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
          NAVIGATION ARROWS
      ========================================== */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-yellow-500 hover:text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-yellow-500 hover:text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* ==========================================
          FADE OVERLAYS
      ========================================== */}
      <div className="absolute left-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-l from-[#111827] via-[#111827]/80 to-transparent z-10 pointer-events-none" />

      {/* ==========================================
          CAROUSEL
      ========================================== */}
      <div
        ref={galleryRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory relative z-20 scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-6 px-12 sm:px-20 py-8">
          {portfolioCategories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => router.push(`/portfolio/${category.slug}`)}
              className={`
                portfolio-card relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px]
                flex-shrink-0 snap-center rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer
                transition-all duration-500 group
                ${activeIndex === index
                  ? "ring-2 ring-yellow-500 shadow-2xl shadow-yellow-500/25 scale-105 z-20"
                  : "border border-white/10 scale-95 opacity-70 hover:opacity-100"
                }
              `}
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background Image */}
              <img
                src={category.image || "/placeholder.jpg"}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-all duration-500" />

              {/* Active Indicator */}
              {activeIndex === index && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                    <Star className="w-2.5 h-2.5 fill-black" />
                    Current
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 line-clamp-2">
                  {category.name}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">
                  {category.description || "Explore our collection of work in this category."}
                </p>
                <div className="inline-flex items-center gap-2 text-yellow-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  View Portfolio <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          DOT INDICATORS
      ========================================== */}
      <div className="flex justify-center items-center gap-2 mt-6 relative z-30">
        {portfolioCategories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              scrollToCard(index);
            }}
            className={`
              rounded-full transition-all duration-300
              ${activeIndex === index
                ? "w-8 h-2 bg-yellow-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }
            `}
          />
        ))}
      </div>

      {/* ==========================================
          STATS BADGE & VIEW ALL BUTTON (Mobile)
      ========================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <div className="inline-flex items-center gap-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300 text-sm">
            {portfolioCategories.length} Portfolio Categories
          </span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
        
        {/* Mobile View All Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/portfolio")}
          className="flex items-center gap-2 rounded-full bg-yellow-500 px-5 py-2 text-sm font-bold text-black transition-all hover:bg-yellow-400 md:hidden"
        >
          <ExternalLink className="w-4 h-4" />
          View All Portfolio
        </motion.button>
      </div>
    </section>
  );
}