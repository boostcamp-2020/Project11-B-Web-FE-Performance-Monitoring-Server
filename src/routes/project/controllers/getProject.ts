import { Context } from 'koa';
import Project from '../../../models/Project';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    const project = await Project.findById(projectId).populate('users').populate('owner').exec();
    ctx.body = project;
  } catch (e) {
    ctx.throw(500);
  }
};
