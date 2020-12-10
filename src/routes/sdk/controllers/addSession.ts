import { Context, Next } from 'koa';

import Project, { IProjectDocument } from '../../../models/Project';

export default async (ctx: Context, next: Next): Promise<void> => {
  try {
    const params = ctx.request.body;
    const { projectId } = ctx.params;

    params.ip = ctx.request.ip;
    const project = (await Project.findById(projectId)) as IProjectDocument;

    project.addSession(params);
    project.save();

    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
