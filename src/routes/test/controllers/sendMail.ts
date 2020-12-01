import { Context, Next } from 'koa';

import sendMail from '../../../utils/sendMail';

export default async (ctx: Context, next: Next): Promise<void> => {
  const info = await sendMail(
    ['saeeng.opt@gmail.com', 'dinero8807@naver.com'], // list of receivers
    'Hello ✔', // Subject line
    'Hello world?', // plain text body
    '<div>Hello world?!!!!!!!!!!</div>', // html body
  );
  ctx.body = info;
  await next();
};
