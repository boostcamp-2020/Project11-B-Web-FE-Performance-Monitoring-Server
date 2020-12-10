import { Types, Schema, Document, model, Model, ClientSession } from 'mongoose';

export interface ISession {
  ip: string;
  sessionBase: string;
  prevLocation: string;
  presentLocation: string;
  prevTime: number;
  presentTime: number;
  duration: number;
}
export interface IProject {
  name: string;
  description?: string;
  owner: string;
  users: string[];
  sessions: ISession[];
}

export interface IProjectDocument extends IProject, Document {
  addUser(user: string): Promise<void>;
  deleteUser(user: string): Promise<void>;
  deleteUsers(userIds: string[]): Promise<void>;
  addSession(session: ISession): Promise<void>;
}

export interface IProjectModel extends Model<IProjectDocument> {
  build(attr: IProject, session: ClientSession): IProjectDocument;
}

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
  isDeleted: { type: Boolean, required: true, default: false },
  sessions: { type: Schema.Types.Array },
});

projectSchema.statics.build = function buildProject(project: IProject, session?: ClientSession) {
  return new this(project, session);
};

projectSchema.methods.addUser = async function addUser(userId: string) {
  if (this.owner.equals(Types.ObjectId(userId))) return;
  if (!this.users.includes(userId)) {
    this.users.push(userId);
  }
};
projectSchema.methods.addSession = async function addSession(session: ISession) {
  this.sessions.push(session);
};

projectSchema.methods.deleteUser = function deleteUser(userId: string) {
  this.users.pull(userId);
};

projectSchema.methods.deleteUsers = function deleteUser(userIds: string[]) {
  userIds.forEach(async (userId) => this.users.pull(Types.ObjectId(userId)));
};

const Project = model<IProjectDocument, IProjectModel>('Project', projectSchema);
export default Project;
