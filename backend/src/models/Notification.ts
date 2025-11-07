import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'announcement'],
    default: 'info',
  },
  icon: {
    type: String,
    default: 'bell',
  },
  link: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  expires_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

export const Notification = mongoose.model('Notification', notificationSchema);
