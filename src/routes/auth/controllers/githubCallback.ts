import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

const HOUR: number = 1000 * 60 * 60;
const tokenExpiration: number = 3 * HOUR;

export default async (ctx: Context, next: Next): Promise<void> => {
  const accessCode: string = ctx.query.code;
  const newUser: UserDocument | null = await processGithubOAuth(accessCode);
  const jwtToken: string | undefined = newUser ? getToken(newUser, tokenExpiration) : undefined;
  if (jwtToken) {
    ctx.cookies.set('token', jwtToken, { httpOnly: true, maxAge: tokenExpiration });
  }
  ctx.redirect('http://localhost:3001');
  await next();
};
