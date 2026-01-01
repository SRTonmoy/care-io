"use client";
import services from "@/lib/servicesData";
import BookingForm from "@/components/BookingForm";
import Protected from "@/components/Protected";

export default function BookingPage({ params }) {
  const service = services.find((s) => s._id === params.id);

  if (!service) return <p>Service not found</p>;

  return (
    <Protected>
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-3xl font-bold mb-6">
          Book {service.name}
        </h1>

        <BookingForm service={service} />
      </div>
    </Protected>
  );
}
