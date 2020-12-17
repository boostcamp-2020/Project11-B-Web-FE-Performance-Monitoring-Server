import { Context } from 'koa';
import { ICrime } from '../../../models/Crime';
import addCrime from '../services/addCrime';

export default async (ctx: Context): Promise<void> => {
  const newCrime: ICrime = ctx.request.body;
  const { projectId } = ctx.params;
  newCrime.projectId = projectId;
  newCrime.meta.ip = ctx.request.ip;
  try {
    await addCrime(newCrime, projectId);
    ctx.response.status = 200;
  } catch (e) {
    console.log(e);
    ctx.throw(400);
  }
};
