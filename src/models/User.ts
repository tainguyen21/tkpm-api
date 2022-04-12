import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

export interface IUser extends Document {
  fullName?: string;
  phone: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model('User', UserSchema);

export default User;
