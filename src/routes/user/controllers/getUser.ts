import { Context } from 'koa';
import User from '../../../models/User';

interface IParams {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { id: userId }: IParams = ctx.params;
  try {
    const result = await User.findById(userId);
    if (result === null) throw Error();
    ctx.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
