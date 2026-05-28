
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import "./globals.css";

/* =========================================
   FONTS
========================================= */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* =========================================
   GLOBAL SEO METADATA
========================================= */

export const metadata = {

  /* =======================================
     BASE URL
  ======================================= */

  metadataBase: new URL(
    "https://myjkservices.com"
  ),

  /* =======================================
     TITLE
  ======================================= */

  title: {

    default:
      "J&K Services Group",

    template:
      "%s | J&K Services Group",
  },

  /* =======================================
     DESCRIPTION
  ======================================= */

  description:
    "J&K Services Group provides premium event planning, MC services, DJ entertainment, photography, videography, networking installation, IT consulting, website development, and conference solutions.",

  /* =======================================
     SEO KEYWORDS
  ======================================= */

  keywords: [

    "J&K Services Group",

    "MC services",

    "DJ services",

    "event planning",

    "photography",

    "videography",

    "network installation",

    "IT support",

    "conference services",

    "website development",

    "business consulting",

    "wedding services",

    "Iowa event services",
  ],

  /* =======================================
     AUTHOR INFO
  ======================================= */

  authors: [
    {
      name:
        "J&K Services Group",

      url:
        "https://myjkservices.com",
    },
  ],

  creator:
    "J&K Services Group",

  publisher:
    "J&K Services Group",

  applicationName:
    "J&K Services Group",

  /* =======================================
     CANONICAL URL
  ======================================= */

  alternates: {

    canonical:
      "https://myjkservices.com",
  },

  /* =======================================
     SEARCH ENGINE ROBOTS
  ======================================= */

  robots: {

    index: true,

    follow: true,

    googleBot: {

      index: true,

      follow: true,

      "max-video-preview": -1,

      "max-image-preview": "large",

      "max-snippet": -1,
    },
  },

  /* =======================================
     OPEN GRAPH
  ======================================= */

  openGraph: {

    title:
      "J&K Services Group",

    description:
      "Professional event planning, DJ entertainment, networking solutions, photography, videography, website development, and IT consulting.",

    url:
      "https://myjkservices.com",

    siteName:
      "J&K Services Group",

    locale:
      "en_US",

    type:
      "website",

    images: [
      {
        url:
          "/images/logo1.png",

        width: 1200,

        height: 630,

        alt:
          "J&K Services Group",
      },
    ],
  },

  /* =======================================
     TWITTER / X
  ======================================= */

  twitter: {

    card:
      "summary_large_image",

    title:
      "J&K Services Group",

    description:
      "Professional event planning, networking, IT consulting, photography, videography, and DJ services.",

    images: [
      "/images/logo1.png",
    ],
  },

  /* =======================================
     FAVICONS
  ======================================= */

  icons: {

    icon: [

      {
        url:
          "/favicon.ico",
      },

      {
        url:
          "/favicon-32x32.png",

        sizes:
          "32x32",

        type:
          "image/png",
      },

      {
        url:
          "/favicon-16x16.png",

        sizes:
          "16x16",

        type:
          "image/png",
      },
    ],

    shortcut:
      "/favicon.ico",

    apple:
      "/apple-touch-icon.png",
  },

  /* =======================================
     WEB MANIFEST
  ======================================= */

  manifest:
    "/site.webmanifest",
};

/* =========================================
   ROOT LAYOUT
========================================= */

export default function RootLayout({
  children,
}) {

  return (

    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
        scroll-smooth
      `}
    >

      <head>

        {/* ===================================
            GOOGLE ANALYTICS
        ==================================== */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XVQ14G6JBT"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag(
              'config',
              'G-XVQ14G6JBT'
            );
          `}
        </Script>

        {/* ===================================
            THEME COLOR
        ==================================== */}

        <meta
          name="theme-color"
          content="#000000"
        />

        {/* ===================================
            STRUCTURED DATA
        ==================================== */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({

              "@context":
                "https://schema.org",

              "@type":
                "Organization",

              name:
                "J&K Services Group",

              url:
                "https://myjkservices.com",

              logo:
                "https://myjkservices.com/images/logo1.png",

              image:
                "https://myjkservices.com/images/logo1.png",

              description:
                "Premium event planning, photography, videography, DJ entertainment, networking and IT consulting services.",
            }),
          }}
        />

        {/* ===================================
            MOBILE VIEWPORT
        ==================================== */}

        <meta
          name="viewport"
          content="
            width=device-width,
            initial-scale=1
          "
        />

      </head>

      <body
        className="
          min-h-full
          overflow-x-hidden
          bg-black
          text-white
        "
      >

        {/* ===================================
            APP CONTENT
        ==================================== */}

        {children}

        {/* ===================================
            GLOBAL TOAST SYSTEM
        ==================================== */}

        <Toaster
          richColors
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background:
                "#0f0f0f",
              border:
                "1px solid rgba(255,255,255,0.08)",
              color:
                "#ffffff",
            },
          }}
        />

      </body>

    </html>
  );
}
