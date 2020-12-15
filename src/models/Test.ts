import { Schema, Document, model } from 'mongoose';

export interface TestType {
  name: { firstName: string; lastName: string };
  email: string;
}

export interface TestTypeModel extends TestType, Document {}

const testSchema = new Schema({
  name: { type: { firstName: String, lastName: String }, required: true },

  email: { type: String, required: true },
});

export default model<TestTypeModel>('Test', testSchema);
