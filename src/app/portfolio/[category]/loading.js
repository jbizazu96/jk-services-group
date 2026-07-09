"use client"; // <--- ADD THIS LINE AT THE VERY TOP

/* ==========================================
   PORTFOLIO LOADING PAGE
========================================== */

import { motion } from "framer-motion";

export default function Loading() {

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Ambient Glow (Matches the actual page) */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* =====================================
          LOGO LOADER
      ===================================== */}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-8 relative z-10"
      >
        
        {/* Orbiting Container */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          
          {/* Dotted Orbit Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30"
          />
          
          {/* Inner Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-yellow-400/10"
          />
          
          {/* Rotating glowing dots */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400/40" />
          </motion.div>

          {/* Central Logo Image */}
          <div className="relative w-16 h-16 z-10 bg-black/80 backdrop-blur-md rounded-full border-2 border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.15)] flex items-center justify-center overflow-hidden">
            <img 
              src="/images/logo1.webp" 
              alt="J&K Services Logo" 
              className="w-12 h-12 object-contain" 
            />
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-lg font-medium text-gray-300 mb-1 tracking-wide">
            Loading the page
          </h3>
          <div className="flex items-center justify-center gap-1 mt-2">
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} 
              className="w-1.5 h-1.5 rounded-full bg-yellow-400"
            />
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} 
              className="w-1.5 h-1.5 rounded-full bg-yellow-400"
            />
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} 
              className="w-1.5 h-1.5 rounded-full bg-yellow-400"
            />
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}