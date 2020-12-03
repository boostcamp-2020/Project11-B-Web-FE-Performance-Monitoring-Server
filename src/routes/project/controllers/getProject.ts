import { Context } from 'koa';
import Project, { IProjectDocument } from '../../../models/Project';
import User from '../../../models/User';

interface IQuery {
  id: number;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    const project = (await Project.findById(projectId)) as IProjectDocument;
    const users = await User.find().where('_id').in(project.users).exec();
    project.users = users.map((user) => user.toObject());
    ctx.body = project;
  } catch (e) {
    ctx.throw(500);
  }
};
