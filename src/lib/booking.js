import connectDB from './db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Service from '@/models/Service';
import Payment from '@/models/Payment';
import Notification from '@/models/Notification';

export class BookingService {
  // Connect to database
  static async connect() {
    await connectDB();
  }

  // Create a new booking
  static async createBooking(bookingData) {
    await this.connect();
    
    try {
      // Generate booking number
      const bookingNumber = `BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Create booking
      const booking = new Booking({
        bookingNumber,
        ...bookingData,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      });

      await booking.save();

      // Update service statistics
      await Service.findByIdAndUpdate(bookingData.serviceId, {
        $inc: { totalBookings: 1 }
      });

      // Create notification
      const notification = new Notification({
        userId: bookingData.userId,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        message: `Your booking #${bookingNumber} has been confirmed.`,
        data: {
          bookingId: booking._id,
          bookingNumber,
          serviceId: bookingData.serviceId,
        },
      });
      await notification.save();

      return booking;
    } catch (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  // Get booking by ID
  static async getBookingById(bookingId) {
    await this.connect();
    
    try {
      const booking = await Booking.findById(bookingId)
        .populate('userId', 'name email phone')
        .populate('serviceId', 'name price category')
        .populate('caregiverId', 'name email phone caregiverProfile')
        .lean();

      return booking;
    } catch (error) {
      throw new Error(`Failed to get booking: ${error.message}`);
    }
  }

  // Get booking by booking number
  static async getBookingByNumber(bookingNumber) {
    await this.connect();
    
    try {
      const booking = await Booking.findOne({ bookingNumber })
        .populate('userId', 'name email phone')
        .populate('serviceId', 'name price category')
        .populate('caregiverId', 'name email phone caregiverProfile')
        .lean();

      return booking;
    } catch (error) {
      throw new Error(`Failed to get booking: ${error.message}`);
    }
  }

  // Get all bookings for a user
  static async getUserBookings(userId, { page = 1, limit = 10, status } = {}) {
    await this.connect();
    
    try {
      const query = { userId };
      
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('serviceId', 'name price category')
          .populate('caregiverId', 'name caregiverProfile')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Booking.countDocuments(query),
      ]);

      return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to get user bookings: ${error.message}`);
    }
  }

  // Get all bookings (admin)
  static async getAllBookings({ page = 1, limit = 20, status, dateFrom, dateTo } = {}) {
    await this.connect();
    
    try {
      const query = {};
      
      if (status) {
        query.status = status;
      }
      
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }

      const skip = (page - 1) * limit;
      
      const [bookings, total] = await Promise.all([
        Booking.find(query)
          .populate('userId', 'name email')
          .populate('serviceId', 'name category')
          .populate('caregiverId', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Booking.countDocuments(query),
      ]);

      return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to get all bookings: ${error.message}`);
    }
  }

  // Update booking
  static async updateBooking(bookingId, updates) {
    await this.connect();
    
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { $set: updates },
        { new: true }
      )
        .populate('userId', 'name email phone')
        .populate('serviceId', 'name price category');

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Create notification if status changed
      if (updates.status && updates.status !== booking.status) {
        const notification = new Notification({
          userId: booking.userId._id,
          type: `BOOKING_${updates.status}`,
          title: `Booking ${updates.status}`,
          message: `Your booking #${booking.bookingNumber} status has been updated to ${updates.status}.`,
          data: {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            newStatus: updates.status,
          },
        });
        await notification.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId, reason) {
    await this.connect();
    
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          $set: {
            status: 'CANCELLED',
            cancellationReason: reason,
            cancellationDate: new Date(),
          }
        },
        { new: true }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Create cancellation notification
      const notification = new Notification({
        userId: booking.userId,
        type: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled',
        message: `Your booking #${booking.bookingNumber} has been cancelled.`,
        data: {
          bookingId: booking._id,
          bookingNumber: booking.bookingNumber,
          reason,
        },
      });
      await notification.save();

      return booking;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    }
  }

  // Assign caregiver to booking
  static async assignCaregiver(bookingId, caregiverId) {
    await this.connect();
    
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { $set: { caregiverId, status: 'CONFIRMED' } },
        { new: true }
      )
        .populate('userId', 'name email phone')
        .populate('caregiverId', 'name email phone caregiverProfile');

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Create notifications for both user and caregiver
      const notifications = [
        new Notification({
          userId: booking.userId._id,
          type: 'CAREGIVER_ASSIGNED',
          title: 'Caregiver Assigned',
          message: `A caregiver has been assigned to your booking #${booking.bookingNumber}.`,
          data: {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            caregiverId: caregiverId,
          },
        }),
        new Notification({
          userId: caregiverId,
          type: 'BOOKING_ASSIGNED',
          title: 'New Booking Assigned',
          message: `You have been assigned to booking #${booking.bookingNumber}.`,
          data: {
            bookingId: booking._id,
            bookingNumber: booking.bookingNumber,
            userId: booking.userId._id,
          },
        }),
      ];

      await Promise.all(notifications.map(n => n.save()));

      return booking;
    } catch (error) {
      throw new Error(`Failed to assign caregiver: ${error.message}`);
    }
  }

  // Complete booking
  static async completeBooking(bookingId) {
    await this.connect();
    
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { $set: { status: 'COMPLETED' } },
        { new: true }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update caregiver stats
      if (booking.caregiverId) {
        await User.findByIdAndUpdate(booking.caregiverId, {
          $inc: { 'caregiverProfile.totalJobs': 1 }
        });
      }

      // Create completion notification
      const notification = new Notification({
        userId: booking.userId,
        type: 'REVIEW_REQUEST',
        title: 'How was your service?',
        message: `Your booking #${booking.bookingNumber} has been completed. Please leave a review.`,
        data: {
          bookingId: booking._id,
          bookingNumber: booking.bookingNumber,
        },
      });
      await notification.save();

      return booking;
    } catch (error) {
      throw new Error(`Failed to complete booking: ${error.message}`);
    }
  }

  // Calculate total price
  static calculateTotal(servicePrice, hours, extras = []) {
    const basePrice = servicePrice * hours;
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    const tax = (basePrice + extrasTotal) * 0.08; // 8% tax
    return {
      subtotal: basePrice + extrasTotal,
      tax,
      total: basePrice + extrasTotal + tax,
    };
  }

  // Get booking statistics
  static async getStatistics(userId = null) {
    await this.connect();
    
    try {
      const matchStage = userId ? { userId } : {};
      
      const stats = await Booking.aggregate([
        { $match: matchStage },
        {
          $facet: {
            totalBookings: [{ $count: 'count' }],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ],
            byService: [
              { 
                $lookup: {
                  from: 'services',
                  localField: 'serviceId',
                  foreignField: '_id',
                  as: 'service'
                }
              },
              { $unwind: '$service' },
              { $group: { _id: '$service.category', count: { $sum: 1 } } }
            ],
            revenue: [
              { 
                $group: { 
                  _id: null, 
                  totalRevenue: { $sum: '$finalAmount' },
                  avgBookingValue: { $avg: '$finalAmount' }
                }
              }
            ],
            monthlyRevenue: [
              {
                $group: {
                  _id: { 
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                  },
                  revenue: { $sum: '$finalAmount' },
                  bookings: { $sum: 1 }
                }
              },
              { $sort: { '_id.year': -1, '_id.month': -1 } },
              { $limit: 6 }
            ]
          }
        }
      ]);

      // Format results
      const result = {
        totalBookings: stats[0]?.totalBookings[0]?.count || 0,
        byStatus: {},
        byService: {},
        totalRevenue: stats[0]?.revenue[0]?.totalRevenue || 0,
        avgBookingValue: stats[0]?.revenue[0]?.avgBookingValue || 0,
        monthlyRevenue: stats[0]?.monthlyRevenue || [],
      };

      // Format status stats
      stats[0]?.byStatus?.forEach(item => {
        result.byStatus[item._id] = item.count;
      });

      // Format service stats
      stats[0]?.byService?.forEach(item => {
        result.byService[item._id] = item.count;
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  // Get upcoming bookings
  static async getUpcomingBookings(userId, days = 7) {
    await this.connect();
    
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const bookings = await Booking.find({
        userId,
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['CONFIRMED', 'IN_PROGRESS'] }
      })
        .populate('serviceId', 'name category')
        .populate('caregiverId', 'name phone caregiverProfile')
        .sort({ date: 1 })
        .lean();

      return bookings;
    } catch (error) {
      throw new Error(`Failed to get upcoming bookings: ${error.message}`);
    }
  }

  // Search bookings
  static async searchBookings(query, { page = 1, limit = 20 } = {}) {
    await this.connect();
    
    try {
      const searchQuery = {
        $or: [
          { bookingNumber: { $regex: query, $options: 'i' } },
        ]
      };

      const skip = (page - 1) * limit;
      
      const [bookings, total] = await Promise.all([
        Booking.find(searchQuery)
          .populate('userId', 'name email')
          .populate('serviceId', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Booking.countDocuments(searchQuery),
      ]);

      return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to search bookings: ${error.message}`);
    }
  }
}

export default BookingService;