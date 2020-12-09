import { Context } from 'koa';
import Visits, { IVisitsDocument } from '../../../models/Visits';

interface IParams {
  projectId: string;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId }: IParams = ctx.params;
  const { ip } = ctx.request;
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  try {
    const visited = await Visits.findOne({ projectId, ip, date });
    if (visited !== null) {
      ctx.response.status = 200;
      return;
    }
    const newVisitsDoc: IVisitsDocument = Visits.build({ projectId, ip, date });
    await newVisitsDoc.save();
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'internal error');
  }
};
