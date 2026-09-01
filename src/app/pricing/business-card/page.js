"use client";

/* ==========================================
   IMPORTS
========================================== */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile } from "@/utils/uploadFile";
import { useRouter } from "next/navigation";

/* ==========================================
   ICONS
========================================== */

import {
  Sparkles,
  CheckCircle,
  CreditCard,
  Palette,
  Clock,
  Star,
  Shield,
  Truck,
  Printer,
  PenTool,
  Layers,
  MapPin,
  Phone,
  Mail,
  User,
  X,
  Send,
  Package,
  IdCard,
  Upload,
  Image as ImageIcon,
  FileText,
  Video,
  CheckCircle2,
  Loader2,
  AlertCircle,
  WifiOff,
  DollarSign,
} from "lucide-react";

/* ==========================================
   PRICING DATA - BUSINESS CARDS
========================================== */

const pricingPackages = {
  thirty: {
    icon: IdCard,
    title: "25 Cards",
    subtitle: "Starter Pack",
    description: "Perfect for networking events and small meetings.",
    basePrice: 30,
    cardCount: 25,
    options: [
      {
        name: "Custom",
        price: 30,
        features: [
          "25 Premium Cards",
          "Custom Design Included",
          "Full-Color Printing",
          "No Finish",
          "Standard Shipping",
          "1 Revisions",
        ],
      },
    ],
  },

  fifty: {
    icon: Layers,
    title: "100 Cards",
    subtitle: "Professional Pack",
    description: "Ideal for growing businesses and regular networking.",
    basePrice: 80,
    cardCount: 100,
    options: [
      {
        name: "Custom",
        price: 80,
        features: [
          "100 Premium Cards",
          "Custom Design Included",
          "Full-Color Printing",
          "No Finish",
          "Standard Shipping",
          "2 Revisions",
          "Digital Proof Before Print",
        ],
      },
    ],
  },

  hundred: {
    icon: Package,
    title: "250 Cards",
    subtitle: "Business Pack",
    description: "Great for established businesses and frequent use.",
    basePrice: 149.99,
    cardCount: 250,
    options: [
      {
        name: "Custom",
        price: 149.99,
        features: [
          "250 Premium Cards",
          "Custom Design Included",
          "Full-Color Printing",
          "Premium Cardstock",
          "Matte Finish",
          "Expedited Shipping",
          "3 Revisions",
          "Digital Proof Before Print",
          "Die-Cut Options Available",
        ],
      },
    ],
  },

  twoHundred: {
    icon: Printer,
    title: "500 Cards",
    subtitle: "Enterprise Pack",
    description: "Maximum value for large teams and bulk distribution.",
    basePrice: 249.99,
    cardCount: 500,
    options: [
      {
        name: "Custom",
        price: 249.99,
        features: [
          "500 Premium Cards",
          "Custom Design Included",
          "Full-Color Printing",
          "Premium Cardstock",
          "Matte or Gloss Finish",
          "Priority Shipping",
          "Unlimited Revisions",
          "Digital Proof Before Print",
          "Die-Cut Options Available",
          "Spot UV Coating",
          "Foil Stamping Options",
          "Rounded Corners Available",
        ],
      },
    ],
  },
};

