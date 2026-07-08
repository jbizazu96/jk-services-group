"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Import your existing external Booking Modal
import BookingModal from "@/components/home/modals/BookingModal";

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
  Heart,
  Calendar,
  Car,
  Users,
  MapPin,
  Phone,
  Mail,
  ClipboardList,
  UtensilsCrossed,
  Music,
  Camera,
  Flower2,
  Gem,
  PartyPopper,
  BellRing,
  TableProperties,
  PenTool,
  Truck,
  Wine,
  Cake,
  HelpCircle,
  Crown
} from "lucide-react";

/* ==========================================
   YOUR EXACT PACKAGES & ADD-ONS (FIXED)
========================================== */

const coordinationPackages = {
  dayOf: {
    title: "Day-Of Coordination",
    subtitle: "Peace of Mind on Your Wedding Day",
    description: "Professional on-site coordination to ensure your wedding day runs flawlessly",
    basePrice: 700,
    eventDays: 1,
    teamSize: "1 Lead Coordinator",
    popular: false,
    bestValue: false,
    isNew: false,
    features: [
      "Up to 6 Hours On-Site Coverage",
      "Lead EventCoordinator",
      "Final Event Coordination Meeting (1 Meetings)",
      "Timeline Creation & Management",
      "Vendor Confirmation Calls (Week Of)",
      "Ceremony Management",
      "Reception Management",
      "Vendor Point of Contact On-Site",
      "Setup & Breakdown Supervision",
      "Guest & Family Direction",
      "Timeline Enforcement Throughout Day",
      "Local Transportation Included (within 60 miles)",
    ],
    bestFor: ["DIY Couples", "Small Weddings (Under 100 Guests)", "Budget-Conscious Couples", "Simple Venue Weddings"],
  },
  partial: {
    title: "Partial Coordination",
    subtitle: "Guided Wedding Journey",
    description: "Everything is Day-Of Plus Additional coordination support during the final weeks.",
    basePrice: 1000,
    eventDays: 1,
    teamSize: "1 Lead",
    popular: true,
    bestValue: false,
    isNew: false,
    features: [
      "Everything in Day-Of",
      "Final Event Coordination Meeting (4 Meetings)",
      "Vendor Timeline Distribution",
      "Vendor Communication",
      "Ceremony Processional Practice",
      "Reception Layout Review",
      "Decor Placement Supervision",
      "Event Party & VIP Coordination",
      "Guest Transportation Coordination",
      "Seating Chart Assistance",
      "Timeline Enforcement Throughout Day",
      "Transportation Included (within 60 miles)",
    ],
    bestFor: ["Mid-Size Weddings (100-200 Guests)", "Couples Needing Vendor Help", "Multi-Venue Weddings", "Themed Weddings"],
  },
  full: {
    title: "Full-Service Planning",
    subtitle: "Complete Luxury Experience",
    description: "Everything in Partial Plus a large team, longer converage, and complete execution.",
    basePrice: 1500,
    eventDays: 1,
    teamSize: "1 Lead, 1 Assistant",
    popular: false,
    bestValue: true, 
    isNew: false,    
    features: [
     "Unlimited Event-Day Coverage",
     "Lead Coordinator",
     "Two Assistant Coordinators",
     "Personal Concierge",
     "Vendor Arrival Management",
     "Complete Venue Setup Supervision",
     "Guest Concierge",  
     "VIP Family Assistance",
     "Ceremony Direction",
     "Cocktail Hour Coordination",
     "Reception Management",
     "Vendor Departure Coordination",
     "End-of-Night Wrap-Up",
     "Emergency Response",
     "Backup Coordinator",
     "Unlimited Communication During Final Month"
    ],
    bestFor: ["Large Weddings (200+ Guests)", "Destination Weddings", "Multi-Day Celebrations", "Luxury & High-End Weddings"],
  },
};

/* ==========================================
   YOUR EXACT ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Additional Assistant", price: "$250", description: "Extra assistant coordinator for larger events" },
  { name: "Post-Wedding Brunch", price: "$350", description: "Coordination of next-day brunch event" },
  { name: "Welcome Party Coordination", price: "$500", description: "Planning welcome event for out-of-town guests" },
  { name: "Extended Travel", price: "$2/mile", description: "For venues beyond package mileage limit" },
  { name: "Ceremony Rehearsal", price: "$250", description: "Professional rehearsal session for the wedding ceremony" },
  { name: "Setup Only", price: "$300", description: "Full setup services without coordination" },
  { name: "Teardown Only", price: "$300", description: "Full teardown services without coordination" },
  { name: "Guest Check-In Service", price: "$300", description: "Assistance with guest check-in and registration" },
  { name: "Bridal Concierge", price: "$300", description: "Personalized assistance for the bride before and during the wedding" },
  { name: "Multi-Venue Coordination", price: "$400", description: "Coordination services for weddings held at multiple locations" },
  { name: "Additional Coordinator", price: "$250", description: "Extra coordinator for larger events" },
];

/* ==========================================
   YOUR EXACT MAIN COMPONENT LOGIC
========================================== */

