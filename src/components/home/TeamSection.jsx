"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
} from "framer-motion";

/* ==========================================
   TEAM DATA
========================================== */

const teamMembers = [

  {
    name: "Josue Bizazu, CEO",

    role:
      "Network Engineer, MC, Preacher, and more",

    image: "/images/Me3.JPG",

    years: "5+",

    description:
      "A passionate leader, professional MC, network engineer, and technology consultant dedicated to excellence in both events and IT solutions. With years of experience in networking, leadership, public speaking, and community engagement, he brings professionalism, energy, and vision to every project and event he leads.",
  },

  {
    name: "Kerene Bizazu",

    role:
      "Universal Banker III, Event Planner, Usher, and more",

    image: "/images/Kerene.jpeg",

    years: "5+",

    description:
      "Universal Banker III with strong expertise in customer service, organization, event coordination, and time management. Fluent in five languages — Lingala, French, English, Portuguese, and Spanish — she creates welcoming and professional experiences for clients and guests. Her experience in ushering and event planning allows her to bring structure, elegance, and smooth coordination to every event.",
  },

  {
    name: "Jeremie Boko",

    role:
      "DJ, Coordinator, and more",

    image: "/images/jeremie.jpg",

    years: "2+",

    description:
      "Hardworking and highly motivated DJ and music professional with experience in live event entertainment, sound coordination, and audience engagement. Known for his professionalism, teamwork, and energy, he creates vibrant atmospheres that make every event memorable and enjoyable.",
  },

  {
    name: "Percy Sunda",

    role:
      "Photography, Videography, Designer, and more",

    image: "/images/percy2.png",

    years: "10+",

    description:
      "Talented photographer, videographer, and graphic designer with more than 10 years of creative experience. He has worked on multiple music video projects, weddings, events, and professional media productions. His passion for storytelling, visual creativity, and attention to detail allows him to capture unforgettable moments with cinematic quality and artistic excellence.",
  },

];

/* ==========================================
   COMPONENT
========================================== */

export default function TeamSection() {

  return (

    <section

      id="team"

      className="
        py-32
        bg-gradient-to-b
        from-black
        to-slate-950
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
          w-[400px]
          h-[400px]
          bg-yellow-500/10
          blur-[120px]
          rounded-full
        "
      />

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
          w-[400px]
          h-[400px]
          bg-blue-500/10
          blur-[120px]
          rounded-full
        "
      />

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        relative
        z-10
      ">

        {/* ==========================================
            SECTION HEADER
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
              Meet Our Team
            </span>

          </motion.div>

          {/* TITLE */}

          <h2 className="
            text-5xl
            md:text-6xl
            font-black
            leading-tight
            text-white
          ">

            Professionals Behind

            <br />

            The Excellence

          </h2>

          {/* DESCRIPTION */}

          <p className="
            text-gray-400
            text-xl
            mt-6
            max-w-3xl
            mx-auto
            leading-relaxed
          ">

            A dedicated team passionate about delivering
            unforgettable events and professional
            technology solutions.

          </p>

        </motion.div>

        {/* ==========================================
            TEAM GRID
        ========================================== */}

        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-2
          gap-10
        ">

          {teamMembers.map(

            (member, index) => (

              <motion.div

                key={member.name}

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
                  duration: 0.7,
                }}

                /* ==========================================
                   HOVER ANIMATION
                ========================================== */

                whileHover={{
                  y: -10,
                  scale: 1.01,
                }}

                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[36px]
                  bg-white/5
                  border
                  border-white/10
                  hover:border-yellow-500/30
                  transition
                  duration-500
                  backdrop-blur-xl
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                "
              >

                {/* ==========================================
                    IMAGE CONTAINER
                ========================================== */}

                <div className="
                  overflow-hidden
                  relative
                ">

                  <img
                    src={member.image}
                    alt={member.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-700
                    "
                  />

                  {/* IMAGE OVERLAY */}

                  <div className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/40
                    via-transparent
                    to-transparent
                  "></div>

                </div>

                {/* ==========================================
                    EXPERIENCE BADGE
                ========================================== */}

                <motion.div

                  animate={{
                    y: [0, -5, 0],
                  }}

                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}

                  className="
                    absolute
                    top-5
                    left-5
                    bg-blue-700
                    rounded-2xl
                    px-5
                    py-4
                    shadow-2xl
                    z-20
                  "
                >

                  <div className="
                    text-3xl
                    font-black
                    text-white
                  ">

                    {member.years}

                  </div>

                  <div className="
                    text-xs
                    tracking-[0.2em]
                    text-blue-100
                  ">

                    YEARS EXP.

                  </div>

                </motion.div>

                {/* ==========================================
                    CONTENT
                ========================================== */}

                <div className="
                  p-8
                ">

                  {/* NAME */}

                  <h3 className="
                    text-3xl
                    font-bold
                    mb-3
                    text-white
                  ">

                    {member.name}

                  </h3>

                  {/* ROLE */}

                  <p className="
                    text-yellow-400
                    text-lg
                    mb-6
                    font-medium
                  ">

                    {member.role}

                  </p>

                  {/* DESCRIPTION */}

                  <p className="
                    text-gray-400
                    leading-relaxed
                    text-[15px]
                  ">

                    {member.description}

                  </p>

                </div>

              </motion.div>

            )

          )}

        </div>

      </div>

    </section>
  );
}