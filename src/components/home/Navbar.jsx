"use client";

/* ==========================================
   IMPORTS
   ========================================== */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* ==========================================
   MAIN COMPONENT
   ========================================== */
export default function Navbar() {
  // STATE MANAGEMENT
  const [mobileMenu, setMobileMenu] = useState(false);     // Controls mobile menu visibility
  const [donationMenu, setDonationMenu] = useState(false); // Controls donation dropdown
  const [scrolled, setScrolled] = useState(false);         // Tracks if user has scrolled past 40px

  /* ==========================================
     SCROLL EFFECT
     - Changes navbar background when scrolled
     - Closes menus automatically when scrolling
  ========================================== */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);  // Add background after 40px scroll
      setDonationMenu(false);             // Close donation dropdown
      setMobileMenu(false);               // Close mobile menu
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==========================================
     NAVIGATION HANDLER
     - Handles all navigation clicks
     - Special case for "Home" (scrolls to top)
     - Others scroll to their respective sections
  ========================================== */
  const handleNavigation = (item) => {
    setMobileMenu(false);   // Close mobile menu
    setDonationMenu(false); // Close donation dropdown
    
    if (item === "Home") {
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // Find element by ID (lowercase version of the item name)
    const element = document.getElementById(item.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ==========================================
     NAVIGATION LINKS DATA
  ========================================== */
  const navLinks = ["Home", "Services", "Gallery", "Team", "About", "Contact"];

  /* ==========================================
     DONATION OPTIONS DATA
     - label: Display text on button
     - link: Stripe payment URL
     - type: Determines button styling (yellow/dark/outline)
  ========================================== */
  const donationOptions = [
    { label: "Donate $10", link: "https://buy.stripe.com/8x27sF8IK6at7O5gM5grS00", type: "yellow" },
    { label: "Donate $25", link: "https://buy.stripe.com/fZueV7aQS1Udc4l3ZjgrS03", type: "dark" },
    { label: "Donate $50", link: "https://buy.stripe.com/3cI7sF3oqfL39Wd1RbgrS04", type: "dark" },
    { label: "Custom Amount", link: "https://donate.stripe.com/6oU3cp3oq9mF4BTbrLgrS05", type: "outline" },
  ];

  /* ==========================================
     JSX RENDER
  ========================================== */
  return (
    <motion.nav
      initial={{ y: -100 }}        // Start hidden above screen
      animate={{ y: 0 }}            // Slide down into view
      transition={{ duration: 0.7 }} // Smooth animation
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-500
        /* Dynamic background based on scroll position */
        ${scrolled 
          ? "bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]" 
          : "bg-black/40 backdrop-blur-xl"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* ==========================================
            LOGO / BRAND SECTION
            - Clicking scrolls to top of page
        ========================================== */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img src="/images/logo1.png" alt="Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-2xl font-black text-white">J&K Services Group</h1>
            <p className="text-sm text-gray-300">Event • IT • Networking • Media</p>
          </div>
        </motion.div>

        {/* ==========================================
            DESKTOP MENU (Visible on lg screens and up)
        ========================================== */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <motion.button
              key={item}
              onClick={() => handleNavigation(item)}
              whileHover={{ y: -2 }}
              className="relative text-white font-medium group cursor-pointer bg-transparent border-none"
            >
              {item}
              {/* Animated underline on hover */}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </motion.button>
          ))}

          {/* ==========================================
              DONATE BUTTON (Desktop)
              - Opens/closes donation dropdown
          ========================================== */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDonationMenu(!donationMenu)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-full transition shadow-[0_10px_40px_rgba(234,179,8,0.35)] cursor-pointer"
            >
              Donate
            </motion.button>

            {/* Donation Dropdown Menu - Animates in/out */}
            <AnimatePresence>
              {donationMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-4 w-72 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl z-50"
                >
                  <h3 className="text-xl font-bold mb-4 text-white">Support Our Mission</h3>
                  <div className="flex flex-col gap-3">
                    {donationOptions.map(({ label, link, type }) => (
                      <motion.a
                        key={label}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          text-center py-3 rounded-2xl font-semibold transition
                          /* Dynamic styling based on donation type */
                          ${type === "yellow" 
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ==========================================
            MOBILE MENU BUTTON
            - Toggles mobile menu on/off
        ========================================== */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-white"
        >
          {mobileMenu ? <X size={30} /> : <Menu size={30} />}
        </motion.button>
      </div>

      {/* ==========================================
          MOBILE MENU (Visible when mobileMenu is true)
          - Slides down with smooth animation
      ========================================== */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {/* Mobile Navigation Links */}
              {navLinks.map((item) => (
                <motion.button
                  key={item}
                  onClick={() => handleNavigation(item)}
                  whileHover={{ x: 5 }}
                  className="text-white text-lg font-medium text-left bg-transparent border-none cursor-pointer"
                >
                  {item}
                </motion.button>
              ))}

              {/* Mobile Donate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDonationMenu(!donationMenu)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-4 rounded-full transition cursor-pointer"
              >
                Donate
              </motion.button>

              {/* Mobile Donation Options (shows when donationMenu is true) */}
              <AnimatePresence>
                {donationMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-3"
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
                          ${type === "yellow" 
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
    </motion.nav>
  );
}