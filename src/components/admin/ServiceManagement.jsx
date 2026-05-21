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

  /* ================================
     UI
  ================================ */

return (
  <div className="min-h-screen bg-black p-6">

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
            <option value="Cleaning">Cleaning</option>
            <option value="Transportation">Transportation</option>
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

        {/* IMAGE */}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Image URL
          </label>

          <input
            type="text"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            placeholder="https://example.com/image.jpg"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
          />
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

      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

        <div className="bg-zinc-900 rounded-2xl border border-zinc-700">

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

            <input
              type="text"
              value={editImage}
              onChange={(e) =>
                setEditImage(e.target.value)
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white placeholder:text-zinc-400"
            />

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