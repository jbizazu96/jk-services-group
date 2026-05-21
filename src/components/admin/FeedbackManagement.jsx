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

  const approveFeedback = async (id) => {

    await updateDoc(
      doc(db, "feedbacks", id),
      {
        approved: true,
      }
    );

    loadFeedbacks();
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

      <h2 className="text-4xl font-black mb-8">
        Feedback Management
      </h2>

      <div className="space-y-6">

        {feedbacks.map((item) => (

          <div
            key={item.id}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
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

                <p className="mt-4">
                  ⭐ {item.rating}/5
                </p>

                <p className="mt-4 text-gray-300">
                  {item.feedback}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Status:
                  {" "}
                  {item.approved
                    ? "Approved"
                    : "Pending"}
                </p>

              </div>

              <div className="flex gap-3">

                {!item.approved && (
                  <button
                    onClick={() =>
                      approveFeedback(item.id)
                    }
                    className="
                      bg-green-500
                      px-4
                      py-2
                      rounded-xl
                      font-bold
                    "
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteFeedback(item.id)
                  }
                  className="
                    bg-red-500
                    px-4
                    py-2
                    rounded-xl
                    font-bold
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