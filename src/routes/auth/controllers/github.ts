import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

const HOUR: number = 1000 * 60 * 60;
const tokenExpiration: number = 3 * HOUR;

export default async (ctx: Context, next: Next): Promise<void> => {
  const { code } = ctx.query;
  const newUser: UserDocument | null = await processGithubOAuth(code);
  if (!newUser) {
    ctx.throw(401, 'unauthorized');
  }
  const jwtToken: string = getToken(newUser, tokenExpiration);
  ctx.response.status = 200;
  ctx.response.body = {
    nickname: newUser.nickname,
    token: jwtToken,
  };

  await next();
};
