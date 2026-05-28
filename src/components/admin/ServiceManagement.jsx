
"use client";

/* =========================================================
   J&K SERVICES GROUP
   PREMIUM SERVICE REQUESTS DASHBOARD
   FULL REBUILD VERSION
   READY TO PASTE
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
     STATUS COLORS
  ===================================================== */

  const getStatusStyles = (status) => {

    switch (status) {

      case "reviewing":
        return `
          bg-amber-500/20
          text-amber-300
          border-amber-500/20
        `;

      case "approved":
        return `
          bg-green-500/20
          text-green-300
          border-green-500/20
        `;

      case "completed":
        return `
          bg-emerald-500/20
          text-emerald-300
          border-emerald-500/20
        `;

      case "quoted":
        return `
          bg-purple-500/20
          text-purple-300
          border-purple-500/20
        `;

      case "cancelled":
        return `
          bg-red-500/20
          text-red-300
          border-red-500/20
        `;

      default:
        return `
          bg-blue-500/20
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

        await updateDoc(
          doc(
            db,
            "serviceRequests",
            selectedRequest.id
          ),
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
     LOADING
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
            text-blue-400
          "
        />

      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <div className="relative">

        {/* GLOW EFFECTS */}

        <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

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
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-4
                py-2
                mb-5
              "
            >

              <Sparkles
                className="
                  h-4
                  w-4
                  text-blue-400
                "
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-blue-300
                "
              >

                Premium Client Requests

              </span>

            </div>

            <h2
              className="
                text-5xl
                font-black
                tracking-tight
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
                  text-zinc-500
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
                  bg-white/[0.04]
                  px-12
                  py-4
                  outline-none
                  transition
                  focus:border-blue-500
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
                bg-white/[0.04]
                px-5
                py-4
                outline-none
                transition
                focus:border-blue-500
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
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-white/10
                  bg-[#0B0B0F]
                  p-7
                "
              >

                {/* CARD GLOW */}

                <div className="absolute top-0 right-0 h-[150px] w-[150px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

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
                    mt-6
                    text-3xl
                    font-black
                  "
                >

                  {request.serviceType}

                </h3>

                <p
                  className="
                    mt-3
                    text-zinc-400
                    text-lg
                  "
                >

                  {request.customerName}

                </p>

                {/* FOOTER */}

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/10
                    pt-6
                  "
                >

                  <div>

                    <p className="text-sm text-zinc-500">

                      Uploaded Files

                    </p>

                    <p className="text-xl font-bold">

                      {request.uploads?.length || 0}

                    </p>

                  </div>

                  {/* VIEW */}

                  <button
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-blue-600
                      px-5
                      py-3
                      font-semibold
                      transition
                      hover:bg-blue-500
                    "
                  >

                    <Eye size={18} />

                    View

                  </button>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

      {/* =====================================================
          PREMIUM MODAL
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
                  overflow-y-auto
                  bg-black/70
                  backdrop-blur-md
                  p-4
                  md:p-8
                "
              >

                {/* BACKGROUND GLOWS */}

                <div className="absolute inset-0 overflow-hidden pointer-events-none">

                  <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

                  <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />

                </div>

                {/* CENTER */}

                <div
                  className="
                    relative
                    z-10
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
                      overflow-hidden
                      rounded-[32px]
                      border
                      border-white/10
                      bg-[#0B0B0F]
                      shadow-[0_40px_120px_rgba(0,0,0,0.7)]
                    "
                  >

                    {/* HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        px-6
                        py-5
                        md:px-10
                      "
                    >

                      {/* LEFT */}

                      <div>

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
                          mb-4
                          ${getStatusStyles(
                            selectedRequest.status
                          )}
                        `}>

                          {selectedRequest.status}

                        </div>

                        <h2
                          className="
                            text-3xl
                            md:text-5xl
                            font-black
                          "
                        >

                          {selectedRequest.serviceType}

                        </h2>

                        <p
                          className="
                            mt-3
                            text-zinc-400
                            text-lg
                          "
                        >

                          {selectedRequest.customerName}

                        </p>

                      </div>

                      {/* CLOSE */}

                      <button
                        onClick={() =>
                          setSelectedRequest(null)
                        }
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.03]
                          transition
                          hover:bg-white/[0.06]
                        "
                      >

                        <X />

                      </button>

                    </div>

                    {/* CONTENT */}

                    <div
                      className="
                        grid
                        grid-cols-1
                        xl:grid-cols-2
                        gap-10
                        p-6
                        md:p-10
                      "
                    >

                      {/* LEFT SIDE */}

                      <div>

                        <h3
                          className="
                            mb-8
                            text-3xl
                            font-black
                          "
                        >

                          Edit Request

                        </h3>

                        <div className="space-y-5">

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

                          <div>

                            <label
                              className="
                                mb-2
                                block
                                text-sm
                                text-zinc-400
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
                                  status:
                                    e.target.value,
                                })
                              }
                              className="
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-4
                                py-4
                                outline-none
                                transition
                                focus:border-blue-500
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
                                mb-2
                                block
                                text-sm
                                text-zinc-400
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
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-4
                                py-4
                                outline-none
                                resize-none
                                transition
                                focus:border-blue-500
                              "
                            />

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-8 flex flex-wrap gap-4">

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
                              bg-blue-600
                              px-6
                              py-4
                              font-semibold
                              transition
                              hover:bg-blue-500
                            "
                          >

                            {saving ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Save size={18} />
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
                              bg-red-600
                              px-6
                              py-4
                              font-semibold
                              transition
                              hover:bg-red-500
                            "
                          >

                            {deleting ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}

                            Delete

                          </button>

                        </div>

                      </div>

                      {/* RIGHT SIDE */}

                      <div>

                        <h3
                          className="
                            mb-8
                            text-3xl
                            font-black
                          "
                        >

                          Uploaded Files

                        </h3>

                        {selectedRequest.uploads?.length > 0 ? (

                          <div className="space-y-6">

                            {selectedRequest.uploads.map(
                              (file, index) => (

                                <div
                                  key={index}
                                  className="
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
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
                                        h-72
                                        w-full
                                        object-cover
                                      "
                                    />

                                  ) : (

                                    <div
                                      className="
                                        flex
                                        h-72
                                        items-center
                                        justify-center
                                        bg-white/[0.03]
                                      "
                                    >

                                      <ImageIcon
                                        size={60}
                                        className="text-zinc-600"
                                      />

                                    </div>
                                  )}

                                  {/* INFO */}

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

                                        <p className="text-xl font-bold">

                                          {file.name}

                                        </p>

                                        <p className="mt-1 text-zinc-500">

                                          {(
                                            file.size /
                                            1024 /
                                            1024
                                          ).toFixed(2)} MB

                                        </p>

                                      </div>

                                      <BadgeCheck
                                        className="
                                          text-green-400
                                        "
                                      />

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="mt-6 grid grid-cols-2 gap-4">

                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                          flex
                                          items-center
                                          justify-center
                                          gap-2
                                          rounded-2xl
                                          border
                                          border-white/10
                                          bg-white/[0.03]
                                          px-4
                                          py-4
                                          transition
                                          hover:bg-white/[0.06]
                                        "
                                      >

                                        <Eye size={18} />

                                        Open

                                      </a>

                                      <a
                                        href={file.url}
                                        download
                                        className="
                                          flex
                                          items-center
                                          justify-center
                                          gap-2
                                          rounded-2xl
                                          bg-blue-600
                                          px-4
                                          py-4
                                          font-medium
                                          transition
                                          hover:bg-blue-500
                                        "
                                      >

                                        <Download size={18} />

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
                              flex
                              flex-col
                              items-center
                              justify-center
                              rounded-3xl
                              border
                              border-white/10
                              bg-white/[0.03]
                              p-20
                              text-center
                            "
                          >

                            <FolderOpen
                              size={60}
                              className="text-zinc-600"
                            />

                            <p className="mt-5 text-zinc-500">

                              No uploaded files

                            </p>

                          </div>
                        )}

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
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
}) {

  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          text-zinc-400
        "
      >

        {label}

      </label>

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
          bg-white/[0.03]
          px-4
          py-4
          outline-none
          transition
          focus:border-blue-500
        "
      />

    </div>
  );
}