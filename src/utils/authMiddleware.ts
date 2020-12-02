import { Context, Next } from 'koa';
import checkToken from './checkToken';

const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  if (/\/api\/auth\/github/g.test(ctx.url)) {
    await next();
    return;
  }
  try {
    const jwtToken = ctx.cookies.get('token');
    if (!jwtToken) ctx.throw(401, 'login first');
    const userId: string = checkToken(jwtToken);
    ctx.state.user = { _id: userId };
  } catch (e) {
    ctx.throw(401, 'Invalid Token');
  }
  await next();
};

export default authMiddleware;
