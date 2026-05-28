"use client";

/* ==========================================
   REACT
========================================== */

import {
  useMemo,
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
   NEXT IMAGE
========================================== */

import Image from "next/image";

/* ==========================================
   ICONS
========================================== */

import {
  ChevronLeft,
  ChevronRight,
  Images,
  Video,
  X,
  Play,
} from "lucide-react";

/* ==========================================
   PORTFOLIO GALLERY
========================================== */

export default function
PortfolioGallery({
  portfolioItems,
}) {

  /* ==========================================
     FILTER
  ========================================== */

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  /* ==========================================
     SELECTED PROJECT
  ========================================== */

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  /* ==========================================
     CURRENT MEDIA INDEX
  ========================================== */

  const [
    currentMediaIndex,
    setCurrentMediaIndex,
  ] = useState(0);

  /* ==========================================
     FILTERED PROJECTS
  ========================================== */

  const filteredProjects =
    useMemo(() => {

      if (
        activeFilter === "all"
      ) {

        return portfolioItems;
      }

      return portfolioItems.filter(
        (project) =>

          project.media?.some(
            (media) =>
              media.type ===
              activeFilter
          )
      );

    }, [
      portfolioItems,
      activeFilter,
    ]);

  /* ==========================================
     OPEN PROJECT
  ========================================== */

  const openProject = (
    project
  ) => {

    setSelectedProject(
      project
    );

    setCurrentMediaIndex(0);
  };

  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeModal = () => {

    setSelectedProject(null);

    setCurrentMediaIndex(0);
  };

  /* ==========================================
     CURRENT MEDIA
  ========================================== */

  const currentMedia =

    selectedProject?.media?.[
      currentMediaIndex
    ];

  /* ==========================================
     NEXT MEDIA
  ========================================== */

  const nextMedia = () => {

    if (!selectedProject)
      return;

    setCurrentMediaIndex(
      (prev) =>

        prev ===
        selectedProject.media
          .length - 1
          ? 0
          : prev + 1
    );
  };

  /* ==========================================
     PREVIOUS MEDIA
  ========================================== */

  const previousMedia = () => {

    if (!selectedProject)
      return;

    setCurrentMediaIndex(
      (prev) =>

        prev === 0
          ? selectedProject
              .media.length - 1
          : prev - 1
    );
  };

  return (

    <>

      {/* =====================================
          FILTERS
      ===================================== */}

      <div
        className="
          mb-14
          flex
          flex-wrap
          gap-4
        "
      >

        {[
          {
            label: "All",
            value: "all",
          },

          {
            label: "Photos",
            value: "image",
          },

          {
            label: "Videos",
            value: "video",
          },
        ].map((filter) => (

          <button
            key={filter.value}
            onClick={() =>
              setActiveFilter(
                filter.value
              )
            }
            className={`
              rounded-full
              px-7
              py-3
              font-semibold
              transition-all
              duration-300

              ${
                activeFilter ===
                filter.value

                  ? `
                    bg-white
                    text-black
                    shadow-2xl
                  `

                  : `
                    border
                    border-white/10
                    bg-white/[0.03]
                    text-white
                    hover:bg-white/[0.08]
                  `
              }
            `}
          >

            {filter.label}

          </button>
        ))}
      </div>

      {/* =====================================
          PROJECT GRID
      ===================================== */}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},

          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="
          grid
          grid-cols-1
          gap-8
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {filteredProjects.map(
          (project) => {

            const coverMedia =
              project.media?.[0];

            const imageCount =
              project.media?.filter(
                (media) =>
                  media.type ===
                  "image"
              ).length;

            const videoCount =
              project.media?.filter(
                (media) =>
                  media.type ===
                  "video"
              ).length;

            return (

              <motion.div
                key={project.id}

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
                }}

                onClick={() =>
                  openProject(
                    project
                  )
                }

                className="
                  group
                  cursor-pointer
                "
              >

                {/* CARD */}

                <div
                  className="
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-xl

                    transition-all
                    duration-500

                    hover:-translate-y-2
                    hover:border-white/20
                    hover:shadow-2xl
                  "
                >

                  {/* MEDIA */}

                  <div
                    className="
                      relative
                      h-[420px]
                      overflow-hidden
                      bg-black
                    "
                  >

                    {coverMedia?.type ===
                    "video" ? (

                      <video
                        muted
                        playsInline
                        preload="metadata"
                        className="
                          h-full
                          w-full
                          object-cover

                          transition-transform
                          duration-700

                          group-hover:scale-105
                        "
                      >
                        <source
                          src={
                            coverMedia.url
                          }
                        />
                      </video>

                    ) : (

                      <Image
                        src={
                          coverMedia?.url
                        }
                        alt={project.title}

                        fill

                        loading="lazy"

                        className="
                          object-cover

                          transition-transform
                          duration-700

                          group-hover:scale-105
                        "

                        sizes="
                          (max-width: 768px) 100vw,
                          (max-width: 1280px) 50vw,
                          33vw
                        "
                      />
                    )}

                    {/* OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-black
                        via-black/20
                        to-transparent
                      "
                    />

                    {/* PLAY ICON */}

                    {coverMedia?.type ===
                      "video" && (

                      <div
                        className="
                          absolute
                          left-1/2
                          top-1/2

                          flex
                          h-20
                          w-20

                          -translate-x-1/2
                          -translate-y-1/2

                          items-center
                          justify-center

                          rounded-full

                          bg-black/40
                          backdrop-blur-md
                        "
                      >

                        <Play
                          size={32}
                          className="
                            ml-1
                            text-white
                          "
                          fill="white"
                        />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0

                        p-6
                      "
                    >

                      <p
                        className="
                          mb-3
                          text-sm
                          uppercase
                          tracking-[0.3em]
                          text-yellow-400
                        "
                      >
                        Cinematic Project
                      </p>

                      <h3
                        className="
                          text-3xl
                          font-black
                          leading-tight
                        "
                      >
                        {project.title}
                      </h3>

                      {/* COUNTS */}

                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2

                            rounded-full
                            bg-white/10

                            px-4
                            py-2

                            text-sm
                            backdrop-blur-md
                          "
                        >

                          <Images
                            size={16}
                          />

                          {imageCount}
                          {" "}
                          Photos
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2

                            rounded-full
                            bg-white/10

                            px-4
                            py-2

                            text-sm
                            backdrop-blur-md
                          "
                        >

                          <Video
                            size={16}
                          />

                          {videoCount}
                          {" "}
                          Videos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </motion.div>

      {/* =====================================
          CINEMATIC MODAL
      ===================================== */}

      <AnimatePresence>

        {selectedProject && (

          <motion.div
            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="
              fixed
              inset-0
              z-[999]

              flex
              items-center
              justify-center

              bg-black/95
              backdrop-blur-md

              p-4
            "
          >

            {/* CLOSE */}

            <button
              onClick={
                closeModal
              }
              className="
                absolute
                right-6
                top-6
                z-50

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                bg-white/10

                backdrop-blur-md
              "
            >

              <X />
            </button>

            {/* LEFT */}

            <button
              onClick={
                previousMedia
              }
              className="
                absolute
                left-6
                z-50

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                bg-white/10

                backdrop-blur-md
              "
            >

              <ChevronLeft />
            </button>

            {/* RIGHT */}

            <button
              onClick={
                nextMedia
              }
              className="
                absolute
                right-6
                z-50

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                bg-white/10

                backdrop-blur-md
              "
            >

              <ChevronRight />
            </button>

            {/* CONTENT */}

            <div
              className="
                mx-auto
                flex
                w-full
                max-w-7xl
                flex-col
              "
            >

              {/* TITLE */}

              <div
                className="
                  mb-8
                  text-center
                "
              >

                <h2
                  className="
                    text-4xl
                    font-black
                    md:text-6xl
                  "
                >
                  {
                    selectedProject.title
                  }
                </h2>

                <p
                  className="
                    mt-3
                    text-zinc-400
                  "
                >
                  Media
                  {" "}
                  {currentMediaIndex + 1}
                  {" "}
                  of
                  {" "}
                  {
                    selectedProject
                      .media.length
                  }
                </p>
              </div>

              {/* MEDIA */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[32px]
                "
              >

                {currentMedia?.type ===
                "video" ? (

                  <video
                    controls
                    autoPlay
                    className="
                      max-h-[75vh]
                      w-full
                      rounded-[32px]
                      object-contain
                    "
                  >
                    <source
                      src={
                        currentMedia.url
                      }
                    />
                  </video>

                ) : (

                  <img
                    src={
                      currentMedia?.url
                    }
                    alt=""
                    className="
                      max-h-[75vh]
                      w-full
                      rounded-[32px]
                      object-contain
                    "
                  />
                )}
              </div>

              {/* THUMBNAILS */}

              <div
                className="
                  mt-8
                  flex
                  gap-4
                  overflow-x-auto
                  pb-2
                "
              >

                {selectedProject.media.map(
                  (
                    media,
                    index
                  ) => (

                    <button
                      key={index}

                      onClick={() =>
                        setCurrentMediaIndex(
                          index
                        )
                      }

                      className={`
                        relative
                        h-24
                        min-w-[100px]
                        overflow-hidden
                        rounded-2xl
                        border-2

                        transition-all

                        ${
                          currentMediaIndex ===
                          index

                            ? `
                              border-white
                            `

                            : `
                              border-transparent
                              opacity-60
                            `
                        }
                      `}
                    >

                      {media.type ===
                      "video" ? (

                        <video
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        >
                          <source
                            src={media.url}
                          />
                        </video>

                      ) : (

                        <img
                          src={media.url}
                          alt=""
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}