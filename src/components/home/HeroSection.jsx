"use client";

import { motion } from "framer-motion";

import {
  ChevronRight,
} from "lucide-react";

export default function HeroSection({

  setBookingModalGS,

}) {

  return (

    <section

      id="home"

      className="
        relative
        min-h-screen
        flex
        items-center
        overflow-hidden
        bg-gradient-to-br
        from-[#f8f8f8]
        via-white
        to-slate-100
        text-black
      "
    >

      {/* ================================
          BACKGROUND IMAGE
      ================================ */}

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          scale-105
          opacity-[0.12]
        "
        style={{
          backgroundImage:
            "url('/images/hero-bg.jpg')",
        }}
      ></div>

      {/* ================================
          DARK OVERLAY
      ================================ */}

      <div className="
        absolute
        inset-0
        bg-gradient-to-b
        from-white/20
        via-white/40
        to-white/60
      "></div>

      {/* ================================
          FLOATING GLOW 1
      ================================ */}

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
          w-[500px]
          h-[500px]
          bg-yellow-200/30
          blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ================================
          FLOATING GLOW 2
      ================================ */}

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
          w-[500px]
          h-[500px]
          bg-blue-200/30
          blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ================================
          MAIN CONTENT
      ================================ */}

      <div className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-6
        py-32
        grid
        lg:grid-cols-2
        gap-16
        lg:gap-20
        items-center
      ">

        {/* ================================
            LEFT SIDE
        ================================ */}

        <div>

          {/* TOP BADGE */}

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.2,
            }}

            className="
              inline-flex
              items-center
              gap-3
              bg-white/70
              backdrop-blur-xl
              border
              border-black/10
              rounded-full
              px-5
              py-2
              shadow-lg
              mb-8
            "
          >

            <motion.div

              animate={{
                scale: [1, 1.2, 1],
              }}

              transition={{
                duration: 2,
                repeat: Infinity,
              }}

              className="
                w-2
                h-2
                rounded-full
                bg-green-500
              "
            ></motion.div>

            <span className="
              text-sm
              tracking-wide
              font-medium
            ">
              Professional Multi-Service Company
            </span>

          </motion.div>

          {/* ================================
              MAIN TITLE
          ================================ */}

          <motion.h1

            initial={{
              opacity: 0,
              y: 50,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.3,
            }}

            className="
              text-5xl
              md:text-7xl
              font-black
              leading-tight
            "
          >

            Turning Your
            <span className="text-yellow-500">
              {" "}Vision{" "}
            </span>
            Into Reality

          </motion.h1>

          {/* ================================
              DESCRIPTION
          ================================ */}

          <motion.p

            initial={{
              opacity: 0,
              y: 50,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.5,
            }}

            className="
              mt-8
              text-xl
              text-gray-700
              leading-relaxed
              max-w-2xl
            "
          >

            From unforgettable weddings and conferences to
            enterprise-grade networking and IT solutions —
            J&K Services Group delivers professionalism,
            creativity, and excellence.

          </motion.p>

          {/* ================================
              BUTTONS
          ================================ */}

          <motion.div

            initial={{
              opacity: 0,
              y: 50,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.7,
            }}

            className="
              mt-12
              flex
              flex-wrap
              gap-5
            "
          >

            {/* BOOK BUTTON */}

            <motion.button

              whileHover={{
                scale: 1.05,
                y: -4,
              }}

              whileTap={{
                scale: 0.98,
              }}

              onClick={() =>
                setBookingModalGS(true)
              }

              className="
                bg-black
                hover:bg-yellow-500
                hover:text-black
                text-white
                px-8
                py-4
                rounded-full
                text-lg
                font-bold
                transition
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                flex
                items-center
                gap-2
              "
            >

              Book Appointment

              <ChevronRight />

            </motion.button>

            {/* SERVICES BUTTON */}

            <motion.a

              whileHover={{
                scale: 1.05,
                y: -4,
              }}

              href="#services"

              className="
                border
                border-black/20
                hover:bg-black
                hover:text-white
                px-8
                py-4
                rounded-full
                text-lg
                font-semibold
                transition
                inline-flex
                items-center
                justify-center
                backdrop-blur-xl
              "
            >

              Explore Services

            </motion.a>

          </motion.div>

          {/* ================================
              STATS
          ================================ */}

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            transition={{
              delay: 1,
            }}

            className="
              mt-16
              grid
              grid-cols-3
              gap-8
            "
          >

            {[
              ["10+", "Events Served"],
              ["24/7", "IT Support"],
              ["5★", "Client Experience"],
            ].map(([number, label]) => (

              <motion.div

                key={label}

                whileHover={{
                  y: -8,
                }}

                className="
                  relative
                "
              >

                <motion.div

                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}

                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}

                  className="
                    absolute
                    inset-0
                    bg-yellow-400/10
                    blur-xl
                    rounded-full
                  "
                ></motion.div>

                <h3 className="
                  relative
                  text-4xl
                  font-black
                  text-yellow-500
                ">
                  {number}
                </h3>

                <p className="
                  relative
                  text-gray-500
                  mt-2
                ">
                  {label}
                </p>

              </motion.div>

            ))}

          </motion.div>

        </div>

        {/* ================================
            RIGHT SIDE CARD
        ================================ */}

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.9,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            delay: 0.5,
          }}

          className="
            flex
            justify-center
            mt-16
            lg:mt-0
          "
        >

          <motion.div

            animate={{
              y: [0, -10, 0],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
            }}

            className="
              bg-white/70
              backdrop-blur-2xl
              border
              border-black/10
              rounded-[40px]
              p-6
              md:p-8
              lg:p-10
              shadow-[0_20px_80px_rgba(0,0,0,0.08)]
              w-full
              max-w-md
              lg:max-w-lg
            "
          >

            {/* LOGO */}

            <img
              src="/images/logo1.png"
              alt="Logo"
              className="
                w-52
                md:w-64
                lg:w-72
                mx-auto
              "
            />

            {/* CARDS */}

            <div className="
              mt-10
              space-y-5
            ">

              {[
                [
                  "Wedding & Event Services",
                  "MC • DJ • Planning • Photography • Ushers",
                ],

                [
                  "Networking & IT Solutions",
                  "Installation • Troubleshooting • Consulting",
                ],

              ].map(([title, desc]) => (

                <motion.div

                  key={title}

                  whileHover={{
                    scale: 1.03,
                    y: -3,
                  }}

                  className="
                    bg-white
                    rounded-3xl
                    p-6
                    border
                    border-black/5
                    shadow-lg
                  "
                >

                  <h3 className="
                    text-xl
                    font-bold
                  ">
                    {title}
                  </h3>

                  <p className="
                    text-gray-600
                    mt-3
                  ">
                    {desc}
                  </p>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </motion.div>

      </div>

      {/* ================================
          SCROLL INDICATOR
      ================================ */}

      <motion.div

        animate={{
          y: [0, 10, 0],
        }}

        transition={{
          duration: 2,
          repeat: Infinity,
        }}

        className="
          absolute
          bottom-10
          left-1/2
          -translate-x-1/2
        "
      >

        <div className="
          w-8
          h-14
          border-2
          border-black/40
          rounded-full
          flex
          justify-center
        ">

          <motion.div

            animate={{
              y: [0, 18, 0],
            }}

            transition={{
              duration: 2,
              repeat: Infinity,
            }}

            className="
              w-2
              h-2
              bg-black/50
              rounded-full
              mt-3
            "
          ></motion.div>

        </div>

      </motion.div>

    </section>
  );
}