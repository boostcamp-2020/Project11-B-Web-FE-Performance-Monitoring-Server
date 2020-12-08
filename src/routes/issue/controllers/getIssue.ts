import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { issueId } = ctx.params;
  const [result]: any[] = await Issue.aggregate([
    { $match: { _id: Types.ObjectId(issueId) } },
    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
    {
      $lookup: {
        localField: 'projectId',
        from: 'projects',
        foreignField: '_id',
        as: 'project',
      },
    },

    { $addFields: { lastCrimeId: { $arrayElemAt: ['$crimeIds', 0] } } },
    {
      $lookup: {
        localField: 'lastCrimeId',
        from: 'crimes',
        foreignField: '_id',
        as: 'lastCrime',
      },
    },

    { $unwind: '$lastCrime' },
    {
      $lookup: {
        localField: 'crimeIds',
        from: 'crimes',
        foreignField: '_id',
        as: 'totalCrime',
      },
    },

    {
      $group: {
        _id: {
          _id: '$_id',
          meta: '$meta',
          type: '$type',
          message: '$message',
          stack: '$stack',
          lastCrime: '$lastCrime',
          project: '$project',
          crimeIds: '$crimeIds',
        },
        _stat: { $addToSet: { userIps: '$totalCrime.meta.ip' } },
      },
    },
  ]);

  ctx.body = result;

  await next();
};
