"use client";
import Link from "next/link";
import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Service Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.image || "/images/default-service.jpg"}
          alt={service.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {service.category}
          </span>
        </div>
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-bold">4.9</span>
          </div>
        </div>
      </div>

      {/* Service Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {service.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-green-700">
            ৳{service.pricePerDay}<span className="text-sm font-normal text-gray-500"> / day</span>
          </p>
          <p className="text-sm text-gray-500">
            ৳{Math.round(service.pricePerDay / 8)} / hour approx
          </p>
        </div>

        {/* Service Features */}
        <div className="space-y-2 mb-6">
          {service.durationOptions?.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2 text-green-600" />
              <span>{service.durationOptions[0]} options available</span>
            </div>
          )}
          {service.locationOptions?.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              <span>{service.locationOptions.length} locations</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/service/${service._id}`}
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-300 transform hover:scale-105"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}