import { Context } from 'koa';
import Project, { IProjectDocument } from '../../../models/Project';

interface IQuery {
  id: number;
}

interface IBody {
  userIds: string[];
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  const { userIds }: IBody = ctx.request.body;
  try {
    const project = (await Project.findOne({ _id: projectId })) as IProjectDocument;
    await project.deleteUsers(userIds);
    await project.save();
  } catch (e) {
    ctx.throw(400, 'internal server error');
  }
  ctx.status = 200;
};
