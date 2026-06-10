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
  Camera,
  Calendar,
  Car,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  PartyPopper,
  Gem,
  Image,
  Video,
  Album,
  Printer,
  Flashlight,
  Monitor,
  Users,
  MapPin,
  Download,
  Share2,
} from "lucide-react";

/* ==========================================
   PHOTOGRAPHY PACKAGES
========================================== */

const photoPackages = {
  essential: {
    icon: Camera,
    title: "Essential Shoot",
    subtitle: "Perfect for Intimate Moments",
    description: "Professional photography for smaller events and portrait sessions",
    basePrice: 350,
    hoursIncluded: 2,
    photosIncluded: 50,
    popular: false,
    features: [
      "Up to 2 Hours Photography Coverage",
      "Professional Photographer with DSLR",
      "50 Professionally Edited Digital Photos",
      "Online Private Gallery for Viewing",
      "Digital Download Access",
      "1 Location Within City Limits",
      "Standard Retouching (Color, Exposure)",
      "Pre-Shoot Consultation (1 Call)",
      "Photo Delivery Within 7-10 Days",
      "Local Transportation Included (within 25 miles)",
    ],
    bestFor: ["Headshots", "Small Birthdays", "Maternity", "Engagement", "Baby Showers"],
  },
  professional: {
    icon: Image,
    title: "Professional Shoot",
    subtitle: "Full Event Coverage",
    description: "Comprehensive photography for medium to large events and sessions",
    basePrice: 800,
    hoursIncluded: 4,
    photosIncluded: 150,
    popular: true,
    features: [
      "Up to 4 Hours Photography Coverage",
      "Professional Photographer + Assistant",
      "150 Professionally Edited Digital Photos",
      "Online Private Gallery with Slideshow",
      "Digital Download + USB Drive Delivery",
      "Up to 2 Locations",
      "Advanced Retouching (Skin, Blemish, Detail)",
      "30 Premium Prints (4x6 or 5x7)",
      "Pre-Shoot Consultation (2 Meetings)",
      "Sneak Peek Within 48 Hours",
      "Full Gallery Delivery Within 7 Days",
      "Transportation Included (within 50 miles)",
      "Backup Equipment Available",
    ],
    bestFor: ["Weddings", "Corporate Events", "Anniversaries", "Graduations", "Family Reunions"],
  },
  premium: {
    icon: Gem,
    title: "Premium Shoot",
    subtitle: "Luxury Photography Experience",
    description: "All-inclusive premium photography for grand celebrations and luxury events",
    basePrice: 1800,
    hoursIncluded: 8,
    photosIncluded: 400,
    popular: false,
    bestValue: true,
    features: [
      "Up to 8 Hours Photography Coverage (Flexible)",
      "Lead Photographer + Second Shooter + Assistant",
      "400+ Professionally Edited Digital Photos",
      "Online Private Gallery with Slideshow & Proofing",
      "Digital Download + Custom USB + Cloud Backup",
      "Unlimited Locations",
      "Premium Retouching (Advanced Skin, Detail, Artistic)",
      "100 Premium Prints (Various Sizes)",
      "1 Custom Leather-Bound Photo Album (20 Pages)",
      "Engagement/Pre-Event Photoshoot Included",
      "Multiple Pre-Shoot Consultations",
      "Rehearsal/Dry-Run Attendance",
      "Sneak Peek Within 24 Hours",
      "Full Gallery Delivery Within 5 Days",
      "Drone Photography Add-On Available",
      "Same-Day Slideshow Available",
      "Transportation Included (within 100 miles)",
      "Backup Equipment Guaranteed",
      "Copyright Release for Personal Use",
    ],
    bestFor: ["Grand Weddings", "Luxury Galas", "Destination Events", "Multi-Day Events", "Celebrity Events"],
  },
};

/* ==========================================
   EVENT TYPES
========================================== */

