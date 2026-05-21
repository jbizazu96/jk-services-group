"use client";

/* ================================
   REACT
================================ */

import { useEffect, useState } from "react";

/* ================================
   FIREBASE
================================ */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   FIREBASE STORAGE IMPORTS
   Used for uploading service images
========================================== */

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase";


/* ================================
   COMPONENT
================================ */

export default function ServiceManagement() {

  /* ================================
     SERVICES LIST
  ================================ */

  const [services, setServices] = useState([]);

  /* ================================
     ADD SERVICE FORM
  ================================ */

  const [name, setName] = useState("");

  const [category, setCategory] =
    useState("Events");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [priceText, setPriceText] =
    useState("");

  const [image, setImage] =
    useState("");

  const [description,
        setDescription] =
    useState("");

  const [featured,
        setFeatured] =
    useState(false);

   /* ==========================================
      EDIT IMAGE UPLOAD STATE
    ========================================== */

    const [editUploading,
          setEditUploading] =
      useState(false);

  /* ================================
     EDIT SERVICE MODAL
  ================================ */

  const [editingService,
        setEditingService] =
    useState(null);

  const [editName,
        setEditName] =
    useState("");

  const [editCategory,
        setEditCategory] =
    useState("Events");

  const [editDescription,
        setEditDescription] =
    useState("");

  const [editPriceText,
        setEditPriceText] =
    useState("");

  const [editImage,
        setEditImage] =
    useState("");

  /* ================================
     LOAD SERVICES FROM FIRESTORE
  ================================ */

  const loadServices = async () => {

    const snapshot = await getDocs(
      collection(db, "services")
    );

    const items = snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );

    setServices(items);
  };

  /* ================================
     INITIAL PAGE LOAD
  ================================ */

  useEffect(() => {

    loadServices();

  }, []);

  /* ================================
     ADD NEW SERVICE
  ================================ */

  const addService = async () => {

    if (!name) return;

    await addDoc(
      collection(db, "services"),
      {
        name,
        category,

        minPrice:
          Number(minPrice),

        maxPrice:
          Number(maxPrice),

        priceText,

        image,

        description,

        active: true,

        featured,

        createdAt:
          new Date(),
      }
    );

    setName("");
    setCategory("Events");
    setMinPrice("");
    setMaxPrice("");
    setPriceText("");
    setImage("");
    setImagePreview("");
    setDescription("");
    setFeatured(false);

    loadServices();
  };

  /* ================================
     DELETE SERVICE
  ================================ */

  const deleteService = async (id) => {

    if (
      !confirm(
        "Delete service?"
      )
    )
      return;

    await deleteDoc(
      doc(
        db,
        "services",
        id
      )
    );

    loadServices();
  };

  /* ================================
     ENABLE / DISABLE SERVICE
  ================================ */

  const toggleActive = async (
    id,
    current
  ) => {

    await updateDoc(
      doc(
        db,
        "services",
        id
      ),
      {
        active: !current,
      }
    );

    loadServices();
  };

  /* ================================
     FEATURE / UNFEATURE SERVICE
  ================================ */

  const toggleFeatured =
    async (
      id,
      current
    ) => {

      await updateDoc(
        doc(
          db,
          "services",
          id
        ),
        {
          featured:
            !current,
        }
      );

      loadServices();
    };

  /* ================================
     OPEN EDIT MODAL
  ================================ */

  const openEdit = (
    service
  ) => {

    setEditingService(
      service
    );

    setEditName(
      service.name || ""
    );

    setEditCategory(
      service.category ||
      "Events"
    );

    setEditDescription(
      service.description ||
      ""
    );

    setEditPriceText(
      service.priceText ||
      ""
    );

    setEditImage(
      service.image || ""
    );
  };

  /* ================================
     SAVE EDITED SERVICE
  ================================ */

  const saveEdit = async () => {

    await updateDoc(
      doc(
        db,
        "services",
        editingService.id
      ),
      {
        name: editName,

        category:
          editCategory,

        description:
          editDescription,

        priceText:
          editPriceText,

        image:
          editImage,
      }
    );

    setEditingService(null);

    loadServices();
  };

      /* ==========================================
      IMAGE UPLOAD STATES
    ========================================== */

    // Shows upload progress status
    const [uploading, setUploading] =
      useState(false);

    // Used to preview image before saving
    const [imagePreview,
          setImagePreview] =
      useState("");


      /* ==========================================
   IMAGE UPLOAD FUNCTION
========================================== */

