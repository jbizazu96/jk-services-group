"use client";

/* ==========================================
   REACT
========================================== */

import { useEffect, useState } from "react";

/* ==========================================
   FIREBASE
========================================== */

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   FEEDBACK MANAGEMENT
========================================== */

export default function FeedbackManagement() {

  /* ==========================================
     STATE
  ========================================== */

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ==========================================
     LOAD FEEDBACKS
  ========================================== */

  useEffect(() => {

    loadFeedbacks();

  }, []);

  const loadFeedbacks = async () => {

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "feedbacks"
          )
        );

      const items =
        snapshot.docs.map(
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

  /* ==========================================
     TOGGLE APPROVAL
  ========================================== */

  const toggleApproval = async (
    id,
    currentStatus
  ) => {

    try {

      await updateDoc(

        doc(
          db,
          "feedbacks",
          id
        ),

        {
          approved:
            currentStatus === true
              ? false
              : true,
        }

      );

      await loadFeedbacks();

    } catch (error) {

      console.error(
        error
      );

    }

  };

  /* ==========================================
     DELETE FEEDBACK
  ========================================== */

  const deleteFeedback = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this feedback?"
      );

    if (!confirmDelete)
      return;

    await deleteDoc(

      doc(
        db,
        "feedbacks",
        id
      )

    );

    loadFeedbacks();

  };

  return (

    <div>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        className="
          flex
          justify-between
          items-center
          mb-8
        "
      >

        <div>

          <h2
            className="
              text-4xl
              font-black
            "
          >
            Feedback Management
          </h2>

          <p
            className="
              text-zinc-400
              mt-2
            "
          >
            Manage customer reviews and
            testimonials.
          </p>

        </div>

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            px-5
            py-3
            rounded-xl
          "
        >
          Total:
          {" "}
          {feedbacks.length}
        </div>

      </div>

      {/* ==========================================
          TABLE
      ========================================== */}

      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            grid
            grid-cols-12
            gap-4

            bg-black/30

            px-6
            py-4

            font-bold
            text-zinc-400
          "
        >

          <div className="col-span-3">
            Customer
          </div>

          <div className="col-span-2">
            Service
          </div>

          <div className="col-span-2">
            Rating
          </div>

          <div className="col-span-2">
            Status
          </div>

          <div className="col-span-3">
            Actions
          </div>

        </div>

        {/* ROWS */}

        {loading ? (

          <div className="p-8">
            Loading...
          </div>

        ) : (

          feedbacks.map((item) => (

            <div

              key={item.id}

              className="
                grid
                grid-cols-12
                gap-4

                px-6
                py-5

                border-t
                border-zinc-800

                items-center

                hover:bg-white/5
                transition
              "

            >

              {/* CUSTOMER */}

              <div className="col-span-3">

                <div
                  className="
                    font-bold
                  "
                >
                  {item.name}
                </div>

                <div
                  className="
                    text-sm
                    text-zinc-500
                    mt-1
                    line-clamp-1
                  "
                >
                  {item.feedback}
                </div>

              </div>

              {/* SERVICE */}

              <div
                className="
                  col-span-2
                  text-yellow-400
                "
              >
                {item.service}
              </div>

              {/* RATING */}

              <div
                className="
                  col-span-2
                  text-yellow-400
                "
              >
                {"⭐".repeat(
                  item.rating || 0
                )}
              </div>

              {/* STATUS */}

              <div className="col-span-2">

                {item.approved === true ? (

                  <span
                    className="
                      px-3
                      py-1

                      rounded-full

                      bg-green-500/20
                      text-green-400

                      text-sm
                    "
                  >
                    Approved
                  </span>

                ) : (

                  <span
                    className="
                      px-3
                      py-1

                      rounded-full

                      bg-yellow-500/20
                      text-yellow-400

                      text-sm
                    "
                  >
                    Pending
                  </span>

                )}

              </div>

              {/* ACTIONS */}

              <div
                className="
                  col-span-3
                  flex
                  gap-3
                "
              >

                <button

                  onClick={() =>
                    toggleApproval(
                      item.id,
                      item.approved
                    )
                  }

                  className={`
                    px-4
                    py-2

                    rounded-xl

                    font-semibold

                    transition

                    ${
                      item.approved === true

                        ? "bg-yellow-500 hover:bg-yellow-600"

                        : "bg-green-500 hover:bg-green-600"
                    }
                  `}
                >

                  {item.approved === true
                    ? "Disapprove"
                    : "Approve"}

                </button>

                <button

                  onClick={() =>
                    deleteFeedback(
                      item.id
                    )
                  }

                  className="
                    px-4
                    py-2

                    rounded-xl

                    bg-red-500
                    hover:bg-red-600

                    font-semibold

                    transition
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}