import { Types, Schema, Document, model, Model } from 'mongoose';

export interface IProject {
  name: string;
  description?: string;
  owner: string;
  users: string[];
}

export interface IProjectDocument extends IProject, Document {
  addUser(user: string): Promise<void>;
  deleteUser(user: string): Promise<void>;
  deleteUsers(userIds: string[]): Promise<void>;
}

export interface IProjectModel extends Model<IProjectDocument> {
  build(attr: IProject): IProjectDocument;
}

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
});

projectSchema.statics.build = function buildProject(project: IProject) {
  return new this(project);
};

projectSchema.methods.addUser = function addUser(userId: string) {
  this.users.push(userId);
};

projectSchema.methods.deleteUser = function deleteUser(userId: string) {
  this.users.pull(userId);
};

projectSchema.methods.deleteUsers = function deleteUser(userIds: string[]) {
  userIds.forEach(async (userId) => this.users.pull(Types.ObjectId(userId)));
};

const Project = model<IProjectDocument, IProjectModel>('Project', projectSchema);
export default Project;
