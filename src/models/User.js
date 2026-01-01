import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider; // Password not required for OAuth users
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['USER', 'CAREGIVER', 'ADMIN'],
    default: 'USER',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  
  // OAuth fields
  oauthProvider: {
    type: String,
    enum: ['GOOGLE', 'FACEBOOK', null],
    default: null,
  },
  oauthId: {
    type: String,
  },
  
  // Caregiver specific fields (if role is CAREGIVER)
  caregiverProfile: {
    bio: String,
    experience: { type: Number, default: 0 }, // years
    hourlyRate: Number,
    rating: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    specialties: [String],
    certifications: [{
      name: String,
      issuer: String,
      issuedDate: Date,
      expiryDate: Date,
    }],
    documents: [{
      type: { type: String },
      url: String,
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
    }],
    schedule: [{
      dayOfWeek: Number, // 0 = Sunday
      startTime: String,
      endTime: String,
      isAvailable: Boolean,
    }],
  },

  // Preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  return this.address || '';
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'caregiverProfile.isAvailable': 1 });
userSchema.index({ 'caregiverProfile.specialties': 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;