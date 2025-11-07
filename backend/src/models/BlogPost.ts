import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  media_urls: string[];
  status: string;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  featured_image: { type: String, default: '' },
  media_urls: { type: [String], default: [] },
  status: { type: String, default: 'draft' },
  published_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
