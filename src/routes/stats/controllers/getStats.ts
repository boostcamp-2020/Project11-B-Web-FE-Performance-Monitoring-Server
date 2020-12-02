import { Context, Next } from 'koa';
import Issue, { IIssueDocument } from '../../../models/Issue';
import { getPeriodByMillisec, getDefaultInterval, getStatsAggregate } from '../services/statUtil';

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
  const interval: number = getDefaultInterval(params.period, params.interval);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period); // 현재 - 구할 시간
  const end: Date = params.end ? new Date(params.end) : new Date();

  const result: IIssueDocument[] = await Issue.aggregate(getStatsAggregate(interval, start, end));
  ctx.body = result;

  await next();
};
