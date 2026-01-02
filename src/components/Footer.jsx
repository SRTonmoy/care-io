"use client";
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    "Our Services": [
      { name: 'Baby Care Service', href: '/' },
      { name: 'Elderly Care Service', href: '/' },
      { name: 'Sick People Care', href: '/' },
      { name: '24/7 Emergency Care', href: '/' },
    ],
    "Quick Links": [
      { name: 'About Care.IO', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Caregiver Registration', href: '/caregiver-register' },
    ],
    "Support": [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    "Bangladesh Offices": [
      { name: 'Dhaka: 123 Care Tower, Gulshan', href: '#' },
      { name: 'Chattogram: Care Plaza, Agrabad', href: '#' },
      { name: 'Khulna: Care House, Sonadanga', href: '#' },
      { name: 'Rajshahi: Care Center, Shaheb Bazar', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div>
                <span className="text-3xl font-bold">Care<span className="text-green-400">.IO</span></span>
                <p className="text-green-400 text-sm">Bangladesh's Trusted Care Platform</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We connect families with verified caregivers across Bangladesh. 
              Our mission is to make professional care services accessible, 
              affordable, and reliable for every household.
            </p>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${social.color} transition-all duration-300 transform hover:-translate-y-1`}
                  aria-label={`Follow us on ${social.label}`}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full mr-2 group-hover:bg-green-400"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FaPhone className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Emergency Hotline</p>
                <p className="text-white font-bold text-lg">01752-649293</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Support</p>
                <p className="text-white font-bold">support@care.io</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FaClock className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Service Hours</p>
                <p className="text-white font-bold">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Care Services</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to get updates on new services, special offers, and caregiving tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                &copy; {currentYear} Care.IO Bangladesh. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Made with <FaHeart className="inline text-red-500 mx-1" /> for families in Bangladesh
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Caregiver Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
          
          {/* Regulatory Info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Care.IO is registered under Bangladesh ICT Division. License No: CARE-BD-2024-001
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Disclaimer: Our caregivers are certified professionals. For medical emergencies, please contact local hospitals immediately.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}