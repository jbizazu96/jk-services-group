"use client";

import React from "react";
import {
  Calendar,
  Phone,
  Mail,
  Menu,
  X,
  ChevronRight,
  Mic,
  Music,
  Camera,
  Users,
  Network,
  Wrench,
  PenTool,
  Presentation,
} from "lucide-react";

export default function JKServicePage() {
  const [mobileMenu, setMobileMenu] = React.useState(false);

  const services = [
    {
      title: "MC Services",
      icon: <Mic className="w-10 h-10" />,
      description:
        "Professional hosting for weddings, conferences, birthdays, and corporate events.",
      price: "$150 - $1,500",
    },
    {
      title: "Event Planning",
      icon: <Calendar className="w-10 h-10" />,
      description:
        "Full event planning and coordination services from beginning to end.",
      price: "$300 - $4,000+",
    },
    {
      title: "DJ Music",
      icon: <Music className="w-10 h-10" />,
      description:
        "Premium DJ services with professional sound and lighting systems.",
      price: "$250 - $2,000+",
    },
    {
      title: "Photography & Videography",
      icon: <Camera className="w-10 h-10" />,
      description:
        "Capture unforgettable moments with cinematic video and photography.",
      price: "$300 - $5,000+",
    },
    {
      title: "Ushers",
      icon: <Users className="w-10 h-10" />,
      description:
        "Professional ushering services for weddings and special events.",
      price: "$75 - $1,000",
    },
    {
      title: "Network Installation",
      icon: <Network className="w-10 h-10" />,
      description:
        "Complete business and residential networking installation solutions.",
      price: "$500 - Custom",
    },
    {
      title: "IT Support",
      icon: <Wrench className="w-10 h-10" />,
      description:
        "Network troubleshooting, upgrades, optimization, and IT consulting.",
      price: "$75/hr - $2,000/month",
    },
    {
      title: "Flyer Design",
      icon: <PenTool className="w-10 h-10" />,
      description:
        "Modern flyer and social media designs for all events and businesses.",
      price: "$50 - $800",
    },
    {
      title: "Conferences",
      icon: <Presentation className="w-10 h-10" />,
      description:
        "Professional speaking engagements and conferences on diverse topics.",
      price: "$200 - Custom",
    },
  ];

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="J&K Service Group"
              className="w-14 h-14 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                J&K Service Group
              </h1>

              <p className="text-sm text-gray-300">
                Event • IT • Networking • Media
              </p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#home"
              className="hover:text-yellow-400 transition"
            >
              Home
            </a>

            <a
              href="#services"
              className="hover:text-yellow-400 transition"
            >
              Services
            </a>

            <a
              href="#about"
              className="hover:text-yellow-400 transition"
            >
              About
            </a>

            <a
              href="#contact"
              className="hover:text-yellow-400 transition"
            >
              Contact
            </a>

            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full transition shadow-2xl">
              Book Now
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="lg:hidden bg-black/95 border-t border-white/10">
            <div className="flex flex-col p-6 gap-6">
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>

              <button className="bg-yellow-500 text-black py-3 rounded-full font-semibold">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center"
      >
        {/* HERO VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* GLOW EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-yellow-500/20"></div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>

              <span className="text-sm tracking-wide">
                Professional Multi-Service Company
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Turning Your
              <span className="text-yellow-400"> Vision </span>
              Into Reality
            </h1>

            <p className="mt-8 text-xl text-gray-300 leading-relaxed max-w-2xl">
              From unforgettable weddings and conferences to enterprise-grade
              networking and IT solutions — J&K Service Group delivers
              professionalism, creativity, and excellence.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-5">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 transition shadow-2xl">
                Book Appointment
                <ChevronRight />
              </button>

              <button className="border border-white/30 hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition">
                Explore Services
              </button>
            </div>

            {/* STATS */}
            <div className="mt-14 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-4xl font-black text-yellow-400">100+</h3>
                <p className="text-gray-400 mt-2">Events Served</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-yellow-400">24/7</h3>
                <p className="text-gray-400 mt-2">IT Support</p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-yellow-400">5★</h3>
                <p className="text-gray-400 mt-2">Client Experience</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CARD */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl max-w-lg">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-72 mx-auto"
              />

              <div className="mt-10 space-y-5">
                <div className="bg-black/30 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-xl font-bold">
                    Wedding & Event Services
                  </h3>

                  <p className="text-gray-300 mt-2">
                    MC • DJ • Planning • Photography • Ushers
                  </p>
                </div>

                <div className="bg-black/30 rounded-2xl p-5 border border-white/10">
                  <h3 className="text-xl font-bold">
                    Networking & IT Solutions
                  </h3>

                  <p className="text-gray-300 mt-2">
                    Installation • Troubleshooting • Management • Consulting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 border-2 border-white rounded-full flex justify-center">
            <div className="w-2 h-2 bg-white rounded-full mt-3"></div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="py-28 bg-gradient-to-b from-black to-slate-950"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black">
              Our Services
            </h2>

            <p className="text-xl text-gray-400 mt-6 max-w-3xl mx-auto">
              Professional solutions designed to elevate your events,
              businesses, and digital presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] bg-white/5 border border-white/10 p-8 hover:border-yellow-400/40 transition duration-500 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10">
                  <div className="text-yellow-400 mb-6">
                    {service.icon}
                  </div>

                  <h3 className="text-3xl font-bold mb-4">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-xl font-bold">
                      {service.price}
                    </span>

                    <button className="bg-white/10 hover:bg-yellow-500 hover:text-black transition px-5 py-3 rounded-full">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-blue-900"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black leading-tight">
            Ready To Work With Us?
          </h2>

          <p className="text-xl mt-8 text-white/90 leading-relaxed">
            Let’s bring your event or business vision to life with professional
            service and unmatched dedication.
          </p>

          <button className="mt-10 bg-black hover:bg-white hover:text-black text-white px-10 py-5 rounded-full text-xl font-bold transition shadow-2xl">
            Schedule Consultation
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        id="contact"
        className="bg-black border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-24 mb-6"
            />

            <p className="text-gray-400 leading-relaxed">
              Professional event, IT, networking, and creative services focused
              on excellence and innovation.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Services</h3>

            <ul className="space-y-3 text-gray-400">
              <li>MC Services</li>
              <li>DJ Music</li>
              <li>Event Planning</li>
              <li>Networking</li>
              <li>IT Support</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>About Us</li>
              <li>Book Appointment</li>
              <li>Pricing</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact</h3>

            <div className="space-y-5 text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="text-yellow-400" size={20} />
                <span>(555) 555-5555</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-yellow-400" size={20} />
                <span>info@jkservicegroup.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-yellow-400" size={20} />
                <span>Available 7 Days a Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 py-6 text-center text-gray-500">
          © 2026 J&K Service Group. All rights reserved.
        </div>
      </footer>
    </main>
  );
}