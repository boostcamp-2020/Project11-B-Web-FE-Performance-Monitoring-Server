import { Context, Next } from 'koa';
import Issue, { IssueDocument } from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { issueId } = ctx.params;
  const result: IssueDocument | null = await Issue.findOne({ _id: issueId });
  /**
   * @TODO
   * null 처리 필요
   */
  ctx.body = result;

  await next();
};
