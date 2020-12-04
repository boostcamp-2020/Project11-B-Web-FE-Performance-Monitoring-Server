import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue, { IIssueDocument } from '../../../models/Issue';

const CONTENT_PER_PAGE = 20;

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
    // { $match: { projectId: Types.ObjectId(projectId) } },

    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
    {
      $lookup: {
        localField: 'projectId',
        from: 'projects',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $lookup: {
        localField: 'errorIds',
        from: 'errors',
        foreignField: '_id',
        as: 'errors',
      },
    },
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
  ]);
  ctx.body = result;

  await next();
};
