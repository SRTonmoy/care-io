import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import Link from "next/link";
import mongoose from "mongoose";
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaUsers,
  FaArrowRight,
  FaPhone,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUserCheck,
  FaHandsHelping,
  FaHeartbeat,
} from "react-icons/fa";

// ===== Metadata =====
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        title: "Service Details | Care.IO - Professional Care Services",
        description: "Find and book professional care services with certified caregivers",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    await connectDB();
    const service = await Service.findById(id).select(
      "name description category image durationOptions locationOptions"
    );

    if (!service) {
      return {
        title: "Service Not Found | Care.IO",
        description: "The requested care service could not be found",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://care-io.com";
    const canonicalUrl = `${siteUrl}/services/${id}`;
    const serviceDescription = service.description
      ? `${service.description.substring(0, 155)}...`
      : `Professional ${service.category || "care"} service with certified caregivers. Book now for quality care.`;

    return {
      title: `${service.name} | ${service.category || "Care"} Service | Care.IO`,
      description: serviceDescription,
      keywords: [
        service.name,
        service.category,
        "care service",
        "home care",
        "caregiver",
        "Bangladesh",
        "elderly care",
        "medical care",
        "professional caregiver",
        ...(service.locationOptions || []),
      ].join(", "),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${service.name} | Care.IO`,
        description: serviceDescription,
        type: "website",
        url: canonicalUrl,
        images: service.image
          ? [
              {
                url: service.image,
                width: 1200,
                height: 630,
                alt: `${service.name} - Professional ${service.category || "care"} service`,
              },
            ]
          : [],
        siteName: "Care.IO",
        locale: "en_BD",
      },
      twitter: {
        card: "summary_large_image",
        title: `${service.name} | Care.IO`,
        description: serviceDescription,
        images: service.image ? [service.image] : [],
        creator: "@CareIO_BD",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    
    return {
      title: "Service Details | Care.IO - Professional Care Services",
      description: "Find and book professional care services with certified caregivers in Bangladesh",
    };
  }
}

// ===== Structured Data Generator =====
function generateStructuredData(service) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://care-io.com";
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${baseUrl}/services/${service._id}#service`,
        "name": service.name,
        "description": service.description?.substring(0, 200) || "",
        "serviceType": service.category,
        "provider": {
          "@type": "Organization",
          "name": "Care.IO",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+8801752649293",
            "contactType": "customer service",
            "areaServed": "BD",
            "availableLanguage": ["English", "Bengali"]
          }
        },
        "areaServed": service.locationOptions?.map(location => ({
          "@type": "State",
          "name": location
        })) || [{ "@type": "Country", "name": "Bangladesh" }],
        "offers": service.pricePerDay > 0 ? {
          "@type": "Offer",
          "price": service.pricePerDay,
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString().split('T')[0]
        } : undefined,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        },
        "image": service.image || `${baseUrl}/images/default-service.jpg`
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/services/${service._id}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": `${baseUrl}/services`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.name,
            "item": `${baseUrl}/services/${service._id}`
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/services/${service._id}#webpage`,
        "url": `${baseUrl}/services/${service._id}`,
        "name": `${service.name} | Care.IO`,
        "isPartOf": {
          "@id": `${baseUrl}#website`
        },
        "description": service.description?.substring(0, 200) || "",
        "breadcrumb": {
          "@id": `${baseUrl}/services/${service._id}#breadcrumb`
        },
        "inLanguage": "en",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [`${baseUrl}/services/${service._id}`]
          }
        ]
      }
    ]
  };
}

