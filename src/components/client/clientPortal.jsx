"use client";

import UploadZone from "./UploadZone";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { uploadFile } from "@/utils/uploadFile";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  Sparkles,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Send,
  Globe,
  Users,
  Music,
  Palette,
  LayoutDashboard,
  Image as ImageIcon,
  Mic,
  Video,
  Network,
  Monitor,
  Building2,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

const services = [
  {
    title: "DJ Services",
    description: "Professional DJ entertainment experience",
  },
  {
    title: "MC Services",
    description: "Master of ceremony for weddings & events",
  },
  {
    title: "Photography",
    description: "Premium cinematic photography",
  },
  {
    title: "Videography",
    description: "Luxury event videography production",
  },
  {
    title: "Flyer Design",
    description: "Creative flyer & branding design",
  },
  {
    title: "Website Development",
    description: "Modern business websites & platforms",
  },
  {
    title: "IT Support",
    description: "Business & residential IT support",
  },
  {
    title: "Network Installation",
    description: "Enterprise network solutions",
  },
  {
    title: "Event Planning",
    description: "Professional event coordination",
  },
  {
    title: "Conferences",
    description: "Conference production & management",
  },
];

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function ClientPortal() {

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [selectedService, setSelectedService] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [requestId, setRequestId] = useState("");

  const [files, setFiles] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | FORM DATA
  |--------------------------------------------------------------------------
  */

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

    website: "",
    websiteType: "",
    websiteGoals: "",
    websiteFeatures: "",

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

    flyerType: "",
    flyerPurpose: "",

    eventPlanningType: "",
    guestCount: "",
    themeStyle: "",
  });

  /*
  |--------------------------------------------------------------------------
  | HANDLE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT SERVICE
  |--------------------------------------------------------------------------
  */

  const handleServiceSelect = (service) => {

    setSelectedService(service);

    setFormData({
      ...formData,
      serviceType: service,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | REQUEST ID
      |--------------------------------------------------------------------------
      */

      const generatedRequestId =
        `REQ-${Date.now()}`;

      /*
      |--------------------------------------------------------------------------
      | UPLOAD FILES
      |--------------------------------------------------------------------------
      */

      let uploadedFiles = [];

      if (files.length > 0) {

        uploadedFiles = await Promise.all(

          files.map(async (item) => {

            return await uploadFile({
              file: item.file,
              requestId: generatedRequestId,
            });
          })
        );
      }

      /*
      |--------------------------------------------------------------------------
      | SAVE TO FIRESTORE
      |--------------------------------------------------------------------------
      */

      await addDoc(
        collection(db, "serviceRequests"),
        {
          ...formData,

          requestId: generatedRequestId,

          uploads: uploadedFiles,

          status: "pending",

          source: "website",

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      setRequestId(generatedRequestId);

      setSuccess(true);

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    } finally {

      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUCCESS SCREEN
  |--------------------------------------------------------------------------
  */

  if (success) {

    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8f5ef] px-6">

        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop"
            alt="Background"
            fill
            priority
            className="object-cover opacity-[0.14]"
          />
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-white/80" />

        {/* GOLD LIGHT */}
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#D4AF37]/20 blur-[140px]" />

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full rounded-[2.5rem] border border-white/50 bg-white/70 backdrop-blur-3xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
        >

          <div className="flex justify-center mb-8">
            <div className="rounded-3xl bg-[#D4AF37]/10 p-6">
              <Sparkles className="h-12 w-12 text-[#b8860b]" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-center text-[#111111] mb-6">
            Request Submitted
          </h1>

          <p className="text-[#555555] text-lg leading-relaxed text-center mb-10">
            Your request has been successfully submitted.
          </p>

          <div className="rounded-3xl bg-[#faf7f2] border border-[#ece6da] p-6 mb-8">

            <p className="text-sm uppercase tracking-[0.3em] text-[#777777] mb-3 text-center">
              Request ID
            </p>

            <p className="text-2xl font-semibold text-center text-[#111111]">
              {requestId}
            </p>
          </div>

          <div className="flex justify-center">

            <button
              onClick={() => setSuccess(false)}
              className="rounded-2xl bg-gradient-to-r from-[#f5deb3] to-[#D4AF37] text-black px-8 py-4 font-semibold"
            >
              Submit Another Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f5ef]">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop"
          alt="Background"
          fill
          priority
          className="object-cover opacity-[0.14]"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/82" />

      {/* GOLD LIGHT */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-[#D4AF37]/15 blur-[140px]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >

          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <div className="rounded-[2rem] border border-white/50 bg-white/70 backdrop-blur-3xl px-10 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

              <Image
                src="/images/logo1.png"
                alt="J&K Services Group"
                width={240}
                height={80}
                priority
                className="h-auto w-auto object-contain"
                />
            </div>
          </div>

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-5 py-2 text-sm text-[#b8860b] mb-8">

            <Sparkles className="h-4 w-4" />

            Premium Client Portal
          </div>

          {/* TITLE */}
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] max-w-6xl mx-auto text-[#111111]">

            Let’s Build Your

            <span className="block bg-gradient-to-r from-[#111111] via-[#b8860b] to-[#D4AF37] bg-clip-text text-transparent">
              Next Experience
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="max-w-3xl mx-auto mt-10 text-lg md:text-xl text-[#555555] leading-relaxed">
            Submit your project details and creative vision through
            our premium luxury client experience.
          </p>
        </motion.div>

        {/* SERVICES */}
        <div className="mb-20">

          <div className="flex items-center gap-4 mb-10">

            <div className="h-px flex-1 bg-[#dddddd]" />

            <p className="text-sm uppercase tracking-[0.35em] text-[#777777]">
              Select A Service
            </p>

            <div className="h-px flex-1 bg-[#dddddd]" />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {services.map((service, index) => (

              <motion.button
                key={service.title}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleServiceSelect(service.title)}
                className={`rounded-[2rem] border p-7 text-left backdrop-blur-2xl transition-all duration-300 ${
                  selectedService === service.title
                    ? "border-[#D4AF37]/40 bg-gradient-to-br from-[#f5deb3] to-[#D4AF37] text-black shadow-[0_20px_60px_rgba(212,175,55,0.25)]"
                    : "border-white/60 bg-white/65 hover:bg-white/85 shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
                }`}
              >

                <h3 className="text-2xl font-semibold mb-3">
                  {service.title}
                </h3>

                <p
                  className={`leading-relaxed ${
                    selectedService === service.title
                      ? "text-black/80"
                      : "text-[#555555]"
                  }`}
                >
                  {service.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-[2.5rem] border border-white/50 bg-white/70 backdrop-blur-3xl p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
        >

            {/*
            |--------------------------------------------------------------------------
            | UNIVERSAL FIELDS
            |--------------------------------------------------------------------------
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            <InputField
                icon={<User className="h-5 w-5" />}
                label="Full Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="John Doe"
                required
            />

            <InputField
                icon={<Mail className="h-5 w-5" />}
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
            />

            <InputField
                icon={<Phone className="h-5 w-5" />}
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(515) 000-0000"
            />

            <InputField
                icon={<Briefcase className="h-5 w-5" />}
                label="Business / Organization"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Company or organization"
            />

            {/* CITY */}
            <InputField
                icon={<MapPin className="h-5 w-5" />}
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Fort Dodge"
            />

            {/* STATE */}
            <InputField
                icon={<MapPin className="h-5 w-5" />}
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Iowa"
            />
            </div>

            { /*
            |--------------------------------------------------------------------------
            | DJ ENTERTAINMENT
            |--------------------------------------------------------------------------
            */}
          {selectedService === "DJ Services" && (

            <ServiceSection
              icon={<Music className="h-5 w-5" />}
              title="DJ Event Details"
            >

              <InputField
                label="Event Type"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                placeholder="Wedding, Birthday..."
              />

              <InputField
                type="date"
                label="Event Date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
              />

              <InputField
                type="time"
                label="Event Time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
              />

              <InputField
                label="Venue"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Venue name"
              />

              <InputField
                label="Audience Size"
                name="audienceSize"
                value={formData.audienceSize}
                onChange={handleChange}
                placeholder="100, 300..."
              />

              <InputField
                label="Music Preferences"
                name="musicPreferences"
                value={formData.musicPreferences}
                onChange={handleChange}
                placeholder="Afrobeats, Gospel..."
              />
            </ServiceSection>
          )}

            {/*
            |--------------------------------------------------------------------------
            | MC SERVICES
            |--------------------------------------------------------------------------
            */}

            {selectedService === "MC Services" && (

            <ServiceSection
                icon={<Mic className="h-5 w-5" />}
                title="MC Service Details"
            >

                <InputField
                label="Event Type"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                placeholder="Wedding, Conference..."
                />

                <InputField
                type="date"
                label="Event Date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                />

                <InputField
                label="Venue"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Venue Name"
                />

                <InputField
                label="Audience Size"
                name="audienceSize"
                value={formData.audienceSize}
                onChange={handleChange}
                placeholder="100, 500..."
                />

                <InputField
                label="MC Style"
                name="mcStyle"
                value={formData.mcStyle}
                onChange={handleChange}
                placeholder="Formal, Fun, Cultural..."
                />

                <InputField
                label="Languages Needed"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="English, French..."
                />

            </ServiceSection>
            )}

                {/*
                |--------------------------------------------------------------------------
                | PHOTOGRAPHY
                |--------------------------------------------------------------------------
                */}

                {selectedService === "Photography" && (

                <ServiceSection
                    icon={<ImageIcon className="h-5 w-5" />}
                    title="Photography Details"
                >

                    <InputField
                    label="Photography Type"
                    name="photoType"
                    value={formData.photoType}
                    onChange={handleChange}
                    placeholder="Wedding, Portrait..."
                    />

                    <InputField
                    type="date"
                    label="Session Date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    />

                    <InputField
                    label="Location"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Venue or City"
                    />

                    <InputField
                    label="Photography Style"
                    name="photoStyle"
                    value={formData.photoStyle}
                    onChange={handleChange}
                    placeholder="Cinematic, Editorial..."
                    />

                    <InputField
                    label="Audience Size"
                    name="audienceSize"
                    value={formData.audienceSize}
                    onChange={handleChange}
                    placeholder="Guests or attendees"
                    />

                    <InputField
                    label="Delivery Needed"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Album, Rush Delivery..."
                    />

                </ServiceSection>
                )}

                {/*
                |--------------------------------------------------------------------------
                | VIDEOGRAPHY
                |--------------------------------------------------------------------------
                */}

                {selectedService === "Videography" && (

                <ServiceSection
                    icon={<Video className="h-5 w-5" />}
                    title="Videography Details"
                >

                    <InputField
                    label="Video Type"
                    name="videoType"
                    value={formData.videoType}
                    onChange={handleChange}
                    placeholder="Wedding, Promo..."
                    />

                    <InputField
                    type="date"
                    label="Shoot Date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    />

                    <InputField
                    label="Location"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Venue or City"
                    />

                    <InputField
                    label="Video Style"
                    name="videoStyle"
                    value={formData.videoStyle}
                    onChange={handleChange}
                    placeholder="Luxury, Documentary..."
                    />

                    <InputField
                    label="Drone Needed?"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Yes or No"
                    />

                    <InputField
                    label="Final Deliverables"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    placeholder="Highlight Reel, Full Video..."
                    />

                </ServiceSection>
                )}

                {/*
                |--------------------------------------------------------------------------
                | FLYER DESIGN
                |--------------------------------------------------------------------------
                */}

                {selectedService === "Flyer Design" && (

                <ServiceSection
                    icon={<Palette className="h-5 w-5" />}
                    title="Flyer Design Details"
                >

                    <InputField
                    label="Flyer Type"
                    name="flyerType"
                    value={formData.flyerType}
                    onChange={handleChange}
                    placeholder="Instagram, Poster..."
                    />

                    <InputField
                    label="Flyer Purpose"
                    name="flyerPurpose"
                    value={formData.flyerPurpose}
                    onChange={handleChange}
                    placeholder="Event, Promotion..."
                    />

                    <InputField
                    label="Brand Colors"
                    name="brandColors"
                    value={formData.brandColors}
                    onChange={handleChange}
                    placeholder="Gold, Black..."
                    />

                    <InputField
                    label="Flyer Size"
                    name="flyerSize"
                    value={formData.flyerSize}
                    onChange={handleChange}
                    placeholder="Story, Square..."
                    />

                    <InputField
                    label="Deadline"
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    />

                    <InputField
                    label="Inspiration Links"
                    name="inspirationLinks"
                    value={formData.inspirationLinks}
                    onChange={handleChange}
                    placeholder="Pinterest, Behance..."
                    />

                </ServiceSection>
                )}

                {/*
                |--------------------------------------------------------------------------
                | EVENT PLANNING
                |--------------------------------------------------------------------------
                */}

                {selectedService === "Event Planning" && (

                <ServiceSection
                    icon={<Calendar className="h-5 w-5" />}
                    title="Event Planning Details"
                >

                    <InputField
                    label="Event Type"
                    name="eventPlanningType"
                    value={formData.eventPlanningType}
                    onChange={handleChange}
                    placeholder="Wedding, Birthday..."
                    />

                    <InputField
                    type="date"
                    label="Event Date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    />

                    <InputField
                    label="Venue / Location"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    placeholder="Venue Name"
                    />

                    <InputField
                    label="Estimated Guests"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    placeholder="100, 500..."
                    />

                    <InputField
                    label="Theme / Style"
                    name="themeStyle"
                    value={formData.themeStyle}
                    onChange={handleChange}
                    placeholder="Luxury, Traditional..."
                    />

                    <InputField
                    label="Services Needed"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    placeholder="DJ, Decor, Catering..."
                    />

                </ServiceSection>
                )}

            {/*
            |--------------------------------------------------------------------------
            | WEBSITES
            |--------------------------------------------------------------------------
            */}
          {selectedService === "Website Development" && (

            <ServiceSection
              icon={<LayoutDashboard className="h-5 w-5" />}
              title="Website Details"
            >

              <InputField
                label="Website Type"
                name="websiteType"
                value={formData.websiteType}
                onChange={handleChange}
                placeholder="Business, Ecommerce..."
              />

              <InputField
                label="Project Goals"
                name="websiteGoals"
                value={formData.websiteGoals}
                onChange={handleChange}
                placeholder="Sales, leads..."
              />

              <InputField
                icon={<Globe className="h-5 w-5" />}
                label="Current Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <InputField
                label="Desired Features"
                name="websiteFeatures"
                value={formData.websiteFeatures}
                onChange={handleChange}
                placeholder="Booking, Dashboard..."
              />
            </ServiceSection>
          )}

            { /*
            |--------------------------------------------------------------------------
            | IT SUPPORTS
            |--------------------------------------------------------------------------
            */}
          {selectedService === "IT Support" && (

            <ServiceSection
              icon={<Monitor className="h-5 w-5" />}
              title="IT Support Details"
            >

              <InputField
                label="Support Type"
                name="supportType"
                value={formData.supportType}
                onChange={handleChange}
                placeholder="Residential or Business"
              />

              <InputField
                label="Issue Type"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                placeholder="Printer, Email, Virus..."
              />
            </ServiceSection>
          )}

            {/*
            |--------------------------------------------------------------------------
            | NETWORKING
            |--------------------------------------------------------------------------
            */}
          {selectedService === "Network Installation" && (

            <ServiceSection
              icon={<Network className="h-5 w-5" />}
              title="Network Project Details"
            >

              <InputField
                label="Network Type"
                name="networkType"
                value={formData.networkType}
                onChange={handleChange}
                placeholder="Office, Home, WiFi..."
              />

              <InputField
                label="Building Size"
                name="buildingSize"
                value={formData.buildingSize}
                onChange={handleChange}
                placeholder="Sq ft or floors"
              />
            </ServiceSection>
          )}

            {/*
            |--------------------------------------------------------------------------
            | CONFERENCES
            |--------------------------------------------------------------------------
            */}
          {selectedService === "Conferences" && (

            <ServiceSection
              icon={<Building2 className="h-5 w-5" />}
              title="Conference Details"
            >

              <InputField
                label="Conference Type"
                name="conferenceType"
                value={formData.conferenceType}
                onChange={handleChange}
                placeholder="Business, Church..."
              />

              <InputField
                label="Technical Needs"
                name="technicalNeeds"
                value={formData.technicalNeeds}
                onChange={handleChange}
                placeholder="Streaming, Audio..."
              />
            </ServiceSection>
          )}

          {/* DESCRIPTION */}
          <div className="mt-10">

            <TextareaField
              label="Project Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              required
            />
          </div>

          {/* UPLOADS */}
          <UploadZone
            files={files}
            setFiles={setFiles}
          />

          {/* NOTES */}
          <div className="mt-10">

            <TextareaField
              label="Additional Notes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Anything else?"
            />
          </div>

          {/* SUBMIT */}
          <div className="mt-14 flex justify-center">

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !selectedService}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#f5deb3] to-[#D4AF37] text-black px-10 py-5 text-lg font-semibold transition-all duration-300 hover:shadow-[0_20px_60px_rgba(212,175,55,0.35)] disabled:opacity-50"
            >

              {loading
                ? "Submitting..."
                : "Submit Project Request"}

              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SERVICE SECTION
|--------------------------------------------------------------------------
*/

function ServiceSection({
  icon,
  title,
  children,
}) {

  return (
    <div className="mt-14">

      <div className="flex items-center gap-3 mb-8">

        <div className="rounded-xl bg-[#D4AF37]/10 p-3 text-[#b8860b]">
          {icon}
        </div>

        <h3 className="text-2xl font-semibold text-[#111111]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {children}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| INPUT FIELD
|--------------------------------------------------------------------------
*/

function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {

  return (
    <div>

      <label className="block text-sm text-[#444444] mb-3">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-2xl border border-[#e5e5e5] bg-white/80 py-4 pr-4 text-[#111111] placeholder:text-[#999999] outline-none transition-all duration-300 focus:border-[#D4AF37]/40 focus:bg-white ${
            icon ? "pl-12" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TEXTAREA FIELD
|--------------------------------------------------------------------------
*/

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 5,
  required = false,
}) {

  return (
    <div>

      <label className="block text-sm text-[#444444] mb-3">
        {label}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[2rem] border border-[#e5e5e5] bg-white/80 px-5 py-5 text-[#111111] placeholder:text-[#999999] outline-none transition-all duration-300 focus:border-[#D4AF37]/40 focus:bg-white resize-none"
      />
    </div>
  );
}