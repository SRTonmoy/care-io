import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Reference IDs
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  
  // Booking identification
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING',
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    default: 'PENDING',
  },
  
  // Booking details
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
  },
  hours: {
    type: Number,
    required: true,
    min: 1,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  specialRequests: String,
  emergencyContact: String,
  medicalConditions: String,
  
  // Pricing
  hourlyRate: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    code: String,
    amount: Number,
  },
  
  // Cancellation
  cancellationReason: String,
  cancellationDate: Date,
  
  // Review
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for date formatting
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Virtual for status color
bookingSchema.virtual('statusColor').get(function() {
  const colors = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    IN_PROGRESS: 'purple',
    COMPLETED: 'green',
    CANCELLED: 'red',
    REFUNDED: 'gray',
  };
  return colors[this.status] || 'gray';
});

// Virtual population for user
bookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual population for service
bookingSchema.virtual('service', {
  ref: 'Service',
  localField: 'serviceId',
  foreignField: '_id',
  justOne: true,
});

// Virtual population for caregiver
bookingSchema.virtual('caregiver', {
  ref: 'User',
  localField: 'caregiverId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
bookingSchema.index({ bookingNumber: 1 }, { unique: true });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ caregiverId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ location: '2dsphere' });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;