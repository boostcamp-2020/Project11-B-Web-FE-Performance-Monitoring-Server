import { Context, Next } from 'koa';
import checkToken from './checkToken';

const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const whiteUrls = ['/api/sdk'];
  if (
    /\/api\/auth\/github/g.test(ctx.url) ||
    whiteUrls.some((url) => ctx.originalUrl.includes(url))
  ) {
    await next();
    return;
  }
  try {
    const jwtToken = ctx.headers.token;
    if (!jwtToken) ctx.throw(401, 'login first');
    const userId: string = checkToken(jwtToken);
    ctx.state.user = { _id: userId };
  } catch (e) {
    ctx.throw(401);
  }
  await next();
};

export default authMiddleware;
