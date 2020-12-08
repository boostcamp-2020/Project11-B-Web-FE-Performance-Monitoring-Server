import { Context } from 'koa';
import Issue from '../../../models/Issue';

interface IQuery {
  issueId: string;
}

interface IBody {
  ids: string[];
  isOpen: boolean;
}

export default async (ctx: Context): Promise<void> => {
  const { ids, isOpen }: IBody = ctx.request.body;
  try {
    await Issue.updateMany({ _id: { $in: ids } }, { $set: { isOpen } });
  } catch (e) {
    ctx.throw(500, 'internal server error');
  }
  ctx.status = 200;
};
