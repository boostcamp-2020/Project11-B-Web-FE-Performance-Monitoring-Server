/* eslint-disable no-param-reassign */
import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Crime, { ICrime, ICrimeDocument } from '../../../models/Crime';
import Issue from '../../../models/Issue';

export default async (ctx: Context, next: Next): Promise<void> => {
  const newCrimes: ICrime[] = ctx.request.body;
  const { projectId } = ctx.params;
  const userIp = ctx.request.ip;
  newCrimes.map((newCrime) => {
    newCrime.projectId = projectId;
    newCrime.meta.ip = userIp;
  });
  try {
    await Promise.all(
      newCrimes.map(async (newCrime) => {
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
      }),
    );
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
