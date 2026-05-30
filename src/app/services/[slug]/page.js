
"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
} from "react";

/* ==========================================
   NEXT
========================================== */

import {
  useParams,
} from "next/navigation";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
} from "framer-motion";

import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import ServiceCategoryHero from "@/components/service/ServiceCategoryHero";
import BookingModal from "@/components/home/modals/BookingModal";

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
   PAGE
========================================== */

export default function CategoryPage() {

  const params =
    useParams();

  const slug =
    params.slug;

  const [category, setCategory] =
    useState(null);

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    /* ==========================================
   BOOKING MODAL
========================================== */

const [
  selectedService,
  setSelectedService,
] = useState(null);

const [
  bookingModal,
  setBookingModal,
] = useState(false);

  /* ==========================================
     LOAD DATA
  ========================================== */

  useEffect(() => {

    if (!slug) return;

    loadPage();

  }, [slug]);

  /* ==========================================
     LOAD CATEGORY + SERVICES
  ========================================== */

  const loadPage = async () => {

    try {

      setLoading(true);

      /* CATEGORY */

      const categoryQuery =
        query(
          collection(
            db,
            "serviceCategories"
          ),
          where(
            "slug",
            "==",
            slug
          )
        );

      const categorySnapshot =
        await getDocs(
          categoryQuery
        );

      if (
        categorySnapshot.empty
      ) {

        setLoading(false);

        return;
      }

      const categoryDoc =
        categorySnapshot.docs[0];

      const categoryData = {

        id:
          categoryDoc.id,

        ...categoryDoc.data(),

      };

      setCategory(
        categoryData
      );

      /* SERVICES */

      const servicesQuery =
            query(
                collection(
                db,
                "services"
                ),
                where(
                "active",
                "==",
                true
                ),
                where(
                "category",
                "==",
                categoryData.name
                )
            );

      const servicesSnapshot =
        await getDocs(
          servicesQuery
        );

      const serviceItems =
        servicesSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setServices(
        serviceItems
      );

    } catch (error) {

      console.error(
        error
      );

    } finally {

      setLoading(false);
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-white text-xl">

          Loading...

        </div>

      </div>

    );
  }

  /* ==========================================
     CATEGORY NOT FOUND
  ========================================== */

  if (!category) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-white text-xl">

          Category not found

        </div>

      </div>

    );
  }

/* ==========================================
   PAGE
========================================== */

return (

  <div
    className="
      relative
      min-h-screen
      overflow-hidden
      bg-black
      text-white
    "
  >

    {/* =====================================
        AMBIENT GLOWS
    ===================================== */}

    <div
      className="
        absolute
        top-0
        right-0
        h-[500px]
        w-[500px]
        rounded-full
        bg-yellow-500/10
        blur-[120px]
      "
    />

    <div
      className="
        absolute
        bottom-0
        left-0
        h-[500px]
        w-[500px]
        rounded-full
        bg-blue-500/10
        blur-[120px]
      "
    />

    {/* =====================================
        HERO
    ===================================== */}

    <ServiceCategoryHero
      title={category.name}
      description={category.description}
      image={category.image}
      serviceCount={services.length}
    />

    {/* =====================================
        CURVED TRANSITION
    ===================================== */}

    <div
      className="
        relative
        z-20
        -mt-16
        min-h-[120px]
        rounded-t-[40px]
        border-t
        border-white/10
        bg-gradient-to-b
        from-zinc-950
        via-black
        to-slate-950
      "
    />

    {/* =====================================
        SERVICES SECTION
    ===================================== */}

    <section
      className="
        relative
        z-30
        overflow-hidden
        bg-gradient-to-b
        from-zinc-950
        via-black
        to-slate-950
      "
    >

      {/* INNER GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%)]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-6
          pb-24
        "
      >

        {/* HEADER */}

        <div
          className="
            mb-16
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <p
              className="
                mb-4
                text-sm
                uppercase
                tracking-[0.3em]
                text-yellow-400
              "
            >
              Premium Services
            </p>

            <h2
              className="
                max-w-3xl
                text-4xl
                font-black
                leading-tight
                md:text-6xl
              "
            >
              Explore Our Services
            </h2>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-6
              py-5
              backdrop-blur-xl
            "
          >

            <p className="text-zinc-500">
              Total Services
            </p>

            <h3
              className="
                mt-2
                text-5xl
                font-black
              "
            >
              {services.length}
            </h3>

          </div>

        </div>

        {/* SERVICES GRID */}

        <div
          className="
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {services.map(
            (
              service,
              index
            ) => (

              <motion.div

                key={service.id}

                initial={{
                  opacity: 0,
                  y: 50,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay:
                    index * 0.08,
                }}

                whileHover={{
                  y: -10,
                }}

                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[36px]
                  h-[520px]
                  border
                  border-white/10
                  hover:border-yellow-500/40
                  transition
                  duration-500
                "
              >

                {/* IMAGE */}

                <img
                  src={service.image}
                  alt={service.name}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-110
                  "
                />

                {/* OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/70
                    to-black/20
                  "
                />

                {/* CONTENT */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
                    justify-end
                    p-8
                  "
                >

                  <div className="mb-4">

                    <span
                      className="
                        inline-block
                        rounded-full
                        bg-yellow-500
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-black
                      "
                    >

                      {service.priceText}

                    </span>

                  </div>

                  <h3
                    className="
                      mb-4
                      text-3xl
                      font-black
                    "
                  >

                    {service.name}

                  </h3>

                  <p
                    className="
                      mb-8
                      text-gray-300
                    "
                  >

                    {service.description}

                  </p>

                  <motion.button

                    whileHover={{
                      scale: 1.03,
                    }}

                    whileTap={{
                      scale: 0.98,
                    }}

                    onClick={() => {

                      setSelectedService(
                        service.name
                      );

                      setBookingModal(
                        true
                      );

                    }}

                    className="
                      w-full
                      rounded-2xl
                      bg-yellow-500
                      py-4
                      text-lg
                      font-bold
                      text-black
                      transition
                      hover:bg-yellow-400
                    "
                  >

                    Book Now

                  </motion.button>

                </div>

              </motion.div>

            )
          )}

        </div>

      </div>

    </section>

    {/* =====================================
        BOOKING MODAL
    ===================================== */}

    <BookingModal

      bookingModal={
        bookingModal
      }

      setBookingModal={
        setBookingModal
      }

      selectedService={
        selectedService
      }

    />

  </div>
);
}