/*
  Triggered when admin selects
  an image from their computer.

  Process:
  1. Select image
  2. Upload to Firebase Storage
  3. Get download URL
  4. Save URL to image state
  5. Display preview
*/

{/* const handleImageUpload =
  async (e) => {

    // Get selected file
    const file =
      e.target.files[0];

    // Exit if no file selected
    if (!file) return;

    try {

      // Start upload state
      setUploading(true);

      /*
        Create unique file path

        Example:
        services/
        1717000000-photo.jpg
      
      const storageRef = ref(
        storage,
        `services/${Date.now()}-${file.name}`
      );

      // Upload image
      await uploadBytes(
        storageRef,
        file
      );

      // Retrieve image URL
      const url =
        await getDownloadURL(
          storageRef
        );

      // Save image URL
      setImage(url);

      // Display preview
      setImagePreview(url);

    } catch (err) {

      console.error(
        "Upload Error:",
        err
      );

      alert(
        "Image upload failed"
      );

    } finally {

      // Stop upload state
      setUploading(false);
    }
  };*/}

    /* ==========================================
   IMAGE UPLOAD FUNCTION

   Upload image to Firebase Storage
   and save URL for Firestore.
========================================== */

const handleImageUpload =
  async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);

      /*
        Create unique filename

        Example:
        services/
        17123456-photo.jpg
      */

      const imageRef = ref(
        storage,
        `services/${Date.now()}-${file.name}`
      );

      /*
        Upload image
      */

      await uploadBytes(
        imageRef,
        file
      );

      /*
        Get public image URL
      */

      const downloadURL =
        await getDownloadURL(
          imageRef
        );

      /*
        Save image URL
      */

      setImage(
        downloadURL
      );

      /*
        Display preview
      */

      setImagePreview(
        downloadURL
      );

    } catch (error) {

      console.error(
        "Upload Error:",
        error
      );

      alert(
        "Image upload failed."
      );

    } finally {

      setUploading(false);

    }

  };

  /* ==========================================
   EDIT IMAGE UPLOAD

   Upload new image while
   editing existing service.
========================================== */

const handleEditImageUpload =
  async (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setEditUploading(true);

      const imageRef = ref(
        storage,
        `services/${Date.now()}-${file.name}`
      );

      await uploadBytes(
        imageRef,
        file
      );

      const downloadURL =
        await getDownloadURL(
          imageRef
        );

      setEditImage(
        downloadURL
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Image upload failed"
      );

    } finally {

      setEditUploading(false);

    }

  };


  /* ================================
     UI
  ================================ */

