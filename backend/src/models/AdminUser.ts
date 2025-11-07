import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
