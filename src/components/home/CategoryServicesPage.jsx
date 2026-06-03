"use client";

/* ==========================================
   REACT
========================================== */

import { useEffect, useState } from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion } from "framer-motion";

/* ==========================================
   NEXT.JS
========================================== */

import Link from "next/link";

/* ==========================================
   FIREBASE
========================================== */

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ==========================================
   ICONS
========================================== */

import { Star } from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function CategoryServicesPage() {
  /* ==========================================
     STATE
  ========================================== */

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ==========================================
     DETECT MOBILE DEVICE
  ========================================== */

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "serviceCategories"), where("active", "==", true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(items);
    } catch (error) {
      console.error("Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     HANDLE CARD CLICK FOR MOBILE
  ========================================== */

  const handleCardClick = (index) => {
    if (!isMobile) return;
    // Toggle active card
    setActiveIndex(activeIndex === index ? null : index);
    // Auto reset after 3 seconds
    setTimeout(() => setActiveIndex(null), 3000);
  };

  /* ==========================================
     ANIMATION VARIANTS
  ========================================== */

  const fadeUp = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity },
  };

  /* ==========================================
     LOADING SKELETON
  ========================================== */

  const skeletonItems = [1, 2, 3, 4, 5, 6];

  /* ==========================================
     JSX
  ========================================== */

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-slate-950 py-32"
    >
      {/* ============================================
          BACKGROUND GLOWS
      ============================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* ============================================
          MAIN CONTAINER
      ============================================== */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        
        {/* ============================================
            SECTION HEADER
        ============================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.3 }}
          className="mb-24 text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 backdrop-blur-md mb-6">
            <motion.div animate={pulseDot} className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Our Service Categories
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Explore Our
            <span className="text-yellow-400"> Solutions</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-3xl text-xl text-zinc-400">
            Discover our specialized divisions and professional service offerings.
          </p>
        </motion.div>

        {/* ============================================
            MOBILE INSTRUCTION
        ============================================== */}
        {isMobile && !loading && categories.length > 0 && (
          <div className="text-center mb-6 text-zinc-500 text-sm">
            👆 Tap on a card to preview it
          </div>
        )}

        {/* ============================================
            LOADING STATE
        ============================================== */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {skeletonItems.map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-[36px] border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : (
          /* ============================================
              CATEGORIES GRID WITH ZOOM ON HOVER/TAP
          ============================================== */
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => {
              const isActive = isMobile ? activeIndex === index : false;
              
              return (
                <div
                  key={category.id}
                  className={`
                    group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl 
                    transition-all duration-500 ease-out
                    ${!isMobile && 'hover:scale-105 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/25'}
                    ${isActive && 'scale-105 border-yellow-500/50 shadow-2xl shadow-yellow-500/25'}
                  `}
                  onMouseEnter={() => !isMobile && setActiveIndex(index)}
                  onMouseLeave={() => !isMobile && setActiveIndex(null)}
                  onClick={() => handleCardClick(index)}
                >
                  {/* Star Badge - Shows on hover (desktop) or tap (mobile) */}
                  <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${
                    activeIndex === index 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-75"
                  }`}>
                    <div className="flex items-center gap-1.5 rounded-full bg-yellow-500 px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
                      <Star className="w-3 h-3 fill-black" />
                      {isMobile ? "Selected" : "Current"}
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative h-[260px] overflow-hidden">
                    <img
                      src={category.image || "/placeholder.jpg"}
                      alt={category.name}
                      className={`
                        h-full w-full object-cover transition duration-700
                        ${(!isMobile && activeIndex === index) || isActive 
                          ? 'scale-110' 
                          : 'group-hover:scale-110'}
                      `}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:bg-black/30" />
                    
                    {/* Shine effect overlay */}
                    <div className={`
                      absolute inset-0 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-yellow-500/10 to-transparent
                      ${(!isMobile && activeIndex === index) || isActive 
                        ? 'opacity-100' 
                        : 'opacity-0 group-hover:opacity-100'}
                    `} />
                  </div>

                  {/* Content Section */}
                  <div className={`
                    p-8 transition-all duration-500
                    ${(!isMobile && activeIndex === index) || isActive 
                      ? 'translate-y-[-4px]' 
                      : 'group-hover:translate-y-[-4px]'}
                  `}>
                    {/* Category Badge */}
                    <div className="mb-4 inline-flex rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black transition-all duration-300 group-hover:bg-yellow-400 group-hover:shadow-lg">
                      Category
                    </div>

                    {/* Title */}
                    <h3 className={`
                      mb-4 text-3xl font-black text-white line-clamp-2 transition-all duration-300
                      ${(!isMobile && activeIndex === index) || isActive 
                        ? 'text-yellow-400' 
                        : 'group-hover:text-yellow-400'}
                    `}>
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className={`
                      mb-8 line-clamp-3 transition-all duration-300
                      ${(!isMobile && activeIndex === index) || isActive 
                        ? 'text-zinc-300' 
                        : 'text-zinc-400 group-hover:text-zinc-300'}
                    `}>
                      {category.description || "Professional services designed to meet your needs."}
                    </p>

                    {/* Button */}
                    <Link href={`/services/${category.slug}`}>
                      <button className={`
                        w-full rounded-2xl bg-yellow-500 py-4 text-lg font-bold text-black transition-all duration-300 
                        hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25
                        ${(!isMobile && activeIndex === index) || isActive 
                          ? 'scale-[1.02]' 
                          : 'group-hover:scale-[1.02]'}
                      `}>
                        Explore Services
                      </button>
                    </Link>
                  </div>

                  {/* Glow effect on hover */}
                  <div className={`
                    absolute inset-0 rounded-[36px] transition-opacity duration-500 pointer-events-none
                    ${(!isMobile && activeIndex === index) || isActive 
                      ? 'opacity-100' 
                      : 'opacity-0 group-hover:opacity-100'}
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 rounded-[36px]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}