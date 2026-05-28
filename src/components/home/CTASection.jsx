"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
} from "framer-motion";

/* ==========================================
   LUCIDE ICONS
========================================== */

import {
  ArrowRight,
} from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function CTASection({

  setBookingModalGS,

}) {

  return (

    <section

      className="
        relative
        py-32
        overflow-hidden
      "
    >

      {/* ==========================================
          ANIMATED BACKGROUND
      ========================================== */}

      <motion.div

        animate={{
          scale: [1, 1.03, 1],
        }}

        transition={{
          duration: 10,
          repeat: Infinity,
        }}

        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-yellow-500
          via-yellow-400
          to-blue-900
        "
      ></motion.div>

      {/* ==========================================
          DARK OVERLAY
      ========================================== */}

      <div className="
        absolute
        inset-0
        bg-black/10
      "></div>

      {/* ==========================================
          AMBIENT GLOW - TOP LEFT
      ========================================== */}

      <motion.div

        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
        }}

        transition={{
          duration: 10,
          repeat: Infinity,
        }}

        className="
          absolute
          top-0
          left-0
          w-[450px]
          h-[450px]
          bg-white/10
          blur-[60px] md:blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          AMBIENT GLOW - BOTTOM RIGHT
      ========================================== */}

      <motion.div

        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}

        transition={{
          duration: 12,
          repeat: Infinity,
        }}

        className="
          absolute
          bottom-0
          right-0
          w-[450px]
          h-[450px]
          bg-blue-300/20
          blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="
        relative
        z-10
        max-w-5xl
        mx-auto
        px-6
        text-center
      ">

        {/* ==========================================
            SMALL BADGE
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.6,
          }}

          whileHover={{
            scale: 1.03,
          }}

          className="
            inline-flex
            items-center
            gap-2
            bg-white/10
            border
            border-white/20
            rounded-full
            px-5
            py-2
            mb-8
            backdrop-blur-xl
          "
        >

          {/* ANIMATED DOT */}

          <motion.div

            animate={{
              scale: [1, 1.3, 1],
            }}

            transition={{
              duration: 2,
              repeat: Infinity,
            }}

            className="
              w-2
              h-2
              rounded-full
              bg-white
            "
          ></motion.div>

          <span className="
            text-sm
            uppercase
            tracking-wide
            font-semibold
            text-white
          ">

            Let’s Build Something Amazing

          </span>

        </motion.div>

        {/* ==========================================
            TITLE
        ========================================== */}

        <motion.h2

          initial={{
            opacity: 0,
            y: 50,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.8,
          }}

          className="
            text-5xl
            md:text-7xl
            font-black
            leading-tight
            text-white
          "
        >

          Ready To Work
          <br />

          <span className="
            text-black
            drop-shadow-xl
          ">

            With Us?

          </span>

        </motion.h2>

        {/* ==========================================
            DESCRIPTION
        ========================================== */}

        <motion.p

          initial={{
            opacity: 0,
            y: 50,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.2,
            duration: 0.8,
          }}

          className="
            text-xl
            mt-8
            text-white/90
            leading-relaxed
            max-w-3xl
            mx-auto
          "
        >

          Let’s bring your event or business vision
          to life with professional service,
          innovation, and unmatched dedication.

        </motion.p>

        {/* ==========================================
            CTA BUTTON
        ========================================== */}

        <motion.button

          initial={{
            opacity: 0,
            y: 50,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.4,
            duration: 0.8,
          }}

          whileHover={
                typeof window !== "undefined" &&
                window.innerWidth >= 1024
                  ? {
                      scale: 1.05,
                      y: -5,
                    }
                  : {}
              }

          whileTap={{
            scale: 0.98,
          }}

          onClick={() =>
            setBookingModalGS(true)
          }

          className="
            mt-12
            bg-black
            hover:bg-white
            hover:text-black
            text-white
            px-10
            py-5
            rounded-full
            text-xl
            font-bold
            transition-all
            duration-300
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            inline-flex
            items-center
            gap-3
          "
        >

          Schedule Consultation

          <motion.div

            animate={{
              x: [0, 5, 0],
            }}

            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}

          >

            <ArrowRight size={24} />

          </motion.div>

        </motion.button>

      </div>

    </section>
  );
}