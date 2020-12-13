import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue, { IIssueDocument } from '../../../models/Issue';

const CONTENT_PER_PAGE = 15;

export default async (ctx: Context, next: Next): Promise<void> => {
  let { projectId } = ctx.query;
  if (!Array.isArray(projectId)) {
    projectId = [projectId];
  }
  projectId = projectId.map((id: string) => {
    return Types.ObjectId(id);
  });

  const page: number = parseInt(ctx.query.page, 10) || 1;

  const [result]: IIssueDocument[] = await Issue.aggregate([
    { $match: { projectId: { $in: projectId } } },
    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
    {
      $lookup: {
        localField: 'projectId',
        from: 'projects',
        foreignField: '_id',
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
    { $addFields: { occuredAt: { $toDate: '$_id.lastCrime.occuredAt' } } },
    {
      $sort: {
        occuredAt: -1,
      },
    },
    {
      $facet: {
        metaData: [
          { $count: 'total' },
          { $addFields: { totalPage: { $ceil: { $divide: ['$total', CONTENT_PER_PAGE] } } } },
          { $addFields: { page } },
          { $addFields: { countPerPage: CONTENT_PER_PAGE } },
        ],
        data: [{ $skip: (page - 1) * CONTENT_PER_PAGE }, { $limit: CONTENT_PER_PAGE }],
      },
    },
    { $unwind: '$metaData' }, // metadata 배열 해제
  ]);
  ctx.body = result;

  await next();
};