export default function EventCoordinationPricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Internal state for "Book This Package" (Your exact modal)
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // External state for "Ask a Question" & "Contact Us"
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [expandedPackages, setExpandedPackages] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    partnerName: "",
    weddingDate: "",
    weddingLocation: "",
    venueName: "",
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
      setCategories(items);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddOns([]);
    const selectedPkg = coordinationPackages[pkg];
    setTotalPrice(selectedPkg?.basePrice || 0);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      partnerName: "",
      weddingDate: "",
      weddingLocation: "",
      venueName: "",
      guestCount: "",
      package: selectedPkg?.title || "",
      message: "",
    });
    setFormErrors({});
    setShowBookingModal(true);
  };

  const handleAddOnToggle = (addOnName, addOnPrice) => {
    setSelectedAddOns(prev => {
      const isSelected = prev.find(a => a.name === addOnName);
      if (isSelected) return prev.filter(a => a.name !== addOnName);
      return [...prev, { name: addOnName, price: addOnPrice }];
    });
  };

  useEffect(() => {
    if (selectedPackage) {
      const basePrice = coordinationPackages[selectedPackage]?.basePrice || 0;
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
    if (!bookingForm.weddingDate.trim()) errors.weddingDate = "Event date is required";
    if (!bookingForm.weddingLocation.trim()) errors.weddingLocation = "Location is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const generatedId = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      const selectedPkg = coordinationPackages[selectedPackage];
      const basePrice = selectedPkg?.basePrice || 0;
      const teamSize = selectedPkg?.teamSize || "";
      const eventDays = selectedPkg?.eventDays || 0;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName || "",
        email: bookingForm.email || "",
        phone: bookingForm.phone || "",
        partnerName: bookingForm.partnerName || "",
        serviceType: "Event Coordination",
        category: "Event Coordination",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package || "",
        teamSize: teamSize,
        eventDays: eventDays,
        weddingDate: bookingForm.weddingDate || "",
        weddingLocation: bookingForm.weddingLocation || "",
        venueName: bookingForm.venueName || "",
        guestCount: bookingForm.guestCount || "",
        addOns: selectedAddOns || [],
        budget: totalPrice || 0,
        basePrice: basePrice,
        message: bookingForm.message || "",
        description: `EVENT COORDINATION BOOKING: ${bookingForm.package}\nTeam: ${teamSize}\nHours: ${eventDays}\nDate: ${bookingForm.weddingDate}\nLocation: ${bookingForm.weddingLocation}\nVenue: ${bookingForm.venueName}\nGuests: ${bookingForm.guestCount}\nPartner: ${bookingForm.partnerName}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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

  const getAddOnIcon = (name) => {
    if (name.includes("Hour")) return <Clock className="w-4 h-4" />;
    if (name.includes("Assistant")) return <Users className="w-4 h-4" />;
    if (name.includes("Rehearsal")) return <ClipboardList className="w-4 h-4" />;
    if (name.includes("Brunch") || name.includes("Welcome")) return <PartyPopper className="w-4 h-4" />;
    if (name.includes("Vendor")) return <Truck className="w-4 h-4" />;
    if (name.includes("Design") || name.includes("Styling")) return <PenTool className="w-4 h-4" />;
    if (name.includes("Budget")) return <TableProperties className="w-4 h-4" />;
    if (name.includes("Invitation")) return <Mail className="w-4 h-4" />;
    if (name.includes("Transportation")) return <Car className="w-4 h-4" />;
    if (name.includes("Honeymoon")) return <Heart className="w-4 h-4" />;
    if (name.includes("Travel")) return <MapPin className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f7f4] text-gray-900">
      {/* Soft Ambient Glows (Event Planning Design) */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-100/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-amber-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header (Event Planning Design) */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-gradient-to-r from-rose-200/0 via-rose-200/30 to-rose-200/0 blur-3xl -z-10" />
          
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 backdrop-blur-sm px-5 py-2 shadow-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-rose-600">
              Event Coordination Services
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-serif text-[#1a1a2e]">
            Unforgettable <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">Moments</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From intimate ceremonies to grand galas, our experienced coordinators ensure every detail is perfect so you can focus on what matters most.
          </p>
        </motion.div>


        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {Object.entries(coordinationPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-rose-400 ring-2 ring-rose-100" : 
                pkg.bestValue ? "border-amber-400 ring-1 ring-amber-100 shadow-amber-200/30" : 
                "border-gray-200 hover:border-rose-300"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  BEST VALUE
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-rose-50 p-2.5">
                  {key === "dayOf" && <BellRing className="w-6 h-6 text-rose-500" />}
                  {key === "partial" && <ClipboardList className="w-6 h-6 text-rose-500" />}
                  {key === "full" && <Gem className="w-6 h-6 text-rose-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

              {/*<div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold text-gray-700"> {pkg.eventDays} day event</span>
              </div> */}

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                <span className="text-gray-500"> starting</span>
              </div>

              {/* Expandable Features */}
              <ul className="space-y-2 mb-6">
                {(expandedPackages[key] ? pkg.features : pkg.features.slice(0, 5)).map((feature, i) => (
                  <motion.li key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    {feature}
                  </motion.li>
                ))}
                {pkg.features.length > 5 && (
                  <li>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedPackages(prev => ({ ...prev, [key]: !prev[key] })); }} className="text-xs text-rose-500 pl-6 font-medium hover:text-rose-700 hover:underline transition-colors flex items-center gap-1">
                      {expandedPackages[key] ? (<>Show Less <span className="text-lg leading-none">−</span></>) : (<>+ {pkg.features.length - 5} More Features <span className="text-lg leading-none">+</span></>)}
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
                <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-[#1a1a2e] text-white py-3.5 font-semibold hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
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

        {/* Add-Ons Section (UNTOUCHED - same layout as event planning) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-24 rounded-3xl bg-white border border-gray-200 p-8 md:p-12 shadow-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Customize Your Day</span>
            </div>
            <h2 className="text-3xl font-bold text-[#1a1a2e]">Elevate Your Experience</h2>
            <p className="text-gray-500 mt-2">Tailor your package with these premium add-ons</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-rose-200 transition-colors">
                <div className="rounded-xl bg-rose-100 p-3 text-rose-500 shrink-0 shadow-sm">
                  {getAddOnIcon(addon.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#1a1a2e] text-sm">{addon.name}</h4>
                    <span className="text-sm font-bold text-rose-500">{addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addon.description}</p>
                </div>
              </div>
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


        {/* Browse Other Services & Trust Signals (Same as Event Planning) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pt-12 border-t border-gray-200">
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">Browse Other Services</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(0, 8).map((category) => (
              <button key={category.id} onClick={() => router.push(`/services/${category.slug}`)} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-rose-400 hover:text-rose-500 transition-all shadow-sm">
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-rose-400" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /><span>100+ Events</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-rose-400" /><span>Dedicated Team</span></div>
          </div>
        </motion.div>
        
      </div>

      {/* ==========================================
          YOUR EXACT INTERNAL BOOKING MODAL
      ========================================== */}
      <AnimatePresence>
        {showBookingModal && selectedPackage && !success && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Book Event Coordination</h3>
                    <p className="text-sm text-gray-500">{coordinationPackages[selectedPackage].title} - {coordinationPackages[selectedPackage].teamSize}</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name *</label>
                    <input type="text" value={bookingForm.fullName} onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }} className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="Jane Doe" />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Partner's Name</label>
                    <input type="text" value={bookingForm.partnerName} onChange={(e) => setBookingForm({ ...bookingForm, partnerName: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none" placeholder="John Smith" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="jane@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }} className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="(555) 123-4567" />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Date *</label>
                    <input type="date" value={bookingForm.weddingDate} onChange={(e) => { setBookingForm({ ...bookingForm, weddingDate: e.target.value }); if (formErrors.weddingDate) setFormErrors({ ...formErrors, weddingDate: "" }); }} className={`w-full rounded-xl border ${formErrors.weddingDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} />
                    {formErrors.weddingDate && <p className="text-red-500 text-xs mt-1">{formErrors.weddingDate}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Location *</label>
                      <input type="text" value={bookingForm.weddingLocation} onChange={(e) => { setBookingForm({ ...bookingForm, weddingLocation: e.target.value }); if (formErrors.weddingLocation) setFormErrors({ ...formErrors, weddingLocation: "" }); }} className={`w-full rounded-xl border ${formErrors.weddingLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="City or area" />
                      {formErrors.weddingLocation && <p className="text-red-500 text-xs mt-1">{formErrors.weddingLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Venue Name</label>
                      <input type="text" value={bookingForm.venueName} onChange={(e) => setBookingForm({ ...bookingForm, venueName: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none" placeholder="The Grand Ballroom" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Guest Count</label>
                    <input type="number" value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none" placeholder="150" />
                  </div>

                  {/* Add-On Services */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-rose-400 bg-rose-50" : "border-gray-200 hover:border-rose-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-rose-500 rounded focus:ring-rose-400" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-900">{addon.name}</span><span className="text-sm font-bold text-rose-500">{addon.price}</span></div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tell Us About Your Vision</label>
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none resize-none" placeholder="Your vision, colors, theme, special requests..." />
                  </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-rose-50 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Base Package:</span><span className="font-semibold">${coordinationPackages[selectedPackage].basePrice}</span></div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-rose-200 pt-2 mb-2">
                      {selectedAddOns.map((addon, i) => (<div key={i} className="flex justify-between items-center text-sm"><span className="text-gray-600">+ {addon.name}</span><span className="text-rose-500">{addon.price}</span></div>))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-rose-200"><span className="font-semibold text-gray-900">Total:</span><span className="text-xl font-bold text-rose-500">${totalPrice}</span></div>
                </div>
                
                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-rose-400 text-white py-4 font-semibold hover:bg-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
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
                <div className="rounded-full bg-rose-100 p-4 inline-flex mb-6"><CheckCircle2 className="w-12 h-12 text-rose-500" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your details and contact you within 24 hours for a consultation.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button onClick={() => { setSuccess(false); setShowBookingModal(false); }} className="w-full rounded-xl bg-rose-400 text-white py-3 font-semibold hover:bg-rose-500 transition-all">Back to Packages</button>
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