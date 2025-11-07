import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  page_view: string;
  visitor_ip: string;
  user_agent: string;
  created_at: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  page_view: { type: String, required: true },
  visitor_ip: { type: String, default: '' },
  user_agent: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
