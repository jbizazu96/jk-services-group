"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Import your existing Booking Modal
import BookingModal from "@/components/home/modals/BookingModal";

import { useRouter } from "next/navigation";

import {
  Sparkles,
  CheckCircle,
  Star,
  Clock,
  Shield,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  Car,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  PartyPopper,
  Gem,
  Users,
  Zap,
  Mail,
  HelpCircle,
  Palette,
  Brush,
  Eye,
  Lipstick,
  SprayCan,
  Crown,
  Flower2,
  Camera,
  Scissors,
  Hand,
  Wifi,
  Sun,
  Moon,
  Coffee,
  Gift,
  Music,
} from "lucide-react";

/* ==========================================
   MAKEUP PACKAGES
========================================== */

const makeupPackages = {
  essential: {
    icon: Brush,
    title: "Essential Glam",
    subtitle: "Natural Elegance",
    description: "Professional makeup application that enhances your natural beauty for any occasion.",
    basePrice: 150,
    hoursIncluded: 1,
    popular: false,
    features: [
      "Foundation & complexion matching",
      "Natural eye makeup application",
      "Lip color application",
      "Brow grooming & shaping",
      "Light contouring & highlight",
      "Setting spray finish",
      "Touch-up kit included",
      "Pre-event consultation (15 min call)",
    ],
    bestFor: ["Lunch Dates", "Professional Headshots", "Casual Events", "Everyday Glam"],
  },
  signature: {
    icon: Palette,
    title: "Signature Glam",
    subtitle: "Full Glam Experience",
    description: "Our most popular package with premium products and personalized consultation.",
    basePrice: 250,
    hoursIncluded: 1.5,
    popular: true,
    features: [
      "Everything in Essential Glam",
      "Full coverage foundation",
      "Dramatic eye looks (smokey/cut crease)",
      "False lash application",
      "Full contour & highlight",
      "Ombré lip technique",
      "Premium brand products",
      "Pre-event consultation (30 min)",
      "Skin prep & primer",
      "Long-wear setting",
      "Mini emergency kit",
    ],
    bestFor: ["Wedding Guests", "Birthday Parties", "Date Nights", "Photo Shoots"],
  },
  bridal: {
    icon: Crown,
    title: "Bridal Luxe",
    subtitle: "Ultimate Wedding Experience",
    description: "Comprehensive bridal package with trial run, premium products, and on-location service.",
    basePrice: 450,
    hoursIncluded: 2.5,
    popular: false,
    bestValue: true,
    features: [
      "Everything in Signature Glam",
      "Wedding day trial session",
      "Bridal party coordination",
      "Airbrush foundation option",
      "Custom lip color mixing",
      "Waterproof & sweat-proof",
      "Skin hydration treatment",
      "Bridal touch-up kit",
      "On-location service",
      "Mini emergency kit",
      "Assistance with veil/accessories",
      "Day-of timeline coordination",
      "Multiple pre-event consultations",
    ],
    bestFor: ["Brides", "Bridal Showers", "Engagement Parties", "Rehearsal Dinners"],
  },
  vip: {
    icon: Gem,
    title: "VIP Experience",
    subtitle: "Full Bridal Party & Luxury",
    description: "Complete bridal party glam with dedicated artists and premium everything.",
    basePrice: 800,
    hoursIncluded: 4,
    popular: false,
    features: [
      "Everything in Bridal Luxe",
      "3+ makeup artists for group",
      "Bridal party makeup (up to 5 people)",
      "Flower girl makeup",
      "Custom beauty bar setup",
      "Champagne & mimosas",
      "Professional photography assistance",
      "Fashion week techniques",
      "Crystal-enhanced lashes",
      "Full body glow treatment",
      "Scent customization",
      "Post-event touch-up service",
      "Dedicated beauty coordinator",
    ],
    bestFor: ["Luxury Weddings", "Destination Weddings", "Large Bridal Parties", "Editorial Shoots"],
  },
};

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Trial Session", price: "$150", icon: Calendar, description: "Pre-event makeup trial to perfect your look" },
  { name: "Airbrush Foundation", price: "$75", icon: SprayCan, description: "Flawless, long-lasting airbrush application" },
  { name: "Premium Lashes", price: "$35", icon: Eye, description: "Designer mink or silk false lashes" },
  { name: "Luxury Skincare Prep", price: "$100", icon: Sparkles, description: "Professional facial & skin prep treatment" },
  { name: "Travel Fee", price: "$50", icon: Car, description: "On-location service outside service area" },
  { name: "Touch-Up Kit", price: "$85", icon: Palette, description: "Take-home kit with products for touch-ups" },
];

