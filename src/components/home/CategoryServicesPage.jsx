"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CategoryServicesPage() {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.08, duration: 0.5 },
    }),
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
          className="mb-24 text-center"
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-5 py-2 backdrop-blur-md mb-6"
          >
            <motion.div animate={pulseDot} className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Our Service Categories
            </span>
          </motion.div>

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
              CATEGORIES GRID
          ============================================== */
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-[260px] overflow-hidden">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-8">
                  {/* Category Badge */}
                  <div className="mb-4 inline-flex rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-black">
                    Category
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-3xl font-black text-white line-clamp-2">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="mb-8 line-clamp-3 text-zinc-400">
                    {category.description || "Professional services designed to meet your needs."}
                  </p>

                  {/* Button */}
                  <Link href={`/services/${category.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-2xl bg-yellow-500 py-4 text-lg font-bold text-black transition-all duration-300 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25"
                    >
                      Explore Services
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}