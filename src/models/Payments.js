import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // Reference IDs
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    default: 'PENDING',
  },
  paymentMethod: {
    type: String,
    enum: ['CARD', 'BANK_TRANSFER', 'CASH', 'PAYPAL'],
    required: true,
  },
  
  // Stripe integration
  stripePaymentId: String,
  stripeCustomerId: String,
  stripeSessionId: String,
  receiptUrl: String,
  
  // Refund details
  refundAmount: Number,
  refundReason: String,
  refundDate: Date,
  
  // Error handling
  errorMessage: String,
  errorCode: String,
  
  // Metadata
  metadata: {
    type: Map,
    of: String,
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
});

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency || 'USD',
  }).format(this.amount);
});

// Virtual for status color
paymentSchema.virtual('statusColor').get(function() {
  const colors = {
    PENDING: 'yellow',
    PAID: 'green',
    FAILED: 'red',
    REFUNDED: 'gray',
    PARTIALLY_REFUNDED: 'orange',
  };
  return colors[this.status] || 'gray';
});

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripePaymentId: 1 }, { sparse: true });
paymentSchema.index({ stripeCustomerId: 1 }, { sparse: true });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;