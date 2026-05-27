"use client";

/* ==========================================
   REACT
========================================== */

import {
  useRef,
  useState,
} from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
} from "framer-motion";

/* ==========================================
   NEXT IMAGE
========================================== */

import Image from "next/image";

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

  /* ==========================================
      FILTER STATE
    ========================================== */

    const [
      activeFilter,
      setActiveFilter,
    ] = useState("all");

    
  /* ==========================================
      VIDEO REFERENCES
    ========================================== */

    const videoRefs =
      useRef({});

       /* ==========================================
          FILTERED PORTFOLIO ITEMS
        ========================================== */

        const filteredItems =
          portfolioItems.filter(
            (item) => {

              if (
                activeFilter === "all"
              ) {
                return true;
              }

              return (
                item.mediaType ===
                activeFilter
              );

            }
          );


  return (

    <>

    {/* =====================================
            FILTER BUTTONS
        ===================================== */}

        <div
          className="
            flex
            items-center
            gap-4
            mb-12
            flex-wrap
          "
        >

          {/* ALL */}

          <button
            onClick={() =>
              setActiveFilter(
                "all"
              )
            }
            className={`
              px-6
              py-3
              rounded-full
              font-semibold
              transition-all

              ${
                activeFilter === "all"
                  ? "bg-black text-white"
                  : "bg-zinc-200 text-black hover:bg-zinc-300"
              }
            `}
          >
            All
          </button>

          {/* PHOTOS */}

          <button
            onClick={() =>
              setActiveFilter(
                "photo"
              )
            }
            className={`
              px-6
              py-3
              rounded-full
              font-semibold
              transition-all

              ${
                activeFilter === "photo"
                  ? "bg-black text-white"
                  : "bg-zinc-200 text-black hover:bg-zinc-300"
              }
            `}
          >
            Photos
          </button>

          {/* VIDEOS */}

          <button
            onClick={() =>
              setActiveFilter(
                "video"
              )
            }
            className={`
              px-6
              py-3
              rounded-full
              font-semibold
              transition-all

              ${
                activeFilter === "video"
                  ? "bg-black text-white"
                  : "bg-zinc-200 text-black hover:bg-zinc-300"
              }
            `}
          >
            Videos
          </button>

        </div>

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

        {filteredItems.map(
          (item) => (

            <motion.div
              key={item.id}

            onMouseEnter={() => {

              if (
                item.mediaType === "video" &&
                videoRefs.current[item.id]
              ) {

                videoRefs
                  .current[item.id]
                  .play();

              }

            }}

            onMouseLeave={() => {

              if (
                item.mediaType === "video" &&
                videoRefs.current[item.id]
              ) {

                videoRefs
                  .current[item.id]
                  .pause();

                videoRefs
                  .current[item.id]
                  .currentTime = 0;

              }

            }}

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

                 <div
                    className="
                      relative
                      w-full
                      h-[420px]
                    "
                  >

                    <Image
                      src={item.mediaUrl}
                      alt={item.title}

                      fill

                      className="
                        object-cover

                        group-hover:scale-[1.03]

                        transition-transform
                        duration-700
                      "

                      sizes="
                        (max-width: 768px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                      "

                      priority={false}
                    />

                  </div>

                ) : (

                /* ==========================
                    VIDEO
                ========================== */

                  <video

                    ref={(element) => {

                      videoRefs.current[item.id] =
                        element;

                    }}

                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="
                      w-full
                      h-[420px]
                      object-cover

                      group-hover:scale-[1.03]

                      transition-transform
                      duration-700
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