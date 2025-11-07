// backend/src/models/YouTubeVideo.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IYouTubeVideo extends Document {
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: Date;
  is_visible: boolean;
  created_at: Date;
}

const YouTubeVideoSchema = new Schema<IYouTubeVideo>({
  youtube_id: { 
    type: String, 
    required: true, 
    unique: true,  // This creates a unique index
    index: true    // This creates a non-unique index
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail_url: { type: String, required: true },
  published_at: { 
    type: Date, 
    required: true,
    index: -1  // For sorting in descending order
  },
  is_visible: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IYouTubeVideo>('YouTubeVideo', YouTubeVideoSchema);