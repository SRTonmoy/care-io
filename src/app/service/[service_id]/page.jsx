import services from "@/data/services";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateMetadata({ params }) {
  const service = services.find((s) => s.id === params.service_id);

  if (!service) {
    return {
      title: "Service Not Found | Care.xyz",
    };
  }

  return {
    title: `${service.name} | Care.xyz`,
    description: service.description,
  };
}

export default function ServiceDetails({ params }) {
  const service = services.find((s) => s.id === params.service_id);

  if (!service) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>

      <p className="text-gray-600 mb-6">{service.description}</p>

      <p className="text-lg font-medium mb-6">
        Service Charge: ৳ {service.pricePerHour} / hour
      </p>

      <Link
        href={`/booking/${service.id}`}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Book Service
      </Link>
    </div>
  );
}
