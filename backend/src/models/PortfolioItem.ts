import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolioItem extends Document {
  title: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  description: string;
  category: string;
  order_index: number;
  is_visible: boolean;
  created_at: Date;
}

const PortfolioItemSchema = new Schema<IPortfolioItem>({
  title: { type: String, required: true },
  media_type: { type: String, required: true },
  media_url: { type: String, required: true },
  thumbnail_url: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, default: 'modelling' },
  order_index: { type: Number, default: 0 },
  is_visible: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
