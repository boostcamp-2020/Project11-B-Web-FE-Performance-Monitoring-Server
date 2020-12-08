import { Context } from 'koa';
import Project from '../../../models/Project';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    // await Project.findOne({ _id: projectId }).remove();
    await Project.deleteOne({ _id: projectId });
  } catch (e) {
    ctx.throw(400, 'internal server error');
  }
  ctx.status = 200;
};
