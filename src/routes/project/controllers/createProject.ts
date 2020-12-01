import { Context, Next } from 'koa';
import Project, { IProject, ProjectDocument } from '../../../models/project';

export default async (ctx: Context, next: Next): Promise<void> => {
  const newProject: IProject = ctx.request.body;
  newProject.users = [];
  try {
    const newProjectDoc: ProjectDocument = Project.build(newProject);
    await newProjectDoc.save();
    ctx.response.status = 200;
    ctx.body = { dsn: newProjectDoc.dsn };
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
