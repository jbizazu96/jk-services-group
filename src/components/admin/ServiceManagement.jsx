"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function ServiceManagement() {

  const [services, setServices] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Events");
  const [minPrice, setMinPrice] =  useState("");
  const [maxPrice, setMaxPrice] =  useState("");
  const [description, setDescription] = useState("");

  const [featured, setFeatured] = useState(false);

  const loadServices = async () => {

    const snapshot = await getDocs(
      collection(db, "services")
    );

    setServices(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );
  };

  useEffect(() => {
    loadServices();
  }, []);

  const addService = async () => {

    if (!name) return;

    await addDoc(
      collection(db, "services"),
      {
        name,
        category,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        description,
        active: true,
        featured,
        createdAt: new Date(),
      }
    );

    setName("");
    setMinPrice("");
    setMaxPrice("");
    setDescription("");
    setFeatured(false);

    loadServices();
  };

  const deleteService = async (id) => {

    if (!confirm("Delete service?"))
      return;

    await deleteDoc(
      doc(db, "services", id)
    );

    loadServices();
  };

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

    loadServices();
  };

  const toggleFeatured = async (
    id,
    current
  ) => {

    await updateDoc(
      doc(db, "services", id),
      {
        featured: !current,
      }
    );

    loadServices();
  };

  return (
    <div>

      <h2 className="text-4xl font-black mb-8">
        Service Management
      </h2>

      {/* ADD SERVICE */}

      <div className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-6
        mb-10
      ">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Service Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="bg-black/30 p-4 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="bg-black/30 p-4 rounded-xl"
          >
            <option>Events</option>
            <option>IT</option>
            <option>Media</option>
            <option>Entertainment</option>
          </select>

          <div className="grid grid-cols-2 gap-4">

        <input
            placeholder="Minimum Price"
            value={minPrice}
            onChange={(e) =>
            setMinPrice(e.target.value)
            }
            className="
            bg-black/30
            p-4
            rounded-xl
            "
        />

        <input
            placeholder="Maximum Price"
            value={maxPrice}
            onChange={(e) =>
            setMaxPrice(e.target.value)
            }
            className="
            bg-black/30
            p-4
            rounded-xl
            "
        />

        </div>

        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="
            bg-black/30
            p-4
            rounded-xl
            w-full
            mt-4
          "
        />

        <label className="
          flex
          items-center
          gap-3
          mt-4
        ">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(
                e.target.checked
              )
            }
          />
          Featured Service
        </label>

        <button
          onClick={addService}
          className="
            mt-6
            bg-yellow-500
            text-black
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >
          Add Service
        </button>

      </div>

      {/* SERVICES */}

      <div className="
        grid
        lg:grid-cols-2
        gap-6
      ">

        {services.map((service) => (

          <div
            key={service.id}
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-6
            "
          >

            <h3 className="text-2xl font-bold">
              {service.name}
            </h3>

            <p className="text-yellow-400 mt-2">
              {service.category}
            </p>

            <p className="text-3xl font-black mt-2">

            ${service.minPrice}

            {" - "}

            ${service.maxPrice}

            </p>

            <p className="text-gray-400 mt-4">
              {service.description}
            </p>

            <div className="
              flex
              gap-3
              mt-6
              flex-wrap
            ">

              <button
                onClick={() =>
                  toggleActive(
                    service.id,
                    service.active
                  )
                }
                className="
                  bg-blue-500
                  px-4
                  py-2
                  rounded-xl
                "
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
                className="
                  bg-yellow-500
                  text-black
                  px-4
                  py-2
                  rounded-xl
                "
              >
                {service.featured
                  ? "Featured"
                  : "Make Featured"}
              </button>

              <button
                onClick={() =>
                  deleteService(
                    service.id
                  )
                }
                className="
                  bg-red-500
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}