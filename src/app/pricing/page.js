"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion, AnimatePresence } from "framer-motion";

/* ==========================================
   LUCIDE ICONS
========================================== */

import {
  Sparkles,
  ChevronRight,
  CheckCircle,
  Zap,
  Database,
  CreditCard,
  Globe,
  Palette,
  Calendar,
  Video,
  Music,
  Monitor,
  Wifi,
  Building2,
  LayoutDashboard,
  ShoppingCart,
  Phone,
  Mail,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Rocket,
  Layers,
  Code,
  Smartphone,
  Server,
  Cloud,
  Lock,
  BarChart,
  Users,
  Gift,
  Plus,
  Minus,
  Package,
  FileText,
} from "lucide-react";

/* ==========================================
   REACT
========================================== */

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/* ==========================================
   PARTICLE POSITIONS
========================================== */

const particlePositions = [15, 25, 35, 45, 55, 65, 75, 85, 20, 40, 60, 80];

/* ==========================================
   PRICING DATA (Base structure)
========================================== */

const pricingPackages = {
  static: {
    icon: Globe,
    title: "Static Website",
    description: "Fast, responsive, perfect for small businesses & portfolios",
    basePrice: 600,
    pagesIncluded: 5,
    extraPagePrice: 80,
    options: [
      { name: "Basic", price: 600, features: ["5 pages (Home, About, Services, Contact, Blog)", "Domain registration (1 year)", "Mobile responsive design", "SEO meta tags setup", "Contact form"] },
      { name: "Standard", price: 800, features: ["Everything in Basic", "Custom logo design", "Advanced contact form with spam protection", "Social media integration", "Google Maps embed"] },
      { name: "Pro", price: 1100, features: ["Everything in Standard", "Calendly integration", "Zoom meeting scheduler", "Live chat widget", "Priority support (30 days)"] },
    ],
  },
  dynamic: {
    icon: Zap,
    title: "Dynamic Motion Site",
    description: "Interactive, animated, modern web experiences",
    basePrice: 900,
    pagesIncluded: 5,
    extraPagePrice: 130,
    options: [
      { name: "Basic", price: 900, features: ["5 dynamic pages", "Smooth scroll animations", "Micro-interactions", "Custom transitions", "Domain registration"] },
      { name: "Standard", price: 1200, features: ["Everything in Basic", "Custom logo design", "Animated contact form", "Parallax effects", "Lazy loading optimization"] },
      { name: "Pro", price: 1600, features: ["Everything in Standard", "Calendly + Zoom integration", "Advanced GSAP animations", "3D elements", "Performance tuning"] },
    ],
  },
  database: {
    icon: Database,
    title: "Database & Dashboard",
    description: "Powerful backend systems & admin panels",
    basePrice: 1200,
    pagesIncluded: 3,
    extraPagePrice: 180,
    options: [
      { name: "Basic", price: 1200, features: ["3 pages + database", "Up to 5 database tables", "Secure authentication", "Data entry interface", "Backup system"] },
      { name: "Simple Admin", price: 1700, features: ["Everything in Basic", "Simple admin dashboard", "CRUD operations", "User role management", "CSV export"] },
      { name: "Premium Admin", price: 2800, features: ["Everything in Simple", "Advanced analytics charts", "Real-time filters", "Audit logs", "Custom reporting"] },
    ],
  },
};

