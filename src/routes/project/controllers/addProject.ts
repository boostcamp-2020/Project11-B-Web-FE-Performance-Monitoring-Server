import { Context } from 'koa';
import User, { IUserDocument } from '../../../models/User';
import Project, { IProject, IProjectDocument } from '../../../models/Project';

interface IBody {
  name: string;
  description?: string;
}

export default async (ctx: Context): Promise<void> => {
  const req: IBody = ctx.request.body;
  const user: IUserDocument | null = await User.findOne({ _id: ctx.state.user._id });
  if (!user) ctx.throw(404, 'user not found');
  const newProject: IProject = {
    ...req,
    owner: ctx.state.user._id,
    users: [],
  };
  try {
    const newProjectDoc: IProjectDocument = Project.build(newProject);
    await newProjectDoc.save();
    user.addProject(newProjectDoc._id);
    await user.save();
    ctx.body = { projectId: newProjectDoc._id };
    ctx.response.status = 201;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }
};
