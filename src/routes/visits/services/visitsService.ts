import { Types } from 'mongoose';
import Visits, { IVisitsDocument } from '../../../models/Visits';

interface IDailyInMonthParams {
  projectId: string;
  year: number;
  month: number;
}

const getDailyInMonth = async (params: IDailyInMonthParams): Promise<IVisitsDocument[]> => {
  const { projectId, year, month }: IDailyInMonthParams = params;

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
  return visitsByDate;
};

interface IMonthlyInYearParams {
  projectId: string;
  year: number;
}

const getMonthlyInYear = async (params: IMonthlyInYearParams): Promise<IVisitsDocument[]> => {
  const { projectId, year }: IMonthlyInYearParams = params;
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
          ip: '$ip',
        },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);
  return visitsByMonth;
};

export { getDailyInMonth, getMonthlyInYear };
