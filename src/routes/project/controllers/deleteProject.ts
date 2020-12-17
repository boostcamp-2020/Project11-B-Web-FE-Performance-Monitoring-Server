import { startSession } from 'mongoose';
import { Context } from 'koa';
import Project from '../../../models/Project';
import Alert from '../../../models/Alert';

interface IQuery {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  const session = await startSession();
  try {
    session.startTransaction();
    await Project.update({ _id: projectId }, { isDeleted: true }, { session });
    await Alert.deleteMany({ project: projectId }, { session });
    await session.commitTransaction();
    session.endSession();
    ctx.status = 200;
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    ctx.throw(400);
  }
};
