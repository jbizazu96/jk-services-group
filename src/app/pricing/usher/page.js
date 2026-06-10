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
  Users,
  Calendar,
  Car,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  PartyPopper,
  Gem,
  Shirt,
  Palette,
  UserCheck,
  ArrowRight,
  Hand,
  Eye,
  Ruler,
} from "lucide-react";

/* ==========================================
   USHER PACKAGES
========================================== */

const usherPackages = {
  essential: {
    icon: Users,
    title: "Essential Ushers",
    subtitle: "Basic Event Support",
    description: "Professional usher services for smaller, intimate gatherings",
    basePrice: 200,
    usherCount: "2 Ushers",
    hoursIncluded: 4,
    popular: false,
    features: [
      "2 Professional Ushers",
      "Up to 4 Hours Coverage",
      "Guest Welcome & Greeting",
      "Seating Assistance",
      "Program Distribution",
      "Basic Crowd Flow Management",
      "Standard Uniform (Black & White)",
      "Pre-Event Coordination (1 Call)",
      "Local Transportation Included (within 60 miles)",
    ],
    bestFor: ["Small Weddings", "Birthday Parties", "Baby Showers", "Intimate Gatherings"],
  },
  professional: {
    icon: UserCheck,
    title: "Professional Ushers",
    subtitle: "Full Event Coverage",
    description: "Comprehensive usher team for medium to large events",
    basePrice: 450,
    usherCount: "4 Ushers",
    hoursIncluded: 6,
    popular: true,
    features: [
      "4 Professional Ushers",
      "Up to 6 Hours Coverage",
      "Guest Welcome & Registration",
      "Seating Management & Escort",
      "Program & Gift Bag Distribution",
      "Crowd Flow & Queue Management",
      "VIP Guest Assistance",
      "Custom Uniform Colors (Match Event Theme)",
      "Pre-Event Training Session",
      "On-Site Coordinator Included",
      "Transportation Included (within 60 miles)",
      "Emergency Backup Usher Available",
    ],
    bestFor: ["Weddings", "Corporate Events", "Anniversaries", "Award Ceremonies", "Religious Services"],
  },
  premium: {
    icon: Gem,
    title: "Premium Ushers",
    subtitle: "Luxury Event Experience",
    description: "Elite usher team for grand celebrations and high-profile events",
    basePrice: 900,
    usherCount: "6-8 Ushers",
    hoursIncluded: 10,
    popular: false,
    bestValue: true,
    features: [
      "6-8 Professional Ushers",
      "Up to 10 Hours Coverage",
      "Guest Welcome & VIP Registration",
      "Personalized Seating Management",
      "Program, Gift & Favor Distribution",
      "Advanced Crowd Flow Management",
      "VIP & Special Needs Guest Assistance",
      "Red Carpet Guest Greeting",
      "Custom Designer Uniforms (Any Color/Theme)",
      "Multiple Pre-Event Training Sessions",
      "Dedicated On-Site Team Lead",
      "Rehearsal Attendance",
      "Post-Event Guest Departure Assistance",
      "Transportation Included (within 100 miles)",
      "Guaranteed Backup Ushers",
      "Multilingual Ushers Available",
    ],
    bestFor: ["Grand Weddings", "Galas", "Corporate Galas", "Celebrity Events", "Multi-Day Conferences", "Festivals"],
  },
};

/* ==========================================
   EVENT TYPES
========================================== */

const eventTypes = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Elegant usher service for your special day",
    startingPrice: "$350",
    packageRecommendation: "Professional or Premium",
    features: ["Ceremony Seating", "Reception Guest Management", "Bridal Party Assistance", "Gift Table Management"],
  },
  {
    icon: Briefcase,
    title: "Corporate Event",
    description: "Professional presence for business functions",
    startingPrice: "$400",
    packageRecommendation: "Professional or Premium",
    features: ["Registration Desk Support", "Attendee Direction", "Materials Distribution", "VIP Guest Handling"],
  },
  {
    icon: Church,
    title: "Religious Service",
    description: "Respectful ushering for worship gatherings",
    startingPrice: "$200",
    packageRecommendation: "Essential or Professional",
    features: ["Congregation Seating", "Offering Collection", "Program Distribution", "Exit Flow Management"],
  },
  {
    icon: PartyPopper,
    title: "Anniversary / Birthday",
    description: "Warm and welcoming atmosphere",
    startingPrice: "$250",
    packageRecommendation: "Professional",
    features: ["Guest Welcome", "Gift Collection", "Seating Arrangement", "Cake Ceremony Coordination"],
  },
  {
    icon: GraduationCap,
    title: "Graduation Ceremony",
    description: "Organized ushering for academic events",
    startingPrice: "$350",
    packageRecommendation: "Professional",
    features: ["Graduate Line-Up", "Stage Flow Management", "Guest Seating", "Diploma Distribution Support"],
  },
  {
    icon: Star,
    title: "Gala / Fundraiser",
    description: "Sophisticated service for formal events",
    startingPrice: "$500",
    packageRecommendation: "Premium",
    features: ["Red Carpet Welcome", "Table Escort", "Auction Support", "Donor Assistance"],
  },
  {
    icon: Hand,
    title: "Funeral / Memorial",
    description: "Compassionate and dignified service",
    startingPrice: "$200",
    packageRecommendation: "Essential or Professional",
    features: ["Attendee Greeting", "Seating Assistance", "Program Distribution", "Flower Arrangement Support"],
  },
  {
    icon: Users,
    title: "Community Event",
    description: "Friendly ushering for public gatherings",
    startingPrice: "$300",
    packageRecommendation: "Professional",
    features: ["Crowd Direction", "Information Desk", "Activity Coordination", "Accessibility Support"],
  },
];

