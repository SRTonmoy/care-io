import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  attachments: [{
    type: String,
    url: String,
    name: String,
    size: Number,
  }],
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  delivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Virtual for conversation ID
messageSchema.virtual('conversationId').get(function() {
  const ids = [this.senderId.toString(), this.receiverId.toString()].sort();
  return ids.join('_');
});

// Indexes
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ bookingId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ conversationId: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;