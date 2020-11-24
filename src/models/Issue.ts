import { Schema, Document, model } from 'mongoose';

export interface IssueType {
  name: string;
  issue: Record<string, unknown>;
}

export interface IssueTypeModel extends IssueType, Document {}

const issueSchema = new Schema({
  name: { type: String, required: true },
  issue: { type: Object, required: true },
});

const Issue = model<IssueTypeModel>('Issue', issueSchema);

export const build = (issue: IssueType): IssueTypeModel => {
  return new Issue(issue);
};

export default Issue;
