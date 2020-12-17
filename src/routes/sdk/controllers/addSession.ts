import { Context } from 'koa';

import Project, { IProjectDocument } from '../../../models/Project';

const NINE_HOUR = 9 * 60 * 60 * 1000;

export default async (ctx: Context): Promise<void> => {
  const params = ctx.request.body;
  const { projectId } = ctx.params;
  params.ip = ctx.request.ip;
  try {
    const project = (await Project.findById(projectId)) as IProjectDocument;
    params.prevTime += NINE_HOUR;
    params.presentTime += NINE_HOUR;
    project.addSession(params);
    project.save();

    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
