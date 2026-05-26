"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
} from "react";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db }
from "@/lib/firebase";

/* ==========================================
   FIREBASE STORAGE
========================================== */

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage }
from "@/lib/firebase";

export default function
PortfolioItemsManagement() {

            /* ==========================================
            PORTFOLIO ITEMS
            ========================================== */

            const [
            portfolioItems,
            setPortfolioItems,
            ] = useState([]);

            /* ==========================================
            PORTFOLIO CATEGORIES
            ========================================== */

            const [
            portfolioCategories,
            setPortfolioCategories,
            ] = useState([]);

            /* ==========================================
            ADD ITEM FORM
            ========================================== */

            const [title, setTitle] =
            useState("");

            const [category, setCategory] =
            useState("");

            const [description,
                setDescription] =
            useState("");

            const [mediaType,
                setMediaType] =
            useState("photo");

            const [mediaUrl,
                setMediaUrl] =
            useState("");

            const [featured,
                setFeatured] =
            useState(false);

            const [active,
                setActive] =
            useState(true);

            /* ==========================================
            IMAGE PREVIEW
            ========================================== */

            const [mediaPreview,
                setMediaPreview] =
            useState("");

            const [uploading,
                setUploading] =
            useState(false);

            /* ==========================================
            LOAD PORTFOLIO CATEGORIES
            ========================================== */

            const loadPortfolioCategories =
            async () => {

                const snapshot =
                await getDocs(
                    collection(
                    db,
                    "portfolioCategories"
                    )
                );

                const items =
                snapshot.docs.map(
                    (doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    })
                );

                setPortfolioCategories(
                items
                );
            };

            /* ==========================================
            LOAD PORTFOLIO ITEMS
            ========================================== */

            const loadPortfolioItems =
            async () => {

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

                setPortfolioItems(
                items
                );
            };

                /* ==========================================
                INITIAL PAGE LOAD
                ========================================== */

                useEffect(() => {

                loadPortfolioCategories();

                loadPortfolioItems();

                }, []);

            /* ==========================================
                UPLOAD MEDIA
                ========================================== */

                const handleMediaUpload =
                async (e) => {

                    const file =
                    e.target.files[0];

                    if (!file) return;

                    try {

                    setUploading(true);

                    const mediaRef =
                        ref(
                        storage,
                        `portfolioItems/${Date.now()}-${file.name}`
                        );

                    await uploadBytes(
                        mediaRef,
                        file
                    );

                    const downloadURL =
                        await getDownloadURL(
                        mediaRef
                        );

                    setMediaUrl(
                        downloadURL
                    );

                    setMediaPreview(
                        downloadURL
                    );

                    } catch (error) {

                    console.error(error);

                    alert(
                        "Upload failed"
                    );

                    } finally {

                    setUploading(false);

                    }

                };

                /* ==========================================
                ADD PORTFOLIO ITEM
                ========================================== */

                const addPortfolioItem =
                async () => {

                    if (!title) return;

                    await addDoc(
                    collection(
                        db,
                        "portfolioItems"
                    ),
                    {
                        title,

                        category,

                        description,

                        mediaType,

                        mediaUrl,

                        featured,

                        active,

                        createdAt:
                        new Date(),
                    }
                    );

                    setTitle("");
                    setCategory("");
                    setDescription("");
                    setMediaType("photo");
                    setMediaUrl("");
                    setMediaPreview("");
                    setFeatured(false);

                    loadPortfolioItems();
                };

                /* ==========================================
                DELETE PORTFOLIO ITEM
                ========================================== */

                const deletePortfolioItem =
                async (id) => {

                    if (
                    !confirm(
                        "Delete portfolio item?"
                    )
                    ) return;

                    await deleteDoc(
                    doc(
                        db,
                        "portfolioItems",
                        id
                    )
                    );

                    loadPortfolioItems();

                };

  return (

  <div>

    {/* ==========================================
        ADD PORTFOLIO ITEM
    ========================================== */}

    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-6
        mb-10
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-white
          mb-6
        "
      >
        Add Portfolio Item
      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          gap-5
        "
      >

        {/* ==========================================
            TITLE
        ========================================== */}

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Project Title"
          className="
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            p-3
            text-white
          "
        />

        {/* ==========================================
            CATEGORY
        ========================================== */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            p-3
            text-white
          "
        >

          <option value="">
            Select Category
          </option>

          {portfolioCategories.map(
            (item) => (

              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>

            )
          )}

        </select>

        {/* ==========================================
            MEDIA TYPE
        ========================================== */}

        <select
          value={mediaType}
          onChange={(e) =>
            setMediaType(
              e.target.value
            )
          }
          className="
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            p-3
            text-white
          "
        >

          <option value="photo">
            Photo
          </option>

          <option value="video">
            Video
          </option>

        </select>

        {/* ==========================================
            DESCRIPTION
        ========================================== */}

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          rows={4}
          className="
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            p-3
            text-white
          "
        />

        {/* ==========================================
            MEDIA UPLOAD
        ========================================== */}

        <div className="md:col-span-2">

          <label
            className="
              block
              text-sm
              text-gray-400
              mb-2
            "
          >
            Upload Media
          </label>

          <input
            type="file"
            accept={
              mediaType === "photo"
                ? "image/*"
                : "video/*"
            }
            onChange={
              handleMediaUpload
            }
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

        </div>

        {/* ==========================================
            MEDIA PREVIEW
        ========================================== */}

        {mediaPreview && (

          <div className="md:col-span-2">

            {mediaType ===
            "photo" ? (

              <img
                src={mediaPreview}
                alt="Preview"
                className="
                  w-full
                  max-h
                  object-contain
                  rounded-xl
                "
              />

            ) : (

             <video
                controls
                className="
                    max-h-[400px]
                    w-auto
                    max-w-full
                    rounded-xl
                "
                >
                <source
                  src={mediaPreview}
                />
              </video>

            )}

          </div>

        )}

        {/* ==========================================
            FEATURED ITEM
        ========================================== */}

        <div className="md:col-span-2">

          <label
            className="
              flex
              items-center
              gap-3
              text-white
            "
          >

            <input
              type="checkbox"
              checked={featured}
              onChange={() =>
                setFeatured(
                  !featured
                )
              }
            />

            Featured Item

          </label>

        </div>

        {/* ==========================================
            ADD BUTTON
        ========================================== */}

        <div className="md:col-span-2">

          <button
            onClick={
              addPortfolioItem
            }
            className="
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-bold
              px-6
              py-3
              rounded-xl
              transition
            "
          >
            Add Portfolio Item
          </button>

        </div>

      </div>

    </div>
{/* ==========================================
    PORTFOLIO ITEMS LIST
========================================== */}

<div
  className="
    flex flex-wrap gap-5
  "
>

  {portfolioItems.map(
    (item) => (

      <div
        key={item.id}
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          overflow-hidden
        "
      >

        {/* ==========================================
            MEDIA
        ========================================== */}

        <div
          className="
            bg-black
            flex
            justify-center
            items-center
            p-4
          "
        >

          {item.mediaType ===
          "photo" ? (

            <img
              src={item.mediaUrl}
              alt={item.title}
              className="
                max-h-[400px]
                w-auto
                object-contain
                rounded-xl
              "
            />

          ) : (

            <video
              controls
              className="
               max-h-[400px]
                max-w-full
                w-full
                rounded-xl
              "
            >
              <source
                src={item.mediaUrl}
              />
            </video>

          )}

        </div>

                {/* ==========================================
                    DETAILS
                ========================================== */}

                <div className="p-5">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="
                    flex
                    justify-between
                    items-start
                    gap-4
                ">

                    <div>

                    <h3
                        className="
                        text-xl
                        font-bold
                        text-white
                        "
                    >
                        {item.title}
                    </h3>

                    <p
                        className="
                        text-yellow-400
                        text-sm
                        mt-1
                        "
                    >
                        {item.category}
                    </p>

                    </div>

                {/* ==========================================
                    DELETE BUTTON
                ========================================== */}

                <button
                onClick={() =>
                    deletePortfolioItem(
                    item.id
                    )
                }
                className="
                    bg-red-500
                    hover:bg-red-600
                    px-3
                    py-2
                    rounded-xl
                    font-bold
                    text-white
                    transition
                    shrink-0
                "
                >
                Delete
                </button>

            </div>

            {/* ==========================================
                DESCRIPTION
            ========================================== */}

            <p
                className="
                text-gray-400
                text-sm
                mt-4
                "
            >
                {item.description}
            </p>

            </div>

      </div>

    )
  )}

</div>

  </div> 

);

}