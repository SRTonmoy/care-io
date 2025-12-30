'use client';

import { useState } from 'react';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import { services, testimonials } from '@/data/services';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  const stats = [
    { number: '500+', label: 'Happy Families' },
    { number: '50+', label: 'Certified Caregivers' },
    { number: '24/7', label: 'Available Support' },
    { number: '100%', label: 'Safety Verified' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Care Services for Your <span className="text-blue-200">Loved Ones</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Trusted baby care, elderly care, and sick care services. Certified caregivers 
              available 24/7. Your peace of mind is our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-center"
              >
                Book a Caregiver
              </Link>
              <Link
                href="#services"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,192C672,181,768,139,864,138.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-6 bg-white rounded-xl shadow-md hover-lift"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Care Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide specialized care services tailored to meet the unique needs 
              of your loved ones with compassion and professionalism.
            </p>
          </div>

          {/* Service Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveFilter('baby')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === 'baby'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Baby Care
            </button>
            <button
              onClick={() => setActiveFilter('elderly')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === 'elderly'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Elderly Care
            </button>
            <button
              onClick={() => setActiveFilter('sick')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === 'sick'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sick Care
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get the care you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Service',
                description: 'Select from baby care, elderly care, or sick care services based on your needs.',
                icon: '📋'
              },
              {
                step: '2',
                title: 'Book & Schedule',
                description: 'Pick a date and time that works for you. Fill out our simple booking form.',
                icon: '📅'
              },
              {
                step: '3',
                title: 'Receive Quality Care',
                description: 'Our certified caregiver arrives and provides professional, compassionate care.',
                icon: '❤️'
              }
            ].map((step) => (
              <div 
                key={step.step} 
                className="bg-white p-8 rounded-xl shadow-lg hover-lift text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">Step {step.step}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what families have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {'★'.repeat(testimonial.rating)}
                  {'☆'.repeat(5 - testimonial.rating)}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                <div className="mt-4 text-sm text-gray-500">
                  {testimonial.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of families who trust CARE-IO for their loved ones' care needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Login to Book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}