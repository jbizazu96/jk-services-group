"use client";

/* ==========================================
   IMPORTS
   ========================================== */
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Heart, ArrowRight, Zap, Compass, Users, Camera, Info, Phone } from "lucide-react";

/* ==========================================
   MAIN COMPONENT
   ========================================== */
export default function Navbar() {
  // STATE MANAGEMENT
  const [mobileMenu, setMobileMenu] = useState(false);
  const [donationMenu, setDonationMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeDonationOption, setActiveDonationOption] = useState(null);
  const navbarRef = useRef(null);

  /* ==========================================
     SCROLL EFFECT
  ========================================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setDonationMenu(false);
      setMobileMenu(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==========================================
     NAVIGATION HANDLER
  ========================================== */
  const handleNavigation = (item) => {
    setMobileMenu(false);
    setDonationMenu(false);
    
    if (item === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ==========================================
     NAVIGATION LINKS WITH ICONS
  ========================================== */
  const navLinks = [
    { name: "Home", icon: Compass, color: "#FFD700" },
    { name: "Services", icon: Zap, color: "#FF6B6B" },
    { name: "Gallery", icon: Camera, color: "#4ECDC4" },
    { name: "Team", icon: Users, color: "#45B7D1" },
    { name: "About", icon: Info, color: "#96CEB4" },
    { name: "Contact", icon: Phone, color: "#FFEAA7" },
  ];

  /* ==========================================
     DONATION OPTIONS
  ========================================== */
  const donationOptions = [
    { label: "Donate $10", amount: 10, link: "https://buy.stripe.com/8x27sF8IK6at7O5gM5grS00", type: "primary" },
    { label: "Donate $25", amount: 25, link: "https://buy.stripe.com/fZueV7aQS1Udc4l3ZjgrS03", type: "secondary" },
    { label: "Donate $50", amount: 50, link: "https://buy.stripe.com/3cI7sF3oqfL39Wd1RbgrS04", type: "secondary" },
    { label: "Custom Amount", amount: "custom", link: "https://donate.stripe.com/6oU3cp3oq9mF4BTbrLgrS05", type: "outline" },
  ];

  /* ==========================================
     ANIMATION VARIANTS
  ========================================== */
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        delay: 0.2
      }
    }
  };

  const linkVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const underlineVariants = {
    initial: { width: "0%", left: "50%" },
    hover: { 
      width: "100%", 
      left: "0%",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.nav
      ref={navbarRef}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-700
        ${scrolled 
          ? "bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]" 
          : "bg-black/30 backdrop-blur-md"
        }
      `}
    >
      {/* Animated Gradient Border Top */}
      <motion.div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
        animate={{
          width: ["0%", "100%", "0%"],
          left: ["0%", "0%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* ==========================================
          DESKTOP VERSION - WITH FIXES (Compact)
      ========================================== */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* LOGO - Desktop (Compact) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <img 
                src="/images/logo1.png" 
                alt="Logo" 
                className="w-14 h-14 object-contain relative z-10 rounded-full"
              />
            </div>
            
            <div>
              <motion.h1 
                className="text-2xl font-black bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent whitespace-nowrap"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                J&K Services Group
              </motion.h1>
              <div className="flex items-center gap-1">
                <Sparkles size={12} className="text-yellow-400" />
                <p className="text-xs text-gray-300">Event • IT • Networking • Media</p>
                <Sparkles size={12} className="text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* DESKTOP MENU - Compact (with fixes) */}
          <div className="flex items-center gap-3 xl:gap-5">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredLink(link.name)}
                onHoverEnd={() => setHoveredLink(null)}
                className="relative"
              >
                <motion.button
                  onClick={() => handleNavigation(link.name)}
                  className="relative text-white font-medium group cursor-pointer bg-transparent border-none px-2 xl:px-3 py-2"
                >
                  <div className="flex items-center gap-1.5 relative z-10">
                    <link.icon size={14} className="transition-colors duration-300 hidden xl:block" style={{ color: hoveredLink === link.name ? link.color : "white" }} />
                    <span className="tracking-wide text-sm xl:text-base whitespace-nowrap">{link.name}</span>
                  </div>
                  
                  <motion.span
                    variants={underlineVariants}
                    initial="initial"
                    animate={hoveredLink === link.name ? "hover" : "initial"}
                    className="absolute -bottom-2 left-0 h-[2px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${link.color}, ${link.color}80)` }}
                  />
                  
                  <motion.div
                    variants={glowVariants}
                    initial="initial"
                    animate={hoveredLink === link.name ? "hover" : "initial"}
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      background: `radial-gradient(circle at center, ${link.color}20, transparent 70%)`,
                      filter: "blur(8px)"
                    }}
                  />
                </motion.button>
                
                <motion.span
                  className="absolute -top-2 -right-1 text-[8px] font-bold text-yellow-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: hoveredLink === link.name ? 1 : 0, scale: hoveredLink === link.name ? 1 : 0 }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>
              </motion.div>
            ))}

            {/* DONATE BUTTON - Desktop (Compact) */}
            <div className="relative ml-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDonationMenu(!donationMenu)}
                className="relative overflow-hidden group cursor-pointer rounded-full px-5 md:px-6 py-2.5 md:py-3"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                />
                
                <div className="relative z-10 flex items-center gap-1.5 text-black font-bold text-sm md:text-base">
                  <Heart size={16} className="group-hover:animate-pulse" />
                  <span>Donate</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
                
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.button>

              <AnimatePresence>
                {donationMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 mt-4 w-72 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl z-50 overflow-hidden"
                  >
                    <motion.div 
                      className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="text-yellow-400" size={20} />
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                        Support Our Mission
                      </h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">
                      Your donation helps us create unforgettable experiences
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      {donationOptions.map((option, idx) => (
                        <motion.a
                          key={option.label}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onHoverStart={() => setActiveDonationOption(idx)}
                          onHoverEnd={() => setActiveDonationOption(null)}
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            relative overflow-hidden text-center py-3 rounded-2xl font-semibold transition-all duration-300
                            ${option.type === "primary" 
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg shadow-yellow-500/25"
                              : option.type === "outline"
                              ? "border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                              : "bg-white/10 text-white hover:bg-white hover:text-black"
                            }
                          `}
                        >
                          <span className="relative z-10">{option.label}</span>
                          {option.type === "primary" && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300"
                              initial={{ x: "-100%" }}
                              animate={{ x: activeDonationOption === idx ? "100%" : "-100%" }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </motion.a>
                      ))}
                    </div>
                    
                    <motion.div 
                      className="mt-4 pt-4 border-t border-white/10 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-xs text-gray-500">
                        <span className="text-yellow-400">♥</span> Join 500+ supporters
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          MOBILE VERSION - ORIGINAL (No fixes, original spacing)
      ========================================== */}
      <div className="lg:hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          
          {/* LOGO - Mobile (Original - no flex-shrink, full size) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img 
              src="/images/logo1.png" 
              alt="Logo" 
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-white">J&K Services Group</h1>
              <p className="text-xs text-gray-300">Event • IT • Networking • Media</p>
            </div>
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="relative w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: mobileMenu ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenu ? <X size={20} className="text-yellow-400" /> : <Menu size={20} className="text-white" />}
            </motion.div>
          </motion.button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-black/95 backdrop-blur-2xl border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigation(link.name)}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 text-white text-lg font-medium text-left bg-transparent border-none cursor-pointer group"
                  >
                    <link.icon size={20} className="text-yellow-400" />
                    <span>{link.name}</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </motion.button>
                ))}

                {/* Mobile Donate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDonationMenu(!donationMenu)}
                  className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold px-6 py-4 rounded-full transition cursor-pointer mt-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Heart size={18} />
                    <span>Donate</span>
                  </div>
                </motion.button>

                {/* Mobile Donation Options */}
                <AnimatePresence>
                  {donationMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-3 overflow-hidden"
                    >
                      <h3 className="text-xl font-bold text-white mb-2">Support Our Mission</h3>
                      {donationOptions.map(({ label, link, type }) => (
                        <motion.a
                          key={label}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            text-center py-3 rounded-2xl transition font-semibold
                            ${type === "primary" 
                              ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                              : type === "outline"
                              ? "border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                              : "bg-white/10 text-white hover:bg-white hover:text-black"
                            }
                          `}
                        >
                          {label}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}