"use client";

import { useState } from "react";

import FeedbackManagement from "@/components/admin/FeedbackManagement";
import ProtectedAdmin from "@/components/admin/ProtectedAdmin";
import DashboardStats from "@/components/admin/DashboardStats";
import ServiceManagement from "@/components/admin/ServiceManagement";
import { logout } from "@/lib/auth";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ProtectedAdmin>
      <main className="min-h-screen bg-slate-950 text-white flex">

        {/* SIDEBAR */}
        <aside className="w-72 bg-black border-r border-white/10 p-6 flex flex-col">

          <div>
            <h1 className="text-2xl font-black mb-10">
              J&K Admin
            </h1>

            <div className="space-y-3">

              <button
                onClick={() => setActiveTab("dashboard")}
                className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition"
              >
                🏠 Dashboard
              </button>

              <button
                onClick={() => setActiveTab("feedbacks")}
                className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition"
              >
                ⭐ Feedbacks
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition"
              >
                📅 Bookings
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition"
              >
                🛠 Services
              </button>

            </div>
          </div>

          {/* Logout at Bottom */}
          <div className="mt-auto pt-8">

            <button
              onClick={async () => {
                await logout();
                window.location.href = "/admin";
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

          {/* CONTENT */}
            <section className="flex-1 p-10 overflow-y-auto">

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div>

                <h2 className="text-4xl font-black mb-8">
                  Dashboard Overview
                </h2>

                <DashboardStats />

              </div>
            )}

            {/* FEEDBACKS */}
            {activeTab === "feedbacks" && (
              <FeedbackManagement />
            )}

            {/* BOOKINGS */}
            {activeTab === "bookings" && (
              <div>

                <h2 className="text-4xl font-black mb-6">
                  Booking Management
                </h2>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">

                  <p className="text-gray-400">
                    Booking system will be connected here soon.
                  </p>

                </div>

              </div>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
              
             
                <ServiceManagement />
             
              
            )}

            </section>

      </main>
    </ProtectedAdmin>
  );
}