"use client";

/* ==========================================
   REACT
========================================== */

import {
  useEffect,
  useState,
} from "react";

/* ==========================================
   FIRESTORE
========================================== */

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* ==========================================
   DASHBOARD STATS COMPONENT

   Purpose:
   Displays dashboard statistics
   for feedback management.

   Statistics:
   - Total Feedbacks
   - Approved Feedbacks
   - Pending Feedbacks
   - Average Rating
========================================== */

export default function DashboardStats() {

  /* ==========================================
     DASHBOARD STATISTICS STATE

     Stores all dashboard metrics.
  ========================================== */

  const [stats, setStats] =
    useState({

      total: 0,

      approved: 0,

      pending: 0,

      average: 0,

    });

  /* ==========================================
     INITIAL PAGE LOAD

     Load statistics when component
     first renders.
  ========================================== */

  useEffect(() => {

    loadStats();

  }, []);

  /* ==========================================
     LOAD DASHBOARD STATISTICS

     Reads feedback records from
     Firestore and calculates
     dashboard metrics.
  ========================================== */

/* ==========================================
   LOAD DASHBOARD STATISTICS
========================================== */

const loadStats = async () => {

  /* ==========================================
     LOAD FEEDBACKS
  ========================================== */

  const feedbackSnapshot =
    await getDocs(
      collection(
        db,
        "feedbacks"
      )
    );

  const feedbacks =
    feedbackSnapshot.docs.map(
      (doc) => doc.data()
    );

  /* ==========================================
     FEEDBACK CALCULATIONS
  ========================================== */

  const totalFeedbacks =
    feedbacks.length;

  const approvedFeedbacks =
    feedbacks.filter(
      (item) =>
        item.approved === true
    ).length;

  const pendingFeedbacks =
    feedbacks.filter(
      (item) =>
        !item.approved
    ).length;

  const averageRating =

    feedbacks.length > 0

      ? (

          feedbacks.reduce(

            (sum, item) =>

              sum +
              item.rating,

            0

          )

          /

          feedbacks.length

        ).toFixed(1)

      : 0;

        /* ==========================================
          LOAD SERVICES
        ========================================== */

        const serviceSnapshot =
          await getDocs(
            collection(
              db,
              "services"
            )
          );

        const services =
          serviceSnapshot.docs.map(
            (doc) => doc.data()
          );

        /* ==========================================
          SERVICE CALCULATIONS
        ========================================== */

        const totalServices =
          services.length;

        const activeServices =
          services.filter(
            (service) =>
              service.active
          ).length;

        const featuredServices =
          services.filter(
            (service) =>
              service.featured
          ).length;

        const inactiveServices =
          services.filter(
            (service) =>
              !service.active
          ).length;

        /* ==========================================
          LOAD PORTFOLIO CATEGORIES
        ========================================== */

        const portfolioSnapshot =
          await getDocs(
            collection(
              db,
              "portfolioCategories"
            )
          );

        const portfolioCategories =
          portfolioSnapshot.docs.map(
            (doc) => doc.data()
          );

       /* ==========================================
        PORTFOLIO CALCULATIONS
      ========================================== */

      const totalPortfolioCategories =
        portfolioCategories.length;

      const activePortfolioCategories =
        portfolioCategories.filter(
          (item) =>
            item.active
        ).length;

      const featuredPortfolioCategories =
        portfolioCategories.filter(
          (item) =>
            item.featured
        ).length;

      const inactivePortfolioCategories =
        portfolioCategories.filter(
          (item) =>
            !item.active
        ).length;

  /* ==========================================
     UPDATE DASHBOARD STATE
  ========================================== */

  setStats({

    totalFeedbacks,
    approvedFeedbacks,
    pendingFeedbacks,
    averageRating,

    totalServices,
    activeServices,
    featuredServices,
    inactiveServices,

    totalPortfolioCategories,
    activePortfolioCategories,
    featuredPortfolioCategories,
    inactivePortfolioCategories,

  });

};

  /* ==========================================
     USER INTERFACE
  ========================================== */

return (

  <div className="space-y-10">

    {/* ==========================================
        FEEDBACK STATISTICS
    ========================================== */}

    <div>

      <h3 className="text-2xl font-bold mb-4">
        Feedback Overview
      </h3>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 rounded-3xl p-6">
          <p className="text-gray-400">
            Total Feedbacks
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.totalFeedbacks}
          </h2>
        </div>

        <div className="bg-green-500/10 rounded-3xl p-6">
          <p className="text-green-300">
            Approved
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.approvedFeedbacks}
          </h2>
        </div>

        <div className="bg-yellow-500/10 rounded-3xl p-6">
          <p className="text-yellow-300">
            Pending
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.pendingFeedbacks}
          </h2>
        </div>

        <div className="bg-blue-500/10 rounded-3xl p-6">
          <p className="text-blue-300">
            Average Rating
          </p>

          <h2 className="text-4xl font-black mt-2">
            ⭐ {stats.averageRating}
          </h2>
        </div>

      </div>

    </div>

    {/* ==========================================
        SERVICE STATISTICS
    ========================================== */}

    <div>

      <h3 className="text-2xl font-bold mb-4">
        Service Overview
      </h3>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 rounded-3xl p-6">
          <p className="text-gray-400">
            Total Services
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.totalServices}
          </h2>
        </div>

        <div className="bg-green-500/10 rounded-3xl p-6">
          <p className="text-green-300">
            Active
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.activeServices}
          </h2>
        </div>

        <div className="bg-yellow-500/10 rounded-3xl p-6">
          <p className="text-yellow-300">
            Featured
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.featuredServices}
          </h2>
        </div>

        <div className="bg-red-500/10 rounded-3xl p-6">
          <p className="text-red-300">
            Inactive
          </p>

          <h2 className="text-4xl font-black mt-2">
            {stats.inactiveServices}
          </h2>
        </div>

      </div>

    </div>

         {/* ==========================================
            PORTFOLIO STATISTICS
        ========================================== */}

        <div>

          <h3 className="text-2xl font-bold mb-4">
            Portfolio Overview
          </h3>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="
              bg-white/5
              rounded-3xl
              p-6
            ">
              <p className="text-gray-400">
                Total Categories
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
              ">
                {stats.totalPortfolioCategories}
              </h2>
            </div>

            <div className="
              bg-green-500/10
              rounded-3xl
              p-6
            ">
              <p className="text-green-300">
                Active
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
              ">
                {stats.activePortfolioCategories}
              </h2>
            </div>

            <div className="
              bg-yellow-500/10
              rounded-3xl
              p-6
            ">
              <p className="text-yellow-300">
                Featured
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
              ">
                {stats.featuredPortfolioCategories}
              </h2>
            </div>

            <div className="
              bg-red-500/10
              rounded-3xl
              p-6
            ">
              <p className="text-red-300">
                Inactive
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
              ">
                {stats.inactivePortfolioCategories}
              </h2>
            </div>

          </div>

        </div>

  </div>

);
}