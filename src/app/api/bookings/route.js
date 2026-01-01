import { NextResponse } from 'next/server';
import BookingService from '@/lib/booking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/bookings
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    const bookingNumber = searchParams.get('bookingNumber');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Check if user is admin
    const isAdmin = session.user.role === 'ADMIN';

    if (bookingId) {
      const booking = await BookingService.getBookingById(bookingId);
      
      // Check permissions
      if (!isAdmin && booking.userId._id.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, booking });
    }

    if (bookingNumber) {
      const booking = await BookingService.getBookingByNumber(bookingNumber);
      
      // Check permissions
      if (!isAdmin && booking.userId._id.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, booking });
    }

    // Get bookings based on user role
    let result;
    if (isAdmin) {
      result = await BookingService.getAllBookings({ page, limit, status });
    } else {
      result = await BookingService.getUserBookings(session.user.id, { page, limit, status });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/bookings
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookingData = await request.json();
    
    // Add user ID from session
    bookingData.userId = session.user.id;

    // Validate required fields
    const requiredFields = ['serviceId', 'date', 'startTime', 'hours', 'address'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate pricing
    const { calculateTotal } = await import('@/lib/booking');
    const service = await import('@/models/Service').then(m => m.default);
    const db = await import('@/lib/db').then(m => m.default);
    await db.connect();
    
    const serviceDoc = await service.findById(bookingData.serviceId);
    if (!serviceDoc) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const pricing = BookingService.calculateTotal(serviceDoc.price, bookingData.hours);
    
    bookingData.hourlyRate = serviceDoc.price;
    bookingData.totalAmount = pricing.subtotal;
    bookingData.taxAmount = pricing.tax;
    bookingData.finalAmount = pricing.total;

    // Create booking
    const booking = await BookingService.createBooking(bookingData);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      );
    }

    // Get booking to check permissions
    const booking = await BookingService.getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = booking.userId._id.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Non-admins can only cancel their own bookings
    if (!isAdmin && updates.status && updates.status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Only administrators can update booking status' },
        { status: 403 }
      );
    }

    const updatedBooking = await BookingService.updateBooking(id, updates);
    
    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, reason } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      );
    }

    // Get booking to check permissions
    const booking = await BookingService.getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = booking.userId._id.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Only allow cancellation, not deletion
    const cancelledBooking = await BookingService.cancelBooking(id, reason || 'Cancelled by user');
    
    return NextResponse.json({
      success: true,
      booking: cancelledBooking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}