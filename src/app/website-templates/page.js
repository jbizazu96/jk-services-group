"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Search, 
  X, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  LayoutTemplate,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function WebsiteTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Load templates from Firestore
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple query without composite index
      const q = query(collection(db, "websiteTemplates"));
      const snapshot = await getDocs(q);
      
      console.log("Total documents:", snapshot.docs.length);
      
      const items = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(item => item.active === true) // Filter in memory
        .sort((a, b) => {
          // Sort by createdAt descending
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
      
      console.log("Active templates:", items.length);
      setTemplates(items);
      
    } catch (err) {
      console.error("Error loading templates:", err);
      setError("Failed to load templates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ["all", ...new Set(templates.map((t) => t.category))].filter(Boolean);

  // Filter templates
  const filteredTemplates = templates.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured templates first
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={loadTemplates}
            className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <Link href="/#gallery" className="inline-block mb-4">
            <button className="bg-white/5 border border-white/10 hover:bg-yellow-500 hover:text-black text-white px-6 py-2 rounded-full font-medium transition-all">
              ← Back to Home
            </button>
          </Link>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-semibold">Website Templates</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black">
            Ready-to-Use <span className="text-yellow-400">Templates</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Browse our collection of premium website templates. Click any template to preview it live.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-12">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${activeCategory === cat
                      ? "bg-yellow-500 text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Templates Grid */}
        {sortedTemplates.length === 0 ? (
          <div className="text-center py-20">
            <LayoutTemplate className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No templates found</p>
            <p className="text-gray-500 mt-2">
              {search || activeCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "No templates have been created yet"}
            </p>
            <Link href="/admin" className="inline-block mt-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors">
                Go to Admin Panel
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <TemplatePreviewModal
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Template Card Component
function TemplateCard({ template, onPreview }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-500 cursor-pointer"
      onClick={onPreview}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
        {template.thumbnail && !imageError ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <LayoutTemplate className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Overlay with preview button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
            <Eye className="w-4 h-4" />
            Preview Template
          </div>
        </div>

        {/* Featured Badge */}
        {template.featured && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-gray-400">{template.category || "Uncategorized"}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-yellow-500 hover:text-black transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        {template.description && (
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">
            {template.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Preview Modal Component
function TemplatePreviewModal({ template, onClose }) {
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-6xl bg-[#0B0B0F] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white">{template.name}</h2>
            <p className="text-gray-400 text-sm">{template.category || "Uncategorized"}</p>
          </div>
          <div className="flex items-center gap-3">
            {template.templatePath && (
              <a
                href={template.templatePath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-yellow-500 text-black rounded-full font-bold hover:bg-yellow-400 transition-colors"
              >
                Open Full Page
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content - Iframe Preview */}
        <div className="relative h-[70vh] md:h-[80vh] bg-white">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {template.templatePath && !iframeError ? (
            <iframe
              src={template.templatePath}
              className="w-full h-full border-none"
              onLoad={() => setLoading(false)}
              onError={() => {
                setIframeError(true);
                setLoading(false);
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <LayoutTemplate className="w-20 h-20 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Preview Unavailable</h3>
              <p className="text-gray-500">
                {iframeError 
                  ? "The template page could not be loaded." 
                  : "No template path provided."}
              </p>
              {template.templatePath && (
                <a
                  href={template.templatePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  Open in New Tab
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Template: {template.name}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}