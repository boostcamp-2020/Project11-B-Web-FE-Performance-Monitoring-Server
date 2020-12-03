import { Schema, Document, model, Model } from 'mongoose';

export interface IIssue {
  message: string;
  type: string;
  stack: { columnNo: string; lineNo: string; function: string; filename: string }[];
  errorIds: string[];
}

export interface IIssueDocument extends IIssue, Document {
  addError(error: string): Promise<void>;
  deleteError(error: string): Promise<void>;
}
export interface IIssueModel extends Model<IIssueDocument> {
  build(attr: IIssue): IIssueDocument;
}

const issueSchema = new Schema({
  message: String,
  type: String,
  stack: { type: Schema.Types.Array, required: true },
  errorIds: { type: Schema.Types.Array, required: true },
});

issueSchema.statics.build = function buildIssue(issue: IIssue): IIssueDocument {
  return new this(issue);
};

issueSchema.methods.addError = function addError(errorId: string) {
  this.errorIds.push(errorId);
};

issueSchema.methods.deleteError = function deleteError(errorId: string) {
  this.errorIds.pull(errorId);
};

const Issue = model<IIssueDocument, IIssueModel>('Issue', issueSchema);

export default Issue;
