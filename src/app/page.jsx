import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";
import { FaStar, FaCheckCircle, FaShieldAlt, FaUsers } from "react-icons/fa";
import HeroSlider from "@/components/HeroSlider";

export const metadata = {
  title: "Care.IO | Trusted Care Services in Bangladesh",
  description: "Book professional baby care, elderly care, and sick care services easily. Verified caregivers, secure booking, and reliable service across Bangladesh.",
};

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/services`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }
    
    return await res.json();
  } catch (error) {
    
    return [];
  }
}

export default async function HomePage() {
  const services = (await getServices()).slice(0, 6);


  return (
    <main className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />


      {/* Success Metrics */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FaUsers className="text-4xl text-green-600" />
              </div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-600">Happy Families</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FaCheckCircle className="text-4xl text-green-600" />
              </div>
              <h3 className="text-3xl font-bold">200+</h3>
              <p className="text-gray-600">Verified Caregivers</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FaShieldAlt className="text-4xl text-green-600" />
              </div>
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-gray-600">Secure Booking</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FaStar className="text-4xl text-green-600" />
              </div>
              <h3 className="text-3xl font-bold">4.9/5</h3>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission at Care.IO
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                We're dedicated to making caregiving <span className="font-semibold text-green-600">easy, secure, and accessible</span> for everyone in Bangladesh. 
                Whether you need a babysitter for your child, support for an elderly family member, 
                or specialized care for a sick relative, we connect you with trusted, verified caregivers.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our platform ensures <span className="font-semibold">safety, reliability, and peace of mind</span> 
                through rigorous verification processes, transparent pricing, and 24/7 customer support.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Background-verified caregivers</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Flexible scheduling options</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Secure online payment</span>
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Available across all divisions of Bangladesh</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/family-care.jpg" 
                alt="Family Care" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-xl shadow-lg">
                <h4 className="text-xl font-bold">24/7 Support</h4>
                <p className="text-sm">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Professional Care Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our range of specialized care services, each designed to meet specific needs 
              with professionalism and compassion.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading services...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real stories from families we've helped
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-green-700">SA</span>
                </div>
                <div>
                  <h4 className="font-bold">Sarah Ahmed</h4>
                  <p className="text-sm text-gray-500">Mother of two, Dhaka</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                "The baby care service has been a lifesaver for our family. The caregivers are professional, 
                and we always feel our children are in safe hands. Highly recommended!"
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-green-700">MR</span>
                </div>
                <div>
                  <h4 className="font-bold">Md. Rahman</h4>
                  <p className="text-sm text-gray-500">Son, Chattogram</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                "My elderly father needed constant care, and Care.IO provided the perfect solution. 
                The caregiver is compassionate and professional. Thank you for this wonderful service!"
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-green-700">TF</span>
                </div>
                <div>
                  <h4 className="font-bold">Tasnim Farzana</h4>
                  <p className="text-sm text-gray-500">Daughter, Khulna</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                "The sick care service helped us through a difficult time. The nurse was knowledgeable 
                and caring. The booking process was smooth, and the service was excellent."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-700 to-teal-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of families who trust Care.IO for their caregiving needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition duration-300"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-green-700 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}