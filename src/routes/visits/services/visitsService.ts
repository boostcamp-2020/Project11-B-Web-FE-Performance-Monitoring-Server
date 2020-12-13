import { Types } from 'mongoose';
import Visits, { IVisitsDocument } from '../../../models/Visits';

interface IDailyInMonthParams {
  targetProjectId: string;
  year: number;
  month: number;
}

const getDailyInMonth = async (params: IDailyInMonthParams): Promise<IVisitsDocument[]> => {
  const { targetProjectId, year, month }: IDailyInMonthParams = params;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const visitsByDate = await Visits.aggregate([
    {
      $match: {
        $and: [
          { projectId: Types.ObjectId(targetProjectId) },
          { date: { $gte: startDate, $lte: endDate } },
        ],
      },
    },
    {
      $group: {
        _id: {
          projectId: '$projectId',
          year: { $year: '$date' },
          month: { $month: '$date' },
          date: { $dayOfMonth: '$date' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
  ]);
  return visitsByDate;
};

interface FillDateCountParams {
  visitsByDate: IVisitsDocument[];
  targetProjectId: string;
  year: number;
  month: number;
}

const fillDateCountsWithZero = (params: FillDateCountParams) => {
  const { visitsByDate, targetProjectId: projectId, year, month } = params;
  const lastDate = new Date(year, month + 1, 0).getDate();
  let i = 0;
  const filledVisitsByMonth = Array(lastDate)
    .fill(0)
    .map((_, index) => {
      const targetDate = index + 1;
      if (i < visitsByDate.length && targetDate === visitsByDate[i]._id.date) {
        const targetData = visitsByDate[i];
        i += 1;
        return targetData;
      }
      const zeroData = {
        _id: { year, month, date: targetDate, projectId },
        count: 0,
      };
      return zeroData;
    });
  return filledVisitsByMonth;
};

interface IMonthlyInYearParams {
  targetProjectId: string;
  year: number;
}

const getMonthlyInYear = async (params: IMonthlyInYearParams): Promise<IVisitsDocument[]> => {
  const { targetProjectId, year } = params;
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 12, 0);
  const visitsByMonth = await Visits.aggregate([
    {
      $match: {
        $and: [
          { projectId: Types.ObjectId(targetProjectId) },
          { date: { $gte: startDate, $lte: endDate } },
        ],
      },
    },
    {
      $group: {
        _id: {
          projectId: '$projectId',
          year: { $year: '$date' },
          month: { $month: '$date' },
          ip: '$ip',
        },
      },
    },
    {
      $group: {
        _id: {
          projectId: '$_id.projectId',
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

interface FillMonthCountParams {
  visitsByMonth: IVisitsDocument[];
  targetProjectId: string;
  year: number;
}

const fillMonthCountsWithZero = (params: FillMonthCountParams) => {
  const { visitsByMonth, targetProjectId: projectId, year }: FillMonthCountParams = params;
  const lastMonth = 12;
  let i = 0;
  const filledVisitsByMonth = Array(lastMonth)
    .fill(0)
    .map((_, index) => {
      const targetMonth = index + 1;
      if (i < visitsByMonth.length && targetMonth === visitsByMonth[i]._id.month) {
        const targetData = visitsByMonth[i];
        i += 1;
        return targetData;
      }
      const zeroData = {
        _id: { year, month: targetMonth, projectId },
        count: 0,
      };
      return zeroData;
    });
  return filledVisitsByMonth;
};

export { getDailyInMonth, getMonthlyInYear, fillDateCountsWithZero, fillMonthCountsWithZero };
