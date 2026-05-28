
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
  Star,
  Trash2,
  Pencil,
  Upload,
  Sparkles,
  Search,
  X,
  FolderKanban,
  Eye,
  CheckCircle2,
  ImageIcon,
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
  orderBy,
  query,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  db,
  storage,
} from "@/lib/firebase";

/* =========================================
   COMPONENT
========================================= */

export default function PortfolioManagement() {

  /* =========================================
     STATES
  ========================================= */

  const [portfolioCategories,
        setPortfolioCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [editUploading,
        setEditUploading] =
    useState(false);

  const [editingCategory,
        setEditingCategory] =
    useState(null);

  /* =========================================
     FORM STATE
  ========================================= */

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      image: "",
      featured: false,
    });

  /* =========================================
     EDIT FORM STATE
  ========================================= */

  const [editData, setEditData] =
    useState({
      name: "",
      description: "",
      image: "",
    });

  /* =========================================
     LOAD PORTFOLIO CATEGORIES
  ========================================= */

  const loadPortfolioCategories =
    async () => {

      try {

        setLoading(true);

        const q = query(
          collection(
            db,
            "portfolioCategories"
          ),
          orderBy(
            "createdAt",
            "desc"
          )
        );

        const snapshot =
          await getDocs(q);

        const items = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

        setPortfolioCategories(items);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadPortfolioCategories();

  }, []);

  /* =========================================
     FILTERED DATA
  ========================================= */

  const filteredCategories =
    useMemo(() => {

      return portfolioCategories.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      portfolioCategories,
      search,
    ]);

  /* =========================================
     HANDLE FORM CHANGE
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
     HANDLE EDIT CHANGE
  ========================================= */

  const handleEditChange = (
    field,
    value
  ) => {

    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const uploadImage = async (
    file,
    isEditing = false
  ) => {

    if (!file) return;

    try {

      if (isEditing) {
        setEditUploading(true);
      } else {
        setUploading(true);
      }

      const imageRef = ref(
        storage,
        `portfolio/${Date.now()}-${file.name}`
      );

      await uploadBytes(
        imageRef,
        file
      );

      const downloadURL =
        await getDownloadURL(imageRef);

      if (isEditing) {

        handleEditChange(
          "image",
          downloadURL
        );

      } else {

        handleChange(
          "image",
          downloadURL
        );
      }

    } catch (error) {

      console.error(error);

      alert("Image upload failed.");

    } finally {

      setUploading(false);
      setEditUploading(false);
    }
  };

  /* =========================================
     ADD CATEGORY
  ========================================= */

  const addPortfolioCategory =
    async () => {

      if (!formData.name) {

        return alert(
          "Category name is required"
        );
      }

      try {

        const slug =
          formData.name
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

        await addDoc(
          collection(
            db,
            "portfolioCategories"
          ),
          {
            ...formData,
            slug,
            active: true,
            createdAt: new Date(),
          }
        );

        setFormData({
          name: "",
          description: "",
          image: "",
          featured: false,
        });

        loadPortfolioCategories();

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     DELETE CATEGORY
  ========================================= */

  const deletePortfolioCategory =
    async (id) => {

      const confirmDelete =
        confirm(
          "Delete this category?"
        );

      if (!confirmDelete) return;

      try {

        await deleteDoc(
          doc(
            db,
            "portfolioCategories",
            id
          )
        );

        loadPortfolioCategories();

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================================
     TOGGLE ACTIVE
  ========================================= */

  const toggleActive = async (
    id,
    current
  ) => {

    await updateDoc(
      doc(
        db,
        "portfolioCategories",
        id
      ),
      {
        active: !current,
      }
    );

    setPortfolioCategories((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                active: !current,
              }
            : item
        )
      );
  };

  /* =========================================
     TOGGLE FEATURED
  ========================================= */

const toggleFeatured =
  async (id, current) => {

    try {

      await updateDoc(
        doc(
          db,
          "portfolioCategories",
          id
        ),
        {
          featured: !current,
        }
      );

      setPortfolioCategories((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                featured: !current,
              }
            : item
        )
      );

    } catch (error) {

      console.error(error);

    }
};

  /* =========================================
     OPEN EDIT
  ========================================= */

  const openEdit = (category) => {

    setEditingCategory(category);

    setEditData({
      name: category.name || "",
      description:
        category.description || "",
      image: category.image || "",
    });
  };

  /* =========================================
     SAVE EDIT
  ========================================= */

  const saveEdit = async () => {

    try {

      await updateDoc(
        doc(
          db,
          "portfolioCategories",
          editingCategory.id
        ),
        {
          ...editData,
        }
      );

      setEditingCategory(null);

      loadPortfolioCategories();

    } catch (error) {

      console.error(error);
    }
  };

  /* =========================================
     STATS
  ========================================= */

  const featuredCount =
    portfolioCategories.filter(
      (item) => item.featured
    ).length;

  const activeCount =
    portfolioCategories.filter(
      (item) => item.active
    ).length;

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="relative min-h-screen overflow-hidden bg-black p-6 text-white md:p-8">

      {/* =====================================
          AMBIENT GLOW
      ===================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-md">

              <Sparkles size={16} />

              Luxury Portfolio System
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Portfolio Management
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Manage portfolio categories with cinematic premium controls.
            </p>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-4 lg:w-auto">

            <StatCard
              icon={<FolderKanban size={22} />}
              title="Categories"
              value={portfolioCategories.length}
            />

            <StatCard
              icon={<Star size={22} />}
              title="Featured"
              value={featuredCount}
            />

            <StatCard
              icon={<CheckCircle2 size={22} />}
              title="Active"
              value={activeCount}
            />

            <StatCard
              icon={<Eye size={22} />}
              title="Showcase"
              value="Live"
            />

          </div>
        </div>

        {/* =====================================
            CONTENT GRID
        ===================================== */}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">

          {/* =====================================
              LEFT PANEL
          ===================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-6 h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >

            <div className="mb-8 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Plus />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Add Category
                </h2>

                <p className="text-sm text-zinc-500">
                  Create cinematic portfolio categories.
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <InputField
                label="Category Name"
                value={formData.name}
                onChange={(e) =>
                  handleChange(
                    "name",
                    e.target.value
                  )
                }
                placeholder="DJ Entertainment"
              />

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Portfolio Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center transition hover:border-blue-500/50 hover:bg-blue-500/5">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <Upload size={28} />
                  </div>

                  <div>
                    <p className="font-medium">
                      Upload portfolio image
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      PNG, JPG or WEBP
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      uploadImage(
                        e.target.files[0]
                      )
                    }
                  />
                </label>

                {uploading && (
                  <p className="mt-3 text-sm text-blue-400">
                    Uploading image...
                  </p>
                )}

                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-5 h-56 w-full rounded-3xl object-cover border border-white/10"
                  />
                )}
              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe this portfolio category..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              {/* FEATURED */}

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">

                <div>
                  <p className="font-medium">
                    Featured Category
                  </p>

                  <p className="text-sm text-zinc-500">
                    Highlight on homepage.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    handleChange(
                      "featured",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5"
                />
              </div>

              <button
                onClick={addPortfolioCategory}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500"
              >
                <Plus size={18} />
                Add Category
              </button>
            </div>
          </motion.div>

          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <div>

            {/* SEARCH */}

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">

              <Search className="text-zinc-500" />

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-transparent outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* GRID */}

            {loading ? (

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                  />
                ))}
              </div>

            ) : (

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {filteredCategories.map((category) => (

                  <motion.div
                    key={category.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                  >

                    {/* IMAGE */}

                    <div className="relative overflow-hidden">

                      {category.image ? (

                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-72 items-center justify-center bg-white/[0.03]">
                          <ImageIcon
                            size={50}
                            className="text-zinc-700"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">

                        <div>
                          <p className="text-sm text-zinc-300">
                            Portfolio Category
                          </p>

                          <h3 className="text-3xl font-black">
                            {category.name}
                          </h3>
                        </div>

                        {category.featured && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-black">
                            <Star fill="black" size={20} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-6">

                      <p className="line-clamp-3 text-zinc-400">
                        {category.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between">

                        <div
                          className={`rounded-full px-4 py-2 text-sm font-medium ${
                            category.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {category.active
                            ? "Active"
                            : "Inactive"}
                        </div>

                        <div className="text-sm text-zinc-500">
                          /portfolio/{category.slug}
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            toggleActive(
                              category.id,
                              category.active
                            )
                          }
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
                        >
                          {category.active
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          onClick={() =>
                            toggleFeatured(
                              category.id,
                              category.featured
                            )
                          }
                          className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-yellow-400 transition hover:bg-yellow-500/20"
                        >
                          {category.featured
                            ? "Featured"
                            : "Feature"}
                        </button>

                        <button
                          onClick={() =>
                            openEdit(category)
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deletePortfolioCategory(
                              category.id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-medium transition hover:bg-red-500"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          EDIT MODAL
      ===================================== */}

      <AnimatePresence>

        {editingCategory && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0B0B0F] p-8"
            >

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <h2 className="text-3xl font-bold">
                    Edit Category
                  </h2>

                  <p className="mt-1 text-zinc-500">
                    Update portfolio information.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingCategory(null)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] transition hover:bg-white/[0.08]"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-5">

                <InputField
                  label="Category Name"
                  value={editData.name}
                  onChange={(e) =>
                    handleEditChange(
                      "name",
                      e.target.value
                    )
                  }
                />

                {/* IMAGE */}

                <div>

                  <label className="mb-2 block text-sm text-zinc-400">
                    Portfolio Image
                  </label>

                  {editData.image && (
                    <img
                      src={editData.image}
                      alt="Category"
                      className="mb-5 h-72 w-full rounded-3xl object-cover border border-white/10"
                    />
                  )}

                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-5 transition hover:border-blue-500/50 hover:bg-blue-500/5">

                    <Upload size={18} />

                    Change Image

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        uploadImage(
                          e.target.files[0],
                          true
                        )
                      }
                    />
                  </label>

                  {editUploading && (
                    <p className="mt-3 text-blue-400">
                      Uploading image...
                    </p>
                  )}
                </div>

                <div>

                  <label className="mb-2 block text-sm text-zinc-400">
                    Description
                  </label>

                  <textarea
                    rows={6}
                    value={editData.description}
                    onChange={(e) =>
                      handleEditChange(
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">

                <button
                  onClick={() =>
                    setEditingCategory(null)
                  }
                  className="rounded-2xl border border-white/10 px-6 py-3 transition hover:bg-white/[0.03]"
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Save Changes
                </button>
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
  type = "text",
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
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-blue-500"
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