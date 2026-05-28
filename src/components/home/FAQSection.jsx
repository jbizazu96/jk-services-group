"use client";

/* ==========================================
   REACT
========================================== */

import {
  useState,
} from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* ==========================================
   FAQ DATA
========================================== */

const faqData = [

  {
    question:
      "Who is J&K Services Group?",

    answer:
      "J&K Services Group is a professional multi-service company specializing in event services, networking and IT solutions, photography, videography, DJ entertainment, business consulting, and conference support. Our mission is to deliver premium experiences and reliable solutions tailored to every client’s needs.",
  },

  {
    question:
      "Can I schedule a consultation without paying?",

    answer:
      "Yes. We offer a free 15-minute introductory consultation where clients can discuss their needs, ask questions, and explore possible solutions before committing to a paid consultation or service.",
  },

  {
    question:
      "Are the prices listed on the website final?",

    answer:
      "Not always. The prices displayed on our services are estimated ranges. Final pricing may vary depending on factors such as event size, location, duration, customization, technical requirements, and overall project complexity.",
  },

  {
    question:
      "Do I pay for every consultation after purchasing a service?",

    answer:
      "No. In many cases, once a service agreement is finalized, follow-up discussions directly related to your booked service are included. Additional advanced consultations outside the original project scope may require separate booking.",
  },

  {
    question:
      "Do you travel for events or projects?",

    answer:
      "Yes. We are available for both local and out-of-state projects depending on availability, travel requirements, and scheduling arrangements.",
  },

  {
    question:
      "How far in advance should I book?",

    answer:
      "We recommend booking as early as possible, especially for weddings, conferences, and large events. Early booking helps secure availability and allows better planning and preparation.",
  },

  {
    question:
      "Do you offer custom packages?",

    answer:
      "Absolutely. We understand every client has unique needs. Custom packages can be created by combining services such as DJ, MC, photography, networking support, videography, and event coordination.",
  },

  {
    question:
      "What payment methods do you accept?",

    answer:
      "We accept secure online payments, card payments, and other approved payment methods depending on the service type and consultation arrangement.",
  },

];

/* ==========================================
   COMPONENT
========================================== */

export default function FAQSection() {

  /* ==========================================
     STATE
  ========================================== */

  const [openFAQ, setOpenFAQ] =
    useState([]);

  /* ==========================================
     TOGGLE FAQ
  ========================================== */

  const toggleFAQ = (index) => {

    if (openFAQ.includes(index)) {

      setOpenFAQ(
        openFAQ.filter(
          (item) => item !== index
        )
      );

    } else {

      setOpenFAQ([
        ...openFAQ,
        index,
      ]);

    }

  };

  /* ==========================================
     EXPAND / CLOSE ALL
  ========================================== */

  const toggleAllFAQs = () => {

    const allIndexes =
      faqData.map((_, index) => index);

    if (
      openFAQ.length ===
      faqData.length
    ) {

      setOpenFAQ([]);

    } else {

      setOpenFAQ(allIndexes);

    }

  };

  /* ==========================================
     JSX
  ========================================== */

  return (

    <section

      id="faq"

      className="
        relative
        py-32
        overflow-hidden
        bg-gradient-to-br
        from-[#f8f8f8]
        via-white
        to-slate-100
        text-black
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
          w-[450px]
          h-[450px]
          bg-yellow-200/40
          blur-[120px]
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
          bg-blue-200/30
          blur-[120px]
          rounded-full
        "
      ></motion.div>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="
        relative
        z-10
        max-w-4xl
        mx-auto
        px-6
        text-center
      ">

        {/* ==========================================
            BADGE
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 30,
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
            bg-yellow-500/10
            border
            border-yellow-500/20
            rounded-full
            px-5
            py-2
            mb-8
            backdrop-blur-md
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
              bg-yellow-500
            "
          ></motion.div>

          <span className="
            text-yellow-700
            text-sm
            uppercase
            tracking-wide
            font-semibold
          ">

            Frequently Asked Questions

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
            md:text-6xl
            font-black
            leading-tight
          "
        >

          Questions &

          <span className="
            text-yellow-500
          ">
            {" "}Answers
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
            mt-6
            text-lg
            text-gray-600
            leading-relaxed
            max-w-3xl
            mx-auto
          "
        >

          Everything you need to know about our
          services, consultations, pricing,
          and how we work with clients.

        </motion.p>

      </div>

      {/* ==========================================
          FAQ CONTENT
      ========================================== */}

      <div className="
        relative
        z-10
        max-w-5xl
        mx-auto
        px-6
        mt-20
      ">

        {/* ==========================================
            EXPAND ALL BUTTON
        ========================================== */}

        <motion.div

          initial={{
            opacity: 0,
            y: 40,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          className="
            flex
            justify-end
            mb-8
          "
        >

          <motion.button

            whileHover={{
              scale: 1.05,
              y: -2,
            }}

            whileTap={{
              scale: 0.98,
            }}

            onClick={toggleAllFAQs}

            className="
              bg-black
              hover:bg-yellow-500
              hover:text-black
              text-white
              px-6
              py-3
              rounded-full
              font-semibold
              transition
              shadow-xl
            "
          >

            {openFAQ.length === faqData.length
              ? "Close All"
              : "Expand All"}

          </motion.button>

        </motion.div>

        {/* ==========================================
            FAQ ITEMS
        ========================================== */}

        <div className="
          space-y-6
        ">

          {faqData.map(

            (faq, index) => (

              <motion.div

                key={index}

                initial={{
                  opacity: 0,
                  y: 40,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                }}

                viewport={{
                  once: true,
                }}

                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                }}

                whileHover={{
                  y: -3,
                }}

                className="
                  bg-white/70
                  backdrop-blur-xl
                  border
                  border-black/5
                  rounded-[28px]
                  overflow-hidden
                  shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                  transition
                  duration-300
                  hover:shadow-[0_20px_80px_rgba(0,0,0,0.12)]
                "
              >

                {/* ==========================================
                    QUESTION BUTTON
                ========================================== */}

                <button

                  onClick={() =>
                    toggleFAQ(index)
                  }

                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    text-left
                    p-8
                  "
                >

                  {/* QUESTION */}

                  <h3 className="
                    text-xl
                    md:text-2xl
                    font-bold
                    pr-6
                  ">

                    {faq.question}

                  </h3>

                  {/* ==========================================
                      ARROW ICON
                  ========================================== */}

                  <motion.div

                    animate={{
                      rotate:
                        openFAQ.includes(index)
                          ? 180
                          : 0,
                    }}

                    transition={{
                      duration: 0.3,
                    }}

                    className={`
                      text-3xl
                      font-light
                      ${
                        openFAQ.includes(index)
                          ? "text-yellow-500"
                          : "text-black"
                      }
                    `}
                  >

                    ↓

                  </motion.div>

                </button>

                {/* ==========================================
                    ANSWER SECTION
                ========================================== */}

                <AnimatePresence>

                  {openFAQ.includes(index) && (

                    <motion.div

                      initial={{
                        height: 0,
                        opacity: 0,
                      }}

                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}

                      exit={{
                        height: 0,
                        opacity: 0,
                      }}

                      transition={{
                        duration: 0.4,
                      }}

                      className="
                        overflow-hidden
                      "
                    >

                      <div className="
                        px-8
                        pb-8
                      ">

                        <p className="
                          text-gray-600
                          leading-relaxed
                          text-lg
                        ">

                          {faq.answer}

                        </p>

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </motion.div>

            )

          )}

        </div>

      </div>

    </section>
  );
}