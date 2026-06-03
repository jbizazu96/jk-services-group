"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion } from "framer-motion";

/* ==========================================
   LUCIDE ICONS
========================================== */

import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/* ==========================================
   REACT
========================================== */

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ==========================================
   NEXT.JS
========================================== */

import { useRouter } from "next/navigation";

/* ==========================================
   FIXED PARTICLE POSITIONS (No Math.random)
========================================== */

const particlePositions = [
  15, 25, 35, 45, 55, 65, 75, 85, 20, 40,
];

/* ==========================================
   COMPONENT
========================================== */

export default function FooterSection() {
  const router = useRouter();
  const [serviceCategories, setServiceCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState({});
  const [mounted, setMounted] = useState(false);

  /* ==========================================
     HANDLE MOUNTING FOR PARTICLES
  ========================================== */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ==========================================
     LOAD SERVICE CATEGORIES
  ========================================== */

  useEffect(() => {
    loadServiceCategories();
  }, []);

  const loadServiceCategories = async () => {
    try {
      const q = query(
        collection(db, "serviceCategories"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServiceCategories(items);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  /* ==========================================
     LOAD SERVICES FOR A CATEGORY
  ========================================== */

  const loadServicesForCategory = async (categoryName) => {
    if (categoryServices[categoryName]) {
      setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
      return;
    }

    try {
      const q = query(
        collection(db, "services"),
        where("category", "==", categoryName),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategoryServices((prev) => ({
        ...prev,
        [categoryName]: items,
      }));
      setExpandedCategory(categoryName);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  /* ==========================================
     SCROLL TO SECTION
  ========================================== */

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  /* ==========================================
     HANDLE BOOK APPOINTMENT
  ========================================== */

  const handleBookAppointment = () => {
    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
      const event = new CustomEvent("openConsultation");
      window.dispatchEvent(event);
    } else {
      router.push("/#home");
    }
  };

  /* ==========================================
     HANDLE PHONE CLICK
  ========================================== */

  const handlePhoneClick = () => {
    const confirmCall = window.confirm("Would you like to call J&K Services Group?");
    if (confirmCall) {
      window.location.href = "tel:+13193613575";
    }
  };

  /* ==========================================
     HANDLE EMAIL CLICK
  ========================================== */

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  /* ==========================================
     COMPANY LINKS
  ========================================== */

  const companyLinks = [
    { name: "About Us", action: () => scrollToSection("about") },
    { name: "Book Appointment", action: handleBookAppointment },
    { name: "Pricing", action: () => router.push("/pricing") },
    { name: "Consultation", action: handleBookAppointment },
  ];

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

  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-br from-[#f8f8f8] via-white to-slate-100 text-black border-t border-gray-200">
      
      {/* ==========================================
          ANIMATED BACKGROUND - LIKE HOMEPAGE
      ========================================== */}
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-200/30 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full pointer-events-none"
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating particles - FIXED: no Math.random() */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              initial={{ x: `${pos}%`, y: "100%", opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.3, 0] }}
              transition={{ duration: 6 + (i % 5) * 1, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/30"
            />
          ))}
        </div>
      )}

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        
        {/* ==========================================
            BRAND SECTION
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/images/logo1.webp"
            alt="J&K Services Group"
            className="w-32 mb-5 cursor-pointer"
            onClick={() => router.push("/")}
          />
          <p className="text-gray-600 leading-relaxed text-sm mb-4">
            Professional event, IT, networking, and creative services focused on excellence,
            innovation, and unforgettable client experiences.
          </p>
          
          {/* Trust Badge */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-black"
                >
                  ✓
                </div>
              ))}
            </div>
            <span className="text-gray-500 text-xs">Trusted by <span className="text-gold font-semibold">happy</span>  clients</span>

          </div>
        </motion.div>

        {/* ==========================================
            SERVICES SECTION - EXPANDABLE CATEGORIES
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Services</h3>
          <ul className="space-y-3">
            {serviceCategories.map((category, index) => (
              <li key={category.id}>
                <motion.div
                  whileHover={{ x: 5 }}
                  onClick={() => loadServicesForCategory(category.name)}
                  className="text-gray-600 hover:text-yellow-600 transition flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className="text-yellow-500" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategory === category.name ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 group-hover:text-yellow-500"
                  >
                    <ChevronRight size={14} />
                  </motion.div>
                </motion.div>
                
                {/* Sub-services dropdown */}
                {expandedCategory === category.name && categoryServices[category.name] && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 mt-2 space-y-2 overflow-hidden"
                  >
                    {categoryServices[category.name].map((service) => (
                      <motion.li
                        key={service.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => router.push(`/services/${category.slug}`)}
                        className="text-gray-500 hover:text-yellow-600 text-xs cursor-pointer transition flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-yellow-500" />
                        {service.name}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ==========================================
            COMPANY SECTION
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Company</h3>
          <ul className="space-y-4">
            {companyLinks.map((item, index) => (
              <motion.li key={index} whileHover={{ x: 5 }}>
                <button
                  onClick={item.action}
                  className="text-gray-600 hover:text-yellow-600 transition flex items-center gap-2 w-full text-left text-sm"
                >
                  <ChevronRight size={16} />
                  {item.name}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ==========================================
            CONTACT SECTION
        ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Contact</h3>
          <div className="space-y-4">
            {/* PHONE */}
            <motion.div
              whileHover={{ x: 5 }}
              onClick={handlePhoneClick}
              className="flex items-center gap-3 text-gray-600 hover:text-yellow-600 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition">
                <Phone size={16} className="text-yellow-500" />
              </div>
              <span className="text-sm">(319) 361-3575</span>
            </motion.div>

            {/* EMAIL 1 */}
            <motion.div
              whileHover={{ x: 5 }}
              onClick={() => handleEmailClick("info@myjkservices.com")}
              className="flex items-center gap-3 text-gray-600 hover:text-yellow-600 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition">
                <Mail size={16} className="text-yellow-500" />
              </div>
              <span className="text-xs break-all">info@myjkservices.com</span>
            </motion.div>

            {/* EMAIL 2 */}
            <motion.div
              whileHover={{ x: 5 }}
              onClick={() => handleEmailClick("support@myjkservices.com")}
              className="flex items-center gap-3 text-gray-600 hover:text-yellow-600 transition cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition">
                <Mail size={16} className="text-yellow-500" />
              </div>
              <span className="text-xs break-all">support@myjkservices.com</span>
            </motion.div>

            {/* AVAILABILITY */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 text-gray-600"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock size={16} className="text-yellow-500" />
              </div>
              <span className="text-sm">Available 7 Days a Week</span>
            </motion.div>
          </div>

          {/* Live Support Indicator */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <motion.div
                animate={pulseDot}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-gray-500 text-xs">Live Support Online</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
          BOTTOM COPYRIGHT
      ========================================== */}
      <div className="relative z-10 border-t border-gray-200 py-6 text-center">
        <p className="text-gray-500 text-sm">
          © 2026 J&K Services Group. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-yellow-500" />
          Designed with excellence
          <Sparkles size={12} className="text-yellow-500" />
        </p>
      </div>
    </footer>
  );
}