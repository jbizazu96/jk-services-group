/* ==========================================
   PORTFOLIO CATEGORY PAGE
========================================== */

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import PortfolioHero from "@/components/portfolio/PortfolioHero";

/* ==========================================
   HELPER: SANITIZE DATA (Remove Firestore Timestamps)
========================================== */

function sanitizeProject(project, mediaItems) {
  const cleanProject = {
    id: project.id,
    title: project.title || "",
    description: project.description || "",
    categoryId: project.categoryId || "",
    categoryName: project.categoryName || "",
    slug: project.slug || "",
    featured: project.featured || false,
    active: project.active || false,
    order: project.order || 0,
  };

  cleanProject.media = mediaItems.map((media) => ({
    id: media.id,
    url: media.url || "",
    type: media.type || "image",
    title: media.title || "",
    portfolioItemId: media.portfolioItemId || "",
    order: media.order || 0,
  }));

  return cleanProject;
}

/* ==========================================
   LOAD CATEGORY
========================================== */

async function getCategory(slug) {
  const snapshot = await getDocs(collection(db, "portfolioCategories"));
  const categories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return categories.find((item) => item.slug === slug);
}

/* ==========================================
   LOAD PORTFOLIO PROJECTS
========================================== */

async function getPortfolioProjects(categoryId) {
  const q = query(
    collection(db, "portfolioItems"),
    where("categoryId", "==", categoryId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ==========================================
   LOAD MEDIA
========================================== */

async function getPortfolioMedia() {
  const snapshot = await getDocs(collection(db, "portfolioMedia"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ==========================================
   PAGE
========================================== */

export default async function PortfolioCategoryPage({ params }) {
  const { category: categorySlug } = await params;

  /* ==========================================
     LOAD CATEGORY
  ========================================== */
  const category = await getCategory(categorySlug);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Category Not Found
      </div>
    );
  }

  /* ==========================================
     LOAD PROJECTS + MEDIA
  ========================================== */
  const [portfolioProjects, portfolioMedia] = await Promise.all([
    getPortfolioProjects(category.id),
    getPortfolioMedia(),
  ]);

  /* ==========================================
     GROUP MEDIA BY PROJECT & SANITIZE
  ========================================== */
  const projectsWithMedia = portfolioProjects.map((project) => {
    const projectMedia = portfolioMedia.filter(
      (mediaItem) => mediaItem.portfolioItemId === project.id
    );
    return sanitizeProject(project, projectMedia);
  });

  /* ==========================================
     HERO IMAGE - USE CATEGORY'S OWN IMAGE FIRST
     This ensures the hero uses the category image, not the first project's media
  ========================================== */
  const heroImage = category.image || "/images/portfolio-placeholder.jpg";

  /* ==========================================
     PAGE
  ========================================== */
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* AMBIENT GLOWS */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* HERO - Now using category's own image */}
      <PortfolioHero
        title={category.name}
        description={category.description}
        image={heroImage}
      />

      {/* TRANSITION CURVE */}
      <div className="relative z-20 -mt-16 min-h-[120px] rounded-t-[40px] border-t border-white/10 bg-gradient-to-b from-zinc-950 via-black to-slate-950" />

      {/* PROJECT SHOWCASE SECTION */}
      <section className="relative z-30 overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24">
          {/* SECTION HEADER */}
          <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-yellow-400">
                Luxury Showcase
              </p>
              <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Cinematic Project Gallery
              </h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl">
              <p className="text-zinc-500">Total Projects</p>
              <h3 className="mt-2 text-5xl font-black">{projectsWithMedia.length}</h3>
            </div>
          </div>

          {/* PORTFOLIO GALLERY */}
          <PortfolioGallery portfolioItems={projectsWithMedia} />
        </div>
      </section>
    </div>
  );
}