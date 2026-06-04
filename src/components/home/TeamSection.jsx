"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  useRef,
  useState,
} from "react";

/* ==========================================
   ICONS
========================================== */

import {
  Calendar,
  Music,
  Camera,
  Wifi,
  Mic,
  Briefcase,
  MapPin,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ==========================================
   TEAM DATA
========================================== */

const teamMembers = [
  {
    name: "Josue Bizazu",
    title: "CEO & Network Engineer",
    role: "Network Engineer, IT Specialyst, MC, Preacher",
    image: "/images/Me3.JPG",
    years: "5+",
    expertise: ["Network Engineering", "Public Speaking", "Event Hosting"],
    languages: ["English", "French", "Lingala"],
    icon: <Wifi className="w-5 h-5" />,
    description: "A passionate leader, professional MC, network engineer, and technology consultant dedicated to excellence in both events and IT solutions.",
  },
  {
    name: "Kerene Bizazu",
    title: "Event Planning Director",
    role: "Universal Banker III, Event Planner, Usher",
    image: "/images/Kerene.jpeg",
    years: "5+",
    expertise: ["Event Coordination", "Customer Service", "Multilingual Support"],
    languages: ["English", "French", "Portuguese", "Spanish", "Lingala"],
    icon: <Briefcase className="w-5 h-5" />,
    description: "Fluent in five languages, she creates welcoming and professional experiences for clients and guests with expertise in ushering and event planning.",
  },
  {
    name: "Jeremie Boko",
    title: "DJ & Entertainment Coordinator",
    role: "DJ, Coordinator",
    image: "/images/jeremie.jpg",
    years: "2+",
    expertise: ["DJ Performance", "Sound Coordination", "Audience Engagement"],
    languages: ["English", "French", "Lingala"],
    icon: <Music className="w-5 h-5" />,
    description: "Hardworking DJ and music professional with experience in live event entertainment, sound coordination, and audience engagement.",
  },
  {
    name: "Percy Sunda",
    title: "Creative Director",
    role: "Photography, Videography, Designer",
    image: "/images/percy2.png",
    years: "10+",
    expertise: ["Photography", "Videography", "Graphic Design"],
    languages: ["English", "French", "Lingala"],
    icon: <Camera className="w-5 h-5" />,
    description: "Talented creative with more than 10 years of experience in music videos, weddings, events, and professional media productions.",
  },
  
];

/* ==========================================
   TEAM CARD COMPONENT
========================================== */

const TeamCard = ({ member, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-gold/40 transition-all duration-300 overflow-hidden">
        
        {/* Card Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
        </div>

        {/* Image Section - Smaller, Circular */}
        <div className="relative pt-5 px-5">
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Animated Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-gold/30"
              />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/20 group-hover:border-gold/50 transition-all duration-300 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"  // object-top focuses on face area
                />
              </div>
              {/* Experience Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gold to-gold-dark text-black rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                {member.years} yrs
              </div>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {member.expertise.slice(0, 2).map((skill, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/[0.03] border border-white/5 text-zinc-400">
                {skill}
              </span>
            ))}
            {member.expertise.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/[0.03] text-zinc-500">
                +{member.expertise.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Name */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-gold transition-colors">
            {member.name}
          </h3>
          
          {/* Title */}
          <p className="text-gold text-sm font-medium mb-3">
            {member.title}
          </p>

          {/* Role Badge */}
          <div className="inline-block mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-white/[0.05] text-zinc-400 border border-white/5">
              {member.role}
            </span>
          </div>

          {/* Description - with expand/collapse for mobile */}
          <p className={`text-zinc-400 text-sm leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {member.description}
          </p>

          {/* Read More Button (mobile only) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-gold text-xs mt-2 hover:text-gold-dark transition"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>

          {/* Languages */}
          {member.languages && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap justify-center gap-1">
                {member.languages.map((lang, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function TeamSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black"
    >
      {/* ==========================================
          BACKGROUND EFFECTS
      ========================================== */}

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-10 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-10 w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* ==========================================
          CONTAINER
      ========================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ==========================================
            SECTION HEADER
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-5 py-2 backdrop-blur-md mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gold"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              The Faces Behind Excellence
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            Meet Our
            <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
              {" "}Professional Team
            </span>
          </h2>

          {/* Description */}
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A dedicated team passionate about delivering unforgettable events and professional technology solutions.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-sm">✦</span>
              </div>
              <span className="text-zinc-400 text-sm">{teamMembers.length}+ Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-sm">🎯</span>
              </div>
              <span className="text-zinc-400 text-sm">100% Dedicated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-sm">🌍</span>
              </div>
              <span className="text-zinc-400 text-sm">Multilingual Team</span>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            TEAM GRID - More compact, better for scrolling
        ========================================== */}

        <motion.div
          style={{ opacity, scale }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {teamMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </motion.div>

        {/* ==========================================
            TRUST INDICATOR
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/[0.03] border border-white/10 px-6 py-3 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 4).map((member, i) => (
                <img
                  key={i}
                  src={member.image}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-black object-cover object-top"
                />
              ))}
            </div>
            <span className="text-zinc-400 text-sm">
              Trusted by <span className="text-gold font-semibold">happy</span> clients
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}