import { Context, Next } from 'koa';

import Crime from '../../../models/Crime';
import { getPeriodByMillisec, getDefaultInterval } from '../services/statUtil';
import { getCountByIntervalAggregate, fillTimeframes } from '../services/countByIntervalUtil';

interface StatQuery {
  projectId: string | string[];
  type: string;
  period: string;
  interval: string;
  start?: string;
  end?: string;
}

export default async (ctx: Context, next: Next): Promise<void> => {
  const params: StatQuery = ctx.query;
  const { projectId } = params;
  let projectIds;

  if (!Array.isArray(projectId)) {
    projectIds = [projectId];
  } else {
    projectIds = projectId;
  }

  const period: number = getPeriodByMillisec(params.period);
  const interval: number = getDefaultInterval(params.period, params.interval);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const [response] = await Crime.aggregate(
    getCountByIntervalAggregate(projectIds, start, end, interval),
  );

  const filler = fillTimeframes(start, end, interval);

  Object.keys(response).forEach((key) => {
    response[key].map((_: any, index: number) => {
      response[key][index].timeframes = filler(response[key][index].timeframes);
    });
  });

  ctx.body = response;

  await next();
};
