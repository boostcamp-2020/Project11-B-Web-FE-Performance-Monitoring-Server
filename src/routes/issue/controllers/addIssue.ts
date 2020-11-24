import { Context, Next } from 'koa';
import { IssueType, IssueTypeModel, build } from '../../../models/Issue';

export default async (ctx: Context, next: Next) => {
  const newIssue: IssueType = ctx.request.body;
  newIssue.meta.ip = ctx.header.host;
  try {
    const newIssueDoc: IssueTypeModel = build(newIssue);
    await newIssueDoc.save();
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
