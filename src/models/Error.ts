import { Schema, Document, model, Model } from 'mongoose';

export interface IError {
  message: string;
  type: string;
  stack: { columnNo: string; lineNo: string; function: string; filename: string }[];
  occuredAt: Date;
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

export interface IErrorDocument extends IError, Document {}
export interface IErrorModel extends Model<IErrorDocument> {
  build(attr: IError): IErrorDocument;
}

const ErrorSchema = new Schema({
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

ErrorSchema.statics.build = function buildError(Error: IError): IErrorDocument {
  return new this(Error);
};

const Error = model<IErrorDocument, IErrorModel>('Error', ErrorSchema);

export default Error;
