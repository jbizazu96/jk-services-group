"use client";

/* ==========================================
   REACT + FRAMER MOTION
========================================== */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* ==========================================
   NEXT.JS
========================================== */

import { useRouter } from "next/navigation";

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

export default function PortfolioSection() {

  const router = useRouter();

  /* ==========================================
     REFERENCES
  ========================================== */

  const galleryRef =
    useRef(null);

  /* ==========================================
     STATES
  ========================================== */

  const [
    portfolioCategories,
    setPortfolioCategories,
  ] = useState([]);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  /* ==========================================
     LOAD PORTFOLIO CATEGORIES
  ========================================== */

  useEffect(() => {

    loadPortfolioCategories();

  }, []);

  const loadPortfolioCategories =
    async () => {

      try {

        const q = query(

          collection(
            db,
            "portfolioCategories"
          ),

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

        setPortfolioCategories(items);

      } catch (error) {

        console.error(
          "Portfolio Error:",
          error
        );

      }

  };

  /* ==========================================
     AUTO SCROLL SLIDER
  ========================================== */

  useEffect(() => {

    if (
      portfolioCategories.length === 0
    ) return;

    const interval =
      setInterval(() => {

        setActiveIndex((prev) => {

          const next =
            prev + 1 >=
            portfolioCategories.length
              ? 0
              : prev + 1;

          scrollToCard(next);

          return next;

        });

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [portfolioCategories]);

  /* ==========================================
     SCROLL TO CARD
  ========================================== */

  const scrollToCard = (index) => {

    if (!galleryRef.current)
      return;

    const cardWidth = 420;

    galleryRef.current.scrollTo({

      left:
        index * cardWidth,

      behavior: "smooth",

    });

  };

  /* ==========================================
     LEFT BUTTON
  ========================================== */

  const handlePrev = () => {

    const newIndex =
      activeIndex === 0
        ? portfolioCategories.length - 1
        : activeIndex - 1;

    setActiveIndex(newIndex);

    scrollToCard(newIndex);

  };

  /* ==========================================
     RIGHT BUTTON
  ========================================== */

  const handleNext = () => {

    const newIndex =
      activeIndex + 1 >=
      portfolioCategories.length
        ? 0
        : activeIndex + 1;

    setActiveIndex(newIndex);

    scrollToCard(newIndex);

  };

  /* ==========================================
     JSX
  ========================================== */

  return (

    <section

      id="gallery"

      className="
        py-32
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#050505]
        via-[#0f172a]
        to-[#111827]
        text-white
      "
    >

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
          w-[400px]
          h-[400px]
          bg-yellow-500/10
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
          w-[400px]
          h-[400px]
          bg-blue-500/10
          blur-[60px] md:blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        mb-20
        relative
        z-20
      ">

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
            margin: "-100px",
          }}

          transition={{
            duration: 0.8,
          }}

          className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-8
          "
        >

          {/* LEFT */}

          <div>

            {/* BADGE */}

            <div className="
              inline-flex
              items-center
              gap-2
              bg-white/5
              border
              border-white/10
              rounded-full
              px-5
              py-2
              mb-6
              backdrop-blur-md
            ">

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
                tracking-wide
                text-sm
                uppercase
                font-semibold
              ">
                Our Portfolio
              </span>

            </div>

            {/* TITLE */}

            <h2 className="
              text-5xl
              md:text-6xl
              font-black
              leading-tight
            ">

              Projects &
              <span className="text-yellow-400">
                {" "}Portfolio
              </span>

            </h2>

          </div>

          {/* DESCRIPTION */}

          <p className="
            text-gray-300
            text-lg
            max-w-xl
            leading-relaxed
          ">

            Browse our portfolio categories and explore
            completed projects, events, photography,
            videography, networking installations,
            and digital solutions.

          </p>

        </motion.div>

      </div>

      {/* ==========================================
          LEFT ARROW
      ========================================== */}

      <motion.button

        whileHover={{
          scale: 1.1,
        }}

        whileTap={{
          scale: 0.95,
        }}

        onClick={handlePrev}

        className="
          absolute
          left-2
          md:left-4
          top-1/2
          -translate-y-1/2
          z-30
          bg-black/60
          hover:bg-yellow-500
          hover:text-black
          border
          border-white/10
          backdrop-blur-xl
          w-12
          h-12
          md:w-14
          md:h-14
          rounded-full
          flex
          items-center
          justify-center
          transition
          shadow-2xl
        "
      >

        <span className="
          text-xl
          md:text-2xl
          font-bold
        ">
          ←
        </span>

      </motion.button>

      {/* ==========================================
          RIGHT ARROW
      ========================================== */}

      <motion.button

        whileHover={{
          scale: 1.1,
        }}

        whileTap={{
          scale: 0.95,
        }}

        onClick={handleNext}

        className="
          absolute
          right-2
          md:right-4
          top-1/2
          -translate-y-1/2
          z-30
          bg-black/60
          hover:bg-yellow-500
          hover:text-black
          border
          border-white/10
          backdrop-blur-xl
          w-12
          h-12
          md:w-14
          md:h-14
          rounded-full
          flex
          items-center
          justify-center
          transition
          shadow-2xl
        "
      >

        <span className="
          text-xl
          md:text-2xl
          font-bold
        ">
          →
        </span>

      </motion.button>

      {/* ==========================================
          FADE LEFT
      ========================================== */}

      <div className="
        absolute
        left-0
        top-0
        w-32
        h-full
        bg-gradient-to-r
        from-[#050505]
        to-transparent
        z-10
        pointer-events-none
      "></div>

      {/* ==========================================
          FADE RIGHT
      ========================================== */}

      <div className="
        absolute
        right-0
        top-0
        w-32
        h-full
        bg-gradient-to-l
        from-[#111827]
        to-transparent
        z-10
        pointer-events-none
      "></div>

      {/* ==========================================
          CAROUSEL
      ========================================== */}

      <div

        ref={galleryRef}

        className="
          overflow-x-auto
          scrollbar-hide
          snap-x
          snap-mandatory
          relative
          z-20
          scroll-smooth
        "
      >

        {/* ==========================================
            CARD CONTAINER
        ========================================== */}

        <div className="
          flex
          gap-8
          px-20
          pb-6
          min-w-max
        ">

          {portfolioCategories.map(

            (category, index) => (

              <motion.div

                key={category.id}

                initial={{
                  opacity: 0,
                  x: 100,
                }}

                whileInView={{
                  opacity: 1,
                  x: 0,
                }}

                viewport={{
                  once: true,
                  margin: "-100px",
                }}

                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                }}

                whileHover={
                  typeof window !== "undefined" &&
                  window.innerWidth >= 1024
                    ? {
                        y: -10,
                        scale: 1.02,
                      }
                    : {}
                }

                onClick={() =>
                  router.push(
                    `/portfolio/${category.slug}`
                  )
                }

                className={`
                  group
                  relative
                  w-[380px]
                  h-[520px]
                  rounded-[36px]
                  overflow-hidden
                  border
                  cursor-pointer
                  snap-center
                  transition
                  duration-500

                  ${
                    activeIndex === index
                      ? `
                        border-yellow-500/60
                        shadow-[0_20px_80px_rgba(234,179,8,0.20)]
                      `
                      : `
                        border-white/10
                      `
                  }
                `}
              >

                {/* ==========================================
                    CATEGORY IMAGE
                ========================================== */}

                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    transform-gpu
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    lg:group-hover:scale-110
                    transition
                    duration-700
                  "
                />

                {/* ==========================================
                    OVERLAY
                ========================================== */}

                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black
                  via-black/60
                  to-transparent
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
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-8
                  z-10
                  group-hover:-translate-y-2
                  transition
                  duration-500
                ">

                  <h3 className="
                    text-3xl
                    font-black
                    text-white
                    mb-4
                  ">

                    {category.name}

                  </h3>

                  <p className="
                    text-gray-300
                    mb-6
                  ">

                    {category.description}

                  </p>

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    text-yellow-400
                    font-bold
                  ">

                    View Portfolio →

                  </div>

                </div>

              </motion.div>

            )

          )}

        </div>

      </div>

      {/* ==========================================
          DOT INDICATORS
      ========================================== */}

      <div className="
        flex
        justify-center
        items-center
        gap-3
        mt-10
        relative
        z-30
      ">

        {portfolioCategories.map(
          (_, index) => (

            <motion.button

              key={index}

              onClick={() => {

                setActiveIndex(index);

                scrollToCard(index);

              }}

              whileHover={{
                scale: 1.2,
              }}

              className={`
                rounded-full
                transition-all
                duration-300

                ${
                  activeIndex === index
                    ? `
                      w-10
                      h-3
                      bg-yellow-400
                    `
                    : `
                      w-3
                      h-3
                      bg-white/30
                    `
                }
              `}
            ></motion.button>

          )
        )}

      </div>

    </section>
  );
}