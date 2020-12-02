import { Schema, Document, model, Model, Types } from 'mongoose';

export interface UserType {
  uid: number;
  nickname: string;
  email: string | undefined;
  projects: string[];
}

export interface UserDocument extends UserType, Document {}
export interface UserModel extends Model<UserDocument> {
  build(attr: UserType): UserDocument;
}

const userSchema = new Schema({
  uid: { type: Number, required: true },
  nickname: { type: String, required: true },
  email: { type: String },
  projects: { type: Types.Array, required: true },
});

userSchema.statics.build = function buildUser(user: UserType): UserDocument {
  return new this(user);
};

userSchema.methods.addProject = function addProject(projectId: string) {
  this.projects.push(projectId);
};

userSchema.methods.deleteProject = function deleteProject(projectId: string) {
  this.projects.pull(projectId);
};

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
