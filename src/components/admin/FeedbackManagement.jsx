
"use client";

/* =========================================
   REACT
========================================= */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================
   FRAMER MOTION
========================================= */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* =========================================
   ICONS
========================================= */

import {
  MessageSquareMore,
  Search,
  CheckCircle2,
  Clock3,
  Trash2,
  ShieldCheck,
  Star,
  Sparkles,
  Eye,
  X,
} from "lucide-react";

/* =========================================
   FIREBASE
========================================= */

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* =========================================
   COMPONENT
========================================= */

export default function FeedbackManagement() {

  /* =========================================
     STATE
  ========================================= */

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedFeedback,
        setSelectedFeedback] =
    useState(null);

  /* =========================================
     LOAD FEEDBACKS
  ========================================= */

  const loadFeedbacks = async () => {

    try {

      setLoading(true);

      const q = query(
        collection(db, "feedbacks"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(q);

      const items = snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );

      setFeedbacks(items);

    } catch (error) {

      console.error(
        "Feedback Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadFeedbacks();

  }, []);

  /* =========================================
     FILTERED FEEDBACKS
  ========================================= */

  const filteredFeedbacks =
    useMemo(() => {

      return feedbacks.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.service
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [feedbacks, search]);

  /* =========================================
     TOGGLE APPROVAL
  ========================================= */

  const toggleApproval = async (
    id,
    currentStatus
  ) => {

    try {

      const updatedStatus =
        currentStatus === true
          ? false
          : true;

      await updateDoc(
        doc(db, "feedbacks", id),
        {
          approved: updatedStatus,
        }
      );

      /* OPTIMISTIC UPDATE */

      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                approved:
                  updatedStatus,
              }
            : item
        )
      );

    } catch (error) {

      console.error(error);
    }
  };

  /* =========================================
     DELETE FEEDBACK
  ========================================= */

  const deleteFeedback = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this feedback?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "feedbacks", id)
      );

      /* REMOVE LOCALLY */

      setFeedbacks((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      console.error(error);
    }
  };

  /* =========================================
     STATS
  ========================================= */

  const approvedCount =
    feedbacks.filter(
      (item) => item.approved
    ).length;

  const pendingCount =
    feedbacks.filter(
      (item) => !item.approved
    ).length;

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (acc, item) =>
              acc +
              (item.rating || 0),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : "0.0";

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="relative min-h-screen overflow-hidden bg-black p-6 text-white md:p-8">

      {/* =====================================
          AMBIENT GLOW
      ===================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-md">

              <Sparkles size={16} />

              Premium Review Dashboard
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Feedback Management
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Manage customer reviews, testimonials and approvals with cinematic controls.
            </p>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-4 lg:w-auto">

            <StatCard
              icon={<MessageSquareMore size={22} />}
              title="Total"
              value={feedbacks.length}
            />

            <StatCard
              icon={<ShieldCheck size={22} />}
              title="Approved"
              value={approvedCount}
            />

            <StatCard
              icon={<Clock3 size={22} />}
              title="Pending"
              value={pendingCount}
            />

            <StatCard
              icon={<Star size={22} />}
              title="Rating"
              value={averageRating}
            />

          </div>
        </div>

        {/* =====================================
            SEARCH BAR
        ===================================== */}

        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">

          <Search className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search customer or service..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-transparent outline-none placeholder:text-zinc-500"
          />
        </div>

        {/* =====================================
            FEEDBACK GRID
        ===================================== */}

        {loading ? (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-[320px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              )
            )}
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredFeedbacks.map(
              (item) => (

                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-blue-500/30"
                >

                  {/* HEADER */}

                  <div className="mb-5 flex items-start justify-between">

                    <div>
                      <h3 className="text-xl font-bold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {item.service}
                      </p>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        item.approved
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.approved
                        ? "Approved"
                        : "Pending"}
                    </div>
                  </div>

                  {/* STARS */}

                  <div className="mb-5 flex gap-1 text-yellow-400">

                    {Array.from({
                      length: item.rating || 0,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  {/* FEEDBACK */}

                  <p className="line-clamp-4 text-zinc-400">
                    {item.feedback}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        toggleApproval(
                          item.id,
                          item.approved
                        )
                      }
                      className={`rounded-2xl px-4 py-3 font-semibold transition ${
                        item.approved
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-green-500 text-black hover:bg-green-400"
                      }`}
                    >
                      {item.approved
                        ? "Disapprove"
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        setSelectedFeedback(
                          item
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:bg-white/[0.06]"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        deleteFeedback(
                          item.id
                        )
                      }
                      className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold transition hover:bg-red-500"
                    >
                      <Trash2 size={16} />
                      Delete Feedback
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>

      {/* =====================================
          VIEW MODAL
      ===================================== */}

      <AnimatePresence>

        {selectedFeedback && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0B0B0F] p-8"
            >

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <h2 className="text-3xl font-bold">
                    Customer Review
                  </h2>

                  <p className="mt-1 text-zinc-500">
                    Detailed testimonial view.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedFeedback(null)
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] transition hover:bg-white/[0.08]"
                >
                  <X />
                </button>
              </div>

              {/* CONTENT */}

              <div className="space-y-6">

                <div>
                  <p className="text-sm text-zinc-500">
                    Customer
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {selectedFeedback.name}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    Service
                  </p>

                  <p className="mt-2 text-lg text-blue-400">
                    {selectedFeedback.service}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm text-zinc-500">
                    Rating
                  </p>

                  <div className="flex gap-1 text-yellow-400">

                    {Array.from({
                      length:
                        selectedFeedback.rating ||
                        0,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm text-zinc-500">
                    Feedback
                  </p>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-zinc-300 leading-relaxed">
                    {selectedFeedback.feedback}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  title,
  value,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-blue-400">
        {icon}
      </div>

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-black">
        {value}
      </h3>
    </div>
  );
}