const addOns = [
  { name: "Payment Integration", price: 300, description: "Stripe/PayPal checkout", icon: CreditCard },
  { name: "Payment + Subscriptions", price: 700, description: "Recurring billing & memberships", icon: ShoppingCart },
  { name: "E-commerce Full Store", price: 1500, description: "Complete online store (up to 50 products)", icon: ShoppingCart },
  { name: "SEO Advanced Package", price: 500, description: "Keyword research, backlinks, optimization", icon: TrendingUp },
  { name: "Monthly Maintenance", price: 50, description: "Updates, backups, 1hr support", icon: Shield, recurring: true },
  { name: "Premium Hosting", price: 20, description: "Fast, secure hosting with daily backups", icon: Server, recurring: true },
  { name: "Custom Logo Design", price: 150, description: "Professional logo with 3 concepts", icon: Palette },
  { name: "Content Writing (5 pages)", price: 400, description: "SEO-optimized content creation", icon: FileText },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function PricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTier, setSelectedTier] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [pageCount, setPageCount] = useState({});
  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("packages");

  useEffect(() => {
    setMounted(true);
    loadCategories();
    
    // Initialize selected tiers
    const initialTiers = {};
    Object.keys(pricingPackages).forEach(key => {
      initialTiers[key] = pricingPackages[key].options[0].name;
    });
    setSelectedTier(initialTiers);
    
    // Initialize page counts
    const initialPages = {};
    Object.keys(pricingPackages).forEach(key => {
      initialPages[key] = pricingPackages[key].pagesIncluded;
    });
    setPageCount(initialPages);
  }, []);

  const loadCategories = async () => {
    try {
      const q = query(collection(db, "serviceCategories"), where("active", "==", true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServiceCategories(items);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleBookConsultation = () => {
    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
      const event = new CustomEvent("openConsultation");
      window.dispatchEvent(event);
    } else {
      router.push("/#home");
    }
  };

  const getPackagePrice = (packageKey) => {
    const pkg = pricingPackages[packageKey];
    const tier = pkg.options.find(opt => opt.name === selectedTier[packageKey]);
    const basePrice = tier?.price || pkg.options[0].price;
    const extraPages = Math.max(0, pageCount[packageKey] - pkg.pagesIncluded);
    const extraCost = extraPages * pkg.extraPagePrice;
    return basePrice + extraCost;
  };

  const getTotalPrice = () => {
    let total = 0;
    if (selectedPackage) {
      total += getPackagePrice(selectedPackage);
    }
    selectedAddOns.forEach(addonName => {
      const addon = addOns.find(a => a.name === addonName);
      if (addon) total += addon.price;
    });
    return total;
  };

  const handleStartProject = () => {
    const params = new URLSearchParams();
    if (selectedPackage) {
      const pkg = pricingPackages[selectedPackage];
      params.set("service", pkg.title);
    }
    router.push(`/client-portal?${params.toString()}`);
  };

  /* ==========================================
     ANIMATION VARIANTS
  ========================================== */

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Animated Background Orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      
      {/* Gold Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[100px]" />

      {/* Floating Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              initial={{ x: `${pos}%`, y: "100%", opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.2, 0] }}
              transition={{ duration: 8 + (i % 5) * 1.5, repeat: Infinity, delay: i * 0.6, ease: "linear" }}
              className="absolute w-1 h-1 rounded-full bg-yellow-400/40"
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gold">
              Transparent Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-gold">Upfront</span> Pricing
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your needs. No hidden fees, no surprises.
            Every project includes dedicated support and quality guarantee.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm p-1">
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "packages"
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-600 hover:text-gold"
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "addons"
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-600 hover:text-gold"
              }`}
            >
              Add-ons
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "calculator"
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-600 hover:text-gold"
              }`}
            >
              Custom Builder
            </button>
          </div>
        </motion.div>

        {/* PACKAGES TAB */}
        {activeTab === "packages" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {Object.keys(pricingPackages).map((key, idx) => {
              const pkg = pricingPackages[key];
              const Icon = pkg.icon;
              const currentPrice = getPackagePrice(key);
              
              return (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className="relative rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200 p-6 shadow-xl transition-all hover:shadow-2xl"
                >
                  {key === "dynamic" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl bg-gold/10 p-2.5">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{pkg.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
                    <span className="text-gray-500"> one-time</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    <Layers className="w-4 h-4" />
                    <span>{pkg.pagesIncluded} pages included</span>
                    <span className="text-gold">• ${pkg.extraPagePrice}/extra page</span>
                  </div>
                  
                  {/* Tier Selection */}
                  <div className="mb-4">
                    <select
                      value={selectedTier[key]}
                      onChange={(e) => setSelectedTier(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    >
                      {pkg.options.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name} (${opt.price})</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {pkg.options.find(opt => opt.name === selectedTier[key])?.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => {
                      setSelectedPackage(key);
                      handleStartProject();
                    }}
                    className="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold transition-all hover:bg-gold hover:text-black"
                  >
                    Get Started →
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ADD-ONS TAB */}
        {activeTab === "addons" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {addOns.map((addon, idx) => {
              const Icon = addon.icon;
              const isSelected = selectedAddOns.includes(addon.name);
              
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedAddOns(prev => prev.filter(a => a !== addon.name));
                    } else {
                      setSelectedAddOns(prev => [...prev, addon.name]);
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? "border-gold bg-gold/5 shadow-md"
                      : "border-gray-200 bg-white/80 hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`rounded-xl p-2 ${isSelected ? "bg-gold/20" : "bg-gray-100"}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-gold" : "text-gray-600"}`} />
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-gold" />}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">{addon.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                  
                  <div className="mt-3">
                    <span className="text-xl font-bold text-gray-900">${addon.price}</span>
                    {addon.recurring && <span className="text-xs text-gray-500">/month</span>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* CUSTOM BUILDER TAB */}
        {activeTab === "calculator" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200 p-8 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Package Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  1. Choose Your Package
                </h3>
                
                <div className="space-y-3">
                  {Object.keys(pricingPackages).map((key) => {
                    const pkg = pricingPackages[key];
                    const Icon = pkg.icon;
                    const isSelected = selectedPackage === key;
                    
                    return (
                      <div
                        key={key}
                        onClick={() => setSelectedPackage(key)}
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-gold bg-gold/5 shadow-md"
                            : "border-gray-200 hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                              <Icon className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{pkg.title}</h4>
                              <p className="text-xs text-gray-500">from ${pkg.options[0].price}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-gold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {selectedPackage && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gold" />
                      2. Configure Your Package
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Plan Tier</label>
                        <select
                          value={selectedTier[selectedPackage]}
                          onChange={(e) => setSelectedTier(prev => ({ ...prev, [selectedPackage]: e.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:border-gold focus:ring-1 focus:ring-gold"
                        >
                          {pricingPackages[selectedPackage].options.map(opt => (
                            <option key={opt.name} value={opt.name}>{opt.name} (${opt.price})</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Pages
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPageCount(prev => ({
                              ...prev,
                              [selectedPackage]: Math.max(1, prev[selectedPackage] - 1)
                            }))}
                            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold w-12 text-center">
                            {pageCount[selectedPackage]}
                          </span>
                          <button
                            onClick={() => setPageCount(prev => ({
                              ...prev,
                              [selectedPackage]: prev[selectedPackage] + 1
                            }))}
                            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-500">
                            (${pricingPackages[selectedPackage].extraPagePrice}/extra page)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-gold" />
                      3. Add Extras
                    </h3>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addOns.map(addon => (
                        <label key={addon.name} className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedAddOns.includes(addon.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAddOns(prev => [...prev, addon.name]);
                                } else {
                                  setSelectedAddOns(prev => prev.filter(a => a !== addon.name));
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                            />
                            <span className="text-sm text-gray-700">{addon.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">${addon.price}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Right - Total & Action */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Custom Quote</h3>
                
                {selectedPackage ? (
                  <>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Base Package</span>
                        <span className="font-semibold">
                          ${getPackagePrice(selectedPackage)}
                        </span>
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Add-ons</span>
                          <span className="font-semibold">
                            +${selectedAddOns.reduce((sum, name) => {
                              const addon = addOns.find(a => a.name === name);
                              return sum + (addon?.price || 0);
                            }, 0)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-3 text-lg font-bold">
                        <span>Total</span>
                        <span className="text-gold">${getTotalPrice()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleStartProject}
                      className="w-full rounded-xl bg-gold text-black py-3 font-semibold transition-all hover:bg-gold-dark hover:shadow-lg"
                    >
                      Start Your Project →
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      One-time payment. Domain included for 1 year.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a package to see your quote</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Service Categories Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
            Or browse by service category
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(`/services/${category.slug}`)}
                className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-sm text-gray-700 hover:border-gold hover:text-gold transition-all"
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ / Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>7-day delivery</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-8">
            Need a custom enterprise solution? <button onClick={handleBookConsultation} className="text-gold hover:underline">Contact us for a tailored quote</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}