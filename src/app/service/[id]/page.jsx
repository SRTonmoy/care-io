import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import Link from "next/link";
import mongoose from "mongoose";
import { FaStar, FaClock, FaMapMarkerAlt, FaShieldAlt, FaCheckCircle, FaUsers, FaArrowRight, FaPhone, FaExclamationTriangle } from "react-icons/fa";

// ===== Metadata =====
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        title: "Service Details | Care.IO",
        description: "Invalid service page",
      };
    }

    await connectDB();
    const service = await Service.findById(id).select("name description category");

    return {
      title: `${service?.name || "Service"} | Care.IO`,
      description: service?.description?.substring(0, 160) || "Professional care service details",
      openGraph: {
        title: `${service?.name || "Service"} | Care.IO`,
        description: service?.description?.substring(0, 160) || "Professional care service details",
        type: "article",
        images: service?.image ? [service.image] : [],
      },
    };
  } catch {
    return {
      title: "Service Details | Care.IO",
      description: "Professional care service details",
    };
  }
}

// ===== Page =====
export default async function ServiceDetailPage({ params }) {
  // Await the params to unwrap the Promise
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Service</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  await connectDB();
  const service = await Service.findById(id);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  // FIX: Safe price calculation with fallbacks
  const pricePerDay = service.pricePerDay || service.price || 0;
  const hourlyRate = pricePerDay > 0 ? Math.round(pricePerDay / 8) : 0;
  
  // FIX: Check if price is valid
  const hasValidPrice = pricePerDay > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="text-gray-500 hover:text-green-600">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{service.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-8">
              <img
                src={service.image || "/images/default-service.jpg"}
                alt={service.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {service.category || "Service"}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">4.9</span>
                  <span className="text-gray-500 ml-1">(128 reviews)</span>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Price Warning if needed */}
              {!hasValidPrice && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <p className="text-yellow-700">
                      <strong>Note:</strong> Pricing information is not available. Please contact us for rates.
                    </p>
                  </div>
                </div>
              )}

              {/* Service Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaClock className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Flexible Scheduling</h3>
                    <p className="text-gray-600 text-sm">24/7 availability</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verified Caregivers</h3>
                    <p className="text-gray-600 text-sm">Background checked</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Experienced Staff</h3>
                    <p className="text-gray-600 text-sm">Minimum 3 years experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
                    <p className="text-gray-600 text-sm">Satisfaction assured</p>
                  </div>
                </div>
              </div>

              {/* Duration Options */}
              {service.durationOptions?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Available Durations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {service.durationOptions.map((duration) => (
                      <div
                        key={duration}
                        className="border-2 border-green-200 rounded-xl p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Options */}
              {service.locationOptions?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                    Available Locations
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.locationOptions.map((location) => (
                      <span
                        key={location}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-all"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Professional, trained caregiver with certification</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>All necessary care equipment and supplies</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Regular updates and communication with family</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Emergency contact and support 24/7</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Personalized care plan based on needs</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Insurance coverage for added security</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                {/* Pricing */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pricing</h3>
                  <div className="space-y-4">
                    {hasValidPrice ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Daily Rate</span>
                          <span className="text-3xl font-bold text-green-600">৳{pricePerDay}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-4">
                          <span className="text-gray-600">Hourly (approx)</span>
                          <span className="text-xl font-semibold text-gray-800">৳{hourlyRate}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          * Minimum booking: 4 hours
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-3">Contact us for pricing information</p>
                        <a 
                          href="tel:09612345678" 
                          className="inline-flex items-center text-green-600 font-semibold hover:underline"
                        >
                          <FaPhone className="mr-2" />
                          09612-345678
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Steps Preview */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Steps</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-green-700">1</span>
                      </div>
                      <span className="text-gray-700">Select Duration</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-green-700">2</span>
                      </div>
                      <span className="text-gray-700">Choose Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-green-700">3</span>
                      </div>
                      <span className="text-gray-700">Confirm Booking</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/booking/${service._id}`}
                  className={`block w-full text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group ${
                    hasValidPrice 
                      ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" 
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  }`}
                >
                  {hasValidPrice ? "Book This Service" : "Contact for Booking"}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Need Help */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Need help? Call us at{" "}
                    <a href="tel:09612345678" className="text-green-600 font-semibold hover:underline">
                      09612-345678
                    </a>
                  </p>
                </div>
              </div>

              {/* Safety Information */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                  <FaShieldAlt className="mr-2" />
                  Safety & Quality Assurance
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>All caregivers are background verified</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Regular training and certification updates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>Insurance coverage for your peace of mind</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span>24/7 customer support available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Services */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            ← Browse All Services
          </Link>
        </div>
      </div>
    </div>
  );
}