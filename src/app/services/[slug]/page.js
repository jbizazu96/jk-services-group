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

  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     BOOKING MODAL
  ========================================== */

  const [selectedService, setSelectedService] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);

  /* ==========================================
     LOAD DATA
  ========================================== */

  useEffect(() => {
    if (!slug) return;
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-zinc-400 mb-8">The service category you're looking for doesn't exist.</p>
          <Link
            href="/#services"
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
          CURVED TRANSITION
      ===================================== */}

      <div className="relative z-20 -mt-16">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 100L60 90C120 80 240 60 360 55C480 50 600 60 720 65C840 70 960 70 1080 65C1200 60 1320 50 1380 45L1440 40L1440 0L1380 0C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0L0 0V100Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* =====================================
          SERVICES SECTION - SHORTER CARDS
      ===================================== */}

      <section ref={sectionRef} className="relative z-30 bg-black pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
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

          {/* Services Grid - Compact Cards */}
          {services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-2">No Services Yet</h3>
              <p className="text-zinc-400">This category is being curated. Check back soon!</p>
            </motion.div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:border-gold/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Featured Badge */}
                  {service.featured && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-black">
                        <Star className="w-2.5 h-2.5 fill-black" />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Image - Smaller */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.image || "/images/placeholder-service.jpg"}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content - Compact */}
                  <div className="p-4">
                    {/* Price Badge - Smaller */}
                    <div className="mb-2">
                      <span className="inline-block rounded-full bg-gold/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-bold text-gold border border-gold/30">
                        {service.priceText || "Contact for pricing"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors line-clamp-1">
                      {service.name}
                    </h3>

                    {/* Description - Shorter */}
                    <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-2">
                      {service.description || "Professional service tailored to your needs."}
                    </p>

                    {/* Buttons - Compact */}
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedService(service.name);
                          setBookingModal(true);
                        }}
                        className="flex-1 rounded-xl bg-gold py-2 text-sm font-bold text-black transition-all hover:bg-gold-dark flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book
                      </motion.button>

                      <Link href={`/client?service=${encodeURIComponent(service.name)}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full rounded-xl border border-white/40 bg-white/5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-gold/50 flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Request Service
                      </motion.button>
                    </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats Row - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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

          {/* Trust Banner - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent p-5"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">Free Consultation</p>
                <h3 className="text-base font-semibold text-white">Not sure which service fits your needs?</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedService("General Consultation");
                  setBookingModal(true);
                }}
                className="px-5 py-2 bg-gold text-black font-semibold rounded-xl hover:bg-gold-dark transition-all text-sm"
              >
                Book Free Consultation →
              </motion.button>
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