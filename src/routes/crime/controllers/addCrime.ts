import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Crime, { ICrime, ICrimeDocument } from '../../../models/Crime';
import Issue from '../../../models/Issue';
// message, stack, type이 같은 경우 동일 에러 종류로 분류
// project
export default async (ctx: Context, next: Next): Promise<void> => {
  const newCrime: ICrime = ctx.request.body;
  const { projectId } = ctx.params;
  newCrime.meta.ip = ctx.request.ip;
  try {
    const newCrimeDoc: ICrimeDocument = Crime.build(newCrime);
    const res = await newCrimeDoc.save();
    await Issue.findOneAndUpdate(
      {
        projectId: Types.ObjectId(projectId),
        message: newCrime.message,
        stack: newCrime.stack,
        type: newCrime.type,
        isOpen: true,
      },
      {
        $push: { crimeIds: res._id },
      },
      {
        new: true,
        upsert: true,
      },
    );
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
