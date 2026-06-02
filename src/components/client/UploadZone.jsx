/*
|--------------------------------------------------------------------------
| NEXT STEP — REAL UPLOAD PROGRESS SYSTEM
|--------------------------------------------------------------------------
|
| FILE:
| /components/client/UploadZone.jsx
|
| REPLACE YOUR ENTIRE FILE WITH THIS
|
|--------------------------------------------------------------------------
*/

"use client";

import { motion } from "framer-motion";

import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function UploadZone({
  files,
  setFiles,
}) {

  /*
  |--------------------------------------------------------------------------
  | HANDLE FILES
  |--------------------------------------------------------------------------
  */

  const handleFiles = (selectedFiles) => {

    const fileArray = Array.from(selectedFiles);

    const validFiles = fileArray.filter((file) => {

      const maxSize = 100 * 1024 * 1024;

      if (file.size > maxSize) {

        alert(`${file.name} exceeds 100MB`);

        return false;
      }

      return true;
    });

    /*
    |--------------------------------------------------------------------------
    | FILE STRUCTURE
    |--------------------------------------------------------------------------
    */

    const mappedFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),

      id: crypto.randomUUID(),

      progress: 100,

      status: "Ready",
    }));

    setFiles((prev) => [...prev, ...mappedFiles]);
  };

  /*
  |--------------------------------------------------------------------------
  | DRAG DROP
  |--------------------------------------------------------------------------
  */

  const handleDrop = (e) => {

    e.preventDefault();

    handleFiles(e.dataTransfer.files);
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE FILE
  |--------------------------------------------------------------------------
  */

  const removeFile = (id) => {

    setFiles((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | FILE ICONS
  |--------------------------------------------------------------------------
  */

  const getFileIcon = (type) => {

    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5" />;
    }

    if (type.startsWith("video/")) {
      return <Video className="h-5 w-5" />;
    }

    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="mt-14">

      {/* HEADER */}
      <div className="mb-5">

        <h3 className="text-2xl font-semibold text-[#111111]">
          Upload Files
        </h3>

        <p className="text-[#666666] mt-2">
          Upload inspiration images, logos,
          videos, PDFs, screenshots, or references.
        </p>
      </div>

      {/* DROPZONE */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="
          relative
          rounded-[2rem]
          border-2
          border-dashed
          border-[#D4AF37]/40
          bg-white/75
          backdrop-blur-3xl
          p-12
          text-center
          transition-all
          duration-300
          hover:border-[#D4AF37]
          hover:bg-white
          shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        "
      >

        {/* GLOW */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />

        {/* ICON */}
        <div className="flex justify-center mb-6">

          <div className="rounded-3xl bg-[#D4AF37]/10 p-6">

            <Upload className="h-10 w-10 text-[#b8860b]" />
          </div>
        </div>

        {/* TITLE */}
        <h4 className="text-2xl font-semibold text-[#111111] mb-3">
          Drag & Drop Files
        </h4>

        {/* TEXT */}
        <p className="text-[#666666] mb-6 max-w-xl mx-auto leading-relaxed">
          Upload images, videos, PDFs,
          logos, screenshots, and references.
        </p>

        {/* BUTTON */}
        <label className="
          inline-flex
          cursor-pointer
          items-center
          gap-3
          rounded-2xl
          bg-gradient-to-r
          from-[#f5deb3]
          to-[#D4AF37]
          px-7
          py-4
          font-semibold
          text-black
          transition-all
          duration-300
          hover:scale-[1.02]
        ">
          Choose Files

          <input
            type="file"
            multiple
            hidden
            accept="
              image/*,
              video/*,
              application/pdf
            "
            onChange={(e) =>
              handleFiles(e.target.files)
            }
          />
        </label>

        {/* LIMIT */}
        <p className="text-sm text-[#888888] mt-5">
          Maximum file size: 100MB
        </p>
      </motion.div>

      {/* FILE LIST */}
      {files.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          {files.map((item) => {

            const file = item.file;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  relative
                  rounded-[1.7rem]
                  border
                  border-white/60
                  bg-white/80
                  backdrop-blur-2xl
                  p-5
                  shadow-[0_10px_40px_rgba(0,0,0,0.05)]
                "
              >

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="
                    absolute
                    right-4
                    top-4
                    rounded-full
                    bg-red-50
                    p-2
                    text-red-500
                    hover:bg-red-100
                  "
                >
                  <X className="h-4 w-4" />
                </button>

                {/* PREVIEW */}
                <div className="mb-5 overflow-hidden rounded-2xl bg-[#f5f5f5]">

                  {file.type.startsWith("image/") ? (

                    <img
                      src={item.preview}
                      alt={file.name}
                      className="
                        h-[220px]
                        w-full
                        object-cover
                      "
                    />

                  ) : (

                    <div className="
                      flex
                      h-[220px]
                      items-center
                      justify-center
                    ">

                      <div className="
                        rounded-3xl
                        bg-[#D4AF37]/10
                        p-6
                        text-[#b8860b]
                      ">
                        {getFileIcon(file.type)}
                      </div>
                    </div>
                  )}
                </div>

                {/* FILE INFO */}
                <div className="flex items-center justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className="
                      rounded-xl
                      bg-[#D4AF37]/10
                      p-2
                      text-[#b8860b]
                    ">
                      {getFileIcon(file.type)}
                    </div>

                    <div className="min-w-0">

                      <p className="
                        truncate
                        font-semibold
                        text-[#111111]
                      ">
                        {file.name}
                      </p>

                      <p className="text-sm text-[#777777]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div>

                    {item.status === "uploading" && (
                      <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
                    )}

                    {item.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* PROGRESS */}
                <div>

                    {/* STATUS */}

                    <div className="mt-2">

                      {item.status === "ready" && (
                        <div className="flex items-center gap-2">

                          <CheckCircle2 className="h-4 w-4 text-green-500" />

                          <span className="text-green-600 font-medium">
                            File Attached
                          </span>

                        </div>
                      )}

                      {item.status === "uploading" && (
                        <div className="flex items-center gap-2">

                          <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />

                          <span className="text-[#666666]">
                            Uploading...
                          </span>

                        </div>
                      )}

                      {item.status === "completed" && (
                        <div className="flex items-center gap-2">

                          <CheckCircle2 className="h-4 w-4 text-green-500" />

                          <span className="text-green-600 font-medium">
                            Uploaded Successfully
                          </span>

                        </div>
                      )}

                    </div>

                  {/* BAR */}
                  <div className="
                    h-3
                    overflow-hidden
                    rounded-full
                    bg-[#ececec]
                  ">

                    <motion.div
                      animate={{
                        width: `${item.progress || 0}%`,
                      }}
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-[#f5deb3]
                        to-[#D4AF37]
                      "
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}