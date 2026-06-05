"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  Plus,
  Sparkles,
  Upload,
  Trash2,
  Star,
  Search,
  LayoutTemplate,
  Eye,
  X,
  Globe,
  ImageIcon,
} from "lucide-react";

const slugify = (text) =>
  text?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

export default function WebsiteTemplatesManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    templatePath: "",
    featured: false,
    active: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "websiteTemplates"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setTemplates(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const addTemplate = async () => {
    if (!formData.name) return alert("Template name required");
    if (!thumbnailFile) return alert("Thumbnail required");

    try {
      setUploading(true);

      const imageRef = ref(
        storage,
        `websiteTemplates/${Date.now()}-${thumbnailFile.name}`
      );
      await uploadBytes(imageRef, thumbnailFile);
      const thumbnail = await getDownloadURL(imageRef);

      const payload = {
        ...formData,
        thumbnail,
        slug: slugify(formData.name),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "websiteTemplates"), payload);
      setTemplates((prev) => [{ id: docRef.id, ...payload }, ...prev]);

      setFormData({
        name: "",
        category: "",
        description: "",
        templatePath: "",
        featured: false,
        active: true,
      });
      setThumbnailFile(null);
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (id, current) => {
    await updateDoc(doc(db, "websiteTemplates", id), { featured: !current });
    setTemplates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !current } : item
      )
    );
  };

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, "websiteTemplates", id), { active: !current });
    setTemplates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !current } : item
      )
    );
  };

  const deleteTemplate = async (id) => {
    if (!confirm("Delete template?")) return;
    await deleteDoc(doc(db, "websiteTemplates", id));
    setTemplates((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      (item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [templates, search]);

  const featuredCount = templates.filter((i) => i.featured).length;
  const activeCount = templates.filter((i) => i.active).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black p-6 text-white md:p-8">
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <Sparkles size={16} />
              Website Templates
            </div>
            <h1 className="text-5xl font-black">Website Templates</h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<LayoutTemplate size={22} />} title="Total" value={templates.length} />
            <StatCard icon={<Star size={22} />} title="Featured" value={featuredCount} />
            <StatCard icon={<CheckCircle size={22} />} title="Active" value={activeCount} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
          {/* Left Panel - Add Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-6 h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <div className="space-y-5">
              <InputField
                label="Template Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <InputField
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Business, Portfolio, E-commerce..."
              />
              <InputField
                label="Template Path"
                value={formData.templatePath}
                onChange={(e) => handleChange("templatePath", e.target.value)}
                placeholder="/template/accounting-pro"
              />
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Thumbnail Image</label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 transition hover:border-blue-500/40">
                  <Upload size={30} />
                  <div className="text-center">
                    <p className="font-medium">Upload Thumbnail</p>
                    <p className="mt-1 text-sm text-zinc-500">PNG, JPG or WEBP</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
                {thumbnailFile && (
                  <p className="mt-2 text-sm text-green-400">✓ {thumbnailFile.name}</p>
                )}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div>
                  <p className="font-medium">Featured Template</p>
                  <p className="text-sm text-zinc-500">Highlight on homepage</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange("featured", e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
              <button
                onClick={addTemplate}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
              >
                <Plus size={18} />
                {uploading ? "Uploading..." : "Create Template"}
              </button>
            </div>
          </motion.div>

          {/* Right Panel - Templates List */}
          <div>
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
              <Search className="text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Search templates..."
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[400px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredTemplates.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="relative h-64 overflow-hidden bg-black">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-white/[0.03]">
                          <ImageIcon size={40} className="text-zinc-700" />
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-4 right-4 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-2xl font-black">{item.name}</h3>
                      <p className="text-zinc-400">{item.category}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                        {item.description}
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => toggleActive(item.id, item.active)}
                          className={`rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/[0.06] ${
                            item.active ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => toggleFeatured(item.id, item.featured)}
                          className={`rounded-2xl border border-yellow-500/20 px-4 py-3 transition hover:bg-yellow-500/20 ${
                            item.featured ? "bg-yellow-500/10 text-yellow-400" : "text-yellow-400"
                          }`}
                        >
                          {item.featured ? "Featured" : "Feature"}
                        </button>
                        <button
                          onClick={() => window.open(item.templatePath, "_blank")}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium transition hover:bg-blue-500"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                        <button
                          onClick={() => deleteTemplate(item.id)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-medium transition hover:bg-red-500"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none"
      />
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-blue-400">
        {icon}
      </div>
      <p className="text-sm text-zinc-500">{title}</p>
      <h3 className="mt-1 text-3xl font-black">{value}</h3>
    </div>
  );
}

function CheckCircle({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}