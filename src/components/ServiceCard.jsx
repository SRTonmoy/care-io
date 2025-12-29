import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <div className="border rounded-lg p-6 shadow hover:shadow-md">
      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>

      <p className="font-medium mb-4">
        ৳ {service.pricePerHour} / hour
      </p>

      <Link
        href={`/service/${service.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}
