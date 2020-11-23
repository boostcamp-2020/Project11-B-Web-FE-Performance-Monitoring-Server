import { Context, Next } from 'koa';
import db from '../../../models';
import Test, { TestType, TestTypeModel } from '../../../models/Test';

module.exports = async (ctx: Context, next: Next) => {
  const newITest: TestType = {
    name: { firstName: 'junsu', lastName: 'shin' },
    email: 'junsu@boostcamp.com',
  };
  const newTest = new Test(newITest);
  await newTest.save();

  const result = await Test.find();
  ctx.body = result;

  await next();
};
