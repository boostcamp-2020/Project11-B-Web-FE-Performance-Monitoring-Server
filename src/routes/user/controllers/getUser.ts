import { Context } from 'koa';
import User from '../../../models/User';
import checkToken from '../../../utils/checkToken';

interface IParams {
  id: string;
}

export default async (ctx: Context): Promise<void> => {
  const { token } = ctx.headers;
  const { id: userParams }: IParams = ctx.params;
  let userId = '';
  if (userParams !== 'self') userId = userParams;
  else userId = checkToken(token);
  try {
    const result = await User.findById(userId);
    if (result === null) throw Error();
    ctx.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
