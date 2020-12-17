import { Schema, Document, model, Model, Types } from 'mongoose';

export interface IVisits {
  projectId: string;
  ip: string;
  year: number;
  month: number;
  date: number;
}

export interface IVisitsDocument extends IVisits, Document {}

export interface IVisitsModel extends Model<IVisitsDocument> {
  build(attr: IVisits): IVisitsDocument;
}

const visitsSchema = new Schema({
  projectId: { type: Types.ObjectId, required: true },
  ip: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  date: { type: Number, required: true },
});

visitsSchema.statics.build = function buildVisits(visits: IVisits): IVisitsDocument {
  return new this(visits);
};

const Visits = model<IVisitsDocument, IVisitsModel>('Visits', visitsSchema);
export default Visits;
