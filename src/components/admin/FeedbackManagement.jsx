"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function FeedbackManagement() {

  const [feedbacks, setFeedbacks] = useState([]);

  const loadFeedbacks = async () => {

    const snapshot = await getDocs(
      collection(db, "feedbacks")
    );

    const items = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setFeedbacks(items);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

/* ==========================================
   TOGGLE FEEDBACK APPROVAL

   Purpose:
   Switch feedback between
   Approved and Pending.

   Approved  -> Pending
   Pending   -> Approved
========================================== */

const toggleApproval = async (

  id,

  currentStatus

) => {

  try {

    /* ==========================================
       UPDATE FIRESTORE DOCUMENT
    ========================================== */

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

    /* ==========================================
       REFRESH FEEDBACKS
    ========================================== */

    await loadFeedbacks();

  } catch (error) {

    console.error(
      "Approval Error:",
      error
    );

  }

};

  const deleteFeedback = async (id) => {

    if (!confirm("Delete feedback?")) return;

    await deleteDoc(
      doc(db, "feedbacks", id)
    );

    loadFeedbacks();
  };

  return (
    
    <div>

        
        {/* ==========================================
              PAGE HEADER
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
                website testimonials.
              </p>

            </div>

            {/* TOTAL FEEDBACK COUNT */}

            <div
              className="
                bg-zinc-900
                px-4
                py-2
                rounded-xl
                border
                border-zinc-800
              "
            >
              Total:
              {" "}
              {feedbacks.length}
            </div>

          </div>

  

      <div className="space-y-6">

        {/* ==========================================
            FEEDBACK CARD

            Displays:
            - Customer Name
            - Service Name
            - Rating
            - Feedback Message
            - Approval Status
            - Action Buttons
        ========================================== */}

        {feedbacks.map((item) => (
          <div
            key={item.id}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              shadow-xl
              hover:border-blue-500/30
              transition
            "

          >

            <div className="flex justify-between">

              <div>

                <h3 className="text-2xl font-bold">
                  {item.name}
                </h3>

                <p className="text-yellow-400">
                  {item.service}
                </p>

                {/* ==========================================
                    CUSTOMER RATING

                    Example:
                    ⭐⭐⭐⭐⭐
                ========================================== */}

                <div
                  className="
                    mt-3
                    text-yellow-400
                  "
                >

                  {"⭐".repeat(
                    item.rating
                  )}

                </div>

                <p className="mt-4 text-gray-300">
                  {item.feedback}
                </p>

               {/* ==========================================
                  APPROVAL STATUS
              ========================================== */}

              <div className="mt-4">

                {item.approved ? (

                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      bg-green-500/20
                      text-green-400
                      text-sm
                      font-semibold
                    "
                  >
                    ✓ Approved
                  </span>

                ) : (

                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      bg-yellow-500/20
                      text-yellow-400
                      text-sm
                      font-semibold
                    "
                  >
                    ⏳ Pending
                  </span>

                )}

              </div>

              </div>

              <div className="flex gap-3">

               {/* ==========================================
                    APPROVE / DISAPPROVE BUTTON

                    Green:
                    Pending -> Approve

                    Yellow:
                    Approved -> Disapprove
                ========================================== */}

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
                    font-bold
                    transition

                    ${

                      item.approved

                        ? "bg-yellow-500 hover:bg-yellow-600"

                        : "bg-green-500 hover:bg-green-600"

                    }

                  `}
                >

                  {

                    item.approved

                      ? "Disapprove"

                      : "Approve"

                  }

                </button>

                {/* ==========================================
                      DELETE FEEDBACK BUTTON

                      Permanently removes feedback
                      from Firestore.
                  ========================================== */}

                  <button

                    onClick={() =>
                      deleteFeedback(
                        item.id
                      )
                    }

                    className="
                      bg-red-500
                      hover:bg-red-600
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                      transition
                    "
                  >

                    Delete

                  </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}