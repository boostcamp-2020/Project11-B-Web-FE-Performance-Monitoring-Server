import { Context } from 'koa';
import Project from '../../../models/Project';

interface IQuery {
  id: string;
}

interface IBody {
  name: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  const { name }: IBody = ctx.request.body;
  try {
    await Project.update({ _id: projectId }, { name });
    ctx.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
