import { Context, Next } from 'koa';
import { Types } from 'mongoose';

import Issue from '../../../models/Issue';
import Crime from '../../../models/Crime';
import { getPeriodByMillisec, addFilter } from '../services/statUtil';
import { getIssueSharesAggregate, getSharesAggregate } from '../services/sharesUtil';
import convertToArray from '../../../utils/convertToArray';

interface StatQuery {
  projectId: string | string[];
  type: string;
  period: string;
  browser?: string | string[];
  os?: string | string[];
  url?: string | string[];
  start?: string;
  end?: string;
}

export default async (ctx: Context, next: Next): Promise<void> => {
  const params: StatQuery = ctx.query;
  const { projectId, browser, os, url } = params;

  const projectIds = convertToArray(projectId);

  const projectObjectIds = projectIds.map((id: string) => {
    return Types.ObjectId(id);
  });

  const filterInfo = [
    { field: 'meta.browser.name', value: browser },
    { field: 'meta.os.name', value: os },
    { field: 'meta.url.name', value: url },
  ];

  const filterAggregate = filterInfo.reduce(
    (acc, curr) => addFilter(curr.field, curr.value, acc),
    [],
  );

  const period: number = getPeriodByMillisec(params.period);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const issueAggregate = getIssueSharesAggregate(projectObjectIds, start, end, filterAggregate);
  const metaAggregate = getSharesAggregate(projectIds, start, end);
  try {
    const issue = await Issue.aggregate(issueAggregate);
    const [metas] = await Crime.aggregate([...filterAggregate, ...metaAggregate]);
    ctx.body = { issue, ...metas };
  } catch (e) {
    ctx.throw(400);
  }
};
