import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: String,
    default: 'per hour',
  },
  category: {
    type: String,
    enum: ['BABY', 'ELDERLY', 'SICK', 'DISABILITY', 'POST_SURGERY'],
    required: true,
  },
  image: {
    type: String,
  },
  features: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Statistics
  totalBookings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  
  // Metadata
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  
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

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}/${this.duration}`;
});

// Indexes
serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ 'averageRating': -1 });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;