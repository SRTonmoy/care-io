"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Protected from "@/components/Protected";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaUser,
  FaPhone,
  FaHome,
  FaCheckCircle
} from "react-icons/fa";

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
 const rawId = params?.id;
const serviceId = Array.isArray(rawId) ? rawId[0] : rawId;

  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    duration: 4,
    durationType: "hours",
    location: {
      division: "",
      district: "",
      city: "",
      area: "",
      address: ""
    },
    notes: ""
  });

  // Bangladeshi divisions and districts data
  const divisions = [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna", 
    "Barishal", "Sylhet", "Rangpur", "Mymensingh"
  ];

  const districtsByDivision = {
    "Dhaka": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj"],
    "Chattogram": ["Chattogram", "Cox's Bazar", "Rangamati", "Bandarban"],
    "Rajshahi": ["Rajshahi", "Bogura", "Pabna", "Sirajganj"],
    "Khulna": ["Khulna", "Jessore", "Satkhira", "Bagerhat"],
    "Barishal": ["Barishal", "Patuakhali", "Bhola", "Jhalokathi"],
    "Sylhet": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    "Rangpur": ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram"],
    "Mymensingh": ["Mymensingh", "Sherpur", "Jamalpur", "Netrokona"]
  };

  useEffect(() => {
  if (!serviceId) return;
  fetchService();
}, [serviceId]);


  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${serviceId}`);
      const data = await res.json();
      setService(data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setBooking(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotalCost = () => {
    if (!service) return 0;
    
    const dailyRate = service.pricePerDay || 0;
    let total = 0;
    
    if (booking.durationType === "hours") {
      const hourlyRate = Math.round(dailyRate / 8);
      total = hourlyRate * booking.duration;
    } else {
      total = dailyRate * booking.duration;
    }
    
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bookingData = {
      serviceId,
      userId: session.user.id,
      duration: parseInt(booking.duration),
      durationType: booking.durationType,
      location: booking.location,
      totalCost: calculateTotalCost(),
      notes: booking.notes
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        // Send email invoice (optional)
        await sendEmailInvoice(bookingData);
        
        alert("Booking confirmed! Check your email for invoice.");
        router.push("/my-bookings");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      
      alert("Error creating booking.");
    }
  };

  const sendEmailInvoice = async (bookingData) => {
    try {
      await fetch("/api/email/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          userName: session.user.name,
          bookingData,
          serviceName: service.name
        })
      });
    } catch (error) {
     
    }
  };

  if (loading) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </Protected>
    );
  }

  if (!service) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <button onClick={() => router.push("/services")} className="bg-green-600 text-white px-6 py-3 rounded-lg">
              Browse Services
            </button>
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Service</h1>
            <p className="text-gray-600">Complete the form below to book: {service.name}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Duration */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">1</span>
                      Select Duration
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={booking.duration}
                          onChange={handleInputChange}
                          min="1"
                          max="30"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          name="durationType"
                          value={booking.durationType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Location */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">2</span>
                      Select Location
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Division
                          </label>
                          <select
                            name="location.division"
                            value={booking.location.division}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Division</option>
                            {divisions.map(div => (
                              <option key={div} value={div}>{div}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            District
                          </label>
                          <select
                            name="location.district"
                            value={booking.location.district}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                            disabled={!booking.location.division}
                          >
                            <option value="">Select District</option>
                            {booking.location.division && 
                              districtsByDivision[booking.location.division]?.map(district => (
                                <option key={district} value={district}>{district}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="location.city"
                            value={booking.location.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Area
                          </label>
                          <input
                            type="text"
                            name="location.area"
                            value={booking.location.area}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address
                        </label>
                        <textarea
                          name="location.address"
                          value={booking.location.address}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="House number, street, landmarks..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={booking.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition shadow-lg hover:shadow-xl"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                {/* Service Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Service Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Caregiver Type</p>
                        <p className="font-semibold">{service.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Daily Rate</p>
                        <p className="font-semibold">৳{service.pricePerDay}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Hourly Rate</p>
                        <p className="font-semibold">৳{Math.round(service.pricePerDay / 8)}/hour</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Cost Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate</span>
                      <span>
                        ৳{booking.durationType === "hours" 
                          ? Math.round(service.pricePerDay / 8) 
                          : service.pricePerDay}/{booking.durationType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span>{booking.duration} {booking.durationType}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold">Total Cost</span>
                        <span className="text-2xl font-bold text-green-700">
                          ৳{calculateTotalCost()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">
                      <FaCheckCircle className="inline text-green-500 mr-1" />
                      Payment can be made after booking confirmation
                    </p>
                  </div>
                </div>

                {/* Help Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Call us for assistance with booking:
                  </p>
                  <a 
                    href="tel:01752649293" 
                    className="flex items-center text-green-600 font-semibold hover:text-green-700"
                  >
                    <FaPhone className="mr-2" />
                    01752-649293
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}