/* ==========================================
   UPLOAD ZONE COMPONENT
========================================== */
function UploadZone({ files, setFiles, isMobile = false }) {
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
    const maxSize = isMobile ? 20 * 1024 * 1024 : 50 * 1024 * 1024;
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
        if (isMobile) {
          try {
            const buffer = await file.arrayBuffer();
            processedFile = new File([buffer], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
          } catch (copyError) {
            console.warn("Could not clone file on mobile:", copyError);
          }
        }

        let preview = null;
        if (processedFile.type?.startsWith("image/") && processedFile.size < 2 * 1024 * 1024) {
          try {
            preview = URL.createObjectURL(processedFile);
          } catch (previewError) {
            console.warn("Could not create preview:", previewError);
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
    <div className="mt-6">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Upload Your Logo (Optional)
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {isMobile
            ? "Tap to select your logo (Max 20MB)"
            : "Drag & drop your logo or brand assets (Max 50MB)"}
        </p>
      </div>

      <motion.div
        whileHover={!isMobile ? { scale: 1.01 } : {}}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-4 md:p-6 text-center cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400"
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full p-2 md:p-3 mb-2 ${
              isDragging ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <Upload
              className={`h-5 w-5 ${
                isDragging ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {isMobile ? "Tap to Upload Logo" : "Drag & Drop Your Logo"}
          </h4>
          <p className="text-xs text-gray-500">PNG, JPG, SVG, PDF</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept="image/*,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </motion.div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {files.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <button
                type="button"
                onClick={() => removeFile(item.id)}
                className="absolute right-2 top-2 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-red-100 hover:text-red-500 transition z-10"
              >
                <X className="h-3 w-3" />
              </button>

              {item.preview ? (
                <div className="mb-2 overflow-hidden rounded-lg bg-gray-100 h-20">
                  <img
                    src={item.preview}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-2 overflow-hidden rounded-lg bg-gray-100 h-20 flex items-center justify-center">
                  <div className="rounded-xl bg-gray-200 p-2">{getFileIcon(item.type)}</div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-gray-900 text-xs">{item.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
                <div className="ml-2">
                  {item.status === "uploading" && (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  )}
                  {item.status === "completed" && (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  )}
                  {item.status === "error" && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  {item.status === "ready" && (
                    <CheckCircle2 className="h-3 w-3 text-gray-300" />
                  )}
                </div>
              </div>

              {item.status === "uploading" && (
                <>
                  <div className="h-1 overflow-hidden rounded-full bg-gray-100 mt-1">
                    <motion.div
                      animate={{ width: `${item.progress || 0}%` }}
                      className="h-full rounded-full bg-blue-600"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Uploading... {item.progress || 0}%</p>
                </>
              )}

              {item.status === "ready" && (
                <p className="text-xs text-gray-400 mt-1">Ready to upload</p>
              )}

              {item.status === "completed" && (
                <p className="text-xs text-green-600 mt-1">Uploaded</p>
              )}

              {item.status === "error" && (
                <div className="mt-1">
                  <p className="text-xs text-red-500">Upload failed</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles((prev) =>
                        prev.map((f) =>
                          f.id === item.id
                            ? { ...f, status: "ready", progress: 0, error: null }
                            : f
                        )
                      );
                    }}
                    className="text-xs text-blue-600 mt-1 hover:underline"
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

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function BusinessCardPricingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedTier, setSelectedTier] = useState({});
  const [serviceCategories, setServiceCategories] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderPackage, setOrderPackage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    specialInstructions: "",
  });

  useEffect(() => {
    setMounted(true);
    loadCategories();

    const checkMobile = /iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
    setIsMobile(checkMobile);

    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const initialTiers = {};
    Object.keys(pricingPackages).forEach((key) => {
      initialTiers[key] = pricingPackages[key].options[0].name;
    });
    setSelectedTier(initialTiers);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadCategories = async () => {
    try {
      const q = query(collection(db, "serviceCategories"), where("active", "==", true));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServiceCategories(items);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const getPackagePrice = (packageKey) => {
    const pkg = pricingPackages[packageKey];
    const tier = pkg.options.find((opt) => opt.name === selectedTier[packageKey]);
    return tier?.price || pkg.options[0].price;
  };

  /* ==========================================
     OPEN ORDER MODAL
  ========================================== */
  const openOrderModal = (packageKey) => {
    setOrderPackage(packageKey);
    setShippingForm({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      specialInstructions: "",
    });
    setFiles([]);
    setFormErrors({});
    setShowOrderModal(true);
  };

  /* ==========================================
     VALIDATE SHIPPING FORM
  ========================================== */
  const validateShippingForm = () => {
    const errors = {};
    if (!shippingForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!shippingForm.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(shippingForm.email)) errors.email = "Email is invalid";
    if (!shippingForm.phone.trim()) errors.phone = "Phone is required";
    if (!shippingForm.address.trim()) errors.address = "Address is required";
    if (!shippingForm.city.trim()) errors.city = "City is required";
    if (!shippingForm.state.trim()) errors.state = "State is required";
    if (!shippingForm.zipCode.trim()) errors.zipCode = "ZIP code is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ==========================================
     UPLOAD FILES
  ========================================== */
  const uploadFilesWithMobileSupport = async (filesToUpload, requestId) => {
    const uploadedFiles = [];

    if (isMobile) {
      for (let i = 0; i < filesToUpload.length; i++) {
        const item = filesToUpload[i];
        try {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, status: "uploading", progress: 0 } : f))
          );

          let progressInterval;
          if (isMobile) {
            progressInterval = setInterval(() => {
              setFiles((prev) =>
                prev.map((f) => {
                  if (f.id === item.id && f.progress < 90) {
                    return { ...f, progress: f.progress + 10 };
                  }
                  return f;
                })
              );
            }, 300);
          }

          const result = await uploadFile({
            file: item.file,
            requestId: requestId,
            onProgress: (progress) => {
              setFiles((prev) =>
                prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
              );
            },
          });

          if (progressInterval) clearInterval(progressInterval);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, progress: 100, status: "completed" } : f
            )
          );

          uploadedFiles.push(result);
        } catch (fileError) {
          console.error(`Error uploading file ${item.name}:`, fileError);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: "error", error: fileError.message } : f
            )
          );
        }
      }
    } else {
      uploadedFiles.push(
        ...(await Promise.all(
          filesToUpload.map(async (item) => {
            setFiles((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
            );

            const result = await uploadFile({
              file: item.file,
              requestId: requestId,
              onProgress: (progress) => {
                setFiles((prev) =>
                  prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
                );
              },
            });

            setFiles((prev) =>
              prev.map((f) =>
                f.id === item.id ? { ...f, progress: 100, status: "completed" } : f
              )
            );

            return result;
          })
        ))
      );
    }

    return uploadedFiles;
  };

  /* ==========================================
     SUBMIT ORDER DIRECTLY
  ========================================== */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!onlineStatus) {
      alert("You appear to be offline. Please check your internet connection and try again.");
      return;
    }

    if (!validateShippingForm()) return;

    try {
      setLoading(true);

      const pkg = pricingPackages[orderPackage];
      const tierName = selectedTier[orderPackage];
      const tier = pkg.options.find((opt) => opt.name === tierName);
      const price = tier?.price || pkg.options[0].price;

      const generatedRequestId = `BC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      // Upload files
      let uploadedFiles = [];
      if (files.length > 0) {
        const validFiles = files.filter((f) => f.file && f.file.size > 0);
        if (validFiles.length > 0) {
          uploadedFiles = await uploadFilesWithMobileSupport(validFiles, generatedRequestId);
        }
      }

      // Build order data
      const orderData = {
        requestId: generatedRequestId,
        customerName: shippingForm.fullName,
        email: shippingForm.email,
        phone: shippingForm.phone,
        serviceType: "Custom Business Cards",
        category: "Custom Business Cards",
        status: "pending",
        source: "pricing",
        requestType: "order",

        // Package details
        packageDetails: {
          title: pkg.title,
          subtitle: pkg.subtitle,
          tier: tierName,
          cardCount: pkg.cardCount,
          price: price,
          features: tier.features,
        },

        // Shipping details
        shipping: {
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.zipCode,
          country: shippingForm.country,
          specialInstructions: shippingForm.specialInstructions,
        },

        // Uploads
        uploads: uploadedFiles,

        // Full description
        description: `ORDER: ${pkg.title} - ${tierName}\nCard Count: ${pkg.cardCount}\nPrice: $${price}\n\nSHIPPING TO:\n${shippingForm.fullName}\n${shippingForm.address}\n${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}\n${shippingForm.country}\n\nSpecial Instructions: ${shippingForm.specialInstructions || "None"}`,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deviceInfo: {
          isMobile: isMobile,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      await addDoc(collection(db, "serviceRequests"), orderData);

      setRequestId(generatedRequestId);
      setSuccess(true);
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = () => {
    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#home");
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Background Effects */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200/15 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/3 blur-[100px]" />

      {/* Offline Warning */}
      {!onlineStatus && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">You are offline. Please check your internet connection.</span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 backdrop-blur-sm mb-6">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Custom Business Card Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Premium{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Business Cards
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Custom-designed, professionally printed business cards delivered to your door.
            All packages include custom design, premium printing, and shipping.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(pricingPackages).map((key) => {
            const pkg = pricingPackages[key];
            const Icon = pkg.icon;
            const currentPrice = getPackagePrice(key);

            return (
              <motion.div
                key={key}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -8 }}
                className="relative rounded-3xl bg-white/95 backdrop-blur-sm border border-gray-200 p-6 shadow-xl transition-all hover:shadow-2xl"
              >
                {key === "fifty" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                {key === "twoHundred" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{pkg.title}</h2>
                    <p className="text-xs text-gray-500">{pkg.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
                  <span className="text-gray-500 text-sm"> one-time</span>
                </div>

                <div className="mb-4">
                  <select
                    value={selectedTier[key]}
                    onChange={(e) =>
                      setSelectedTier((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {pkg.options.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name} (${opt.price})
                      </option>
                    ))}
                  </select>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.options
                    .find((opt) => opt.name === selectedTier[key])
                    ?.features.slice(0, 5)
                    .map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  {pkg.options.find((opt) => opt.name === selectedTier[key])?.features.length >
                    5 && (
                    <li className="text-xs text-blue-600 pl-6 cursor-pointer hover:underline">
                      + more features
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => openOrderModal(key)}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 font-semibold transition-all hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                >
                  Get Started →
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-200 p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What's Included in Every Package
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <PenTool className="w-6 h-6" />, title: "Custom Design", desc: "Professional layout tailored to your brand" },
              { icon: <Printer className="w-6 h-6" />, title: "Premium Printing", desc: "High-quality full-color printing" },
              { icon: <Truck className="w-6 h-6" />, title: "Free Shipping", desc: "Delivered right to your doorstep" },
              { icon: <Shield className="w-6 h-6" />, title: "Satisfaction Guaranteed", desc: "Unlimited revisions until you're happy" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="rounded-xl bg-blue-50 p-3 inline-flex mb-3 text-blue-600">{item.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span>Unlimited Revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Quick Turnaround</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Need a custom bulk order?{" "}
            <button onClick={handleBookConsultation} className="text-blue-600 hover:underline font-medium">
              Contact us for a tailored quote
            </button>
          </p>
        </motion.div>
      </div>

      {/* ==========================================
          SUCCESS MODAL
      ========================================== */}
      <AnimatePresence>
        {success && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl text-center">
                <div className="rounded-full bg-green-100 p-4 inline-flex mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Order Placed Successfully!
                </h2>

                <p className="text-gray-600 mb-6">
                  Thank you for your order. We'll start working on your business cards right away and
                  send you a design proof within 24-48 hours.
                </p>

                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Order Reference ID
                  </p>
                  <p className="text-xl font-mono font-semibold text-gray-900">{requestId}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Please save this ID for future reference
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setShowOrderModal(false);
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Place Another Order
                  </button>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          ORDER MODAL WITH SHIPPING + UPLOAD
      ========================================== */}
      <AnimatePresence>
        {showOrderModal && orderPackage && !success && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed inset-0 z-40 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Complete Your Order</h3>
                    <p className="text-sm text-gray-500">
                      {pricingPackages[orderPackage].title} - {selectedTier[orderPackage]}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl bg-blue-50 p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Package:</span>
                    <span className="font-semibold text-gray-900">
                      {pricingPackages[orderPackage].title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Cards:</span>
                    <span className="font-semibold text-gray-900">
                      {pricingPackages[orderPackage].cardCount} cards
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                    <span className="text-sm font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${getPackagePrice(orderPackage)}
                    </span>
                  </div>
                </div>

                {/* Shipping Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Shipping Address
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingForm.fullName}
                      onChange={(e) => {
                        setShippingForm({ ...shippingForm, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
                      }}
                      placeholder="John Doe"
                      className={`w-full rounded-xl border ${
                        formErrors.fullName ? "border-red-400" : "border-gray-200"
                      } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => {
                          setShippingForm({ ...shippingForm, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                        }}
                        placeholder="john@email.com"
                        className={`w-full rounded-xl border ${
                          formErrors.email ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => {
                          setShippingForm({ ...shippingForm, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                        }}
                        placeholder="(555) 123-4567"
                        className={`w-full rounded-xl border ${
                          formErrors.phone ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => {
                        setShippingForm({ ...shippingForm, address: e.target.value });
                        if (formErrors.address) setFormErrors({ ...formErrors, address: "" });
                      }}
                      placeholder="123 Main St, Apt 4B"
                      className={`w-full rounded-xl border ${
                        formErrors.address ? "border-red-400" : "border-gray-200"
                      } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={shippingForm.city}
                        onChange={(e) => {
                          setShippingForm({ ...shippingForm, city: e.target.value });
                          if (formErrors.city) setFormErrors({ ...formErrors, city: "" });
                        }}
                        placeholder="City"
                        className={`w-full rounded-xl border ${
                          formErrors.city ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={shippingForm.state}
                        onChange={(e) => {
                          setShippingForm({ ...shippingForm, state: e.target.value });
                          if (formErrors.state) setFormErrors({ ...formErrors, state: "" });
                        }}
                        placeholder="State"
                        className={`w-full rounded-xl border ${
                          formErrors.state ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">ZIP *</label>
                      <input
                        type="text"
                        value={shippingForm.zipCode}
                        onChange={(e) => {
                          setShippingForm({ ...shippingForm, zipCode: e.target.value });
                          if (formErrors.zipCode) setFormErrors({ ...formErrors, zipCode: "" });
                        }}
                        placeholder="12345"
                        className={`w-full rounded-xl border ${
                          formErrors.zipCode ? "border-red-400" : "border-gray-200"
                        } px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none`}
                      />
                      {formErrors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={shippingForm.country}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, country: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Special Instructions (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={shippingForm.specialInstructions}
                      onChange={(e) =>
                        setShippingForm({
                          ...shippingForm,
                          specialInstructions: e.target.value,
                        })
                      }
                      placeholder="Any special delivery instructions or design notes..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Logo Upload */}
                  <UploadZone files={files} setFiles={setFiles} isMobile={isMobile} />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 font-semibold transition-all hover:from-blue-700 hover:to-indigo-700 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Place Order - ${getPackagePrice(orderPackage)}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}