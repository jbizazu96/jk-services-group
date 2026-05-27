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

    <div className="min-h-screen bg-black text-white">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-bold mb-4">
          Our Portfolio
        </h1>

        <p className="text-zinc-400 text-lg">
          Explore our work across
          events, entertainment,
          technology and media.
        </p>

      </div>

      {/* =====================================
          PORTFOLIO CATEGORY GRID
      ===================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {categories.map((category) => (

            <Link
              key={category.id}
              href={`/portfolio/${category.slug}`}
            >

              <div
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  overflow-hidden
                  hover:border-blue-500
                  transition
                  cursor-pointer
                "
              >

                {/* =========================
                    CATEGORY IMAGE
                ========================= */}

                {category.image && (

                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      w-full
                      h-64
                      object-cover
                    "
                  />

                )}

                {/* =========================
                    CATEGORY INFO
                ========================= */}

                <div className="p-6">

                  <h2
                    className="
                      text-2xl
                      font-bold
                      mb-3
                    "
                  >
                    {category.name}
                  </h2>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    {category.description}
                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );
}