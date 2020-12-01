import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { code } = ctx.query;
  const newUser: UserDocument | null = await processGithubOAuth(code);
  const token: string | undefined = newUser ? getToken(newUser) : undefined;
  if (token) {
    ctx.cookies.set('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  }
  ctx.redirect('http://localhost:3001');
  await next();
};
