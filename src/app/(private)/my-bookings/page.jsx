'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BookingService from '@/lib/booking';
import { services } from '@/data/services';

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successBooking, setSuccessBooking] = useState('');

  useEffect(() => {
    // Check for success message
    const success = searchParams.get('success');
    const bookingNumber = searchParams.get('booking');
    
    if (success && bookingNumber) {
      setShowSuccess(true);
      setSuccessBooking(bookingNumber);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }

    // Load bookings
    loadBookings();
  }, [searchParams]);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get bookings for demo user (ID: 1)
      const userBookings = await BookingService.getUserBookings(1);
      setBookings(userBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return booking.status === 'confirmed';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const getServiceById = (id) => {
    return services.find(s => s.id === id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await BookingService.cancelBooking(bookingId);
      await loadBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-green-800">
                  Booking successful! Your booking number is: <strong>{successBooking}</strong>
                </p>
                <p className="text-green-700 text-sm mt-1">
                  A confirmation email has been sent. Our team will contact you shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your care service bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-500' },
            { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-blue-500' },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'bg-red-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {activeTab === 'all' 
                ? "You haven't made any bookings yet. Browse our services to get started."
                : `You don't have any ${activeTab} bookings.`
              }
            </p>
            {activeTab === 'all' && (
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors inline-block"
              >
                Browse Services
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const service = getServiceById(booking.serviceId);
              
              return (
                <div key={booking.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover-lift">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{service?.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Booking #{booking.bookingNumber} • {formatDate(booking.date)} at {booking.time}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Duration</div>
                            <div className="font-medium">{booking.hours} hours</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Caregiver</div>
                            <div className="font-medium">Assigned upon confirmation</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Total Amount</div>
                            <div className="font-medium text-blue-600">${booking.total.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Address</div>
                            <div className="font-medium truncate">{booking.address}</div>
                          </div>
                        </div>
                        
                        {booking.specialRequests && (
                          <div className="mt-4">
                            <div className="text-gray-500 text-sm">Special Requests:</div>
                            <p className="text-gray-700">{booking.specialRequests}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 md:ml-4">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                          Print
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Need to make another booking?</h3>
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-colors inline-block"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}