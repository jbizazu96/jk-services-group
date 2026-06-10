"use client";

/* ==========================================
   IMPORTS
========================================== */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/* ==========================================
   ICONS
========================================== */

import {
  Sparkles,
  CheckCircle,
  Zap,
  Database,
  CreditCard,
  Globe,
  Palette,
  LayoutDashboard,
  ShoppingCart,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Layers,
  Server,
  Lock,
  Gift,
  Plus,
  Minus,
  Package,
  FileText,
  Cloud,
  MessageCircle,
} from "lucide-react";

/* ==========================================
   PRICING DATA
========================================== */

const pricingPackages = {
  basic: {
    icon: Globe,
    title: "Basic Website",
    description: "Perfect for small businesses & startups",
    basePrice: 500,
    pagesIncluded: 3,
    extraPagePrice: 80,
    options: [
      { name: "Starter", price: 500, features: ["3 pages", "Domain registration (1 year)", "Mobile responsive", "SEO meta tags", "Contact form", "Basic hosting setup"] },
      { name: "Professional", price: 700, features: ["Everything in Starter", "4-5 pages", "Custom logo design", "Contact form", "Social media integration", "Google Maps embed"] },
      { name: "Business", price: 1500, features: ["Everything in Professional", "5-6 pages", "E-commerce ready", "Payment integration", "Calendly/Zoom integration", "Priority support"] },
    ],
  },

  advanced: {
    icon: Zap,
    title: "Advanced Website",
    description: "Dynamic, interactive, modern web experiences",
    basePrice: 700,
    pagesIncluded: 3,
    extraPagePrice: 100,
    options: [
      { name: "Dynamic", price: 700, features: ["3 dynamic pages", "Smooth animations", "Micro-interactions", "Custom transitions", "Domain registration", "CMS integration"] },
      { name: "Premium", price: 1200, features: ["Everything in Dynamic", "4-5 pages", "Custom animations", "Database integration", "User authentication", "Admin dashboard", "API integrations"] },
      { name: "Enterprise", price: 2000, features: ["Everything in Premium", "5-6 pages", "Advanced database", "Custom backend", "Multi-user roles", "Advanced security", "Dedicated support"] },
    ],
  },

  dashboard: {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description: "Powerful backend systems & admin panels",
    basePrice: 1800,
    pagesIncluded: 3,
    extraPagePrice: 200,
    options: [
      { name: "Basic Dashboard", price: 1000, features: ["3 dashboard pages", "User management", "Basic analytics", "Data tables", "Authentication system", "Database setup"] },
      { name: "Advanced Dashboard", price: 2000, features: ["Everything in Basic", "Advanced charts", "Real-time data", "Role-based access", "Activity logs", "Export reports", "Custom widgets"] },
      
    ],
  },

  ecommerce: {
    icon: ShoppingCart,
    title: "E-commerce Website",
    description: "Online stores with payment integration",
    basePrice: 2000,
    pagesIncluded: 5,
    extraPagePrice: 150,
    options: [
      { name: "Basic Store", price: 1500, features: ["5 product pages", "Shopping cart", "Payment gateway", "Order management", "Basic inventory", "Domain registration"] },
      { name: "Pro Store", price: 2500, features: ["Everything in Basic", "50 products", "Advanced inventory", "Discount codes", "Email notifications", "Customer accounts", "Admin dashboard"] },
      { name: "Enterprise Store", price: 3500, features: ["Everything in Pro", "Unlimited products", "Subscription system", "Advanced reporting", "API Integration", "Priority support"] },
    ],
  },
  
};

