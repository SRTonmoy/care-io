// Booking service with in-memory storage
// In production, replace with database

let bookings = [];
let bookingCounter = 1;

export class BookingService {
  // Create a new booking
  static async createBooking(bookingData) {
    const bookingNumber = `BK${Date.now().toString().slice(-8)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const booking = {
      id: bookingCounter++,
      bookingNumber,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    bookings.push(booking);
    return booking;
  }

  // Get all bookings for a user
  static async getUserBookings(userId) {
    return bookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get booking by ID
  static async getBookingById(id) {
    return bookings.find(booking => booking.id === id);
  }

  // Get booking by booking number
  static async getBookingByNumber(bookingNumber) {
    return bookings.find(booking => booking.bookingNumber === bookingNumber);
  }

  // Update booking
  static async updateBooking(id, updates) {
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return bookings[bookingIndex];
  }

  // Cancel booking
  static async cancelBooking(id) {
    return this.updateBooking(id, { status: 'cancelled' });
  }

  // Complete booking
  static async completeBooking(id) {
    return this.updateBooking(id, { status: 'completed', paymentStatus: 'paid' });
  }

  // Calculate total price
  static calculateTotal(servicePrice, hours, extras = []) {
    const basePrice = servicePrice * hours;
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
    return basePrice + extrasTotal;
  }

  // Generate invoice data
  static generateInvoice(booking, service, user) {
    const subtotal = booking.total;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    return {
      invoiceNumber: `INV${booking.bookingNumber.slice(2)}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      from: {
        name: "CARE-IO Services",
        address: "123 Care Street, Healthcare City, HC 12345",
        phone: "(555) 123-4567",
        email: "billing@care.io"
      },
      to: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: booking.address || user.address
      },
      items: [
        {
          description: `${service.name} Service`,
          quantity: booking.hours,
          rate: `$${service.price}/${service.duration}`,
          amount: subtotal
        }
      ],
      subtotal,
      tax,
      total,
      paymentInstructions: "Payment due within 7 days. You can pay via credit card, bank transfer, or cash."
    };
  }

  // Get booking statistics
  static getStatistics(userId) {
    const userBookings = bookings.filter(booking => booking.userId === userId);
    
    return {
      total: userBookings.length,
      confirmed: userBookings.filter(b => b.status === 'confirmed').length,
      completed: userBookings.filter(b => b.status === 'completed').length,
      cancelled: userBookings.filter(b => b.status === 'cancelled').length,
      totalSpent: userBookings.reduce((sum, booking) => sum + booking.total, 0)
    };
  }
}

export default BookingService;