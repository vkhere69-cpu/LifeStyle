import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  subscribed_at: {
    type: Date,
    default: Date.now,
  },
  last_notified: {
    type: Date,
    default: null,
  },
  preferences: {
    youtube_updates: {
      type: Boolean,
      default: true,
    },
    blog_updates: {
      type: Boolean,
      default: true,
    },
    portfolio_updates: {
      type: Boolean,
      default: false,
    },
  },
});

subscriberSchema.index({ email: 1 });

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
