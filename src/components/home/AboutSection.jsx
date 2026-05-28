"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
} from "framer-motion";

/* ==========================================
   COMPONENT
========================================== */

export default function AboutSection() {

  return (

    <section

      id="about"

      className="
        py-32
        px-6
        bg-black
        relative
        overflow-hidden
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
          w-[450px]
          h-[450px]
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
          w-[450px]
          h-[450px]
          bg-blue-500/10
          blur-[60px] md:blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <div className="
        max-w-7xl
        mx-auto
        relative
        z-10
      ">

        {/* ==========================================
            GRID LAYOUT
        ========================================== */}

        <div className="
          grid
          lg:grid-cols-2
          gap-20
          items-center
        ">

          {/* ==========================================
              IMAGE SIDE
          ========================================== */}

          <motion.div

            initial={{
              opacity: 0,
              
            }}

            whileInView={{
              opacity: 1,
              
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.8,
            }}

            className="
              relative
              order-1
            "
          >

            {/* ==========================================
                INNER GLOW EFFECT
            ========================================== */}

            <div className="
              absolute
              inset-0
              bg-gradient-to-br
              from-blue-600/30
              to-yellow-500/20
              blur-3xl
              rounded-[40px]
            "></div>

            {/* ==========================================
                MAIN CARD
            ========================================== */}

            <motion.div

             whileHover={
                  typeof window !== "undefined" &&
                  window.innerWidth >= 1024
                    ? {
                        y: -10,
                        scale: 1.01,
                      }
                    : {}
                }

              transition={{
                duration: 0.4,
              }}

              className="
                relative
                bg-white/5
                border
                border-white/10
                rounded-[40px]
                p-8
                backdrop-blur-2xl
                overflow-hidden
                shadow-[0_20px_80px_rgba(0,0,0,0.35)]
              "
            >

              {/* ==========================================
                  FLOATING OVERLAY
              ========================================== */}

              <div className="
                absolute
                inset-0
                bg-gradient-to-br
                from-white/5
                via-transparent
                to-transparent
              "></div>

              {/* ==========================================
                  LOGO IMAGE
              ========================================== */}

              <motion.img

                animate={{
                  y: [0, -8, 0],
                }}

                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}

                src="/images/logo1.png"

                alt="J&K Services Group"

                className="
                  w-full
                  max-w-[450px]
                  mx-auto
                  object-contain
                  relative
                  z-10
                "
              />

            </motion.div>

          </motion.div>

          {/* ==========================================
              TEXT SIDE
          ========================================== */}

          <motion.div

            initial={{
              opacity: 0,
              
            }}

            whileInView={{
              opacity: 1,
              
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.8,
            }}

            className="
              order-2
            "
          >

            {/* ==========================================
                LABEL
            ========================================== */}

            <motion.div

              whileHover={{
                scale: 1.03,
              }}

              className="
                inline-flex
                items-center
                gap-2
                bg-blue-500/10
                border
                border-blue-500/20
                rounded-full
                px-5
                py-2
                mb-8
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
                  bg-blue-400
                "
              ></motion.div>

              <span className="
                text-blue-300
                tracking-wide
                text-sm
                uppercase
                font-semibold
              ">
                Who We Are
              </span>

            </motion.div>

            {/* ==========================================
                TITLE
            ========================================== */}

            <h2 className="
              text-5xl
              md:text-6xl
              font-black
              leading-tight
              mb-8
              text-white
            ">

              Passion Meets

              <br />

              <span className="
                text-yellow-400
              ">

                Professionalism

              </span>

            </h2>

            {/* ==========================================
                TEXT PARAGRAPH 1
            ========================================== */}

            <p className="
              text-gray-400
              text-lg
              leading-relaxed
              mb-6
            ">

              J&K Services was built on a simple belief:
              every event deserves to be extraordinary,
              and every organization deserves reliable
              technology solutions.

            </p>

            {/* ==========================================
                TEXT PARAGRAPH 2
            ========================================== */}

            <p className="
              text-gray-400
              text-lg
              leading-relaxed
              mb-10
            ">

              With years of hands-on experience in event
              hosting, networking, IT support, leadership,
              and media, we combine expertise with dedication
              in every project we handle.

            </p>

            {/* ==========================================
                TAGS
            ========================================== */}

            <div className="
              flex
              flex-wrap
              gap-4
            ">

              {[
                "Event Expert",
                "IT Certified",
                "Community Focused",
              ].map((tag, index) => (

                <motion.span

                  key={index}

                  whileHover={{
                    scale: 1.05,
                    y: -3,
                  }}

                  className="
                    px-5
                    py-3
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/5
                    text-blue-300
                    text-sm
                    backdrop-blur-xl
                    transition
                  "
                >

                  {tag}

                </motion.span>

              ))}

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}