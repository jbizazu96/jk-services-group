"use client";

import UploadZone from "./UploadZone";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { uploadFile } from "@/utils/uploadFile";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";

// Icons
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Send,
  Music,
  Palette,
  LayoutDashboard,
  Image as ImageIcon,
  Mic,
  Video,
  Network,
  Monitor,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function ClientPortal() {
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");

  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formErrors, setFormErrors] = useState({});

  /* ==========================================
     FORM DATA
  ========================================== */

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceType: "",
    businessName: "",
    projectTitle: "",
    description: "",
    budget: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    audienceSize: "",
    musicPreferences: "",
    photoStyle: "",
    videoStyle: "",
    flyerSize: "",
    brandColors: "",
    inspirationLinks: "",
    websiteType: "",
    websiteGoals: "",
    supportType: "",
    issueType: "",
    networkType: "",
    buildingSize: "",
    conferenceType: "",
    technicalNeeds: "",
    additionalNotes: "",
    city: "",
    state: "",
    photoType: "",
    videoType: "",
    mcStyle: "",
    flyerPurpose: "",
    eventPlanningType: "",
    guestCount: "",
    domainName: "",
  });

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "serviceCategories"));
      const categoryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryData);

      // Preselect category from URL service
      if (serviceFromUrl) {
        const serviceSnapshot = await getDocs(collection(db, "services"));
        const foundService = serviceSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .find((service) => service.name === serviceFromUrl);

        if (foundService) {
          setSelectedCategory(foundService.category);
        }
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {
    if (!selectedCategory) {
      setServices([]);
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

      // Preselect service from URL
      if (serviceFromUrl) {
        const foundService = data.find((service) => service.name === serviceFromUrl);
        if (foundService) {
          handleServiceSelect(foundService.name);
        }
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  /* ==========================================
     PRESELECT SERVICE FROM URL
  ========================================== */

  useEffect(() => {
    if (!serviceFromUrl || services.length === 0) return;
    const foundService = services.find((service) => service.name === serviceFromUrl);
    if (foundService) {
      setSelectedService(foundService.name);
      setFormData((prev) => ({ ...prev, serviceType: foundService.name }));
    }
  }, [serviceFromUrl, services]);

  /* ==========================================
     HANDLE CHANGE
  ========================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* ==========================================
     SELECT SERVICE
  ========================================== */

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData((prev) => ({ ...prev, serviceType: service }));
  };

  /* ==========================================
     VALIDATE FORM
  ========================================== */

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!selectedService) errors.service = "Please select a service";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.description.trim()) errors.description = "Project description is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      const generatedRequestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // Upload files
      let uploadedFiles = [];
      if (files.length > 0) {
        uploadedFiles = await Promise.all(
          files.map(async (item) => {
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
            );

            const result = await uploadFile({
              file: item.file,
              requestId: generatedRequestId,
              onProgress: (progress) => {
                setFiles((prev) =>
                  prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
                );
              },
            });

            setFiles((prev) =>
              prev.map((f) =>
                f.id === item.id ? { ...f, progress: 100, status: "completed" } : f
              )
            );

            return result;
          })
        );
      }

      // Save to Firestore
      await addDoc(collection(db, "serviceRequests"), {
        ...formData,
        requestId: generatedRequestId,
        uploads: uploadedFiles,
        status: "pending",
        source: "website",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setRequestId(generatedRequestId);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     RESET FORM
  ========================================== */

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      serviceType: "",
      businessName: "",
      projectTitle: "",
      description: "",
      budget: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      audienceSize: "",
      musicPreferences: "",
      photoStyle: "",
      videoStyle: "",
      flyerSize: "",
      brandColors: "",
      inspirationLinks: "",
      websiteType: "",
      websiteGoals: "",
      supportType: "",
      issueType: "",
      networkType: "",
      buildingSize: "",
      conferenceType: "",
      technicalNeeds: "",
      additionalNotes: "",
      city: "",
      state: "",
      photoType: "",
      videoType: "",
      mcStyle: "",
      flyerPurpose: "",
      eventPlanningType: "",
      guestCount: "",
      domainName: "",
    });
    setSelectedService("");
    setFiles([]);
    setFormErrors({});
  };

  /* ==========================================
     SUCCESS SCREEN
  ========================================== */

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-xl p-10 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-gold/10 p-6">
              <CheckCircle className="h-12 w-12 text-gold" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Request Submitted!
          </h1>

          <p className="text-gray-600 text-lg text-center mb-8">
            We've received your request and will contact you within 24 hours.
          </p>

          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 text-center">
              Request ID
            </p>
            <p className="text-2xl font-mono font-semibold text-center text-gray-900">
              {requestId}
            </p>
            <p className="text-sm text-gray-500 text-center mt-3">
              Please save this ID for future reference
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={resetForm}
              className="rounded-xl bg-gold text-black px-8 py-3 font-semibold transition-all hover:bg-gold-dark hover:scale-[1.02]"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ==========================================
     MAIN FORM
  ========================================== */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />

      {/* Gold Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gold">
              Client Portal
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Service Request
            <span className="text-gold"> Form</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tell us about your project and we'll get back to you with a custom quote.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-6 md:p-10 shadow-xl"
        >
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Full Name *"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="John Doe"
                error={formErrors.customerName}
                required
              />
              <InputField
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                error={formErrors.email}
                required
              />
              <InputField
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(515) 000-0000"
                error={formErrors.phone}
                required
              />
              <InputField
                label="Business / Organization"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your company name"
              />
              <InputField
                label="City *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Fort Dodge"
                error={formErrors.city}
                required
              />
              <InputField
                label="State *"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Iowa"
                error={formErrors.state}
                required
              />
            </div>
          </div>

          {/* Service Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Service Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category *
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedService("");
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => handleServiceSelect(e.target.value)}
                  disabled={!selectedCategory}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formErrors.service && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.service}
              </p>
            )}
          </div>

          {/* Dynamic Service Sections */}
          {selectedService === "DJ Services" && (
            <ServiceSection icon={<Music />} title="DJ Event Details">
              <InputField label="Event Type *" name="eventType" value={formData.eventType} onChange={handleChange} placeholder="Wedding, Birthday..." />
              <InputField type="date" label="Event Date *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <InputField type="time" label="Event Time" name="eventTime" value={formData.eventTime} onChange={handleChange} />
              <InputField label="Venue *" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Venue name" />
              <InputField label="Audience Size *" name="audienceSize" value={formData.audienceSize} onChange={handleChange} placeholder="100, 300..." />
            </ServiceSection>
          )}

          {selectedService === "MC Services" && (
            <ServiceSection icon={<Mic />} title="MC Service Details">
              <InputField label="Event Type *" name="eventType" value={formData.eventType} onChange={handleChange} placeholder="Wedding, Conference..." />
              <InputField type="date" label="Event Date *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <InputField label="Venue *" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Venue Name" />
              <InputField label="Audience Size *" name="audienceSize" value={formData.audienceSize} onChange={handleChange} placeholder="100, 500..." />
              <InputField label="Languages Needed" name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} placeholder="English, French..." />
            </ServiceSection>
          )}

          {selectedService === "Photography" && (
            <ServiceSection icon={<ImageIcon />} title="Photography Details">
              <InputField label="Photography Type *" name="photoType" value={formData.photoType} onChange={handleChange} placeholder="Wedding, Portrait..." />
              <InputField type="date" label="Session Date *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <InputField label="Location *" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Venue or City" />
            </ServiceSection>
          )}

          {selectedService === "Videography" && (
            <ServiceSection icon={<Video />} title="Videography Details">
              <InputField label="Video Type *" name="videoType" value={formData.videoType} onChange={handleChange} placeholder="Wedding, Promo..." />
              <InputField type="date" label="Shoot Date *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <InputField label="Location *" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Venue or City" />
            </ServiceSection>
          )}

          {selectedService === "Flyer Design" && (
            <ServiceSection icon={<Palette />} title="Flyer Design Details">
              <InputField label="Flyer Purpose *" name="flyerPurpose" value={formData.flyerPurpose} onChange={handleChange} placeholder="Event, Promotion..." />
              <InputField type="date" label="Deadline *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
            </ServiceSection>
          )}

          {selectedService === "Website Development" && (
            <ServiceSection icon={<LayoutDashboard />} title="Website Details">
              <InputField label="Website Type *" name="websiteType" value={formData.websiteType} onChange={handleChange} placeholder="Business, Ecommerce..." />
              <InputField label="Project Goals *" name="websiteGoals" value={formData.websiteGoals} onChange={handleChange} placeholder="Sales, leads..." />
            </ServiceSection>
          )}

          {selectedService === "Domain Registration & Management" && (
            <ServiceSection icon={<LayoutDashboard />} title="Domain Details">
              <InputField label="Domain Name *" name="domainName" value={formData.domainName} onChange={handleChange} placeholder="mydomain.com" />
            </ServiceSection>
          )}

          {selectedService === "IT Support" && (
            <ServiceSection icon={<Monitor />} title="IT Support Details">
              <InputField label="Support Type *" name="supportType" value={formData.supportType} onChange={handleChange} placeholder="Residential or Business" />
              <InputField label="Describe Issue *" name="issueType" value={formData.issueType} onChange={handleChange} placeholder="Printer, Email, Virus..." />
            </ServiceSection>
          )}

          {selectedService === "Network Installation" && (
            <ServiceSection icon={<Network />} title="Network Project Details">
              <InputField label="Network Type *" name="networkType" value={formData.networkType} onChange={handleChange} placeholder="Office, Home, WiFi..." />
            </ServiceSection>
          )}

          {selectedService === "Conferences" && (
            <ServiceSection icon={<Building2 />} title="Conference Details">
              <InputField label="Conference Type *" name="conferenceType" value={formData.conferenceType} onChange={handleChange} placeholder="Business, Church..." />
              <InputField label="Technical Needs *" name="technicalNeeds" value={formData.technicalNeeds} onChange={handleChange} placeholder="Streaming, Audio..." />
            </ServiceSection>
          )}

          {selectedService === "Event Planning" && (
            <ServiceSection icon={<Calendar />} title="Event Planning Details">
              <InputField label="Event Type *" name="eventPlanningType" value={formData.eventPlanningType} onChange={handleChange} placeholder="Wedding, Birthday..." />
              <InputField type="date" label="Event Date *" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <InputField label="Venue *" name="eventLocation" value={formData.eventLocation} onChange={handleChange} placeholder="Venue Name" />
              <InputField label="Estimated Guests *" name="guestCount" value={formData.guestCount} onChange={handleChange} placeholder="100, 500..." />
            </ServiceSection>
          )}

          {/* Project Description */}
          <div className="mt-8">
            <TextareaField
              label="Project Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your project in detail..."
              error={formErrors.description}
              required
            />
          </div>

          {/* File Upload */}
          <UploadZone files={files} setFiles={setFiles} />

          {/* Submit Button */}
          <div className="mt-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !selectedService}
              className="inline-flex items-center gap-3 rounded-xl bg-gold px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-gold-dark hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Project Request
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

/* ==========================================
   SERVICE SECTION COMPONENT
========================================== */

function ServiceSection({ icon, title, children }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-xl bg-gold/10 p-2.5 text-gold">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

/* ==========================================
   INPUT FIELD COMPONENT
========================================== */

function InputField({ label, name, value, onChange, placeholder, type = "text", error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border ${error ? "border-red-400" : "border-gray-300"} bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none`}
      />
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

/* ==========================================
   TEXTAREA FIELD COMPONENT
========================================== */

function TextareaField({ label, name, value, onChange, placeholder, rows = 5, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <textarea
        rows={rows}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border ${error ? "border-red-400" : "border-gray-300"} bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none resize-none`}
      />
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}