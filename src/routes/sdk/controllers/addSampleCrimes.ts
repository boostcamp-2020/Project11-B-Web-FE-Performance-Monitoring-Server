/* eslint-disable no-param-reassign */
import { Context, Next } from 'koa';
import { ICrime } from '../../../models/Crime';
import addCrime from '../services/addCrime';
import makeSamples from '../services/makeSampleCrimes';

const SAMPLE_COUNT = 1000;

export default async (ctx: Context, next: Next): Promise<void> => {
  const newCrimes: ICrime[] = makeSamples(SAMPLE_COUNT);
  const { projectId } = ctx.params;
  const userIp = ctx.request.ip;
  newCrimes.map((newCrime) => {
    newCrime.projectId = projectId;
    newCrime.meta.ip = userIp;
  });
  try {
    await Promise.all(
      newCrimes.map(async (newCrime) => {
        await addCrime(newCrime, projectId);
      }),
    );
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }
  await next();
};
