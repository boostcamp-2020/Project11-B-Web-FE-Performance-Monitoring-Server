import { Schema, Document, model } from 'mongoose';

export interface IssueType {
  message: string;
  stack: [{ columnNo: string; lineNo: string; function: string; filename: string }];
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

export interface IssueTypeModel extends IssueType, Document {}

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

const Issue = model<IssueTypeModel>('Issue', issueSchema);

export const build = (issue: IssueType): IssueTypeModel => {
  return new Issue(issue);
};

export default Issue;
