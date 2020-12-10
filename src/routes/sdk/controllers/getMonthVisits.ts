import { Context } from 'koa';
import { Types } from 'mongoose';
import Visits from '../../../models/Visits';

interface IParams {
  projectId: string;
}
interface IQuery {
  year: number;
  month: number;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId }: IParams = ctx.params;
  const { year, month }: IQuery = ctx.query;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const visitsByDate = await Visits.aggregate([
    {
      $match: {
        $and: [
          { projectId: Types.ObjectId(projectId) },
          { date: { $gte: startDate, $lte: endDate } },
        ],
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.day': 1 } },
  ]);

  ctx.response.body = visitsByDate;
};
