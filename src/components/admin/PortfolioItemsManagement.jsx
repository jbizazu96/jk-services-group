"use client";

/* =========================================
   REACT
========================================= */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================
   FRAMER MOTION
========================================= */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* =========================================
   ICONS
========================================= */

import {
  Plus,
  Sparkles,
  Upload,
  Trash2,
  Star,
  Search,
  FolderKanban,
  Eye,
  CheckCircle2,
  X,
  Film,
  Images,
  Video,
} from "lucide-react";

/* =========================================
   FIREBASE
========================================= */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* =========================================
   FIREBASE STORAGE
========================================= */

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

/* =========================================
   SLUGIFY
========================================= */

const slugify = (text) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/* =========================================
   COMPONENT
========================================= */

export default function PortfolioItemsManagement() {

  /* =========================================
     STATES
  ========================================= */

  const [portfolioItems,
        setPortfolioItems] =
    useState([]);

  const [portfolioCategories,
        setPortfolioCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedItem,
        setSelectedItem] =
    useState(null);

  const [selectedFiles,
        setSelectedFiles] =
    useState([]);

  /* =========================================
     FORM DATA
  ========================================= */

  const [formData, setFormData] =
    useState({
      title: "",
      categoryId: "",
      categoryName: "",
      description: "",
      featured: false,
      active: true,
    });

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================
     LOAD CATEGORIES
  ========================================= */

  const loadPortfolioCategories =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "portfolioCategories"
            )
          );

        const items =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setPortfolioCategories(items);

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     LOAD ITEMS + MEDIA
  ========================================= */

  const loadPortfolioItems =
    async () => {

      try {

        setLoading(true);

        const itemsQuery = query(
          collection(db, "portfolioItems"),
          orderBy("createdAt", "desc")
        );

        const [
          itemsSnapshot,
          mediaSnapshot,
        ] = await Promise.all([
          getDocs(itemsQuery),
          getDocs(
            collection(
              db,
              "portfolioMedia"
            )
          ),
        ]);

        const media =
          mediaSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        const items =
          itemsSnapshot.docs.map((doc) => {

            const itemData = {
              id: doc.id,
              ...doc.data(),
            };

            const itemMedia =
              media.filter(
                (mediaItem) =>
                  mediaItem.portfolioItemId ===
                  doc.id
              );

            return {
              ...itemData,
              media: itemMedia,
            };
          });

        setPortfolioItems(items);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadPortfolioCategories();

    loadPortfolioItems();

  }, []);

  /* =========================================
     FILTERED ITEMS
  ========================================= */

  const filteredItems =
    useMemo(() => {

      return portfolioItems.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.categoryName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [portfolioItems, search]);

  /* =========================================
     HANDLE FILE SELECT
  ========================================= */

  const handleFileSelect = (
    e
  ) => {

    const files = Array.from(
      e.target.files
    );

    setSelectedFiles(files);
  };

  /* =========================================
     ADD PORTFOLIO ITEM
  ========================================= */

  const addPortfolioItem =
    async () => {

      if (!formData.title) {

        return alert(
          "Project title required"
        );
      }

      if (
        selectedFiles.length === 0
      ) {

        return alert(
          "Upload at least one media file"
        );
      }

      try {

        setUploading(true);

        /* =====================================
            CREATE PROJECT
        ===================================== */

        const newProject = {

          title: formData.title,

          slug: slugify(
            formData.title
          ),

          categoryId:
            formData.categoryId,

          categoryName:
            formData.categoryName,

          description:
            formData.description,

          featured:
            formData.featured,

          active:
            formData.active,

          createdAt:
            Timestamp.now(),
        };

        const projectRef =
          await addDoc(
            collection(
              db,
              "portfolioItems"
            ),
            newProject
          );

        /* =====================================
            UPLOAD MEDIA
        ===================================== */

        const uploadedMedia = [];

        for (
          let index = 0;
          index <
          selectedFiles.length;
          index++
        ) {

          const file =
            selectedFiles[index];

          const mediaRef = ref(
            storage,
            `portfolio/${projectRef.id}/${Date.now()}-${file.name}`
          );

          await uploadBytes(
            mediaRef,
            file
          );

          const downloadURL =
            await getDownloadURL(
              mediaRef
            );

          const mediaType =
            file.type.startsWith(
              "video"
            )
              ? "video"
              : "image";

          const mediaData = {

            portfolioItemId:
              projectRef.id,

            type: mediaType,

            url: downloadURL,

            order: index,

            createdAt:
              Timestamp.now(),
          };

          const mediaDoc =
            await addDoc(
              collection(
                db,
                "portfolioMedia"
              ),
              mediaData
            );

          uploadedMedia.push({
            id: mediaDoc.id,
            ...mediaData,
          });
        }

        /* =====================================
            UPDATE LOCAL STATE
        ===================================== */

        setPortfolioItems(
          (prev) => [

            {
              id: projectRef.id,
              ...newProject,
              media: uploadedMedia,
            },

            ...prev,
          ]
        );

        /* =====================================
            RESET FORM
        ===================================== */

        setFormData({
          title: "",
          categoryId: "",
          categoryName: "",
          description: "",
          featured: false,
          active: true,
        });

        setSelectedFiles([]);

      } catch (error) {

        console.error(error);

      } finally {

        setUploading(false);
      }
    };

  /* =========================================
     DELETE ITEM
  ========================================= */

  const deletePortfolioItem =
    async (id) => {

      const confirmDelete =
        confirm(
          "Delete project?"
        );

      if (!confirmDelete) return;

      try {

        await deleteDoc(
          doc(
            db,
            "portfolioItems",
            id
          )
        );

        setPortfolioItems((prev) =>
          prev.filter(
            (item) => item.id !== id
          )
        );

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     TOGGLE FEATURED
  ========================================= */

  const toggleFeatured =
    async (
      id,
      current
    ) => {

      try {

        await updateDoc(
          doc(
            db,
            "portfolioItems",
            id
          ),
          {
            featured: !current,
          }
        );

        setPortfolioItems(
          (prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    featured:
                      !current,
                  }
                : item
            )
        );

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     TOGGLE ACTIVE
  ========================================= */

  const toggleActive =
    async (
      id,
      current
    ) => {

      try {

        await updateDoc(
          doc(
            db,
            "portfolioItems",
            id
          ),
          {
            active: !current,
          }
        );

        setPortfolioItems(
          (prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    active:
                      !current,
                  }
                : item
            )
        );

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     STATS
  ========================================= */

  const featuredCount =
    portfolioItems.filter(
      (item) => item.featured
    ).length;

  const activeCount =
    portfolioItems.filter(
      (item) => item.active
    ).length;

  const totalMediaCount =
    portfolioItems.reduce(
      (acc, item) =>
        acc +
        (item.media?.length || 0),
      0
    );

  const videoCount =
    portfolioItems.reduce(
      (acc, item) =>
        acc +
        item.media.filter(
          (media) =>
            media.type ===
            "video"
        ).length,
      0
    );

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="relative min-h-screen overflow-hidden bg-black p-6 text-white md:p-8">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-md">

              <Sparkles size={16} />

              Premium Cinematic Portfolio
            </div>

            <h1 className="text-5xl font-black tracking-tight">
              Portfolio Projects
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Create luxury multi-media showcase projects.
            </p>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <StatCard
              icon={<FolderKanban size={22} />}
              title="Projects"
              value={portfolioItems.length}
            />

            <StatCard
              icon={<Images size={22} />}
              title="Media"
              value={totalMediaCount}
            />

            <StatCard
              icon={<Film size={22} />}
              title="Videos"
              value={videoCount}
            />

            <StatCard
              icon={<Star size={22} />}
              title="Featured"
              value={featuredCount}
            />

          </div>
        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">

          {/* LEFT PANEL */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="sticky top-6 h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >

            <div className="space-y-5">

              <InputField
                label="Project Title"
                value={formData.title}
                onChange={(e) =>
                  handleChange(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Sarah Wedding"
              />

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Category
                </label>

                <select
                  value={
                    formData.categoryId
                  }
                  onChange={(e) => {

                    const selected =
                      portfolioCategories.find(
                        (item) =>
                          item.id ===
                          e.target.value
                      );

                    handleChange(
                      "categoryId",
                      selected.id
                    );

                    handleChange(
                      "categoryName",
                      selected.name
                    );
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
                >

                  <option value="">
                    Select Category
                  </option>

                  {portfolioCategories.map(
                    (item) => (

                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={
                    formData.description
                  }
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
                />
              </div>

              {/* FILE UPLOAD */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Upload Media
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 transition hover:border-blue-500/40">

                  <Upload size={30} />

                  <div className="text-center">

                    <p className="font-medium">
                      Upload Multiple Files
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Images & videos supported
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={
                      handleFileSelect
                    }
                    className="hidden"
                  />
                </label>

                {/* PREVIEW */}

                {selectedFiles.length >
                  0 && (

                  <div className="mt-5 grid grid-cols-3 gap-3">

                    {selectedFiles.map(
                      (
                        file,
                        index
                      ) => (

                        <div
                          key={index}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center"
                        >

                          {file.type.startsWith(
                            "video"
                          ) ? (

                            <Video
                              className="mx-auto mb-2 text-purple-400"
                              size={24}
                            />

                          ) : (

                            <Images
                              className="mx-auto mb-2 text-blue-400"
                              size={24}
                            />

                          )}

                          <p className="truncate text-xs text-zinc-400">
                            {file.name}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* FEATURED */}

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">

                <div>
                  <p className="font-medium">
                    Featured Project
                  </p>

                  <p className="text-sm text-zinc-500">
                    Highlight on homepage
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    formData.featured
                  }
                  onChange={() =>
                    handleChange(
                      "featured",
                      !formData.featured
                    )
                  }
                />
              </div>

              {/* BUTTON */}

              <button
                onClick={
                  addPortfolioItem
                }
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
              >

                <Plus size={18} />

                {uploading
                  ? "Uploading..."
                  : "Create Project"}
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}

          <div>

            {/* SEARCH */}

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">

              <Search className="text-zinc-500" />

              <input
                type="text"
                placeholder="Search project..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* GRID */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {filteredItems.map(
                (item) => (

                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                  >

                    {/* COVER */}

                    <div className="relative h-80 overflow-hidden bg-black">

                      {item.media?.[0]
                        ?.type ===
                      "video" ? (

                        <video
                          className="h-full w-full object-cover"
                        >
                          <source
                            src={
                              item
                                .media?.[0]
                                ?.url
                            }
                          />
                        </video>

                      ) : (

                        <img
                          src={
                            item.media?.[0]
                              ?.url
                          }
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-700 hover:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      <div className="absolute bottom-5 left-5 right-5">

                        <p className="text-sm text-zinc-300">
                          {
                            item.categoryName
                          }
                        </p>

                        <h3 className="text-3xl font-black">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-6">

                      <p className="line-clamp-3 text-zinc-400">
                        {
                          item.description
                        }
                      </p>

                      {/* MEDIA STATS */}

                      <div className="mt-5 flex flex-wrap gap-3">

                        <div className="rounded-full bg-white/[0.04] px-4 py-2 text-sm">

                          {
                            item.media
                              ?.length
                          }{" "}
                          media
                        </div>

                        <div className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                          {
                            item.media?.filter(
                              (
                                media
                              ) =>
                                media.type ===
                                "image"
                            ).length
                          }{" "}
                          images
                        </div>

                        <div className="rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-400">

                          {
                            item.media?.filter(
                              (
                                media
                              ) =>
                                media.type ===
                                "video"
                            ).length
                          }{" "}
                          videos
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            toggleActive(
                              item.id,
                              item.active
                            )
                          }
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          {item.active
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          onClick={() =>
                            toggleFeatured(
                              item.id,
                              item.featured
                            )
                          }
                          className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-yellow-400"
                        >
                          {item.featured
                            ? "Featured"
                            : "Feature"}
                        </button>

                        <button
                          onClick={() =>
                            setSelectedItem(
                              item
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3"
                        >

                          <Eye size={16} />

                          View
                        </button>

                        <button
                          onClick={() =>
                            deletePortfolioItem(
                              item.id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3"
                        >

                          <Trash2 size={16} />

                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          MODAL
      ===================================== */}

      <AnimatePresence>

        {selectedItem && (

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0B0F] p-8"
            >

              {/* HEADER */}

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <h2 className="text-4xl font-black">
                    {
                      selectedItem.title
                    }
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Luxury cinematic gallery
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedItem(
                      null
                    )
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]"
                >

                  <X />
                </button>
              </div>

              {/* GALLERY */}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {selectedItem.media?.map(
                  (
                    media,
                    index
                  ) => (

                    <div
                      key={index}
                      className="overflow-hidden rounded-3xl border border-white/10"
                    >

                      {media.type ===
                      "video" ? (

                        <video
                          controls
                          className="max-h-[500px] w-full"
                        >
                          <source
                            src={
                              media.url
                            }
                          />
                        </video>

                      ) : (

                        <img
                          src={
                            media.url
                          }
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full object-cover"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================
   INPUT FIELD
========================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
      />
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  title,
  value,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-blue-400">

        {icon}
      </div>

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-black">
        {value}
      </h3>
    </div>
  );
}