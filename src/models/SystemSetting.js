import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
    enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY'],
    default: 'STRING',
  },
  description: String,
  category: {
    type: String,
    default: 'GENERAL',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
systemSettingSchema.index({ key: 1 }, { unique: true });
systemSettingSchema.index({ category: 1 });
systemSettingSchema.index({ isPublic: 1 });

const SystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', systemSettingSchema);
export default SystemSetting;