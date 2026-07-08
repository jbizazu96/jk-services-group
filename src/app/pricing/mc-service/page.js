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
  MapPin,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Mic,
  HelpCircle,
  Users,
  Cloud,
  Lightbulb,
  Stars,
  Music,
  Calendar,
  Car,
  UtensilsCrossed,
  PartyPopper,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  Gem,
  Sparkles as SparklesIcon,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

/* ==========================================
   MC PACKAGES
========================================== */

const mcPackages = {
  silver: {
    icon: Mic,
    title: "Silver MC",
    subtitle: "Essential Hosting",
    description: "Professional MC services for smaller, intimate events",
    basePrice: 350,
    popular: false,
    features: [
      "Up to 4 Hours Event Coverage",
      "Professional MC Hosting",
      "Event Script Preparation",
      "Coordination with Vendors",
      "Grand Entrance Announcements",
      "Speaker Introductions",
      "Schedule & Timeline Management",
      "Audience Engagement",
      "Professional Attire",
      "Pre-Event Consultation (1 Meeting)",
      "Local Transportation Included (within 60 miles)",
    ],
    bestFor: ["Birthday Parties", "Small Anniversaries", "Family Reunions", "Baby Showers"],
  },
  gold: {
    icon: Star,
    title: "Gold MC",
    subtitle: "Premium Experience",
    description: "Enhanced MC package for medium to large events",
    basePrice: 500,
    popular: true,
    features: [
      "Up to 6 Hours Event Coverage",
      "Premium MC Hosting with Co-Host Option",
      "Custom Event Script & Timeline",
      "Pre-Event Consultation (2 Meetings)",
      "Audience Engagement Activities",
      "Grand Entrance Coordination",
      "Wedding Party Introductions",
      "Toast & Speech Coordination",
      "Cake Cutting Announcement",
      "First Dance Introduction",
      "Special Moment Announcements",
      "Vendor Communication Throughout Event",
      "Event Flow Management",
      "Backup MC Available if Needed",
      "Transportation Included (within 60 miles)",
    ],
    bestFor: ["Weddings", "Corporate Events", "Large Anniversaries", "Award Ceremonies"],
  },
  platinum: {
    icon: Gem,
    title: "Platinum MC",
    subtitle: "Ultimate Luxury",
    description: "All-inclusive premium MC experience for grand celebrations",
    basePrice: 1000,
    popular: false,
    bestValue: true,
    features: [
      "Full Day Event Coverage (Up to 12 Hours)",
      "Lead MC + Co-Host/Assistant MC",
      "Custom Event Script, Timeline & Run of Show",
      "Pre-Event Consultation (Unlimited Meetings)",
      "Audience Engagement & Interactive Games",
      "Rehearsal Attendance",
      "VIP Guest Coordination",
      "Live Program Management",
      "Award Ceremony Hosting",
      "Sponsor Recognition (for corporate events)",
      "Stage Management",
      "Audience Q&A Moderation",
      "Event Closing Remarks",
      "Personalized Event Run Sheet",
      "Coordination with Entertainment & Performers",
      "Emergency Backup MC Guaranteed",
      "Post-Event Thank You Announcement",
      "Bilingual MC Available (English/French)",
      "Transportation Included (within 60 miles)",
    ],
    bestFor: ["Grand Weddings", "Galas", "Concerts", "Multi-Day Conferences", "Festivals"],
  },
};

/* ==========================================
   EVENT TYPES WITH PRICING
========================================== */

