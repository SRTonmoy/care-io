"use client";


import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Protected from "@/components/Protected";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaFileInvoice,
  FaTrash,
  FaFilter,
  FaSortAmountDown
} from "react-icons/fa";


export default function MyBookingsPage() {
  
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("newest"); 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
  try {
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings");
    
    if (!res.ok) {
      throw new Error("Failed to fetch bookings");
    }
    
    const data = await res.json();
    setBookings(data);
  } catch (err) {
    setError("Failed to load bookings. Please try again.");
  
  } finally {
    setLoading(false);
  }
};

  const cancelBooking = async (id) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Update local state
        setBookings(prev =>
          prev.map(b =>
            b._id === id ? { ...b, status: "Cancelled" } : b
          )
        );
      } else {
        alert("Failed to cancel booking");
      }
    } catch (error) {
      
      alert("Error cancelling booking");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaSpinner className="animate-spin" />;
      case "confirmed":
        return <FaCheckCircle />;
      case "completed":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      if (filter === "all") return true;
      return booking.status?.toLowerCase() === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate);
        case "oldest":
          return new Date(a.createdAt || a.bookingDate) - new Date(b.createdAt || b.bookingDate);
        case "priceHigh":
          return (b.totalCost || 0) - (a.totalCost || 0);
        case "priceLow":
          return (a.totalCost || 0) - (b.totalCost || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Protected>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                <p className="text-green-100">
                  Track and manage all your care service bookings
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={fetchBookings}
                  className="flex items-center space-x-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition"
                >
                  <FaCalendarAlt />
                  <span>Refresh Bookings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {bookings.length}
              </div>
              <p className="text-gray-600">Total Bookings</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {bookings.filter(b => b.status === "Pending").length}
              </div>
              <p className="text-gray-600">Pending</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {bookings.filter(b => b.status === "Confirmed" || b.status === "Completed").length}
              </div>
              <p className="text-gray-600">Confirmed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {bookings.filter(b => b.status === "Cancelled").length}
              </div>
              <p className="text-gray-600">Cancelled</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <span className="font-medium">Filter by:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-lg capitalize transition ${
                        filter === status
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaSortAmountDown className="text-gray-400" />
                  <span className="font-medium">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="priceLow">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === "all" 
                  ? "You haven't made any bookings yet. Book your first service!"
                  : `No ${filter} bookings found.`}
              </p>
              <a
                href="/services"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Browse Services
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {booking.service?.name || booking.serviceName || "Service"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Booking ID: {booking._id?.slice(-8) || "N/A"}
                            </p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status || "Pending"}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <FaCalendarAlt className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Booking Date</p>
                              <p className="font-semibold">
                                {formatDate(booking.createdAt || booking.bookingDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FaClock className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-semibold">
                                {booking.duration || 0} {booking.durationType || "hours"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                              <FaMapMarkerAlt className="text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-semibold">
                                {booking.location?.address || booking.location || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                              <FaMoneyBillWave className="text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Cost</p>
                              <p className="font-semibold text-green-700">
                                ৳{booking.totalCost || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {booking.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => window.location.href = `/service/${booking.service?._id || booking.serviceId}`}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <FaEye />
                          <span>View Service</span>
                        </button>

                        {booking.status === "Pending" && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            <FaTimesCircle />
                            <span>Cancel Booking</span>
                          </button>
                        )}

                        {booking.status === "Completed" && (
                          <button
                            onClick={() => alert("Invoice feature coming soon!")}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                          >
                            <FaFileInvoice />
                            <span>Get Invoice</span>
                          </button>
                        )}

                        <button
                          onClick={() => window.location.href = `/booking/${booking._id}`}
                          className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          <FaEye />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Status Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span>Pending - Waiting for confirmation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>Confirmed - Service approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Completed - Service delivered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span>Cancelled - Booking cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}