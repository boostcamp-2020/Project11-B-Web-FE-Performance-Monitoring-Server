import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue, { IIssueDocument } from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  let { projectId } = ctx.query;
  if (!Array.isArray(projectId)) {
    projectId = [projectId];
  }
  projectId = projectId.map((id: string) => {
    return Types.ObjectId(id);
  });

  const result: IIssueDocument[] = await Issue.aggregate([
    { $match: { projectId: { $in: projectId } } },
    {
      $lookup: {
        localField: 'crimeIds',
        from: 'crimes',
        foreignField: '_id',
        as: 'totalCrime',
      },
    },

    { $unwind: '$totalCrime' },

    {
      $group: {
        _id: { _id: '$_id', message: '$message', type: '$type' },
        crimeIds: { $addToSet: '$crimeIds' },
        users: { $addToSet: '$totalCrime.meta.ip' },
      },
    },
    { $unwind: '$crimeIds' },
    {
      $group: {
        _id: '$_id._id',
        message: { $addToSet: '$_id.message' },
        type: { $addToSet: '$_id.type' },
        crimeCount: { $sum: { $size: '$crimeIds' } },
        userCount: { $sum: { $size: '$users' } },
      },
    },
    { $unwind: '$type' },
    { $unwind: '$message' },
  ]);
  ctx.body = result;

  await next();
};
