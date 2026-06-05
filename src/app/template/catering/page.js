"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  ChefHat,
  Armchair,
  Ticket,
  Calendar,
  CheckCircle2,
  X,
  Menu,
  Search,
} from "lucide-react";

/* ==========================================
   FADE IN VARIANTS
========================================== */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ==========================================
   FOOD MENU DATA - THREE CATEGORIES
========================================== */
const menuData = {
  mainCourse: [
    { name: "Mipanzi / Ribs", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop" },
    { name: "Poulet / Soso / Chicken", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop" },
    { name: "Ntaba / Goat", image: "https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=500&h=400&fit=crop" },
    { name: "Makayabu / Salt Fish", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=500&h=400&fit=crop" },
    { name: "Ndindo / Smoke Turkey", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=400&fit=crop" },
    { name: "Poissons / Fish", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=400&fit=crop" },
    { name: "Mbinzo / Caterpillars", image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&h=400&fit=crop" },
    { name: "Kamundele / Beef Kebabs", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&h=400&fit=crop" },
    { name: "Ngulu / Pork", image: "/images/catering/pork.jpeg" },
    { name: "Boulette de Viande / Meat Ball", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&h=400&fit=crop" },
    { name: "Poulet Mayo / Chicken Mayo", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=400&fit=crop" },
    { name: "Crevette / Shrimp", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&h=400&fit=crop" },
  ],
  sideA: [
    { name: "Samusa / Samosa", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop" },
    { name: "Mbala / Potatoes", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop" },
    { name: "Mikate / Beignets", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=400&fit=crop" },
    { name: "Riz Sauté / Stir-Fried Rice", image: "/images/catering/strice.jpeg" },
    { name: "Riz Blanc / White Rice", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&h=400&fit=crop" },
    { name: "Gauffres / Waffles", image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&h=400&fit=crop" },
    { name: "Kwanga / Cassava Dough", image: "https://images.unsplash.com/photo-1509448613959-44d527dd5d86?w=500&h=400&fit=crop" },
    { name: "Makemba / Plantains", image: "/images/catering/makemba.jpeg" },
    { name: "Fruits", image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&h=400&fit=crop" },
    { name: "Macaroni au Fromage / Mac and Cheese", image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&h=400&fit=crop" },
    { name: "Attieke / Couscous of Ivory Coast", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop" },
    { name: "Buffet Froids / Cold Buffet", image: "/images/catering/cbuffet.jpeg" },
  ],
  sideB: [
    { name: "Epinard / Spinach", image: "/images/catering/spinach.jpeg" },
    { name: "Pondu / Cassava Leaf", image: "/images/catering/pondu.jpeg" },
    { name: "Fumbwa / Wild Spinach", image: "/images/catering/fumbwa.jpeg" },
    { name: "Pondu-Madesu / Cassava Beans", image: "/images/catering/pmadesu.jpeg" },
    { name: "Madesu / Beans", image: "/images/catering/beans.jpeg" },
    { name: "Matembele / Sweet Potato Leaf", image: "/images/catering/matembele.jpeg" },
  ],
};

/* ==========================================
   RENTAL ITEMS DATA
========================================== */
const rentalItems = [
  { id: 1, name: "Chafing Dish Rental R1A", price: "$25", image: "/images/catering/chafingD.webp", description: "Full-size stainless steel chafing dish" },
  { id: 2, name: "Chafing Dish Rental R1B", price: "$15", image: "/images/catering/chafingR.webp", description: "Medium chafing dish with fuel holders" },
  { id: 3, name: "Chafing Dish Rental R1C", price: "$20", image: "/images/catering/chafingB.webp", description: "Round chafing dish with glass lid" },
  { id: 4, name: "Deluxe Spoon", price: "$2", image: "/images/gspoon.jpeg", description: "Heavy-weight stainless steel serving spoon" },
  { id: 5, name: "Deluxe Cooking Tongs", price: "$1.25", image: "/images/catering/gtongue.jpeg", description: "Professional grade stainless steel tongs" },
  { id: 6, name: "Silver Cooking Tongs", price: "$1", image: "/images/catering/stongue.jpeg", description: "Standard silver finish cooking tongs" },
  { id: 7, name: "Silver Cooking Spoon", price: "$1", image: "/images/catering/spoon.webp", description: "Silver finish serving spoon" },
  { id: 8, name: "Armrest Gold Stainless Steel Metal", price: "$130", image: "/images/catering/chair1.jpeg", description: "Luxury armrest chair with gold finish" },
  { id: 9, name: "Banquet Chair Gold", price: "$15", image: "/images/catering/chair2.jpeg", description: "Elegant gold banquet chair" },
  { id: 10, name: "Gold Chameleon Chair", price: "$12", image: "/images/catering/chair3.png", description: "Versatile gold-tone event chair" },
  { id: 11, name: "Dance Floor Light Led Tile", price: "$25", image: "/images/catering/dfloor.webp", description: "LED illuminated dance floor tiles" },
];

/* ==========================================
   FOOD PORTFOLIO IMAGES
========================================== */
const portfolioImages = [
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
];

/* ==========================================
   POLICY DATA
========================================== */
const policies = {
  english: [
    "Rental Period: Minimum rental period is 2 days (pickup and return day).",
    "Rental fee: Different dish with different prices.",
    "Security deposit: 20% deposit.",
    "Pickup and return: Pickup at our location during business hours. If there are any delays in returning the dish, please notify us at least 12 hours in advance.",
    "Condition: Dishes must be returned in same condition as picked.",
    "Cleaning: We kindly ask that you clean the dish after use and return it at the agreed-upon time of the pickup.",
    "Late Return: Additional charges may apply for late returns. Late fee ($50-$100) per day for each past due date.",
    "Cancellation: 24 hour notice required for cancellations or a late notice may apply.",
  ],
  french: [
    "Période de location: La période minimale de location est de 2 jours (jour de retrait et de retour).",
    "Frais de location: Différents plats avec différents prix.",
    "Dépôt de garantie: 20% de dépôt.",
    "Retrait et retour: Retrait à notre emplacement pendant les heures d'ouverture. En cas de retard, veuillez nous informer au moins 12 heures à l'avance.",
    "État: Les plats doivent être retournés dans le même état qu'ils ont été récupérés.",
    "Nettoyage: Nous vous demandons de bien vouloir nettoyer les plats après utilisation et de les retourner à l'heure convenue.",
    "Retour tardif: Des frais supplémentaires peuvent s'appliquer. Frais de retard (50$-100$) par jour pour chaque date d'échéance dépassée.",
    "Annulation: Un préavis de 24 heures est requis pour les annulations, sinon des frais peuvent s'appliquer.",
  ],
  swahili: [
    "Muda wa Kukodisha: Muda wa chini wa kukodisha ni siku 2 (siku ya kuchukua na siku ya kurudisha).",
    "Ada ya Kukodisha: Vyombo tofauti vina bei tofauti.",
    "Amana ya Usalama: Amana ya 20%.",
    "Kuchukua na Kurudisha: Chukua kwenye eneo letu wakati wa saa za biashara. Ikiwa kuna ucheleweshaji wowote katika kurudisha vyombo, tafadhali tujulishe angalau masaa 12 kabla.",
    "Hali: Vyombo lazima virudishwe katika hali ile ile kama ilivyochukuliwa.",
    "Usafishaji: Tunaomba kwa upole usafishe vyombo baada ya matumizi na uvirudishe kwa wakati uliokubaliwa.",
    "Kurudisha kwa Kuchelewa: Gharama za ziada zinaweza kutozwa. Ada ya kuchelewa ($50-$100) kwa siku kwa kila tarehe iliyopitwa.",
    "Kughairi: Taarifa ya masaa 24 inahitajika kwa ughairi au ilani ya kuchelewa inaweza kutumika.",
  ],
};

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function CateringPage() {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [rentalModal, setRentalModal] = useState(null);
  const [rentalForm, setRentalForm] = useState({
    name: "", email: "", phone: "", pickupDate: "", returnDate: "", quantity: 1, description: ""
  });
  const [rentalSubmitted, setRentalSubmitted] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");

  const portfolioRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollPortfolio = (direction) => {
    const container = portfolioRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email) {
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", message: "" });
      setTimeout(() => setContactSubmitted(false), 4000);
    }
  };

  const handleRentalSubmit = (e) => {
    e.preventDefault();
    setRentalSubmitted(true);
    setTimeout(() => {
      setRentalSubmitted(false);
      setRentalModal(null);
      setRentalForm({ name: "", email: "", phone: "", pickupDate: "", returnDate: "", quantity: 1, description: "" });
    }, 3000);
  };

  /* ==========================================
     FILTER MENU BY SEARCH
  ========================================== */
  const filterMenuItems = (items) => {
    if (!menuSearch.trim()) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase())
    );
  };

  const filteredMainCourse = filterMenuItems(menuData.mainCourse);
  const filteredSideA = filterMenuItems(menuData.sideA);
  const filteredSideB = filterMenuItems(menuData.sideB);
  const hasResults = filteredMainCourse.length > 0 || filteredSideA.length > 0 || filteredSideB.length > 0;

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Event Menu", page: "menu" },
    { label: "Rental Service", page: "rental" },
    { label: "Policy", page: "policy" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50/40 via-emerald-50/30 to-amber-50/40">
      
      {/* Background Glows */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-green-400/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-amber-400/8 blur-[120px] pointer-events-none" />

      {/* ==========================================
          HEADER
      ========================================== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-lg" : "bg-white/80 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                {/* Logo Image */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-amber-400">
                    <Image 
                    src="/images/cateringLogo.jpeg" 
                    alt="M'L Catering Logo" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    />
                </div>
                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    M'L <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">CATERING</span> SERVICE
                </span>
                </motion.div>

          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link, i) => (
              <motion.button
                key={link.page}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setActivePage(link.page)}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  activePage === link.page ? "text-green-700 border-amber-500" : "text-gray-600 border-transparent hover:text-green-600"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden rounded-xl p-2 hover:bg-gray-100">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t border-green-100 overflow-hidden">
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button key={link.page} onClick={() => { setActivePage(link.page); setMobileMenuOpen(false); }} className="text-sm font-medium text-gray-600 hover:text-green-600 py-2">
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          HOME PAGE
      ========================================== */}
      {activePage === "home" && (
        <>
          {/* SECTION 1: HERO */}
          <section className="relative w-full">
            <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1400&h=900&fit=crop"
                alt="M'L Catering Service"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
              <div className="absolute inset-0 flex items-center px-6 md:px-16">
                <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-lg rounded-2xl p-5 mb-8 border border-white/25 shadow-2xl"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg">
                        <Image 
                            src="/images/cateringLogo.jpeg" 
                            alt="M'L Catering Logo" 
                            fill 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                        />
                        </div>
                    <div>
                      <p className="text-white font-bold text-2xl">M'L CATERING</p>
                      <p className="text-amber-300 text-sm font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Lexington, Kentucky
                      </p>
                    </div>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Exceptional{" "}
                    <span className="bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
                      Catering
                    </span>{" "}
                    For Every Occasion
                  </h1>
                  <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    Bringing African-inspired flavors to Lexington. From intimate gatherings to grand celebrations, we make every event unforgettable.
                  </p>
                  <motion.div className="flex gap-4 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => window.open("", "_blank")}
                      className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" /> Book Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActivePage("menu")}
                      className="rounded-xl border-2 border-white/50 bg-white/10 backdrop-blur-md px-8 py-4 text-white font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                      View Menu <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* SECTION 2: SERVICES */}
          <section className="py-20 px-6 bg-gradient-to-b from-white to-white">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-6xl mx-auto">
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-amber-50 px-5 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-green-700">Our Services</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">What We Offer</h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: <UtensilsCrossed className="w-8 h-8" />, title: "Event Catering", desc: "Full-service catering for weddings, corporate events, and private parties.", color: "white", iconColor: "text-green-600", border: "border-green-200" },
                  { icon: <Ticket className="w-8 h-8" />, title: "Chafing Dish Rental", desc: "High-quality chafing dishes to keep your food warm and presentable.", color: "white", iconColor: "text-amber-600", border: "border-amber-200" },
                  { icon: <Armchair className="w-8 h-8" />, title: "Chair & Stage Rental", desc: "Tables, chairs, and stage platforms for events of all sizes.", color: "white", iconColor: "text-emerald-600", border: "border-emerald-200" },
                ].map((service, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,100,0,0.08)" }}
                    className={`rounded-3xl border ${service.border} bg-gradient-to-br ${service.color} p-8 shadow-md text-center`}
                  >
                    <motion.div whileHover={{ rotate: 5, scale: 1.1 }} className={`rounded-2xl bg-white p-4 inline-flex mb-6 shadow-md ${service.iconColor}`}>
                      {service.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.desc}</p>
                    <button
                      onClick={() => setActivePage(service.title.includes("Catering") ? "menu" : "rental")}
                      className="text-green-700 font-semibold hover:text-amber-600 flex items-center gap-1 mx-auto transition-colors"
                    >
                      Explore More <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* SECTION 3: BOOK APPOINTMENT */}
          <section className="py-20 px-6 bg-white border-y border-green-100">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <motion.div variants={scaleIn} className="rounded-3xl bg-gradient-to-br from-green-700 via-emerald-600 to-amber-600 p-10 text-white shadow-2xl text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-amber-300" />
                  <h3 className="text-2xl font-bold mb-4">Book an Appointment</h3>
                  <p className="text-white/80 mb-6">Schedule your consultation today and let us plan your perfect event.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open("", "_blank")}
                    className="rounded-xl bg-white text-green-800 px-8 py-4 font-bold hover:bg-amber-50 transition-colors shadow-lg"
                  >
                    Book Now
                  </motion.button>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Looking for the best{" "}
                    <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                      catering service
                    </span>{" "}
                    for your event?
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Choose M'L Catering Service! We require all clients to book <strong className="text-green-700">2-3 weeks in advance</strong> to ensure a smooth experience.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We're passionate about making your event unforgettable. Thank you for choosing us!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* SECTION 4: FOOD PORTFOLIO */}
          <section className="py-20 px-6 bg-gradient-to-b from-green-50/30 to-white">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-7xl mx-auto">
              <motion.div variants={fadeInUp} className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Our{" "}
                  <span className="bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                    Portfolio
                  </span>
                </h2>
              </motion.div>

              <div className="relative">
                <button onClick={() => scrollPortfolio(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-green-50 border border-green-100">
                  <ChevronLeft className="w-6 h-6 text-green-700" />
                </button>
                <button onClick={() => scrollPortfolio(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-green-50 border border-green-100">
                  <ChevronRight className="w-6 h-6 text-green-700" />
                </button>

                <div ref={portfolioRef} className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2" style={{ scrollBehavior: "smooth", msOverflowStyle: "none", scrollbarWidth: "none" }}>
                  {portfolioImages.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.08 }}
                      className="shrink-0 w-72 h-56 rounded-2xl overflow-hidden shadow-xl relative group cursor-pointer border-2 border-transparent hover:border-amber-400 transition-all"
                    >
                      <Image src={img} alt={`Portfolio ${i + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white font-semibold">M'L Catering</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECTION 5: ABOUT */}
          <section className="py-20 px-6 bg-white border-y border-green-100">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-green-50 to-amber-50 px-5 py-2 mb-6">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold uppercase tracking-wider text-green-700">Our Journey</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                About{" "}
                <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  M'L Catering
                </span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Embark on a culinary adventure with M'L CATERING SERVICE, your go-to Catering Service in the heart of Lexington, Kentucky. We infuse traditional dishes with African flavors, offering a unique dining experience. From breakfast to dinner, we've got your cravings covered. Choose M'L CATERING SERVICE for your next event and savor the taste of home-cooked meals without the hassle.
              </motion.p>
            </motion.div>
          </section>

          {/* SECTION 6: FOOTER */}
          <Footer contactForm={contactForm} setContactForm={setContactForm} contactSubmitted={contactSubmitted} handleContactSubmit={handleContactSubmit} />
        </>
      )}

      {/* ==========================================
          EVENT MENU PAGE
      ========================================== */}
      {activePage === "menu" && (
        <section className="py-16 px-6 bg-gradient-to-b via-white to-white">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-gradient-to-r from-green-50 to-amber-50 px-5 py-2 mb-6">
                <UtensilsCrossed className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold uppercase tracking-wider text-green-700">Event Menu</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our{" "}
                <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Delicious Menu
                </span>
              </h1>
              <p className="text-gray-500 mb-8">Pricing based on number of guests ($10-$15/person)</p>

              {/* Search Field */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search dishes..."
                  className="w-full rounded-xl border-2 border-green-200 pl-12 pr-4 py-3 text-gray-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none bg-white shadow-md transition-all"
                />
              </div>
            </motion.div>

            {!hasResults ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No dishes found matching "{menuSearch}"</p>
              </div>
            ) : (
              <>
                {/* MAIN COURSE */}
                {filteredMainCourse.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300">
                        MAIN COURSE
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                      {filteredMainCourse.map((item, i) => (
                        <MenuCard key={item.name} item={item} index={i} color="green" />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SIDE A */}
                {filteredSideA.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300">
                        SIDE A
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                      {filteredSideA.map((item, i) => (
                        <MenuCard key={item.name} item={item} index={i} color="amber" />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SIDE B */}
                {filteredSideB.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-300">
                        SIDE B
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                      {filteredSideB.map((item, i) => (
                        <MenuCard key={item.name} item={item} index={i} color="emerald" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ==========================================
          RENTAL SERVICE PAGE
      ========================================== */}
      {activePage === "rental" && (
        <section className="py-16 px-6 bg-gradient-to-b from-amber-50/30 via-white to-green-50/20">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-green-50 px-5 py-2 mb-6">
                <Armchair className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold uppercase tracking-wider text-green-700">Rental Service</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Equipment{" "}
                <span className="bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
                  Rentals
                </span>
              </h1>
              <p className="text-gray-500">Quality equipment for your special events</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {rentalItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="rounded-3xl border-2 border-gray-100 bg-white overflow-hidden shadow-lg hover:shadow-2xl hover:border-green-200 transition-all group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-full group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-green-50/30">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">{item.price}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setRentalModal(item)}
                        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 text-white text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          POLICY PAGE
      ========================================== */}
      {activePage === "policy" && (
        <section className="py-16 px-6 bg-gradient-to-b from-white via-green-50/20 to-white">
          <div className="max-w-6xl mx-auto">
            {/* Top Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-5 gap-8 items-center mb-16 p-8 rounded-3xl bg-white border-2 border-green-100 shadow-xl bg-gradient-to-br from-white via-green-50/30 to-amber-50/30">
              <div className="md:col-span-2 flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className=""
                >
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl">
                    <Image 
                        src="/images/cateringLogo.jpeg" 
                        alt="M'L Catering Logo" 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    </div>
                </motion.div>
              </div>
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  CATERING POLICY
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Thank you for considering our catering services. Our pricing is based on the number of guests, ranging from $10 to $15 per person. For further details, we encourage you to contact us via email or text, and we will strive to make your event a memorable occasion. Please find our menu included for your review; any dishes not listed will require prior discussion and agreement.
                </p>
              </div>
            </motion.div>

            {/* Policy Columns */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { language: "ENGLISH", data: policies.english, flag: "🇺🇸", gradient: "from-white to-white", border: "border-green-200" },
                { language: "FRANÇAIS", data: policies.french, flag: "🇫🇷", gradient: "from-amber-50 to-yellow-50", border: "border-amber-200" },
                { language: "KISWAHILI", data: policies.swahili, flag: "🇰🇪", gradient: "from-whiteto-white", border: "border-emerald-200" },
              ].map((col, colIndex) => (
                <motion.div
                  key={colIndex}
                  variants={fadeInUp}
                  className={`rounded-3xl border-2 ${col.border} bg-gradient-to-br ${col.gradient} p-8 shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{col.flag}</span>
                    <h3 className="text-xl font-bold text-gray-900">{col.language}</h3>
                  </div>
                  <ol className="space-y-4">
                    {col.data.map((item, i) => (
                      <li key={i} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                        <span className="font-bold text-green-700 shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          RENTAL BOOKING MODAL
      ========================================== */}
      <AnimatePresence>
        {rentalModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRentalModal(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-green-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Book: {rentalModal.name}</h3>
                  <button onClick={() => setRentalModal(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                </div>

                {rentalSubmitted ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
                    <div className="rounded-full bg-green-100 p-4 inline-flex mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Request Submitted!</h4>
                    <p className="text-gray-500">We'll contact you shortly to confirm.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRentalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input type="text" required value={rentalForm.name} onChange={(e) => setRentalForm({ ...rentalForm, name: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" required value={rentalForm.email} onChange={(e) => setRentalForm({ ...rentalForm, email: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" required value={rentalForm.phone} onChange={(e) => setRentalForm({ ...rentalForm, phone: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                        <input type="date" required value={rentalForm.pickupDate} onChange={(e) => setRentalForm({ ...rentalForm, pickupDate: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                        <input type="date" required value={rentalForm.returnDate} onChange={(e) => setRentalForm({ ...rentalForm, returnDate: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rental Quantity *</label>
                      <input type="number" required min="1" value={rentalForm.quantity} onChange={(e) => setRentalForm({ ...rentalForm, quantity: parseInt(e.target.value) })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea rows={3} value={rentalForm.description} onChange={(e) => setRentalForm({ ...rentalForm, description: e.target.value })} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none" placeholder="Any special requests..." />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Submit Booking Request
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer for non-home pages */}
      {activePage !== "home" && (
        <Footer contactForm={contactForm} setContactForm={setContactForm} contactSubmitted={contactSubmitted} handleContactSubmit={handleContactSubmit} />
      )}
    </div>
  );
}

/* ==========================================
   MENU CARD COMPONENT
========================================== */
function MenuCard({ item, index, color }) {
  const borderColors = {
    green: "border-green-200 hover:border-green-400",
    amber: "border-amber-200 hover:border-amber-400",
    emerald: "border-emerald-200 hover:border-emerald-400",
  };

  const badgeColors = {
    green: "bg-green-600",
    amber: "bg-amber-600",
    emerald: "bg-emerald-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      className={`rounded-2xl border-2 ${borderColors[color]} bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all group`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
      </div>
    </motion.div>
  );
}

/* ==========================================
   FOOTER COMPONENT
========================================== */
function Footer({ contactForm, setContactForm, contactSubmitted, handleContactSubmit }) {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
             <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg">
                <Image 
                    src="/images/cateringLogo.jpeg" 
                    alt="M'L Catering Logo" 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                />
                </div>
              M'L Catering
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing African-inspired flavors to Lexington, Kentucky. Making every event unforgettable.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {["Home", "Event Menu", "Rental Service", "Policy"].map((link) => (
                <a key={link} href="#" className="block text-gray-400 hover:text-amber-400 transition-colors">{link}</a>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-400" /> Lexington, Kentucky</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> (859) 555-0147</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-400" /> info@mlcatering.com</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-400" /> Mon-Sat: 9AM-6PM</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h4 className="text-white font-semibold mb-4">Send Us a Message</h4>
            {contactSubmitted ? (
              <div className="rounded-xl bg-green-900/50 border border-green-700 p-4 text-green-300 text-sm">
                <CheckCircle2 className="w-5 h-5 mb-2" />
                <p>Message sent! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input type="text" placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500 outline-none text-sm" />
                <input type="email" placeholder="Your Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500 outline-none text-sm" />
                <textarea rows={2} placeholder="Your Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500 outline-none text-sm resize-none" />
                <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} M'L CATERING SERVICE. All rights reserved. | Lexington, Kentucky
        </motion.div>
      </div>
    </footer>
  );
}