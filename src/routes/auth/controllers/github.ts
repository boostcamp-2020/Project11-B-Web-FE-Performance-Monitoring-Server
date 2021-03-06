import { Context, Next } from 'koa';
import { IUserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

const HOUR: number = 1000 * 60 * 60;
const tokenExpiration: number = 3 * HOUR;

export default async (ctx: Context, next: Next): Promise<void> => {
  const { code } = ctx.query;
  const newUser: IUserDocument | null = await processGithubOAuth(code);
  if (!newUser) {
    ctx.throw(401, 'unauthorized');
  }
  const jwtToken: string = getToken(newUser, tokenExpiration);
  ctx.response.status = 200;
  ctx.response.body = {
    nickname: newUser.nickname,
    email: newUser.email,
    token: jwtToken,
  };

  await next();
};
