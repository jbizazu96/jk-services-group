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
  Video,
  Calendar,
  Car,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  PartyPopper,
  Gem,
  Camera,
  Film,
  Clapperboard,
  Monitor,
  Music,
  Users,
  MapPin,
  HardDrive,
  Tv,
  Disc,
  Smartphone,
} from "lucide-react";

/* ==========================================
   VIDEOGRAPHY PACKAGES
========================================== */

const videoPackages = {
  essential: {
    title: "Essential Film",
    subtitle: "Perfect for Intimate Moments",
    description: "Professional videography for smaller events and short highlight films",
    basePrice: 500,
    hoursIncluded: 3,
    deliverables: "3-5 Minute Highlight Film",
    popular: false,
    bestValue: false,
    isNew: false,
    features: [
      "Up to 3 Hours Videography Coverage",
      "Professional Videographer with 4K Camera",
      "3-5 Minute Cinematic Highlight Film",
      "Professional Color Grading",
      "Licensed Background Music",
      "Digital Delivery via Online Gallery",
      "1 Camera Setup",
      "Basic Audio Capture (On-Camera Mic)",
      "Pre-Event Consultation (1 Call)",
      "Film Delivery Within 14-21 Days",
      "Local Transportation Included (within 25 miles)",
    ],
    bestFor: ["Small Birthdays", "Maternity Shoots", "Baby Showers", "Engagement Parties", "Intimate Gatherings"],
  },
  professional: {
    title: "Professional Film",
    subtitle: "Full Event Cinematic Coverage",
    description: "Comprehensive videography for medium to large events with full production",
    basePrice: 1200,
    hoursIncluded: 6,
    deliverables: "8-12 Minute Cinematic Film",
    popular: true,
    bestValue: false,
    isNew: false,
    features: [
      "Up to 6 Hours Videography Coverage",
      "Professional Videographer + Assistant",
      "8-10 Minute Cinematic Feature Film",
      "Separate Ceremony/Key Moments Full Edit",
      "Professional Color Grading & Audio",
      "Licensed Background Music Library",
      "Digital Delivery + USB Drive",
      "2-4 Camera Setup (Multi-Angle)",
      "Drone Footage Included (Weather Permitting)",
      "Highlight Reel for Social Media (60 sec)",
      "Pre-Event Consultation (2 Meetings)",
      "Full Film Delivery Within 10-14 Days",
      "Transportation Included (within 100 miles)",
      "Backup Equipment Available",
    ],
    bestFor: ["Weddings", "Corporate Events", "Anniversaries", "Graduations", "Religious Ceremonies"],
  },
  premium: {
    title: "Premium Film",
    subtitle: "Luxury Cinematic Experience",
    description: "All-inclusive premium videography for grand celebrations with full production",
    basePrice: 2500,
    hoursIncluded: 10,
    deliverables: "15-20 Minute Feature Film",
    popular: false,
    bestValue: true,
    isNew: false,
    features: [
      "Up to 10 Hours Videography Coverage (Flexible)",
      "Lead Videographer + Second Shooter + Assistant",
      "10-20 Minute Cinematic Feature Film",
      "Full Ceremony/Key Events Uncut Edit",
      "Professional Color Grading & Audio",
      "Premium Licensed Music Selection",
      "Digital Delivery",
      "2-4 Camera Setup (Multi-Angle Coverage)",
      "Professional Audio Kit (Lavalier, Boom, Recorder)",
      "Drone Footage Included (FAA Certified Pilot)",
      "Same-Day Edit Available (On-Site Editing)",
      "Raw Footage Option Available",
      "Multiple Pre-Event Consultations",
      "Rehearsal Attendance",
      "Sneak Peek Within 24 Hours",
      "Full Film Delivery Within 7-10 Days",
      "Transportation Included (within 100 miles)",
      "Backup Equipment Guaranteed",
    ],
    bestFor: ["Grand Weddings", "Luxury Galas", "Destination Events", "Multi-Day Events", "Celebrity Events"],
  },
  musicVideo: {
    title: "Music Video Production",
    subtitle: "Artist & Performance Visuals",
    description: "Full-scale music video production from concept to final cut for artists and performers",
    basePrice: 3000,
    hoursIncluded: 12,
    deliverables: "Full Music Video (3-5 min)",
    popular: false,
    bestValue: false,
    isNew: true,
    features: [
      "Full Day Production (Up to 12 Hours)",
      "Full Music Video (3-5 Minutes)",
      "Behind the Scenes Documentary (5-10 min)",
      "3 Social Media Shorts (Instagram/TikTok/YouTube)",
      "Concept Development & Storyboarding",
      "Location Scouting (Up to 3 Locations)",
      "Professional Lighting Kit (Studio & Outdoor)",
      "Multi-Camera Setup (2-4 Cinema Cameras)",
      "Professional Audio Recording & Sync",
      "Drone Footage Included",
      "Professional Color Grading (Cinematic Look)",
      "Multiple Revision Rounds (Up to 3)",
      "Digital Delivery in 4K + HD Versions",
      "Custom Thumbnail & Cover Art Design",
      "Transportation Included (within 100 miles)",
    ],
    bestFor: ["Music Artists", "Bands", "Rappers", "Singers", "DJs", "Record Labels", "Music Promo", "Album Launch"],
  },
};

