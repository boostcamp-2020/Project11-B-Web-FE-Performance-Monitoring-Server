import { Context } from 'koa';
import Issue from '../../../models/Issue';

interface IBody {
  ids: string[];
  isOpen: boolean;
}

export default async (ctx: Context): Promise<void> => {
  const { ids, isOpen }: IBody = ctx.request.body;
  try {
    await Issue.updateMany({ _id: { $in: ids } }, { $set: { isOpen } });
    ctx.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
