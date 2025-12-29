import services from "@/data/services";
import { notFound } from "next/navigation";

export default function BookingPage({ params }) {
  const service = services.find((s) => s.id === params.service_id);

  if (!service) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">
        Book: {service.name}
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Duration (hours)</label>
          <input
            type="number"
            min="1"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter hours"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Division, District, City, Area"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Full address"
          />
        </div>

        <p className="font-semibold">
          Total Cost: ৳ 0
        </p>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
