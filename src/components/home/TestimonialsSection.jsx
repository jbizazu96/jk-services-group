"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion } from "framer-motion";

/* ==========================================
   COMPONENTS
========================================== */

import Testimonials from "@/components/admin/Testimonials";

/* ==========================================
   COMPONENT
========================================== */

export default function TestimonialsSection() {
  /* ==========================================
     ANIMATION VARIANTS
  ========================================== */

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  const floatGlow = {
    animate: {
      x: [0, 40, 0],
      y: [0, -20, 0],
      transition: { duration: 10, repeat: Infinity },
    },
  };

  const floatGlowReverse = {
    animate: {
      x: [0, -40, 0],
      y: [0, 20, 0],
      transition: { duration: 12, repeat: Infinity },
    },
  };

  /* ==========================================
     JSX
  ========================================== */

  return (
    <section
      id="testimonials"
      className="relative py-32 overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155] text-white"
    >
      {/* ==========================================
          AMBIENT GLOWS
      ========================================== */}

      <motion.div
        variants={floatGlow}
        animate="animate"
        className="absolute top-0 left-0 w-[450px] h-[450px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      <motion.div
        variants={floatGlowReverse}
        animate="animate"
        className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* ==========================================
          HEADER SECTION
      ========================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md"
        >
          <motion.div
            animate={pulseDot}
            className="w-2 h-2 rounded-full bg-yellow-400"
          />
          <span className="text-yellow-300 text-sm uppercase tracking-wide font-semibold">
            Testimonials
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-black leading-tight"
        >
          What Our
          <span className="text-yellow-400"> Clients Say</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          We believe excellence speaks through the experiences of our clients. Here are some
          words from people and organizations we've proudly served.
        </motion.p>
      </div>

      {/* ==========================================
          FIRESTORE TESTIMONIALS
      ========================================== */}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 max-w-7xl mx-auto px-6 mt-20"
      >
        <Testimonials />
      </motion.div>
    </section>
  );
}