const eventTypes = [
  {
    icon: Heart,
    title: "Wedding",
    description: "Capturing every precious moment of your special day",
    startingPrice: "$800",
    packageRecommendation: "Professional or Premium",
    features: ["Getting Ready", "Ceremony", "Reception", "First Dance", "Candid Moments"],
  },
  {
    icon: Briefcase,
    title: "Corporate Event",
    description: "Professional imagery for business functions",
    startingPrice: "$600",
    packageRecommendation: "Professional",
    features: ["Conference Coverage", "Award Ceremonies", "Team Photos", "Branding Shots"],
  },
  {
    icon: PartyPopper,
    title: "Birthday / Anniversary",
    description: "Memorable photos of milestone celebrations",
    startingPrice: "$350",
    packageRecommendation: "Essential or Professional",
    features: ["Cake Cutting", "Guest Interactions", "Decor Details", "Group Photos"],
  },
  {
    icon: GraduationCap,
    title: "Graduation",
    description: "Celebrate academic achievements in style",
    startingPrice: "$350",
    packageRecommendation: "Essential or Professional",
    features: ["Ceremony Walk", "Portrait Session", "Family Photos", "Cap & Gown Shots"],
  },
  {
    icon: Users,
    title: "Family Portrait",
    description: "Beautiful family memories to treasure forever",
    startingPrice: "$300",
    packageRecommendation: "Essential",
    features: ["Group Poses", "Individual Portraits", "Outdoor/Nature", "Candid Interactions"],
  },
  {
    icon: Camera,
    title: "Headshot / Personal Branding",
    description: "Professional images for your personal brand",
    startingPrice: "$250",
    packageRecommendation: "Essential",
    features: ["Studio or Outdoor", "Multiple Outfits", "Different Backgrounds", "Professional Retouching"],
  },
  {
    icon: Church,
    title: "Religious Ceremony",
    description: "Respectful coverage of faith-based events",
    startingPrice: "$400",
    packageRecommendation: "Professional",
    features: ["Ceremony Coverage", "Congregation Shots", "Detail Photography", "Respectful Approach"],
  },
  {
    icon: Sparkles,
    title: "Maternity / Newborn",
    description: "Precious moments of new beginnings",
    startingPrice: "$300",
    packageRecommendation: "Essential or Professional",
    features: ["Indoor/Outdoor", "Partner/Family Included", "Props Available", "Gentle Posing Guidance"],
  },
];

/* ==========================================
   PHOTOGRAPHY STYLES
========================================== */

