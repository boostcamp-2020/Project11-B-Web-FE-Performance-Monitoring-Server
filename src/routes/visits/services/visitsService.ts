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
          date: { $dayOfMonth: '$date' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.date': 1 } },
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

const fillDateCountsWithZero = (visitsByDate: IVisitsDocument[], year: number, month: number) => {
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
        _id: { year, month, date: targetDate },
        count: 0,
      };
      return zeroData;
    });
  return filledVisitsByMonth;
};

const fillMonthCountsWithZero = (visitsByMonth: IVisitsDocument[], year: number) => {
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
        _id: { year, month: targetMonth },
        count: 0,
      };
      return zeroData;
    });
  return filledVisitsByMonth;
};

export { getDailyInMonth, getMonthlyInYear, fillDateCountsWithZero, fillMonthCountsWithZero };
