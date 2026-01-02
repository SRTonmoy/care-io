"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShieldAlt,
  FaHistory,
  FaStar,
  FaCheckCircle,
  FaExclamationCircle,
  FaKey,
  FaLock
} from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/profile");
      return;
    }
    
    if (session?.user && status === "authenticated") {
      fetchUserProfile();
    }
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user profile
      const resUser = await fetch("/api/user/profile");
      let user = {};
      if (resUser.ok) {
        const data = await resUser.json();
        user = data.user;
      } else {
        
        user = {
          name: session.user.name,
          email: session.user.email,
          contact: session.user.contact || "Not set",
          nid: session.user.nid || "Not set",
          role: session.user.role || "user",
          emailVerified: session.user.emailVerified || false,
          phoneVerified: session.user.phoneVerified || false,
          nidVerified: session.user.nidVerified || false,
          createdAt: session.user.createdAt || new Date().toISOString(),
        };
      }

      // Fetch bookings
      const resBookings = await fetch("/api/bookings");
      let bookings = [];
      if (resBookings.ok) {
        bookings = await resBookings.json();
      }

      // Compute stats
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter(b => b.status === "Completed").length;
      const upcomingBookings = bookings.filter(b => b.status === "Pending").length;

      setUserData({
        ...user,
        totalBookings,
        completedBookings,
        upcomingBookings
      });

      setFormData({
        name: user.name,
        contact: user.contact || "",
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(prev => ({ ...prev, name: formData.name, contact: formData.contact }));
        await update({ ...session, user: { ...session.user, name: formData.name } });
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setEditMode(false);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match!" });
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long!" });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setChangePasswordMode(false);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to change password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "Not available";
    }
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified ? (
      <span className="flex items-center text-green-600">
        <FaCheckCircle className="mr-1" /> Verified
      </span>
    ) : (
      <span className="flex items-center text-yellow-600">
        <FaExclamationCircle className="mr-1" /> Not Verified
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!session || !userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
              {session.user?.image ? (
                <img src={session.user.image} alt={userData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <FaUser className="text-white text-4xl" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-green-100">
                {userData.role === "admin" ? "👑 Administrator" : "👤 Member"} • Joined {formatDate(userData.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg transition ${
                editMode ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-green-700 hover:bg-green-50"
              }`}
            >
              {editMode ? <><FaTimes /><span>Cancel</span></> : <><FaEdit /><span>Edit Profile</span></>}
            </button>
            {!editMode && (
              <button
                onClick={() => setChangePasswordMode(!changePasswordMode)}
                className="flex items-center space-x-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition"
              >
                <FaLock />
                <span>Change Password</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Info & Forms */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaUser className="mr-3 text-green-600" />
              Profile Information
            </h2>

            {editMode ? (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleProfileChange} required minLength="2" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input type="tel" name="contact" value={formData.contact} onChange={handleProfileChange} pattern="(\+88)?01[3-9]\d{8}" placeholder="e.g., 01712345678" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <p className="text-sm text-gray-500 mt-1">Bangladeshi phone number format</p>
                </div>
                <button type="submit" disabled={saving} className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  {saving ? <><LoadingSpinner size="small" /><span>Saving...</span></> : <><FaSave /><span>Save Changes</span></>}
                </button>
              </form>
            ) : changePasswordMode ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Password Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
                <div className="pt-4 flex space-x-3">
                  <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    {saving ? <><LoadingSpinner size="small" /><span>Changing...</span></> : <><FaKey /><span>Change Password</span></>}
                  </button>
                  <button type="button" onClick={() => setChangePasswordMode(false)} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Profile Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">{userData.name}</p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">{userData.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{getVerificationBadge(userData.emailVerified)}</p>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="font-semibold text-gray-900">{userData.contact || "Not set"}</p>
                      <p className="text-xs text-gray-500 mt-1">{getVerificationBadge(userData.phoneVerified)}</p>
                    </div>
                  </div>
                  {/* NID */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaIdCard className="text-orange-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NID Number</p>
                      <p className="font-semibold text-gray-900">{userData.nid || "Not set"}</p>
                      <p className="text-xs text-gray-500 mt-1">{getVerificationBadge(userData.nidVerified)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaStar className="mr-3 text-yellow-500" /> Account Statistics
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                <div className="text-3xl font-bold text-green-700 mb-2">{userData.totalBookings || 0}</div>
                <p className="text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-blue-700 mb-2">{userData.completedBookings || 0}</div>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <div className="text-3xl font-bold text-yellow-700 mb-2">{userData.upcomingBookings || 0}</div>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
        </div>
{/* Right Column - Quick Actions & Security */}
<div className="space-y-8">
  {/* Account Type */}
  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Type</h2>
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
        {userData.role === "admin" ? "👑" : "👤"}
      </div>
      <div>
        <p className="font-bold text-gray-900">
          {userData.role === "admin" ? "Administrator" : "Standard User"}
        </p>
        <p className="text-sm text-gray-600">
          {userData.role === "admin" 
            ? "Full access to all features" 
            : "Access to booking and profile features"
          }
        </p>
      </div>
    </div>
    {userData.role === "user" && (
      <button className="w-full mt-4 py-2 bg-white border border-green-300 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition">
        Upgrade to Premium
      </button>
    )}
  </div>

  {/* Quick Actions */}
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
    <div className="space-y-4">
      <button
        onClick={() => router.push("/my-bookings")}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FaHistory className="text-green-600" />
          </div>
          <span className="font-medium">My Bookings</span>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          {userData.totalBookings || 0} bookings
        </div>
      </button>

      <button
        onClick={() => router.push("/booking")}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaCalendarAlt className="text-blue-600" />
          </div>
          <span className="font-medium">Book New Service</span>
        </div>
        <div className="text-gray-400">→</div>
      </button>
    </div>
  </div>

  {/* Help & Support */}
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
    <p className="text-gray-600 mb-4">
      Contact our support team for any questions about your account or services.
    </p>
    <div className="space-y-3">
      <a 
        href="tel:01752649293"
        className="flex items-center space-x-2 text-green-600 hover:text-green-700"
      >
        <FaPhone />
        <span>01752-649293</span>
      </a>
      <a 
        href="mailto:support@care.io"
        className="flex items-center space-x-2 text-green-600 hover:text-green-700"
      >
        <FaEnvelope />
        <span>support@care.io</span>
      </a>
    </div>
  </div>
</div>

        {/* Right Column / Sidebar */}
        <div className="space-y-8">
          {/* Placeholder for future content like recent activity or notifications */}
        </div>
      </div>

      {message.text && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg text-white font-semibold ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {message.text}
        </div>
      )}

    </div>
    

     


    
  );
}
