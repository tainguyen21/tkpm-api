import mongoose, { Document } from 'mongoose';
const { Schema, model } = mongoose;

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const Category = model('Category', CategorySchema);

export default Category;
