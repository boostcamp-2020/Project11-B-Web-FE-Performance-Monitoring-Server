import { Context } from 'koa';
import { Types } from 'mongoose';
import Visits from '../../../models/Visits';

interface IParams {
  projectId: string;
}

interface IQuery {
  year: number;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId }: IParams = ctx.params;
  const { year }: IQuery = ctx.query;

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 12, 0);
  const visitsByMonth = await Visits.aggregate([
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
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);
  ctx.response.body = visitsByMonth;
};
