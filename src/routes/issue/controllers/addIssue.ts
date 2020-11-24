import { Context, Next } from 'koa';
import { IssueType, IssueTypeModel, build } from '../../../models/Issue';

const validateBody = (ctx: Context): IssueType => {
  const { name, issue } = ctx.request.body;
  if (!(name && issue)) {
    return ctx.throw(401, 'validation failed');
  }
  const newIssue: IssueType = { name, issue };
  return newIssue;
};

export default async (ctx: Context, next: Next) => {
  const newIssue: IssueType = validateBody(ctx);
  const newIssueDoc: IssueTypeModel = build(newIssue);
  await newIssueDoc.save();
  ctx.response.status = 200;

  await next();
};
