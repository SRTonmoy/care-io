'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/data/services';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = parseInt(params.service_id);
  
  const service = services.find(s => s.id === serviceId);
  
  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600">Home</a>
            </li>
            <li className="mx-2">/</li>
            <li className="text-blue-600 font-medium">{service.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  service.category === 'baby' ? 'bg-pink-100 text-pink-800' :
                  service.category === 'elderly' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {service.category.charAt(0).toUpperCase() + service.category.slice(1)} Care
                </span>
                <div className="flex items-center">
                  {'★'.repeat(Math.floor(service.rating))}
                  {'☆'.repeat(5 - Math.floor(service.rating))}
                  <span className="ml-2 text-gray-600">({service.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{service.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{service.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">${service.price}</div>
                  <div className="text-gray-500">{service.duration}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-gray-500">Availability</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">Certified</div>
                  <div className="text-gray-500">Caregivers</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Book This Service</h3>
                <p className="text-gray-600 mb-6">Get started with professional care for your loved ones.</p>
                <Link
                  href={`/booking/${service.id}`}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold text-center block transition-colors mb-4"
                >
                  Book Now
                </Link>
                <div className="text-center text-sm text-gray-500">
                  No upfront payment required
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Features */}
            <div className="bg-white p-8 rounded-xl shadow-sm border mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-8 rounded-xl shadow-sm border mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">{service.longDescription}</p>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">What's Included</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Professional assessment of care needs</li>
                  <li>• Customized care plan</li>
                  <li>• Regular progress reports</li>
                  <li>• Emergency support 24/7</li>
                  <li>• Caregiver replacement if needed</li>
                  <li>• Satisfaction guarantee</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Ideal For</h3>
                <div className="flex flex-wrap gap-2">
                  {service.category === 'baby' && (
                    <>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">New Parents</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Working Parents</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Date Night Care</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">Emergency Care</span>
                    </>
                  )}
                  {service.category === 'elderly' && (
                    <>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Seniors Living Alone</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Post-Hospital Care</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Dementia Care</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Companionship</span>
                    </>
                  )}
                  {service.category === 'sick' && (
                    <>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Post-Surgery Care</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Chronic Illness</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Palliative Care</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Medical Monitoring</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pricing */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Options</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">4 hours</div>
                    <div className="text-sm text-gray-500">Minimum booking</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">${(service.price * 4).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">8 hours</div>
                    <div className="text-sm text-gray-500">Full day</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800">${(service.price * 8).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">12 hours</div>
                    <div className="text-sm text-gray-500">Extended care</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800">${(service.price * 12).toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">24 hours</div>
                    <div className="text-sm text-gray-500">Overnight</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800">${(service.price * 24).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Are caregivers background checked?</h4>
                  <p className="text-sm text-gray-600">Yes, all our caregivers undergo thorough background checks and reference verification.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">What if I need to cancel?</h4>
                  <p className="text-sm text-gray-600">You can cancel up to 24 hours before without charge. Late cancellations may incur a fee.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">How are caregivers matched?</h4>
                  <p className="text-sm text-gray-600">We match based on experience, skills, personality, and specific care requirements.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Is there a contract?</h4>
                  <p className="text-sm text-gray-600">No long-term contracts. Book as needed or set up recurring care.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of families who trust CARE-IO for their {service.category} care needs.
            </p>
            <Link
              href={`/booking/${service.id}`}
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Book {service.name} Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}