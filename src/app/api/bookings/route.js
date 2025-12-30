import BookingService from '@/lib/booking';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookingId = searchParams.get('id');
    const bookingNumber = searchParams.get('bookingNumber');

    if (bookingId) {
      const booking = await BookingService.getBookingById(parseInt(bookingId));
      if (booking) {
        return Response.json({ success: true, booking });
      } else {
        return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }
    }

    if (bookingNumber) {
      const booking = await BookingService.getBookingByNumber(bookingNumber);
      if (booking) {
        return Response.json({ success: true, booking });
      } else {
        return Response.json({ success: false, error: 'Booking not found' }, { status: 404 });
      }
    }

    if (userId) {
      const bookings = await BookingService.getUserBookings(parseInt(userId));
      return Response.json({ success: true, bookings });
    }

    return Response.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const bookingData = await request.json();
    const booking = await BookingService.createBooking(bookingData);
    
    return Response.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return Response.json({ success: false, error: 'Booking ID required' }, { status: 400 });
    }

    const booking = await BookingService.updateBooking(parseInt(id), updates);
    
    return Response.json({
      success: true,
      booking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return Response.json({ success: false, error: 'Booking ID required' }, { status: 400 });
    }

    const booking = await BookingService.cancelBooking(parseInt(id));
    
    return Response.json({
      success: true,
      booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}