// src/lia/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LIACustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const q = query(collection(db, "liaCustomers"), orderBy("registeredAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(items);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format phone number for display: (222) 222 - 2222
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "-";
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX - XXXX
    if (cleaned.length === 0) {
      return "-";
    } else if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} - ${cleaned.slice(6, 10)}`;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        LIA Store Customers <span className="text-orange-500">({customers.length})</span>
      </h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">City</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Store</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Contact Method</th>
              <th className="px-4 py-3 text-left text-gray-700 font-semibold">Registered</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-100 hover:bg-orange-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{customer.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-gray-600">
                  {customer.phoneFormatted || formatPhoneForDisplay(customer.phone)}
                </td>
                <td className="px-4 py-3 text-gray-600">{customer.city}</td>
                <td className="px-4 py-3 text-gray-600">{customer.storeName || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.preferredContactMethod === 'email' 
                      ? 'bg-blue-100 text-blue-700' 
                      : customer.preferredContactMethod === 'sms' 
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {customer.preferredContactMethod || "Not specified"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {customer.registeredAt?.toDate?.().toLocaleDateString() || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}