import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema({
  video_url: {
    type: String,
    required: true,
    default: '',
  },
  video_type: {
    type: String,
    enum: ['youtube', 'upload'],
    default: 'youtube',
  },
  title: {
    type: String,
    default: 'Welcome to My Page',
  },
  subtitle: {
    type: String,
    default: 'Discover amazing content',
  },
  cta_text: {
    type: String,
    default: 'Explore More',
  },
  cta_link: {
    type: String,
    default: '/portfolio',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

heroContentSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

export const HeroContent = mongoose.model('HeroContent', heroContentSchema);
