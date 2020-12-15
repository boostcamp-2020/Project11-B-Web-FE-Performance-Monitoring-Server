import { Context } from 'koa';

import Project, { IProjectDocument } from '../../../models/Project';

export default async (ctx: Context): Promise<void> => {
  const params = ctx.request.body;
  const { projectId } = ctx.params;
  params.ip = ctx.request.ip;
  try {
    const project = (await Project.findById(projectId)) as IProjectDocument;

    project.addSession(params);
    project.save();

    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