/* ==========================================
   UNIFORM OPTIONS
========================================== */

const uniformOptions = [
  { name: "Classic Black & White", colors: ["Black", "White"], icon: Shirt, description: "Timeless and professional look" },
  { name: "Event Theme Match", colors: ["Custom"], icon: Palette, description: "Uniforms matched to your event colors" },
  { name: "Formal Attire", colors: ["Navy", "Black"], icon: Gem, description: "Premium formal suits and dresses" },
  { name: "Cultural Attire", colors: ["Traditional"], icon: Sparkles, description: "Traditional/cultural dress options" },
  { name: "All White", colors: ["White"], icon: Star, description: "Clean, elegant all-white ensemble" },
  { name: "Custom Design", colors: ["Your Choice"], icon: Ruler, description: "Fully customized uniform design" },
];

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Extra Usher", price: "$75/usher", icon: Users, description: "Additional professional usher for your event" },
  { name: "Extra Hour", price: "$50/hour", icon: Clock, description: "Additional coverage beyond package hours" },
  { name: "Custom Uniforms", price: "$25/usher", icon: Palette, description: "Custom color uniforms to match your theme" },
  { name: "Multilingual Usher", price: "$50/usher", icon: Sparkles, description: "Usher fluent in English + French or Swahili" },
  { name: "Rehearsal Attendance", price: "$100", icon: Calendar, description: "Ushers attend your event rehearsal" },
  { name: "Extended Travel", price: "$1.50/mile", icon: Car, description: "For events beyond package mileage limit" },
  { name: "VIP Concierge Service", price: "$150", icon: Gem, description: "Dedicated usher for VIP guests only" },
  { name: "Coat Check Service", price: "$100", icon: Shirt, description: "Ushers manage coat check for guests" },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function UsherPricingPage() {
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

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    uniformPreference: "",
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
    setTotalPrice(usherPackages[pkg]?.basePrice || 0);
    setBookingForm({
        fullName: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        eventLocation: "",
        guestCount: "",
        uniformPreference: "",
        package: usherPackages[pkg]?.title || "",
        message: "",
    });
    setFormErrors({});
    setShowBookingModal(true);
    };

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

    // Update total price whenever add-ons change
    useEffect(() => {
    if (selectedPackage) {
        const basePrice = usherPackages[selectedPackage]?.basePrice || 0;
        const addOnTotal = selectedAddOns.reduce((sum, addon) => {
        const price = parseFloat(addon.price.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(price) ? 0 : price);
        }, 0);
        setTotalPrice(basePrice + addOnTotal);
    }
    }, [selectedAddOns, selectedPackage]);

        const handleBookNow = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const generatedId = `USH-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

            await addDoc(collection(db, "serviceRequests"), {
            requestId: generatedId,
            customerName: bookingForm.fullName,
            email: bookingForm.email,
            phone: bookingForm.phone,
            serviceType: "Usher Services",
            category: "Usher Services",
            status: "pending",
            source: "pricing",
            requestType: "booking",
            package: bookingForm.package,
            usherCount: usherPackages[selectedPackage]?.usherCount,
            hoursIncluded: usherPackages[selectedPackage]?.hoursIncluded,
            eventType: bookingForm.eventType,
            eventDate: bookingForm.eventDate,
            eventLocation: bookingForm.eventLocation,
            guestCount: bookingForm.guestCount,
            uniformPreference: bookingForm.uniformPreference,
            addOns: selectedAddOns,
            budget: totalPrice,
            basePrice: usherPackages[selectedPackage]?.basePrice || 0,
            message: bookingForm.message,
            description: `USHER BOOKING: ${bookingForm.package}\nUshers: ${usherPackages[selectedPackage]?.usherCount}\nHours: ${usherPackages[selectedPackage]?.hoursIncluded}\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.eventDate}\nLocation: ${bookingForm.eventLocation}\nGuests: ${bookingForm.guestCount}\nUniform: ${bookingForm.uniformPreference}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading usher packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Usher Services Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Professional Usher{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Elevate your event with professional usher services. From guest greeting to seating management,
            our trained ushers ensure a seamless and welcoming experience for every attendee.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {Object.entries(usherPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
              } ${pkg.bestValue ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-blue-50 p-2.5">
                  <pkg.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">{pkg.usherCount}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-blue-600" />
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
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
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
                      className="text-xs text-blue-600 pl-6 font-medium hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
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
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openBookingModal(key)}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-all shadow-md"
              >
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Event Types */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Events We <span className="text-blue-600">Serve</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Professional usher services tailored to your specific event</p>

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
                <div className="rounded-xl bg-blue-50 p-2.5 inline-flex mb-3 text-blue-600"><event.icon className="w-6 h-6" /></div>
                <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{event.description}</p>
                <p className="text-sm font-semibold text-blue-600 mb-2">From {event.startingPrice}</p>
                <p className="text-xs text-gray-400 mb-3">Recommended: {event.packageRecommendation}</p>
                <ul className="space-y-1">
                  {event.features.slice(0, 2).map((f, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-blue-500" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Uniform Options */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Uniform <span className="text-blue-600">Options</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Choose the perfect look for your usher team</p>

          <div className="grid md:grid-cols-3 gap-4">
            {uniformOptions.map((uniform, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><uniform.icon className="w-6 h-6" /></div>
                  <h3 className="font-bold text-gray-900">{uniform.name}</h3>
                </div>
                <div className="flex gap-1.5 mb-2">
                  {uniform.colors.map((color, j) => (
                    <span key={j} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {color}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">{uniform.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add-Ons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add-On Services</h2>
          <p className="text-gray-500 text-center mb-8">Customize your usher package with these additional options</p>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600 shrink-0"><addon.icon className="w-6 h-6" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                    <span className="text-xs font-bold text-blue-600">{addon.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Every Package Includes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Car className="w-6 h-6" />, title: "Transportation", desc: "Within package mileage" },
              { icon: <Shirt className="w-6 h-6" />, title: "Uniforms", desc: "Professional attire provided" },
              { icon: <Calendar className="w-6 h-6" />, title: "Coordination", desc: "Pre-event planning" },
              { icon: <Shield className="w-6 h-6" />, title: "Backup Ushers", desc: "Emergency coverage" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="rounded-xl bg-blue-50 p-3 inline-flex mb-3 text-blue-600">{item.icon}</div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
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
                className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Professional & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Always On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>100+ Events Served</span>
            </div>
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
                    <h3 className="text-xl font-bold text-gray-900">Book Usher Service</h3>
                    <p className="text-sm text-gray-500">
                        {usherPackages[selectedPackage].title} - {usherPackages[selectedPackage].usherCount}
                    </p>
                    </div>
                    <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-blue-50 p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Base Package:</span>
                    <span className="font-semibold">${usherPackages[selectedPackage].basePrice}</span>
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

                <form onSubmit={handleBookNow} className="space-y-4">
                    <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        value={bookingForm.fullName}
                        onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }}
                        className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
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
                        className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
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
                        className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
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
                        className={`w-full rounded-xl border ${formErrors.eventType ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
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
                        className={`w-full rounded-xl border ${formErrors.eventDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
                        />
                        {formErrors.eventDate && <p className="text-red-500 text-xs mt-1">{formErrors.eventDate}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Guest Count</label>
                        <input
                        type="number"
                        value={bookingForm.guestCount}
                        onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none"
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
                        className={`w-full rounded-xl border ${formErrors.eventLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-blue-500 outline-none`}
                        placeholder="Venue name or address"
                    />
                    {formErrors.eventLocation && <p className="text-red-500 text-xs mt-1">{formErrors.eventLocation}</p>}
                    </div>

                    <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Uniform Preference</label>
                    <select
                        value={bookingForm.uniformPreference}
                        onChange={(e) => setBookingForm({ ...bookingForm, uniformPreference: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none"
                    >
                        <option value="">Select uniform style</option>
                        {uniformOptions.map((u) => (
                        <option key={u.name} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                    </div>

                    {/* ADD-ON SERVICES CHECKBOXES */}
                    <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                            <label
                            key={addon.name}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                isChecked
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleAddOnToggle(addon.name, addon.price)}
                                className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
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
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 outline-none resize-none"
                        placeholder="Tell us about your event requirements..."
                    />
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 text-white py-4 font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                <div className="rounded-full bg-blue-100 p-4 inline-flex mb-6">
                  <CheckCircle2 className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your event details and contact you within 24 hours to finalize the usher team.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button
                  onClick={() => { setSuccess(false); setShowBookingModal(false); }}
                  className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-all"
                >
                  Back to Packages
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}