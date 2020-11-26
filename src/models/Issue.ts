import { Schema, Document, model, Model } from 'mongoose';

export interface IssueType {
  message: string;
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

export interface IssueDocument extends IssueType, Document {}
export interface IssueModel extends Model<IssueDocument> {
  build(attr: IssueType): IssueDocument;
}

const issueSchema = new Schema({
  message: { type: String, required: true },
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

issueSchema.statics.build = function buildIssue(issue: IssueType): IssueDocument {
  return new this(issue);
};

const Issue = model<IssueDocument, IssueModel>('Issue', issueSchema);

export default Issue;
