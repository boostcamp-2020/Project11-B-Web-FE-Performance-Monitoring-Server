import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';
import { Context } from 'koa';

export default async (ctx: Context): Promise<void> => {
  ctx.body = 'hi';
};
