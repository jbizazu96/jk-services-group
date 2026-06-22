"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Search, Menu, X,
  ArrowRight, Snowflake, Thermometer, Paintbrush, Wrench, 
  Armchair, Leaf, Droplets, ShieldCheck, Calendar, Send,
  Home as HomeIcon, Layers, Sparkles, Briefcase,
  Plus, Minus, ChevronDown, ChevronUp
} from "lucide-react";

/* ==========================================
   IMPORT LOCAL IMAGES (from /public/images/ama-repair/)
========================================== */
// Note: Next.js will automatically serve files from the /public folder.
// Update the filenames below to match exactly what you have saved.
const logoImg = "/images/ama-repair/logo.png";
const heroImg = "/images/ama-repair/main.jpeg"; 
const hvacImg = "/images/ama-repair/hvac.jpeg";
const refrigerationImg = "/images/ama-repair/refrigeration.jpeg";
const remodelingImg = "/images/ama-repair/remodeling.jpg";
const paintingImg = "/images/ama-repair/painting.jpeg";
const interiorImg = "/images/ama-repair/interior.jpeg";
const cleaningImg = "/images/ama-repair/exteriorC.jpeg";
const flooringImg = "/images/ama-repair/flooring.jpeg";
const blueprintImg = "/images/ama-repair/blueP.jpeg";
const waterImg = "/images/ama-repair/waterF.jpeg";

/* ==========================================
   SERVICE DATA
========================================== */
const servicesData = [
  { id: 1, title: "HVAC (Heating & Cooling)", icon: <Thermometer size={24} />, desc: "Installation, repair, and maintenance of boilers, AC units, and heating systems.", price: "$85 - $150/hr", image: hvacImg },
  { id: 2, title: "Refrigeration", icon: <Snowflake size={24} />, desc: "Commercial and residential fridge/freezer repair and servicing.", price: "$70 - $120/hr", image: refrigerationImg },
  { id: 3, title: "Remodeling", icon: <Wrench size={24} />, desc: "Full kitchen, bathroom, and basement remodeling services.", price: "$500 - $3000/project", image: remodelingImg },
  { id: 4, title: "Painting", icon: <Paintbrush size={24} />, desc: "Interior and exterior residential and commercial painting.", price: "$200 - $800/room", image: paintingImg },
  { id: 5, title: "Interior Design & TV Stand", icon: <Armchair size={24} />, desc: "Custom built-in TV stands, wall units, and interior styling.", price: "$200 - $600/item", image: interiorImg },
  { id: 6, title: "Exterior Wall Cleaning", icon: <Layers size={24} />, desc: "High-pressure washing for driveways, patios, and exterior walls.", price: "$150 - $400/session", image: cleaningImg },
  { id: 7, title: "Flooring", icon: <HomeIcon size={24} />, desc: "Hardwood, tile, laminate, and vinyl flooring installation.", price: "$3 - $8/sq ft", image: flooringImg },
  { id: 8, title: "Exterior design & Blueprint", icon: <Leaf size={24} />, desc: "Mowing, landscaping, fertilization, and yard cleanup.", price: "$50 - $150/visit", image: blueprintImg },
  { id: 9, title: "Water Filtering Installation", icon: <Droplets size={24} />, desc: "Whole-house water filtration, reverse osmosis, and softener systems.", price: "$300 - $1200/system", image: waterImg },
];

