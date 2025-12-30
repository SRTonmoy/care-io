'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { services } from '@/data/services';
import BookingService from '@/lib/booking';
import EmailService from '@/lib/email';

export default function BookingForm({ serviceId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '09:00',
    hours: 4,
    address: '',
    specialRequests: '',
    emergencyContact: '',
    medicalConditions: '',
  });
  const [errors, setErrors] = useState({});
  const [service, setService] = useState(null);

  useEffect(() => {
    const foundService = services.find(s => s.id === parseInt(serviceId));
    setService(foundService);
  }, [serviceId]);

  // Calculate min date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Calculate max date (3 months from now)
  const getMaxDate = () => {
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    return threeMonths.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    // Date validation
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.date && selectedDate < today) {
      newErrors.date = 'Date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate total
      const total = BookingService.calculateTotal(service.price, parseInt(formData.hours));
      
      // Create booking object
      const bookingData = {
        userId: 1, // In real app, get from auth
        serviceId: service.id,
        serviceName: service.name,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        hours: parseInt(formData.hours),
        address: formData.address,
        specialRequests: formData.specialRequests,
        emergencyContact: formData.emergencyContact,
        medicalConditions: formData.medicalConditions,
        total: total,
        status: 'confirmed'
      };
      
      // Create booking
      const booking = await BookingService.createBooking(bookingData);
      
      // Prepare user object for email
      const user = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };
      
      // Send confirmation email
      await EmailService.sendBookingConfirmation(
        formData.email,
        booking,
        service,
        user
      );
      
      // Generate invoice data (for demo)
      const invoiceData = BookingService.generateInvoice(booking, service, user);
      
      // Redirect to success page
      router.push(`/my-bookings?success=true&booking=${booking.bookingNumber}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading booking form...</p>
      </div>
    );
  }

  const totalAmount = service.price * parseInt(formData.hours);
  const tax = totalAmount * 0.08;
  const grandTotal = totalAmount + tax;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Booking Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Book {service.name}</h2>
        <p className="text-blue-100">Complete the form below to schedule your care service</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-b-xl p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {['Personal Info', 'Service Details', 'Review & Confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                index === 0 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 font-medium ${
                index === 0 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < 2 && (
                <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'john@example.com' },
              { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '(555) 123-4567' },
              { label: 'Emergency Contact', name: 'emergencyContact', type: 'text', placeholder: 'Emergency contact name & number' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Service Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                min="06:00"
                max="22:00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours) *
              </label>
              <select
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Additional Information
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Full address including apartment/suite number, city, state, and ZIP code"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Instructions
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                placeholder="Any specific requirements, allergies, medications, or notes for the caregiver..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions (if any)
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                rows="2"
                placeholder="Any medical conditions, disabilities, or special needs we should know about"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{service.name} ({formData.hours} hours)</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Payment will be collected after service completion
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 mr-3"
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the CARE-IO Terms of Service and Privacy Policy. I understand that this booking is subject to 
              caregiver availability and may be rescheduled if needed. Cancellation within 24 hours may incur a fee.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center min-w-[200px] ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}