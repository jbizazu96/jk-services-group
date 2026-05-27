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
} from "framer-motion";

/* ==========================================
   PORTFOLIO GALLERY COMPONENT
========================================== */

export default function
PortfolioGallery({
  portfolioItems,
}) {

  /* ==========================================
     LIGHTBOX STATE
  ========================================== */

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  return (

    <>

      {/* =====================================
          GALLERY GRID
      ===================================== */}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},

          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "
      >

        {portfolioItems.map(
          (item) => (

            <motion.div
              key={item.id}

              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                },

                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}

              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              onClick={() =>
                setSelectedImage(
                  item
                )
              }
            >

              {/* ==========================
                  CARD
              ========================== */}

              <div
                className="
                  bg-white
                  rounded-[28px]
                  overflow-hidden
                  shadow-lg

                  hover:shadow-2xl
                  hover:-translate-y-2

                  transition-all
                  duration-500
                "
              >

                {/* ==========================
                    IMAGE
                ========================== */}

                {item.mediaType ===
                "photo" ? (

                  <img
                    src={
                      item.mediaUrl
                    }
                    alt={
                      item.title
                    }
                    className="
                      w-full
                      h-[420px]
                      object-cover

                      group-hover:scale-[1.03]

                      transition-transform
                      duration-700
                    "
                  />

                ) : (

                /* ==========================
                    VIDEO
                ========================== */

                  <video
                    muted
                    playsInline
                    className="
                      w-full
                      h-[420px]
                      object-cover
                    "
                  >
                    <source
                      src={
                        item.mediaUrl
                      }
                    />
                  </video>

                )}

              </div>

            </motion.div>

          )
        )}

      </motion.div>

      {/* =====================================
          LIGHTBOX MODAL
      ===================================== */}

      {selectedImage && (

        <div
          className="
            fixed
            inset-0
            z-50

            bg-black/95

            flex
            items-center
            justify-center

            p-6
          "
          onClick={() =>
            setSelectedImage(
              null
            )
          }
        >

          {/* ==========================
              CLOSE BUTTON
          ========================== */}

          <button
            className="
              absolute
              top-6
              right-6

              text-white
              text-5xl

              z-50
            "
          >
            ×
          </button>

          {/* ==========================
              IMAGE PREVIEW
          ========================== */}

          {selectedImage.mediaType ===
          "photo" ? (

            <img
              src={
                selectedImage.mediaUrl
              }
              alt={
                selectedImage.title
              }
              className="
                max-w-full
                max-h-[90vh]
                rounded-2xl
              "
            />

          ) : (

            <video
              controls
              autoPlay
              className="
                max-w-full
                max-h-[90vh]
                rounded-2xl
              "
            >
              <source
                src={
                  selectedImage.mediaUrl
                }
              />
            </video>

          )}

        </div>

      )}

    </>

  );
}