import { Schema, Document, model, Model, Types } from 'mongoose';

export interface IIssue {
  projectId: Types.ObjectId;
  message: string;
  type: string;
  stack: { columnNo: string; lineNo: string; function: string; filename: string }[];
  crimeIds: string[];
  isOpen: boolean;
}

export interface IIssueDocument extends IIssue, Document {
  addCrime(crime: string): Promise<void>;
  deleteCrime(crime: string): Promise<void>;
}
export interface IIssueModel extends Model<IIssueDocument> {
  build(attr: IIssue): IIssueDocument;
}

const issueSchema = new Schema({
  projectId: Types.ObjectId,
  message: String,
  type: String,
  stack: { type: Schema.Types.Array, required: true },
  crimeIds: [{ type: Schema.Types.ObjectId, required: true, ref: 'Crime' }],
  isOpen: { type: Schema.Types.Boolean, require: true },
});

issueSchema.statics.build = function buildIssue(issue: IIssue): IIssueDocument {
  return new this(issue);
};

issueSchema.methods.addCrime = function addCrime(crimeId: string) {
  this.crimeIds.push(crimeId);
};

issueSchema.methods.deleteCrime = function deleteCrime(crimeId: string) {
  this.crimeIds.pull(crimeId);
};

const Issue = model<IIssueDocument, IIssueModel>('Issue', issueSchema);

export default Issue;
