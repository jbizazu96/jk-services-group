// src/lia/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Store,
  ShoppingBag,
  Truck,
  Clock,
  Shield,
  Star,
  Sparkles,
  ChevronRight,
  Users,
} from "lucide-react";

export default function LIARegistrationPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    storeName: "",
    preferredContactMethod: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format phone number as user types: (222) 222 - 2222
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX - XXXX
    if (cleaned.length === 0) {
      return '';
    } else if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} - ${cleaned.slice(6, 10)}`;
    }
  };

  // Clean phone number for storage (remove formatting)
  const cleanPhoneNumber = (value) => {
    return value.replace(/\D/g, '');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    
    // Validate phone has at least 10 digits
    const phoneDigits = cleanPhoneNumber(formData.phone);
    if (!formData.phone.trim() || phoneDigits.length < 10) {
      errors.phone = "Valid phone number is required (10 digits)";
    }
    
    if (!formData.city.trim()) errors.city = "City is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Store phone number without formatting
      const cleanPhone = cleanPhoneNumber(formData.phone);
      
      await addDoc(collection(db, "liaCustomers"), {
        fullName: formData.fullName,
        email: formData.email,
        phone: cleanPhone, // Store unformatted
        phoneFormatted: formData.phone, // Store formatted version for display
        city: formData.city,
        storeName: formData.storeName || "",
        preferredContactMethod: formData.preferredContactMethod || "",
        status: "waitlist",
        source: "lia_landing_page",
        registeredAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        storeName: "",
        preferredContactMethod: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50/30">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to JK Services
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:sticky lg:top-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16">
                <Image
                  src="/lia/lia-512.png"
                  alt="LIA Store Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LIA Store</h1>
                <p className="text-sm text-emerald-600 font-medium">Delivery App</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Coming Soon
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Your Local Store,
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  At Your Doorstep
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-6">
                LIA connects you to your favorite local grocery stores. Order fresh produce,
                household essentials, and more — delivered straight to your door.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Store, label: "Local Stores", color: "emerald" },
                  { icon: ShoppingBag, label: "Easy Ordering", color: "teal" },
                  { icon: Truck, label: "Fast Delivery", color: "emerald" },
                  { icon: Clock, label: "Real-time Tracking", color: "teal" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-gray-100 shadow-sm"
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>100+ Local Stores</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-emerald-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
          >
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Get Early Access</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Be the first to know when LIA launches in your city
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
                      }}
                      className={`w-full rounded-xl border ${
                        formErrors.fullName ? "border-red-400" : "border-gray-200"
                      } px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors`}
                      placeholder="John Doe"
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                        }}
                        className={`w-full rounded-xl border ${
                          formErrors.email ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors`}
                        placeholder="john@email.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(222) 222 - 2222"
                        className={`w-full rounded-xl border ${
                          formErrors.phone ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors`}
                        maxLength={17} // (XXX) XXX - XXXX = 17 characters
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Your City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (formErrors.city) setFormErrors({ ...formErrors, city: "" });
                      }}
                      className={`w-full rounded-xl border ${
                        formErrors.city ? "border-red-400" : "border-gray-200"
                      } px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors`}
                      placeholder="e.g., Los Angeles, CA"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  {/* Store Name (Optional) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Store Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                      placeholder="Your favorite local store"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContactMethod}
                      onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                    >
                      <option value="">Select option</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS/Call</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" /> Get Early Access
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    By signing up, you agree to receive updates about LIA Store.
                    Your information will not be shared with third parties.
                  </p>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="rounded-full bg-emerald-100 p-4 inline-flex mb-6">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  You're on the List! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for joining the LIA Store waitlist. We'll notify you as soon as
                  the app launches in your area.
                </p>
                <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
                  <p className="text-sm text-emerald-700">
                    <span className="font-semibold">Next Steps:</span> We'll send you early
                    access updates, launch announcements, and exclusive offers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      city: "",
                      storeName: "",
                      preferredContactMethod: "",
                    });
                  }}
                  className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm"
                >
                  ← Back to form
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <span>© 2026 LIA Store. All rights reserved.</span>
            <span className="text-gray-300">|</span>
            <span>Part of JK Service Group</span>
          </div>
          <p className="text-xs text-gray-400">
            LIA connects you to local stores — fresh groceries, delivered.
          </p>
        </motion.div>
      </div>
    </div>
  );
}