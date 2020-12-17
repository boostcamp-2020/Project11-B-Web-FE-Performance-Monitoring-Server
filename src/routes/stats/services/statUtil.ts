import convertToArray from '../../../utils/convertToArray';

const MINUTE_MILLISEC = 1000 * 60;
const HOUR_MILLISEC = MINUTE_MILLISEC * 60;
const DAY_MILLISEC = HOUR_MILLISEC * 24;
const WEEK_MILLISEC = DAY_MILLISEC * 7;
const MONTH_MILLISEC = DAY_MILLISEC * 30; // 30일로 가정
const YEAR_MILLISEC = DAY_MILLISEC * 365;

const getPeriodByMillisec = (periodString: string): number => {
  const unit: string = periodString.substr(-1);
  const time: number = parseInt(periodString.slice(0, -1), 10);
  if (unit === 'y') {
    return time * YEAR_MILLISEC;
  }
  if (unit === 'M') {
    return time * MONTH_MILLISEC;
  }
  if (unit === 'w') {
    return time * WEEK_MILLISEC;
  }
  if (unit === 'd') {
    return time * DAY_MILLISEC;
  }
  if (unit === 'h') {
    return time * HOUR_MILLISEC;
  }
  if (unit === 'm') {
    return time * MINUTE_MILLISEC;
  }

  if (unit === 'A') {
    return time * MINUTE_MILLISEC;
  }
  throw new Error('Invalid period string');
};

const getDefaultInterval = (period: string, interval: string | undefined): number => {
  const PERIOD_INTERVAL_MAP: { [key: string]: number } = {
    '1y': MONTH_MILLISEC,
    '3M': 3 * DAY_MILLISEC,
    '1M': DAY_MILLISEC,
    '2w': 12 * HOUR_MILLISEC,
    '1w': 6 * HOUR_MILLISEC,
    '1d': 1 * HOUR_MILLISEC,
    '1h': 2 * MINUTE_MILLISEC,
  };
  if (interval !== undefined) {
    const calcedInterval = getPeriodByMillisec(interval);
    return calcedInterval;
  }
  return PERIOD_INTERVAL_MAP[period];
};

const getFilterAggregation = (field: string, arr: string[]) => {
  const aggregation: any = {
    $match: {},
  };

  aggregation.$match[field] = { $in: arr };

  return aggregation;
};

const addFilter = (field: string, value: string | string[] | undefined, aggregate: any) => {
  if (value === undefined) return aggregate;
  const fieldValues = convertToArray(value);
  const matcher = getFilterAggregation(field, fieldValues);
  return [matcher, ...aggregate];
};

const getStatsAggregate = (interval: number, start: Date, end: Date): Record<string, unknown>[] => {
  return [
    { $match: { occuredAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          $subtract: [
            { $subtract: ['$occuredAt', new Date('1970-01-01')] },
            { $mod: [{ $subtract: ['$occuredAt', new Date('1970-01-01')] }, interval] },
          ],
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        occuredAt: { $convert: { input: '$_id', to: 'date' } },
        count: '$count',
        _id: 0,
      },
    },
    {
      $sort: {
        occuredAt: 1,
      },
    },
  ];
};

export { getPeriodByMillisec, getDefaultInterval, getStatsAggregate, addFilter };
