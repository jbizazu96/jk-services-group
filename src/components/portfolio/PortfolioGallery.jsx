"use client";

/* ==========================================
   REACT
========================================== */

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* ==========================================
   NEXT NAVIGATION
========================================== */

import { useRouter } from "next/navigation";

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
  ArrowLeft,
  FolderOpen,
  Camera,
  Sparkles,
  Calendar,
  MessageCircle,
} from "lucide-react";

/* ==========================================
   PORTFOLIO GALLERY
========================================== */

export default function PortfolioGallery({
  portfolioItems = [],
  categoryName = "",
}) {
  const router = useRouter();

  /* ==========================================
     FILTER
  ========================================== */
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [sanitizedItems, setSanitizedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ==========================================
     SANITIZE DATA
  ========================================== */
  useEffect(() => {
    setIsLoading(true);
    if (portfolioItems && portfolioItems.length > 0) {
      const sanitized = portfolioItems.map((item) => ({
        id: item.id,
        title: item.title || "Untitled",
        description: item.description || "",
        categoryId: item.categoryId || "",
        categoryName: item.categoryName || "",
        slug: item.slug || "",
        featured: item.featured || false,
        active: item.active || false,
        media: item.media || [],
      }));
      setSanitizedItems(sanitized);
    }
    setIsLoading(false);
  }, [portfolioItems]);

  /* ==========================================
     FILTERED PROJECTS
  ========================================== */
  const filteredProjects = useMemo(() => {
    if (!sanitizedItems.length) return [];

    if (activeFilter === "all") {
      return sanitizedItems;
    }

    return sanitizedItems.filter(
      (project) => project.media?.some((media) => media.type === activeFilter)
    );
  }, [sanitizedItems, activeFilter]);

  /* ==========================================
     OPEN PROJECT
  ========================================== */
  const openProject = (project) => {
    setSelectedProject(project);
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
  const currentMedia = selectedProject?.media?.[currentMediaIndex];

  /* ==========================================
     NEXT MEDIA
  ========================================== */
  const nextMedia = useCallback(() => {
    if (!selectedProject) return;
    setCurrentMediaIndex((prev) =>
      prev === selectedProject.media.length - 1 ? 0 : prev + 1
    );
  }, [selectedProject]);

  /* ==========================================
     PREVIOUS MEDIA
  ========================================== */
  const previousMedia = useCallback(() => {
    if (!selectedProject) return;
    setCurrentMediaIndex((prev) =>
      prev === 0 ? selectedProject.media.length - 1 : prev - 1
    );
  }, [selectedProject]);

  /* ==========================================
     KEYBOARD NAVIGATION
  ========================================== */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === "ArrowLeft") previousMedia();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, previousMedia, nextMedia]);

  /* ==========================================
     GO BACK TO PORTFOLIO PAGE
  ========================================== */
  const goBackToPortfolio = () => {
    router.push("/portfolio");
  };

  /* ==========================================
     OPEN CONSULTATION MODAL
  ========================================== */
  const openConsultation = () => {
    const event = new CustomEvent("openConsultation");
    window.dispatchEvent(event);
  };

  /* ==========================================
     LOADING STATE
  ========================================== */
  if (isLoading) {
    return (
      <div className="text-center py-32">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  /* ==========================================
     EMPTY STATE - NO PROJECTS AT ALL
  ========================================== */
  if (sanitizedItems.length === 0) {
    return (
      <div className="text-center py-32">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.05] border border-white/10 mb-6"
        >
          <FolderOpen className="w-12 h-12 text-yellow-400" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          No Projects Yet
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-md mx-auto mb-8"
        >
          This category is being curated with amazing content. 
          Check back soon for stunning photography and cinematic projects!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={goBackToPortfolio}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
          
          <button
            onClick={openConsultation}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Request a Custom Project
            <Sparkles className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ==========================================
     EMPTY STATE - NO RESULTS FOR FILTER
  ========================================== */
  if (filteredProjects.length === 0 && activeFilter !== "all") {
    return (
      <div className="text-center py-32">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/[0.05] border border-white/10 mb-6"
        >
          {activeFilter === "image" ? (
            <Camera className="w-12 h-12 text-yellow-400" />
          ) : (
            <Video className="w-12 h-12 text-yellow-400" />
          )}
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          No {activeFilter === "image" ? "Photos" : "Videos"} Found
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-md mx-auto mb-8"
        >
          {activeFilter === "image" 
            ? "This category doesn't have any photos yet. Check out the videos instead!" 
            : "This category doesn't have any videos yet. Browse through the photos!"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setActiveFilter("all")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
            <Sparkles className="w-4 h-4" />
            View All Projects
          </button>
        </motion.div>
      </div>
    );
  }

  /* ==========================================
     MAIN RENDER - WITH PROJECTS
  ========================================== */

  return (
    <>
      {/* BACK BUTTON */}
      <div className="mb-8">
        <button
          onClick={goBackToPortfolio}
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Portfolio
        </button>
      </div>

      {/* STATS BAR */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <FolderOpen className="w-4 h-4" />
            <span className="text-sm">{sanitizedItems.length} Total Projects</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-gray-400">
            <Camera className="w-4 h-4" />
            <span className="text-sm">
              {sanitizedItems.filter(p => p.media?.some(m => m.type === "image")).length} Photos
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-gray-400">
            <Video className="w-4 h-4" />
            <span className="text-sm">
              {sanitizedItems.filter(p => p.media?.some(m => m.type === "video")).length} Videos
            </span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-12 flex flex-wrap gap-3">
        {[
          { label: "All Projects", value: "all", icon: Sparkles },
          { label: "Photos", value: "image", icon: Camera },
          { label: "Videos", value: "video", icon: Video },
        ].map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveFilter(filter.value)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300
              ${
                activeFilter === filter.value
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                  : "border border-white/20 text-white hover:border-yellow-500/50"
              }
            `}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* PROJECTS GRID */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProjects.map((project, idx) => {
          const coverMedia = project.media?.[0];
          const imageCount = project.media?.filter((m) => m.type === "image").length || 0;
          const videoCount = project.media?.filter((m) => m.type === "video").length || 0;

          return (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              onClick={() => openProject(project)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-yellow-500/40 transition-all duration-500"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-72 overflow-hidden">
                {coverMedia?.type === "video" ? (
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  >
                    <source src={coverMedia.url} />
                  </video>
                ) : (
                  <img
                    src={coverMedia?.url || "/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* PLAY ICON OVERLAY */}
                {coverMedia?.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-7 h-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                )}

                {/* FEATURED BADGE */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-yellow-400 transition">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {project.description || "Explore this cinematic project..."}
                </p>
                
                {/* MEDIA COUNTS */}
                <div className="flex items-center gap-4">
                  {imageCount > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> {imageCount}
                    </span>
                  )}
                  {videoCount > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Video className="w-3 h-3" /> {videoCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CINEMATIC MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              className="absolute right-6 top-6 z-50 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PREV BUTTON */}
            <button
              onClick={previousMedia}
              className="absolute left-6 z-50 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* NEXT BUTTON */}
            <button
              onClick={nextMedia}
              className="absolute right-6 z-50 w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* CONTENT */}
            <div className="max-w-6xl w-full">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {selectedProject.title}
                </h2>
                <p className="text-gray-400 mt-2 flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  Media {currentMediaIndex + 1} of {selectedProject.media.length}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black/50">
                {currentMedia?.type === "video" ? (
                  <video
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] object-contain"
                  >
                    <source src={currentMedia.url} />
                  </video>
                ) : (
                  <img
                    src={currentMedia?.url}
                    alt={selectedProject.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              {/* THUMBNAILS */}
              {selectedProject.media.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                  {selectedProject.media.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`
                        w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0
                        ${currentMediaIndex === idx ? "border-yellow-500" : "border-transparent opacity-60 hover:opacity-100"}
                      `}
                    >
                      <img
                        src={media.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}