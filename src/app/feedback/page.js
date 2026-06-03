"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
} from "react";

/* ==========================================
   NEXT
========================================== */

import Image from "next/image";
import Link from "next/link";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion, AnimatePresence } from "framer-motion";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   ICONS
========================================== */

import {
  Sparkles,
  Star,
  CheckCircle2,
  Home,
  RotateCcw,
  User,
  Briefcase,
  MessageCircle,
  Send,
  AlertCircle,
  ThumbsUp,
  Heart,
  Smile,
} from "lucide-react";

/* ==========================================
   RATING EMOJIS
========================================== */

const ratingEmojis = {
  1: { emoji: "😞", label: "Very Dissatisfied" },
  2: { emoji: "😐", label: "Dissatisfied" },
  3: { emoji: "🙂", label: "Neutral" },
  4: { emoji: "😊", label: "Satisfied" },
  5: { emoji: "🌟", label: "Very Satisfied" },
};

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function FeedbackPage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedbackId, setFeedbackId] = useState("");
  const [hoveredRating, setHoveredRating] = useState(null);
  const [errors, setErrors] = useState({});

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "serviceCategories"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {
    if (!selectedCategory) {
      setServices([]);
      setSelectedService("");
      return;
    }
    loadServices();
  }, [selectedCategory]);

  const loadServices = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "services"), where("category", "==", selectedCategory))
      );
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
     VALIDATE FORM
  ========================================== */

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!selectedCategory) newErrors.category = "Please select a category";
    if (!selectedService) newErrors.service = "Please select a service";
    if (!feedback.trim()) newErrors.feedback = "Please share your experience";
    if (feedback.trim().length < 10) newErrors.feedback = "Please provide more detail (minimum 10 characters)";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ==========================================
     RESET FORM
  ========================================== */

  const resetForm = () => {
    setName("");
    setSelectedCategory("");
    setSelectedService("");
    setRating(5);
    setFeedback("");
    setServices([]);
    setFeedbackId("");
    setSuccess(false);
    setErrors({});
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);
      const generatedId = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      await addDoc(collection(db, "feedbacks"), {
        name,
        category: selectedCategory,
        service: selectedService,
        rating,
        feedback,
        approved: false,
        feedbackId: generatedId,
        createdAt: serverTimestamp(),
      });

      setFeedbackId(generatedId);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Unable to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     SUCCESS SCREEN
  ========================================== */

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
        
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gold/15 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl p-10 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto mb-6"
          >
            <div className="rounded-full bg-green-100 p-4 inline-flex">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Thank You!
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            Your feedback has been submitted.
          </p>
          
          <p className="text-gray-500 text-sm mb-8">
            We appreciate you taking the time to share your experience.
          </p>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Reference ID
            </p>
            <p className="text-2xl font-mono font-semibold text-gray-900">
              {feedbackId}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Please save this ID for reference
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetForm}
              className="flex-1 rounded-xl bg-gold px-6 py-3 font-semibold text-black transition-all hover:bg-gold-dark hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Submit Another Feedback
            </button>
            <Link
              href="/"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ==========================================
     FORM PAGE
  ========================================== */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />

      {/* Gold Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-10"
        >
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl px-8 py-5 shadow-lg">
            <Image
              src="/images/logo1.webp"
              alt="J&K Services Group"
              width={240}
              height={80}
              priority
              className="w-auto h-auto"
            />
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gold">
              Share Your Experience
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Your Feedback
            <span className="text-gold"> Matters</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us improve by sharing your experience with our services.
            Your feedback helps us serve you better.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-6 md:p-10 shadow-xl"
        >
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border ${errors.name ? "border-red-400" : "border-gray-300"} bg-white pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedService("");
                    if (errors.category) setErrors({ ...errors, category: "" });
                  }}
                  className={`w-full rounded-xl border ${errors.category ? "border-red-400" : "border-gray-300"} bg-white pl-12 pr-4 py-3 text-gray-900 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none appearance-none`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Service Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    if (errors.service) setErrors({ ...errors, service: "" });
                  }}
                  disabled={!selectedCategory}
                  className={`w-full rounded-xl border ${errors.service ? "border-red-400" : "border-gray-300"} bg-white pl-12 pr-4 py-3 text-gray-900 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none appearance-none disabled:opacity-50 disabled:bg-gray-100`}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.service && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.service}
                </p>
              )}
            </div>

            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Your Experience <span className="text-gold">*</span>
              </label>
              <div className="flex flex-col items-center p-6 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={44}
                        className={`transition-all duration-200 ${
                          star <= (hoveredRating ?? rating)
                            ? "fill-gold text-gold"
                            : "fill-gray-200 text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-2xl mr-2">{ratingEmojis[rating]?.emoji}</span>
                  <span className="text-gray-600 font-medium">
                    {ratingEmojis[rating]?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback <span className="text-gold">*</span>
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (errors.feedback) setErrors({ ...errors, feedback: "" });
                  }}
                  placeholder="Tell us about your experience. What did you like? What could we improve?"
                  className={`w-full rounded-xl border ${errors.feedback ? "border-red-400" : "border-gray-300"} bg-white pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none resize-none`}
                />
              </div>
              {errors.feedback && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.feedback}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gold py-4 text-lg font-semibold text-black transition-all hover:bg-gold-dark hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </motion.button>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400 pt-4">
              Your feedback helps us improve our services. Thank you for your honesty!
            </p>
          </div>
        </motion.form>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <ThumbsUp className="w-4 h-4" />
            <span>All feedback is reviewed by our team</span>
            <Heart className="w-4 h-4 text-gold" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}