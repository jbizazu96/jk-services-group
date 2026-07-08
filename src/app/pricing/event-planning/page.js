"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Import your existing Booking Modal
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
  Cloud,
  Lightbulb,
  Stars,
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
  PenTool,
  Truck,
  Wine,
  Cake,
  Banknote,
  HelpCircle,
  Plus, 
  heart,
  shield,
  Coffee
} from "lucide-react";

/* ==========================================
   EVENT PLANNING PACKAGES
========================================== */

const eventPackages = {
  essentials: {
    title: "Planning Essentials",
    subtitle: "Day-Of Peace of Mind",
    description: "Perfect for the DIY planner who has everything set and just needs a professional to execute it flawlessly.",
    basePrice: 1000,
    monthsOfPlanning: 2,
    teamSize: "1 Lead Coordinator",
    popular: false,
    bestValue: false,
    isNew: false,
    features: [
      "Planning Checklist & Timeline",
      "Budget Planning & Tracking",
      "Venue Selection Assistance",
      "One Venue Walkthrough",
      "Vendor Recommendations",
      "One Planning Consultation",
      "Event Design Consultation",
      "Basic Floor Plan Assistance",
      "Email Support During Planning",
      "Travel within 60 miles Included",
    ],
    bestFor: ["Intimate Events (<50 guests)", "Planners with a Venue Coordinator", "Elopements & Micro-Events"],
  },
  signature: {
    title: "Signature Planning",
    subtitle: "The Ultimate Event Experience",
    description: "Our most popular package. Full support from the planning phase through to the grand finale, with extra hands on deck.",
    basePrice: 1650,
    monthsOfPlanning: 6,
    teamSize: "2 Coordinators + 1 Assistant",
    popular: true,
    bestValue: true,
    isNew: false,
    features: [
      "Custom Event Design",
      "Mood Board Creation",
      "Vendor Sourcing & Vetting",
      "Vendor Meeting Assistance",
      "Contract Review",
      "Budget Management",
      "Guest List Management",
      "RSVP Tracking",
      "Seating Chart Design",
      "Floor Plan Design",
      "Timeline Creation",
      "Planning Portal Access",
      "Monthly Planning Meetings",
      "Unlimited Email Support",
      "Travel within 60 miles Included"
    ],
    bestFor: ["Standard Events (50-150 guests)", "Themed Events", "Planners wanting a Stress-Free Day"],
  },
  luxury: {
    title: "Luxury Full-Service",
    subtitle: "White-Glove Expertise",
    description: "For the planner who wants absolutely nothing left to chance. A dedicated concierge team to create an unforgettable experience.",
    basePrice: 2500,
    monthsOfPlanning: 12,
    teamSize: "1 Lead, 2 Assistants, 1 Concierge",
    popular: false,
    bestValue: false,
    isNew: true,
    features: [
      "Unlimited Planning Meetings",
      "Unlimited Email & Phone Support",
      "Complete Event Design",
      "Custom Styling",
      "Full Vendor Management",
      "Contract Negotiation",
      "Budget Planning",
      "Guest Experience Planning",
      "Transportation Planning",
      "Accommodation Planning",
      "Weekend Event Planning",
      "Welcome Party Planning",
      "Post-Event Brunch Planning",
      "Personal Planning Concierge",
      "Emergency Backup Planning",
      "Unlimited Revisions",
      "Priority Support",
      "Travel Included within 60 miles"
    ],
    bestFor: ["Grand Events (150+ guests)", "Destination Events", "Multi-Day Celebrations"],
  },
};

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Ceremony Rehearsal Coordination", price: 250, description: "Uplighting, gobos, and ambient effects for the reception" },
  { name: "Welcome Party Planning", price: 650, description: "Full coordination of the 'Night Before' event for guests" },
  { name: "Post-Event Brunch", price: 450, description: "Coordination and timeline management of the morning after" },
  { name: "Venue Research", price: 250, description: "Research and compare venues that fit the client's budget and vision." },
  { name: "Vendor Sourcing", price: 300, description: "Find and recommend vendors in a chosen category." },
  { name: "Budget Management", price: 250, description: "Create and maintain the event budget with payment reminders." },
  { name: "Event Design", price: 300, description: "Mood boards, color palette, décor inspiration, and styling guidance." },
  { name: "RSVP Management", price: 250, description: "Track guest responses and meal selections." },
  { name: "Invitation & RSVP Management", price: 250, description: "Coordinate invitations, mailing lists, and response tracking." },
  { name: "Seating Chart Design", price: 200, description: "Create and organize guest seating arrangements." },
  { name: "Event Website Setup", price: 250, description: "Create and organize an event website with schedules, directions, and RSVP information." },
  { name: "Guest Accommodation Planning", price: 300, description: "Coordinate hotel room blocks and lodging information." },
  { name: "Transportation Planning", price: 300, description: "Arrange guest transportation schedules and logistics." },
  { name: "Floor Plan Design", price: 250, description: "Design layouts for tables, stage, dance floor, and vendor locations." },
];


