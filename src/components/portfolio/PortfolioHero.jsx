"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ==========================================
   NEXT IMAGE
========================================== */

import Image from "next/image";

/* ==========================================
   NEXT NAVIGATION
========================================== */

import Link from "next/link";

/* ==========================================
   PORTFOLIO HERO COMPONENT
========================================== */

export default function PortfolioHero({
  title,
  description,
  image,
}) {
  /* ==========================================
     SCROLL ANIMATION
  ========================================== */
  const { scrollY } = useScroll();

  /* ==========================================
     PARALLAX EFFECT
  ========================================== */
  const imageScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const imageY = useTransform(scrollY, [0, 500], [0, 120]);
  const textY = useTransform(scrollY, [0, 500], [0, 180]);

  const heroImage = image || "/images/portfolio-placeholder.jpg";

  return (
    <div className="relative h-[360px] md:h-[500px] overflow-hidden">
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center"
      >
        {/* BACK BUTTON - Now links to /portfolio page (just like service page links to /#services) */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 mb-8 text-yellow-400 hover:text-yellow-300 font-semibold transition w-fit group"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.span>
          Back To Portfolio
        </Link>

        <div className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-1.5 text-sm font-bold text-black shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            Portfolio Category
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 drop-shadow-lg leading-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl drop-shadow-md leading-relaxed"
        >
          {description || "Explore our curated collection of cinematic projects and creative work."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/80 text-xs">Featured Collection</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}