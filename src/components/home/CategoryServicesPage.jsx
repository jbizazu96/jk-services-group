"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Star } from "lucide-react";

export default function CategoryServicesPage() {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Load categories from Firestore
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "serviceCategories"),
        where("active", "==", true)
      );
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

  // Simplified animation variants - only fade in, no movement
  const fadeUp = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity },
  };

  // Loading skeleton data
  const skeletonItems = [1, 2, 3, 4, 5, 6];

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
              CATEGORIES GRID WITH ZOOM ON HOVER
          ============================================== */
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 ease-out hover:scale-105 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/25"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Star "Current" Badge - Shows on hover */}
                <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${
                  hoveredIndex === index 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-75"
                }`}>
                  <div className="flex items-center gap-1.5 rounded-full bg-yellow-500 px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
                    <Star className="w-3 h-3 fill-black" />
                    Current
                  </div>
                </div>

                {/* Image Section */}
                <div className="relative h-[260px] overflow-hidden">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:bg-black/30" />
                  
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-yellow-500/10 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-8 transition-all duration-500 group-hover:translate-y-[-4px]">
                  {/* Category Badge */}
                  <div className="mb-4 inline-flex rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black transition-all duration-300 group-hover:bg-yellow-400 group-hover:shadow-lg">
                    Category
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-3xl font-black text-white line-clamp-2 transition-all duration-300 group-hover:text-yellow-400">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="mb-8 line-clamp-3 text-zinc-400 transition-all duration-300 group-hover:text-zinc-300">
                    {category.description || "Professional services designed to meet your needs."}
                  </p>

                  {/* Button */}
                  <Link href={`/services/${category.slug}`}>
                    <button className="w-full rounded-2xl bg-yellow-500 py-4 text-lg font-bold text-black transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25 group-hover:scale-[1.02]">
                      Explore Services
                    </button>
                  </Link>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 rounded-[36px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}