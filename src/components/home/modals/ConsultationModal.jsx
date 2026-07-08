"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PopupButton } from "react-calendly";
import { useEffect, useRef, useState, useCallback } from "react";

const CONSULTATION_OPTIONS = [
  {
    duration: "15 Minutes",
    price: "Free",
    calendlyPath: "new-meeting-1",
    buttonClass: "bg-blue-500 hover:bg-blue-400 text-black",
  },
  {
    duration: "30 Minutes",
    price: "$25",
    calendlyPath: "30min",
    buttonClass: "bg-yellow-500 hover:bg-yellow-400 text-black",
  },
  {
    duration: "1 Hour",
    price: "$50",
    calendlyPath: "new-meeting",
    buttonClass: "border border-white/20 hover:bg-white hover:text-black text-white",
  },
];

export default function ConsultationModal({
  isOpen,
  onClose,
  consultationType = "General", // "General" or specific service name
}) {
  const modalRef = useRef(null);
  const [calendlyReady, setCalendlyReady] = useState(true);

  // Safe URL parameter
  const urlParam = consultationType === "General" 
    ? "General%20Consultation"
    : encodeURIComponent(consultationType);

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Check if Calendly is loaded
  useEffect(() => {
    if (!isOpen) return;

    const checkCalendly = setInterval(() => {
      if (typeof window !== "undefined" && window.Calendly) {
        setCalendlyReady(true);
        clearInterval(checkCalendly);
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(checkCalendly);
      setCalendlyReady(true); // Assume ready after 5s
    }, 5000);

    return () => {
      clearInterval(checkCalendly);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-zinc-950 border border-white/10 rounded-[32px] p-10 max-w-lg w-full relative shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 text-white hover:text-yellow-400 text-2xl transition"
            >
              ✕
            </button>

            {/* Title */}
            <h2 id="modal-title" className="text-4xl font-black mb-2 text-center text-white">
              Choose Your Consultation
            </h2>
            <p id="modal-description" className="text-gray-400 text-center mb-4">
              Select your preferred consultation duration.
            </p>

            {/* Show what they're booking for (if specific service) */}
            {consultationType !== "General" && (
              <div className="mb-6 text-center">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Booking for
                </span>
                <p className="text-yellow-400 font-semibold">"{consultationType}"</p>
              </div>
            )}

            {/* Consultation options */}
            <div className="flex flex-col gap-5">
              {CONSULTATION_OPTIONS.map((option) => (
                <div key={option.duration}>
                  {calendlyReady ? (
                    <PopupButton
                      url={`https://calendly.com/myjkservices/${option.calendlyPath}?a1=${urlParam}`}
                      rootElement={
                        typeof window !== "undefined" ? document.body : undefined
                      }
                      text={`${option.duration} - ${option.price}`}
                      className={`${option.buttonClass} py-5 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full cursor-pointer`}
                    />
                  ) : (
                    <button
                      disabled
                      className="bg-gray-600 text-white py-5 rounded-2xl font-bold text-lg w-full cursor-not-allowed opacity-50"
                    >
                      Loading {option.duration}...
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Help text */}
            <p className="text-gray-500 text-xs text-center mt-6">
              You'll be redirected to Calendly to complete your booking.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}