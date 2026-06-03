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
  metadataBase: new URL("https://myjkservices.com"),

  /* =======================================
     TITLE
  ======================================= */
  title: {
    default: "J&K Services Group | Professional Events, IT & Creative Services",
    template: "%s | J&K Services Group",
  },

  /* =======================================
     DESCRIPTION
  ======================================= */
  description: "J&K Services Group provides website development, IT and networking services, church technology solutions, media and creative services, weddings and event services, training programs, conferences, photography, videography, DJ entertainment, and business consulting throughout Iowa and beyond.",

  /* =======================================
     SEO KEYWORDS - KEPT ALL ORIGINAL
  ======================================= */
  keywords: [
    "J&K Services Group",
    "my jk services group",
    "my jk service group",
    "jk services",
    "jandk services group",
    "j and k services",
    "MC services",
    "jk services group",
    "my jk services",
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
    "church solutions",
    "church media installation",
    "church live streaming",
    "website design",
    "website maintenance",
    "business websites",
    "church websites",
    "IT consulting",
    "network troubleshooting",
    "wifi installation",
    "structured cabling",
    "event planning services",
    "MC services",
    "DJ entertainment",
    "photography services",
    "videography services",
    "training and conferences",
    "Fort Dodge Iowa",
    "Iowa website development",
    "Iowa IT services",
  ],

  authors: [{ name: "J&K Services Group", url: "https://myjkservices.com" }],
  creator: "J&K Services Group",
  publisher: "J&K Services Group",
  applicationName: "J&K Services Group",

  /* =======================================
     CANONICAL URL
  ======================================= */
  alternates: {
    canonical: "https://myjkservices.com",
  },

  /* =======================================
     ROBOTS
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
     OPEN GRAPH - USING LOGO1.WEBP
  ======================================= */
  openGraph: {
    title: "J&K Services Group | Professional Events, IT & Creative Services",
    description: "J&K Services Group provides website development, IT and networking services, church technology solutions, media and creative services, weddings and event services, training programs, conferences, photography, videography, DJ entertainment, and business consulting throughout Iowa and beyond.",
    url: "https://myjkservices.com",
    siteName: "J&K Services Group",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo1.webp",
        width: 1200,
        height: 630,
        alt: "J&K Services Group",
      },
    ],
  },

  /* =======================================
     TWITTER / X
  ======================================= */
  twitter: {
    card: "summary_large_image",
    title: "J&K Services Group",
    description: "J&K Services Group provides website development, IT and networking services, church technology solutions, media and creative services, weddings and event services, training programs, conferences, photography, videography, DJ entertainment, and business consulting throughout Iowa and beyond.",
    images: ["/images/logo1.webp"],
  },

  /* =======================================
     FAVICONS - REMOVED SVG REFERENCE
  ======================================= */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  /* =======================================
      GEO SEO
  ======================================= */
  other: {
    "geo.region": "US-IA",
    "geo.placename": "Fort Dodge",
    "geo.position": "42.4975;-94.1680",
    "ICBM": "42.4975, -94.1680",
  },

  manifest: "/site.webmanifest",
};

/* =========================================
   ROOT LAYOUT
========================================= */

export default function RootLayout({ children }) {
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
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XVQ14G6JBT');
          `}
        </Script>

        {/* ===================================
            THEME COLOR
        ==================================== */}
        <meta name="theme-color" content="#000000" />

        {/* ===================================
            COLOR SCHEME
        ==================================== */}
        <meta name="color-scheme" content="dark light" />

        {/* ===================================
            MOBILE VIEWPORT
        ==================================== */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ===================================
            STRUCTURED DATA - ORGANIZATION
        ==================================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "J&K Services Group",
              "url": "https://myjkservices.com",
              "logo": "https://myjkservices.com/images/logo1.webp",
              "image": "https://myjkservices.com/images/logo1.webp",
              "description": "J&K Services Group provides website development, IT and networking services, church technology solutions, media and creative services, weddings and event services, training programs, conferences, photography, videography, DJ entertainment, and business consulting throughout Iowa and beyond.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Fort Dodge",
                "addressRegion": "IA",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "42.4975",
                "longitude": "-94.1680"
              },
              "telephone": "+13193613575",
              "email": "info@myjkservices.com",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:08",
                "closes": "23:59"
              },
              "priceRange": "$$"
            }),
          }}
        />

        {/* ===================================
            STRUCTURED DATA - BREADCRUMBS
        ==================================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://myjkservices.com"
                }
              ]
            }),
          }}
        />

        {/* ===================================
            PRELOAD CRITICAL ASSETS
        ==================================== */}
        <link rel="preload" href="/images/logo1.webp" as="image" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>

      <body className="min-h-full overflow-x-hidden bg-black text-white">
        {children}
        <Toaster
          richColors
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
            },
          }}
        />
      </body>
    </html>
  );
}