import { Context, Next } from 'koa';
import Test, { TestType, TestTypeModel } from '../../../models/Test';

export default async (ctx: Context, next: Next) => {
  const newITest: TestType = {
    name: { firstName: 'junsu', lastName: 'shin' },
    email: 'junsu@boostcamp.com',
  };
  const newTest = new Test(newITest);
  await newTest.save();

  ctx.body = 'success';

  await next();
};
