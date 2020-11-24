import { Context, Next } from 'koa';
import Issue, { IssueTypeModel } from '../../../models/Issue';

export default async (ctx: Context, next: Next) => {
  const { issueId } = ctx.params;
  const result: IssueTypeModel | null = await Issue.findOne({ _id: issueId });
  ctx.body = result;

  await next();
};
