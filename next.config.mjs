/* ==========================================
   NEXT.JS CONFIGURATION
========================================== */

/** @type {import('next').NextConfig} */

const nextConfig = {

  images: {

    remotePatterns: [

      /* =====================================
          FIREBASE STORAGE
      ===================================== */

      {
        protocol: "https",

        hostname:
          "firebasestorage.googleapis.com",
      },

      {
        protocol: "https",

        hostname:
          "**.firebasestorage.app",
      },

      /* =====================================
          UNSPLASH
      ===================================== */

      {
        protocol: "https",

        hostname:
          "images.unsplash.com",
      },

    ],

  },

};

export default nextConfig;