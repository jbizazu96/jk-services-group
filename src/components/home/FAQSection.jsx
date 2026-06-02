"use client";

/* ==========================================
   REACT
========================================== */

import {
  useState,
  useRef,
} from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

/* ==========================================
   ICONS
========================================== */

import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Calendar,
  Clock,
  CreditCard,
  Search,
  X,
} from "lucide-react";

/* ==========================================
   MODAL
========================================== */

import GeneralBookingModal from "@/components/home/modals/GeneralBookingModal";

/* ==========================================
   FAQ DATA WITH CATEGORIES
========================================== */

const faqCategories = [
  {
    name: "General",
    icon: <HelpCircle className="w-4 h-4" />,
    items: [
      {
        question: "Who is J&K Services Group?",
        answer: "J&K Services Group is a professional multi-service company specializing in event services, networking and IT solutions, photography, videography, DJ entertainment, business consulting, and conference support. Our mission is to deliver premium experiences and reliable solutions tailored to every client's needs.",
      },
      {
        question: "Do you offer custom packages?",
        answer: "Absolutely. We understand every client has unique needs. Custom packages can be created by combining services such as DJ, MC, photography, networking support, videography, and event coordination. Contact us for a personalized quote.",
      },
    ],
  },
  {
    name: "Consultations & Pricing",
    icon: <Calendar className="w-4 h-4" />,
    items: [
      {
        question: "Can I schedule a consultation without paying?",
        answer: "Yes. We offer a free 15-minute introductory consultation where clients can discuss their needs, ask questions, and explore possible solutions before committing to a paid consultation or service.",
      },
      {
        question: "Are the prices listed on the website final?",
        answer: "Not always. The prices displayed on our services are estimated ranges. Final pricing may vary depending on factors such as event size, location, duration, customization, technical requirements, and overall project complexity.",
      },
      {
        question: "Do I pay for every consultation after purchasing a service?",
        answer: "No. In many cases, once a service agreement is finalized, follow-up discussions directly related to your booked service are included. Additional advanced consultations outside the original project scope may require separate booking.",
      },
    ],
  },
  {
    name: "Booking & Logistics",
    icon: <Clock className="w-4 h-4" />,
    items: [
      {
        question: "How far in advance should I book?",
        answer: "We recommend booking as early as possible, especially for weddings, conferences, and large events. Early booking helps secure availability and allows better planning and preparation.",
      },
      {
        question: "Do you travel for events or projects?",
        answer: "Yes. We are available for both local and out-of-state projects depending on availability, travel requirements, and scheduling arrangements.",
      },
    ],
  },
  {
    name: "Payments",
    icon: <CreditCard className="w-4 h-4" />,
    items: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept secure online payments, card payments, and other approved payment methods depending on the service type and consultation arrangement. All payments are processed securely through Stripe.",
      },
    ],
  },
];

// Flatten for search functionality
const allFaqs = faqCategories.flatMap(cat => 
  cat.items.map(item => ({ ...item, category: cat.name }))
);

/* ==========================================
   FAQ ITEM COMPONENT
========================================== */

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className={`
          relative overflow-hidden rounded-2xl transition-all duration-300
          ${isOpen 
            ? 'bg-gradient-to-br from-gold/[0.08] to-gold/[0.03] border-gold/30 shadow-md' 
            : 'bg-white border-gray-200 hover:border-gold/30 hover:shadow-md'
          }
          border shadow-sm
        `}>
          <div className="flex items-center justify-between p-5 md:p-6">
            <div className="flex items-start gap-4 pr-4">
              <div className={`
                hidden sm:flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5
                ${isOpen 
                  ? 'bg-gold text-white' 
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gold group-hover:text-white'
                } transition-all duration-300
              `}>
                <HelpCircle className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className={`
                  text-base md:text-lg font-semibold leading-relaxed
                  ${isOpen ? 'text-gold' : 'text-gray-900'}
                  transition-colors duration-300
                `}>
                  {faq.question}
                </h3>
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {faq.category}
                  </span>
                </div>
              </div>
            </div>
            
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full shrink-0
                ${isOpen ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-500'}
                transition-all duration-300
              `}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-6 md:px-6 md:pb-7 pt-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5" />
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-0 sm:pl-14">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function FAQSection() {
  const [openItems, setOpenItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // ← Modal state
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  const toggleFAQ = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openItems.length === filteredFaqs.length) {
      setOpenItems([]);
    } else {
      setOpenItems(filteredFaqs.map((_, i) => i));
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", ...faqCategories.map(cat => cat.name)];

  return (
    <>
      <section
        ref={sectionRef}
        id="faq"
        className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
      >
        {/* Background Effects */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none"
        />

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-14"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2 backdrop-blur-sm mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-gold"
              />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Got Questions?
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              Frequently Asked
              <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
                {" "}Questions
              </span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about our services, consultations, pricing, and how we work with clients.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-full py-3 pl-11 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${activeCategory === cat
                      ? 'bg-gold text-white shadow-md shadow-gold/25'
                      : 'bg-white text-gray-600 hover:text-gold border border-gray-200 hover:border-gold/50'
                    }
                  `}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
              </p>
              {filteredFaqs.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleAll}
                  className="text-sm text-gold hover:text-gold-dark font-medium transition"
                >
                  {openItems.length === filteredFaqs.length ? "Close All" : "Expand All"}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div style={{ opacity }} className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-2xl border border-gray-200"
              >
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try searching with different keywords or browse all categories.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-gold hover:text-gold-dark font-medium transition"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <FAQItem
                  key={`${faq.question}-${index}`}
                  faq={faq}
                  index={index}
                  isOpen={openItems.includes(index)}
                  onToggle={() => toggleFAQ(index)}
                />
              ))
            )}
          </motion.div>

          {/* Contact CTA - THIS NOW WORKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-white border border-gray-200 px-6 py-3 shadow-sm">
              <MessageCircle className="w-4 h-4 text-gold" />
              <span className="text-gray-600 text-sm">
                Still have questions?
              </span>
              <button
                onClick={() => setIsModalOpen(true)}  // ← THIS OPENS THE MODAL
                className="text-gold hover:text-gold-dark text-sm font-semibold transition"
              >
                Contact us →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal - Rendered here */}
      <GeneralBookingModal
        bookingModalGS={isModalOpen}
        setBookingModalGS={setIsModalOpen}
      />
    </>
  );
}