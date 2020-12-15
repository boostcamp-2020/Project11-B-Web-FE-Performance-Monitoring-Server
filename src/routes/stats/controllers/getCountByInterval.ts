import { Context } from 'koa';

import Crime from '../../../models/Crime';
import { getPeriodByMillisec, getDefaultInterval, addFilter } from '../services/statUtil';
import { getCountByIntervalAggregate, fillTimeframes } from '../services/countByIntervalUtil';
import convertToArray from '../../../utils/convertToArray';

interface StatQuery {
  projectId: string | string[];
  type: string;
  period: string;
  interval: string;
  browser?: string | string[];
  os?: string | string[];
  url?: string | string[];
  start?: string;
  end?: string;
}

export default async (ctx: Context): Promise<void> => {
  const params: StatQuery = ctx.query;
  const { projectId, browser, os, url } = params;

  const projectIds = convertToArray(projectId);

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
  const interval: number = getDefaultInterval(params.period, params.interval);
  const start: Date = params.start ? new Date(params.start) : new Date(Date.now() - period);
  const end: Date = params.end ? new Date(params.end) : new Date();

  const intervalAggregate = getCountByIntervalAggregate(projectIds, start, end, interval);

  const aggregation = [...filterAggregate, ...intervalAggregate];
  try {
    const [response] = await Crime.aggregate(aggregation);

    const filler = fillTimeframes(start, end, interval);

    Object.keys(response).forEach((key) => {
      response[key].map((_: any, index: number) => {
        response[key][index].timeframes = filler(response[key][index].timeframes);
      });
    });

    ctx.body = response;
  } catch (e) {
    ctx.throw(400);
  }
};
