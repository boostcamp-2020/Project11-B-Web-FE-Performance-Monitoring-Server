import { Context, Next } from 'koa';
import Issue, { IssueDocument } from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const result: IssueDocument[] = await Issue.find();
  ctx.body = result;

  await next();
};
