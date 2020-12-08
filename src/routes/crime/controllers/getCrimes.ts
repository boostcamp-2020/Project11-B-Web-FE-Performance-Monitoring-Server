import { Context } from 'koa';
import { Types } from 'mongoose';
import Issue from '../../../models/Issue';

const CONTENT_PER_PAGE = 5;

interface IParams {
  issueId: string;
}
interface IQuery {
  page: string;
}
export default async (ctx: Context): Promise<void> => {
  const { issueId }: IParams = ctx.params;
  const { page }: IQuery = ctx.query;
  const pageNum: number = parseInt(page, 10) || 1;
  try {
    const [result] = await Issue.aggregate([
      { $match: { _id: Types.ObjectId(issueId) } },
      {
        $lookup: {
          from: 'crimes',
          localField: 'crimeIds',
          foreignField: '_id',
          as: 'crimes',
        },
      },
      { $project: { crimes: 1 } },
      { $unset: 'crimes.stack' },
      { $unwind: '$crimes' },
      { $sort: { 'crimes.occuredAt': -1 } },
      {
        $facet: {
          meta: [
            { $count: 'total' },
            { $addFields: { totalPage: { $ceil: { $divide: ['$total', CONTENT_PER_PAGE] } } } },
            { $addFields: { pageNum } },
            { $addFields: { countPerPage: CONTENT_PER_PAGE } },
          ],
          data: [{ $skip: (pageNum - 1) * CONTENT_PER_PAGE }, { $limit: CONTENT_PER_PAGE }],
        },
      },
    ]);
    ctx.response.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
