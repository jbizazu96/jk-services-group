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

  import PortfolioGallery from "@/components/portfolio/PortfolioGallery";

  import Image from "next/image";
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

                /* ==========================================
                  LOAD PORTFOLIO ITEMS
                ========================================== */

                const portfolioItems =
                  await getPortfolioItems(
                    category.name
                  );

                /* ==========================================
                  CONVERT FIRESTORE OBJECTS

                  Client Components only accept
                  plain serializable objects
                ========================================== */

                const serializedPortfolioItems =
                  portfolioItems.map(
                    (item) => ({

                      ...item,

                      createdAt:
                        item.createdAt
                          ? item.createdAt.toDate().toISOString()
                          : null,

                    })
                  );

                  const featuredHeroItem = serializedPortfolioItems[0];

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
                        bg-white
                        text-white
                      "
                    >
                {/* =====================================
                    HERO SECTION
                ===================================== */}

                <div
                  className="
                    relative
                    h-[360px]
                    md:h-[420px]
                    overflow-hidden
                  "
                >

                  {/* ================================
                      HERO BACKGROUND IMAGE
                  ================================ */}

                  <Image

                    src={
                      featuredHeroItem?.mediaUrl ||
                      category.image
                    }

                    alt={category.name}

                    fill

                    priority

                    className="
                      absolute
                      inset-0
                      object-cover
                    "

                  />

                  {/* ================================
                      DARK OVERLAY
                  ================================ */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/70
                    "
                  ></div>

                  {/* ================================
                      HERO CONTENT
                  ================================ */}

                  <div
                    className="
                      relative
                      z-10
                      max-w-6xl
                      mx-auto
                      px-6
                      h-full
                      flex
                      flex-col
                      justify-center
                    "
                  >

                    {/* BACK BUTTON */}

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

                    {/* CATEGORY TITLE */}

                    <h1
                      className="
                        text-6xl
                        md:text-6xl
                        font-black
                        text-white
                        mb-6
                      "
                    >
                      {category.name}
                    </h1>

                    {/* CATEGORY DESCRIPTION */}

                    <p
                      className="
                        text-xl
                        text-gray-300
                        max-w-2xl
                      "
                    >
                      {category.description}
                    </p>

                  </div>

                </div>

                      {/* =====================================
                        HERO BOTTOM CURVE
                    ===================================== */}

                    <div
                      className="
                        relative
                        -mt-16
                        z-20
                        bg-white
                        rounded-t-[40px]
                        min-h-[120px]
                      "
                    ></div>

      {/* =====================================
          PORTFOLIO ITEMS GRID
      ===================================== */}

              <div
          className="
            bg-white
            relative
            z-30
          "
        >

          <div
            className="
              max-w-6xl
              mx-auto
              px-6
              pb-24
            "
          >

          <PortfolioGallery
            portfolioItems={
              serializedPortfolioItems
            }
          />

      </div>

    </div>
    </div>

  );
}