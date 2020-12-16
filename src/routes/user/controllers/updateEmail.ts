import { Types } from 'mongoose';
import { Context } from 'koa';
import User from '../../../models/User';

interface IBody {
  email: string;
}

export default async (ctx: Context): Promise<void> => {
  const { email }: IBody = ctx.request.body;
  const userId = ctx.state.user._id;
  try {
    await User.findOneAndUpdate({ _id: Types.ObjectId(userId) }, { email });
    ctx.status = 200;
  } catch (e) {
    ctx.throw(500);
  }
};
