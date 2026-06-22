"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
  useRef,
} from "react";

/* ==========================================
   NEXT
========================================== */

import {
  useParams,
} from "next/navigation";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import Link from "next/link";

import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  Sparkles,
  Music,
  Mic,
  Camera,
  Wifi,
  Briefcase,
  Heart,
  Quote,
  Send,
} from "lucide-react";

import ServiceCategoryHero from "@/components/service/ServiceCategoryHero";
import BookingModal from "@/components/home/modals/BookingModal";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


/* ==========================================
   PAGE
========================================== */

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     BOOKING MODAL
  ========================================== */

  const [selectedService, setSelectedService] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);

  /* ==========================================
     LOAD DATA & SCROLL TO TOP FIX
  ========================================== */

  useEffect(() => {
    if (!slug) return;
    
    // FIX: Prevent browser from restoring previous scroll position
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      setLoading(true);

      const categoryQuery = query(
        collection(db, "serviceCategories"),
        where("slug", "==", slug),
        where("active", "==", true)
      );

      const categorySnapshot = await getDocs(categoryQuery);

      if (categorySnapshot.empty) {
        setLoading(false);
        return;
      }

      const categoryDoc = categorySnapshot.docs[0];
      const categoryData = {
        id: categoryDoc.id,
        ...categoryDoc.data(),
      };

      setCategory(categoryData);

      const servicesQuery = query(
        collection(db, "services"),
        where("active", "==", true),
        where("category", "==", categoryData.name),
        orderBy("featured", "desc"),
        orderBy("createdAt", "desc")
      );

      const servicesSnapshot = await getDocs(servicesQuery);
      const serviceItems = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setServices(serviceItems);

      // FIX: Force window to scroll to top right after data loads
      // Use setTimeout to ensure DOM is fully rendered first
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant" // Use "smooth" if you want a nice scroll-up animation
        });
      }, 50);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-[400px] bg-gradient-to-br from-zinc-900 to-black animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[320px] rounded-2xl bg-white/[0.05] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================
     CATEGORY NOT FOUND
  ========================================== */

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-zinc-400 mb-8">The service category you're looking for doesn't exist.</p>
           <Link 
              href="/" 
              scroll={false}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
                setTimeout(() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="inline-flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-dark transition"
            >
              <ArrowLeft size={18} />
              Back to Services
            </Link>
        </motion.div>
      </div>
    );
  }

  /* ==========================================
     PAGE RENDER
  ========================================== */

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]"
        />
      </div>

      {/* =====================================
          HERO
      ===================================== */}

      <ServiceCategoryHero
        title={category.name}
        description={category.description}
        image={category.image}
        serviceCount={services.length}
      />

      {/* =====================================
          SERVICES SECTION
      ===================================== */}

      <section ref={sectionRef} className="relative z-30 bg-black pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header - Fade only, no movement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12 pt-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 backdrop-blur-sm mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Choose Your
              <span className="text-gold"> Experience</span>
            </h2>
          </motion.div>

          {/* Services Grid - NO entrance animations */}
          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">No Services Yet</h3>
              <p className="text-zinc-400">This category is being curated. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 ease-out hover:scale-105 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/25"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Star "Current" Badge - Shows on hover */}
                  <div className={`absolute top-3 right-3 z-30 transition-all duration-300 ${
                    hoveredIndex === index 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-75"
                  }`}>
                    <div className="flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
                      <Star className="w-3 h-3 fill-black" />
                      Current
                    </div>
                  </div>

                  {/* Featured Badge - Always visible if featured */}
                  {service.featured && hoveredIndex !== index && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-black">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.image || "/images/placeholder-service.jpg"}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 group-hover:bg-black/40" />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-gold/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 transition-all duration-500 group-hover:translate-y-[-2px]">
                    {/* Price Badge */}
                    <div className="mb-2">
                      <span className="inline-block rounded-full bg-gold/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-gold border border-gold/30 transition-all duration-300 group-hover:bg-gold/30">
                        {service.priceText || "Contact for pricing"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-1 transition-all duration-300 group-hover:text-gold line-clamp-1">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-2 transition-all duration-300 group-hover:text-zinc-300">
                      {service.description || "Professional service tailored to your needs."}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setSelectedService(service.name);
                          setBookingModal(true);
                        }}
                        className="flex-1 rounded-xl bg-gold py-2 text-sm font-bold text-black transition-all duration-300 hover:bg-gold-dark group-hover:scale-[1.02] flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book
                      </button>

                      <Link 
                        href={
                          service.name === "Custom Business Card" 
                            ? "/pricing/business-card" 
                            : category.slug === "website-development"
                              ? "/pricing/website-development"
                              : service.name === "MC Services"
                              ? "/pricing/mc-service"
                              : service.name === "DJ Music"
                              ? "/pricing/dj"
                              : service.name === "Ushers"
                              ? "/pricing/usher"
                              : service.name === "Photography"
                              ? "/pricing/photography"
                              : service.name === "Wedding Coordination"
                              ? "/pricing/wedding-coordination"
                              : `/client?service=${encodeURIComponent(service.name)}`
                        } 
                        className="flex-1"
                      >
                        <button
                          className="w-full rounded-xl border border-white/40 bg-white/5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-gold/50 group-hover:scale-[1.02] flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Request Service
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Row - Fade only */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <span className="text-zinc-400 text-sm">{services.length} Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-gold" />
              </div>
              <span className="text-zinc-400 text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-gold" />
              </div>
              <span className="text-zinc-400 text-sm">100% Guaranteed</span>
            </div>
          </motion.div>

          {/* Trust Banner - Fade only */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent p-5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">Free Consultation</p>
                <h3 className="text-base font-semibold text-white">Not sure which service fits your needs or looking for a bundle?</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedService("General Consultation");
                  setBookingModal(true);
                }}
                className="px-5 py-2 bg-gold text-black font-semibold rounded-xl hover:bg-gold-dark transition-all duration-300 text-sm hover:scale-105"
              >
                Book Free Consultation →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================
          BOOKING MODAL
      ===================================== */}

      <BookingModal
        bookingModal={bookingModal}
        setBookingModal={setBookingModal}
        selectedService={selectedService}
      />
    </div>
  );
}