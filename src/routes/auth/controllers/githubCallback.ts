import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

const HOUR: number = 1000 * 60 * 60;
const tokenExpiration: number = 3 * HOUR;

export default async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.query) {
    ctx.redirect(process.env.ADMIN_MAIN_URL as string);
    await next();
    return;
  }
  const accessCode: string = ctx.query.code;
  const newUser: UserDocument = (await processGithubOAuth(accessCode)) as UserDocument;
  const jwtToken: string = getToken(newUser, tokenExpiration);
  if (jwtToken) {
    ctx.cookies.set('nickname', newUser.nickname, { httpOnly: false, maxAge: tokenExpiration });
    ctx.cookies.set('token', jwtToken, { httpOnly: false, maxAge: tokenExpiration });
    /**
     * @TODO
     * http only option
     */
  }
  ctx.redirect(process.env.ADMIN_MAIN_URL as string);
  await next();
};