/* ==========================================
   EVENT TYPES
========================================== */

const eventTypes = [
  {
    title: "Wedding",
    description: "Cinematic storytelling of your most special day",
    startingPrice: "$800",
    packageRecommendation: "Professional or Premium",
    features: ["Getting Ready", "Ceremony", "Reception", "First Dance", "Guest Interviews"],
  },
  {
    title: "Corporate Event",
    description: "Professional video coverage for business functions",
    startingPrice: "$900",
    packageRecommendation: "Professional",
    features: ["Conference Coverage", "Speaker Recordings", "Brand Highlights", "Training Videos"],
  },
  {
    title: "Birthday / Anniversary",
    description: "Memorable films of milestone celebrations",
    startingPrice: "$500",
    packageRecommendation: "Essential or Professional",
    features: ["Cake Cutting", "Toast Speeches", "Guest Messages", "Dance Floor Moments"],
  },
  {
    title: "Graduation",
    description: "Celebrate academic achievements on film",
    startingPrice: "$500",
    packageRecommendation: "Essential or Professional",
    features: ["Ceremony Walk", "Portrait Session", "Family Interviews", "Celebration Highlights"],
  },
  {
    title: "Religious Ceremony",
    description: "Respectful video coverage of faith-based events",
    startingPrice: "$600",
    packageRecommendation: "Professional",
    features: ["Full Ceremony", "Congregation Shots", "Detail Footage", "Respectful Approach"],
  },
  {
    title: "Gala / Fundraiser",
    description: "Elegant video production for formal events",
    startingPrice: "$1000",
    packageRecommendation: "Professional or Premium",
    features: ["Red Carpet Arrivals", "Program Coverage", "Donor Spotlights", "Event Highlights"],
  },
  {
    title: "Music Video Production",
    description: "Professional music video from concept to screen",
    startingPrice: "$2,500",
    packageRecommendation: "Music Video Production",
    features: ["Story Development", "Multi-Location Shoot", "VFX & Color Grading", "Distribution Ready"],
  },
  {
    title: "Real Estate / Property",
    description: "Professional property showcase videos",
    startingPrice: "$400",
    packageRecommendation: "Essential or Professional",
    features: ["Interior Walkthrough", "Exterior Aerials", "Neighborhood Highlights", "Agent Introduction"],
  },
];

/* ==========================================
   VIDEO STYLES
========================================== */

const videoStyles = [
  { name: "Cinematic", description: "Movie-like with dramatic compositions and color grading" },
  { name: "Documentary", description: "Natural, storytelling approach capturing real moments" },
  { name: "Vintage / Retro", description: "Old-school film look with warm tones and grain" },
  { name: "Modern / Clean", description: "Bright, crisp, contemporary aesthetic" },
  { name: "Romantic / Soft", description: "Dreamy, soft focus with pastel color palette" },
  { name: "Bold / High Contrast", description: "Dramatic shadows and vibrant colors" },
  { name: "Aerial / Drone Focus", description: "Emphasis on stunning aerial perspectives" },
  { name: "Slow Motion", description: "Artistic slow-motion emphasis on key moments" },
];

/* ==========================================
   ADD-ON SERVICES
========================================== */

