/* ==========================================
   PORTFOLIO PAGE

   Public page that displays all
   portfolio categories.

   Example:

   DJ Entertainment
   Photography & Videography
   Event Planning
========================================== */

import Link from "next/link";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

/* ==========================================
   LOAD PORTFOLIO CATEGORIES
========================================== */

async function getPortfolioCategories() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "portfolioCategories"
      )
    );

  return snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );
}

/* ==========================================
   PAGE COMPONENT
========================================== */

export default async function PortfolioPage() {

  const categories =
    await getPortfolioCategories();

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
        relative
        overflow-hidden
      "
    >

      {/* =====================================
          LOW OPACITY BACKGROUND IMAGE
      ===================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.08]
          z-0
        "
      >

        <img
          public="/images/bg1.jpg"
          alt="Background"

          className="
            w-full
            h-full
            object-cover
          "
        />

      </div>

      {/* =====================================
          DARK OVERLAY
      ===================================== */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/70
          via-black/80
          to-black
          z-0
        "
      ></div>

      {/* =====================================
          AMBIENT GLOW - TOP RIGHT
      ===================================== */}

      <div
        className="
          absolute
          top-0
          right-0
          w-[500px]
          h-[500px]
          bg-yellow-500/10
          blur-[60px]
          md:blur-[120px]
          rounded-full
          z-0
        "
      ></div>

      {/* =====================================
          AMBIENT GLOW - BOTTOM LEFT
      ===================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-[500px]
          h-[500px]
          bg-blue-500/10
          blur-[60px]
          md:blur-[120px]
          rounded-full
          z-0
        "
      ></div>

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <section
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          pt-24
          pb-16
        "
      >

        {/* =====================================
            TOP BAR
        ===================================== */}

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
            mb-12
          "
        >

          {/* LEFT SIDE */}

          <div>

            {/* BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/5
                border
                border-white/10
                rounded-full
                px-5
                py-2
                mb-8
                backdrop-blur-xl
              "
            >

              <div
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-yellow-400
                "
              ></div>

              <span
                className="
                  text-yellow-300
                  text-sm
                  uppercase
                  tracking-wide
                  font-semibold
                "
              >

                Our Work

              </span>

            </div>

            {/* TITLE */}

            <h1
              className="
                text-5xl
                md:text-7xl
                font-black
                leading-tight
                mb-6
              "
            >

              Our

              <span
                className="
                  text-yellow-400
                "
              >

                {" "}Portfolio

              </span>

            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                text-zinc-400
                text-lg
                md:text-xl
                max-w-3xl
                leading-relaxed
              "
            >

              Explore our professional work across
              entertainment, technology, photography,
              videography, conferences, networking,
              and event experiences.

            </p>

          </div>

          {/* =====================================
              BACK TO HOME BUTTON
          ===================================== */}

          <div>

            <Link
              href="/"
            >

              <button
                className="
                  bg-white/5
                  border
                  border-white/10
                  hover:bg-yellow-500
                  hover:text-black
                  text-white
                  px-8
                  py-4
                  rounded-2xl
                  font-semibold
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                "
              >

                ← Back To Home

              </button>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================
          PORTFOLIO CATEGORY GRID
      ===================================== */}

      <section
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          pb-28
        "
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
        >

          {categories.map(
            (category) => (

              <Link
                key={category.id}
                href={`/portfolio/${category.slug}`}
              >

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    hover:border-yellow-500/40
                    transition-all
                    duration-500
                    cursor-pointer
                    shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  "
                >

                  {/* =====================================
                      CATEGORY IMAGE
                  ===================================== */}

                  {category.image && (

                    <div
                      className="
                        relative
                        overflow-hidden
                      "
                    >

                      <img
                        src={category.image}

                        alt={category.name}

                        className="
                          w-full
                          h-72
                          object-cover
                          transition-transform
                          duration-700
                          lg:group-hover:scale-110
                        "
                      />

                      {/* IMAGE OVERLAY */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black
                          via-black/20
                          to-transparent
                        "
                      ></div>

                    </div>

                  )}

                  {/* =====================================
                      CATEGORY INFO
                  ===================================== */}

                  <div
                    className="
                      p-7
                    "
                  >

                    {/* TITLE */}

                    <h2
                      className="
                        text-3xl
                        font-black
                        mb-4
                        group-hover:text-yellow-400
                        transition
                      "
                    >

                      {category.name}

                    </h2>

                    {/* DESCRIPTION */}

                    <p
                      className="
                        text-zinc-400
                        leading-relaxed
                        mb-6
                      "
                    >

                      {category.description}

                    </p>

                    {/* BUTTON */}

                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-yellow-400
                        font-semibold
                        group-hover:gap-4
                        transition-all
                        duration-300
                      "
                    >

                      View Portfolio →

                    </div>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      </section>

    </div>

  );
}