import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

const { Schema, model } = mongoose;

export interface ICard extends Document {
  user: IUser['_id'];
  expiredAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiredAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Card = model('Card', CardSchema);

export default Card;
