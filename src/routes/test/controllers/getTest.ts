import { Context, Next } from 'koa';
import Test, { TestType, TestTypeModel } from '../../../models/Test';

export default async (ctx: Context, next: Next) => {
  const result = await Test.find();
  ctx.body = result;

  await next();
};
