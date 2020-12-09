import { Schema, Document, model, Model } from 'mongoose';

export interface IVisits {
  ip: string;
  date: Date;
}

export interface IVisitsDocument extends IVisits, Document {}

export interface IVisitsModel extends Model<IVisitsDocument> {
  build(ip: string, date: Date): IVisitsDocument;
}

const visitsSchema = new Schema({
  ip: { type: String, required: true },
  date: { type: Date, required: true },
});

visitsSchema.statics.build = function buildVisits(visits: IVisits) {
  return new this(visits);
};

const Visits = model<IVisitsDocument, IVisitsModel>('Visits', visitsSchema);
export default Visits;
