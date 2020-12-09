import { Schema, Document, model, Model } from 'mongoose';

export interface ICrime {
  message: string;
  type: string;
  stack: { columnNo: string; lineNo: string; function: string; filename: string }[];
  occuredAt: Date;
  projectId: string;
  sdk: {
    name: string;
    version: string;
  };
  meta: {
    browser: {
      name: string;
      version: string;
    };
    os: {
      name: string;
      version: string;
    };
    url: string;
    ip: string;
  };
}

export interface ICrimeDocument extends ICrime, Document {}
export interface ICrimeModel extends Model<ICrimeDocument> {
  build(attr: ICrime): ICrimeDocument;
}

const CrimeSchema = new Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  stack: [
    {
      columnNo: { type: String, required: true },
      lineNo: { type: String, required: true },
      function: { type: String, required: true },
      filename: { type: String, required: true },
    },
  ],
  occuredAt: { type: Date, required: true },
  projectId: { type: String, require: true },
  sdk: {
    name: { type: String, required: true },
    version: { type: String, required: true },
  },
  meta: {
    browser: {
      name: { type: String, required: true },
      version: { type: String, required: true },
    },
    os: {
      name: { type: String, required: true },
      version: { type: String, required: true },
    },
    url: { type: String, required: true },
    ip: { type: String, required: true },
  },
});

CrimeSchema.statics.build = function buildCrime(Crime: ICrime): ICrimeDocument {
  return new this(Crime);
};

const Crime = model<ICrimeDocument, ICrimeModel>('Crime', CrimeSchema);

export default Crime;
