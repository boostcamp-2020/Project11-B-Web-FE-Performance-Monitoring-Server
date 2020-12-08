import { Context } from 'koa';
import Crime from '../../../models/Crime';

interface IParams {
  crimeId: string;
}

export default async (ctx: Context): Promise<void> => {
  const { crimeId }: IParams = ctx.params;
  try {
    const result = await Crime.findOne({
      _id: crimeId,
    });
    if (result === null) ctx.throw(400);
    ctx.response.body = result;
  } catch (e) {
    ctx.throw(500);
  }
};
