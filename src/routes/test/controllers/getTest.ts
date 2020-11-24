import { Context, Next } from 'koa';
import db from '../../../models';
import Test, { TestType, TestTypeModel } from '../../../models/Test';

module.exports = async (ctx: Context, next: Next) => {
  const result = await Test.find();
  ctx.body = result;

  await next();
};
