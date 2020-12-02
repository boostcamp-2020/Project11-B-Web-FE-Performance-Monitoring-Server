import { Context, Next } from 'koa';
import Issue, { IIssueDocument } from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { issueId } = ctx.params;
  const result: IIssueDocument | null = await Issue.findOne({ _id: issueId });
  /**
   * @TODO
   * null 처리 필요
   */
  ctx.body = result;

  await next();
};
