import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Issue, { IIssueDocument } from '../../../models/Issue';
import convertToArray from '../../../utils/convertToArray';
import { addFilter } from '../services/statUtil';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { projectId, browser, os, url } = ctx.query;

  const projectIds = convertToArray(projectId);

  const projectObjectIds = projectIds.map((id: string) => {
    return Types.ObjectId(id);
  });

  const filterInfo = [
    { field: 'totalCrime.meta.browser.name', value: browser },
    { field: 'totalCrime.meta.os.name', value: os },
    { field: 'totalCrime.meta.url.name', value: url },
  ];

  const filterAggregate = filterInfo.reduce(
    (acc, curr) => addFilter(curr.field, curr.value, acc),
    [],
  );

  const result: IIssueDocument[] = await Issue.aggregate([
    { $match: { projectId: { $in: projectObjectIds } } },
    {
      $lookup: {
        localField: 'crimeIds',
        from: 'crimes',
        foreignField: '_id',
        as: 'totalCrime',
      },
    },
    { $unwind: '$totalCrime' },
    ...filterAggregate,
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
