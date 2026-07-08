"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  Heart,
  Calendar,
  Car,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
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
} from "lucide-react";

/* ==========================================
   WEDDING COORDINATION PACKAGES
========================================== */

const weddingPackages = {
  dayOf: {
    title: "Day-Of Coordination",
    subtitle: "Peace of Mind on Your Wedding Day",
    description: "Professional on-site coordination to ensure your wedding day runs flawlessly",
    basePrice: 500,
    hoursIncluded: 10,
    popular: false,
    bestValue: false,
    isNew: false,
    features: [
      "Up to 6 Hours On-Site Coverage",
      "Lead Wedding Coordinator",
      "Pre-Wedding Consultation (2 Meetings)",
      "Venue Walkthrough (1 Visit)",
      "Timeline Creation & Management",
      "Vendor Confirmation Calls (Week Of)",
      "Rehearsal Coordination (1 Hour)",
      "Ceremony Management",
      "Reception Management",
      "Vendor Point of Contact On-Site",
      "Emergency Kit Provided",
      "Setup & Breakdown Supervision",
      "Guest & Family Direction",
      "Timeline Enforcement Throughout Day",
      "Local Transportation Included (within 60 miles)",
    ],
    bestFor: ["DIY Couples", "Small Weddings (Under 100 Guests)", "Budget-Conscious Couples", "Simple Venue Weddings"],
  },
  partial: {
    title: "Partial Planning",
    subtitle: "Guided Wedding Journey",
    description: "Comprehensive support for couples who have started planning but need professional guidance",
    basePrice: 750,
    hoursIncluded: 20,
    popular: true,
    bestValue: false,
    isNew: false,
    features: [
      "Up to 20 Hours Coordination Coverage",
      "Lead Wedding Coordinator + 1 Assistants",
      "Pre-Wedding Consultations (4 Meetings)",
      "Venue Walkthrough (1 Visits)",
      "Custom Timeline & Checklist Creation",
      "Vendor Recommendations & Vetting",
      "Contract Review & Negotiation Support",
      "Budget Management & Tracking",
      "Design & Décor Consultation",
      "Vendor Confirmation & Management",
      "Full Rehearsal Coordination (2 Hours)",
      "Ceremony & Reception Management",
      "Setup & Breakdown Supervision",
      "Vendor Point of Contact On-Site",
      "Emergency Kit + Backup Supplies",
      "Guest List & RSVP Tracking",
      "Seating Chart Assistance",
      "Timeline Enforcement Throughout Day",
      "Post-Wedding Vendor Follow-Up",
      "Transportation Included (within 50 miles)",
    ],
    bestFor: ["Mid-Size Weddings (100-200 Guests)", "Couples Needing Vendor Help", "Multi-Venue Weddings", "Themed Weddings"],
  },
  full: {
    title: "Full-Service Planning",
    subtitle: "Complete Luxury Experience",
    description: "All-inclusive wedding planning from engagement to honeymoon send-off",
    basePrice: 1500,
    hoursIncluded: 40,
    popular: false,
    bestValue: true,
    isNew: false,
    features: [
      "Unlimited Coordination Hours (Rehearsal + Wedding Day)",
      "Lead Wedding Coordinator + up to 2 Assistants + Personal Concierge",
      "Unlimited Pre-Wedding Consultations",
      "Unlimited Venue Walkthroughs",
      "Full Planning from Engagement to Honeymoon",
      "Custom Wedding Design & Styling",
      "Complete Vendor Sourcing, Vetting & Booking",
      "Contract Review & Full Negotiation",
      "Comprehensive Budget Management",
      "Floor Plan & Seating Chart Design",
      "Full Rehearsal Coordination",
      "Ceremony & Reception Full Management",
      "Complete Setup & Breakdown Management",
      "Vendor Point of Contact Throughout",
      "Emergency Kit + Full Backup Supplies",
      "Guest List, RSVP & Meal Tracking",
      "Transportation & Accommodation Coordination",
      "Welcome Bags & Guest Favors Management",
      "Post-Wedding Brunch Coordination",
      "Honeymoon Send-Off Coordination",
      "Post-Wedding Vendor Payments & Tips",
      "Transportation Included (within 60 miles)",
      "Guaranteed Backup Coordinator",
    ],
    bestFor: ["Large Weddings (200+ Guests)", "Destination Weddings", "Multi-Day Celebrations", "Luxury & High-End Weddings"],
  },
};

