import { Context, Next } from 'koa';
import Issue, { IssueType, IssueTypeModel, build } from '../../../models/Issue';

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
  const result = await Issue.find();
  ctx.body = result;

  await next();
};
