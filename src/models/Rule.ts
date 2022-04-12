import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

export interface IRule extends Document {
  maxBook: number;
  maxDate: number;
  maxCardDate: number;
}

const RuleSchema = new Schema<IRule>(
  {
    maxBook: { type: Number, required: true },
    maxDate: { type: Number, required: true },
    maxCardDate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Rule = model('Rule', RuleSchema);

export default Rule;
