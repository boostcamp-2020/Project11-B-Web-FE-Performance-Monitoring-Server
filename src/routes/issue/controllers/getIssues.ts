import { Context, Next } from 'koa';
import Issue, { IssueDocument } from '../../../models/Issue';

const CONTENT_PER_PAGE = 20;

export default async (ctx: Context, next: Next): Promise<void> => {
  const page: number = parseInt(ctx.query.page, 10) || 1;
  const [result]: IssueDocument[] = await Issue.aggregate([
    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
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
