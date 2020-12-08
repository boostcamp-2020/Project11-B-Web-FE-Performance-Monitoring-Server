import { Context, Next } from 'koa';
import { Types } from 'mongoose';

import Issue from '../../../models/Issue';
import Crime from '../../../models/Crime';
import { getPeriodByMillisec } from '../services/statUtil';
import { getIssueSharesAggregate, getSharesAggregate } from '../services/sharesUtil';

interface StatQuery {
  projectId: string | string[];
  type: string;
  period: string;
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

  const projectObjectIds = projectIds.map((id: string) => {
    return Types.ObjectId(id);
  });

  const period: number = getPeriodByMillisec(params.period);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const issues = await Issue.aggregate(getIssueSharesAggregate(projectObjectIds, start, end));
  const [metas] = await Crime.aggregate(getSharesAggregate(projectIds, start, end));
  ctx.body = { issues, ...metas };

  await next();
};
