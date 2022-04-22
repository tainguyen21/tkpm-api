import { IPublisher } from './Publisher';
import { ILanguage } from './Language';
import { ICategory } from './Category';
import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

export interface IBook extends Document {
  name: string;
  category: ICategory['_id'][];
  publishDate: Date;
  authorName: string;
  description: string;
  stock: number;
  language: ILanguage['_id'];
  publisher: IPublisher['_id'];
  url: string;
}

const BookSchema = new Schema<IBook>(
  {
    name: { type: String, required: true },
    category: { type: [Schema.Types.ObjectId], required: true, ref: 'Category' },
    publishDate: { type: Date, required: true },
    authorName: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    language: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
    publisher: { type: Schema.Types.ObjectId, ref: 'Publisher', required: true },
    url: { type: String },
  },
  {
    timestamps: true,
  }
);

const Book = model('Book', BookSchema);

export default Book;
