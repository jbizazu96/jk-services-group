"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection({ setBookingModalGS }) {
  // State to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseDot = {
    scale: [1, 1.3, 1],
    transition: { duration: 2, repeat: Infinity },
  };

  const bounce = {
    y: [0, 10, 0],
    transition: { duration: 2, repeat: Infinity },
  };

  const buttonHover = {
    scale: 1.05,
    y: -4,
    transition: { duration: 0.2 },
  };

  const cardHover = {
    scale: 1.03,
    y: -3,
    transition: { duration: 0.2 },
  };

  const cardFloat = {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Stats data
  const stats = [
    { value: "10+", label: "Events Served" },
    { value: "24/7", label: "IT Support" },
    { value: "5★", label: "Client Experience" },
  ];

  // Service cards data
  const services = [
    {
      title: "Wedding & Event Services",
      description: "MC • DJ • Planning • Photography • Ushers",
    },
    {
      title: "Networking & IT Solutions",
      description: "Installation • Troubleshooting • Consulting",
    },
  ];

  // Fixed particle positions (no random on server)
  const particlePositions = [15, 25, 35, 45, 55, 65, 75, 85, 20, 40, 60, 80, 10, 30, 50];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#f8f8f8] via-white to-slate-100 text-black">
      
      {/* ============================================
          ANIMATED GRID BACKGROUND
      ============================================== */}
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-yellow-200/20 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-200/20 blur-[100px] pointer-events-none"
      />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                              linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating particles - FIXED: no Math.random() */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              initial={{ x: `${pos}%`, y: "100%", opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.4, 0] }}
              transition={{ duration: 8 + (i % 5) * 1.5, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/40"
            />
          ))}
        </div>
      )}

      {/* ============================================
          MAIN CONTAINER
      ============================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* ============================================
            LEFT COLUMN - TEXT CONTENT
        ============================================== */}
        <div>
          {/* Top Badge */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-black/10 rounded-full px-5 py-2 shadow-lg mb-8"
          >
            <motion.div animate={pulseDot} className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm tracking-wide font-medium">Professional Multi-Service Company</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black leading-tight"
          >
            Turning Your
            <span className="text-yellow-500"> Vision </span>
            Into Reality
          </motion.h1>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.5 }}
            className="mt-8 text-xl text-gray-700 leading-relaxed max-w-2xl"
          >
            From unforgettable weddings and conferences to enterprise-grade networking and IT solutions —
            J&K Services Group delivers professionalism, creativity, and excellence.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <motion.button
              whileHover={buttonHover}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBookingModalGS(true)}
              className="bg-black hover:bg-yellow-500 hover:text-black text-white px-8 py-4 rounded-full text-lg font-bold transition shadow-[0_20px_60px_rgba(0,0,0,0.25)] flex items-center gap-2"
            >
              Book Appointment
              <ChevronRight />
            </motion.button>

            <motion.a
              whileHover={buttonHover}
              whileTap={{ scale: 0.98 }}
              href="#services"
              className="border border-black/20 hover:bg-black hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition inline-flex items-center justify-center backdrop-blur-xl"
            >
              Explore Services
            </motion.a>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -8 }}
                className="relative text-center"
              >
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                  className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full"
                />
                <h3 className="relative text-4xl font-black text-yellow-500">{stat.value}</h3>
                <p className="relative text-gray-500 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ============================================
            RIGHT COLUMN - ANIMATED J&K CARD
        ============================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16 lg:mt-0"
        >
          <motion.div
            animate={cardFloat}
            className="relative"
          >
            {/* Pulsing ring behind card */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-4 rounded-[48px] bg-yellow-400/20 blur-xl"
            />
            
            {/* Main Card */}
            <div className="relative bg-white/70 backdrop-blur-2xl border border-black/10 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] w-full max-w-md lg:max-w-lg">
              
              {/* Logo with hover */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/logo1.webp"
                  alt="J&K Services Group"
                  className="w-52 md:w-64 lg:w-72 mx-auto"
                />
              </motion.div>

              {/* Animated divider */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6 mx-auto"
                style={{ width: "80%" }}
              />

              {/* Service Cards with stagger animation */}
              <div className="mt-6 space-y-5">
                {services.map((service, idx) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
                    whileHover={cardHover}
                    onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-white rounded-3xl p-6 border border-black/5 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
                  >
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-gray-600 mt-3">{service.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-6 text-center"
              >
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="text-xs text-gray-400"
                >
                  ✦ Trusted by 100+ happy clients ✦
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ============================================
          SCROLL INDICATOR
      ============================================== */}
      <motion.div animate={bounce} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-8 h-14 border-2 border-black/40 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-black/50 rounded-full mt-3"
          />
        </div>
      </motion.div>
    </section>
  );
}