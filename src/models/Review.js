import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Reference IDs
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  
  // Rating breakdown
  criteria: {
    professionalism: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0,
  },
  voterIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  
  // Response from caregiver
  response: {
    text: String,
    respondedAt: Date,
  },
  
  // Flags
  isReported: {
    type: Boolean,
    default: false,
  },
  reportReason: String,
  
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

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Indexes
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ caregiverId: 1 });
reviewSchema.index({ serviceId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ caregiverId: 1, rating: 1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;