'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">
            {service.name.charAt(0)}
          </span>
        </div>
        {/* In production, use actual image: */}
        {/* <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        /> */}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(service.rating))}
                {'☆'.repeat(5 - Math.floor(service.rating))}
              </div>
              <span className="text-gray-500 text-sm ml-2">
                {service.rating} ({service.reviews} reviews)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">${service.price}</div>
            <div className="text-gray-500 text-sm">{service.duration}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-2">{service.description}</p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Key Features:</h4>
          <div className="flex flex-wrap gap-2">
            {service.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href={`/service/${service.id}`}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center group"
          >
            Learn More
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href={`/booking/${service.id}`}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
          service.category === 'baby' ? 'bg-pink-500' :
          service.category === 'elderly' ? 'bg-green-500' :
          'bg-purple-500'
        }`}>
          {service.category.charAt(0).toUpperCase() + service.category.slice(1)} Care
        </span>
      </div>
    </div>
  );
}