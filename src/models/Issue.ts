import { Schema, Document, model, Model } from 'mongoose';
// message, stack, type이 같은 경우 동일 에러 종류로 분류
export interface IIssueType {
  message: string;
  type: string;
  stack: { columnNo: string; lineNo: string; function: string; filename: string }[];
  errorIds: string[];
}

export interface IIssueDocument extends IIssueType, Document {
  addError(error: string): Promise<void>;
  deleteError(error: string): Promise<void>;
}
export interface IIssueModel extends Model<IIssueDocument> {
  build(attr: IIssueType): IIssueDocument;
}

const issueSchema = new Schema({
  issueId: { type: String, required: true },
  errorIds: { type: Schema.Types.Array, required: true },
});

issueSchema.statics.build = function buildIssue(issue: IIssueType): IIssueDocument {
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
