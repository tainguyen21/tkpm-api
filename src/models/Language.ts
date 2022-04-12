import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

export interface ILanguage extends Document {
  name: string;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const Language = model('Language', LanguageSchema);

export default Language;
