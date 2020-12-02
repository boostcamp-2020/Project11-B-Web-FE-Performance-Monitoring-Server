import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<void> => {
  ctx.redirect(
    `https://github.com/login/oauth/authorize?client_id=${
      process.env.NODE_ENV === 'development'
        ? process.env.GITHUB_OAUTH_CLIENT_ID_DEV
        : process.env.GITHUB_OAUTH_CLIENT_ID
    }&scope=user:email`,
  );
  await next();
};
