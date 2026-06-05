"use client";

/* ==========================================
   REACT + FRAMER MOTION
========================================== */

import { useEffect, useRef, useState, useCallback } from "react";
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

import { 
  ArrowRight, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ExternalLink,
  LayoutTemplate 
} from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function PortfolioSection() {
  const router = useRouter();
  const galleryRef = useRef(null);
  const [portfolioCategories, setPortfolioCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
      
      // Set middle card as active (visual only)
      if (items.length > 0) {
        const middleIndex = Math.floor(items.length / 2);
        setActiveIndex(middleIndex);
      }
    } catch (error) {
      console.error("Portfolio Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================
     SCROLL TO CARD
  ========================================== */

  const scrollToCard = (index) => {
    if (!galleryRef.current) return;
    
    const cards = galleryRef.current.querySelectorAll('.portfolio-card, .template-card');
    if (cards[index] && cards[index].scrollIntoView) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  /* ==========================================
     DETECT WHICH CARD IS MOST VISIBLE
     - Biased toward left on mobile
  ========================================== */

  const updateActiveIndexOnScroll = useCallback(() => {
    if (isScrollingProgrammatically) return;
    if (isHovering) return;
    
    if (!galleryRef.current) return;
    
    const cards = galleryRef.current.querySelectorAll('.portfolio-card, .template-card');
    const containerRect = galleryRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    let leftBiasIndex = 0;
    let leftBiasDistance = Infinity;
    
    const isMobile = window.innerWidth < 768;
    
    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      
      // On mobile, bias toward left (earlier cards)
      if (isMobile) {
        // Calculate how far the card is from the left edge of the container
        const leftDistance = Math.abs(cardRect.left - containerRect.left);
        // We want cards that are closer to the left side (but not too far)
        if (leftDistance < leftBiasDistance && leftDistance < cardRect.width * 0.5) {
          leftBiasDistance = leftDistance;
          leftBiasIndex = idx;
        }
      }
      
      // Standard distance check for all devices
      const threshold = isMobile ? cardRect.width * 0.4 : cardRect.width * 0.5;
      
      if (distance < closestDistance && distance < threshold) {
        closestDistance = distance;
        closestIndex = idx;
      }
    });
    
    // On mobile, prefer the left-biased card if found
    if (isMobile && leftBiasDistance !== Infinity && leftBiasIndex !== activeIndex) {
      setActiveIndex(leftBiasIndex);
    } else if (closestDistance !== Infinity && closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex, isScrollingProgrammatically, isHovering]);

  /* ==========================================
     HOVER HANDLER
  ========================================== */

  const handleCardHover = (index) => {
    setHoveredIndex(index);
    setIsHovering(true);
    setActiveIndex(index);
  };

  const handleCardLeave = () => {
    setHoveredIndex(null);
    setIsHovering(false);
    setTimeout(() => {
      updateActiveIndexOnScroll();
    }, 50);
  };

  /* ==========================================
     SCROLL EVENT LISTENER
  ========================================== */

  useEffect(() => {
    const scrollContainer = galleryRef.current;
    if (!scrollContainer) return;
    
    const handleScrollEnd = () => {
      updateActiveIndexOnScroll();
    };
    
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateActiveIndexOnScroll();
      }, 100);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    scrollContainer.addEventListener('scrollend', handleScrollEnd);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('scrollend', handleScrollEnd);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [updateActiveIndexOnScroll]);

  /* ==========================================
     UPDATE ACTIVE INDEX ON RESIZE
  ========================================== */

  useEffect(() => {
    const handleResize = () => {
      updateActiveIndexOnScroll();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveIndexOnScroll]);

  /* ==========================================
     NAVIGATION
  ========================================== */

  const handlePrev = () => {
    const totalCards = portfolioCategories.length + 1; // +1 for template card
    const newIndex = activeIndex === 0 ? totalCards - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    setHoveredIndex(null);
    setIsHovering(false);
    setIsScrollingProgrammatically(true);
    scrollToCard(newIndex);
    setTimeout(() => setIsScrollingProgrammatically(false), 500);
  };

  const handleNext = () => {
    const totalCards = portfolioCategories.length + 1; // +1 for template card
    const newIndex = activeIndex + 1 >= totalCards ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    setHoveredIndex(null);
    setIsHovering(false);
    setIsScrollingProgrammatically(true);
    scrollToCard(newIndex);
    setTimeout(() => setIsScrollingProgrammatically(false), 500);
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setHoveredIndex(null);
    setIsHovering(false);
    setIsScrollingProgrammatically(true);
    scrollToCard(index);
    setTimeout(() => setIsScrollingProgrammatically(false), 500);
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
      {/* BACKGROUND GLOWS */}
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

      {/* HEADER */}
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
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md px-5 py-2 mb-6">
                <motion.div animate={pulseDot} className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-300 tracking-wide text-sm uppercase font-semibold">
                  Our Portfolio
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Projects &
                <span className="text-yellow-400"> Portfolio</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
                Browse our portfolio categories and explore completed projects, events, photography,
                videography, networking installations, and digital solutions.
              </p>
              
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

      {/* NAVIGATION ARROWS */}
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

      {/* FADE OVERLAYS */}
      <div className="absolute left-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 sm:w-32 h-full bg-gradient-to-l from-[#111827] via-[#111827]/80 to-transparent z-10 pointer-events-none" />

      {/* CAROUSEL - Added mobile snap alignment */}
      <div
        ref={galleryRef}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory relative z-20 scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-6 px-4 sm:px-12 md:px-20 py-8">
          
          {/* Website Templates Card - At the beginning */}
          <div
            onClick={() => router.push("/website-templates")}
            onMouseEnter={() => handleCardHover(portfolioCategories.length)}
            onMouseLeave={handleCardLeave}
            className={`
              template-card relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[380px]
              flex-shrink-0 snap-center rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer
              transition-all duration-500 group border border-white/10
              ${activeIndex === portfolioCategories.length || hoveredIndex === portfolioCategories.length
                ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/25 scale-105 z-20"
                : "border border-white/10 scale-95 opacity-70 hover:opacity-100"
              }
            `}
            style={{ aspectRatio: "3/4" }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-indigo-900/40" />
            
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 sm:p-6">
                <div className="inline-block p-3 sm:p-4 rounded-2xl bg-blue-500/20 backdrop-blur-sm mb-3 sm:mb-4">
                  <LayoutTemplate className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Website</h3>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-400 mb-3">Templates</h3>
                <p className="text-gray-300 text-xs sm:text-sm max-w-[200px] mx-auto">
                  Browse our collection of ready-to-use website templates
                </p>
              </div>
            </div>

            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black via-black/50 to-transparent">
              <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-xs sm:text-sm group-hover:gap-3 transition-all">
                View Templates <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            {/* Active/Hover Badge */}
            {(activeIndex === portfolioCategories.length || hoveredIndex === portfolioCategories.length) && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                <div className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                  <Star className="w-2.5 h-2.5 fill-black" />
                  Current
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Category Cards */}
          {portfolioCategories.map((category, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/portfolio/${category.slug}`)}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={handleCardLeave}
                className={`
                  portfolio-card relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[380px]
                  flex-shrink-0 snap-center rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer
                  transition-all duration-500 group
                  ${isActive || isHovered
                    ? "ring-2 ring-yellow-500 shadow-2xl shadow-yellow-500/25 scale-105 z-20"
                    : "border border-white/10 scale-95 opacity-70 hover:opacity-100"
                  }
                `}
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={category.image || "/placeholder.jpg"}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-all duration-500" />

                {/* Current/Hovering Badge */}
                {(isActive || isHovered) && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                    <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      Current
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-[10px] sm:text-xs md:text-sm mb-3 line-clamp-2">
                    {category.description || "Explore our collection of work in this category."}
                  </p>
                  <div className="inline-flex items-center gap-2 text-yellow-400 font-semibold text-xs sm:text-sm group-hover:gap-3 transition-all">
                    View Portfolio <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="flex justify-center items-center gap-2 mt-6 relative z-30">
        {[...Array(portfolioCategories.length + 1)].map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
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

      {/* STATS BADGE & VIEW ALL BUTTON (Mobile) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <div className="inline-flex items-center gap-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300 text-sm">
            {portfolioCategories.length} Portfolio Categories + Templates
          </span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
        
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