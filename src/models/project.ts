import { Schema, Document, model, Model } from 'mongoose';
import randomStr from '../utils/randomStr';

export interface IProject {
  name: string;
  description?: string;
  owner: string;
  dsn: string;
  users?: string[];
}

export interface ProjectDocument extends IProject, Document {
  addUser(user: string): Promise<void>;
  deleteUser(user: string): Promise<void>;
}

export interface ProjectModel extends Model<ProjectDocument> {
  build(attr: IProject): ProjectDocument;
}

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, required: true },
  dsn: { type: String, required: true },
  users: { type: Schema.Types.Array, required: true },
});

projectSchema.statics.build = function buildProject(project: IProject) {
  const newProject = new this(project);
  newProject.dsn = randomStr();
  return newProject;
};

projectSchema.methods.addUser = function addUser(userId: string) {
  this.users.push(userId);
};

projectSchema.methods.deleteUser = function deleteUser(userId: string) {
  this.users.pull(userId);
};
const Project = model<ProjectDocument, ProjectModel>('Project', projectSchema);
export default Project;
