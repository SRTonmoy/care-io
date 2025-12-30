'use client';

import { useParams } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

export default function BookingPage() {
  const params = useParams();
  const serviceId = params.service_id;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-blue-600">Home</a>
              </li>
              <li className="mx-2">/</li>
              <li>
                <a href="/service/1" className="hover:text-blue-600">Services</a>
              </li>
              <li className="mx-2">/</li>
              <li className="text-blue-600 font-medium">Booking</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Book Your Care Service
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please fill out the form below to schedule your care service. 
              Our team will confirm your booking within 24 hours.
            </p>
          </div>

          {/* Booking Form */}
          <BookingForm serviceId={serviceId} />
        </div>
      </div>
    </div>
  );
}