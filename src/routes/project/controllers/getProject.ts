import { Context } from 'koa';
import Project from '../../../models/Project';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    const project = await Project.findById(projectId)
      .where('isDeleted')
      .ne(true)
      .populate('users')
      .populate('owner')
      .exec();
    if (project === null) {
      throw Error();
    }
    ctx.body = project;
  } catch (e) {
    ctx.throw(500);
  }
};
