import { Context, Next } from 'koa';
import Issue, { IssueDocument } from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const result: IssueDocument[] = await Issue.aggregate([
    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
  ]);
  ctx.body = result;

  await next();
};