return (
  <div className="p-6">

    {/* =====================================
        PAGE HEADER
    ===================================== */}

    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white">
        Service Management
      </h1>

      <p className="text-gray-600 mt-2">
        Add, edit and manage all services
      </p>
    </div>

    {/* =====================================
        ADD SERVICE FORM
    ===================================== */}
<div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-10">
    

      <h2 className="text-2xl font-semibold text-white mb-6">
        Add New Service
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* SERVICE NAME */}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Service Name
          </label>

           <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Service Name"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-white p-3 placeholder:text-zinc-400"
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-white p-3"
          >
            <option value="Events">Events</option>
            <option value="Cleaning">Music</option>
            <option value="Transportation">Media</option>
            <option value="IT Services">IT Services</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>

        {/* MIN PRICE */}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Min Price
          </label>

          <input
            type="number"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            placeholder="100"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* MAX PRICE */}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Max Price
          </label>

          <input
            type="number"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            placeholder="500"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* PRICE TEXT */}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Price Display
          </label>

          <input
            type="text"
            value={priceText}
            onChange={(e) =>
              setPriceText(e.target.value)
            }
            placeholder="$100 - $500"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

         {/* ==========================================
              SERVICE IMAGE UPLOAD
          ========================================== */}

          <div className="md:col-span-2">

            <label
              className="
                block
                text-sm
                font-medium
                text-zinc-300
                mb-2
              "
            >
              Service Image
            </label>

            {/* FILE PICKER */}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                p-3
                text-white
              "
            />

            {/* UPLOAD STATUS */}

            {uploading && (

              <p
                className="
                  mt-3
                  text-blue-400
                "
              >
                Uploading image...
              </p>

            )}

            {/* IMAGE PREVIEW */}

            {imagePreview && (

              <div className="mt-4">

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="
                    h-48
                    w-full
                    object-cover
                    rounded-xl
                    border
                    border-zinc-700
                  "
                />

              </div>

            )}

          </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your service..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* FEATURED */}

      <div className="flex items-center gap-3 mt-5">

        <input
          type="checkbox"
          checked={featured}
          onChange={(e) =>
            setFeatured(e.target.checked)
          }
          className="h-5 w-5"
        />

        <span className="text-zinc-300">
          Featured Service
        </span>

      </div>

      {/* BUTTON */}

      <button
        onClick={addService}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
      >
        Add Service
      </button>

    </div>

    {/* =====================================
        SERVICES GRID
    ===================================== */}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {services.map((service) => (

        <div
          key={service.id}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500 transition"
        >

          {service.image && (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-52 object-cover"
            />
          )}

          <div className="p-5">

            <div className="flex justify-between items-start">

              <h3 className="text-xl font-bold text-white">
                {service.name}
              </h3>

              {service.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                  Featured
                </span>
              )}

            </div>

            <p className="text-sm text-gray-400 mt-1">
              {service.category}
            </p>

            <p className="text-zinc-300 mt-4">
              {service.description}
            </p>

            <div className="mt-4 text-blue-600 font-bold">
              {service.priceText}
            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-2 mt-5">

              {/* Active / Inactive */}

              <button
                onClick={() =>
                  toggleActive(
                    service.id,
                    service.active
                  )
                }
                className={`px-4 py-2 rounded-lg text-white ${
                  service.active
                    ? "bg-green-600"
                    : "bg-gray-600"
                }`}
              >
                {service.active
                  ? "Active"
                  : "Inactive"}
              </button>

              {/* Featured */}

              <button
                onClick={() =>
                  toggleFeatured(
                    service.id,
                    service.featured
                  )
                }
                className={`px-4 py-2 rounded-lg text-white ${
                  service.featured
                    ? "bg-yellow-500"
                    : "bg-zinc-700"
                }`}
              >
                {service.featured
                  ? "★ Featured"
                  : "☆ Feature"}
              </button>

              {/* Edit */}

              <button
                onClick={() =>
                  openEdit(service)
                }
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Edit
              </button>

              {/* Delete */}

              <button
                onClick={() =>
                  deleteService(service.id)
                }
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

    {/* =====================================
        EDIT MODAL
    ===================================== */}

    {editingService && (

      <div className="
        fixed
        inset-0
        bg-black/50
        z-50
        overflow-y-auto
        p-4
      ">

        <div className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-2xl
            p-6
            w-full
            max-w-4xl
            mx-auto
            my-10
          ">

          <h2 className="text-2xl font-bold text-white mb-6">
            Edit Service
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400"
            />

            <input
              type="text"
              value={editCategory}
              onChange={(e) =>
                setEditCategory(e.target.value)
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400"
            />

            <input
              type="text"
              value={editPriceText}
              onChange={(e) =>
                setEditPriceText(e.target.value)
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400"
            />


              {/* ==========================================
                  SERVICE IMAGE
              ========================================== */}

              <div>

                <label
                  className="
                    block
                    text-zinc-300
                    mb-2
                  "
                >
                  Service Image
                </label>

                {/* CURRENT IMAGE */}

                {editImage && (

                  <img
                    src={editImage}
                    alt="Service"
                    className="
                      w-full
                      h-64
                      object-cover
                      rounded-xl
                      border
                      border-zinc-700
                      mb-4
                      p-3
                    "
                  />

                )}

                {/* CHANGE IMAGE BUTTON */}

                <label
                  className="
                    inline-flex
                    items-center
                    px-4
                    py-3
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    rounded-xl
                    cursor-pointer
                    transition
                  "
                >
                  📷 Change Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                  />
                </label>

             

                {/* STATUS */}

                {editUploading && (

                  <p
                    className="
                      mt-2
                      text-blue-400
                    "
                  >
                    Uploading image...
                  </p>

                )}

              </div>

            <textarea
              rows={5}
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400"
            />

          </div>

          <div className="flex justify-end gap-3 mt-6">

            <button
              onClick={() =>
                setEditingService(null)
              }
              className="px-5 py-3 rounded-xl border border-gray-300 text-white"
            >
              Cancel
            </button>

            <button
              onClick={saveEdit}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    )}

  </div>
);
}