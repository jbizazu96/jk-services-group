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
} from "framer-motion";

/* =========================================
   ICONS
========================================= */

import {

  MessageSquareMore,
  Clock3,
  Star,
  BriefcaseBusiness,
  Sparkles,
  FolderKanban,
  Layers3,
  Activity,
  TrendingUp,
  Film,
  BarChart3,
  Rocket,
  CheckCircle2,
  FolderOpen,
  Workflow,
  UploadCloud,
  Eye,

} from "lucide-react";

/* =========================================
   FIRESTORE
========================================= */

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/* =========================================
   COMPONENT
========================================= */

export default function DashboardStats() {

  /* =========================================
     STATE
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({

      /* FEEDBACKS */
      totalFeedbacks: 0,
      approvedFeedbacks: 0,
      pendingFeedbacks: 0,
      averageRating: 0,

      /* SERVICES */
      totalServices: 0,
      activeServices: 0,
      featuredServices: 0,
      inactiveServices: 0,

      /* PORTFOLIO */
      totalPortfolioCategories: 0,
      activePortfolioCategories: 0,
      featuredPortfolioCategories: 0,
      inactivePortfolioCategories: 0,

      totalPortfolioItems: 0,
      featuredPortfolioItems: 0,
      activePortfolioItems: 0,
      videoPortfolioItems: 0,

      /* REQUESTS */
      totalRequests: 0,
      pendingRequests: 0,
      reviewingRequests: 0,
      completedRequests: 0,
      totalUploads: 0,
    });

  /* =========================================
     LOAD DASHBOARD DATA
  ========================================= */

  useEffect(() => {

    loadStats();

  }, []);

  const loadStats = async () => {

    try {

      setLoading(true);

      /* =====================================
          PARALLEL REQUESTS
      ===================================== */

      const [

        feedbackSnapshot,
        serviceSnapshot,
        portfolioSnapshot,
        portfolioItemsSnapshot,
        requestsSnapshot,

      ] = await Promise.all([

        getDocs(
          collection(db, "feedbacks")
        ),

        getDocs(
          collection(db, "services")
        ),

        getDocs(
          collection(
            db,
            "portfolioCategories"
          )
        ),

        getDocs(
          collection(
            db,
            "portfolioItems"
          )
        ),

        getDocs(
          collection(
            db,
            "serviceRequests"
          )
        ),

      ]);

      /* =====================================
          FEEDBACKS
      ===================================== */

      const feedbacks =
        feedbackSnapshot.docs.map(
          (doc) => doc.data()
        );

      const totalFeedbacks =
        feedbacks.length;

      const approvedFeedbacks =
        feedbacks.filter(
          (item) => item.approved
        ).length;

      const pendingFeedbacks =
        feedbacks.filter(
          (item) => !item.approved
        ).length;

      const averageRating =
        feedbacks.length > 0
          ? (
              feedbacks.reduce(
                (sum, item) =>
                  sum +
                  (item.rating || 0),
                0
              ) /
              feedbacks.length
            ).toFixed(1)
          : "0.0";

      /* =====================================
          SERVICES
      ===================================== */

      const services =
        serviceSnapshot.docs.map(
          (doc) => doc.data()
        );

      const totalServices =
        services.length;

      const activeServices =
        services.filter(
          (item) => item.active
        ).length;

      const featuredServices =
        services.filter(
          (item) => item.featured
        ).length;

      const inactiveServices =
        services.filter(
          (item) => !item.active
        ).length;

      /* =====================================
          PORTFOLIO CATEGORIES
      ===================================== */

      const portfolioCategories =
        portfolioSnapshot.docs.map(
          (doc) => doc.data()
        );

      const totalPortfolioCategories =
        portfolioCategories.length;

      const activePortfolioCategories =
        portfolioCategories.filter(
          (item) => item.active
        ).length;

      const featuredPortfolioCategories =
        portfolioCategories.filter(
          (item) => item.featured
        ).length;

      const inactivePortfolioCategories =
        portfolioCategories.filter(
          (item) => !item.active
        ).length;

      /* =====================================
          PORTFOLIO ITEMS
      ===================================== */

      const portfolioItems =
        portfolioItemsSnapshot.docs.map(
          (doc) => doc.data()
        );

      const totalPortfolioItems =
        portfolioItems.length;

      const featuredPortfolioItems =
        portfolioItems.filter(
          (item) => item.featured
        ).length;

      const activePortfolioItems =
        portfolioItems.filter(
          (item) => item.active
        ).length;

      const videoPortfolioItems =
        portfolioItems.filter(
          (item) =>
            item.mediaType === "video"
        ).length;

      /* =====================================
          SERVICE REQUESTS
      ===================================== */

      const requests =
        requestsSnapshot.docs.map(
          (doc) => doc.data()
        );

      const totalRequests =
        requests.length;

      const pendingRequests =
        requests.filter(
          (item) =>
            !item.status ||
            item.status === "pending"
        ).length;

      const reviewingRequests =
        requests.filter(
          (item) =>
            item.status === "reviewing"
        ).length;

      const completedRequests =
        requests.filter(
          (item) =>
            item.status === "completed"
        ).length;

      const totalUploads =
        requests.reduce(
          (sum, item) =>
            sum +
            (item.uploads?.length || 0),
          0
        );

      /* =====================================
          UPDATE STATE
      ===================================== */

      setStats({

        /* FEEDBACKS */
        totalFeedbacks,
        approvedFeedbacks,
        pendingFeedbacks,
        averageRating,

        /* SERVICES */
        totalServices,
        activeServices,
        featuredServices,
        inactiveServices,

        /* PORTFOLIO */
        totalPortfolioCategories,
        activePortfolioCategories,
        featuredPortfolioCategories,
        inactivePortfolioCategories,

        totalPortfolioItems,
        featuredPortfolioItems,
        activePortfolioItems,
        videoPortfolioItems,

        /* REQUESTS */
        totalRequests,
        pendingRequests,
        reviewingRequests,
        completedRequests,
        totalUploads,
      });

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  /* =========================================
     PLATFORM HEALTH
  ========================================= */

  const healthScore = useMemo(() => {

    const score = (

      stats.activeServices +

      stats.approvedFeedbacks +

      stats.activePortfolioItems +

      stats.completedRequests +

      stats.reviewingRequests

    ) * 4;

    return Math.min(score, 100);

  }, [stats]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <div
        className="
          flex
          items-center
          justify-center
          py-32
        "
      >

        <div
          className="
            h-14
            w-14
            rounded-full
            border-4
            border-white/10
            border-t-cyan-400
            animate-spin
          "
        />

      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="
      relative
      overflow-hidden
      rounded-[40px]
      border
      border-white/10
      bg-[#050505]
      p-6
      md:p-8
      text-white
    ">

      {/* =====================================
          BACKGROUND EFFECTS
      ===================================== */}

      <div className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      ">

        <div className="
          absolute
          left-0
          top-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-500/10
          blur-3xl
        " />

        <div className="
          absolute
          bottom-0
          right-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-purple-500/10
          blur-3xl
        " />

        <div className="
          absolute
          left-1/2
          top-1/2
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/5
          blur-3xl
        " />
      </div>

      <div className="relative z-10">

        {/* =====================================
            HERO HEADER
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-12"
        >

          {/* BADGE */}

          <div className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.03]
            px-5
            py-3
            text-sm
            text-zinc-300
            backdrop-blur-md
          ">

            <Sparkles size={16} />

            J&K Services Group Intelligence Center

          </div>

          <div className="
            flex
            flex-col
            gap-8
            xl:flex-row
            xl:items-end
            xl:justify-between
          ">

            {/* LEFT */}

            <div>

              <h1 className="
                max-w-5xl
                text-5xl
                font-black
                leading-tight
                tracking-tight
                md:text-7xl
              ">

                
                {" "}

                <span className="
                  bg-gradient-to-r
                  from-blue-400
                  via-cyan-400
                  to-purple-400
                  bg-clip-text
                  text-transparent
                ">

                  Dashboard

                </span>

              </h1>

              <p className="
                mt-6
                max-w-4xl
                text-lg
                leading-relaxed
                text-zinc-400
                md:text-xl
              ">

                Real-time luxury business intelligence,
                service request workflow monitoring,
                portfolio analytics and premium platform insights.

              </p>
            </div>

            {/* HEALTH */}

            <div className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
              p-8
              backdrop-blur-xl
            ">

              <div className="
                flex
                items-center
                gap-3
                text-zinc-400
              ">

                <Rocket size={18} />

                Platform Health

              </div>

              <div className="
                mt-5
                flex
                items-end
                gap-3
              ">

                <h2 className="
                  text-6xl
                  font-black
                ">

                  {healthScore}

                </h2>

                <span className="
                  mb-2
                  text-zinc-500
                ">

                  /100

                </span>
              </div>

              <div className="
                mt-5
                h-3
                overflow-hidden
                rounded-full
                bg-white/5
              ">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-blue-500
                    via-cyan-400
                    to-purple-500
                  "
                  style={{
                    width: `${healthScore}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================
            QUICK METRICS
        ===================================== */}

        <div className="
          mb-12
          grid
          grid-cols-2
          gap-5
          xl:grid-cols-5
        ">

          <PremiumStatCard
            icon={
              <FolderOpen size={24} />
            }
            title="Requests"
            value={stats.totalRequests}
            subtitle="Client Pipeline"
          />

          <PremiumStatCard
            icon={
              <MessageSquareMore size={24} />
            }
            title="Feedbacks"
            value={stats.totalFeedbacks}
            subtitle="Customer Reviews"
          />

          <PremiumStatCard
            icon={
              <BriefcaseBusiness size={24} />
            }
            title="Services"
            value={stats.totalServices}
            subtitle="Business Offerings"
          />

          <PremiumStatCard
            icon={
              <FolderKanban size={24} />
            }
            title="Categories"
            value={stats.totalPortfolioCategories}
            subtitle="Portfolio Systems"
          />

          <PremiumStatCard
            icon={
              <Film size={24} />
            }
            title="Portfolio Items"
            value={stats.totalPortfolioItems}
            subtitle="Media Showcase"
          />

        </div>

        {/* =====================================
            ANALYTICS GRID
        ===================================== */}

        <div className="
          grid
          grid-cols-1
          gap-8
          2xl:grid-cols-4
        ">

          {/* REQUESTS */}

          <AnalyticsPanel
            title="Client Intake Intelligence"
            icon={
              <Workflow size={20} />
            }
          >

            <AnalyticsRow
              label="Pending Requests"
              value={stats.pendingRequests}
              color="yellow"
            />

            <AnalyticsRow
              label="Reviewing Requests"
              value={stats.reviewingRequests}
              color="blue"
            />

            <AnalyticsRow
              label="Completed Requests"
              value={stats.completedRequests}
              color="green"
            />

            <AnalyticsRow
              label="Uploaded Assets"
              value={stats.totalUploads}
              color="purple"
            />

          </AnalyticsPanel>

          {/* FEEDBACKS */}

          <AnalyticsPanel
            title="Feedback Analytics"
            icon={
              <Star size={20} />
            }
          >

            <AnalyticsRow
              label="Approved Reviews"
              value={stats.approvedFeedbacks}
              color="green"
            />

            <AnalyticsRow
              label="Pending Reviews"
              value={stats.pendingFeedbacks}
              color="yellow"
            />

            <AnalyticsRow
              label="Average Rating"
              value={`⭐ ${stats.averageRating}`}
              color="blue"
            />

          </AnalyticsPanel>

          {/* SERVICES */}

          <AnalyticsPanel
            title="Services Intelligence"
            icon={
              <Layers3 size={20} />
            }
          >

            <AnalyticsRow
              label="Active Services"
              value={stats.activeServices}
              color="green"
            />

            <AnalyticsRow
              label="Featured Services"
              value={stats.featuredServices}
              color="yellow"
            />

            <AnalyticsRow
              label="Inactive Services"
              value={stats.inactiveServices}
              color="red"
            />

          </AnalyticsPanel>

          {/* PORTFOLIO */}

          <AnalyticsPanel
            title="Portfolio Intelligence"
            icon={
              <BarChart3 size={20} />
            }
          >

            <AnalyticsRow
              label="Featured Categories"
              value={stats.featuredPortfolioCategories}
              color="yellow"
            />

            <AnalyticsRow
              label="Active Portfolio Items"
              value={stats.activePortfolioItems}
              color="green"
            />

            <AnalyticsRow
              label="Video Content"
              value={stats.videoPortfolioItems}
              color="blue"
            />

          </AnalyticsPanel>

        </div>

        {/* =====================================
            LOWER PANELS
        ===================================== */}

        <div className="
          mt-10
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-3
        ">

          {/* PERFORMANCE */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
              p-8
              backdrop-blur-xl
            "
          >

            <div className="
              mb-8
              flex
              items-center
              gap-3
            ">

              <div className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-500/10
                text-blue-400
              ">

                <TrendingUp size={24} />

              </div>

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">

                  Platform Performance

                </h3>

                <p className="text-zinc-500">
                  Overall system growth metrics.
                </p>

              </div>
            </div>

            <div className="space-y-6">

              <ProgressRow
                label="Customer Satisfaction"
                value={95}
              />

              <ProgressRow
                label="Service Activity"
                value={91}
              />

              <ProgressRow
                label="Client Intake Workflow"
                value={88}
              />

            </div>

          </motion.div>

          {/* REQUEST PIPELINE */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
            }}
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
              p-8
              backdrop-blur-xl
            "
          >

            <div className="
              mb-8
              flex
              items-center
              gap-3
            ">

              <div className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-purple-500/10
                text-purple-400
              ">

                <UploadCloud size={24} />

              </div>

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">

                  Request Pipeline

                </h3>

                <p className="text-zinc-500">
                  Real-time intake monitoring.
                </p>

              </div>
            </div>

            <div className="space-y-5">

              <StatusItem
                label="Client Portal"
                status="Online"
                color="green"
              />

              <StatusItem
                label="Upload Engine"
                status="Running"
                color="blue"
              />

              <StatusItem
                label="Request Workflow"
                status="Stable"
                color="purple"
              />

              <StatusItem
                label="Storage Pipeline"
                status="Operational"
                color="cyan"
              />

            </div>

          </motion.div>

          {/* LIVE STATUS */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
              p-8
              backdrop-blur-xl
            "
          >

            <div className="
              mb-8
              flex
              items-center
              gap-3
            ">

              <div className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-green-500/10
                text-green-400
              ">

                <Activity size={24} />

              </div>

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">

                  Live Status Center

                </h3>

                <p className="text-zinc-500">
                  Real-time platform monitoring.
                </p>

              </div>
            </div>

            <div className="space-y-5">

              <StatusItem
                label="Firebase Services"
                status="Operational"
                color="green"
              />

              <StatusItem
                label="Portfolio Engine"
                status="Online"
                color="blue"
              />

              <StatusItem
                label="Service Requests"
                status="Running"
                color="purple"
              />

              <StatusItem
                label="Dashboard Analytics"
                status="Stable"
                color="cyan"
              />

            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}

/* =========================================
   PREMIUM STAT CARD
========================================= */

function PremiumStatCard({
  icon,
  title,
  value,
  subtitle,
}) {

  return (

    <motion.div
      whileHover={{
        y: -5,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-xl
      "
    >

      <div className="
        absolute
        inset-0
        bg-gradient-to-br
        from-white/[0.04]
        to-transparent
        opacity-0
        transition
        group-hover:opacity-100
      " />

      <div className="relative z-10">

        <div className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-3xl
          bg-white/[0.04]
          text-blue-400
        ">

          {icon}

        </div>

        <p className="
          mt-6
          text-sm
          text-zinc-500
        ">

          {title}

        </p>

        <h2 className="
          mt-2
          text-5xl
          font-black
          tracking-tight
        ">

          {value}

        </h2>

        <p className="
          mt-2
          text-sm
          text-zinc-500
        ">

          {subtitle}

        </p>

      </div>

    </motion.div>
  );
}

/* =========================================
   ANALYTICS PANEL
========================================= */

function AnalyticsPanel({
  title,
  icon,
  children,
}) {

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-[32px]
        border
        border-white/10
        bg-white/[0.03]
        p-8
        backdrop-blur-xl
      "
    >

      <div className="
        mb-8
        flex
        items-center
        gap-4
      ">

        <div className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-white/[0.04]
          text-blue-400
        ">

          {icon}

        </div>

        <div>

          <h3 className="
            text-2xl
            font-bold
          ">

            {title}

          </h3>

          <p className="text-zinc-500">
            Real-time insights
          </p>

        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>

    </motion.div>
  );
}

/* =========================================
   ANALYTICS ROW
========================================= */

function AnalyticsRow({
  label,
  value,
  color,
}) {

  const colors = {

    green:
      "bg-green-500/10 text-green-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    red:
      "bg-red-500/10 text-red-400",

    blue:
      "bg-blue-500/10 text-blue-400",

    purple:
      "bg-purple-500/10 text-purple-400",
  };

  return (

    <div className="
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-white/10
      bg-white/[0.02]
      px-5
      py-4
    ">

      <p className="text-zinc-400">
        {label}
      </p>

      <div className={`
        rounded-full
        px-4
        py-2
        font-semibold
        ${colors[color]}
      `}>

        {value}

      </div>

    </div>
  );
}

/* =========================================
   PROGRESS ROW
========================================= */

function ProgressRow({
  label,
  value,
}) {

  return (

    <div>

      <div className="
        mb-3
        flex
        items-center
        justify-between
      ">

        <p className="text-zinc-400">
          {label}
        </p>

        <p className="
          font-semibold
          text-white
        ">

          {value}%

        </p>

      </div>

      <div className="
        h-3
        overflow-hidden
        rounded-full
        bg-white/5
      ">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-blue-500
            via-cyan-400
            to-purple-500
          "
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================
   STATUS ITEM
========================================= */

function StatusItem({
  label,
  status,
  color,
}) {

  const colors = {

    green:
      "bg-green-400",

    blue:
      "bg-blue-400",

    purple:
      "bg-purple-400",

    cyan:
      "bg-cyan-400",
  };

  return (

    <div className="
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-white/10
      bg-white/[0.02]
      px-5
      py-4
    ">

      <div className="
        flex
        items-center
        gap-3
      ">

        <div className={`
          h-3
          w-3
          rounded-full
          ${colors[color]}
        `} />

        <p className="text-zinc-300">
          {label}
        </p>

      </div>

      <div className="
        flex
        items-center
        gap-2
        text-green-400
      ">

        <CheckCircle2 size={16} />

        {status}

      </div>

    </div>
  );
}