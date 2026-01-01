import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for non-Google users
      }
    },
    nid: {
      type: String,
      required: function() {
        return !this.googleId; // Only required for non-Google users
      },
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    googleId: {
      type: String,
      sparse: true // Allows null values while maintaining uniqueness
    },
    image: {
      type: String
    },
    role: { 
      type: String, 
      default: "user",
      enum: ["user", "admin"]
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    nidVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "suspended", "deleted"]
    },
    lastLogin: {
      type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { 
    timestamps: true // This adds createdAt and updatedAt automatically
  }
);

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for formatted createdAt
UserSchema.virtual("joinedDate").get(function() {
  return this.createdAt.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);