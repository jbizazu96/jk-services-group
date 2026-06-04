"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Church,
  Heart,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Video,
  Sparkles,
  Star,
  Users,
  HandHeart,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

/* ==========================================
   FADE IN VARIANTS
========================================== */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function ChurchPage() {
  const [prayerName, setPrayerName] = useState("");
  const [prayerEmail, setPrayerEmail] = useState("");
  const [prayerPhone, setPrayerPhone] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ==========================================
     SCROLL LISTENER
  ========================================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==========================================
     VALIDATE PRAYER FORM
  ========================================== */
  const validatePrayerForm = () => {
    const newErrors = {};
    if (!prayerName.trim()) newErrors.name = "Name is required";
    if (!prayerEmail.trim()) newErrors.email = "Email is required";
    if (!prayerRequest.trim()) newErrors.request = "Please share your prayer request";
    if (prayerRequest.trim().length < 5)
      newErrors.request = "Please provide more detail";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ==========================================
     HANDLE PRAYER SUBMIT
  ========================================== */
  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (!validatePrayerForm()) return;
    setPrayerSubmitted(true);
  };

  /* ==========================================
     RESET PRAYER FORM
  ========================================== */
  const resetPrayerForm = () => {
    setPrayerName("");
    setPrayerEmail("");
    setPrayerPhone("");
    setPrayerRequest("");
    setPrayerSubmitted(false);
    setErrors({});
  };

  /* ==========================================
     NAV LINKS
  ========================================== */
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Prayer", href: "#prayer" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* ==========================================
          GOLD GLOW BACKGROUNDS
      ========================================== */}
      <div className="fixed top-[-250px] left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none" />

      {/* ==========================================
          HEADER / NAVIGATION
      ========================================== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg"
            : "bg-white/70 backdrop-blur-lg border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-amber-100 p-2">
              <Church className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Sion Blessing <span className="text-amber-600">Ministries</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="text-sm font-medium text-gray-600 hover:text-amber-700 border-b-2 border-transparent hover:border-amber-500 transition-colors pb-1"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl p-2 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-600 hover:text-amber-700 py-2 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section id="home" className="relative w-full">
        <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Church worship"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/20 backdrop-blur-sm px-6 py-3 mb-8"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-200">
                  Welcome to Sion Blessing
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                Sion Blessing <br className="md:hidden" />
                <span className="text-amber-400">Ministries</span>
              </h1>
              <p className="text-lg md:text-2xl text-white/85 mb-10 max-w-2xl drop-shadow-lg leading-relaxed">
                Faith, Fellowship & Blessings in Iowa City
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  href="#prayer"
                  className="rounded-xl bg-amber-500 px-8 py-4 text-base font-semibold text-gray-900 hover:bg-amber-400 transition-colors shadow-2xl flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Prayer Request
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  href="#services"
                  className="rounded-xl border-2 border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  View Services
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          WELCOME SECTION
      ========================================== */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Welcome Home
            </span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Our <span className="text-amber-600">Church</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
            We are a vibrant community rooted in faith, love, and service. Join us as we grow together in God's word.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Video className="w-7 h-7" />, title: "Prayer Meetings", desc: "Daily Zoom prayers & Friday temple gathering to uplift your spirit." },
              { icon: <Church className="w-7 h-7" />, title: "Sunday Worship", desc: "Two services every Sunday: 8AM & 12PM. All are welcome." },
              { icon: <Heart className="w-7 h-7" />, title: "Community Care", desc: "Serving Iowa City with compassion and outreach programs." },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-shadow"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="rounded-2xl bg-amber-50 p-4 inline-flex mb-6"
                >
                  <span className="text-amber-600">{card.icon}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-500">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          ABOUT SECTION
      ========================================== */}
      <section id="about" className="relative z-10 py-24 px-6 bg-white border-y border-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div
              variants={scaleIn}
              className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
            >
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Church fellowship"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About Our <span className="text-amber-600">Ministry</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Founded on the principles of faith, hope and love, we have been serving the Iowa City community for years. Our mission is to spread the gospel and provide a spiritual home for everyone.
              </p>
              <div className="space-y-4 text-gray-700">
                {/* FIXED: Changed motion.p to motion.div to avoid div inside p */}
                <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-default">
                  <span className="rounded-lg bg-amber-100 p-2 inline-flex">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </span>
                  <strong>1024 Gilbert St, Iowa City, IA 52240</strong>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-default">
                  <span className="rounded-lg bg-amber-100 p-2 inline-flex">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </span>
                  <span>(319) 555-0147</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          SERVICES / SCHEDULE SECTION
      ========================================== */}
      <section id="services" className="relative z-10 py-24 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-6">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Join Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Weekly Service <span className="text-amber-600">Schedule</span>
            </h2>
            <p className="text-gray-500">Find a time to connect with God and community.</p>
          </motion.div>

          <motion.div
            variants={scaleIn}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
          >
            {[
              { day: "Monday – Thursday", time: "8:00 PM – 9:00 PM", event: "Zoom Prayer", icon: <Video className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" },
              { day: "Friday", time: "8:00 PM – 10:00 PM", event: "Prayer at the Temple", icon: <Church className="w-4 h-4" />, color: "bg-purple-50 text-purple-600" },
              { day: "Sunday", time: "8:00 AM – 10:00 AM", event: "First Service", icon: <Calendar className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
              { day: "Sunday", time: "12:00 PM – 2:30 PM", event: "Second Service", icon: <Calendar className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 6, backgroundColor: "#fefce8" }}
                className="flex justify-between items-center py-5 px-4 rounded-xl border-b border-gray-100 last:border-b-0 flex-wrap gap-3 transition-colors"
              >
                <span className="font-semibold text-gray-800 flex items-center gap-3">
                  <span className={`rounded-lg p-2 ${item.color}`}>{item.icon}</span>
                  {item.day}
                </span>
                <span className="text-gray-600">
                  <strong>{item.event}:</strong> {item.time}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.p variants={fadeInUp} className="text-center text-gray-400 text-sm mt-6 italic">
            All are invited. Zoom link provided upon request.
          </motion.p>
        </motion.div>
      </section>

      {/* ==========================================
          PRAYER REQUEST SECTION
      ========================================== */}
      <section id="prayer" className="relative z-10 py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {prayerSubmitted ? (
              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="rounded-full bg-green-100 p-5 inline-flex mb-8"
                >
                  <CheckCircle2 className="h-14 w-14 text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Prayer Request Received</h2>
                <p className="text-gray-500 mb-8 text-lg">Our ministry team will lift your request in prayer. God bless you.</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetPrayerForm}
                  className="rounded-xl bg-amber-500 px-8 py-4 font-semibold text-gray-900 hover:bg-amber-400 transition-colors shadow-lg"
                >
                  Submit Another Request
                </motion.button>
              </motion.div>
            ) : (
              /* FORM STATE */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-6">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                      Prayer Wall
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Submit a <span className="text-amber-600">Prayer Request</span>
                  </h2>
                  <p className="text-gray-500 text-lg">Share your heart with us. We believe in the power of prayer.</p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={handlePrayerSubmit}
                  className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-2xl space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-amber-600">*</span></label>
                    <input
                      value={prayerName}
                      onChange={(e) => { setPrayerName(e.target.value); if (errors.name) setErrors({ ...errors, name: "" }); }}
                      placeholder="Enter your full name"
                      className={`w-full rounded-xl border ${errors.name ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-amber-600">*</span></label>
                    <input
                      type="email"
                      value={prayerEmail}
                      onChange={(e) => { setPrayerEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                      placeholder="your@email.com"
                      className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={prayerPhone}
                      onChange={(e) => setPrayerPhone(e.target.value)}
                      placeholder="(319) 555-0147"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request <span className="text-amber-600">*</span></label>
                    <textarea
                      rows={5}
                      value={prayerRequest}
                      onChange={(e) => { setPrayerRequest(e.target.value); if (errors.request) setErrors({ ...errors, request: "" }); }}
                      placeholder="Share your prayer request here..."
                      className={`w-full rounded-xl border ${errors.request ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none transition-all`}
                    />
                    {errors.request && <p className="text-red-500 text-xs mt-1">{errors.request}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 py-4 text-base font-semibold text-gray-900 hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Prayer Request
                  </motion.button>
                  <p className="text-center text-xs text-gray-400">
                    Your request is kept confidential and prayed over by our ministry team.
                  </p>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ==========================================
          CONTACT SECTION
      ========================================== */}
      <section id="contact" className="relative z-10 py-24 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-6">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Find Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact & <span className="text-amber-600">Location</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="md:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-600" /> Church Office
              </h3>
              <div className="space-y-5 text-gray-700">
                {/* FIXED: Changed motion.p to motion.div */}
                {[
                  { icon: <MapPin className="w-5 h-5" />, text: "1024 Gilbert St, Iowa City, IA 52240" },
                  { icon: <Phone className="w-5 h-5" />, text: "(319) 555-0147" },
                  { icon: <Mail className="w-5 h-5" />, text: "info@sionblessing.org" },
                  { icon: <Clock className="w-5 h-5" />, text: "Office: Tue–Fri 10AM–3PM" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 cursor-default"
                  >
                    <span className="text-amber-600 shrink-0 mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              className="md:col-span-3 rounded-3xl border border-gray-200 overflow-hidden shadow-xl h-[350px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.519888765345!2d-91.5325!3d41.659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e441f3a9e7c7ef%3A0x724f9c87f4e46b!2s1024%20Gilbert%20St%2C%20Iowa%20City%2C%20IA%2052240!5e0!3m2!1sen!2sus!4v1690000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="relative z-10 bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-500" /> Sion Blessing
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Spreading the love of Christ in Iowa City and beyond. Everyone is welcome.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                {["#home", "#about", "#services", "#prayer"].map((href, i) => (
                  <a
                    key={i}
                    href={href}
                    className="block text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> 1024 Gilbert St, Iowa City</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /> (319) 555-0147</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" /> prayer@sionblessing.org</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-white font-semibold mb-4">Gathering Times</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Zoom Prayer: Mon-Thu 8PM</p>
                <p>Friday Temple: 8PM-10PM</p>
                <p>Sunday: 8AM & 12PM</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500"
          >
            &copy; {new Date().getFullYear()} Sion Blessing Ministries. All rights reserved. | Designed with faith.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}