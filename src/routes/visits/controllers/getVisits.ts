import { Context } from 'koa';
import convertToArray from '../../../utils/convertToArray';
import {
  getDailyInMonth,
  getMonthlyInYear,
  fillDateCountsWithZero,
  fillMonthCountsWithZero,
} from '../services/visitsService';

interface IQuery {
  projectId: string;
  type: string;
  year: string;
  month: string;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId, type, year, month }: IQuery = ctx.query;
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  try {
    if (type === 'daily') {
      const projectIds = convertToArray(projectId);
      const filledDatas = await Promise.all(
        projectIds.map(async (targetProjectId) => {
          const visitsByDate = await getDailyInMonth({
            targetProjectId,
            year: yearNum,
            month: monthNum,
          });
          const filledData = fillDateCountsWithZero({
            visitsByDate,
            targetProjectId,
            year: yearNum,
            month: monthNum,
          });
          return filledData;
        }),
      );
      ctx.response.body = filledDatas;
    }
    if (type === 'monthly') {
      const projectIds = convertToArray(projectId);
      const filledDatas = await Promise.all(
        projectIds.map(async (targetProjectId) => {
          const visitsByMonth = await getMonthlyInYear({ targetProjectId, year: yearNum });
          const filledData = fillMonthCountsWithZero({
            visitsByMonth,
            targetProjectId,
            year: yearNum,
          });
          return filledData;
        }),
      );
      ctx.response.body = filledDatas;
    }
  } catch (e) {
    ctx.throw(400);
  }
};