const photoStyles = [
  { name: "Classic / Traditional", icon: Camera, description: "Timeless posed portraits and group shots" },
  { name: "Photojournalistic", icon: Image, description: "Candid, documentary-style storytelling" },
  { name: "Fine Art", icon: Gem, description: "Artistic, creative compositions with dramatic lighting" },
  { name: "Editorial", icon: Monitor, description: "Magazine-style, fashion-forward imagery" },
  { name: "Natural Light", icon: Sparkles, description: "Soft, romantic photos using natural light" },
  { name: "Dramatic / Moody", icon: Flashlight, description: "Bold shadows and dramatic contrast" },
  { name: "Drone / Aerial", icon: Camera, description: "Stunning aerial perspectives" },
  { name: "Black & White", icon: Image, description: "Timeless monochrome artistry" },
];

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Extra Hour Coverage", price: "$150/hour", icon: Clock, description: "Additional photography beyond package hours" },
  { name: "Second Shooter", price: "$300", icon: Users, description: "Additional photographer for more angles and coverage" },
  { name: "Drone Photography", price: "$250", icon: Camera, description: "Aerial photos and video clips of your event" },
  { name: "Premium Photo Album", price: "$200", icon: Album, description: "Custom leather-bound album with 20 pages" },
  { name: "Extra Prints (50)", price: "$100", icon: Printer, description: "Additional 50 premium prints (4x6 or 5x7)" },
  { name: "Large Canvas Print", price: "$150", icon: Image, description: "24x36 gallery-wrapped canvas print" },
  { name: "Same-Day Slideshow", price: "$200", icon: Monitor, description: "Photos displayed during your event in real-time" },
  { name: "Rush Delivery (48hr)", price: "$150", icon: Clock, description: "Expedited editing and delivery of your gallery" },
  { name: "Engagement Shoot", price: "$250", icon: Heart, description: "Separate pre-event photoshoot session" },
  { name: "Extended Travel", price: "$1.50/mile", icon: Car, description: "For events beyond package mileage limit" },
  { name: "Copyright Release", price: "$100", icon: Share2, description: "Full commercial usage rights for your photos" },
  { name: "Additional Location", price: "$75/location", icon: MapPin, description: "Extra photo location beyond package limit" },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function PhotographyPricingPage() {
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
  const [selectedStyles, setSelectedStyles] = useState([]);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
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
    setSelectedStyles([]);
    setTotalPrice(photoPackages[pkg]?.basePrice || 0);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      guestCount: "",
      package: photoPackages[pkg]?.title || "",
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

  const handleStyleToggle = (style) => {
    setSelectedStyles(prev => {
      const isSelected = prev.includes(style);
      if (isSelected) return prev.filter(s => s !== style);
      return [...prev, style];
    });
  };

  useEffect(() => {
    if (selectedPackage) {
      const basePrice = photoPackages[selectedPackage]?.basePrice || 0;
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
      const generatedId = `PH-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        serviceType: "Photography Services",
        category: "Photography",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package,
        hoursIncluded: photoPackages[selectedPackage]?.hoursIncluded,
        photosIncluded: photoPackages[selectedPackage]?.photosIncluded,
        eventType: bookingForm.eventType,
        eventDate: bookingForm.eventDate,
        eventTime: bookingForm.eventTime,
        eventLocation: bookingForm.eventLocation,
        guestCount: bookingForm.guestCount,
        photoStyles: selectedStyles,
        addOns: selectedAddOns,
        budget: totalPrice,
        basePrice: photoPackages[selectedPackage]?.basePrice || 0,
        message: bookingForm.message,
        description: `PHOTOGRAPHY BOOKING: ${bookingForm.package}\nHours: ${photoPackages[selectedPackage]?.hoursIncluded}\nPhotos: ${photoPackages[selectedPackage]?.photosIncluded}+\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.eventDate}\nTime: ${bookingForm.eventTime}\nLocation: ${bookingForm.eventLocation}\nGuests: ${bookingForm.guestCount}\nStyles: ${selectedStyles.join(", ") || "Not specified"}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading photography packages...</p>
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
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-700">
              Photography Services
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Professional Photography{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Capturing your most precious moments with artistry and precision. From intimate portraits
            to grand celebrations, we create timeless images you'll treasure forever.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {Object.entries(photoPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-purple-500 ring-2 ring-purple-100" : "border-gray-200"
              } ${pkg.bestValue ? "border-pink-500 ring-2 ring-pink-100" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
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

              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Up to {pkg.hoursIncluded} Hours</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">{pkg.photosIncluded}+ Edited Photos</span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                <span className="text-gray-500"> starting</span>
              </div>

              {/* Expandable Features */}
              <ul className="space-y-2 mb-6">
                {(expandedPackages[key] ? pkg.features : pkg.features.slice(0, 5)).map((feature, i) => (
                  <motion.li key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    {feature}
                  </motion.li>
                ))}
                {pkg.features.length > 5 && (
                  <li>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedPackages(prev => ({ ...prev, [key]: !prev[key] })); }} className="text-xs text-purple-600 pl-6 font-medium hover:text-purple-800 hover:underline transition-colors flex items-center gap-1">
                      {expandedPackages[key] ? (<>Show Less <span className="text-lg leading-none">−</span></>) : (<>+ {pkg.features.length - 5} More Features <span className="text-lg leading-none">+</span></>)}
                    </button>
                  </li>
                )}
              </ul>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Best For:</p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.bestFor.map((item, i) => (
                    <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{item}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => openBookingModal(key)} className="w-full rounded-xl bg-purple-500 text-white py-3 font-semibold hover:bg-purple-600 transition-all shadow-md">
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Event Types */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Events We <span className="text-purple-600">Capture</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Professional photography for every occasion</p>
          <div className="grid md:grid-cols-4 gap-4">
            {eventTypes.map((event, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all">
                <div className="rounded-xl bg-purple-50 p-2.5 inline-flex mb-3 text-purple-600"><event.icon className="w-6 h-6" /></div>
                <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{event.description}</p>
                <p className="text-sm font-semibold text-purple-600 mb-2">From {event.startingPrice}</p>
                <p className="text-xs text-gray-400 mb-3">Recommended: {event.packageRecommendation}</p>
                <ul className="space-y-1">
                  {event.features.slice(0, 2).map((f, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-purple-500" /> {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photography Styles */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Photography <span className="text-purple-600">Styles</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Choose the aesthetic that matches your vision</p>
          <div className="grid md:grid-cols-4 gap-4">
            {photoStyles.map((style, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="rounded-xl bg-purple-50 p-3 inline-flex mb-3 text-purple-600"><style.icon className="w-6 h-6" /></div>
                <h3 className="font-bold text-gray-900 mb-1">{style.name}</h3>
                <p className="text-xs text-gray-500">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add-Ons */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add-On Services</h2>
          <p className="text-gray-500 text-center mb-8">Enhance your photography package with these options</p>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-600 shrink-0"><addon.icon className="w-6 h-6" /></div>
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

        {/* What's Included */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Every Package Includes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Car className="w-6 h-6" />, title: "Transportation", desc: "Within package mileage" },
              { icon: <Image className="w-6 h-6" />, title: "Edited Photos", desc: "Professionally retouched" },
              { icon: <Download className="w-6 h-6" />, title: "Digital Delivery", desc: "Online gallery access" },
              { icon: <Shield className="w-6 h-6" />, title: "Backup Gear", desc: "Emergency equipment" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="rounded-xl bg-purple-50 p-3 inline-flex mb-3 text-purple-600">{item.icon}</div>
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
            {serviceCategories.slice(0, 8).map((category) => (
              <button key={category.id} onClick={() => router.push(`/services/${category.slug}`)} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm">
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-purple-500" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-purple-500" /><span>Insured & Professional</span></div>
            <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-purple-500" /><span>Pro Equipment</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /><span>100+ Events Shot</span></div>
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
                    <h3 className="text-xl font-bold text-gray-900">Book Photography Service</h3>
                    <p className="text-sm text-gray-500">{photoPackages[selectedPackage].title} - {photoPackages[selectedPackage].hoursIncluded} Hours | {photoPackages[selectedPackage].photosIncluded}+ Photos</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-purple-50 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Base Package:</span><span className="font-semibold">${photoPackages[selectedPackage].basePrice}</span></div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-purple-200 pt-2 mb-2">
                      {selectedAddOns.map((addon, i) => (<div key={i} className="flex justify-between items-center text-sm"><span className="text-gray-600">+ {addon.name}</span><span className="text-purple-600">{addon.price}</span></div>))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-purple-200"><span className="font-semibold text-gray-900">Total:</span><span className="text-xl font-bold text-purple-600">${totalPrice}</span></div>
                </div>

                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={bookingForm.fullName} onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }} className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`} placeholder="John Doe" />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`} placeholder="john@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }} className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`} placeholder="(555) 123-4567" />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type *</label>
                    <select value={bookingForm.eventType} onChange={(e) => { setBookingForm({ ...bookingForm, eventType: e.target.value }); if (formErrors.eventType) setFormErrors({ ...formErrors, eventType: "" }); }} className={`w-full rounded-xl border ${formErrors.eventType ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`}>
                      <option value="">Select event type</option>
                      {eventTypes.map((et) => (<option key={et.title} value={et.title}>{et.title}</option>))}
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.eventType && <p className="text-red-500 text-xs mt-1">{formErrors.eventType}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Date *</label>
                      <input type="date" value={bookingForm.eventDate} onChange={(e) => { setBookingForm({ ...bookingForm, eventDate: e.target.value }); if (formErrors.eventDate) setFormErrors({ ...formErrors, eventDate: "" }); }} className={`w-full rounded-xl border ${formErrors.eventDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`} />
                      {formErrors.eventDate && <p className="text-red-500 text-xs mt-1">{formErrors.eventDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                      <input type="time" value={bookingForm.eventTime} onChange={(e) => setBookingForm({ ...bookingForm, eventTime: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Guest Count</label>
                      <input type="number" value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 outline-none" placeholder="100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Location *</label>
                    <input type="text" value={bookingForm.eventLocation} onChange={(e) => { setBookingForm({ ...bookingForm, eventLocation: e.target.value }); if (formErrors.eventLocation) setFormErrors({ ...formErrors, eventLocation: "" }); }} className={`w-full rounded-xl border ${formErrors.eventLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-purple-500 outline-none`} placeholder="Venue name or address" />
                    {formErrors.eventLocation && <p className="text-red-500 text-xs mt-1">{formErrors.eventLocation}</p>}
                  </div>

                  {/* Photography Styles Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Preferred Photography Style</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {photoStyles.map((style) => (
                        <button key={style.name} type="button" onClick={() => handleStyleToggle(style.name)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedStyles.includes(style.name) ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add-On Services */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Add-On Services (Optional)</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {addOns.map((addon) => {
                        const isChecked = selectedAddOns.some(a => a.name === addon.name);
                        return (
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-900">{addon.name}</span><span className="text-sm font-bold text-purple-600">{addon.price}</span></div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Message</label>
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-500 outline-none resize-none" placeholder="Specific shots you want, special requests..." />
                  </div>

                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-purple-500 text-white py-4 font-semibold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
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
                <div className="rounded-full bg-purple-100 p-4 inline-flex mb-6"><CheckCircle2 className="w-12 h-12 text-purple-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your event details and contact you within 24 hours.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button onClick={() => { setSuccess(false); setShowBookingModal(false); }} className="w-full rounded-xl bg-purple-500 text-white py-3 font-semibold hover:bg-purple-600 transition-all">Back to Packages</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}