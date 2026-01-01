"use client";

import { useState } from "react";

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
      price: 1500
    };

    const res = await fetch("/api/book", {
      method: "POST",
      body: JSON.stringify(booking)
    });

    if (res.ok) {
      alert("Booking successful! Invoice sent.");
      form.reset();
    } else {
      alert("Booking failed");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="service" placeholder="Service" required />
      <input name="caregiver" placeholder="Caregiver Name" required />
      <input type="date" name="date" required />
      <input name="address" placeholder="Address" required />

      <button disabled={loading}>
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </form>
  );
}
