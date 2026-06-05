"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Video, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function UploadZone({ files, setFiles, isMobile = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const validateFile = (file) => {
    const maxSize = isMobile ? 20 * 1024 * 1024 : 50 * 1024 * 1024; // 20MB on mobile, 50MB on desktop
    
    if (file.size > maxSize) {
      alert(`${file.name} exceeds ${maxSize / 1024 / 1024}MB. Please choose a smaller file.`);
      return false;
    }
    
    if (file.size === 0) {
      alert(`${file.name} appears to be empty.`);
      return false;
    }
    
    return true;
  };

  const handleFiles = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const fileArray = Array.from(selectedFiles);
    const validFiles = [];
    
    for (const file of fileArray) {
      if (validateFile(file)) {
        let processedFile = file;
        
        // Create a stable copy of the file for mobile
        if (isMobile) {
          try {
            const buffer = await file.arrayBuffer();
            processedFile = new File([buffer], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
          } catch (copyError) {
            console.warn('Could not clone file on mobile:', copyError);
          }
        }
        
        let preview = null;
        if (processedFile.type?.startsWith("image/") && processedFile.size < 2 * 1024 * 1024) {
          try {
            preview = URL.createObjectURL(processedFile);
          } catch (previewError) {
            console.warn('Could not create preview:', previewError);
          }
        }
        
        validFiles.push({
          file: processedFile,
          preview,
          id: generateId(),
          progress: 0,
          status: "ready",
          name: processedFile.name,
          size: processedFile.size,
          type: processedFile.type,
        });
      }
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
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
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
        <p className="text-gray-500 text-sm mt-1">
          {isMobile 
            ? "Tap to select images or files (Max 20MB per file)"
            : "Upload inspiration images, logos, videos, PDFs, or references (Max 50MB)"}
        </p>
      </div>

      <motion.div
        whileHover={!isMobile ? { scale: 1.01 } : {}}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-6 md:p-10 text-center cursor-pointer ${
          isDragging ? "border-gold bg-gold/5" : "border-gray-300 bg-gray-50 hover:border-gold/50"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className={`rounded-full p-3 md:p-4 mb-3 md:mb-4 ${isDragging ? "bg-gold/20" : "bg-gray-100"}`}>
            <Upload className={`h-6 w-6 md:h-8 md:w-8 ${isDragging ? "text-gold" : "text-gray-400"}`} />
          </div>
          <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
            {isMobile ? "Tap to Select Files" : "Drag & Drop Files"}
          </h4>
          <p className="text-gray-500 text-sm mb-3 md:mb-4">
            {isMobile ? "or tap to browse" : "or click to browse"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept="image/*,video/*,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="text-xs text-gray-400 mt-3 md:mt-4">
            Supported: Images, Videos, PDFs {isMobile && "(20MB max per file)"}
          </p>
          {isMobile && (
            <p className="text-xs text-gold mt-2">
              💡 Tip: Compress large images before uploading for faster uploads
            </p>
          )}
        </div>
      </motion.div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {files.map((item) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="relative rounded-xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
            >
              <button 
                type="button" 
                onClick={() => removeFile(item.id)} 
                className="absolute right-2 top-2 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-500 transition z-10"
              >
                <X className="h-3 w-3" />
              </button>

              {item.preview && (
                <div className="mb-3 overflow-hidden rounded-lg bg-gray-100 h-24 md:h-32">
                  <img src={item.preview} alt={item.name} className="h-full w-full object-cover" />
                </div>
              )}

              {!item.preview && (
                <div className="mb-3 overflow-hidden rounded-lg bg-gray-100 h-24 md:h-32 flex items-center justify-center">
                  <div className="rounded-xl bg-gray-200 p-3 md:p-4">
                    {getFileIcon(item.type)}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900 text-xs md:text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
                <div className="ml-2">
                  {item.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
                  {item.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {item.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  {item.status === "ready" && <CheckCircle2 className="h-4 w-4 text-gray-300" />}
                </div>
              </div>

              {item.status === "uploading" && (
                <>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <motion.div 
                      animate={{ width: `${item.progress || 0}%` }} 
                      className="h-full rounded-full bg-gold" 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Uploading... {item.progress || 0}%
                  </p>
                </>
              )}
              
              {item.status === "ready" && (
                <p className="text-xs text-gray-400 mt-1">Ready to upload</p>
              )}
              
              {item.status === "completed" && (
                <p className="text-xs text-green-600 mt-1">Uploaded successfully</p>
              )}
              
              {item.status === "error" && (
                <div className="mt-1">
                  <p className="text-xs text-red-500">Upload failed</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles(prev => prev.map(f => 
                        f.id === item.id ? { ...f, status: "ready", progress: 0, error: null } : f
                      ));
                    }}
                    className="text-xs text-gold mt-1 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}