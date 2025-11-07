import mongoose, { Schema, Document } from 'mongoose';

export interface IContactRequest extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: Date;
}

const ContactRequestSchema = new Schema<IContactRequest>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema);
