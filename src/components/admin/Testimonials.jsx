"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
  useRef,
} from "react";

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
   TESTIMONIAL COMPONENT
========================================== */

export default function Testimonials() {

  /* ==========================================
     STATE
  ========================================== */

  const [feedbacks, setFeedbacks] =
    useState([]);

  /* ==========================================
     CAROUSEL REFERENCE
  ========================================== */

  const sliderRef =
    useRef(null);

  /* ==========================================
     LOAD FEEDBACKS
  ========================================== */

  useEffect(() => {

    loadFeedbacks();

  }, []);

  const loadFeedbacks = async () => {

    try {

      const q = query(

        collection(
          db,
          "feedbacks"
        ),

        where(
          "approved",
          "==",
          true
        )

      );

      const snapshot =
        await getDocs(q);

      const items =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setFeedbacks(items);

    } catch (error) {

      console.error(
        "Testimonials Error:",
        error
      );

    }

  };

        /* ==========================================
            SCROLL LEFT
        ========================================== */

        const scrollLeft = () => {

        sliderRef.current?.scrollBy({

            left: -400,

            behavior: "smooth",

        });

        setCurrentIndex((prev) =>
            Math.max(prev - 1, 0)
        );

        };

        /* ==========================================
            SCROLL RIGHT
        ========================================== */

        const scrollRight = () => {

        sliderRef.current?.scrollBy({

            left: 400,

            behavior: "smooth",

        });

        setCurrentIndex((prev) =>

            Math.min(

            prev + 1,

            feedbacks.length - 1

            )

        );

};

  /* ==========================================
   CURRENT SLIDE
========================================== */

const [currentIndex,
      setCurrentIndex] =
  useState(0);
  return (

  <div>

    {/* ==========================================
        TESTIMONIAL CAROUSEL
    ========================================== */}

    <div
      className="
        flex
        items-center
        gap-4
      "
    >

      {/* LEFT ARROW */}

      <button

        onClick={scrollLeft}

        className="
          flex-shrink-0

          w-14
          h-14

          rounded-full

          bg-white/10
          hover:bg-yellow-500

          transition

          text-2xl
          font-bold
        "
      >
        ←
      </button>

      {/* CARDS CONTAINER */}

      <div

        ref={sliderRef}

        className="
          flex
          gap-8

          overflow-x-auto

          scroll-smooth

          scrollbar-hide

          flex-1

          pb-4
        "
      >

        {feedbacks.map((item) => (

          <div

            key={item.id}

            className="
              min-w-[350px]
              max-w-[350px]

              bg-white/5
              border
              border-white/10

              backdrop-blur-xl

              rounded-[32px]

              p-8

              transition
              duration-500

              hover:-translate-y-2
              hover:border-yellow-500/40

              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "

          >

            {/* STARS */}

            <div
              className="
                text-yellow-400
                text-xl
                mb-6
              "
            >
              {"★".repeat(
                item.rating || 5
              )}
            </div>

            {/* FEEDBACK */}

            <p
              className="
                text-gray-300
                leading-relaxed
                text-lg
              "
            >
              "{item.feedback}"
            </p>

            {/* CUSTOMER */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-yellow-500
                  flex
                  items-center
                  justify-center
                  text-black
                  font-black
                  text-lg
                "
              >
                {item.name?.charAt(0)}
              </div>

              <div>

                <h4
                  className="
                    font-bold
                    text-xl
                  "
                >
                  {item.name}
                </h4>

                <p
                  className="
                    text-gray-400
                  "
                >
                  {item.service}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* RIGHT ARROW */}

      <button

        onClick={scrollRight}

        className="
          flex-shrink-0

          w-14
          h-14

          rounded-full

          bg-white/10
          hover:bg-yellow-500

          transition

          text-2xl
          font-bold
        "
      >
        →
      </button>

    </div>

    {/* ==========================================
        DOT INDICATORS
    ========================================== */}

    <div
      className="
        flex
        justify-center
        gap-3
        mt-8
      "
    >

      {feedbacks.map((_, index) => (

        <div

          key={index}

          className={`

            w-3
            h-3

            rounded-full

            transition

            ${

              index === currentIndex

                ? "bg-yellow-500"

                : "bg-white/20"

            }

          `}

        />

      ))}

    </div>

  </div>

);


}