import { Schema, Document, model, Model } from 'mongoose';

export interface IUser {
  uid: number;
  nickname: string;
  email: string | undefined;
  projects: string[];
}

export interface IUserDocument extends IUser, Document {
  addProject(projectId: string): void;
  deleteProject(projectId: string): void;
}
export interface IUserModel extends Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

const userSchema = new Schema({
  uid: { type: Number, required: true },
  nickname: { type: String, required: true },
  email: { type: String },
  projects: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: 'Project' }],
    default: [],
  },
});

userSchema.statics.build = function buildUser(user: IUser): IUserDocument {
  return new this(user);
};

userSchema.methods.addProject = function addProject(projectId: string) {
  this.projects.push(projectId);
};

userSchema.methods.deleteProject = function deleteProject(projectId: string) {
  this.projects.pull(projectId);
};

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
