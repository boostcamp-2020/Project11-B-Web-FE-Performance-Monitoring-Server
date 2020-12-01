import { Context, Next } from 'koa';
import fetch from 'node-fetch';

const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

export default async (ctx: Context, next: Next): Promise<void> => {
  const { code } = ctx.query;
  ctx.response.status = 200;
  const accessResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    },
  );

  const accessResponseBody = await accessResponse.json();
  const accessToken = accessResponseBody.access_token;

  const profileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
  });
  const profile = await profileResponse.json();

  // ctx.body = { profile: profile.login };
  ctx.redirect('http://localhost:3001');
  await next();
};
