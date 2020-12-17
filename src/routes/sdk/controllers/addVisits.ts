import { Context } from 'koa';
import Visits, { IVisitsDocument } from '../../../models/Visits';
import parseDate from '../services/parseDate';

interface IParams {
  projectId: string;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId }: IParams = ctx.params;
  const { ip } = ctx.request;
  const today = new Date();
  const { year, month, date } = parseDate(today);
  try {
    const visited = await Visits.findOne({ projectId, ip, year, month, date });
    if (visited !== null) {
      ctx.response.status = 200;
      return;
    }
    const newVisitsDoc: IVisitsDocument = Visits.build({ projectId, ip, year, month, date });
    await newVisitsDoc.save();
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
