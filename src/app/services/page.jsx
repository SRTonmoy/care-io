import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import ServiceCard from "@/components/ServiceCard";
import { FaSearch, FaFilter, FaStar, FaClock, FaShieldAlt } from "react-icons/fa";

export const metadata = {
  title: "Our Services | Care.IO",
  description: "Browse professional baby care, elderly care, sick care, and special care services. Find the perfect caregiver for your needs.",
};

async function getServices() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
   
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  
  // Get unique categories for filtering
  const categories = [...new Set(services.map(service => service.category))];
  
  // Count services by category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = services.filter(s => s.category === category).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Professional Care Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Choose from our range of specialized care services, each designed to meet 
              specific needs with professionalism and compassion.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative w-full max-w-2xl mx-auto">
  <input
    type="text"
    placeholder="Search services (baby care, elderly, nursing, etc.)"
    className="w-full px-6 py-4 pr-14 rounded-2xl text-gray-900 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
  />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FaFilter className="mr-2 text-green-600" />
                Filter Services
              </h2>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-green-600 rounded" defaultChecked />
                      <span className="ml-2">All Services</span>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {services.length}
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                        <span className="ml-2">{category}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {categoryCounts[category]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" defaultChecked />
                    <span className="ml-2">All Prices</span>
                  </label>
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2">Under ৳1000/day</span>
                  </label>
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2">৳1000 - ৳2000/day</span>
                  </label>
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2">Over ৳2000/day</span>
                  </label>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Duration</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="ml-2">Short-term (1-7 days)</span>
                  </label>
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="ml-2">Medium-term (1-4 weeks)</span>
                  </label>
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                    <span className="ml-2">Long-term (1+ months)</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
                Apply Filters
              </button>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mt-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4">Why Choose Care.IO</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaShieldAlt className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">Verified & background-checked caregivers</span>
                </li>
                <li className="flex items-start">
                  <FaStar className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">4.9/5 customer satisfaction rating</span>
                </li>
                <li className="flex items-start">
                  <FaClock className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-sm">24/7 support and emergency services</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content - Services Grid */}
          <div className="lg:col-span-3">
            {/* Services Stats */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Services
                  </h2>
                  <p className="text-gray-600">
                    {services.length} professional care services available
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Sort by: Recommended</option>
                    <option>Sort by: Price (Low to High)</option>
                    <option>Sort by: Price (High to Low)</option>
                    <option>Sort by: Rating</option>
                    <option>Sort by: Newest</option>
                  </select>
                </div>
              </div>

              {/* Services Grid */}
              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
                  <p className="text-gray-600 mb-6">
                    We're currently updating our service offerings. Please check back soon!
                  </p>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                    Contact Us for Services
                  </button>
                </div>
              )}

              {/* Pagination (if needed in future) */}
              {services.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                      &laquo;
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg">
                      1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                      2
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                      3
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                      &raquo;
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Service Categories Explanation */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Understanding Our Service Categories
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Baby Care Services</h4>
                  <p className="text-gray-600 text-sm">
                    Professional babysitters for infants and children. Includes feeding, 
                    playtime, educational activities, and safety supervision.
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Elderly Care Services</h4>
                  <p className="text-gray-600 text-sm">
                    Compassionate care for seniors including companionship, medication 
                    reminders, mobility assistance, and daily living support.
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Sick Care Services</h4>
                  <p className="text-gray-600 text-sm">
                    Specialized nursing care for patients recovering from illness or surgery. 
                    Includes medication management and health monitoring.
                  </p>
                </div>
                <div className="p-6 bg-orange-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-2">Special Care Services</h4>
                  <p className="text-gray-600 text-sm">
                    Customized care for specific needs including post-operative care, 
                    dementia care, palliative care, and disability support.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg p-8 mt-12 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Can't Find What You Need?</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                We offer customized care solutions. Contact us for personalized service 
                packages tailored to your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition">
                  Request Custom Service
                </button>
                <a href="tel:01752649293" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-green-700 transition">
                  Call: 01752-649293
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}