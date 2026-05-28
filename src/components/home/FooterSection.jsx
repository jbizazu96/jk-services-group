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
  Phone,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";

/* ==========================================
   COMPONENT
========================================== */

export default function FooterSection() {

  /* ==========================================
     SERVICES DATA
  ========================================== */

  const services = [

    "MC Services",
    "DJ Music",
    "Event Planning",
    "Photography",
    "Videography",
    "Networking",
    "IT Support",

  ];

  /* ==========================================
     COMPANY LINKS
  ========================================== */

  const companyLinks = [

    {
      name: "About Us",
      href: "#about",
    },

    {
      name: "Book Appointment",
      href: "#home",
    },

    {
      name: "Pricing",
      href: "#services",
    },

    {
      name: "Consultation",
      href: "#schedule",
    },

  ];

  /* ==========================================
     JSX
  ========================================== */

  return (

    <footer

      id="contact"

      className="
        relative
        overflow-hidden
        bg-black
        border-t
        border-white/10
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
          MAIN CONTAINER
      ========================================== */}

      <div className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-6
        py-24
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-14
      ">

        {/* ==========================================
            BRAND SECTION
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.6,
          }}

        >

          {/* LOGO */}

          <motion.img

            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}

            src="/images/logo1.png"

            alt="logo1"

            className="
              w-28
              mb-6
            "
          />

          {/* DESCRIPTION */}

          <p className="
            text-gray-400
            leading-relaxed
            text-[15px]
          ">

            Professional event, IT,
            networking, and creative
            services focused on excellence,
            innovation, and unforgettable
            client experiences.

          </p>

        </motion.div>

        {/* ==========================================
            SERVICES SECTION
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.1,
            duration: 0.6,
          }}

        >

          {/* TITLE */}

          <h3 className="
            text-2xl
            font-bold
            mb-6
            text-white
          ">

            Services

          </h3>

          {/* LINKS */}

          <ul className="
            space-y-4
          ">

            {services.map(
              (service, index) => (

                <motion.li

                  key={index}

                  whileHover={{
                    x: 5,
                  }}

                  className="
                    text-gray-400
                    hover:text-yellow-400
                    transition
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                  "
                >

                  <ChevronRight
                    size={16}
                  />

                  {service}

                </motion.li>

              )
            )}

          </ul>

        </motion.div>

        {/* ==========================================
            COMPANY SECTION
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.2,
            duration: 0.6,
          }}

        >

          {/* TITLE */}

          <h3 className="
            text-2xl
            font-bold
            mb-6
            text-white
          ">

            Company

          </h3>

          {/* LINKS */}

          <ul className="
            space-y-4
          ">

            {companyLinks.map(
              (item, index) => (

                <motion.li

                  key={index}

                  whileHover={{
                    x: 5,
                  }}

                >

                  <a

                    href={item.href}

                    className="
                      text-gray-400
                      hover:text-yellow-400
                      transition
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <ChevronRight
                      size={16}
                    />

                    {item.name}

                  </a>

                </motion.li>

              )
            )}

          </ul>

        </motion.div>

        {/* ==========================================
            CONTACT SECTION
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            delay: 0.3,
            duration: 0.6,
          }}

        >

          {/* TITLE */}

          <h3 className="
            text-2xl
            font-bold
            mb-6
            text-white
          ">

            Contact

          </h3>

          {/* CONTACT ITEMS */}

          <div className="
            space-y-5
            text-gray-400
          ">

            {/* PHONE */}

            <motion.div

              whileHover={{
                x: 5,
              }}

              className="
                flex
                items-center
                gap-3
              "
            >

              <Phone
                className="
                  text-yellow-400
                "
                size={20}
              />

              <span>
                (319) 361-3575
              </span>

            </motion.div>

            {/* EMAIL 1 */}

            <motion.div

              whileHover={{
                x: 5,
              }}

              className="
                flex
                items-center
                gap-3
              "
            >

              <Mail
                className="
                  text-yellow-400
                "
                size={20}
              />

              <span>
                info@myjkservices.com
              </span>

            </motion.div>

            {/* EMAIL 2 */}

            <motion.div

              whileHover={{
                x: 5,
              }}

              className="
                flex
                items-center
                gap-3
              "
            >

              <Mail
                className="
                  text-yellow-400
                "
                size={20}
              />

              <span>
                support@myjkservices.com
              </span>

            </motion.div>

            {/* EMAIL 3 */}

            <motion.div

              whileHover={{
                x: 5,
              }}

              className="
                flex
                items-center
                gap-3
              "
            >

              <Mail
                className="
                  text-yellow-400
                "
                size={20}
              />

              <span>
                booking@myjkservices.com
              </span>

            </motion.div>

            {/* AVAILABILITY */}

            <motion.div

              whileHover={{
                x: 5,
              }}

              className="
                flex
                items-center
                gap-3
              "
            >

              <Calendar
                className="
                  text-yellow-400
                "
                size={20}
              />

              <span>
                Available 7 Days a Week
              </span>

            </motion.div>

          </div>

        </motion.div>

      </div>

      {/* ==========================================
          BOTTOM COPYRIGHT
      ========================================== */}

      <div className="
        relative
        z-10
        border-t
        border-white/10
        py-8
        text-center
      ">

        <p className="
          text-gray-500
          text-sm
        ">

          © 2026 J&K Services Group.
          All rights reserved.

        </p>

      </div>

    </footer>
  );
}