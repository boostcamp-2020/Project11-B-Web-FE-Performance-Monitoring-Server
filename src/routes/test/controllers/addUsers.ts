/**
 * Project에 4명의 user를 추가하는 테스트용 API 입니다.
 */

import { Context } from 'koa';
import Project, { IProjectDocument } from '../../../models/Project';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  try {
    // await Project.updateOne(
    //   { _id: projectId },
    //   {
    //     $push: {
    //       users: {
    //         $each: [
    //           '5fc5d0f738d1839a9be86541',
    //           '5fc7033438d1839a9b14bd79',
    //           '5fc7205838d1839a9b191373',
    //           '5fc728ba38d1839a9b1a65e2',
    //         ],
    //       },
    //     },
    //   },
    //   { upsert: true },
    // );
    const project = (await Project.findById(projectId)) as IProjectDocument;
    await project.addUser('5fc5d0f738d1839a9be86541');
    await project.addUser('5fc7033438d1839a9b14bd79');
    await project.addUser('5fc7205838d1839a9b191373');
    await project.addUser('5fc728ba38d1839a9b1a65e2');
    project.save();

    ctx.status = 200;
  } catch (e) {
    ctx.throw(400, 'internal server error');
  }
};
