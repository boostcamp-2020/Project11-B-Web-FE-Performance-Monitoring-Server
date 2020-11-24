import { Context, Next } from 'koa';
import Issue from '../../../models/Issue';

export default async (ctx: Context, next: Next) => {
  await Issue.deleteMany({});
  ctx.response.status = 200;
  await next();
};
