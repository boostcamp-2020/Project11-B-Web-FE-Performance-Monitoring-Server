import { Context } from 'koa';
import getIssue from '../services/getIssue';

export default async (ctx: Context): Promise<void> => {
  const { issueId } = ctx.params;
  try {
    const result: any = await getIssue(issueId);
    ctx.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
