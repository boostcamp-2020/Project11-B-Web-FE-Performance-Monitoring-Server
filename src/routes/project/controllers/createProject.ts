import { Context } from 'koa';
import Project, { IProject, ProjectDocument } from '../../../models/project';

interface IBody {
  name: string;
  description?: string;
}

export default async (ctx: Context): Promise<void> => {
  const req: IBody = ctx.request.body;
  const newProject: IProject = {
    ...req,
    owner: ctx.state.user._id,
    users: [],
  };
  try {
    const newProjectDoc: ProjectDocument = Project.build(newProject);
    await newProjectDoc.save();
    ctx.body = { projectId: newProjectDoc._id };
    ctx.response.status = 201;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }
};
