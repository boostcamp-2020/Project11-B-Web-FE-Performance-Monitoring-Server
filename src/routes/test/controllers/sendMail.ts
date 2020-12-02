import { Context, Next } from 'koa';
import sendMail from '../../../utils/sendMail';

export default async (ctx: Context, next: Next): Promise<void> => {
  const info = await sendMail({
    to: ['saeeng.opt@gmail.com'], // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>',
  });
  ctx.body = info;
  await next();
};
