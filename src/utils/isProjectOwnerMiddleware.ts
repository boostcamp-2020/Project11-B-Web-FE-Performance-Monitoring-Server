import { Context, Next } from 'koa';
import Project, { IProjectDocument } from '../models/Project';

const isProjectOwner = async (ctx: Context, next: Next): Promise<void> => {
  const { id: projectId } = ctx.params;
  const { _id: userId } = ctx.state.user;
  let project: IProjectDocument;
  try {
    project = (await Project.findById(projectId)) as IProjectDocument;
  } catch (e) {
    ctx.throw(500);
  }
  if (project === null) ctx.throw(400);
  if (String(project.owner) !== userId) ctx.throw(401);
  await next();
};

export default isProjectOwner;
