"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, MapPin, Phone, Mail, Clock, Calendar, Video, Church, Heart, Send, CheckCircle2 } from "lucide-react";

export default function ChurchPage() {
  const [prayerName, setPrayerName] = useState("");
  const [prayerEmail, setPrayerEmail] = useState("");
  const [prayerPhone, setPrayerPhone] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePrayerForm = () => {
    const newErrors = {};
    if (!prayerName.trim()) newErrors.name = "Name is required";
    if (!prayerEmail.trim()) newErrors.email = "Email is required";
    if (!prayerRequest.trim()) newErrors.request = "Please share your prayer request";
    if (prayerRequest.trim().length < 5) newErrors.request = "Please provide more detail";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (!validatePrayerForm()) return;
    setPrayerSubmitted(true);
  };

  const resetPrayerForm = () => {
    setPrayerName("");
    setPrayerEmail("");
    setPrayerPhone("");
    setPrayerRequest("");
    setPrayerSubmitted(false);
    setErrors({});
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Gold Glow Background */}
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* ==========================================
          HEADER / NAVIGATION
      ========================================== */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Church className="w-7 h-7 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">
              Sion Blessing <span className="text-amber-600">Ministries</span>
            </span>
          </div>
          <nav className="flex gap-8">
            {["home", "about", "services", "prayer", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-sm font-medium text-gray-600 hover:text-amber-700 border-b-2 border-transparent hover:border-amber-500 transition-colors pb-1"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section id="home" className="relative w-full">
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
            alt="Church worship"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Sion Blessing Ministries
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow-md">
              Faith, Fellowship & Blessings in Iowa City
            </p>
            <a
              href="#prayer"
              className="rounded-xl bg-amber-500 px-8 py-4 text-base font-semibold text-gray-900 hover:bg-amber-600 transition-colors shadow-lg"
            >
              Send Prayer Request
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          WELCOME SECTION
      ========================================== */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
              Welcome Home
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Our <span className="text-amber-600">Church</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-14">
            We are a vibrant community rooted in faith, love, and service. Join us as we grow together in God's word.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Video className="w-7 h-7 text-amber-600" />, title: "Prayer Meetings", desc: "Daily Zoom prayers & Friday temple gathering to uplift your spirit." },
              { icon: <Church className="w-7 h-7 text-amber-600" />, title: "Sunday Worship", desc: "Two services every Sunday: 8AM & 12PM. All are welcome." },
              { icon: <Heart className="w-7 h-7 text-amber-600" />, title: "Community Care", desc: "Serving Iowa City with compassion and outreach programs." },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-amber-50 p-4 inline-flex mb-5">{card.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          ABOUT SECTION
      ========================================== */}
      <section id="about" className="relative z-10 py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Church fellowship"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-5">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Our <span className="text-amber-600">Ministry</span>
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">
                Founded on the principles of faith, hope and love, we have been serving the Iowa City community for years. Our mission is to spread the gospel and provide a spiritual home for everyone.
              </p>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                  <strong>1024 Gilbert St, Iowa City, IA 52240</strong>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                  (319) 555-0147
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SERVICES / SCHEDULE SECTION
      ========================================== */}
      <section id="services" className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-5">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Join Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Weekly Service <span className="text-amber-600">Schedule</span>
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {[
              { day: "Monday – Thursday", time: "8:00 PM – 9:00 PM", event: "Zoom Prayer", icon: <Video className="w-4 h-4" /> },
              { day: "Friday", time: "8:00 PM – 10:00 PM", event: "Prayer at the Temple", icon: <Church className="w-4 h-4" /> },
              { day: "Sunday", time: "8:00 AM – 10:00 AM", event: "First Service", icon: <Calendar className="w-4 h-4" /> },
              { day: "Sunday", time: "12:00 PM – 2:30 PM", event: "Second Service", icon: <Calendar className="w-4 h-4" /> },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-5 border-b border-gray-100 last:border-b-0 flex-wrap gap-2">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-amber-600">{item.icon}</span> {item.day}
                </span>
                <span className="text-gray-600">
                  <strong>{item.event}:</strong> {item.time}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-5 italic">All are invited. Zoom link provided upon request.</p>
        </div>
      </section>

      {/* ==========================================
          PRAYER REQUEST SECTION
      ========================================== */}
      <section id="prayer" className="relative z-10 py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          {prayerSubmitted ? (
            /* Success State */
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xl">
              <div className="rounded-full bg-green-100 p-4 inline-flex mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Prayer Request Received</h2>
              <p className="text-gray-500 mb-8">Our ministry team will lift your request in prayer. God bless you.</p>
              <button
                onClick={resetPrayerForm}
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-gray-900 hover:bg-amber-600 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                    Prayer Wall
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Submit a <span className="text-amber-600">Prayer Request</span>
                </h2>
                <p className="text-gray-500">Share your heart with us. We believe in the power of prayer.</p>
              </div>

              <form onSubmit={handlePrayerSubmit} className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-amber-600">*</span></label>
                  <input
                    value={prayerName}
                    onChange={(e) => { setPrayerName(e.target.value); if (errors.name) setErrors({ ...errors, name: "" }); }}
                    placeholder="Enter your full name"
                    className={`w-full rounded-xl border ${errors.name ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-amber-600">*</span></label>
                  <input
                    type="email"
                    value={prayerEmail}
                    onChange={(e) => { setPrayerEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                    placeholder="your@email.com"
                    className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                  <input
                    type="tel"
                    value={prayerPhone}
                    onChange={(e) => setPrayerPhone(e.target.value)}
                    placeholder="(319) 555-0147"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request <span className="text-amber-600">*</span></label>
                  <textarea
                    rows={5}
                    value={prayerRequest}
                    onChange={(e) => { setPrayerRequest(e.target.value); if (errors.request) setErrors({ ...errors, request: "" }); }}
                    placeholder="Share your prayer request here..."
                    className={`w-full rounded-xl border ${errors.request ? "border-red-400" : "border-gray-300"} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none`}
                  />
                  {errors.request && <p className="text-red-500 text-xs mt-1">{errors.request}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-4 text-base font-semibold text-gray-900 hover:bg-amber-600 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Prayer Request
                </button>
                <p className="text-center text-xs text-gray-400">Your request is kept confidential and prayed over by our ministry team.</p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ==========================================
          CONTACT SECTION
      ========================================== */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 mb-5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                Find Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Contact & <span className="text-amber-600">Location</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-600" /> Church Office
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  1024 Gilbert St, Iowa City, IA 52240
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0" />
                  (319) 555-0147
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                  info@sionblessing.org
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  Office: Tue–Fri 10AM–3PM
                </p>
              </div>
            </div>

            <div className="md:col-span-3 rounded-2xl border border-gray-200 overflow-hidden shadow-lg h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.519888765345!2d-91.5325!3d41.659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87e441f3a9e7c7ef%3A0x724f9c87f4e46b!2s1024%20Gilbert%20St%2C%20Iowa%20City%2C%20IA%2052240!5e0!3m2!1sen!2sus!4v1690000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <footer className="relative z-10 bg-gray-900 text-gray-300 py-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Church className="w-5 h-5 text-amber-500" /> Sion Blessing
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">Spreading the love of Christ in Iowa City and beyond. Everyone is welcome.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#home" className="block text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              <a href="#services" className="block text-gray-400 hover:text-amber-400 transition-colors">Service Times</a>
              <a href="#prayer" className="block text-gray-400 hover:text-amber-400 transition-colors">Prayer Request</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> 1024 Gilbert St, Iowa City, IA</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /> (319) 555-0147</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" /> prayer@sionblessing.org</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Gathering Times</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Zoom Prayer: Mon-Thu 8PM</p>
              <p>Friday Temple: 8PM-10PM</p>
              <p>Sunday: 8AM & 12PM</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sion Blessing Ministries. All rights reserved. | Designed with faith.
        </div>
      </footer>

    </div>
  );
}