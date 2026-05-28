"use client";

/* ==========================================
   REACT + FRAMER MOTION
========================================== */

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   COMPONENT
========================================== */

export default function ServicesSection({

  setSelectedService,
  setBookingModal,

}) {

  /* ==========================================
     SERVICES STATE
  ========================================== */

  const [services, setServices] =
    useState([]);

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {

    loadServices();

  }, []);

  /* ==========================================
     FIRESTORE QUERY
  ========================================== */

  const loadServices = async () => {

    try {

      const q = query(

        collection(db, "services"),

        where(
          "active",
          "==",
          true
        )

      );

      const snapshot =
        await getDocs(q);

      const items =
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

      setServices(items);

    } catch (error) {

      console.error(
        "Service Error:",
        error
      );

    }

  };

  /* ==========================================
     JSX
  ========================================== */

  return (

    <section

      id="services"

      className="
        py-32
        relative
        overflow-hidden
        bg-gradient-to-br
        from-black
        via-zinc-900
        to-slate-950
      "
    >

      {/* ==========================================
          AMBIENT GLOW - TOP RIGHT
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
          right-0
          w-[500px]
          h-[500px]
          bg-yellow-500/10
          blur-[60px] md:blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          AMBIENT GLOW - BOTTOM LEFT
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
          left-0
          w-[500px]
          h-[500px]
          bg-blue-500/10
          blur-[60px] md:blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          CONTAINER
      ========================================== */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        relative
        z-10
      ">

        {/* ==========================================
            SECTION TITLE
        ========================================== */}

        <motion.div

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
              amount: 0.2,
            }}

          transition={{
            duration: 0.8,
          }}

          className="
            text-center
            mb-24
          "
        >

          {/* BADGE */}

          <motion.div

            whileHover={{
              scale: 1.03,
            }}

            className="
              inline-flex
              items-center
              gap-2
              bg-white/5
              border
              border-white/10
              rounded-full
              px-5
              py-2
              mb-8
              backdrop-blur-md
            "
          >

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
                bg-yellow-400
              "
            ></motion.div>

            <span className="
              text-yellow-300
              text-sm
              uppercase
              tracking-wide
              font-semibold
            ">
              Our Services
            </span>

          </motion.div>

          {/* TITLE */}

          <h2 className="
            text-5xl
            md:text-6xl
            font-black
            text-white
          ">

            Premium

            <span className="text-yellow-400">
              {" "}Solutions
            </span>

          </h2>

          {/* DESCRIPTION */}

          <p className="
            text-xl
            text-gray-400
            mt-6
            max-w-3xl
            mx-auto
            leading-relaxed
          ">

            Professional solutions designed to elevate your
            events, businesses, and digital presence.

          </p>

        </motion.div>

        {/* ==========================================
            SERVICES GRID
        ========================================== */}

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        ">

          {services.map((service, index) => (

            <motion.div

              key={service.id}

              /* ==========================================
                 ENTRANCE ANIMATION
              ========================================== */

              initial={{
                opacity: 0,
                y: 60,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
              }}

              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}

              /* ==========================================
                 HOVER ANIMATION
              ========================================== */

              whileHover={
                    typeof window !== "undefined" &&
                    window.innerWidth >= 1024
                      ? {
                          y: -12,
                          scale: 1.02,
                        }
                      : {}
                  }

              className="
                group
                relative
                overflow-hidden
                rounded-[36px]
                h-[520px]
                border
                border-white/10
                hover:border-yellow-500/40
                transition
                duration-500
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
              "
            >

              {/* ==========================================
                  BACKGROUND IMAGE
              ========================================== */}

              <img
                src={service.image}
                alt={service.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-110
                  transition
                  duration-700
                "
              />

              {/* ==========================================
                  DARK OVERLAY
              ========================================== */}

              <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/70
                to-black/20
              "></div>

              {/* ==========================================
                  HOVER GLOW
              ========================================== */}

              <div className="
                absolute
                inset-0
                bg-yellow-500/0
                group-hover:bg-yellow-500/10
                transition
                duration-500
              "></div>

              {/* ==========================================
                  CARD CONTENT
              ========================================== */}

              <div className="
               transform-gpu
                group
                relative
                z-10
                h-full
                flex
                flex-col
                justify-end
                p-8
                group-hover:-translate-y-2
                transition
                duration-500
              ">

                {/* ==========================================
                    PRICE SECTION
                ========================================== */}

                <div className="mb-4">

                  <p className="
                    text-white/70
                    uppercase
                    tracking-widest
                    text-xs
                    font-semibold
                    mb-1
                  ">
                    Price Range
                  </p>

                  <motion.span

                    whileHover={{
                      scale: 1.05,
                    }}

                    className="
                      inline-block
                      bg-yellow-500
                      text-black
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-bold
                    "
                  >

                    {service.priceText}

                  </motion.span>

                </div>

                {/* ==========================================
                    SERVICE TITLE
                ========================================== */}

                <h3 className="
                  text-3xl
                  font-black
                  mb-4
                  text-white
                ">

                  {service.name}

                </h3>

                {/* ==========================================
                    SERVICE DESCRIPTION
                ========================================== */}

                <p className="
                  text-gray-300
                  leading-relaxed
                  mb-8
                ">

                  {service.description}

                </p>

                {/* ==========================================
                    BOOK BUTTON
                ========================================== */}

                <motion.button

                  whileHover={{
                    scale: 1.03,
                  }}

                  whileTap={{
                    scale: 0.98,
                  }}

                  onClick={() => {

                    setSelectedService(
                      service.name
                    );

                    setBookingModal(true);

                  }}

                  className="
                    w-full
                    bg-yellow-500
                    hover:bg-yellow-400
                    text-black
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                    transition
                    shadow-[0_10px_40px_rgba(234,179,8,0.25)]
                  "
                >

                  Book Now

                </motion.button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}