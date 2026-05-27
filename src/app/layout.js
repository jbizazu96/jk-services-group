import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://myjkservices.com"),

  title: {
    default: "J&K Services Group",
    template: "%s | J&K Services Group",
  },

  description:
    "J&K Services Group provides premium event planning, MC services, DJ entertainment, photography, videography, networking installation, IT consulting, and conference solutions.",

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
    "Iowa event services",
    "business consulting",
    "wedding services",
  ],

  authors: [
    {
      name: "J&K Services Group",
      url: "https://myjkservices.com",
    },
  ],

  creator: "J&K Services Group",

  publisher: "J&K Services Group",

  openGraph: {
    title: "J&K Services Group",

    description:
      "Professional event planning, DJ entertainment, networking solutions, photography, videography, and IT consulting.",

    url: "https://myjkservices.com",

    siteName: "J&K Services Group",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/images/logo1.png",
        width: 1200,
        height: 630,
        alt: "J&K Services Group",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "J&K Services Group",

    description:
      "Professional event planning, networking, IT consulting, photography, videography, and DJ services.",

    images: ["/images/logo1.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >

      <head>

        {/* GOOGLE ANALYTICS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XVQ14G6JBT"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-XVQ14G6JBT');
          `}
        </Script>

        {/* THEME COLOR */}
        <meta name="theme-color" content="#000000" />

        {/* MOBILE */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

      </head>

      <body
        className="
          min-h-full
          flex
          flex-col
          bg-black
          text-white
          overflow-x-hidden
        "
      >
        {children}
      </body>

    </html>
  );
}