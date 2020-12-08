import { Context, Next } from 'koa';
import Crime from '../../../models/Crime';
import { getPeriodByMillisec } from '../services/statUtil';
import { getSharesAggregate } from '../services/sharesUtil';

interface StatQuery {
  type: string;
  period: string;
  interval: string;
  start?: string;
  end?: string;
}

export default async (ctx: Context, next: Next): Promise<void> => {
  const params: StatQuery = ctx.query;

  const period: number = getPeriodByMillisec(params.period);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const result = await Crime.aggregate(getSharesAggregate(start, end));
  ctx.body = result;

  await next();
};
