import Mongoose from 'mongoose';
import { Context } from 'koa';
import User, { IUserDocument } from '../../../models/User';
import Project, { IProject, IProjectDocument } from '../../../models/Project';

interface IBody {
  name: string;
  description?: string;
}

export default async (ctx: Context): Promise<void> => {
  const req: IBody = ctx.request.body;
  const session = await Mongoose.startSession();
  session.startTransaction();
  const user: IUserDocument | null = await User.findOne({ _id: ctx.state.user._id }, null, {
    session,
  });
  if (!user) {
    await session.abortTransaction();
    session.endSession();
    ctx.throw(404, 'user not found');
  }
  const newProject: IProject = {
    ...req,
    owner: ctx.state.user._id,
    users: [],
    sessions: [],
  };
  try {
    const newProjectDoc: IProjectDocument = Project.build(newProject, session);
    await newProjectDoc.save();
    user.addProject(newProjectDoc._id);
    await user.save();
    await session.commitTransaction();
    session.endSession();
    ctx.body = { projectId: newProjectDoc._id };
    ctx.response.status = 201;
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    ctx.throw(400, 'validation failed');
  }
};
