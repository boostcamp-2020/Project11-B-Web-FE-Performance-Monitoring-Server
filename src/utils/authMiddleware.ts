import { Context, Next } from 'koa';
import checkToken from './checkToken';

const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  /**
   * @TODO
   * whitelist에서 crime url 삭제
   */
  const whiteUrls = ['/api/crime', '/api/sdk'];
  if (
    /\/api\/auth\/github/g.test(ctx.url) ||
    whiteUrls.some((url) => ctx.originalUrl.includes(url))
  ) {
    await next();
    return;
  }
  try {
    const jwtToken = ctx.headers.jwt;
    if (!jwtToken) ctx.throw(401, 'login first');
    const userId: string = checkToken(jwtToken);
    ctx.state.user = { _id: userId };
  } catch (e) {
    ctx.throw(401, 'Invalid Token');
  }
  await next();
};

export default authMiddleware;
