import { Context, Next } from 'koa';
import Error, { IErrorType, IErrorDocument } from '../../../models/Error';
import Issue, { IIssueType, IIssueDocument } from '../../../models/Issue';
// message, stack, type이 같은 경우 동일 에러 종류로 분류
export default async (ctx: Context, next: Next): Promise<void> => {
  const newError: IErrorType = ctx.request.body;
  newError.meta.ip = ctx.header.host;
  try {
    console.log(newError);
    const newErrorDoc: IErrorDocument = Error.build(newError);
    await newErrorDoc.save();
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
