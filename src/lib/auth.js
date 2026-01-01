import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from '@/models/User';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function getAuthToken() {
  return cookies().get("auth-token")?.value || null;
}

export function requireAuth() {
  const token = getAuthToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

let User;
let connectDB;

// Dynamically import server-side modules
if (typeof window === 'undefined') {
  User = require('@/models/User').default;
  connectDB = require('./db-server').default;
}

export class AuthService {
  // Connect to database (server only)
  static async connect() {
    if (typeof window !== 'undefined') {
      throw new Error('AuthService cannot be used on client side');
    }
    await connectDB();
  }

  // All other methods remain the same, but add server check
  static async register(userData) {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot call register from client');
    }
    
    await this.connect();
    // ... rest of your register code
  }
  
  // Add this check to ALL methods
  static ensureServerSide() {
    if (typeof window !== 'undefined') {
      throw new Error('This method can only be called on server side');
    }
  }
}

export class AuthService {
  // Connect to database
  static async connect() {
    await connectDB();
  }

  // Register new user with MongoDB
  static async register(userData) {
    await this.connect();
    
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        role: 'USER',
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;

      return { user: userObject, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // Login user with MongoDB
  static async login(email, password) {
    await this.connect();
    
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Check if email is verified
      if (!user.emailVerified) {
        throw new Error('Please verify your email address');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;

      return { user: userObject, token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // Verify JWT token with MongoDB
  static async verifyToken(token) {
    await this.connect();
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await User.findById(decoded.userId)
        .select('-password -__v')
        .lean();

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  static async updateUser(userId, updates) {
    await this.connect();
    
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, select: '-password -__v' }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  // Change password
  static async changePassword(userId, currentPassword, newPassword) {
    await this.connect();
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  // Request password reset
  static async requestPasswordReset(email) {
    await this.connect();
    
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        // Don't reveal if user exists or not
        return { 
          success: true, 
          message: 'If an account exists, you will receive a reset email' 
        };
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user._id, email: user.email, type: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { 
        success: true, 
        resetToken,
        userId: user._id 
      };
    } catch (error) {
      throw new Error(`Password reset request failed: ${error.message}`);
    }
  }

  // Reset password with token
  static async resetPassword(token, newPassword) {
    await this.connect();
    
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid reset token');
      }

      // Find user and update password
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.password = newPassword;
      await user.save();

      return { success: true };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  // Verify email
  static async verifyEmail(token) {
    await this.connect();
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid verification token');
      }

      const user = await User.findByIdAndUpdate(
        decoded.userId,
        { $set: { emailVerified: true } },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return { success: true, user };
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    await this.connect();
    
    try {
      const user = await User.findById(userId)
        .select('-password -__v')
        .lean();

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    await this.connect();
    
    try {
      const user = await User.findOne({ email })
        .select('-password -__v')
        .lean();

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Create or update OAuth user
  static async upsertOAuthUser(provider, profile) {
    await this.connect();
    
    try {
      const { id, email, name, picture } = profile;
      
      // Look for existing user by email or OAuth ID
      let user = await User.findOne({
        $or: [
          { email },
          { oauthProvider: provider, oauthId: id }
        ]
      });

      if (user) {
        // Update existing user
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        user.oauthProvider = provider;
        user.oauthId = id;
        user.emailVerified = true;
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          name,
          avatar: picture,
          oauthProvider: provider,
          oauthId: id,
          emailVerified: true,
        });
        await user.save();
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;

      return { user: userObject, token };
    } catch (error) {
      throw new Error(`OAuth login failed: ${error.message}`);
    }
  }

  // Get all users (admin only)
  static async getAllUsers({ page = 1, limit = 20, role, search } = {}) {
    await this.connect();
    
    try {
      const query = {};
      
      if (role) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password -__v')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);

      return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Delete user (admin only)
  static async deleteUser(userId) {
    await this.connect();
    
    try {
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

export default AuthService;