import { Suspense } from "react";
import ClientPortal from "@/components/client/clientPortal";

export const metadata = {
  title: "Client Portal | J&K Services Group",
  description:
    "Submit project requests, event details, branding assets, and creative inquiries through the J&K Services Group client portal.",
};

export default function ClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portal...</p>
        </div>
      </div>
    }>
      <ClientPortal />
    </Suspense>
  );
}