"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  Package,
  ShieldCheck,
  RotateCcw,
  Truck,
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ==========================================
   PRODUCT DATA
========================================== */
const products = [
  { id: 1, name: "Silk Evening Gown", category: "Dresses", price: 189.99, rating: 5, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop", badge: "New" },
  { id: 2, name: "Linen Blazer", category: "Outerwear", price: 149.99, rating: 4, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop", badge: "" },
  { id: 3, name: "Cashmere Sweater", category: "Knitwear", price: 129.99, rating: 5, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop", badge: "Sale" },
  { id: 4, name: "Leather Handbag", category: "Accessories", price: 219.99, rating: 4, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop", badge: "" },
  { id: 5, name: "Denim Jacket", category: "Outerwear", price: 99.99, rating: 4, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop", badge: "" },
  { id: 6, name: "Silk Scarf", category: "Accessories", price: 59.99, rating: 5, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop", badge: "Best" },
  { id: 7, name: "Wool Coat", category: "Outerwear", price: 249.99, rating: 5, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop", badge: "" },
  { id: 8, name: "Gold Necklace", category: "Accessories", price: 179.99, rating: 4, image: "https://images.unsplash.com/photo-1599643478518-a530e60a6651?w=400&h=500&fit=crop", badge: "New" },
];

const categories = ["All", "Dresses", "Outerwear", "Knitwear", "Accessories"];

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function EcommercePage() {
  const [activePage, setActivePage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ==========================================
     CART FUNCTIONS
  ========================================== */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ==========================================
     NEWSLETTER
  ========================================== */
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
    }
  };

  /* ==========================================
     CHECKOUT
  ========================================== */
        const handleCheckout = () => {
  if (cart.length > 0) {
    // Convert dollars to cents and add as a query parameter
    const amountInCents = Math.round(cartTotal * 100);
    window.location.href = `https://buy.stripe.com/6oUeV79MOcyRectgM5grS06?prefilled_amount=${amountInCents}`;
  }
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30">
      
      {/* Gold Glow Backgrounds */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-rose-300/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-amber-300/5 blur-[120px] pointer-events-none" />

      {/* ==========================================
          HEADER
      ========================================== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg" : "bg-white/70 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-100 p-2">
              <ShoppingBag className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Ketany <span className="text-rose-600">Style</span>
            </span>
          </motion.div>

          <nav className="hidden md:flex gap-8 items-center">
            {[
              { label: "Home", page: "home" },
              { label: "Shop", page: "shop" },
              { label: "About", page: "about" },
            ].map((link, i) => (
              <motion.button
                key={link.page}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setActivePage(link.page)}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  activePage === link.page ? "text-rose-700 border-rose-500" : "text-gray-600 border-transparent hover:text-rose-600"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative rounded-xl p-2 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden rounded-xl p-2 hover:bg-gray-100">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white border-t overflow-hidden">
              <div className="px-6 py-4 flex flex-col gap-3">
                {["home", "shop", "about"].map((page) => (
                  <button key={page} onClick={() => { setActivePage(page); setMobileMenuOpen(false); }} className="text-sm font-medium text-gray-600 hover:text-rose-600 py-2 capitalize">
                    {page}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ==========================================
          CART SIDEBAR
      ========================================== */}

                <AnimatePresence>
                {cartOpen && (
                    <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/40 z-40" />
                    <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Your Cart ({cartCount})</h2>
                        <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
                        </div>

                        {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                        ) : (
                        <>
                            <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50">
                                <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                    <p className="text-rose-600 font-bold">${item.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded-lg"><Minus className="w-4 h-4" /></button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded-lg"><Plus className="w-4 h-4" /></button>
                                    <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                            <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total</span>
                                <span className="text-rose-600">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="w-full rounded-xl bg-rose-600 py-4 text-white font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Pay with Stripe
                            </button>
                            </div>
                        </>
                        )}
                    </motion.div>
                    </>
                )}
                </AnimatePresence>
      {/* ==========================================
          HOME PAGE
      ========================================== */}
      {activePage === "home" && (
        <>
          {/* HERO */}
          <section className="relative w-full">
            <div className="relative h-[90vh] min-h-[650px] w-full overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=900&fit=crop" alt="Ketany Style Fashion" fill className="object-cover scale-105" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 md:px-16">
                <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="inline-flex items-center gap-2 rounded-full border border-rose-300/50 bg-rose-500/20 backdrop-blur-sm px-5 py-2 mb-6">
                    <Sparkles className="w-4 h-4 text-rose-300" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-rose-200">New Collection 2025</span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Elevate Your <span className="text-rose-400">Style</span>
                  </h1>
                  <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    Discover timeless fashion and accessories crafted for the modern individual.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActivePage("shop")}
                    className="rounded-xl bg-rose-600 px-8 py-4 text-white font-semibold hover:bg-rose-700 transition-colors shadow-2xl flex items-center gap-2"
                  >
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="relative z-10 -mt-16 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              {[
                { icon: <Truck className="w-6 h-6" />, title: "Free Shipping", desc: "On orders over $100" },
                { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Payment", desc: "100% secure checkout" },
                { icon: <RotateCcw className="w-6 h-6" />, title: "Easy Returns", desc: "30-day return policy" },
              ].map((feat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className="rounded-2xl bg-white border border-gray-200 p-6 shadow-lg flex items-center gap-4">
                  <div className="rounded-xl bg-rose-50 p-3 text-rose-600">{feat.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feat.title}</h3>
                    <p className="text-sm text-gray-500">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section className="py-20 px-6">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-6xl mx-auto">
              <motion.div variants={fadeInUp} className="text-center mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2 mb-6">
                  <Star className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-rose-700">Featured</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Trending Now</h2>
              </motion.div>
              <div className="grid md:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} onAddToCart={addToCart} />
                ))}
              </div>
              <motion.div variants={fadeInUp} className="text-center mt-10">
                <button onClick={() => setActivePage("shop")} className="rounded-xl border-2 border-rose-300 px-8 py-3 font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-2 mx-auto">
                  View All Products <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          </section>
        </>
      )}

      {/* ==========================================
          SHOP PAGE
      ========================================== */}
      {activePage === "shop" && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop <span className="text-rose-600">Ketany Style</span></h1>
              <p className="text-gray-500">Discover our latest collection of fashion and accessories.</p>
            </motion.div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none w-64"
                />
              </div>
            </div>

            {/* PRODUCT GRID */}
            <motion.div layout className="grid md:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} onAddToCart={addToCart} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==========================================
          ABOUT PAGE
      ========================================== */}
      {activePage === "about" && (
        <section className="py-20 px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-5xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-rose-700">Our Story</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-rose-600">Ketany Style</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-600 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              Born in Iowa City, Ketany Style is more than a fashion brand — it's a celebration of individuality. We curate timeless pieces that empower you to express your unique style with confidence.
            </motion.p>
            <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px] w-full">
                <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop" alt="Ketany Style Store" fill className="object-cover" />
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 flex items-center justify-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold">Iowa City, IA</span>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="relative z-10 bg-gray-900 text-gray-300 pt-16 pb-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-500" /> Ketany Style
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">Elevating fashion in Iowa City. Discover timeless pieces for every occasion.</p>
              <div className="flex gap-3 mt-4">
                <div className="flex gap-3 mt-4">
                        {/* Instagram */}
                        <a href="#" className="rounded-lg bg-gray-800 p-2 hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        {/* Facebook */}
                        <a href="#" className="rounded-lg bg-gray-800 p-2 hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        {/* Twitter/X */}
                        <a href="#" className="rounded-lg bg-gray-800 p-2 hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
                        </a>
                        {/* YouTube */}
                        <a href="#" className="rounded-lg bg-gray-800 p-2 hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                        </a>
                        </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                {["Home", "Shop", "About", "Contact"].map((link) => (
                  <button key={link} onClick={() => setActivePage(link.toLowerCase())} className="block text-gray-400 hover:text-rose-400 transition-colors">{link}</button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> Iowa City, IA</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-rose-500" /> (319) 555-0198</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-rose-500" /> hello@ketanystyle.com</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-rose-500" /> Mon-Sat: 10AM-7PM</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <h4 className="text-white font-semibold mb-4">Newsletter</h4>
              {newsletterSubmitted ? (
                <div className="rounded-xl bg-green-900/50 border border-green-700 p-4 text-green-300 text-sm">
                  <p className="font-semibold">Subscribed!</p>
                  <p>Thank you for joining our newsletter.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <p className="text-sm text-gray-400">Get 10% off your first order. Stay updated on new arrivals.</p>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-rose-500 outline-none text-sm"
                  />
                  <button type="submit" className="w-full rounded-xl bg-rose-600 py-3 text-white font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Send className="w-4 h-4" /> Sign Up
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ketany Style. All rights reserved. | Designed with love in Iowa City.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

/* ==========================================
   PRODUCT CARD COMPONENT
========================================== */
function ProductCard({ product, index, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-2xl transition-shadow group"
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-rose-600 text-white text-xs font-bold px-3 py-1">
            {product.badge}
          </span>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm p-2 hover:bg-white"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-rose-600" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          onClick={handleAdd}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl px-6 py-2 font-semibold text-sm shadow-lg transition-colors ${
            isAdded ? "bg-green-500 text-white" : "bg-white text-gray-900 hover:bg-rose-600 hover:text-white"
          }`}
        >
          {isAdded ? "Added ✓" : "Add to Cart"}
        </motion.button>
      </div>
      <div className="p-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < product.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
          ))}
        </div>
        <p className="text-xl font-bold text-rose-600">${product.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
}