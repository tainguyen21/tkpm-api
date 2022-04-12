import mongoose, { Document } from 'mongoose';
import { IBook } from './Book';
import { IOrder } from './Order';

const { Schema, model } = mongoose;

export interface IOrderDetail extends Document {
  book: IBook['_id'];
  order: IOrder['_id'];
  status: 'PENDING' | 'DONE';
  receivedDate: Date;
}

const OrderDetailSchema = new Schema<IOrderDetail>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    order: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
    receivedDate: { type: Date },
    status: { type: String, default: 'PENDING' },
  },
  {
    timestamps: true,
  }
);

const OrderDetail = model('OrderDetail', OrderDetailSchema);

export default OrderDetail;
