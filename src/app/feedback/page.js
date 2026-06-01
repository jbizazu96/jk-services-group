
"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
} from "react";

/* ==========================================
   NEXT
========================================== */

import Image from "next/image";
import Link from "next/link";

/* ==========================================
   FRAMER MOTION
========================================== */

import { motion } from "framer-motion";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   ICONS
========================================== */

import {
  Sparkles,
  Star,
  CheckCircle2,
  Home,
  RotateCcw,
} from "lucide-react";

/* ==========================================
   PAGE
========================================== */

export default function FeedbackPage() {

  /* ==========================================
     STATES
  ========================================== */

  const [categories, setCategories] =
    useState([]);

  const [services, setServices] =
    useState([]);

  const [name, setName] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedService,
    setSelectedService,
  ] = useState("");

  const [rating, setRating] =
    useState(5);

  const [feedback, setFeedback] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [feedbackId, setFeedbackId] =
    useState("");

  /* ==========================================
     LOAD CATEGORIES
  ========================================== */

  useEffect(() => {

    loadCategories();

  }, []);

  const loadCategories =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "serviceCategories"
            )
          );

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setCategories(data);

      } catch (error) {

        console.error(error);

      }
    };

  /* ==========================================
     LOAD SERVICES
  ========================================== */

  useEffect(() => {

    if (
      !selectedCategory
    ) {

      setServices([]);
      setSelectedService("");

      return;
    }

    loadServices();

  }, [selectedCategory]);

  const loadServices =
    async () => {

      try {

        const snapshot =
          await getDocs(
            query(
              collection(
                db,
                "services"
              ),
              where(
                "category",
                "==",
                selectedCategory
              )
            )
          );

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setServices(data);

      } catch (error) {

        console.error(error);

      }
    };

  /* ==========================================
     RESET FORM
  ========================================== */

  const resetForm = () => {

    setName("");

    setSelectedCategory("");

    setSelectedService("");

    setRating(5);

    setFeedback("");

    setServices([]);

    setFeedbackId("");

    setSuccess(false);
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const generatedId =
          `FB-${Date.now()}`;

        await addDoc(
          collection(
            db,
            "feedbacks"
          ),
          {
            name,
            category:
              selectedCategory,
            service:
              selectedService,
            rating,
            feedback,
            approved: false,
            feedbackId:
              generatedId,
            createdAt:
              serverTimestamp(),
          }
        );

        setFeedbackId(
          generatedId
        );

        setSuccess(true);

      } catch (error) {

        console.error(error);

        alert(
          "Unable to submit feedback."
        );

      } finally {

        setLoading(false);
      }
    };

  /* ==========================================
     SUCCESS SCREEN
  ========================================== */

  if (success) {

    return (

      <div
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#f8f5ef]
          flex
          items-center
          justify-center
          px-6
        "
      >

        <div
          className="
            absolute
            top-[-150px]
            left-1/2
            -translate-x-1/2
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#D4AF37]/15
            blur-[80px]
          "
        />

        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            relative
            z-10
            max-w-2xl
            w-full
            rounded-[40px]
            border
            border-white/50
            bg-white/75
            backdrop-blur-3xl
            p-10
            text-center
            shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          "
        >

          <CheckCircle2
            size={90}
            className="
              mx-auto
              mb-6
              text-green-500
            "
          />

          <h1
            className="
              text-5xl
              font-bold
              text-[#111111]
            "
          >

            Feedback Submitted

          </h1>

          <p
            className="
              mt-4
              text-[#555555]
            "
          >

            Thank you for sharing
            your experience.

          </p>

          <div
            className="
              mt-8
              rounded-3xl
              bg-[#faf7f2]
              border
              border-[#ece6da]
              p-6
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-[0.25em]
                text-[#777777]
              "
            >

              Feedback ID

            </p>

            <p
              className="
                mt-3
                text-2xl
                font-bold
              "
            >

              {feedbackId}

            </p>

          </div>

          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
              sm:flex-row
            "
          >

            <button

              onClick={resetForm}

              className="
                flex-1
                rounded-2xl
                bg-gradient-to-r
                from-[#f5deb3]
                to-[#D4AF37]
                px-6
                py-4
                font-semibold
                text-black
              "
            >

              <RotateCcw
                className="
                  inline
                  mr-2
                "
                size={18}
              />

              Submit Another Feedback

            </button>

            <Link
              href="/"
              className="
                flex-1
                rounded-2xl
                border
                border-[#D4AF37]/30
                bg-white/70
                px-6
                py-4
                text-center
                font-semibold
              "
            >

              <Home
                className="
                  inline
                  mr-2
                "
                size={18}
              />

              Return Home

            </Link>

          </div>

        </motion.div>

      </div>
    );
  }

  /* ==========================================
     FORM PAGE
  ========================================== */

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f8f5ef]
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          bg-white/80
        "
      />

      {/* GOLD GLOW */}

      <div
       className="
          absolute
          top-[-200px]
          left-1/2
          -translate-x-1/2
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D4AF37]/10
          blur-[80px]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          max-w-4xl
          mx-auto
          px-6
          py-24
        "
      >

        {/* LOGO */}

        <div
          className="
            flex
            justify-center
            mb-10
          "
        >

          <div
            className="
              rounded-[2rem]
              border
              border-white/50
              bg-white/70
              px-10
              py-6
              backdrop-blur-xl
            "
          >

           <Image
              src="/images/logo1.webp"
              alt="J&K Services Group"
              width={240}
              height={80}
              /*priority == This force the page to load the picture first*/
              loading="eager"
              style={{
                width: "auto",
                height: "auto",
              }}
            />

          </div>

        </div>

        {/* HERO */}

        <div className="text-center">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#D4AF37]/10
              px-5
              py-2
              text-sm
              text-[#b8860b]
              mb-8
            "
          >

            <Sparkles
              size={16}
            />

            Premium Client Feedback

          </div>

         
          {/* TITLE */}
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] max-w-6xl mx-auto text-[#111111]">

            Share Your

            <span className="block bg-gradient-to-r from-[#111111] via-[#b8860b] to-[#D4AF37] bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p
            className="
              mt-6
              text-lg
              text-[#555555]
              max-w-2xl
              mx-auto
            "
          >

            Thank you for choosing
            J&K Services Group.
            We value your feedback
            and appreciate your
            time sharing your
            experience.

          </p>

        </div>

        {/* FORM CARD */}

        <form

          onSubmit={
            handleSubmit
          }

          className="
            mt-16
            rounded-[40px]
            border
            border-white/50
            bg-white/70
            backdrop-blur-xl
            p-8
            md:p-12
            shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          "
        >

          <div className="grid gap-6">

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Full Name"
              required
              className="
                rounded-2xl
                border
                border-[#e5e5e5]
                bg-white
                p-4
              "
            />

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              required
              className="
                rounded-2xl
                border
                border-[#e5e5e5]
                bg-white
                p-4
              "
            >

              <option value="">
                Select Service Category
              </option>

              {categories.map(
                (
                  category
                ) => (

                  <option
                    key={
                      category.id
                    }
                    value={
                      category.name
                    }
                  >

                    {category.name}

                  </option>

                )
              )}

            </select>

            <select
              value={
                selectedService
              }
              onChange={(e) =>
                setSelectedService(
                  e.target.value
                )
              }
              required
              className="
                rounded-2xl
                border
                border-[#e5e5e5]
                bg-white
                p-4
              "
            >

              <option value="">
                Select Service
              </option>

              {services.map(
                (
                  service
                ) => (

                  <option
                    key={
                      service.id
                    }
                    value={
                      service.name
                    }
                  >

                    {service.name}

                  </option>

                )
              )}

            </select>

            {/* STARS */}

            <div>

              <p
                className="
                  mb-4
                  font-semibold
                  text-[#111111]
                "
              >

                Rate Your Experience

              </p>

              <div
                className="
                  flex
                  gap-2
                "
              >

                {[1,2,3,4,5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                    >

                      <Star
                        size={36}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-300"
                        }
                      />

                    </button>

                  )
                )}

              </div>

            </div>

            <textarea
              rows={6}
              value={feedback}
              onChange={(e) =>
                setFeedback(
                  e.target.value
                )
              }
              placeholder="Tell us about your experience..."
              required
              className="
                rounded-[24px]
                border
                border-[#e5e5e5]
                bg-white
                p-5
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-2xl
                bg-gradient-to-r
                from-[#f5deb3]
                to-[#D4AF37]
                py-5
                text-lg
                font-semibold
                text-black
              "
            >

              {loading
                ? "Submitting..."
                : "Submit Feedback"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
