import Mongoose from 'mongoose';
import { Context } from 'koa';
import Project from '../../../models/Project';
import User from '../../../models/User';

interface IQuery {
  id: string;
}

interface IBody {
  userIds: string[];
}

export default async (ctx: Context): Promise<void> => {
  const { id: projectId }: IQuery = ctx.params;
  const { userIds }: IBody = ctx.request.body;
  const session = await Mongoose.startSession();
  session.startTransaction();
  try {
    const project = await Project.findOne({ _id: projectId }, null, { session });

    await User.updateMany(
      { _id: { $in: userIds } },
      { $pull: { projects: projectId } },
      {
        session,
      },
    );
    if (project === null) {
      ctx.throw(500);
    }
    await project.deleteUsers(userIds);
    await project.save();
    await session.commitTransaction();
    session.endSession();
    ctx.status = 200;
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    ctx.throw(400, 'internal server error');
  }
};