const eventTypes = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Your special day deserves an unforgettable MC",
    startingPrice: "$500",
    packageRecommendation: "Gold or Platinum",
    features: ["Ceremony & Reception Hosting", "Love Story Narration", "Toast Coordination", "First Dance Announcement"],
  },
  {
    icon: Briefcase,
    title: "Corporate Conference",
    description: "Professional hosting for business events",
    startingPrice: "$600",
    packageRecommendation: "Gold or Platinum",
    features: ["Keynote Introductions", "Panel Moderation", "Q&A Management", "Breakout Session Coordination"],
  },
  {
    icon: Church,
    title: "Funeral / Memorial",
    description: "Dignified and respectful service hosting",
    startingPrice: "$300",
    packageRecommendation: "Silver or Gold",
    features: ["Solemn Tone Management", "Eulogy Coordination", "Program Flow Management", "Compassionate Approach"],
  },
  {
    icon: PartyPopper,
    title: "Anniversary",
    description: "Celebrate milestones with style",
    startingPrice: "$400",
    packageRecommendation: "Gold",
    features: ["Milestone Highlights", "Guest Interaction", "Toast & Speech Coordination", "Entertainment Management"],
  },
  {
    icon: GraduationCap,
    title: "Graduation Party",
    description: "Honor academic achievements",
    startingPrice: "$350",
    packageRecommendation: "Silver or Gold",
    features: ["Graduate Introduction", "Achievement Highlights", "Party Flow Management", "Photo Opportunity Coordination"],
  },
  {
    icon: Users,
    title: "Community Event",
    description: "Engaging hosting for public gatherings",
    startingPrice: "$450",
    packageRecommendation: "Gold",
    features: ["Crowd Engagement", "Activity Coordination", "Announcements Management", "Multi-Cultural Sensitivity"],
  },
  {
    icon: Music,
    title: "Concert / Show",
    description: "High-energy MC for performances",
    startingPrice: "$700",
    packageRecommendation: "Platinum",
    features: ["Artist Introductions", "Crowd Hype Management", "Stage Coordination", "Live Announcements"],
  },
  {
    icon: SparklesIcon,
    title: "Gala / Fundraiser",
    description: "Elegant hosting for formal events",
    startingPrice: "$800",
    packageRecommendation: "Platinum",
    features: ["Donor Acknowledgment", "Auction Coordination", "Formal Program Flow", "VIP Guest Management"],
  },
];

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Extra Hour", price: "$75/hour", icon: Clock, description: "Additional event coverage beyond package hours" },
  { name: "Bilingual MC", price: "$100", icon: MessageCircle, description: "MC services in English + French" },
  { name: "Rehearsal Attendance", price: "$100", icon: Calendar, description: "MC attends your event rehearsal" },
  { name: "Extended Travel", price: "$1.50/mile", icon: Car, description: "For events beyond package mileage limit" },
  { name: "Custom Script Writing", price: "$150", icon: Send, description: "Personalized event script tailored to your needs" },
];

