import { Schema, Document, model, Model } from 'mongoose';

export interface IAlert {
  projectId: string;
  users: string[];
  sendedAt: Date;
  period?: string;
  count?: number;
  lastestIssueId?: string;
}

export interface IAlertDocument extends IAlert, Document {}
export interface IAlertModel extends Model<IAlertDocument> {
  build(attr: IAlert): IAlertDocument;
}

const AlertSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  users: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
    default: [],
  },
  lastestIssueId: { type: Schema.Types.ObjectId, ref: 'Issue' },
  sendedAt: { type: Date, required: true },
  period: { type: String },
  count: { type: Number },
});

AlertSchema.statics.build = function buildCrime(Alert: IAlert): IAlertDocument {
  return new this(Alert);
};

AlertSchema.methods.addUser = function addUser(userId: string) {
  if (!this.users.includes(userId)) {
    this.users.push(userId);
  }
};

AlertSchema.methods.deleteUser = function deleteUser(userId: string) {
  this.users.pull(userId);
};

const Alert = model<IAlertDocument, IAlertModel>('Alert', AlertSchema);

export default Alert;
