"use client";

/* ==========================================
   REACT
========================================== */

import {
  useState,
} from "react";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* ==========================================
   LUCIDE ICONS
========================================== */

import {

  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Images,
  ImagePlus,
  LogOut,
  Sparkles,
  FolderOpen,

} from "lucide-react";

/* ==========================================
   ADMIN COMPONENTS
========================================== */

import FeedbackManagement from "@/components/admin/FeedbackManagement";

import ProtectedAdmin from "@/components/admin/ProtectedAdmin";

import DashboardStats from "@/components/admin/DashboardStats";

import ServiceManagement from "@/components/admin/ServiceManagement";

import PortfolioManagement from "@/components/admin/PortfolioManagement";

import PortfolioItemsManagement from "@/components/admin/PortfolioItemsManagement";

import ServiceRequests from "@/components/admin/ServiceRequests";

/* ==========================================
   AUTH FUNCTIONS
========================================== */

import {
  logout,
} from "@/lib/auth";

/* ==========================================
   ADMIN PAGE COMPONENT
========================================== */

export default function AdminPage() {

  /* ==========================================
     ACTIVE TAB
  ========================================== */

  const [
    activeTab,
    setActiveTab,
  ] = useState("dashboard");

  /* ==========================================
     NAVIGATION ITEMS
  ========================================== */

  const navItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      id: "requests",
      label: "Service Requests",
      icon: FolderOpen,
    },

    {
      id: "feedbacks",
      label: "Feedbacks",
      icon: MessageSquare,
    },

    {
      id: "services",
      label: "Services",
      icon: Briefcase,
    },

    {
      id: "portfolio",
      label: "Portfolio Categories",
      icon: Images,
    },

    {
      id: "portfolioItems",
      label: "Portfolio Items",
      icon: ImagePlus,
    },

  ];

  /* ==========================================
     GET PAGE TITLE
  ========================================== */

  const currentPage =
    navItems.find(
      (item) =>
        item.id === activeTab
    );

  /* ==========================================
     JSX
  ========================================== */

  return (

    <ProtectedAdmin>

      {/* ==========================================
          MAIN WRAPPER
      ========================================== */}

            <main
          className="
            min-h-screen
            bg-black
            text-white
            flex
            relative
            overflow-x-hidden
            overflow-y-visible
          "
        >

        {/* ==========================================
            AMBIENT GLOW TOP RIGHT
        ========================================== */}

        <div
          className="
            absolute
            top-0
            right-0
            w-[500px]
            h-[500px]
            bg-purple-500/1ii0
            blur-[120px]
            rounded-full
            z-0
          "
        ></div>

        {/* ==========================================
            AMBIENT GLOW BOTTOM LEFT
        ========================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            w-[500px]
            h-[500px]
            bg-blue-500/10
            blur-[120px]
            rounded-full
            z-0
          "
        ></div>

        {/* ==========================================
            SIDEBAR
        ========================================== */}

        <aside
          className="
            hidden
            lg:flex
            w-80
            min-h-screen
            border-r
            border-white/10
            bg-white/5
            backdrop-blur-2xl
            flex-col
            p-6
            relative
            z-20
          "
        >

          {/* ==========================================
              LOGO AREA
          ========================================== */}

          <div
            className="
              mb-12
            "
          >

            {/* LOGO */}

            <div
              className="
                flex
                items-center
                gap-4
                mb-6
              "
            >

              <img
                src="/images/logo1.png"
                alt="Logo"

                className="
                  w-14
                  h-14
                  object-contain
                "
              />

              <div>

                <h1
                  className="
                    text-2xl
                    font-black
                  "
                >

                  J&K Admin

                </h1>

                <p
                  className="
                    text-sm
                    text-gray-400
                  "
                >

                  Management Dashboard

                </p>

              </div>

            </div>

            {/* STATUS */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-green-500/10
                border
                border-green-500/20
                rounded-full
                px-4
                py-2
              "
            >

              <div
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                  animate-pulse
                "
              ></div>

              <span
                className="
                  text-green-300
                  text-sm
                "
              >

                System Online

              </span>

            </div>

          </div>

          {/* ==========================================
              NAVIGATION
          ========================================== */}

          <div
            className="
              flex
              flex-col
              gap-3
            "
          >

            {navItems.map(
              (item) => {

                const Icon =
                  item.icon;

                return (

                  <motion.button

                    key={item.id}

                    whileHover={{
                      x: 5,
                    }}

                    whileTap={{
                      scale: 0.98,
                    }}

                    onClick={() =>
                      setActiveTab(
                        item.id
                      )
                    }

                    className={`
                      relative
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-2xl
                      transition-all
                      duration-300
                      text-left

                      ${
                        activeTab ===
                        item.id

                          ? `
                            bg-yellow-500
                            text-black
                            shadow-[0_10px_40px_rgba(234,179,8,0.25)]
                          `

                          : `
                            bg-white/5
                            hover:bg-white/10
                            text-white
                          `
                      }
                    `}
                  >

                    <Icon
                      size={22}
                    />

                    <span
                      className="
                        font-semibold
                      "
                    >

                      {item.label}

                    </span>

                  </motion.button>

                );
              }
            )}

          </div>

          {/* ==========================================
              LOGOUT
          ========================================== */}

          <div
            className="
              mt-auto
              pt-10
            "
          >

            <motion.button

              whileHover={{
                scale: 1.02,
              }}

              whileTap={{
                scale: 0.98,
              }}

              onClick={async () => {

                await logout();

                window.location.href =
                  "/admin";
              }}

              className="
                w-full
                flex
                items-center
                justify-center
                gap-3
                bg-red-500
                hover:bg-red-600
                py-4
                rounded-2xl
                font-bold
                transition
                shadow-[0_10px_40px_rgba(239,68,68,0.25)]
              "
            >

              <LogOut
                size={20}
              />

              Logout

            </motion.button>

          </div>

        </aside>

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}
        <section
          className="
            flex-1
            relative
            z-10
            overflow-visible
          "
        >

          {/* ==========================================
              TOP HEADER
          ========================================== */}

          <header
            className="
              sticky
              top-0
              z-30
              border-b
              border-white/10
              bg-black/40
              backdrop-blur-2xl
            "
          >

            <div
              className="
                px-8
                py-6
                flex
                items-center
                justify-between
              "
            >

              {/* LEFT */}

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-yellow-500/10
                    border
                    border-yellow-500/20
                    rounded-full
                    px-4
                    py-2
                    mb-4
                  "
                >

                  <Sparkles
                    size={16}
                    className="
                      text-yellow-400
                    "
                  />

                  <span
                    className="
                      text-yellow-300
                      text-sm
                      font-semibold
                    "
                  >

                    Admin Control Center

                  </span>

                </div>

                <h2
                  className="
                    text-4xl
                    font-black
                  "
                >

                  {
                    currentPage?.label
                  }

                </h2>

              </div>

              {/* RIGHT */}

              <div
                className="
                  hidden
                  md:flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-3
                    text-gray-300
                    text-sm
                  "
                >

                  Welcome Back, Admin

                </div>

              </div>

            </div>

          </header>

          {/* ==========================================
              CONTENT WRAPPER
          ========================================== */}

          <div
            className="
              p-8
            "
          >

            <AnimatePresence
              mode="wait"
            >

              <motion.div

                key={activeTab}

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                  y: -20,
                }}

                transition={{
                  duration: 0.3,
                }}
              >

                {/* ==========================================
                    DASHBOARD
                ========================================== */}

                {activeTab ===
                  "dashboard" && (

                  <DashboardStats />

                )}

                {/* ==========================================
                    SERVICE REQUESTS
                ========================================== */}

                {activeTab ===
                  "requests" && (

                  <ServiceRequests />

                )}

                {/* ==========================================
                    FEEDBACKS
                ========================================== */}

                {activeTab ===
                  "feedbacks" && (

                  <FeedbackManagement />

                )}

                {/* ==========================================
                    SERVICES
                ========================================== */}

                {activeTab ===
                  "services" && (

                  <ServiceManagement />

                )}

                {/* ==========================================
                    PORTFOLIO CATEGORIES
                ========================================== */}

                {activeTab ===
                  "portfolio" && (

                  <PortfolioManagement />

                )}

                {/* ==========================================
                    PORTFOLIO ITEMS
                ========================================== */}

                {activeTab ===
                  "portfolioItems" && (

                  <PortfolioItemsManagement />

                )}

              </motion.div>

            </AnimatePresence>

          </div>

        </section>

      </main>

    </ProtectedAdmin>
  );
}