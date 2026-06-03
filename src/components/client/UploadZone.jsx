"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Upload, X, FileText, Image as ImageIcon, Video, CheckCircle2, Loader2 } from "lucide-react";

export default function UploadZone({ files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const generateId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

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

    const mappedFiles = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      id: generateId(),
      progress: 0,
      status: "ready",
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...mappedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id) => {
    const fileToRemove = files.find((item) => item.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (type?.startsWith("video/")) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
        <p className="text-gray-500 text-sm mt-1">Upload inspiration images, logos, videos, PDFs, or references (Max 100MB)</p>
      </div>

      {/* Dropzone */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-10 text-center cursor-pointer ${
          isDragging ? "border-gold bg-gold/5" : "border-gray-300 bg-gray-50 hover:border-gold/50"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className={`rounded-full p-4 mb-4 ${isDragging ? "bg-gold/20" : "bg-gray-100"}`}>
            <Upload className={`h-8 w-8 ${isDragging ? "text-gold" : "text-gray-400"}`} />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Drag & Drop Files</h4>
          <p className="text-gray-500 text-sm mb-4">or click to browse</p>
          <label className="inline-flex cursor-pointer rounded-xl bg-gold px-6 py-2.5 font-semibold text-black transition-all hover:bg-gold-dark">
            Choose Files
            <input type="file" multiple hidden accept="image/*,video/*,application/pdf" onChange={(e) => handleFiles(e.target.files)} />
          </label>
          <p className="text-xs text-gray-400 mt-4">Supported: Images, Videos, PDFs (up to 100MB)</p>
        </div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {files.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <button type="button" onClick={() => removeFile(item.id)} className="absolute right-3 top-3 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-500 transition">
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Preview */}
              <div className="mb-3 overflow-hidden rounded-lg bg-gray-100">
                {item.preview ? (
                  <img src={item.preview} alt={item.name} className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <div className="rounded-xl bg-gray-200 p-4">{getFileIcon(item.type)}</div>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
                <div>
                  {item.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
                  {item.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {item.status === "ready" && <CheckCircle2 className="h-4 w-4 text-gray-300" />}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <motion.div animate={{ width: `${item.progress || 0}%` }} className="h-full rounded-full bg-gold" />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {item.status === "ready" && "Ready to upload"}
                {item.status === "uploading" && `Uploading... ${item.progress}%`}
                {item.status === "completed" && "Uploaded successfully"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}