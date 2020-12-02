import { Context, Next } from 'koa';
import { UserDocument } from '../../../models/User';
import { processGithubOAuth, getToken } from '../services/githubUtil';

const HOUR: number = 1000 * 60 * 60;
const tokenExpiration: number = 3 * HOUR;
const rediretURL: string =
  process.env.NODE_ENV === 'development'
    ? (process.env.ADMIN_MAIN_URL_DEV as string)
    : (process.env.ADMIN_MAIN_URL as string);
export default async (ctx: Context, next: Next): Promise<void> => {
  if (ctx.query.error) {
    ctx.redirect(rediretURL);
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
  ctx.redirect(rediretURL);
  await next();
};