const addOns = [
  { name: "Extra Hour Coverage", price: "$200/hour", description: "Additional videography beyond package hours" },
  { name: "Second Shooter", price: "$400", description: "Additional videographer for more angles" },
  { name: "Drone Footage Package", price: "$300", description: "Extended aerial footage with FAA certified pilot" },
  { name: "Same-Day Edit", price: "$500", description: "On-site editing for same-day highlight playback" },
  { name: "Raw Footage Delivery", price: "$250", description: "All unedited footage on hard drive" },
  { name: "Extra Revisions", price: "$100/revision", description: "Additional editing rounds beyond included revisions" },
  { name: "Social Media Reels (3)", price: "$200", description: "Three 30-60 second vertical reels for Instagram/TikTok" },
  { name: "Teaser Trailer", price: "$150", description: "30-second preview trailer for social media" },
  { name: "Blu-ray/DVD Package", price: "$100", description: "5 custom Blu-ray/DVD copies with menu and artwork" },
  { name: "Extended Travel", price: "$2/mile", description: "For events beyond package mileage limit" },
  { name: "Live Streaming Setup", price: "$400", description: "Professional multi-camera live stream of your event" },
  { name: "Photo + Video Combo", price: "$600", description: "Add photography coverage (100 edited photos)" },
  { name: "Extended Story Concept", price: "$500", description: "Full narrative development with professional storyboard artist" },
  { name: "Wardrobe Stylist", price: "$300", description: "Professional stylist for artist and talent wardrobe" },
  { name: "Makeup & Hair Artist", price: "$350", description: "Professional MUA for on-camera talent" },
  { name: "Extra Location", price: "$200/location", description: "Additional filming location beyond included locations" },
  { name: "Special Effects (VFX)", price: "$500+", description: "Advanced visual effects and compositing" },
  { name: "Green Screen Studio", price: "$400", description: "Professional green screen studio rental with lighting" },
  { name: "Dancer/Talent Casting", price: "$600+", description: "Professional casting and booking of dancers/extras" },
  { name: "Album Cover Photos", price: "$250", description: "Professional photography during the shoot for album art" },
];

/* ==========================================
   EQUIPMENT HIGHLIGHTS
========================================== */

