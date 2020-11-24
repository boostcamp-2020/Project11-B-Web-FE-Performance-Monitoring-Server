import { Context, Next } from 'koa';
import Issue, { IssueTypeModel } from '../../../models/Issue';

export default async (ctx: Context, next: Next) => {
  const result: IssueTypeModel[] = await Issue.find();
  ctx.body = result;

  await next();
};
