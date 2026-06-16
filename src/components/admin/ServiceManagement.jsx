
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
  CheckCircle2,
  XCircle,
  ImageIcon,
  Layers3,
  DollarSign,
  Search,
  X,
  EyeOff,
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

export default function ServiceManagement() {

  /* =========================================
     STATES
  ========================================= */

  const [services, setServices] =
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

  const [editingService,
        setEditingService] =
    useState(null);

    /* =========================================
   CATEGORY OPTIONS
  ========================================= */

  const [categories, setCategories] =
  useState([]);

  /* =========================================
     FORM STATE
  ========================================= */

  const [formData, setFormData] =
    useState({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      priceText: "",
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
      category: "",
      priceText: "",
      description: "",
      image: "",
    });

  /* =========================================
     LOAD SERVICES
  ========================================= */

  const loadServices = async () => {

    try {

      setLoading(true);

      const q = query(
        collection(db, "services"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(q);

      const items = snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

      setServices(items);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const loadCategories = async () => {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "serviceCategories"
        )
      );

    const items =
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    setCategories(items);

  } catch (error) {

    console.error(error);

  }
};

useEffect(() => {

  loadServices();

  loadCategories();

}, []);

  /* =========================================
     FILTERED SERVICES
  ========================================= */

  const filteredServices =
    useMemo(() => {

      return services.filter((service) =>
        service.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [services, search]);

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange =
    (field, value) => {

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  /* =========================================
     HANDLE EDIT CHANGE
  ========================================= */

  const handleEditChange =
    (field, value) => {

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
        `services/${Date.now()}-${file.name}`
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
     ADD SERVICE
  ========================================= */

  const addService = async () => {

    if (!formData.name) {
      return alert(
        "Service name is required"
      );
    }

    try {

      await addDoc(
        collection(db, "services"),
        {
          ...formData,

          minPrice:
            Number(formData.minPrice),

          maxPrice:
            Number(formData.maxPrice),

          active: true,

          createdAt: new Date(),
        }
      );

      setFormData({
        name: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        priceText: "",
        description: "",
        image: "",
        featured: false,
      });

      loadServices();

    } catch (error) {

      console.error(error);

      alert("Failed to add service.");
    }
  };

  /* =========================================
     DELETE SERVICE
  ========================================= */

  const deleteService = async (id) => {

    const confirmDelete =
      confirm(
        "Delete this service?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "services", id)
      );

      loadServices();

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
      doc(db, "services", id),
      {
        active: !current,
      }
    );

    setServices((prev) =>
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
  async (
    id,
    current
  ) => {

    try {

      await updateDoc(
        doc(
          db,
          "services",
          id
        ),
        {
          featured: !current,
        }
      );

      setServices((prev) =>
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

  const openEdit = (service) => {

    setEditingService(service);

    setEditData({
      name: service.name || "",
      category:
        service.category || "",
      priceText:
        service.priceText || "",
      description:
        service.description || "",
      image: service.image || "",
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
          "services",
          editingService.id
        ),
        {
          ...editData,
        }
      );

      setEditingService(null);

      loadServices();

    } catch (error) {

      console.error(error);
    }
  };

  /* =========================================
     STATS
  ========================================= */

  const activeServices =
    services.filter(
      (item) => item.active
    ).length;

  const featuredServices =
    services.filter(
      (item) => item.featured
    ).length;

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="relative min-h-screen overflow-hidden bg-black text-white p-6 md:p-8">

      {/* =====================================
          BACKGROUND GLOW
      ===================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <div className="
            inline-flex 
            items-center 
            gap-2 
            rounded-full 
            border 
            border-white/10 
            bg-white/5 
            px-4 
            py-2 
            text-sm 
            text-zinc-300 
            backdrop-blur-md mb-5
            ">

              <Sparkles size={16} />

              Premium Admin Dashboard
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Service Management
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400 text-lg">
              Manage all J&K Services Group offerings with premium cinematic admin controls.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">

            <StatCard
              icon={<Layers3 size={22} />}
              title="Total"
              value={services.length}
            />

            <StatCard
              icon={<Star size={22} />}
              title="Featured"
              value={featuredServices}
            />

            <StatCard
              icon={<CheckCircle2 size={22} />}
              title="Active"
              value={activeServices}
            />

            <StatCard
              icon={<EyeOff size={22} />}
              title="Inactive"
              value={services.length - activeServices}
            />

          </div>
        </div>

        {/* =====================================
            FORM + SEARCH
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">

          {/* =====================================
              ADD SERVICE PANEL
          ===================================== */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sticky top-6 h-fit"
          >

            <div className="flex items-center gap-3 mb-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/20">
                <Plus />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Add Service
                </h2>

                <p className="text-sm text-zinc-500">
                  Create premium offerings.
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <InputField
                label="Service Name"
                value={formData.name}
                onChange={(e) =>
                  handleChange(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Photography & Videography"
              />

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Category
                </label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleChange(
                      "category",
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                >

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                    >

                      {category.name}

                    </option>

                  ))}

                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <InputField
                  label="Min Price"
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) =>
                    handleChange(
                      "minPrice",
                      e.target.value
                    )
                  }
                  placeholder="100"
                />

                <InputField
                  label="Max Price"
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    handleChange(
                      "maxPrice",
                      e.target.value
                    )
                  }
                  placeholder="1000"
                />
              </div>

              <InputField
                label="Price Display"
                value={formData.priceText}
                onChange={(e) =>
                  handleChange(
                    "priceText",
                    e.target.value
                  )
                }
                placeholder="$500 - $2500"
              />

              {/* IMAGE UPLOAD */}

              <div>

                <label className="mb-2 block text-sm text-zinc-400">
                  Service Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center transition hover:border-blue-500/50 hover:bg-blue-500/5">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                    <Upload size={28} />
                  </div>

                  <div>
                    <p className="font-medium">
                      Upload service image
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
                    className="mt-5 h-52 w-full rounded-2xl object-cover border border-white/10"
                  />
                )}
              </div>

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
                  placeholder="Describe this service..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">

                <div>
                  <p className="font-medium">
                    Featured Service
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
                onClick={addService}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500"
              >
                <Plus size={18} />
                Add Service
              </button>
            </div>
          </motion.div>

          {/* =====================================
              SERVICES SIDE
          ===================================== */}

          <div>

            {/* SEARCH */}

            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">

              <Search className="text-zinc-500" />

              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full bg-transparent outline-none placeholder:text-zinc-500"
              />
            </div>

            {/* GRID */}

            {loading ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                  />
                ))}
              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {filteredServices.map((service) => (

                  <motion.div
                    key={service.id}
                    
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                  >

                    <div className="relative overflow-hidden">

                      {service.image ? (

                        <img
                          src={service.image}
                          alt={service.name}
                          className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-64 items-center justify-center bg-white/[0.03]">
                          <ImageIcon
                            size={50}
                            className="text-zinc-700"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">

                        <div>
                          <p className="text-sm text-zinc-300">
                            {service.category}
                          </p>

                          <h3 className="text-2xl font-bold">
                            {service.name}
                          </h3>
                        </div>

                        {service.featured && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-black">
                            <Star fill="black" size={20} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6">

                      <p className="line-clamp-3 text-zinc-400">
                        {service.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between">

                        <p className="text-xl font-bold text-blue-400">
                          {service.priceText}
                        </p>

                        <div
                          className={`rounded-full px-4 py-2 text-sm font-medium ${
                            service.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {service.active
                            ? "Active"
                            : "Inactive"}
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            toggleActive(
                              service.id,
                              service.active
                            )
                          }
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
                        >
                          {service.active
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          onClick={() =>
                            toggleFeatured(
                              service.id,
                              service.featured
                            )
                          }
                          className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-yellow-400 transition hover:bg-yellow-500/20"
                        >
                          {service.featured
                            ? "Featured"
                            : "Feature"}
                        </button>

                        <button
                          onClick={() =>
                            openEdit(service)
                          }
                          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteService(service.id)
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

        {editingService && (

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
                    Edit Service
                  </h2>

                  <p className="mt-1 text-zinc-500">
                    Update service information.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEditingService(null)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] transition hover:bg-white/[0.08]"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-5">

                <InputField
                  label="Service Name"
                  value={editData.name}
                  onChange={(e) =>
                    handleEditChange(
                      "name",
                      e.target.value
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Category
                  </label>

                  <select
                    value={editData.category}
                    onChange={(e) =>
                      handleEditChange(
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
                  >

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >

                        {category.name}

                      </option>

                    ))}

                  </select>
                </div>

                <InputField
                  label="Price Display"
                  value={editData.priceText}
                  onChange={(e) =>
                    handleEditChange(
                      "priceText",
                      e.target.value
                    )
                  }
                />

                {/* IMAGE */}

                <div>

                  <label className="mb-2 block text-sm text-zinc-400">
                    Service Image
                  </label>

                  {editData.image && (
                    <img
                      src={editData.image}
                      alt="Service"
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
                    setEditingService(null)
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
   REUSABLE INPUT
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
   STATS CARD
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