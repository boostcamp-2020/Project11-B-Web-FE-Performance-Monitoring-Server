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
        from: 'projects',
        let: { id: '$projectId' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$id'] } } }, { $project: { name: 1 } }],

        as: 'project',
      },
    },

    { $addFields: { lastCrimeId: { $arrayElemAt: ['$crimeIds', -1] } } },
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
    { $unwind: '$totalCrime' },

    {
      $group: {
        _id: {
          _id: '$_id',
          type: '$type',
          message: '$message',
          stack: '$stack',
          lastCrime: '$lastCrime',
          project: '$project',
        },
        crimeIds: { $addToSet: '$crimeIds' },
        users: { $addToSet: '$totalCrime.meta.ip' },
      },
    },
    { $unwind: '$crimeIds' },
    {
      $group: {
        _id: '$_id._id',
        type: { $addToSet: '$_id.type' },
        message: { $addToSet: '$_id.message' },
        stack: { $addToSet: '$_id.stack' },
        project: { $addToSet: '$_id.project' },
        crimeIds: { $addToSet: '$crimeIds' },
        lastCrime: { $addToSet: '$_id.lastCrime' },
        crimeCount: { $sum: { $size: '$crimeIds' } },
        userCount: { $sum: { $size: '$users' } },
      },
    },
    { $unwind: '$type' },
    { $unwind: '$message' },
    { $unwind: '$stack' },
    { $unwind: '$project' },
    { $unwind: '$project' },
    { $unwind: '$crimeIds' },
    { $unwind: '$lastCrime' },
    { $addFields: { occuredAt: { $toDate: '$lastCrime.occuredAt' } } },
  ]);
  ctx.body = result;

  await next();
};