/* ==========================================
   WEDDING SERVICES INCLUDED
========================================== */

const serviceCategories = [
  {
    icon: ClipboardList,
    title: "Planning & Timeline",
    items: ["Custom Timeline Creation", "Checklist Management", "Vendor Coordination", "Rehearsal Planning"],
  },
  {
    icon: MapPin,
    title: "Venue Management",
    items: ["Venue Walkthrough", "Floor Plan Design", "Setup Supervision", "Breakdown Management"],
  },
  {
    icon: Users,
    title: "Guest Experience",
    items: ["RSVP Tracking", "Seating Charts", "Guest Direction", "Special Accommodations"],
  },
  {
    icon: UtensilsCrossed,
    title: "Catering Coordination",
    items: ["Menu Planning", "Dietary Restrictions", "Meal Timing", "Cake Coordination"],
  },
  {
    icon: Music,
    title: "Entertainment",
    items: ["DJ/Band Coordination", "Ceremony Music", "Reception Timeline", "Special Performances"],
  },
  {
    icon: Flower2,
    title: "Décor & Florals",
    items: ["Design Consultation", "Florist Coordination", "Setup Management", "Style Consistency"],
  },
];

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Extra Hour Coverage", price: "$100/hour", description: "Additional on-site coordination beyond package hours" },
  { name: "Additional Assistant", price: "$250", description: "Extra assistant coordinator for larger events" },
  { name: "Rehearsal Dinner Coordination", price: "$400", description: "Full planning and coordination of rehearsal dinner" },
  { name: "Post-Wedding Brunch", price: "$350", description: "Coordination of next-day brunch event" },
  { name: "Welcome Party Coordination", price: "$500", description: "Planning welcome event for out-of-town guests" },
  { name: "Vendor Sourcing Package", price: "$300", description: "Research and recommendation of 5+ vendors per category" },
  { name: "Design & Styling Package", price: "$600", description: "Full design board, mood board, and styling guide" },
  { name: "Budget Management Tool", price: "$100", description: "Custom budget spreadsheet with tracking and alerts" },
  { name: "Invitation Management", price: "$200", description: "Design coordination, mailing list, and RSVP tracking" },
  { name: "Transportation Coordination", price: "$300", description: "Guest shuttle, party bus, and vendor transport planning" },
  { name: "Honeymoon Planning", price: "$250", description: "Travel research, booking assistance, and itinerary planning" },
  { name: "Extended Travel", price: "$2/mile", description: "For venues beyond package mileage limit" },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function WeddingCoordinationPricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
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
      const selectedPkg = weddingPackages[pkg];
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
      const basePrice = weddingPackages[selectedPackage]?.basePrice || 0;
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
    if (!bookingForm.weddingDate.trim()) errors.weddingDate = "Wedding date is required";
    if (!bookingForm.weddingLocation.trim()) errors.weddingLocation = "Location is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

      const handleBookNow = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);
        const generatedId = `WED-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        const selectedPkg = weddingPackages[selectedPackage];
        const teamSize = selectedPkg?.teamSize || "";
        const hoursIncluded = selectedPkg?.hoursIncluded || 0;
        const basePrice = selectedPkg?.basePrice || 0;

        await addDoc(collection(db, "serviceRequests"), {
          requestId: generatedId,
          customerName: bookingForm.fullName || "",
          email: bookingForm.email || "",
          phone: bookingForm.phone || "",
          partnerName: bookingForm.partnerName || "",
          serviceType: "Wedding Coordination",
          category: "Wedding Coordination",
          status: "pending",
          source: "pricing",
          requestType: "booking",
          package: bookingForm.package || "",
          teamSize: teamSize,
          hoursIncluded: hoursIncluded,
          weddingDate: bookingForm.weddingDate || "",
          weddingLocation: bookingForm.weddingLocation || "",
          venueName: bookingForm.venueName || "",
          guestCount: bookingForm.guestCount || "",
          addOns: selectedAddOns || [],
          budget: totalPrice || 0,
          basePrice: basePrice,
          message: bookingForm.message || "",
          description: `WEDDING COORDINATION BOOKING: ${bookingForm.package}\nTeam: ${teamSize}\nHours: ${hoursIncluded}\nWedding Date: ${bookingForm.weddingDate}\nLocation: ${bookingForm.weddingLocation}\nVenue: ${bookingForm.venueName}\nGuests: ${bookingForm.guestCount}\nPartner: ${bookingForm.partnerName}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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

  /* ==========================================
     ADD-ON ICON HELPER
  ========================================== */
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
          <p className="text-gray-600">Loading wedding packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-rose-50/40">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-200/25 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-300/10 blur-[100px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-rose-600">
              Wedding Coordination Services
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Your Dream Wedding{" "}
            <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
              Coordinated
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From intimate ceremonies to grand celebrations, our experienced wedding coordinators
            ensure every detail is perfect so you can focus on what matters most — each other.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {Object.entries(weddingPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-rose-400 ring-2 ring-rose-100" : 
                pkg.bestValue ? "border-pink-500 ring-2 ring-pink-100" : 
                "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-400 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1 rounded-full">
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

              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold text-gray-700">Up to {pkg.hoursIncluded} Hours</span>
              </div>

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

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Best For:</p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.bestFor.map((item, i) => (
                    <span key={i} className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-rose-400 text-white py-3 font-semibold hover:bg-rose-500 transition-all shadow-md">
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add-Ons */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add-On Services</h2>
          <p className="text-gray-500 text-center mb-8">Customize your wedding coordination package</p>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-rose-100 p-2 text-rose-500 shrink-0">
                  {getAddOnIcon(addon.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                    <span className="text-xs font-bold text-rose-500">{addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Wedding Services Categories */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            What We <span className="text-rose-500">Coordinate</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Comprehensive wedding coordination covering every aspect of your big day</p>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceCategories.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-rose-50 p-2.5 text-rose-500">
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">{service.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {service.items.map((item, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-rose-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Every Package Includes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Calendar className="w-6 h-6" />, title: "Timeline Creation", desc: "Detailed day-of schedule" },
              { icon: <ClipboardList className="w-6 h-6" />, title: "Vendor Coordination", desc: "Point of contact for all vendors" },
              { icon: <Car className="w-6 h-6" />, title: "Transportation", desc: "Within package mileage" },
              { icon: <Shield className="w-6 h-6" />, title: "Emergency Kit", desc: "Fully stocked for any situation" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="rounded-xl bg-rose-50 p-3 inline-flex mb-3 text-rose-500">{item.icon}</div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Browse Other Services */}
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

        {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-rose-400" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /><span>200+ Weddings</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-rose-400" /><span>Insured & Certified</span></div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Book Wedding Coordination</h3>
                    <p className="text-sm text-gray-500">{weddingPackages[selectedPackage].title} - {weddingPackages[selectedPackage].teamSize}</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-rose-50 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Base Package:</span><span className="font-semibold">${weddingPackages[selectedPackage].basePrice}</span></div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-rose-200 pt-2 mb-2">
                      {selectedAddOns.map((addon, i) => (<div key={i} className="flex justify-between items-center text-sm"><span className="text-gray-600">+ {addon.name}</span><span className="text-rose-500">{addon.price}</span></div>))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-rose-200"><span className="font-semibold text-gray-900">Total:</span><span className="text-xl font-bold text-rose-500">${totalPrice}</span></div>
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Wedding Date *</label>
                    <input type="date" value={bookingForm.weddingDate} onChange={(e) => { setBookingForm({ ...bookingForm, weddingDate: e.target.value }); if (formErrors.weddingDate) setFormErrors({ ...formErrors, weddingDate: "" }); }} className={`w-full rounded-xl border ${formErrors.weddingDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} />
                    {formErrors.weddingDate && <p className="text-red-500 text-xs mt-1">{formErrors.weddingDate}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Wedding Location *</label>
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
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none resize-none" placeholder="Your wedding vision, colors, theme, special requests..." />
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
                <p className="text-gray-600 mb-6">We'll review your wedding details and contact you within 24 hours for a consultation. Congratulations on your engagement!</p>
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
    </div>
  );
}