const equipmentHighlights = [
  { name: "4K Cinema Cameras", description: "Sony A7SIII, Canon R5, Blackmagic Cinema" },
  { name: "Professional Lenses", description: "Prime, Zoom, Anamorphic lens selection" },
  { name: "Audio Equipment", description: "Sennheiser, Rode, Zoom professional audio" },
  { name: "Stabilization", description: "DJI Ronin gimbals, Steadicam, sliders" },
  { name: "Drone", description: "DJI Mavic 3 / Air 2S (FAA Certified)" },
  { name: "Lighting", description: "Aputure, Godox professional lighting kit" },
  { name: "Green Screen", description: "Professional chroma key studio setup" },
  { name: "Editing Suite", description: "DaVinci Resolve, Premiere Pro, After Effects" },
];

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function VideographyPricingPage() {
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
    setTotalPrice(videoPackages[pkg]?.basePrice || 0);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      guestCount: "",
      package: videoPackages[pkg]?.title || "",
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
      const basePrice = videoPackages[selectedPackage]?.basePrice || 0;
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
      const generatedId = `VID-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      await addDoc(collection(db, "serviceRequests"), {
        requestId: generatedId,
        customerName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        serviceType: "Videography Services",
        category: "Videography",
        status: "pending",
        source: "pricing",
        requestType: "booking",
        package: bookingForm.package,
        hoursIncluded: videoPackages[selectedPackage]?.hoursIncluded,
        deliverables: videoPackages[selectedPackage]?.deliverables,
        eventType: bookingForm.eventType,
        eventDate: bookingForm.eventDate,
        eventTime: bookingForm.eventTime,
        eventLocation: bookingForm.eventLocation,
        guestCount: bookingForm.guestCount,
        videoStyles: selectedStyles,
        addOns: selectedAddOns,
        budget: totalPrice,
        basePrice: videoPackages[selectedPackage]?.basePrice || 0,
        message: bookingForm.message,
        description: `VIDEOGRAPHY BOOKING: ${bookingForm.package}\nHours: ${videoPackages[selectedPackage]?.hoursIncluded}\nDeliverables: ${videoPackages[selectedPackage]?.deliverables}\nEvent: ${bookingForm.eventType}\nDate: ${bookingForm.eventDate}\nTime: ${bookingForm.eventTime}\nLocation: ${bookingForm.eventLocation}\nGuests: ${bookingForm.guestCount}\nStyles: ${selectedStyles.join(", ") || "Not specified"}\nAdd-Ons: ${selectedAddOns.map(a => a.name).join(", ") || "None"}\nTotal Price: $${totalPrice}\n\nMessage: ${bookingForm.message}`,
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
    if (name.includes("Shooter")) return <Users className="w-4 h-4" />;
    if (name.includes("Drone")) return <Camera className="w-4 h-4" />;
    if (name.includes("Same-Day")) return <Monitor className="w-4 h-4" />;
    if (name.includes("Raw")) return <HardDrive className="w-4 h-4" />;
    if (name.includes("Revision")) return <Film className="w-4 h-4" />;
    if (name.includes("Social")) return <Smartphone className="w-4 h-4" />;
    if (name.includes("Teaser")) return <Tv className="w-4 h-4" />;
    if (name.includes("Blu-ray") || name.includes("DVD")) return <Disc className="w-4 h-4" />;
    if (name.includes("Travel")) return <Car className="w-4 h-4" />;
    if (name.includes("Streaming")) return <Tv className="w-4 h-4" />;
    if (name.includes("Combo") || name.includes("Album")) return <Camera className="w-4 h-4" />;
    if (name.includes("Story")) return <Film className="w-4 h-4" />;
    if (name.includes("Wardrobe")) return <Shield className="w-4 h-4" />;
    if (name.includes("Makeup") || name.includes("Hair")) return <Sparkles className="w-4 h-4" />;
    if (name.includes("Location")) return <MapPin className="w-4 h-4" />;
    if (name.includes("Effects") || name.includes("VFX")) return <Monitor className="w-4 h-4" />;
    if (name.includes("Green Screen")) return <Tv className="w-4 h-4" />;
    if (name.includes("Casting") || name.includes("Dancer")) return <Users className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading videography packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-violet-700">
              Videography & Music Video Services
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Professional Videography{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transforming your precious moments into cinematic masterpieces. From intimate gatherings
            to grand celebrations and music videos, we create films that tell your unique story.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {Object.entries(videoPackages).map(([key, pkg]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl bg-white border p-6 shadow-xl transition-all hover:shadow-2xl ${
                pkg.popular ? "border-violet-500 ring-2 ring-violet-100" : 
                pkg.bestValue ? "border-purple-500 ring-2 ring-purple-100" :
                pkg.isNew ? "border-amber-400 ring-2 ring-amber-100" : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </div>
              )}
              {pkg.isNew && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  ✦ NEW SERVICE
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-xl p-2.5 ${pkg.isNew ? "bg-amber-50" : "bg-violet-50"}`}>
                  {key === "essential" && <Video className={`w-6 h-6 ${pkg.isNew ? "text-amber-600" : "text-violet-600"}`} />}
                  {key === "professional" && <Film className="w-6 h-6 text-violet-600" />}
                  {key === "premium" && <Clapperboard className="w-6 h-6 text-violet-600" />}
                  {key === "musicVideo" && <Music className="w-6 h-6 text-amber-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

              <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-4 h-4 ${pkg.isNew ? "text-amber-600" : "text-violet-600"}`} />
                <span className="text-sm font-semibold text-gray-700">Up to {pkg.hoursIncluded} Hours</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Film className={`w-4 h-4 ${pkg.isNew ? "text-amber-600" : "text-violet-600"}`} />
                <span className="text-sm font-semibold text-gray-700">{pkg.deliverables}</span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                <span className="text-gray-500"> starting</span>
              </div>

              {/* Expandable Features */}
              <ul className="space-y-2 mb-6">
                {(expandedPackages[key] ? pkg.features : pkg.features.slice(0, 5)).map((feature, i) => (
                  <motion.li key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.isNew ? "text-amber-600" : "text-violet-600"}`} />
                    {feature}
                  </motion.li>
                ))}
                {pkg.features.length > 5 && (
                  <li>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedPackages(prev => ({ ...prev, [key]: !prev[key] })); }} className={`text-xs pl-6 font-medium hover:underline transition-colors flex items-center gap-1 ${pkg.isNew ? "text-amber-600 hover:text-amber-800" : "text-violet-600 hover:text-violet-800"}`}>
                      {expandedPackages[key] ? (<>Show Less <span className="text-lg leading-none">−</span></>) : (<>+ {pkg.features.length - 5} More Features <span className="text-lg leading-none">+</span></>)}
                    </button>
                  </li>
                )}
              </ul>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Best For:</p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.bestFor.map((item, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${pkg.isNew ? "bg-amber-50 text-amber-700" : "bg-violet-50 text-violet-700"}`}>{item}</span>
                  ))}
                </div>
              </div>

              <button onClick={() => openBookingModal(key)} className={`w-full rounded-xl py-3 font-semibold transition-all shadow-md text-white ${pkg.isNew ? "bg-amber-500 hover:bg-amber-600" : "bg-violet-500 hover:bg-violet-600"}`}>
                Book This Package
              </button>
            </motion.div>
          ))}
        </div>

        {/* Event Types */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Events We <span className="text-violet-600">Film</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Professional videography for every occasion</p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {eventTypes.map((event, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all">
                <div className="rounded-xl bg-violet-50 p-2.5 inline-flex mb-3 text-violet-600">
                  {i === 0 && <Heart className="w-5 h-5" />}
                  {i === 1 && <Briefcase className="w-5 h-5" />}
                  {i === 2 && <PartyPopper className="w-5 h-5" />}
                  {i === 3 && <GraduationCap className="w-5 h-5" />}
                  {i === 4 && <Church className="w-5 h-5" />}
                  {i === 5 && <Star className="w-5 h-5" />}
                  {i === 6 && <Music className="w-5 h-5" />}
                  {i === 7 && <Monitor className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{event.description}</p>
                <p className="text-sm font-semibold text-violet-600 mb-2">From {event.startingPrice}</p>
                <p className="text-xs text-gray-400 mb-3">Recommended: {event.packageRecommendation}</p>
                <ul className="space-y-1">
                  {event.features.slice(0, 2).map((f, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-violet-500" /> {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Styles */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Film <span className="text-violet-600">Styles</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Choose the cinematic aesthetic that matches your vision</p>
          <div className="grid md:grid-cols-4 gap-4">
            {videoStyles.map((style, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="rounded-xl bg-violet-50 p-3 inline-flex mb-3 text-violet-600">
                  {i === 0 && <Film className="w-5 h-5" />}
                  {i === 1 && <Video className="w-5 h-5" />}
                  {i === 2 && <Camera className="w-5 h-5" />}
                  {i === 3 && <Monitor className="w-5 h-5" />}
                  {i === 4 && <Heart className="w-5 h-5" />}
                  {i === 5 && <Sparkles className="w-5 h-5" />}
                  {i === 6 && <Camera className="w-5 h-5" />}
                  {i === 7 && <Clock className="w-5 h-5" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{style.name}</h3>
                <p className="text-xs text-gray-500">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Equipment Highlights */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Professional <span className="text-violet-600">Equipment</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">We use industry-leading gear for stunning results</p>
          <div className="grid md:grid-cols-4 gap-4">
            {equipmentHighlights.map((equip, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-bold text-gray-900 mb-1">{equip.name}</h3>
                <p className="text-xs text-gray-500">{equip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add-Ons */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20 rounded-3xl bg-white border border-gray-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add-On Services</h2>
          <p className="text-gray-500 text-center mb-8">Enhance your videography package with these options</p>
          <div className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                <div className="rounded-lg bg-violet-100 p-2 text-violet-600 shrink-0">
                  {getAddOnIcon(addon.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{addon.name}</h4>
                    <span className="text-xs font-bold text-violet-600">{addon.price}</span>
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
              { title: "Transportation", desc: "Within package mileage" },
              { title: "4K Cinema Cameras", desc: "Professional film equipment" },
              { title: "Color Grading", desc: "Cinematic color correction" },
              { title: "Licensed Music", desc: "Royalty-free soundtrack" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <div className="rounded-xl bg-violet-50 p-3 inline-flex mb-3 text-violet-600">
                  {i === 0 && <Car className="w-6 h-6" />}
                  {i === 1 && <Video className="w-6 h-6" />}
                  {i === 2 && <Monitor className="w-6 h-6" />}
                  {i === 3 && <Music className="w-6 h-6" />}
                </div>
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
              <button key={category.id} onClick={() => router.push(`/services/${category.slug}`)} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-violet-500 hover:text-violet-600 transition-all shadow-sm">
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-violet-500" /><span>5-Star Rated</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-violet-500" /><span>Insured & Professional</span></div>
            <div className="flex items-center gap-2"><Video className="w-4 h-4 text-violet-500" /><span>4K Cinema Gear</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-500" /><span>300+ Films Created</span></div>
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
                    <h3 className="text-xl font-bold text-gray-900">Book Videography Service</h3>
                    <p className="text-sm text-gray-500">{videoPackages[selectedPackage].title} - {videoPackages[selectedPackage].hoursIncluded} Hours</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                {/* Price Summary */}
                <div className="rounded-2xl bg-violet-50 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Base Package:</span><span className="font-semibold">${videoPackages[selectedPackage].basePrice}</span></div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-violet-200 pt-2 mb-2">
                      {selectedAddOns.map((addon, i) => (<div key={i} className="flex justify-between items-center text-sm"><span className="text-gray-600">+ {addon.name}</span><span className="text-violet-600">{addon.price}</span></div>))}
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-violet-200"><span className="font-semibold text-gray-900">Total:</span><span className="text-xl font-bold text-violet-600">${totalPrice}</span></div>
                </div>

                <form onSubmit={handleBookNow} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={bookingForm.fullName} onChange={(e) => { setBookingForm({ ...bookingForm, fullName: e.target.value }); if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" }); }} className={`w-full rounded-xl border ${formErrors.fullName ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`} placeholder="John Doe" />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => { setBookingForm({ ...bookingForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full rounded-xl border ${formErrors.email ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`} placeholder="john@email.com" />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => { setBookingForm({ ...bookingForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }} className={`w-full rounded-xl border ${formErrors.phone ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`} placeholder="(555) 123-4567" />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type *</label>
                    <select value={bookingForm.eventType} onChange={(e) => { setBookingForm({ ...bookingForm, eventType: e.target.value }); if (formErrors.eventType) setFormErrors({ ...formErrors, eventType: "" }); }} className={`w-full rounded-xl border ${formErrors.eventType ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`}>
                      <option value="">Select event type</option>
                      {eventTypes.map((et) => (<option key={et.title} value={et.title}>{et.title}</option>))}
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.eventType && <p className="text-red-500 text-xs mt-1">{formErrors.eventType}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Event Date *</label>
                      <input type="date" value={bookingForm.eventDate} onChange={(e) => { setBookingForm({ ...bookingForm, eventDate: e.target.value }); if (formErrors.eventDate) setFormErrors({ ...formErrors, eventDate: "" }); }} className={`w-full rounded-xl border ${formErrors.eventDate ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`} />
                      {formErrors.eventDate && <p className="text-red-500 text-xs mt-1">{formErrors.eventDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                      <input type="time" value={bookingForm.eventTime} onChange={(e) => setBookingForm({ ...bookingForm, eventTime: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Guest Count</label>
                      <input type="number" value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-500 outline-none" placeholder="100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Location *</label>
                    <input type="text" value={bookingForm.eventLocation} onChange={(e) => { setBookingForm({ ...bookingForm, eventLocation: e.target.value }); if (formErrors.eventLocation) setFormErrors({ ...formErrors, eventLocation: "" }); }} className={`w-full rounded-xl border ${formErrors.eventLocation ? "border-red-400" : "border-gray-200"} px-4 py-3 text-sm focus:border-violet-500 outline-none`} placeholder="Venue name or address" />
                    {formErrors.eventLocation && <p className="text-red-500 text-xs mt-1">{formErrors.eventLocation}</p>}
                  </div>

                  {/* Video Styles Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3">Preferred Film Style</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {videoStyles.map((style) => (
                        <button key={style.name} type="button" onClick={() => handleStyleToggle(style.name)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedStyles.includes(style.name) ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
                          <label key={addon.name} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isChecked ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-300"}`}>
                            <input type="checkbox" checked={isChecked} onChange={() => handleAddOnToggle(addon.name, addon.price)} className="mt-0.5 w-4 h-4 text-violet-600 rounded focus:ring-violet-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-900">{addon.name}</span><span className="text-sm font-bold text-violet-600">{addon.price}</span></div>
                              <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Additional Message</label>
                    <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-violet-500 outline-none resize-none" placeholder="Specific moments to capture, music preferences..." />
                  </div>

                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-violet-500 text-white py-4 font-semibold hover:bg-violet-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
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
                <div className="rounded-full bg-violet-100 p-4 inline-flex mb-6"><CheckCircle2 className="w-12 h-12 text-violet-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">We'll review your event details and contact you within 24 hours.</p>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Reference ID</p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                </div>
                <button onClick={() => { setSuccess(false); setShowBookingModal(false); }} className="w-full rounded-xl bg-violet-500 text-white py-3 font-semibold hover:bg-violet-600 transition-all">Back to Packages</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}