// ===== Main Page Component =====
export default async function ServiceDetailPage({ params }) {
  const { id } = await params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <InvalidServiceView />;
  }

  await connectDB();
  const service = await Service.findById(id);

  if (!service) {
    return <ServiceNotFoundView />;
  }

  // Generate structured data
  const structuredData = generateStructuredData(service);

  // Calculate pricing
  const pricePerDay = Number(service.pricePerDay) || 0;
  const hourlyRate = pricePerDay > 0 ? Math.round(pricePerDay / 8) : 0;
  const hasValidPrice = pricePerDay > 0;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb with Schema */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                    aria-label="Go to homepage"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      href="/services"
                      className="ml-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors md:ml-2"
                      aria-label="Browse all services"
                    >
                      Services
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="ml-1 text-sm font-medium text-gray-900 truncate max-w-xs md:max-w-md">
                      {service.name}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <figure className="relative">
                  <img
                    src={service.image || "/images/default-service.jpg"}
                    alt={`${service.name} - Professional ${service.category || "care"} service`}
                    title={`${service.name} Service Image`}
                    className="w-full h-80 md:h-96 object-cover"
                    width={1200}
                    height={400}
                    loading="eager"
                  />
                  <figcaption className="sr-only">
                    {service.name} - Professional {service.category || "care"} service
                  </figcaption>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg inline-flex items-center">
                      <FaHeartbeat className="mr-2" />
                      {service.category || "Care Service"}
                    </span>
                    {service.isEmergency && (
                      <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                        Emergency Service
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="font-bold text-lg">4.9</span>
                      </div>
                      <div className="mx-2 h-6 w-px bg-gray-300"></div>
                      <span className="text-gray-600 text-sm">
                        128 Reviews • 500+ Served
                      </span>
                    </div>
                  </div>
                </figure>

                {/* Service Header */}
                <div className="p-6 md:p-8">
                  <header>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h1>
                    <div className="flex items-center text-green-600 font-medium mb-6">
                      <FaUserCheck className="mr-2" />
                      Professional Certified Care Service
                    </div>
                  </header>

                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Pricing Alert */}
                  {!hasValidPrice && (
                    <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                      <div className="flex items-start">
                        <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-yellow-800 font-medium mb-1">
                            Custom Pricing Available
                          </p>
                          <p className="text-yellow-700 text-sm">
                            Contact us for personalized quotes based on your specific needs and duration.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <ServiceFeature
                      icon={<FaShieldAlt className="text-blue-600" />}
                      title="100% Verified"
                      description="All caregivers are background checked and certified"
                    />
                    <ServiceFeature
                      icon={<FaClock className="text-purple-600" />}
                      title="24/7 Availability"
                      description="Round-the-clock service for your convenience"
                    />
                    <ServiceFeature
                      icon={<FaUsers className="text-teal-600" />}
                      title="Experienced Team"
                      description="Minimum 3+ years of professional experience"
                    />
                    <ServiceFeature
                      icon={<FaHandsHelping className="text-orange-600" />}
                      title="Personalized Care"
                      description="Customized care plans for individual needs"
                    />
                  </div>
                </div>
              </article>

              {/* Service Options */}
              {(service.durationOptions?.length > 0 || service.locationOptions?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Service Options
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Duration Options */}
                    {service.durationOptions?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <FaClock className="mr-2 text-green-600" />
                          Available Durations
                        </h3>
                        <div className="space-y-2">
                          {service.durationOptions.map((duration, index) => (
                            <div
                              key={duration}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                            >
                              <span className="font-medium text-gray-900">{duration}</span>
                              {hasValidPrice && index === 0 && (
                                <span className="text-green-600 font-semibold">
                                  ৳{pricePerDay}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location Options */}
                    {service.locationOptions?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-blue-600" />
                          Service Areas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.locationOptions.map((location) => (
                            <span
                              key={location}
                              className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm"
                            >
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Benefits */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 md:p-8 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What You'll Get
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Personalized care plan development"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Trained and certified caregiver"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="All necessary medical equipment"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Regular health monitoring"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Daily activity reports"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Emergency response system"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Family communication portal"
                  />
                  <BenefitItem
                    icon={<FaCheckCircle className="text-green-600" />}
                    text="Insurance and liability coverage"
                  />
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                
                <div className="space-y-4">
                  <FAQItem
                    question="How quickly can I get a caregiver?"
                    answer="We can match you with a qualified caregiver within 24-48 hours for standard requests, or immediately for emergency cases."
                  />
                  <FAQItem
                    question="What's included in the background check?"
                    answer="Comprehensive verification including criminal record, employment history, references, and medical certification."
                  />
                  <FAQItem
                    question="Can I change my caregiver if needed?"
                    answer="Yes, we offer free caregiver replacement if you're not completely satisfied with your match."
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <Link
                    href="/faq"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium group"
                  >
                    View all FAQs
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Booking & Info */}
            <div className="lg:col-span-1">
              <aside className="sticky top-6 space-y-6">
                {/* Pricing Card */}
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Service Pricing
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Transparent pricing with no hidden fees
                  </p>

                  {hasValidPrice ? (
                    <>
                      <div className="space-y-4 mb-6">
                        <PriceItem
                          label="Full Day (8 hours)"
                          price={pricePerDay}
                          isPrimary={true}
                        />
                        <PriceItem
                          label="Hourly Rate"
                          price={hourlyRate}
                          note="Minimum 4 hours"
                        />
                        <PriceItem
                          label="Weekly Package"
                          price={Math.round(pricePerDay * 7 * 0.9)}
                          discount="Save 10%"
                        />
                      </div>

                      <div className="text-center text-sm text-gray-500 mb-6">
                        * All prices include GST • No advance payment required
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaPhone className="text-green-600 text-2xl" />
                      </div>
                      <p className="text-gray-700 mb-4">
                        Contact us for a personalized quote
                      </p>
                      <a
                        href="tel:01752649293"
                        className="inline-flex items-center text-xl font-bold text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FaPhone className="mr-2" />
                        01752-649293
                      </a>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="mt-6">
                    <Link
                      href={`/booking/${service._id}`}
                      className={`block w-full text-white text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group ${
                        hasValidPrice
                          ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                          : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                      }`}
                      aria-label={`Book ${service.name} service`}
                    >
                      {hasValidPrice ? "Book Now" : "Contact for Booking"}
                      <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Free consultation • No commitment
                    </p>
                  </div>
                </div>

                {/* Booking Process */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Simple 3-Step Booking
                  </h3>
                  
                  <div className="space-y-6">
                    <BookingStep
                      number={1}
                      title="Select Service"
                      description="Choose duration and location"
                      icon={<FaCalendarAlt />}
                    />
                    <BookingStep
                      number={2}
                      title="Confirm Details"
                      description="Review and customize your plan"
                      icon={<FaUserCheck />}
                    />
                    <BookingStep
                      number={3}
                      title="Get Matched"
                      description="We assign the perfect caregiver"
                      icon={<FaHandsHelping />}
                    />
                  </div>
                </div>

                {/* Safety & Trust */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <FaShieldAlt className="mr-3 text-blue-600" />
                    Our Safety Promise
                  </h3>
                  
                  <ul className="space-y-3">
                    <TrustItem text="All caregivers are licensed and certified" />
                    <TrustItem text="Comprehensive background verification" />
                    <TrustItem text="Regular training and skill updates" />
                    <TrustItem text="Insurance coverage for your protection" />
                    <TrustItem text="24/7 emergency support team" />
                    <TrustItem text="Regular quality audits and feedback" />
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">TrustScore</span>
                      <span className="text-2xl font-bold text-blue-900">9.8/10</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 border border-gray-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Need Help Deciding?
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Our care specialists are here to help you choose the right service.
                  </p>
                  
                  <div className="space-y-4">
                    <a
                      href="tel:01752649293"
                      className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <FaPhone className="mr-3" />
                      Call Now: 01752-649293
                    </a>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Available 7:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Related Services CTA */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Not the right fit?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Browse our complete range of care services to find exactly what you need.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                aria-label="Browse all care services"
              >
                Explore All Services
                <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// ===== Sub-Components =====

function InvalidServiceView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
          <FaExclamationTriangle className="text-red-600 text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Service</h1>
        <p className="text-gray-600 mb-8">
          The service link appears to be invalid or malformed.
        </p>
        <Link
          href="/services"
          className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
        >
          Browse Available Services
        </Link>
      </div>
    </div>
  );
}

function ServiceNotFoundView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <FaExclamationTriangle className="text-yellow-600 text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-gray-600 mb-8">
          The service you're looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/services"
          className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
        >
          Browse Available Services
        </Link>
      </div>
    </div>
  );
}

function ServiceFeature({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="text-2xl">{icon}</div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function BenefitItem({ icon, text }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-gray-800">{text}</span>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
      <h4 className="font-semibold text-gray-900 mb-2">{question}</h4>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  );
}

function PriceItem({ label, price, isPrimary = false, note, discount }) {
  return (
    <div className={`p-4 rounded-xl ${isPrimary ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-gray-900">{label}</span>
        {discount && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {discount}
          </span>
        )}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">৳{price}</span>
        <span className="text-gray-500 ml-2">BDT</span>
      </div>
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
}

function BookingStep({ number, title, description, icon }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-700 font-bold text-lg">
          {number}
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h1 bg-green-200"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <div className="text-green-600 mr-2">{icon}</div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TrustItem({ text }) {
  return (
    <li className="flex items-start">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
      <span className="text-blue-800">{text}</span>
    </li>
  );
}