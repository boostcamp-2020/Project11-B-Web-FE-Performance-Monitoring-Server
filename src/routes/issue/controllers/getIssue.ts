import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue, { IIssueDocument } from '../../../models/Issue';

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

    { $addFields: { lastErrorId: { $arrayElemAt: ['$errorIds', 0] } } },
    {
      $lookup: {
        localField: 'lastErrorId',
        from: 'errors',
        foreignField: '_id',
        as: 'lastError',
      },
    },

    { $unwind: '$lastError' },
    {
      $lookup: {
        localField: 'errorIds',
        from: 'errors',
        foreignField: '_id',
        as: 'totalError',
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
          lastError: '$lastError',
          project: '$project',
          errorIds: '$errorIds',
        },
        _stat: { $addToSet: { userIps: '$totalError.meta.ip' } },
      },
    },
  ]);

  ctx.body = result;

  await next();
};