/* ==========================================
   FAQ DATA
========================================== */
const faqData = [
  { q: "How much does a repair cost?", a: "Costs vary based on the service and materials required. We offer free estimates! Contact us with your project details for a tailored quote." },
  { q: "Do you offer emergency services?", a: "Yes! We offer 24/7 emergency services for HVAC breakdowns and urgent plumbing issues. Call our emergency line at (309) 287-9198." },
  { q: "What areas do you serve?", a: "We proudly serve Bloomington, Champaign, and the surrounding Illinois areas." },
  { q: "How long does a typical remodel take?", a: "Depending on the scale, small remodels take 1-2 weeks, while full kitchen or basement remodels can take 2-3 months. We provide a strict timeline before we start." },
];

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function AMAHomeRepair() {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Modal & Popup States
  const [selectedService, setSelectedService] = useState(null); // For Request Service Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FAQ States
  const [faqOpenState, setFaqOpenState] = useState({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter services for search
  const filteredServices = servicesData.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Request Service Popup
  const openRequestModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // Handle FAQ Toggle
  const toggleFaq = (index) => {
    setFaqOpenState((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleExpandAll = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newFaqState = {};
    faqData.forEach((_, i) => {
      newFaqState[i] = newState;
    });
    setFaqOpenState(newFaqState);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative overflow-x-hidden">
      
      {/* ==========================================
          NAVIGATION HEADER
      ========================================== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage("home")}>
            {/* Using your actual logo from public folder */}
            <div className="relative w-12 h-12">
              <Image 
                src={logoImg} 
                alt="AMA Logo" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 40px, (max-width: 1200px) 48px, 48px"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-bold text-xl text-[#0a3d52]">AMA</span>
              <span className="text-[10px] font-bold tracking-widest text-[#f6892a] uppercase">Home Repair</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {["home", "services", "contact"].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#f6892a] ${
                  activePage === page ? "text-[#f6892a] border-b-2 border-[#f6892a]" : "text-[#0a3d52]"
                }`}
              >
                {page}
              </button>
            ))}
            <a href="tel:+13092879198" className="rounded-full bg-[#f6892a] px-6 py-2 text-white font-bold hover:bg-[#d97a20] transition-colors shadow-md">
              Call Now
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#0a3d52]">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl">
              <div className="flex flex-col px-6 py-6 gap-4">
                {["home", "services", "contact"].map((page) => (
                  <button key={page} onClick={() => { setActivePage(page); setMobileMenuOpen(false); }} className="text-left text-lg font-bold text-[#0a3d52] capitalize hover:text-[#f6892a] transition-colors">
                    {page}
                  </button>
                ))}
                <a href="tel:+13092879198" className="mt-2 text-center rounded-full bg-[#f6892a] py-3 text-white font-bold">Call (309) 287-9198</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          PAGE CONTENT
      ========================================== */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              HOME PAGE
          ========================================== */}
          {activePage === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              
              {/* HERO SECTION */}
              <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a3d52] to-[#05222e] overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581093588402-fdd8501ee078?w=1600')] bg-cover bg-center mix-blend-overlay" />
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center py-12 relative z-10">
                  <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full mb-6 border border-white/20">
                      <Sparkles size={16} className="text-[#f6892a]" />
                      <span className="text-sm font-bold uppercase tracking-wider text-[#f6892a]">Quality You Can Trust</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
                      Home <span className="text-[#f6892a]">Repair</span> <br /> Service
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                      Your one-stop solution for HVAC, remodeling, painting, and lawn care. With over 10 years of experience, we bring comfort and quality to your doorstep.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setActivePage("services")} className="rounded-full bg-[#f6892a] px-8 py-3 text-white font-bold hover:bg-[#d97a20] transition-all shadow-lg flex items-center gap-2">
                        View Services <ArrowRight size={18} />
                      </button>
                      <button onClick={() => setActivePage("contact")} className="rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-3 text-white font-bold hover:bg-white/20 transition-all">
                        Get a Quote
                      </button>
                    </div>
                  </motion.div>
                  <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative">
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <Image src={heroImg} alt="Reliable Technician" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    {/* Floating Card 1 */}
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600"><ShieldCheck size={20} /></div>
                      <div><p className="text-xs font-bold text-gray-800">5-Star Rating</p><p className="text-[10px] text-gray-500">Verified Reviews</p></div>
                    </motion.div>
                    {/* Floating Card 2 */}
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="bg-[#f6892a] p-2 rounded-full text-white"><Phone size={20} /></div>
                      <div><p className="text-xs font-bold text-gray-800">Call Us Now</p><p className="text-[10px] text-gray-500">(309) 287-9198</p></div>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* ABOUT SECTION */}
              <section className="py-20 px-6 bg-gray-50">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-5xl mx-auto text-center">
                  <span className="text-[#f6892a] font-bold uppercase tracking-widest text-sm">About Us</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0a3d52] mt-2 mb-6 font-serif">Why Choose AMA?</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                    We are a dedicated team of certified technicians specializing in HVAC, remodeling, and comprehensive home maintenance. Our mission is to provide reliable, high-quality service that gives you comfort and peace of mind. 
                  </p>
                </motion.div>
              </section>

              {/* SERVICES HIGHLIGHT (Small Cards) */}
              <section className="py-16 px-6">
                <div onClick={() => setActivePage("services")} className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                  {servicesData.slice(0, 4).map((service, i) => (
                    <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 text-center group">
                      <div className="w-14 h-14 bg-[#0a3d52]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0a3d52] group-hover:bg-[#f6892a] group-hover:text-white transition-colors duration-300">
                        {service.icon}
                      </div>
                      <h4 className="font-bold text-[#0a3d52]">{service.title}</h4>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-10">
                  <button onClick={() => setActivePage("services")} className="text-[#f6892a] font-bold flex items-center gap-2 mx-auto hover:gap-4 transition-all">See All Services <ArrowRight size={16} /></button>
                </div>
              </section>

              {/* FAQ SECTION (Expandable with Expand All) */}
              <section className="py-20 px-6 bg-[#0a3d52] text-white">
                <div className="max-w-4xl mx-auto">
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-blue-200">Find answers to common questions about our services.</p>
                    <button 
                      onClick={toggleExpandAll}
                      className="mt-4 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                    >
                      {isAllExpanded ? <><Minus size={14}/> Collapse All</> : <><Plus size={14}/> Expand All</>}
                    </button>
                  </motion.div>
                  
                  <div className="space-y-4">
                    {faqData.map((faq, i) => {
                      const isOpen = faqOpenState[i] || false;
                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }} 
                          whileInView={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * 0.1 }} 
                          viewport={{ once: true }} 
                          className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
                        >
                          <button 
                            onClick={() => toggleFaq(i)}
                            className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-white/20"
                          >
                            <p className="font-semibold text-lg">{faq.q}</p>
                            <span className="bg-white/20 rounded-full p-1 ml-4 flex-shrink-0">
                              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </span>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: "auto", opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-5 text-blue-200"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* CTA SECTION */}
              <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f6892a] to-[#d97a20] opacity-10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0a3d52] mb-6">Ready to fix your home?</h2>
                  <p className="text-gray-600 text-lg mb-8">Schedule your appointment today. Get up to <span className="font-bold text-[#f6892a]">40% OFF</span> your first service!</p>
                  <button onClick={() => setActivePage("contact")} className="rounded-full bg-[#0a3d52] text-white px-10 py-4 font-bold text-lg hover:bg-[#062433] transition-colors shadow-xl">
                    Book an Appointment
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {/* ==========================================
              SERVICES PAGE
          ========================================== */}
          {activePage === "services" && (
            <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-16 px-6 bg-gray-50 min-h-screen">
              <div className="max-w-7xl mx-auto">
                
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0a3d52] font-serif">Our Services</h1>
                  <p className="text-gray-500 max-w-2xl mx-auto mt-2">Professional home repair, maintenance, and installation services tailored to your needs.</p>
                </motion.div>

                {/* Search Field */}
                <div className="max-w-xl mx-auto mb-12 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for a service..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f6892a] text-gray-700"
                  />
                </div>

                {/* Services Grid */}
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {filteredServices.map((service, i) => (
                      <motion.div 
                        layout 
                        key={service.id} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-4 left-4 bg-[#f6892a] text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                            {service.price}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-[#0a3d52]">{service.icon}</div>
                            <h3 className="text-xl font-bold text-[#0a3d52]">{service.title}</h3>
                          </div>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-2">{service.desc}</p>
                          
                          {/* Button Row */}
                          <div className="space-y-3 mt-2">
                            <button 
                              onClick={() => openRequestModal(service)}
                              className="w-full rounded-xl bg-[#0a3d52] text-white py-3 font-bold hover:bg-[#062433] transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                            >
                              Request Service <Calendar size={18} />
                            </button>
                            <Link href="">
                              <button className="w-full rounded-xl border-2 border-[#0a3d52] text-[#0a3d52] py-3 font-bold hover:bg-[#0a3d52] hover:text-white transition-colors flex items-center justify-center gap-2">
                                View My Work <Briefcase size={18} />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-20 text-gray-500">No services found matching your search.</div>
                )}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              CONTACT US PAGE
          ========================================== */}
          {activePage === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-20 px-6 bg-white min-h-screen">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                
                {/* Left Side: Info */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0a3d52] font-serif mb-4">Get In Touch</h1>
                  <p className="text-gray-500 mb-8 text-lg">We are ready to help with your home repair and maintenance needs. Reach out to us today!</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f6892a]/10 flex items-center justify-center text-[#f6892a]"><Phone size={24} /></div>
                      <div><p className="font-semibold text-[#0a3d52]">Call Us</p><a href="tel:+13092879198" className="text-gray-600 hover:text-[#f6892a]">+1 (309) 287-9198</a></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f6892a]/10 flex items-center justify-center text-[#f6892a]"><Mail size={24} /></div>
                      <div><p className="font-semibold text-[#0a3d52]">Email Us</p><a href="mailto:ama.servicerepair01@gmail.com" className="text-gray-600 hover:text-[#f6892a]">ama.servicerepair01@gmail.com</a></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f6892a]/10 flex items-center justify-center text-[#f6892a]"><Clock size={24} /></div>
                      <div><p className="font-semibold text-[#0a3d52]">Working Hours</p><p className="text-gray-600">Mon - Sat: 8:00 AM - 7:00 PM</p></div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-10 rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200 border border-gray-200 relative">
                     <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop" fill className="object-cover opacity-80" alt="Map" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                     <div className="absolute inset-0 flex items-center justify-center bg-[#0a3d52]/40">
                       <p className="text-white font-bold bg-[#0a3d52]/80 px-4 py-2 rounded-lg backdrop-blur-sm">Serving Bloomington, IL & Beyond</p>
                     </div>
                  </div>
                </motion.div>

                {/* Right Side: Standard Contact Form */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
                  <h2 className="text-2xl font-bold text-[#0a3d52] mb-6">Request a Quote</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Phone Number</label>
                      <input type="tel" placeholder="(309) 287-9198" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Service Interested In</label>
                      <select className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all bg-white">
                         <option>HVAC / Heating & Cooling</option>
                         <option>Refrigeration</option>
                         <option>Remodeling / Renovation</option>
                         <option>Painting</option>
                         <option>Water Filtering Installation</option>
                         <option>General Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Message</label>
                      <textarea rows="4" placeholder="Briefly describe your project..." className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all resize-none"></textarea>
                    </div>
                    <button type="button" className="w-full rounded-xl bg-[#f6892a] py-4 text-white font-bold text-lg hover:bg-[#d97a20] transition-colors shadow-lg flex items-center justify-center gap-2">
                      Send Message <Send size={20} />
                    </button>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="bg-[#0a3d52] text-white pt-16 pb-6 px-6 border-t border-[#0e4a63]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">AMA<span className="text-[#f6892a]"> Service</span></h3>
            <p className="text-blue-200 text-sm leading-relaxed">Quality repairs. Comfort you can trust. Serving the community with professional home maintenance.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-[#f6892a]">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-blue-200">
              <button onClick={() => setActivePage("home")} className="hover:text-white text-left">Home</button>
              <button onClick={() => setActivePage("services")} className="hover:text-white text-left">Services</button>
              <button onClick={() => setActivePage("contact")} className="hover:text-white text-left">Contact Us</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#f6892a]">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-blue-200">
              <p>HVAC & Boilers</p>
              <p>Refrigeration</p>
              <p>Remodeling & Painting</p>
              <p>Water Filtering Systems</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#f6892a]">Contact Info</h4>
            <div className="flex flex-col gap-2 text-sm text-blue-200">
              <a href="tel:+13092879198" className="hover:text-white">📞 (309) 287-9198</a>
              <a href="mailto:ama.servicerepair01@gmail.com" className="hover:text-white">✉️ ama.servicerepair01@gmail.com</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#0e4a63] pt-6 text-center text-blue-300 text-sm">
          &copy; {new Date().getFullYear()} AMA Home Repair Service. All rights reserved.
        </div>
      </footer>

      {/* ==========================================
          SERVICE REQUEST MODAL (POPUP)
      ========================================== */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#0a3d52] p-6 text-white relative">
                <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-1">Service Request</h2>
                <p className="text-blue-200 text-sm">Fill out the form below to get a quote.</p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form className="space-y-4">
                  <div className="bg-[#f6892a]/10 border border-[#f6892a]/30 p-3 rounded-xl text-center">
                    <p className="font-semibold text-[#0a3d52]">Requesting:</p>
                    <p className="text-lg font-bold text-[#f6892a]">{selectedService.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input type="tel" placeholder="(309) 287-9198" className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700">Project Details</label>
                    <textarea rows="3" placeholder="Tell us about your project..." className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#f6892a] focus:ring-2 focus:ring-[#f6892a]/20 outline-none transition-all resize-none"></textarea>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-3xl">
                <button onClick={closeModal} className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-full bg-[#f6892a] text-white font-bold hover:bg-[#d97a20] transition-colors shadow-md flex items-center gap-2">
                  Send Request <Send size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}