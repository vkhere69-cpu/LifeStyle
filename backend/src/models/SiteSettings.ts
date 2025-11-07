import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  logo_url: string;
  tagline: string;
  theme: string;
  instagram_token: string;
  youtube_api_key: string;
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  updated_at: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  logo_url: { type: String, default: '' },
  tagline: { type: String, default: 'Comedy Meets Modelling' },
  theme: { type: String, default: 'light' },
  instagram_token: { type: String, default: '' },
  youtube_api_key: { type: String, default: '' },
  cloudinary_cloud_name: { type: String, default: '' },
  cloudinary_api_key: { type: String, default: '' },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