const addOns2 = [
  {
    name: "Additional Person",
    price: "$125",
    icon: Users,
    description: "Makeup service for an extra person in your party.",
  },
  {
    name: "Bridal Party Coordination",
    price: "$250",
    icon: Crown,
    description: "Full coordination for 5+ people with dedicated artists.",
  },
  {
    name: "Flower Girl Makeup",
    price: "$75",
    icon: Flower2,
    description: "Gentle, age-appropriate makeup for flower girls.",
  },
  {
    name: "Body Glow Treatment",
    price: "$150",
    icon: Sun,
    description: "Full body shimmer and highlight for that radiant look.",
  },
  {
    name: "Scent Customization",
    price: "$95",
    icon: Coffee,
    description: "Custom blended fragrance for your special day.",
  },
  {
    name: "Emergency Beauty Kit",
    price: "$65",
    icon: Gift,
    description: "Complete touch-up kit with all essentials for the big day.",
  },
];

/* ==========================================
   EVENT TYPES
========================================== */

const eventTypes = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Flawless bridal makeup for your special day",
    startingPrice: "$250",
    packageRecommendation: "Signature or Bridal",
    features: ["Bridal Trial", "Bridal Party Makeup", "Airbrush Option", "Long-Wear Products"],
  },
  {
    icon: PartyPopper,
    title: "Birthday Party",
    description: "Glamorous looks to celebrate your big day",
    startingPrice: "$150",
    packageRecommendation: "Essential or Signature",
    features: ["Party Makeup", "Photography Ready", "Bold or Natural", "Group Discounts"],
  },
  {
    icon: Briefcase,
    title: "Corporate Event",
    description: "Professional polished looks for business",
    startingPrice: "$150",
    packageRecommendation: "Essential",
    features: ["Natural Look", "Quick Application", "Long-Lasting", "Business Appropriate"],
  },
  {
    icon: Camera,
    title: "Photo Shoot",
    description: "Camera-ready makeup for stunning photos",
    startingPrice: "$200",
    packageRecommendation: "Signature",
    features: ["HD Foundation", "Contouring", "Photography Test", "Quick Changes"],
  },
  {
    icon: GraduationCap,
    title: "Graduation",
    description: "Celebrate your achievement in style",
    startingPrice: "$150",
    packageRecommendation: "Essential",
    features: ["Photography Ready", "Natural Glow", "Quick Application", "Touch-Up Kit"],
  },
  {
    icon: Church,
    title: "Religious Ceremony",
    description: "Elegant makeup for faith-based events",
    startingPrice: "$150",
    packageRecommendation: "Essential or Signature",
    features: ["Subtle Looks", "Long-Wearing", "Natural Finish", "Respectful Styles"],
  },
  {
    icon: Star,
    title: "Gala / Fundraiser",
    description: "Red carpet ready for formal occasions",
    startingPrice: "$200",
    packageRecommendation: "Signature",
    features: ["Full Glam", "Photography Ready", "Dramatic Options", "Long-Wear"],
  },
  {
    icon: Users,
    title: "Bridal Party",
    description: "Group makeup services for bridal parties",
    startingPrice: "$450",
    packageRecommendation: "VIP",
    features: ["5+ People", "Multiple Artists", "Group Coordination", "Champagne Service"],
  },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function MakeupPricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [expandedPackages, setExpandedPackages] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // State for your external BookingModal (Ask a Question / Contact Us)
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    venueSize: "",
    guestCount: "",
    package: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    loadCategories();
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

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddOns([]);
    setTotalPrice(makeupPackages[pkg]?.basePrice || 0);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      venueSize: "",
      guestCount: "",
      package: makeupPackages[pkg]?.title || "",
      message: "",
    });
    setFormErrors({});
    setShowBookingModal(true);
  };

  const handleAddOnToggle = (addOnName, addOnPrice) => {
    setSelectedAddOns(prev => {
      const isSelected = prev.find(a => a.name === addOnName);
      if (isSelected) {
        return prev.filter(a => a.name !== addOnName);
      } else {
        return [...prev, { name: addOnName, price: addOnPrice }];
      }
    });
  };

  useEffect(() => {
    if (selectedPackage) {
      const basePrice = makeupPackages[selectedPackage]?.basePrice || 0;
      const addOnTotal = selectedAddOns.reduce((sum, addon) => {
        const price = parseFloat(addon.price.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
      setTotalPrice(basePrice + addOnTotal);
    }
  }, [selectedAddOns, selectedPackage]);

  const validateForm = () => {
    const errors = {};
    if (!bookingForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!bookingForm.email.trim()) errors.email = "Email is required";
    if (!bookingForm.phone.trim()) errors.phone = "Phone is required";
    if (!bookingForm.eventType.trim()) errors.eventType = "Event type is required";
    if (!bookingForm.eventDate.trim()) errors.eventDate = "Event date is required";
    if (!bookingForm.eventLocation.trim()) errors.eventLocation = "Location is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const generatedId = `MU-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        serviceType: "Makeup Services",
        category: "Makeup",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package,
        hoursIncluded: makeupPackages[selectedPackage]?.hoursIncluded,
        eventType: bookingForm.eventType,
        eventDate: bookingForm.eventDate,
        eventTime: bookingForm.eventTime,
        eventLocation: bookingForm.eventLocation,
        venueSize: bookingForm.venueSize,
        guestCount: bookingForm.guestCount,
        addOns: selectedAddOns,
        budget: totalPrice,
        basePrice: makeupPackages[selectedPackage]?.basePrice || 0,
        message: bookingForm.message,
        description: `MAKEUP BOOKING: ${bookingForm.package}\nHours: ${makeupPackages[selectedPackage]?.hoursIncluded}\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.eventDate}\nTime: ${bookingForm.eventTime}\nLocation: ${bookingForm.eventLocation}\nVenue: ${bookingForm.venueSize}\nGuests: ${bookingForm.guestCount}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
        createdAt: serverTimestamp(),
      });

      setRequestId(generatedId);
      setSuccess(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading makeup packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-pink-700">
              Makeup Services
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Professional Makeup{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Enhance your natural beauty with our professional makeup services. From weddings to
            special events, we provide premium products and personalized looks.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {Object.entries(makeupPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-pink-500 ring-2 ring-pink-100" : "border-gray-200"
              } ${pkg.bestValue ? "border-purple-500 ring-2 ring-purple-100" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-pink-50 p-2.5">
                  <pkg.icon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-gray-700">Up to {pkg.hoursIncluded} Hours</span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                <span className="text-gray-500"> starting</span>
              </div>

              {/* Expandable Features */}
              <ul className="space-y-2 mb-6">
                {(expandedPackages[key] ? pkg.features : pkg.features.slice(0, 5)).map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    {feature}
                  </motion.li>
                ))}
                {pkg.features.length > 5 && (
                  <li>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPackages(prev => ({ ...prev, [key]: !prev[key] }));
                      }}
                      className="text-xs text-pink-600 pl-6 font-medium hover:text-pink-800 hover:underline transition-colors flex items-center gap-1"
                    >
                      {expandedPackages[key] ? (
                        <>Show Less <span className="text-lg leading-none">−</span></>
                      ) : (
                        <>+ {pkg.features.length - 5} More Features <span className="text-lg leading-none">+</span></>
                      )}
                    </button>
                  </li>
                )}
              </ul>

              {/* Best For */}
              <div className="mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Perfect For:</p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.bestFor.map((item, i) => (
                    <span key={i} className="text-[10px] bg-white text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">{item}</span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mt-auto">
                <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-[#1a1a2e] text-white py-3.5 font-semibold hover:bg-pink-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Book This Package
                </button>
                
                {/* ASK A QUESTION - Opens your External Modal */}
                <button 
                  onClick={() => {
                    setSelectedService(pkg.title);
                    setBookingModal(true);
                  }} 
                  className="w-full rounded-xl border border-gray-300 bg-transparent text-gray-700 py-3 font-medium hover:bg-pink-500 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Ask a Question
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-Ons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add-On Services</h2>
          <p className="text-gray-500 text-center mb-8">Enhance your makeup experience with these options</p>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-pink-100 p-2 text-pink-600 shrink-0"><addon.icon className="w-6 h-6" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                    <span className="text-xs font-bold text-pink-600">{addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Bridal Party & Premium Services
          </h2>

          <p className="text-gray-500 text-center mb-8">
            Complete your bridal party experience with our premium offerings.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {addOns2.map((addon, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
              >
                <div className="shrink-0 rounded-lg bg-pink-100 p-2 text-pink-600">
                  <addon.icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {addon.name}
                    </h4>

                    <span className="text-xs font-bold text-pink-600">
                      {addon.price}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Value Proposition & CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative rounded-3xl bg-[#1a1a2e] p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="bg-pink-500/20 backdrop-blur-sm inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-pink-500/30">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">5-Star Rated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Let's Create Your Perfect Look</h2>
            <p className="text-gray-300 text-base mb-8 leading-relaxed">Browse our other planning services or contact us directly to start your beauty journey today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              
              {/* Contact Us - Opens External Modal */}
              <button 
                onClick={() => {
                  setSelectedService("General Makeup Inquiry");
                  setBookingModal(true);
                }} 
                className="px-8 py-3 rounded-full bg-pink-400 text-white font-semibold hover:bg-pink-500 transition-all shadow-lg flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Us
              </button>

              <button onClick={() => router.push("/portfolio")} className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all">
                View Our Portfolio
              </button>
            </div>
          </div>
        </motion.div>

        {/* Browse Other Services */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-12 border-t border-gray-200"
        >
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
            Browse Other Services
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(`/services/${category.slug}`)}
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-all shadow-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-pink-400" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-pink-400" /><span>200+ Events</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-pink-400" /><span>Dedicated Team</span></div>
          </div>
        </motion.div>
        
      </div>

      {/* ==========================================
          BOOKING MODAL
      ========================================== */}
      <AnimatePresence>
        {showBookingModal && selectedPackage && !success && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Book Makeup Service</h3>
                    <p className="text-sm text-gray-500">
                      {makeupPackages[selectedPackage].title} - {makeupPackages[selectedPackage].hoursIncluded} Hours
                    </p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={bookingForm.fullName} onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }} className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`} placeholder="Jane Doe" />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`} placeholder="jane@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }} className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`} placeholder="(555) 123-4567" />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type *</label>
                    <select value={bookingForm.eventType} onChange={(e) => { setBookingForm({ ...bookingForm, eventType: e.target.value }); if (formErrors.eventType) setFormErrors({ ...formErrors, eventType: "" }); }} className={`w-full rounded-xl border ${formErrors.eventType ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`}>
                      <option value="">Select event type</option>
                      {eventTypes.map((et) => (<option key={et.title} value={et.title}>{et.title}</option>))}
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.eventType && <p className="text-red-500 text-xs mt-1">{formErrors.eventType}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Date *</label>
                      <input type="date" value={bookingForm.eventDate} onChange={(e) => { setBookingForm({ ...bookingForm, eventDate: e.target.value }); if (formErrors.eventDate) setFormErrors({ ...formErrors, eventDate: "" }); }} className={`w-full rounded-xl border ${formErrors.eventDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`} />
                      {formErrors.eventDate && <p className="text-red-500 text-xs mt-1">{formErrors.eventDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                      <input type="time" value={bookingForm.eventTime} onChange={(e) => setBookingForm({ ...bookingForm, eventTime: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Guest Count</label>
                      <input type="number" value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink-500 outline-none" placeholder="1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Location *</label>
                    <input type="text" value={bookingForm.eventLocation} onChange={(e) => { setBookingForm({ ...bookingForm, eventLocation: e.target.value }); if (formErrors.eventLocation) setFormErrors({ ...formErrors, eventLocation: "" }); }} className={`w-full rounded-xl border ${formErrors.eventLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-pink-500 outline-none`} placeholder="Venue name or address" />
                    {formErrors.eventLocation && <p className="text-red-500 text-xs mt-1">{formErrors.eventLocation}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Venue Size</label>
                    <select value={bookingForm.venueSize} onChange={(e) => setBookingForm({ ...bookingForm, venueSize: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink-500 outline-none">
                      <option value="">Select venue size</option>
                      <option value="Small (Under 50 guests)">Small (Under 50 guests)</option>
                      <option value="Medium (50-150 guests)">Medium (50-150 guests)</option>
                      <option value="Large (150-300 guests)">Large (150-300 guests)</option>
                      <option value="Grand (300+ guests)">Grand (300+ guests)</option>
                      <option value="Outdoor">Outdoor Venue</option>
                    </select>
                  </div>

                  {/* Add-On Services */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                                <span className="text-sm font-bold text-pink-600">{addon.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}
                      
                      {/* Add-On Services 2 */}
                      {addOns2.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                                <span className="text-sm font-bold text-pink-600">{addon.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Message</label>
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-pink-500 outline-none resize-none" placeholder="Specific looks, skin concerns, special requests..." />
                  </div>

                  {/* Price Summary */}
                  <div className="rounded-2xl bg-pink-50 p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Base Package:</span>
                      <span className="font-semibold">${makeupPackages[selectedPackage].basePrice}</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <>
                        <div className="border-t border-pink-200 pt-2 mb-2">
                          {selectedAddOns.map((addon, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">+ {addon.name}</span>
                              <span className="text-pink-600">{addon.price}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-pink-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-pink-600">${totalPrice}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-pink-500 text-white py-4 font-semibold hover:bg-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : (<><Send className="w-5 h-5" /> Confirm Booking - ${totalPrice}</>)}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
                <div className="rounded-full bg-pink-100 p-4 inline-flex mb-6"><CheckCircle2 className="w-12 h-12 text-pink-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your event details and contact you within 24 hours.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button onClick={() => { setSuccess(false); setShowBookingModal(false); }} className="w-full rounded-xl bg-pink-500 text-white py-3 font-semibold hover:bg-pink-600 transition-all">Back to Packages</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          EXTERNAL BOOKING MODAL (For "Ask a Question" & "Contact Us")
      ========================================== */}
      <BookingModal
        bookingModal={bookingModal}
        setBookingModal={setBookingModal}
        selectedService={selectedService}
      />
    </div>
  );
}