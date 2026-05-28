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

import PortfolioGallery from "@/components/portfolio/PortfolioGallery";

import PortfolioHero from "@/components/portfolio/PortfolioHero";

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

     Params are async
  ========================================== */

  const {
    category: categorySlug,
  } = await params;

  /* ==========================================
     LOAD CATEGORY
  ========================================== */

  const category =
    await getCategory(
      categorySlug
    );

  /* ==========================================
     CATEGORY NOT FOUND
  ========================================== */

  if (!category) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
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
     SERIALIZE FIRESTORE DATA
  ========================================== */

  const serializedPortfolioItems =
    portfolioItems.map(
      (item) => ({

        ...item,

        createdAt:
          item.createdAt
            ? item.createdAt
                .toDate()
                .toISOString()
            : null,

      })
    );

  /* ==========================================
     FEATURED HERO IMAGE
  ========================================== */

  const featuredHeroItem =
    serializedPortfolioItems[0];

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

  /* ==========================================
     PAGE JSX
  ========================================== */

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
          HERO SECTION
      ===================================== */}

      <PortfolioHero

        title={category.name}

        description={
          category.description
        }

        image={
          featuredHeroItem?.mediaUrl ||
          category.image
        }

      />

      {/* =====================================
          HERO CURVE TRANSITION
      ===================================== */}

      <div
        className="
          relative
          -mt-16
          z-20
          bg-gradient-to-b
          from-zinc-950
          via-black
          to-slate-950
          rounded-t-[40px]
          min-h-[120px]
          border-t
          border-white/10
        "
      ></div>

      {/* =====================================
          PORTFOLIO GALLERY SECTION
      ===================================== */}

      <section
        className="
          relative
          z-30
          bg-gradient-to-b
          from-zinc-950
          via-black
          to-slate-950
          overflow-hidden
        "
      >

        {/* =====================================
            INNER CINEMATIC GLOW
        ===================================== */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%)]
            pointer-events-none
          "
        ></div>

        {/* =====================================
            CONTENT CONTAINER
        ===================================== */}

        <div
          className="
            relative
            max-w-6xl
            mx-auto
            px-6
            pb-24
          "
        >

          {/* =====================================
              PORTFOLIO GALLERY
          ===================================== */}

          <PortfolioGallery
            portfolioItems={
              serializedPortfolioItems
            }
          />

        </div>

      </section>

    </div>

  );
}