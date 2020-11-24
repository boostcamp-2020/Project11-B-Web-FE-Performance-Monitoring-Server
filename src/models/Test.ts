import { Schema, Document, model } from 'mongoose';

export interface TestType {
  name: { firstName: string; lastName: string };
  email: string;
}

export interface TestTypeModel extends TestType, Document {}

const testSchema = new Schema({
  name: [
    { firstName: String, lastName: String },
    { type: String, required: true },
  ],
  email: { type: String, required: true },
});

export default model<TestTypeModel>('Test', testSchema);
