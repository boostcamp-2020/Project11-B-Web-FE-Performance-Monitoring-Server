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

    { $addFields: { lastErrorId: { $arrayElemAt: ['$errorIds', 0] } } },
    {
      $lookup: {
        localField: 'lastErrorId',
        // localField: 'errorIds',
        from: 'errors',
        foreignField: '_id',
        as: 'lastError',
      },
    },

    { $unwind: '$lastError' },
    {
      $lookup: {
        // localField: 'lastErrorId',
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
        /**
         * @todo
         * unique 적용되도록 수정해야함
         * + count해서 반환하도록 수정
         */

        _stat: { $addToSet: { userIps: '$totalError.meta.ip' } },
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
    { $unwind: '$metaData' }, // metadata 배열 해제
  ]);

  ctx.body = result;

  await next();
};
