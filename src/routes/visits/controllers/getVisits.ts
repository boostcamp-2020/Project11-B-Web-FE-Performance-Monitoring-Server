import { Context } from 'koa';
import convertToArray from '../../../utils/convertToArray';
import {
  getDailyInMonth,
  getMonthlyInYear,
  fillDateCountsWithZero,
  fillMonthCountsWithZero,
} from '../services/visitsService';

export default async (ctx: Context): Promise<void> => {
  const { projectId, type, year, month } = ctx.query;
  try {
    if (type === 'daily') {
      const projectIds = convertToArray(projectId);
      const filledDatas = await Promise.all(
        projectIds.map(async (targetProjectId) => {
          const visitsByDate = await getDailyInMonth({ targetProjectId, year, month });
          const filledData = fillDateCountsWithZero({ visitsByDate, targetProjectId, year, month });
          return filledData;
        }),
      );
      ctx.response.body = filledDatas;
    }
    if (type === 'monthly') {
      const projectIds = convertToArray(projectId);
      const filledDatas = await Promise.all(
        projectIds.map(async (targetProjectId) => {
          const visitsByMonth = await getMonthlyInYear({ targetProjectId, year });
          const filledData = fillMonthCountsWithZero({ visitsByMonth, targetProjectId, year });
          return filledData;
        }),
      );
      ctx.response.body = filledDatas;
    }
  } catch (e) {
    ctx.throw(400);
  }
};
