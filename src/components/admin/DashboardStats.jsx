"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function DashboardStats() {

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    average: 0,
  });

  useEffect(() => {

    loadStats();

  }, []);

  const loadStats = async () => {

    const snapshot = await getDocs(
      collection(db, "feedbacks")
    );

    const feedbacks =
      snapshot.docs.map(doc => doc.data());

    const total =
      feedbacks.length;

    const approved =
      feedbacks.filter(
        item => item.approved === true
      ).length;

    const pending =
      feedbacks.filter(
        item => !item.approved
      ).length;

    const average =
      feedbacks.length > 0
        ? (
            feedbacks.reduce(
              (sum, item) =>
                sum + item.rating,
              0
            ) / feedbacks.length
          ).toFixed(1)
        : 0;

    setStats({
      total,
      approved,
      pending,
      average,
    });
  };

  return (

    <div className="grid md:grid-cols-4 gap-6">

      <div className="bg-white/5 rounded-3xl p-6">

        <p className="text-gray-400">
          Total Feedbacks
        </p>

        <h2 className="text-4xl font-black mt-2">
          {stats.total}
        </h2>

      </div>

      <div className="bg-green-500/10 rounded-3xl p-6">

        <p className="text-green-300">
          Approved
        </p>

        <h2 className="text-4xl font-black mt-2">
          {stats.approved}
        </h2>

      </div>

      <div className="bg-yellow-500/10 rounded-3xl p-6">

        <p className="text-yellow-300">
          Pending
        </p>

        <h2 className="text-4xl font-black mt-2">
          {stats.pending}
        </h2>

      </div>

      <div className="bg-blue-500/10 rounded-3xl p-6">

        <p className="text-blue-300">
          Average Rating
        </p>

        <h2 className="text-4xl font-black mt-2">
          ⭐ {stats.average}
        </h2>

      </div>

    </div>

  );
}