const addOns2 = [
  {
    name: "Dancing on the Clouds",
    price: "$300",
    icon: Cloud,
    description: "Low-lying fog effect for first dances, grand entrances, and special moments.",
  },
  {
    name: "Cold Spark Effects (2 Machines)",
    price: "$400",
    icon: Sparkles,
    description: "Indoor-safe cold spark fountains for unforgettable entrances and celebrations.",
  },
  {
    name: "Cold Spark Effects (4 Machines)",
    price: "$650",
    icon: Sparkles,
    description: "Premium cold spark display surrounding the dance floor or stage.",
  },
  {
    name: "Dance Floor Lighting",
    price: "$250",
    icon: Lightbulb,
    description: "Dynamic lighting effects to energize your dance floor.",
  },
  {
    name: "Venue Uplighting",
    price: "$350",
    icon: Lightbulb,
    description: "Elegant uplighting to transform the atmosphere of your venue.",
  },
  {
    name: "Premium First Dance Package",
    price: "$850",
    icon: Stars,
    description: "Includes Dancing on the Clouds, 2 cold spark machines, and synchronized dance floor lighting.",
  },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function MCPricingPage() {
    // State for your external BookingModal (Ask a Question / Contact Us)
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [expandedPackages, setExpandedPackages] = useState({});
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
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
    setTotalPrice(mcPackages[pkg]?.basePrice || 0);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventLocation: "",
      guestCount: "",
      package: mcPackages[pkg]?.title || "",
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
      const basePrice = mcPackages[selectedPackage]?.basePrice || 0;
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
      const generatedId = `MC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        serviceType: "MC Services",
        category: "MC Services",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package,
        eventType: bookingForm.eventType,
        eventDate: bookingForm.eventDate,
        eventLocation: bookingForm.eventLocation,
        guestCount: bookingForm.guestCount,
        message: bookingForm.message,
        budget: mcPackages[selectedPackage]?.basePrice || 0,
        description: `MC BOOKING: ${bookingForm.package}\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.eventDate}\nLocation: ${bookingForm.eventLocation}\nGuests: ${bookingForm.guestCount}\n\nMessage: ${bookingForm.message}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading MC packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-700">
              MC Services Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Master of Ceremonies{" "}
            <span className="bg-gradient-to-r from-purple-600 to-gold bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional MC services for every occasion. From intimate gatherings to grand celebrations,
            we bring energy, elegance, and flawless execution to your event.
          </p>
        </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-20">
                {Object.entries(mcPackages).map(([key, pkg]) => (
                    <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                        pkg.popular ? "border-purple-500 ring-2 ring-purple-100" : "border-gray-200"
                    } ${pkg.bestValue ? "border-gold ring-2 ring-gold/20" : ""}`}
                    >
                    {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                        </div>
                    )}
                    {pkg.bestValue && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full">
                        BEST VALUE
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl bg-purple-50 p-2.5">
                        <pkg.icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                        <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                        <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                        <span className="text-gray-500"> starting</span>
                    </div>

                    {/* EXPANDABLE FEATURES LIST */}
                    <ul className="space-y-2 mb-6">
                        {(expandedPackages[key] ? pkg.features : pkg.features.slice(0, 5)).map((feature, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-start gap-2 text-sm text-gray-600"
                        >
                            <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            {feature}
                        </motion.li>
                        ))}
                        {pkg.features.length > 5 && (
                        <li>
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPackages(prev => ({
                                ...prev,
                                [key]: !prev[key]
                                }));
                            }}
                            className="text-xs text-purple-600 pl-6 font-medium hover:text-purple-800 hover:underline transition-colors flex items-center gap-1"
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

                    <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Best For:</p>
                        <div className="flex flex-wrap gap-1.5">
                        {pkg.bestFor.map((item, i) => (
                            <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                            {item}
                            </span>
                        ))}
                        </div>
                    </div>

                     {/* Buttons */}
                      <div className="space-y-3 mt-auto">
                        <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-purple-600 text-white py-3.5 font-semibold hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          Book This Package
                        </button>
                        
                        {/* ASK A QUESTION - Opens your External Modal */}
                        <button 
                          onClick={() => {
                            setSelectedService(pkg.title);
                            setBookingModal(true);
                          }} 
                          className="w-full rounded-xl border border-gray-300 bg-transparent text-gray-700 py-3 font-medium hover:bg-yellow-500 transition-all text-sm flex items-center justify-center gap-2"
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
          <p className="text-gray-500 text-center mb-8">Customize your package with these additional options</p>
          <div className="grid md:grid-cols-3 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                {/* Render Lucide icon component */}
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                <addon.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                    <span className="text-xs font-bold text-purple-600">{addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

          {/* Fog Machine & Lighting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Fog Machine & Lighting
              </h2>

              <p className="text-gray-500 text-center mb-8">
                Create unforgettable moments with premium lighting and special effects.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {addOns2.map((addon, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                      <addon.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {addon.name}
                        </h4>

                        <span className="text-xs font-bold text-purple-600">
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

        {/* Event Types */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Events We <span className="text-purple-600">Host</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Professional MC services tailored to your specific event type</p>

          <div className="grid md:grid-cols-4 gap-4">
            {eventTypes.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all"
              >
               {/* Render Lucide icon component */}
                <div className="rounded-xl bg-purple-50 p-2.5 inline-flex mb-3 text-purple-600">
                <event.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{event.description}</p>
                <p className="text-sm font-semibold text-purple-600 mb-2">From {event.startingPrice}</p>
                <p className="text-xs text-gray-400 mb-3">Recommended: {event.packageRecommendation}</p>
                <ul className="space-y-1">
                  {event.features.slice(0, 2).map((f, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-purple-500" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

          {/* Value Proposition & CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative rounded-3xl bg-[#1a1a2e] p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="bg-rose-500/20 backdrop-blur-sm inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-rose-500/30">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">5-Star Rated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Let's Create Your Perfect Day</h2>
            <p className="text-gray-300 text-base mb-8 leading-relaxed">Browse our other planning services or contact us directly to start your journey today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              
              {/* Contact Us - Opens External Modal */}
              <button 
                onClick={() => {
                  setSelectedService("General Event Planning Inquiry");
                  setBookingModal(true);
                }} 
                className="px-8 py-3 rounded-full bg-rose-400 text-white font-semibold hover:bg-rose-500 transition-all shadow-lg flex items-center gap-2"
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
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

         {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-rose-400" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /><span>100+ Events</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-rose-400" /><span>Dedicated Team</span></div>
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
                    <h3 className="text-xl font-bold text-gray-900">Book MC Service</h3>
                    <p className="text-sm text-gray-500">{mcPackages[selectedPackage].title} - ${mcPackages[selectedPackage].basePrice}</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.fullName}
                      onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }}
                      className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                      placeholder="John Doe"
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }}
                        className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                        placeholder="john@email.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }}
                        className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                        placeholder="(555) 123-4567"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type *</label>
                    <select
                      value={bookingForm.eventType}
                      onChange={(e) => { setBookingForm({ ...bookingForm, eventType: e.target.value }); if (formErrors.eventType) setFormErrors({ ...formErrors, eventType: "" }); }}
                      className={`w-full rounded-xl border ${formErrors.eventType ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((et) => (
                        <option key={et.title} value={et.title}>{et.title}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.eventType && <p className="text-red-500 text-xs mt-1">{formErrors.eventType}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Date *</label>
                      <input
                        type="date"
                        value={bookingForm.eventDate}
                        onChange={(e) => { setBookingForm({ ...bookingForm, eventDate: e.target.value }); if (formErrors.eventDate) setFormErrors({ ...formErrors, eventDate: "" }); }}
                        className={`w-full rounded-xl border ${formErrors.eventDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                      />
                      {formErrors.eventDate && <p className="text-red-500 text-xs mt-1">{formErrors.eventDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Guest Count</label>
                      <input
                        type="number"
                        value={bookingForm.guestCount}
                        onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 outline-none"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Location *</label>
                    <input
                      type="text"
                      value={bookingForm.eventLocation}
                      onChange={(e) => { setBookingForm({ ...bookingForm, eventLocation: e.target.value }); if (formErrors.eventLocation) setFormErrors({ ...formErrors, eventLocation: "" }); }}
                      className={`w-full rounded-xl border ${formErrors.eventLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}
                      placeholder="Venue name or address"
                    />
                    {formErrors.eventLocation && <p className="text-red-500 text-xs mt-1">{formErrors.eventLocation}</p>}
                  </div>

                  {/* Add-On Services */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                                <span className="text-sm font-bold text-blue-600">{addon.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}

                    {addOns2.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{addon.name}</span>
                                <span className="text-sm font-bold text-blue-600">{addon.price}</span>
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
                    <textarea
                      rows={3}
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 outline-none resize-none"
                      placeholder="Tell us about your event..."
                    />
                  </div>
                  
                   {/* Price Summary */}
                  <div className="rounded-2xl bg-blue-50 p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Base Package:</span>
                      <span className="font-semibold">${mcPackages[selectedPackage].basePrice}</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <>
                        <div className="border-t border-blue-200 pt-2 mb-2">
                          {selectedAddOns.map((addon, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">+ {addon.name}</span>
                              <span className="text-blue-600">{addon.price}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-blue-600">${totalPrice}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-purple-600 text-white py-4 font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Confirm Booking - ${totalPrice}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          SUCCESS MODAL
      ========================================== */}
      <AnimatePresence>
        {success && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
                <div className="rounded-full bg-purple-100 p-4 inline-flex mb-6">
                  <CheckCircle2 className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your event details and contact you within 24 hours to finalize the arrangements.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button
                  onClick={() => { setSuccess(false); setShowBookingModal(false); }}
                  className="w-full rounded-xl bg-purple-600 text-white py-3 font-semibold hover:bg-purple-700 transition-all"
                >
                  Back to Packages
                </button>
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