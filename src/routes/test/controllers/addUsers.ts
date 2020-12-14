/**
 * Project에 4명의 user를 추가하는 테스트용 API 입니다.
 */

import { Context } from 'koa';
import Project, { IProjectDocument } from '../../../models/Project';
import User from '../../../models/User';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  const userIds = [
    '5fcee46a17a95f43cee14761',
    '5fcee63c17a95f43cee19c1e',
    '5fcee75617a95f43cee1d32a',
    '5fcf00d817a95f43cee61cb8',
  ];
  try {
    const project = (await Project.findById(projectId)) as IProjectDocument;
    await Promise.all(
      userIds.map(async (userId) => {
        await project.addUser(userId);
      }),
    );
    await User.updateMany({ _id: { $in: userIds } }, { $push: { projects: projectId } });
    await project.save();

    ctx.status = 200;
  } catch (e) {
    ctx.throw(400, 'internal server error');
  }
};
