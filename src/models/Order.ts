import mongoose, { Document } from 'mongoose';
import { ICard } from './Card';
import { IUser } from './User';

const { Schema, model } = mongoose;

export interface IOrder extends Document {
  user: IUser['_id'];
  card: ICard['_id'];
  expiredAt: Date;
  status: 'PENDING' | 'DONE' | 'OVER';
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    card: { type: Schema.Types.ObjectId, required: true, ref: 'Card' },
    expiredAt: { type: Date, required: true },
    status: { type: String, default: 'PENDING' },
  },
  {
    timestamps: true,
  }
);

const Order = model('Order', OrderSchema);

export default Order;
