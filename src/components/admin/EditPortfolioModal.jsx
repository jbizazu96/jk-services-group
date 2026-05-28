
"use client";

/* =========================================================
   EDIT PORTFOLIO MODAL
========================================================= */

import {
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  X,
  Save,
  Trash2,
  Upload,
  Loader2,
  ImageIcon,
  Video,
  Plus,
} from "lucide-react";

import {
  db,
  storage,
} from "@/lib/firebase";

import { toast } from "sonner";

/* =========================================================
   COMPONENT
========================================================= */

export default function EditPortfolioModal({

  open,
  onClose,
  item,
  portfolioCategories,
  onUpdated,

}) {

  /* =====================================================
     STATES
  ===================================================== */

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [selectedFiles,
        setSelectedFiles] =
    useState([]);

  const [formData, setFormData] =
    useState({

      title:
        item?.title || "",

      description:
        item?.description || "",

      categoryId:
        item?.categoryId || "",

      categoryName:
        item?.categoryName || "",

      featured:
        item?.featured || false,

      active:
        item?.active ?? true,
    });

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (
    field,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =====================================================
     FILE SELECT
  ===================================================== */

  const handleFileSelect =
    (e) => {

      const files =
        Array.from(
          e.target.files
        );

      setSelectedFiles(files);
    };

  /* =====================================================
     SAVE PROJECT
  ===================================================== */

  const saveProject =
    async () => {

      try {

        setSaving(true);

        await updateDoc(
          doc(
            db,
            "portfolioItems",
            item.id
          ),
          {

            title:
              formData.title,

            description:
              formData.description,

            categoryId:
              formData.categoryId,

            categoryName:
              formData.categoryName,

            featured:
              formData.featured,

            active:
              formData.active,

            updatedAt:
              Timestamp.now(),
          }
        );

        /* =========================================
           UPLOAD NEW FILES
        ========================================= */

        if (
          selectedFiles.length > 0
        ) {

          setUploading(true);

          for (
            let index = 0;
            index <
            selectedFiles.length;
            index++
          ) {

            const file =
              selectedFiles[index];

            const storageRef =
              ref(
                storage,
                `portfolio/${item.id}/${Date.now()}-${file.name}`
              );

            await uploadBytes(
              storageRef,
              file
            );

            const downloadURL =
              await getDownloadURL(
                storageRef
              );

            const mediaType =
              file.type.startsWith(
                "video"
              )
                ? "video"
                : "image";

            await addDoc(
              collection(
                db,
                "portfolioMedia"
              ),
              {

                portfolioItemId:
                  item.id,

                type:
                  mediaType,

                url:
                  downloadURL,

                createdAt:
                  Timestamp.now(),
              }
            );
          }
        }

        toast.success(
          "Portfolio updated successfully"
        );

        onUpdated();

        onClose();

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to update project"
        );

      } finally {

        setSaving(false);

        setUploading(false);
      }
    };

  /* =====================================================
     REMOVE MEDIA
  ===================================================== */

  const removeMedia =
    async (media) => {

      const confirmDelete =
        confirm(
          "Delete this media?"
        );

      if (!confirmDelete)
        return;

      try {

        /* =====================================
           DELETE STORAGE FILE
        ===================================== */

        if (
          media.url &&
          media.type !== "youtube"
        ) {

          const mediaRef =
            ref(
              storage,
              media.url
            );

          await deleteObject(
            mediaRef
          );
        }

        /* =====================================
           DELETE FIRESTORE DOC
        ===================================== */

        await deleteDoc(
          doc(
            db,
            "portfolioMedia",
            media.id
          )
        );

        toast.success(
          "Media removed"
        );

        onUpdated();

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to remove media"
        );
      }
    };

  /* =====================================================
     RETURN
  ===================================================== */

  if (!open) return null;

  return createPortal(

    <AnimatePresence>

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

        className="
          fixed
          inset-0
          z-[999999]
          overflow-y-auto
          bg-black/80
          backdrop-blur-md
          p-4
          md:p-8
        "
      >

        {/* GLOWS */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

        </div>

        {/* CENTER */}

        <div
          className="
            relative
            z-10
            min-h-screen
            flex
            items-center
            justify-center
          "
        >

          {/* MODAL */}

          <motion.div

            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}

            className="
              relative
              w-full
              max-w-7xl
              text-white
              overflow-hidden
              rounded-[32px]
              border
              border-white/10
              bg-[#111827] text-white
              shadow-[0_40px_120px_rgba(0,0,0,0.7)]
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                px-6
                py-5
                md:px-10
              "
            >

              <div>

                <h2
                  className="
                    text-3xl text-white
                    md:text-5xl
                    font-black
                  "
                >

                  Edit Portfolio

                </h2>

                <p
                  className="
                    mt-2
                    text-zinc-200
                  "
                >

                  Update project information
                  and media gallery

                </p>

              </div>

              {/* CLOSE */}

              <button
                onClick={onClose}
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.06]
                "
              >

                <X />

              </button>

            </div>

            {/* CONTENT */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-10
                p-6
                md:p-10
              "
            >

              {/* LEFT */}

              <div>

                <div className="space-y-5">

                  <InputField
                    label="Project Title"
                    value={
                      formData.title
                    }
                    onChange={(e) =>
                      handleChange(
                        "title",
                        e.target.value
                      )
                    }
                  />

                  {/* CATEGORY */}

                  <div>

                    <label className="mb-2 block text-sm text-zinc-200">

                      Category

                    </label>

                    <select
                      value={
                        formData.categoryId
                      }
                      onChange={(e) => {

                        const selected =
                          portfolioCategories.find(
                            (cat) =>
                              cat.id ===
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
                      className="
                        w-full
                        rounded-2xl
                        text-white
                        border
                        border-white/10
                        bg-white/[0.06]
                        px-4
                        py-4
                        outline-none
                        text-white placeholder:text-zinc-500
                      "
                    >

                      <option value="">
                        Select Category
                      </option>

                      {portfolioCategories.map(
                        (cat) => (

                          <option
                            key={cat.id}
                            value={cat.id}
                          >

                            {cat.name}

                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-2 block text-sm text-zinc-200">

                      Description

                    </label>

                    <textarea
                      rows={7}
                      value={
                        formData.description
                      }
                      onChange={(e) =>
                        handleChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.06]
                        px-4
                        py-4
                        outline-none
                        text-white placeholder:text-zinc-500
                        resize-none
                      "
                    />

                  </div>

                  {/* FEATURED */}

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">

                    <div>

                      <p className="font-medium">

                        Featured Project

                      </p>

                      <p className="text-sm text-zinc-500">

                        Show on homepage

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

                  {/* UPLOAD */}

                  <div>

                    <label className="mb-3 block text-sm text-zinc-200">

                      Add More Media

                    </label>

                    <label
                      className="
                        flex
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        gap-4
                        rounded-3xl
                        border
                        border-dashed
                        border-white/10
                        bg-white/[0.06]
                        p-8
                      "
                    >

                      <Upload size={30} />

                      <div className="text-center">

                        <p className="font-medium">

                          Upload More Files

                        </p>

                        <p className="mt-1 text-sm text-zinc-500">

                          Images & videos

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

                  </div>

                  {/* SAVE */}

                  <button
                    onClick={
                      saveProject
                    }
                    disabled={
                      saving ||
                      uploading
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-blue-600
                      px-5
                      py-4
                      font-semibold
                      transition
                      hover:bg-blue-500
                    "
                  >

                    {saving ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}

                    Save Changes

                  </button>

                </div>

              </div>

              {/* RIGHT */}

              <div>

                <h3
                  className="
                    mb-6
                    text-3xl text-white
                    font-black
                  "
                >

                  Existing Media

                </h3>

                <div className="space-y-6">

                  {item.media?.map(
                    (
                      media,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                          overflow-hidden
                          rounded-3xl
                          border
                          border-white/10
                          bg-white/[0.06]
                        "
                      >

                        {/* IMAGE */}

                        {media.type ===
                        "video" ? (

                          <video
                            controls
                            className="
                              h-[320px]
                              w-full
                              object-cover
                            "
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
                            className="
                              h-[320px]
                              w-full
                              object-cover
                            "
                          />

                        )}

                        {/* FOOTER */}

                        <div className="flex items-center justify-between p-5">

                          <div className="flex items-center gap-3">

                            {media.type ===
                            "video" ? (

                              <Video
                                className="text-purple-400"
                              />

                            ) : (

                              <ImageIcon
                                className="text-blue-400"
                              />

                            )}

                            <p className="text-zinc-200">

                              {media.type}

                            </p>

                          </div>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              removeMedia(
                                media
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-red-600
                              px-4
                              py-3
                              transition
                              hover:bg-red-500
                            "
                          >

                            <Trash2
                              size={16}
                            />

                            Remove

                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </motion.div>

    </AnimatePresence>,

    document.body
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm text-zinc-200">

        {label}

      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/[0.06]
          px-4
          py-4
          outline-none
          text-white placeholder:text-zinc-500
        "
      />

    </div>
  );
}