const addOns = [
  { name: "Payment Integration", price: 200, description: "Stripe/PayPal checkout", icon: CreditCard },
  { name: "Payment + Subscriptions", price: 500, description: "Recurring billing & memberships", icon: ShoppingCart },
  { name: "Automatic Email Integration", price: 300, description: "Automatically sending emails to your customers", icon: MessageCircle },
  { name: "SEO Advanced Package", price: 500, description: "Keyword research, backlinks, optimization", icon: TrendingUp },
  { name: "Monthly Maintenance", price: 50, description: "Updates, backups, 1hr support", icon: Shield, recurring: true },
  { name: "Premium Hosting", price: 50, description: "Fast, secure hosting with daily backups", icon: Server, recurring: true },
  { name: "Custom Logo Design", price: 150, description: "Professional logo with 3 concepts", icon: Palette },
  { name: "Content Writing (5 pages)", price: 400, description: "SEO-optimized content creation", icon: FileText },
  { name: "Database Setup", price: 500, description: "Custom database configuration", icon: Database },
  { name: "API Integration", price: 500, description: "Connect to external services", icon: Cloud },
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
    
    const initialTiers = {};
    Object.keys(pricingPackages).forEach(key => {
      initialTiers[key] = pricingPackages[key].options[0].name;
    });
    setSelectedTier(initialTiers);
    
    const initialPages = {};
    Object.keys(pricingPackages).forEach(key => {
      initialPages[key] = pricingPackages[key].pagesIncluded;
    });
    setPageCount(initialPages);
  }, []);

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

  /* ==========================================
     BUILD DETAILED DESCRIPTION WITH ADD-ONS
  ========================================== */
  const buildDetailedDescription = (packageKey, tierName, pageCountValue, addOnsList) => {
    const pkg = pricingPackages[packageKey];
    const tier = pkg.options.find(opt => opt.name === tierName);
    const basePrice = tier?.price || pkg.options[0].price;
    const extraPages = Math.max(0, pageCountValue - pkg.pagesIncluded);
    const extraCost = extraPages * pkg.extraPagePrice;
    const packageTotal = basePrice + extraCost;
    
    let addOnsTotal = 0;
    let addOnsDetails = [];
    addOnsList.forEach(addonName => {
      const addon = addOns.find(a => a.name === addonName);
      if (addon) {
        addOnsTotal += addon.price;
        addOnsDetails.push(`   • ${addon.name}: +$${addon.price}`);
      }
    });
    const finalTotal = packageTotal + addOnsTotal;
    
    let description = `📦 PACKAGE: ${pkg.title} - ${tierName}\n`;
    description += `📄 PAGES: ${pageCountValue} (${pkg.pagesIncluded} included`;
    if (extraPages > 0) {
      description += `, +${extraPages} extra @ $${pkg.extraPagePrice}/page`;
    }
    description += `)\n`;
    description += `💰 BASE PRICE: $${packageTotal}\n`;
    
    if (addOnsDetails.length > 0) {
      description += `\n✅ ADD-ONS SELECTED:\n`;
      addOnsDetails.forEach(detail => {
        description += `${detail}\n`;
      });
      description += `\n📦 ADD-ONS TOTAL: +$${addOnsTotal}\n`;
    }
    
    description += `\n💵 TOTAL QUOTE: $${finalTotal}`;
    
    return { description, finalTotal, packageTotal, addOnsTotal };
  };

  /* ==========================================
     SEND TO CLIENT PORTAL WITH FULL DETAILS
  ========================================== */
  const handleStartProject = (packageKey) => {
    const activePackage = packageKey || selectedPackage;
    
    if (!activePackage) {
      console.error("No package selected");
      return;
    }
    
    const params = new URLSearchParams();
    const pkg = pricingPackages[activePackage];
    const selectedTierName = selectedTier[activePackage];
    const currentPageCount = pageCount[activePackage];
    
    // Build detailed description with add-ons
    const { description, finalTotal, packageTotal, addOnsTotal } = buildDetailedDescription(
      activePackage,
      selectedTierName,
      currentPageCount,
      selectedAddOns
    );
    
    // Core service info
    params.set("service", "Website Development");
    params.set("category", "Website Development");
    params.set("categorySlug", "website-development");
    params.set("source", "pricing");
    params.set("type", "quote");
    
    // Package details
    params.set("package", `${pkg.title} - ${selectedTierName}`);
    params.set("packageType", activePackage);
    params.set("packageTier", selectedTierName);
    
    // Page details
    params.set("pages", currentPageCount.toString());
    params.set("pagesIncluded", pkg.pagesIncluded.toString());
    params.set("extraPagePrice", pkg.extraPagePrice.toString());
    
    // Pricing
    params.set("budget", finalTotal.toString());
    params.set("basePrice", packageTotal.toString());
    params.set("addonsTotal", addOnsTotal.toString());
    
    // Add-ons
    if (selectedAddOns.length > 0) {
      params.set("addons", selectedAddOns.join(","));
      params.set("addonsCount", selectedAddOns.length.toString());
    }
    
    // The detailed description (this will show in the form)
    params.set("description", description);
    
    // Project title
    params.set("projectTitle", `Quote: ${pkg.title} - ${selectedTierName}`);
    
    // Full details as JSON
    const packageDetails = {
      title: pkg.title,
      tier: selectedTierName,
      basePrice: packageTotal,
      addons: selectedAddOns,
      addonsTotal: addOnsTotal,
      total: finalTotal,
      pages: currentPageCount,
      pagesIncluded: pkg.pagesIncluded,
      extraPagePrice: pkg.extraPagePrice,
      category: "Website Development",
      categorySlug: "website-development",
      description: description
    };
    params.set("details", JSON.stringify(packageDetails));
    
    console.log("=== SENDING TO CLIENT PORTAL ===");
    console.log("Description:", description);
    console.log("Final URL:", `/client?${params.toString()}`);
    
    router.push(`/client?${params.toString()}`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Background Effects */}
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
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[100px]" />

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
              Website Development Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-gold">Upfront</span> Pricing
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect package for your website needs. All packages include 
            professional setup and dedicated support.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
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
        </div>

        {/* PACKAGES TAB */}
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {Object.keys(pricingPackages).map((key) => {
              const pkg = pricingPackages[key];
              const Icon = pkg.icon;
              const currentPrice = getPackagePrice(key);
              
              return (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -8 }}
                  className="relative rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200 p-6 shadow-xl transition-all hover:shadow-2xl"
                >
                  {key === "advanced" && (
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
                  
                  <div className="mb-4">
                    <select
                      value={selectedTier[key]}
                      onChange={(e) => setSelectedTier(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-gold focus:ring-1 focus:ring-gold"
                    >
                      {pkg.options.map(opt => (
                        <option key={opt.name} value={opt.name}>{opt.name} (${opt.price})</option>
                      ))}
                    </select>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {pkg.options.find(opt => opt.name === selectedTier[key])?.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pkg.options.find(opt => opt.name === selectedTier[key])?.features.length > 4 && (
                      <li className="text-xs text-gray-400 pl-6">+ more features</li>
                    )}
                  </ul>
                  
                  <button
                    onClick={() => handleStartProject(key)}
                    className="w-full rounded-xl bg-gray-900 text-white py-3 font-semibold transition-all hover:bg-gold hover:text-black"
                  >
                    Get Started →
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ADD-ONS TAB */}
        {activeTab === "addons" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {addOns.map((addon, idx) => {
              const Icon = addon.icon;
              const isSelected = selectedAddOns.includes(addon.name);
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedAddOns(prev => prev.filter(a => a !== addon.name));
                    } else {
                      setSelectedAddOns(prev => [...prev, addon.name]);
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
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
                  
                  <h3 className="font-semibold text-gray-900 text-sm">{addon.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                  
                  <div className="mt-2">
                    <span className="text-lg font-bold text-gray-900">${addon.price}</span>
                    {addon.recurring && <span className="text-xs text-gray-500">/month</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CUSTOM BUILDER TAB */}
        {activeTab === "calculator" && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200 p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Choose Package</h3>
                <div className="space-y-3 mb-6">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Configure</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Plan Tier</label>
                        <select
                          value={selectedTier[selectedPackage]}
                          onChange={(e) => setSelectedTier(prev => ({ ...prev, [selectedPackage]: e.target.value }))}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:border-gold"
                        >
                          {pricingPackages[selectedPackage].options.map(opt => (
                            <option key={opt.name} value={opt.name}>{opt.name} (${opt.price})</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pages</label>
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
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">3. Add Extras</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
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
              
              {/* Right - Total */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Custom Quote</h3>
                
                {selectedPackage ? (
                  <>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Base Package</span>
                        <span className="font-semibold">${getPackagePrice(selectedPackage)}</span>
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
                      onClick={() => handleStartProject(selectedPackage)}
                      className="w-full rounded-xl bg-gold text-black py-3 font-semibold transition-all hover:bg-gold-dark hover:shadow-lg"
                    >
                      Request This Quote →
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      You'll be redirected to our quote request form
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
          </div>
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