const addOns2 = [
  {
    name: "Dancing on the Clouds",
    price: 300,
    icon: Cloud,
    description: "Low-lying fog effect for first dances, grand entrances, and special moments.",
  },
  {
    name: "Cold Spark Effects (2 Machines)",
    price: 400,
    icon: Sparkles,
    description: "Indoor-safe cold spark fountains for unforgettable entrances and celebrations.",
  },
  {
    name: "Cold Spark Effects (4 Machines)",
    price: 650,
    icon: Sparkles,
    description: "Premium cold spark display surrounding the dance floor or stage.",
  },
  {
    name: "Dance Floor Lighting",
    price: 250,
    icon: Lightbulb,
    description: "Dynamic lighting effects to energize your dance floor.",
  },
  {
    name: "Venue Uplighting",
    price: 350,
    icon: Lightbulb,
    description: "Elegant uplighting to transform the atmosphere of your venue.",
  },
  {
    name: "Premium First Dance Package",
    price: 850,
    icon: Stars,
    description: "Includes Dancing on the Clouds, 2 cold spark machines, and synchronized dance floor lighting.",
  },
];




/* ==========================================
   MAIN COMPONENT
========================================== */

export default function EventPlanningPricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Internal State for the Book This Package Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // State for your external BookingModal (Ask a Question / Contact Us)
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
    weddingDate: "", // Kept as weddingDate so it maps to your Firestore correctly
    weddingLocation: "", // Kept as weddingLocation
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

  // This function triggers the internal "Book" modal (the detailed form inside this page)
  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddOns([]);
    const selectedPkg = eventPackages[pkg];
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
    setShowBookingModal(true); // Opens the internal modal
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
      const basePrice = eventPackages[selectedPackage]?.basePrice || 0;
      const addOnTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
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

      const selectedPkg = eventPackages[selectedPackage];
      const basePrice = selectedPkg?.basePrice || 0;
      const teamSize = selectedPkg?.teamSize || "";
      const monthsOfPlanning = selectedPkg?.monthsOfPlanning || 0;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName || "",
        email: bookingForm.email || "",
        phone: bookingForm.phone || "",
        partnerName: bookingForm.partnerName || "",
        serviceType: "Event Planning",
        category: "Event Planning",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package || "",
        teamSize: teamSize,
        monthsOfPlanning: monthsOfPlanning,
        weddingDate: bookingForm.weddingDate || "",
        weddingLocation: bookingForm.weddingLocation || "",
        venueName: bookingForm.venueName || "",
        guestCount: bookingForm.guestCount || "",
        addOns: selectedAddOns || [],
        budget: totalPrice || 0,
        basePrice: basePrice,
        message: bookingForm.message || "",
        description: `EVENT BOOKING: ${bookingForm.package}\nTeam: ${teamSize}\nHours: ${monthsOfPlanning}\nDate: ${bookingForm.weddingDate}\nLocation: ${bookingForm.weddingLocation}\nVenue: ${bookingForm.venueName}\nGuests: ${bookingForm.guestCount}\nPartner: ${bookingForm.partnerName}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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
    if (name.includes("Photographer")) return <Camera className="w-4 h-4" />;
    if (name.includes("Drone")) return <Car className="w-4 h-4" />;
    if (name.includes("Lighting")) return <Sparkles className="w-4 h-4" />;
    if (name.includes("Welcome")) return <PartyPopper className="w-4 h-4" />;
    if (name.includes("Brunch")) return <Coffee className="w-4 h-4" />;
    if (name.includes("Photo")) return <Camera className="w-4 h-4" />;
    if (name.includes("Cake")) return <Cake className="w-4 h-4" />;
    if (name.includes("Bar") || name.includes("Mixology")) return <Wine className="w-4 h-4" />;
    if (name.includes("Band")) return <Music className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  // Coffee Icon (needed for brunch add-on)
  const Coffee = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
  );

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f7f4] text-gray-900">
      {/* Soft Ambient Glows */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-100/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-amber-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Top Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-gradient-to-r from-rose-200/0 via-rose-200/30 to-rose-200/0 blur-3xl -z-10" />
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 backdrop-blur-sm px-5 py-2 shadow-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-rose-600">
              Event Planning Services
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-serif text-[#1a1a2e]">
            Unforgettable <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">Moments</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From intimate gatherings to grand galas, we craft flawlessly executed events so you can live in the moment.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {Object.entries(eventPackages).map(([key, pkg]) => (
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
              {/* Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && !pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                  BEST VALUE
                </div>
              )}
              {pkg.isNew && !pkg.popular && !pkg.bestValue && (
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
                <span className="text-sm font-semibold text-gray-700">Up to {pkg.monthsOfPlanning} Months</span>
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
                {/* 1. Book This Package - Opens the Internal Form */}
                <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-[#1a1a2e] text-white py-3.5 font-semibold hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  Book This Package
                </button>
                
                {/* 2. Ask a Question - Opens the External Component Modal */}
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

        {/* Add-Ons Section */}
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
                    <span className="text-sm font-bold text-rose-500">${addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addon.description}</p>
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
                    <div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-600">
                      <addon.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {addon.name}
                        </h4>

                        <span className="text-xs font-bold text-blue-600">
                          ${addon.price}
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
              
              {/* 3. Contact Us - Opens the External Component Modal */}
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

        {/* Footer Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12 mt-12 border-t border-gray-200">
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">Browse Other Services</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(0, 8).map((category) => (
              <button key={category.id} onClick={() => router.push(`/services/${category.slug}`)} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-rose-400 hover:text-rose-500 transition-all shadow-sm">
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
          INTERNAL BOOKING MODAL (For "Book This Package")
      ========================================== */}
      <AnimatePresence>
        {showBookingModal && selectedPackage && !success && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBookingModal(false)} className="fixed inset-0 bg-[#1a1a2e]/60 z-40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#1a1a2e]">Secure Your Date</h3>
                    <p className="text-sm text-gray-500">{eventPackages[selectedPackage].title}</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                    <input type="text" value={bookingForm.fullName} onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }} className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all`} placeholder="Jane Doe" />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Partner's Name</label>
                    <input type="text" value={bookingForm.partnerName} onChange={(e) => setBookingForm({ ...bookingForm, partnerName: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all" placeholder="John Smith" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full rounded-xl border ${formErrors.email ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="jane@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }} className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="(555) 123-4567" />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Event Date *</label>
                    <input type="date" value={bookingForm.weddingDate} onChange={(e) => { setBookingForm({ ...bookingForm, weddingDate: e.target.value }); if (formErrors.weddingDate) setFormErrors({ ...formErrors, weddingDate: "" }); }} className={`w-full rounded-xl border ${formErrors.weddingDate ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} />
                    {formErrors.weddingDate && <p className="text-red-500 text-xs mt-1">{formErrors.weddingDate}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Event Location *</label>
                      <input type="text" value={bookingForm.weddingLocation} onChange={(e) => { setBookingForm({ ...bookingForm, weddingLocation: e.target.value }); if (formErrors.weddingLocation) setFormErrors({ ...formErrors, weddingLocation: "" }); }} className={`w-full rounded-xl border ${formErrors.weddingLocation ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-rose-400 outline-none`} placeholder="City, State" />
                      {formErrors.weddingLocation && <p className="text-red-500 text-xs mt-1">{formErrors.weddingLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Venue Name</label>
                      <input type="text" value={bookingForm.venueName} onChange={(e) => setBookingForm({ ...bookingForm, venueName: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none" placeholder="The Grand Ballroom" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Guest Count</label>
                    <input type="number" value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 outline-none" placeholder="150" />
                  </div>

                  {/* Add-Ons Selector in Form */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-rose-400 bg-rose-50" : "border-gray-100 hover:border-rose-200 hover:bg-gray-50"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-1 w-4 h-4 text-rose-500 rounded focus:ring-rose-400" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium text-[#1a1a2e]">{addon.name}</span><span className="text-sm font-bold text-rose-500">+${addon.price}</span></div>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}

                      {/* AddOns for Fog Machine & Lighting */}
                      {addOns2.map((addon, index) => (
                        <label key={index} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddOns.some(a => a.name === addon.name) ? "border-rose-400 bg-rose-50" : "border-gray-100 hover:border-rose-200 hover:bg-gray-50"}`}>
                          <input type="checkbox" checked={selectedAddOns.some(a => a.name === addon.name)} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-1 w-4 h-4 text-rose-500 rounded focus:ring-rose-400" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between"><span className="text-sm font-medium text-[#1a1a2e]">{addon.name}</span><span className="text-sm font-bold text-rose-500">+${addon.price}</span></div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{addon.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Special Requests / Vision</label>
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all resize-none" placeholder="Colors, themes, guest count, or any specific details..." />
                  </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-rose-50 border border-rose-100 p-5 mb-6">
                  <div className="flex justify-between items-center mb-1"><span className="text-sm text-gray-600">Base Package:</span><span className="font-semibold text-[#1a1a2e]">${eventPackages[selectedPackage].basePrice}</span></div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-rose-200 pt-2 mb-2 mt-2">
                      {selectedAddOns.map((addon, i) => (
                        <div key={i} className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600 flex items-center gap-1.5"><span className="text-rose-400 font-bold">+</span> {addon.name}</span>
                          <span className="text-rose-500">+${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-rose-200 mt-2"><span className="font-bold text-[#1a1a2e]">Estimated Total:</span><span className="text-2xl font-bold text-rose-500">${totalPrice}</span></div>
                </div>

                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1a1a2e] text-white py-4 font-semibold hover:bg-[#2d2d44] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-2">
                    {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : (<><Send className="w-5 h-5" /> Send Inquiry - ${totalPrice}</>)}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">You will receive a confirmation and consultation within 24 hours.</p>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal (Internal) */}
      <AnimatePresence>
        {success && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1a1a2e]/70 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-amber-400" />
                <div className="rounded-full bg-rose-100 p-4 inline-flex mb-6 mt-4"><CheckCircle2 className="w-12 h-12 text-rose-500" /></div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3 font-serif">Inquiry Received!</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">We can't wait to help plan your special event! Our team will review your details and reach out to schedule a free 30-minute consultation.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Reference ID</p>
                  <p className="text-lg font-mono font-semibold text-[#1a1a2e]">{requestId}</p>
                </div>
                <button onClick={() => { setSuccess(false); setShowBookingModal(false); }} className="w-full rounded-xl bg-[#1a1a2e] text-white py-3 font-semibold hover:bg-[#2d2d44] transition-all shadow-sm">Back to Packages</button>
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

// Crown Icon (for Luxury package)
function Crown({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
      <path d="M5 21h14"/>
    </svg>
  );
}