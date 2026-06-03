"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/* ==========================================
   NEXT IMAGE
========================================== */

import Image from "next/image";

/* ==========================================
   NEXT NAVIGATION
========================================== */

import { useRouter } from "next/navigation";

/* ==========================================
   PORTFOLIO HERO COMPONENT
========================================== */

export default function ServiceCategoryHero({
  title,
  description,
  image,
  serviceCount,
}) {

  const router = useRouter();

  /* ==========================================
     SCROLL ANIMATION
  ========================================== */

  const {
    scrollY,
  } = useScroll();

  /* ==========================================
     PARALLAX EFFECT
  ========================================== */

  const imageScale =
    useTransform(
      scrollY,
      [0, 500],
      [1, 1.15]
    );

  const imageY =
    useTransform(
      scrollY,
      [0, 500],
      [0, 120]
    );

  const textY =
    useTransform(
      scrollY,
      [0, 500],
      [0, 180]
    );

  /* ==========================================
     GO BACK TO HOMEPAGE SERVICES SECTION
  ========================================== */

  const goBackToServices = () => {
    // Use window.location for a full page reload
    // This bypasses any client-side auto-scroll effects
    window.location.href = "/#services";
  };

  return (

    <div
      className="
        relative
        h-[360px]
        md:h-[500px]
        overflow-hidden
      "
    >

      {/* =====================================
          HERO IMAGE
      ===================================== */}

      <motion.div

        style={{
          scale: imageScale,
          y: imageY,
        }}

        className="
          absolute
          inset-0
        "
      >

        <Image
          src={image}
          alt={title}
          fill
          priority
          className="
            object-cover
          "
        />

      </motion.div>

      {/* =====================================
          DARK OVERLAY
      ===================================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
        "
      />

      {/* =====================================
          HERO CONTENT
      ===================================== */}

      <motion.div

        style={{
          y: textY,
        }}

        className="
          relative
          z-10
          h-full
          max-w-6xl
          mx-auto
          px-6
          flex
          flex-col
          justify-center
        "
      >

        {/* BACK BUTTON */}
        <button
          onClick={goBackToServices}
          className="
            inline-flex
            items-center
            gap-2
            mb-8
            text-yellow-400
            hover:text-yellow-300
            font-semibold
            transition
            w-fit
            group
          "
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.span>
          Back To Service Categories
        </button>

        {/* BADGE */}
        <div
          className="
            mb-6
            inline-flex
            w-fit
            rounded-full
            bg-yellow-500
            px-4
            py-2
            text-sm
            font-bold
            text-black
          "
        >
          {serviceCount} Services Available
        </div>

        {/* TITLE */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            text-5xl
            md:text-7xl
            font-black
            text-white
            mb-6
          "
        >
          {title}
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="
            text-lg
            md:text-xl
            text-gray-200
            max-w-2xl
          "
        >
          {description}
        </motion.p>

      </motion.div>

    </div>

  );
}