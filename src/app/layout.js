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
  title: "J&K Service Group | Events, IT & Media Services",
  description:
    "J&K Service Group provides professional event planning, MC services, DJ entertainment, photography, videography, networking installation, IT consulting, and conference solutions.",
  keywords: [
    "event planning",
    "DJ services",
    "MC services",
    "photography",
    "videography",
    "network installation",
    "IT support",
    "conference services",
    "Iowa event services",
    "J&K Service Group",
  ],

  icons: {
    icon: "/favicon.ico",
  },
  
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <head>

        {/* Google Analytics */}
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

      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>

    </html>
  );
}