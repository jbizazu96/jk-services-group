"use client";

import { useEffect, useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [donationMenu, setDonationMenu] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  /* ================================
     SCROLL EFFECT
  ================================ */

  useEffect(() => {

      const handleScroll = () => {

        setScrolled(window.scrollY > 40);

        /* CLOSE DONATION MENU */
        setDonationMenu(false);

        /* CLOSE MOBILE MENU */
        setMobileMenu(false);

      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  /* ================================
     NAV LINKS
  ================================ */

  const navLinks = [
    "Home",
    "Services",
    "Gallery",
    "Team",
    "About",
    "Contact",
  ];

  return (

    <motion.nav

      initial={{ y: -100 }}
      animate={{ y: 0 }}

      transition={{
        duration: 0.7,
      }}

      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-500

        ${
          scrolled
            ? `
              bg-black/80
              backdrop-blur-2xl
              border-b
              border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.35)]
            `
            : `
              bg-black/40
              backdrop-blur-xl
            `
        }
      `}
    >

      {/* ================================
          NAV CONTAINER
      ================================ */}

      <div className="
        max-w-7xl
        mx-auto
        px-6
        py-4
        flex
        items-center
        justify-between
      ">

        {/* ================================
            LOGO
        ================================ */}

        <motion.div

          whileHover={{
            scale: 1.02,
          }}

          className="
            flex
            items-center
            gap-3
            cursor-pointer
          "
        >

          <img
            src="/images/logo1.png"
            alt="J&K Services Group"
            className="
              w-14
              h-14
              object-contain
            "
          />

          <div>

            <h1 className="
              text-2xl
              font-black
              tracking-wide
              text-white
            ">
              J&K Services Group
            </h1>

            <p className="
              text-sm
              text-gray-300
            ">
              Event • IT • Networking • Media
            </p>

          </div>
        </motion.div>

        {/* ================================
            DESKTOP MENU
        ================================ */}

        <div className="
          hidden
          lg:flex
          items-center
          gap-8
        ">

          {navLinks.map((item) => (

            <motion.a

              key={item}

              href={`#${item.toLowerCase()}`}

              whileHover={{
                y: -2,
              }}

              className="
                relative
                text-white
                font-medium
                group
              "
            >

              {item}

              {/* ANIMATED UNDERLINE */}
              <span className="
                absolute
                -bottom-2
                left-0
                w-0
                h-[2px]
                bg-yellow-400
                transition-all
                duration-300
                group-hover:w-full
              "></span>

            </motion.a>

          ))}

          {/* ================================
              DONATE BUTTON
          ================================ */}

          <div className="relative">

            <motion.button

              whileHover={{
                scale: 1.05,
                y: -2,
              }}

              whileTap={{
                scale: 0.98,
              }}

              onClick={() =>
                setDonationMenu(
                  !donationMenu
                )
              }

              className="
                bg-yellow-500
                hover:bg-yellow-400
                text-black
                font-bold
                px-6
                py-3
                rounded-full
                transition
                shadow-[0_10px_40px_rgba(234,179,8,0.35)]
              "
            >
              Donate
            </motion.button>

            {/* ================================
                DONATION DROPDOWN
            ================================ */}

            <AnimatePresence>

              {donationMenu && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}

                  transition={{
                    duration: 0.25,
                  }}

                  className="
                    absolute
                    right-0
                    mt-4
                    w-72
                    bg-black/95
                    backdrop-blur-2xl
                    border
                    border-white/10
                    rounded-3xl
                    p-5
                    shadow-[0_20px_80px_rgba(0,0,0,0.45)]
                    z-50
                  "
                >

                  <h3 className="
                    text-xl
                    font-bold
                    mb-4
                    text-white
                  ">
                    Support Our Mission
                  </h3>

                  <div className="
                    flex
                    flex-col
                    gap-3
                  ">

                    {[
                      [
                        "Donate $10",
                        "https://buy.stripe.com/8x27sF8IK6at7O5gM5grS00",
                        "yellow",
                      ],

                      [
                        "Donate $25",
                        "https://buy.stripe.com/fZueV7aQS1Udc4l3ZjgrS03",
                        "dark",
                      ],

                      [
                        "Donate $50",
                        "https://buy.stripe.com/3cI7sF3oqfL39Wd1RbgrS04",
                        "dark",
                      ],

                      [
                        "Custom Amount",
                        "https://donate.stripe.com/6oU3cp3oq9mF4BTbrLgrS05",
                        "outline",
                      ],

                    ].map(([label, link, type]) => (

                      <motion.a

                        key={label}

                        whileHover={{
                          scale: 1.03,
                        }}

                        whileTap={{
                          scale: 0.98,
                        }}

                        href={link}

                        target="_blank"

                        className={`
                          text-center
                          py-3
                          rounded-2xl
                          font-semibold
                          transition

                          ${
                            type === "yellow"
                              ? `
                                bg-yellow-500
                                hover:bg-yellow-400
                                text-black
                              `
                              : type === "outline"
                              ? `
                                border
                                border-yellow-500
                                text-yellow-400
                                hover:bg-yellow-500
                                hover:text-black
                              `
                              : `
                                bg-white/10
                                text-white
                                hover:bg-white
                                hover:text-black
                              `
                          }
                        `}
                      >
                        {label}

                      </motion.a>

                    ))}

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>
        </div>

        {/* ================================
            MOBILE BUTTON
        ================================ */}

        <motion.button

          whileTap={{
            scale: 0.9,
          }}

          onClick={() =>
            setMobileMenu(!mobileMenu)
          }

          className="
            lg:hidden
            text-white
          "
        >

          {mobileMenu
            ? <X size={30} />
            : <Menu size={30} />
          }

        </motion.button>

      </div>

      {/* ================================
          MOBILE MENU
      ================================ */}

      <AnimatePresence>

        {mobileMenu && (

          <motion.div

            initial={{
              opacity: 0,
              height: 0,
            }}

            animate={{
              opacity: 1,
              height: "auto",
            }}

            exit={{
              opacity: 0,
              height: 0,
            }}

            transition={{
              duration: 0.3,
            }}

            className="
              lg:hidden
              bg-black/95
              backdrop-blur-2xl
              border-t
              border-white/10
              overflow-hidden
            "
          >

            <div className="
              flex
              flex-col
              p-6
              gap-6
            ">

              {navLinks.map((item) => (

                <motion.a

                  key={item}

                  href={`#${item.toLowerCase()}`}

                  whileHover={{
                    x: 5,
                  }}

                  onClick={() =>
                    setMobileMenu(false)
                  }

                  className="
                    text-white
                    text-lg
                    font-medium
                  "
                >
                  {item}
                </motion.a>

              ))}

              {/* MOBILE DONATE */}

              <motion.button

                whileHover={{
                  scale: 1.02,
                }}

                whileTap={{
                  scale: 0.98,
                }}

                onClick={() =>
                  setDonationMenu(
                    !donationMenu
                  )
                }

                className="
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  font-bold
                  px-6
                  py-4
                  rounded-full
                  transition
                "
              >
                Donate
              </motion.button>

              {/* MOBILE DONATION MENU */}

              <AnimatePresence>

                {donationMenu && (

                  <motion.div

                    initial={{
                      opacity: 0,
                      y: 10,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    exit={{
                      opacity: 0,
                      y: 10,
                    }}

                    className="
                      bg-white/5
                      border
                      border-white/10
                      rounded-3xl
                      p-5
                      flex
                      flex-col
                      gap-3
                    "
                  >

                    <h3 className="
                      text-xl
                      font-bold
                      text-white
                      mb-2
                    ">
                      Support Our Mission
                    </h3>

                    {[
                      [
                        "Donate $10",
                        "https://buy.stripe.com/8x27sF8IK6at7O5gM5grS00",
                      ],

                      [
                        "Donate $25",
                        "https://buy.stripe.com/fZueV7aQS1Udc4l3ZjgrS03",
                      ],

                      [
                        "Donate $50",
                        "https://buy.stripe.com/3cI7sF3oqfL39Wd1RbgrS04",
                      ],

                      [
                        "Custom Amount",
                        "https://donate.stripe.com/6oU3cp3oq9mF4BTbrLgrS05",
                      ],

                    ].map(([label, link]) => (

                      <a

                        key={label}

                        href={link}

                        target="_blank"

                        className="
                            bg-yellow-500
                            hover:bg-yellow-400
                            text-black
                            text-center
                            py-3
                            rounded-2xl
                            transition
                            font-semibold
                            shadow-[0_10px_30px_rgba(234,179,8,0.25)]
                          "
                      >
                        {label}

                      </a>

                    ))}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>
  );
}