import { Context } from 'koa';
import {
  getDailyInMonth,
  getMonthlyInYear,
  fillDateCountsWithZero,
  fillMonthCountsWithZero,
} from '../services/visitsService';

interface IParams {
  projectId: string;
}

interface IQuery {
  type: string;
  year: number;
  month: number;
}

export default async (ctx: Context): Promise<void> => {
  const { projectId }: IParams = ctx.params;
  const { type, year, month }: IQuery = ctx.query;
  if (type === 'daily') {
    const visitsByDate = await getDailyInMonth({ projectId, year, month });
    const filledData = fillDateCountsWithZero(visitsByDate, year, month);
    ctx.response.body = filledData;
    return;
  }
  if (type === 'monthly') {
    const visitsByMonth = await getMonthlyInYear({ projectId, year });
    const filledData = fillMonthCountsWithZero(visitsByMonth, year);
    ctx.response.body = filledData;
    return;
  }

  ctx.throw(400, 'internal server error');
};
