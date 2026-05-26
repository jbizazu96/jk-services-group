"use client";

/* ==========================================
   REACT
========================================== */

import { useState } from "react";

/* ==========================================
   ADMIN COMPONENTS
========================================== */

import FeedbackManagement from "@/components/admin/FeedbackManagement";

import ProtectedAdmin from "@/components/admin/ProtectedAdmin";

import DashboardStats from "@/components/admin/DashboardStats";

import ServiceManagement from "@/components/admin/ServiceManagement";

import PortfolioManagement from "@/components/admin/PortfolioManagement";

import PortfolioItemsManagement from "@/components/admin/PortfolioItemsManagement";

/* ==========================================
   AUTH FUNCTIONS
========================================== */

import { logout } from "@/lib/auth";

/* ==========================================
   ADMIN PAGE COMPONENT
========================================== */

export default function AdminPage() {

  /* ==========================================
     ACTIVE TAB STATE

     Controls which admin page
     is currently displayed.
  ========================================== */

  const [activeTab, setActiveTab] =
    useState("dashboard");

  return (

    /* ==========================================
       PROTECTED ADMIN ROUTE

       Only logged-in admins can access.
    ========================================== */

    <ProtectedAdmin>

      {/* ==========================================
          MAIN PAGE LAYOUT
      ========================================== */}

      <main className="min-h-screen bg-slate-950 text-white flex">

        {/* ==========================================
            SIDEBAR NAVIGATION
        ========================================== */}

        <aside
          className="
            w-72
            bg-black
            border-r
            border-white/10
            p-6
            flex
            flex-col
          "
        >

          {/* ==========================================
              TOP SIDEBAR CONTENT
          ========================================== */}

          <div>

            {/* ADMIN LOGO / TITLE */}

            <h1
              className="
                text-2xl
                font-black
                mb-10
              "
            >
              J&K Admin
            </h1>

            {/* ==========================================
                NAVIGATION BUTTONS
            ========================================== */}

            <div className="space-y-3">

              {/* DASHBOARD */}

              <button
                onClick={() =>
                  setActiveTab(
                    "dashboard"
                  )
                }
                className={`

                  w-full
                  text-left
                  p-4
                  rounded-xl
                  transition

                  ${
                    activeTab ===
                    "dashboard"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-white/10"
                  }

                `}
              >
                🏠 Dashboard
              </button>

              {/* FEEDBACKS */}

              <button
                onClick={() =>
                  setActiveTab(
                    "feedbacks"
                  )
                }
                className={`

                  w-full
                  text-left
                  p-4
                  rounded-xl
                  transition

                  ${
                    activeTab ===
                    "feedbacks"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-white/10"
                  }

                `}
              >
                ⭐ Feedbacks
              </button>

              {/* BOOKINGS */}

              <button
                onClick={() =>
                  setActiveTab(
                    "bookings"
                  )
                }
                className={`

                  w-full
                  text-left
                  p-4
                  rounded-xl
                  transition

                  ${
                    activeTab ===
                    "bookings"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-white/10"
                  }

                `}
              >
                📅 Bookings
              </button>

              {/* SERVICES */}

              <button
                onClick={() =>
                  setActiveTab(
                    "services"
                  )
                }
                className={`

                  w-full
                  text-left
                  p-4
                  rounded-xl
                  transition

                  ${
                    activeTab ===
                    "services"

                      ? "bg-blue-600 text-white"

                      : "hover:bg-white/10"
                  }

                `}
              >
                🛠 Services
              </button>

              {/* PORTFOLIO */}

              <button
                onClick={() =>
                  setActiveTab(
                    "portfolio"
                  )
                }
                className="
                  w-full
                  text-left
                  p-4
                  rounded-xl
                  hover:bg-white/10
                  transition
                "
              >
                🖼 Portfolio Categories
              </button>

                  <button
                onClick={() =>
                  setActiveTab(
                    "portfolioItems"
                  )
                }
                className="
                  w-full
                  text-left
                  p-4
                  rounded-xl
                  hover:bg-white/10
                  transition
                "
              >
                🎬 Portfolio Items
              </button>

            </div>

          </div>

          {/* ==========================================
              LOGOUT SECTION
          ========================================== */}

          <div className="mt-auto pt-8">

            <button

              onClick={async () => {

                /*
                  Sign out admin
                */

                await logout();

                /*
                  Redirect to login page
                */

                window.location.href =
                  "/admin";
              }}

              className="
                w-full
                bg-red-500
                hover:bg-red-600
                py-3
                rounded-xl
                font-bold
                transition
              "
            >
              Logout
            </button>

          </div>

        </aside>

        {/* ==========================================
            MAIN CONTENT AREA
        ========================================== */}

        <section
          className="
            flex-1
            p-10
            overflow-y-auto
          "
        >

          {/* ==========================================
              DASHBOARD TAB
          ========================================== */}

          {activeTab ===
            "dashboard" && (

            <div>

              <h2
                className="
                  text-4xl
                  font-black
                  mb-8
                "
              >
                Dashboard Overview
              </h2>

              {/* Dashboard Statistics */}

              <DashboardStats />

            </div>

          )}

          {/* ==========================================
              FEEDBACKS TAB
          ========================================== */}

          {activeTab ===
            "feedbacks" && (

            <FeedbackManagement />

          )}

          {/* ==========================================
              BOOKINGS TAB
          ========================================== */}

          {activeTab ===
            "bookings" && (

            <div>

              <h2
                className="
                  text-4xl
                  font-black
                  mb-6
                "
              >
                Booking Management
              </h2>

              <div
                className="
                  bg-white/5
                  rounded-3xl
                  p-8
                  border
                  border-white/10
                "
              >

                <p className="text-gray-400">

                  Booking system will
                  be connected here soon.

                </p>

              </div>

            </div>

          )}

          {/* ==========================================
              SERVICES TAB
          ========================================== */}

          {activeTab ===
            "services" && (

            <ServiceManagement />

          )}

          {/* ==========================================
              PORTFOLIO MANAGEMENT
          ========================================== */}

          {activeTab === "portfolio" && (

            <PortfolioManagement />

          )}

          {/* ==========================================
            PORTFOLIO ITEMS
          ========================================== */}

            {activeTab ===
            "portfolioItems" && (

            <PortfolioItemsManagement />

          )}

        </section>

      </main>

    </ProtectedAdmin>
  );
}