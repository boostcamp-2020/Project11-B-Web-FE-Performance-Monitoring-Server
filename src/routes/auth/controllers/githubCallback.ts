import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth } from '../services/githubUtil';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { code } = ctx.query;
  const newUser: UserDocument | null = await processGithubOAuth(code);

  ctx.redirect('http://localhost:3001');
  await next();
};
