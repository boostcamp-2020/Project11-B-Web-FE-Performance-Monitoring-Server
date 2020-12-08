import { Context, Next } from 'koa';
import Crime from '../../../models/Crime';
import { getPeriodByMillisec } from '../services/statUtil';
import { getSharesAggregate } from '../services/sharesUtil';

interface StatQuery {
  projectId: string | string[];
  type: string;
  period: string;
  start?: string;
  end?: string;
}

export default async (ctx: Context, next: Next): Promise<void> => {
  const params: StatQuery = ctx.query;
  let { projectId: projectIds } = params;

  if (!Array.isArray(projectIds)) {
    projectIds = [projectIds];
  }

  const period: number = getPeriodByMillisec(params.period);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const [metas] = await Crime.aggregate(getSharesAggregate(projectIds, start, end));
  ctx.body = metas;

  await next();
};
