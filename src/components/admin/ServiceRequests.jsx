"use client";

/*
|--------------------------------------------------------------------------
| CINEMATIC SERVICE REQUESTS V3
|--------------------------------------------------------------------------
|
| FILE:
| /components/admin/ServiceRequests.jsx
|
| PREMIUM FEATURES:
| - Cinematic Dashboard UI
| - Atmospheric Glow System
| - Premium Stats
| - Search + Filters
| - Glassmorphism Cards
| - Luxury Modal
| - Uploaded Files Gallery
| - Mobile Optimized
| - Enterprise Layout
|
|--------------------------------------------------------------------------
*/

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {

  Search,
  FolderOpen,
  Calendar,
  MapPin,
  Clock3,
  Mail,
  Phone,
  User,
  X,
  Sparkles,
  CheckCircle2,
  Loader2,
  Eye,
  Briefcase,
  ImageIcon,

} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function ServiceRequests() {

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [requests, setRequests] =
    useState([]);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  /*
  |--------------------------------------------------------------------------
  | FETCH REQUESTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const q = query(
      collection(db, "serviceRequests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setRequests(data);

        setLoading(false);
      });

    return () => unsubscribe();

  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERED REQUESTS
  |--------------------------------------------------------------------------
  */

  const filteredRequests = useMemo(() => {

    return requests.filter((request) => {

      const matchesSearch =

        request.customerName
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        request.serviceType
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        request.city
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =

        statusFilter === "all"

          ? true

          : request.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  }, [
    requests,
    search,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const totalRequests =
    requests.length;

  const pendingRequests =
    requests.filter(
      (r) =>
        !r.status ||
        r.status === "pending"
    ).length;

  const reviewingRequests =
    requests.filter(
      (r) =>
        r.status === "reviewing"
    ).length;

  const completedRequests =
    requests.filter(
      (r) =>
        r.status === "completed"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | STATUS STYLES
  |--------------------------------------------------------------------------
  */

  const getStatusStyles = (status) => {

    switch (status) {

      case "reviewing":
        return `
          bg-amber-500/15
          text-amber-300
          border-amber-500/20
        `;

      case "approved":
        return `
          bg-green-500/15
          text-green-300
          border-green-500/20
        `;

      case "completed":
        return `
          bg-emerald-500/15
          text-emerald-300
          border-emerald-500/20
        `;

      case "quoted":
        return `
          bg-purple-500/15
          text-purple-300
          border-purple-500/20
        `;

      default:
        return `
          bg-blue-500/15
          text-blue-300
          border-blue-500/20
        `;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

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

        <Loader2
          className="
            h-10
            w-10
            animate-spin
            text-yellow-400
          "
        />

      </div>
    );
  }

  return (
    <div className="relative">

      {/* GLOW */}
      <div
        className="
          absolute
          top-0
          right-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-yellow-500/10
          blur-[120px]
          pointer-events-none
        "
      ></div>

      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-8
          mb-12
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
              mb-5
            "
          >

            <Sparkles
              className="
                h-4
                w-4
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

              Client Intake Pipeline

            </span>

          </div>

          <h2
            className="
              text-5xl
              font-black
              leading-tight
            "
          >

            Service Requests

          </h2>

          <p
            className="
              text-gray-400
              text-lg
              mt-4
              max-w-2xl
            "
          >

            Manage incoming luxury client
            requests, uploaded assets,
            project details, and workflows.

          </p>

        </div>

        {/* SEARCH */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
          "
        >

          {/* SEARCH */}
          <div
            className="
              relative
              w-full
              md:w-[320px]
            "
          >

            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                h-5
                w-5
                text-gray-500
              "
            />

            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                py-4
                pl-12
                pr-4
                text-white
                outline-none
                placeholder:text-gray-500
                focus:border-yellow-500/30
              "
            />
          </div>

          {/* FILTER */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              px-5
              py-4
              text-white
              outline-none
            "
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="reviewing">
              Reviewing
            </option>

            <option value="quoted">
              Quoted
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="completed">
              Completed
            </option>

          </select>
        </div>
      </div>

      {/* STATS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-12
        "
      >

        <StatCard
          title="Total Requests"
          value={totalRequests}
          icon={
            <FolderOpen
              className="
                h-6
                w-6
              "
            />
          }
        />

        <StatCard
          title="Pending"
          value={pendingRequests}
          icon={
            <Clock3
              className="
                h-6
                w-6
              "
            />
          }
        />

        <StatCard
          title="Reviewing"
          value={reviewingRequests}
          icon={
            <Eye
              className="
                h-6
                w-6
              "
            />
          }
        />

        <StatCard
          title="Completed"
          value={completedRequests}
          icon={
            <CheckCircle2
              className="
                h-6
                w-6
              "
            />
          }
        />

      </div>

      {/* EMPTY */}
      {filteredRequests.length === 0 && (

        <div
          className="
            rounded-[32px]
            border
            border-white/10
            bg-white/5
            backdrop-blur-2xl
            p-20
            text-center
          "
        >

          <FolderOpen
            className="
              h-16
              w-16
              text-yellow-400
              mx-auto
              mb-6
            "
          />

          <h3
            className="
              text-3xl
              font-bold
              mb-4
            "
          >

            No Requests Found

          </h3>

          <p
            className="
              text-gray-400
              text-lg
            "
          >

            Incoming client requests
            will appear here.

          </p>

        </div>
      )}

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-3
          gap-6
        "
      >

        {filteredRequests.map(
          (request, index) => (

            <motion.div

              key={request.id}

              initial={{
                opacity: 0,
                y: 30,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay: index * 0.04,
              }}

              whileHover={{
                y: -6,
              }}

              onClick={() =>
                setSelectedRequest(request)
              }

              className="
                group
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-7
                cursor-pointer
                transition-all
                duration-500
                hover:border-yellow-500/20
                hover:bg-white/[0.07]
                hover:shadow-[0_20px_80px_rgba(234,179,8,0.12)]
              "
            >

              {/* GLOW */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-yellow-500/[0.03]
                  via-transparent
                  to-transparent
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                "
              ></div>

              {/* TOP */}
              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                  mb-8
                "
              >

                <div>

                  {/* STATUS */}
                  <div className={`
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    capitalize
                    ${getStatusStyles(
                      request.status
                    )}
                  `}>

                    {request.status ||
                      "pending"}

                  </div>

                  {/* SERVICE */}
                  <h3
                    className="
                      text-3xl
                      font-black
                      mt-5
                      leading-tight
                    "
                  >

                    {request.serviceType}

                  </h3>

                </div>

                {/* ICON */}
                <div
                  className="
                    rounded-2xl
                    bg-yellow-500/10
                    border
                    border-yellow-500/10
                    p-4
                    text-yellow-400
                  "
                >

                  <Briefcase
                    className="
                      h-6
                      w-6
                    "
                  />

                </div>
              </div>

              {/* CUSTOMER */}
              <div className="relative">

                <p
                  className="
                    text-2xl
                    font-bold
                    mb-4
                  "
                >

                  {request.customerName}

                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-400
                    mb-3
                  "
                >

                  <MapPin
                    className="
                      h-4
                      w-4
                    "
                  />

                  <span>

                    {request.city ||
                      "Unknown"}

                    {request.state
                      ? `, ${request.state}`
                      : ""}

                  </span>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-400
                  "
                >

                  <Calendar
                    className="
                      h-4
                      w-4
                    "
                  />

                  <span>

                    {request.createdAt
                      ?.seconds

                      ? new Date(
                          request.createdAt.seconds * 1000
                        ).toLocaleDateString()

                      : "Recently"}

                  </span>

                </div>

              </div>

              {/* FOOTER */}
              <div
                className="
                  relative
                  mt-8
                  pt-6
                  border-t
                  border-white/10
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-gray-500
                      text-sm
                      mb-1
                    "
                  >

                    Uploaded Files

                  </p>

                  <p
                    className="
                      text-xl
                      font-bold
                    "
                  >

                    {request.uploads
                      ?.length || 0}

                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    px-5
                    py-3
                    text-sm
                    font-semibold
                  "
                >

                  View Request

                </div>

              </div>

            </motion.div>
          )
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>

        {selectedRequest && (

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            className="
              fixed
              inset-0
              z-50
              bg-black/70
              backdrop-blur-xl
              overflow-y-auto
              p-6
            "
          >

            <div
              className="
                min-h-screen
                flex
                items-center
                justify-center
              "
            >

              {/* MODAL */}
              <motion.div

                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}

                className="
                  relative
                  w-full
                  max-w-7xl
                  rounded-[40px]
                  border
                  border-white/10
                  bg-[#0a0a0a]
                  overflow-hidden
                  shadow-[0_40px_120px_rgba(0,0,0,0.5)]
                "
              >

                {/* GLOW */}
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    h-[400px]
                    w-[400px]
                    rounded-full
                    bg-yellow-500/10
                    blur-[120px]
                  "
                ></div>

                {/* CLOSE */}
                <button
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                  className="
                    absolute
                    top-8
                    right-8
                    z-20
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    text-white
                    hover:bg-white/10
                  "
                >

                  <X
                    className="
                      h-5
                      w-5
                    "
                  />

                </button>

                {/* CONTENT */}
                <div
                  className="
                    relative
                    z-10
                    p-10
                    lg:p-14
                  "
                >

                  {/* TOP */}
                  <div className="mb-14">

                    <div className={`
                      inline-flex
                      items-center
                      rounded-full
                      border
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      capitalize
                      mb-6
                      ${getStatusStyles(
                        selectedRequest.status
                      )}
                    `}>

                      {selectedRequest.status ||
                        "pending"}

                    </div>

                    <h2
                      className="
                        text-6xl
                        font-black
                        leading-tight
                      "
                    >

                      {
                        selectedRequest.serviceType
                      }

                    </h2>

                    <p
                      className="
                        text-gray-400
                        text-lg
                        mt-6
                      "
                    >

                      Request ID:
                      {" "}
                      {
                        selectedRequest.requestId
                      }

                    </p>

                  </div>

                  {/* GRID */}
                  <div
                    className="
                      grid
                      grid-cols-1
                      xl:grid-cols-2
                      gap-10
                    "
                  >

                    {/* CLIENT INFO */}
                    <div>

                      <SectionTitle
                        title="Client Information"
                      />

                      <InfoCard
                        icon={
                          <User className="h-5 w-5" />
                        }
                        label="Customer"
                        value={
                          selectedRequest.customerName
                        }
                      />

                      <InfoCard
                        icon={
                          <Mail className="h-5 w-5" />
                        }
                        label="Email"
                        value={
                          selectedRequest.email
                        }
                      />

                      <InfoCard
                        icon={
                          <Phone className="h-5 w-5" />
                        }
                        label="Phone"
                        value={
                          selectedRequest.phone
                        }
                      />

                      <InfoCard
                        icon={
                          <MapPin className="h-5 w-5" />
                        }
                        label="Location"
                        value={`
                          ${selectedRequest.city || ""}
                          ${selectedRequest.state
                            ? `, ${selectedRequest.state}`
                            : ""}
                        `}
                      />

                    </div>

                    {/* PROJECT DETAILS */}
                    <div>

                      <SectionTitle
                        title="Project Details"
                      />

                      <div
                        className="
                          rounded-[32px]
                          border
                          border-white/10
                          bg-white/5
                          backdrop-blur-xl
                          p-8
                        "
                      >

                        <p
                          className="
                            whitespace-pre-wrap
                            text-gray-300
                            leading-relaxed
                            text-lg
                          "
                        >

                          {
                            selectedRequest.description
                            ||
                            "No description provided."
                          }

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* FILES */}
                  <div className="mt-16">

                    <SectionTitle
                      title="Uploaded Assets"
                    />

                    {selectedRequest.uploads
                      ?.length > 0 ? (

                      <div
                        className="
                          grid
                          grid-cols-1
                          md:grid-cols-2
                          xl:grid-cols-3
                          gap-6
                        "
                      >

                        {selectedRequest.uploads.map(
                          (file, index) => (

                            <a

                              key={index}

                              href={file.url}

                              target="_blank"

                              rel="noreferrer"

                              className="
                                group
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-white/10
                                bg-white/5
                                backdrop-blur-xl
                                transition-all
                                duration-500
                                hover:border-yellow-500/20
                                hover:-translate-y-1
                              "
                            >

                              {/* IMAGE */}
                              {file.type?.startsWith(
                                "image/"
                              ) ? (

                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="
                                    h-[260px]
                                    w-full
                                    object-cover
                                  "
                                />

                              ) : (

                                <div
                                  className="
                                    flex
                                    h-[260px]
                                    items-center
                                    justify-center
                                    bg-black/20
                                  "
                                >

                                  <ImageIcon
                                    className="
                                      h-12
                                      w-12
                                      text-yellow-400
                                    "
                                  />

                                </div>
                              )}

                              {/* INFO */}
                              <div className="p-6">

                                <p
                                  className="
                                    truncate
                                    text-lg
                                    font-bold
                                  "
                                >

                                  {file.name}

                                </p>

                                <p
                                  className="
                                    text-gray-400
                                    mt-2
                                  "
                                >

                                  {(file.size / 1024 / 1024)
                                    .toFixed(2)} MB

                                </p>

                              </div>

                            </a>
                          )
                        )}

                      </div>

                    ) : (

                      <div
                        className="
                          rounded-[32px]
                          border
                          border-white/10
                          bg-white/5
                          p-14
                          text-center
                        "
                      >

                        <FolderOpen
                          className="
                            h-14
                            w-14
                            text-yellow-400
                            mx-auto
                            mb-5
                          "
                        />

                        <p
                          className="
                            text-gray-400
                            text-lg
                          "
                        >

                          No uploaded files.

                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </motion.div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  title,
  value,
  icon,
}) {

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-7
      "
    >

      {/* GLOW */}
      <div
        className="
          absolute
          top-0
          right-0
          h-32
          w-32
          rounded-full
          bg-yellow-500/10
          blur-[60px]
        "
      ></div>

      <div
        className="
          relative
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-gray-400
              text-sm
              mb-3
            "
          >

            {title}

          </p>

          <h3
            className="
              text-5xl
              font-black
            "
          >

            {value}

          </h3>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-yellow-500/20
            bg-yellow-500/10
            p-5
            text-yellow-400
          "
        >

          {icon}

        </div>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SECTION TITLE
|--------------------------------------------------------------------------
*/

function SectionTitle({
  title,
}) {

  return (
    <h3
      className="
        text-3xl
        font-black
        mb-8
      "
    >

      {title}

    </h3>
  );
}

/*
|--------------------------------------------------------------------------
| INFO CARD
|--------------------------------------------------------------------------
*/

function InfoCard({
  icon,
  label,
  value,
}) {

  return (
    <div
      className="
        flex
        items-start
        gap-5
        rounded-[28px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        mb-5
      "
    >

      <div
        className="
          rounded-2xl
          border
          border-yellow-500/20
          bg-yellow-500/10
          p-4
          text-yellow-400
        "
      >

        {icon}

      </div>

      <div>

        <p
          className="
            text-gray-500
            text-sm
            mb-2
          "
        >

          {label}

        </p>

        <p
          className="
            text-lg
            font-semibold
            text-white
          "
        >

          {value || "N/A"}

        </p>

      </div>

    </div>
  );
}