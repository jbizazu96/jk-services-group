
"use client";

/* =========================================================
   JKSERVICES V3 PREMIUM CRM
   FILE: /components/admin/ServiceRequests.jsx
   DESCRIPTION:
   Premium cinematic service requests dashboard
   with Firebase realtime sync + SaaS portal modal
========================================================= */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { toast } from "sonner";

import {
  Search,
  FolderOpen,
  Clock3,
  Sparkles,
  CheckCircle2,
  Loader2,
  Eye,
  ImageIcon,
  Save,
  Trash2,
  Download,
  X,
  BadgeCheck,
} from "lucide-react";

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
  "pending",
  "reviewing",
  "quoted",
  "approved",
  "in_progress",
  "completed",
  "cancelled",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ServiceRequests() {

  /* =====================================================
     STATES
  ===================================================== */

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

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  /* =====================================================
     FETCH REQUESTS
  ===================================================== */

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

  /* =====================================================
     FILTER REQUESTS
  ===================================================== */

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

  /* =====================================================
     STATS
  ===================================================== */

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

  /* =====================================================
     STATUS STYLES
  ===================================================== */

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

      case "cancelled":
        return `
          bg-red-500/15
          text-red-300
          border-red-500/20
        `;

      default:
        return `
          bg-blue-500/15
          text-blue-300
          border-blue-500/20
        `;
    }
  };

  /* =====================================================
     SAVE REQUEST
  ===================================================== */

  const handleSaveRequest =
    async () => {

      try {

        setSaving(true);

        const requestRef = doc(
          db,
          "serviceRequests",
          selectedRequest.id
        );

        await updateDoc(
          requestRef,
          {
            customerName:
              selectedRequest.customerName || "",

            email:
              selectedRequest.email || "",

            phone:
              selectedRequest.phone || "",

            serviceType:
              selectedRequest.serviceType || "",

            description:
              selectedRequest.description || "",

            status:
              selectedRequest.status || "pending",

            updatedAt:
              serverTimestamp(),
          }
        );

        toast.success(
          "Request updated successfully"
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to update request"
        );

      } finally {

        setSaving(false);
      }
    };

  /* =====================================================
     DELETE REQUEST
  ===================================================== */

  const handleDeleteRequest =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete this request permanently?"
        );

      if (!confirmDelete) return;

      try {

        setDeleting(true);

        await deleteDoc(
          doc(
            db,
            "serviceRequests",
            selectedRequest.id
          )
        );

        toast.success(
          "Request deleted successfully"
        );

        setSelectedRequest(null);

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to delete request"
        );

      } finally {

        setDeleting(false);
      }
    };

  /* =====================================================
     LOADING SCREEN
  ===================================================== */

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
    <>
      <div className="relative">

        {/* BACKGROUND GLOW */}

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
        />

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
              "
            >

              Service Requests

            </h2>

          </div>

          {/* SEARCH + FILTER */}

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
                  py-4
                  pl-12
                  pr-4
                  outline-none
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
                px-5
                py-4
                outline-none
              "
            >

              <option value="all">
                All Status
              </option>

              {STATUS_OPTIONS.map((status) => (

                <option
                  key={status}
                  value={status}
                >

                  {status}

                </option>

              ))}

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
            icon={<FolderOpen className="h-6 w-6" />}
          />

          <StatCard
            title="Pending"
            value={pendingRequests}
            icon={<Clock3 className="h-6 w-6" />}
          />

          <StatCard
            title="Reviewing"
            value={reviewingRequests}
            icon={<Eye className="h-6 w-6" />}
          />

          <StatCard
            title="Completed"
            value={completedRequests}
            icon={<CheckCircle2 className="h-6 w-6" />}
          />

        </div>

        {/* REQUEST GRID */}

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
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: index * 0.03,
                }}

                className="
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-2xl
                  p-7
                "
              >

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

                  {request.status || "pending"}

                </div>

                {/* TITLE */}

                <h3
                  className="
                    text-3xl font-black mb-8 text-white
                  "
                >

                  {request.serviceType}

                </h3>

                <p
                  className="
                    text-xl
                    font-semibold
                  "
                >

                  {request.customerName}

                </p>

                {/* FOOTER */}

                <div
                  className="
                    mt-6
                    pt-6
                    border-t
                    border-white/10
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <p className="text-gray-500 text-sm">

                      Uploaded Files

                    </p>

                    <p className="font-bold text-xl">

                      {request.uploads?.length || 0}

                    </p>

                  </div>

                  {/* VIEW BUTTON */}

                  <button
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-yellow-500/20
                      bg-yellow-500/10
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-yellow-300
                      hover:bg-yellow-500/20
                      transition-all
                    "
                  >

                    <Eye className="h-4 w-4" />

                    View Request

                  </button>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

      {/* =====================================================
         PORTAL MODAL
      ===================================================== */}

      {typeof window !== "undefined" &&
        createPortal(

          <AnimatePresence>

            {selectedRequest && (

              <motion.div

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                exit={{ opacity: 0 }}

                className="
                  fixed
                  inset-0
                  z-[999999]
                  bg-black/80
                  backdrop-blur-xl
                  overflow-y-auto
                  p-4
                  md:p-8
                "
              >

                {/* CENTER */}

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
                      y: 20,
                    }}

                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}

                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      y: 20,
                    }}

                    className="
                      relative
                      w-full
                      max-w-7xl
                      rounded-[40px]
                      border
                      border-white/10
                      bg-[#111111]
                      text-white
                      overflow-hidden
                    "
                  >

                    {/* CLOSE */}

                    <button
                      onClick={() =>
                        setSelectedRequest(null)
                      }
                      className="
                        absolute
                        top-6
                        right-6
                        z-50
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        p-4
                      "
                    >

                      <X className="h-5 w-5" />

                    </button>

                    {/* CONTENT */}

                    <div className="p-6 lg:p-14">

                      {/* HEADER */}

                      <div
                        className="
                          flex
                          flex-col
                          xl:flex-row
                          xl:items-center
                          xl:justify-between
                          gap-8
                          mb-14
                        "
                      >

                        <div>

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

                            {selectedRequest.status}

                          </div>

                          <h2
                            className="
                              text-5xl font-black text-white
                            "
                          >

                            {selectedRequest.serviceType}

                          </h2>

                        </div>

                        {/* ACTIONS */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-4
                          "
                        >

                          <button
                            onClick={
                              handleSaveRequest
                            }
                            disabled={saving}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-green-500/20
                              border
                              border-green-500/20
                              px-6
                              py-4
                              font-semibold
                              text-green-300
                            "
                          >

                            {saving ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Save className="h-5 w-5" />
                            )}

                            Save Changes

                          </button>

                          <button
                            onClick={
                              handleDeleteRequest
                            }
                            disabled={deleting}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-2xl
                              bg-red-500/20
                              border
                              border-red-500/20
                              px-6
                              py-4
                              font-semibold
                              text-red-300
                            "
                          >

                            {deleting ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}

                            Delete

                          </button>

                        </div>

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

                        {/* LEFT */}

                        <div>

                          <SectionTitle
                            title="Edit Request"
                          />

                          <InputField
                            label="Customer Name"
                            value={
                              selectedRequest.customerName || ""
                            }
                            onChange={(value) =>
                              setSelectedRequest({
                                ...selectedRequest,
                                customerName: value,
                              })
                            }
                          />

                          <InputField
                            label="Email"
                            value={
                              selectedRequest.email || ""
                            }
                            onChange={(value) =>
                              setSelectedRequest({
                                ...selectedRequest,
                                email: value,
                              })
                            }
                          />

                          <InputField
                            label="Phone"
                            value={
                              selectedRequest.phone || ""
                            }
                            onChange={(value) =>
                              setSelectedRequest({
                                ...selectedRequest,
                                phone: value,
                              })
                            }
                          />

                          <InputField
                            label="Service Type"
                            value={
                              selectedRequest.serviceType || ""
                            }
                            onChange={(value) =>
                              setSelectedRequest({
                                ...selectedRequest,
                                serviceType: value,
                              })
                            }
                          />

                          {/* STATUS */}

                          <div className="mb-6">

                            <label
                              className="
                                block
                                text-sm
                                font-semibold
                                text-gray-200
                                mb-3
                              "
                            >

                              Status

                            </label>

                            <select
                              value={
                                selectedRequest.status || "pending"
                              }
                              onChange={(e) =>
                                setSelectedRequest({
                                  ...selectedRequest,
                                  status: e.target.value,
                                })
                              }
                              className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                px-5
                                py-4
                                outline-none
                              "
                            >

                              {STATUS_OPTIONS.map((status) => (

                                <option
                                  key={status}
                                  value={status}
                                >

                                  {status}

                                </option>

                              ))}

                            </select>

                          </div>

                          {/* DESCRIPTION */}

                          <div>

                            <label
                              className="
                                block
                                text-sm
                                font-semibold
                                text-gray-200
                                mb-3
                              "
                            >

                              Description

                            </label>

                            <textarea
                              rows={8}
                              value={
                                selectedRequest.description || ""
                              }
                              onChange={(e) =>
                                setSelectedRequest({
                                  ...selectedRequest,
                                  description:
                                    e.target.value,
                                })
                              }
                              className="
                                w-full
                                rounded-[28px]
                                border
                                border-white/10
                                bg-[#1c1c1c]
                                border-white/20
                                text-white
                                placeholder:text-gray-500
                                px-5
                                py-5
                                outline-none
                                resize-none
                                transition-all
                                focus:border-yellow-500/40
                                focus:bg-[#1d1d1d]
                              "
                            />

                          </div>

                        </div>

                        {/* RIGHT */}

                        <div>

                          <SectionTitle
                            title="Uploaded Files"
                          />

                          {selectedRequest.uploads?.length > 0 ? (

                            <div
                              className="
                                grid
                                grid-cols-1
                                gap-6
                              "
                            >

                              {selectedRequest.uploads.map(
                                (file, index) => (

                                  <div

                                    key={index}

                                    className="
                                      rounded-[28px]
                                      border
                                      border-white/10
                                      bg-white/5
                                      overflow-hidden
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
                                          h-[240px]
                                          w-full
                                          object-cover
                                        "
                                      />

                                    ) : (

                                      <div
                                        className="
                                          flex
                                          h-[240px]
                                          items-center
                                          justify-center
                                          bg-black/20
                                        "
                                      >

                                        <ImageIcon
                                          className="
                                            h-14
                                            w-14
                                            text-yellow-400
                                          "
                                        />

                                      </div>
                                    )}

                                    {/* FILE INFO */}

                                    <div className="p-6">

                                      <div
                                        className="
                                          flex
                                          items-center
                                          justify-between
                                          gap-4
                                        "
                                      >

                                        <div>

                                          <p
                                            className="
                                              font-bold
                                              text-lg
                                              truncate
                                            "
                                          >

                                            {file.name}

                                          </p>

                                          <p
                                            className="
                                              text-gray-200
                                              mt-1
                                            "
                                          >

                                            {(
                                              file.size /
                                              1024 /
                                              1024
                                            ).toFixed(2)} MB

                                          </p>

                                        </div>

                                        <BadgeCheck
                                          className="
                                            h-6
                                            w-6
                                            text-green-400
                                          "
                                        />

                                      </div>

                                      {/* ACTIONS */}

                                      <div
                                        className="
                                          flex
                                          gap-4
                                          mt-6
                                        "
                                      >

                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="
                                            flex-1
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                          "
                                        >

                                          <Eye className="h-4 w-4" />

                                          Open

                                        </a>

                                        <a
                                          href={file.url}
                                          download
                                          className="
                                            flex-1
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            border-yellow-500/20
                                            bg-yellow-500/10
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-yellow-300
                                          "
                                        >

                                          <Download className="h-4 w-4" />

                                          Download

                                        </a>

                                      </div>

                                    </div>

                                  </div>
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
                                  h-16
                                  w-16
                                  text-yellow-400
                                  mx-auto
                                  mb-5
                                "
                              />

                              <p
                                className="
                                  text-gray-200
                                  text-lg
                                "
                              >

                                No uploaded files

                              </p>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>

                  </motion.div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>,

          document.body
        )
      }

    </>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}) {

  return (
    <div
      className="
        rounded-[32px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-7
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-gray-200
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

/* =========================================================
   SECTION TITLE
========================================================= */

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

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
}) {

  return (
    <div className="mb-6">

      {/* LABEL */}

      <label
        className="
          block
          text-sm
          font-semibold
          text-white
          mb-3
        "
      >

        {label}

      </label>

      {/* INPUT */}

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-[#1c1c1c]
          border-white/20
          text-white
          placeholder:text-gray-500
          px-5
          py-4
          outline-none
          transition-all
          focus:border-yellow-500/40
          focus:bg-[#1d1d1d]
        "
      />

    </div>
  );

}
