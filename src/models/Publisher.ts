import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

export interface IPublisher extends Document {
  name: string;
}

const PublisherSchema = new Schema<IPublisher>(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const Publisher = model('Publisher', PublisherSchema);

export default Publisher;
