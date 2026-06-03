"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion } from "framer-motion";

/* ==========================================
   LUCIDE ICONS
========================================== */

import { ArrowRight, Sparkles, Calendar, CheckCircle } from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function CTASection({ setBookingModalGS }) {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  const bounceArrow = {
    x: [0, 5, 0],
    transition: { duration: 1.5, repeat: Infinity },
  };

  const floatingGlow = {
    y: [0, -15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      
      {/* ==========================================
          ANIMATED BACKGROUND GLOWS
      ========================================== */}
      
      {/* Main gold glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/20 blur-[120px] pointer-events-none"
      />
      
      {/* Floating orb top right */}
      <motion.div
        animate={floatingGlow}
        className="absolute top-10 right-10 w-[300px] h-[300px] rounded-full bg-gold/10 blur-[80px] pointer-events-none"
      />
      
      {/* Floating orb bottom left */}
      <motion.div
        animate={floatingGlow}
        transition={{ delay: 1, duration: 7 }}
        className="absolute bottom-10 left-10 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* ==========================================
            TOP BADGE
        ========================================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          whileHover={{ scale: 1.03 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md px-5 py-2 mb-6"
        >
          <motion.div animate={pulseDot} className="w-2 h-2 rounded-full bg-gold" />
          <span className="text-sm font-semibold uppercase tracking-wider text-gold">
            Let's Build Something Amazing
          </span>
        </motion.div>

        {/* ==========================================
            TITLE
        ========================================== */}
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight"
        >
          Ready To Work
          <br />
          <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
            With Us?
          </span>
        </motion.h2>

        {/* ==========================================
            DESCRIPTION
        ========================================== */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-gray-300 mt-6 leading-relaxed max-w-2xl mx-auto"
        >
          Let's bring your event or business vision to life with professional service,
          innovation, and unmatched dedication.
        </motion.p>

        {/* ==========================================
            FEATURE LIST
        ========================================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          {["Free Consultation", "No Obligation", "Quick Response"].map((feature, i) => (
            <div key={i} className="flex items-center gap-1.5 text-gray-400 text-sm">
              <CheckCircle className="w-3.5 h-3.5 text-gold" />
              <span>{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* ==========================================
            CTA BUTTON
        ========================================== */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBookingModalGS(true)}
            className="group relative overflow-hidden rounded-full bg-gold px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-bold text-black transition-all duration-300 shadow-lg hover:shadow-gold/30 inline-flex items-center gap-3"
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            Schedule Free Consultation
            <motion.div animate={bounceArrow}>
              <ArrowRight size={20} className="md:w-6 md:h-6" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* ==========================================
            TRUST INDICATOR
        ========================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-gold" />
            Trusted by <span className="text-gold font-semibold">happy</span>  clients
            <Sparkles className="w-3 h-3 text-gold" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}