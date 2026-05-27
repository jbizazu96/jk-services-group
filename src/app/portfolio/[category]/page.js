/* ==========================================
   PORTFOLIO CATEGORY PAGE

   Displays all portfolio items
   that belong to a selected
   portfolio category.
========================================== */

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import Link from "next/link";

/* ==========================================
   LOAD PORTFOLIO CATEGORY
========================================== */

async function getCategory(
  slug
) {

  const snapshot =
    await getDocs(
      collection(
        db,
        "portfolioCategories"
      )
    );

  const categories =
    snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

  return categories.find(
    (item) =>
      item.slug === slug
  );
}

/* ==========================================
   LOAD PORTFOLIO ITEMS
========================================== */

async function getPortfolioItems(
  categoryName
) {

  const snapshot =
    await getDocs(
      collection(
        db,
        "portfolioItems"
      )
    );

  const items =
    snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

  return items.filter(
    (item) =>
      item.category ===
      categoryName
  );
}

/* ==========================================
   PAGE COMPONENT
========================================== */

export default async function
PortfolioCategoryPage({
  params,
}) {

  /* ==========================================
     NEXT.JS 15

     Params are now async
  ========================================== */

  const {
    category: categorySlug,
  } = await params;

  const category =
    await getCategory(
      categorySlug
    );

  /* ==========================
     CATEGORY NOT FOUND
  ========================== */

  if (!category) {

    return (

      
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-white
        "
      >
        Category Not Found
      </div>

    );
  }

  const portfolioItems =
    await getPortfolioItems(
      category.name
    );

        /* ==========================================
          DEBUG
        ========================================== */

        console.log(
          "Category Name:",
          category.name
        );

        console.log(
          "Portfolio Items:",
          portfolioItems
        );

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-16
        "
      >

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <Link
          href="/#gallery"
          className="
            inline-flex
            items-center
            gap-2
            mb-8
            text-yellow-400
            hover:text-yellow-300
            font-semibold
            transition
          "
        >
          ← Back To Portfolio
        </Link>

        <h1
          className="
            text-5xl
            font-bold
            mb-4
          "
        >
          {category.name}
        </h1>

        <p
          className="
            text-zinc-400
            text-lg
          "
        >
          {category.description}
        </p>

      </div>

      {/* =====================================
          PORTFOLIO ITEMS GRID
      ===================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          pb-20
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

          {portfolioItems.map(
            (item) => (

              <div
                key={item.id}
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  overflow-hidden
                "
              >

                {/* ==========================
                    PHOTO
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
                      h-72
                      object-cover
                    "
                  />

                ) : (

              /* ==========================
                VIDEO
              ========================== */

              item.mediaUrl ? (

                <video
                  controls
                  className="
                    w-full
                    h-72
                    object-cover
                  "
                >
                  <source
                    src={item.mediaUrl}
                  />
                </video>

              ) : (

                <div
                  className="
                    h-72
                    flex
                    items-center
                    justify-center
                    bg-zinc-800
                    text-zinc-400
                  "
                >
                  Video Missing
                </div>

              )

                )}

                {/* ==========================
                    ITEM DETAILS
                ========================== */}

                <div
                  className="
                    p-5
                  "
                >

                  <h2
                    className="
                      text-xl
                      font-bold
                      mb-3
                    "
                  >
                    {item.title}
                  </h2>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    {item.description}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}