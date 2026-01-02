"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BookingForm({ user }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const booking = {
      userEmail: user.email,
      service: form.service.value,
      caregiver: form.caregiver.value,
      date: form.date.value,
      address: form.address.value,
      price: 1500,
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Booking successful! Invoice sent.");
        form.reset();
      } else {
        toast.error(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="service" placeholder="Service" required className="w-full px-3 py-2 border rounded" />
      <input name="caregiver" placeholder="Caregiver Name" required className="w-full px-3 py-2 border rounded" />
      <input type="date" name="date" required className="w-full px-3 py-2 border rounded" />
      <input name="address" placeholder="Address" required className="w-full px-3 py-2 border rounded" />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
}
