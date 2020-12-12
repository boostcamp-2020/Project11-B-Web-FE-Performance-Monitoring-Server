import { Context } from 'koa';
import { Types } from 'mongoose';
import convertToArray from '../../../utils/convertToArray';
import {
  getDailyInMonth,
  getMonthlyInYear,
  fillDateCountsWithZero,
  fillMonthCountsWithZero,
} from '../services/visitsMultiService';

export default async (ctx: Context): Promise<void> => {
  const { projectId, type, year, month } = ctx.query;
  if (type === 'daily') {
    const projectIds = convertToArray(projectId);
    const filledDatas = await Promise.all(
      projectIds.map(async (targetProjectId) => {
        const visitsByDate = await getDailyInMonth({ targetProjectId, year, month });
        const filledData = fillDateCountsWithZero(visitsByDate, targetProjectId, year, month);
        return filledData;
      }),
    );
    ctx.response.body = filledDatas;
  }
};
