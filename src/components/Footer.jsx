import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    Services: [
      { name: 'Baby Care', href: '/service/1' },
      { name: 'Elderly Care', href: '/service/2' },
      { name: 'Sick Care', href: '/service/3' },
      { name: '24/7 Emergency Care', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
    Contact: [
      { name: '📞 (555) 123-4567', href: 'tel:5551234567' },
      { name: '✉️ support@care.io', href: 'mailto:support@care.io' },
      { name: '📍 123 Care Street, City, State 12345', href: '#' },
      { name: '⏰ 24/7 Support Available', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold">CARE-IO</span>
            </div>
            <p className="text-gray-400 mb-6">
              Providing compassionate, professional care services for your loved ones. 
              Quality caregivers available 24/7.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={`Follow us on ${social}`}
                >
                  <span className="text-lg">{social === 'facebook' ? 'f' : social.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-6 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Stay Updated</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm text-center mt-2">
              Get updates on new services and special offers.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {currentYear} CARE-IO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <p className="text-gray-500 text-sm text-center mt-4">
            CARE-IO is not a licensed medical facility. Our caregivers are certified but not medical doctors.
          </p>
        </div>
      </div>
    </footer>
  );
}