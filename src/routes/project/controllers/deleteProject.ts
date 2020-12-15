import { Context } from 'koa';
import Project from '../../../models/Project';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    await Project.update({ _id: projectId }, { isDeleted: true });
    ctx.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
