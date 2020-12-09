const MINUTE_MILLISEC = 1000 * 60;
const HOUR_MILLISEC = MINUTE_MILLISEC * 60;
const DAY_MILLISEC = HOUR_MILLISEC * 24;
const WEEK_MILLISEC = DAY_MILLISEC * 7;
const MONTH_MILLISEC = DAY_MILLISEC * 30; // 30일로 가정

const getPeriodByMillisec = (periodString: string): number => {
  const unit: string = periodString.substr(-1);
  const time: number = parseInt(periodString.slice(0, -1), 10);
  if (unit === 'M') {
    return time * MONTH_MILLISEC;
  }
  if (unit === 'w') {
    return time * WEEK_MILLISEC;
  }
  if (unit === 'd') {
    return time * DAY_MILLISEC;
  }
  if (unit === 'm') {
    return time * MINUTE_MILLISEC;
  }
  throw new Error('Invalid period string');
};

const getDefaultInterval = (period: string, interval: string | undefined): number => {
  const PERIOD_INTERVAL_MAP: { [key: string]: number } = {
    '1y': MONTH_MILLISEC,
    '1M': DAY_MILLISEC,
    '1d': 5 * MINUTE_MILLISEC,
  };
  if (interval !== undefined) {
    const calcedInterval = getPeriodByMillisec(interval);
    return calcedInterval;
  }
  return PERIOD_INTERVAL_MAP[period];
};

const getStatsAggregate = (interval: number, start: Date, end: Date): Record<string, unknown>[] => {
  return [
    // 1. 지금 시간부터 period를 뺀 시간까지의 데이터의 occuredAt을 추출한다.
    { $match: { occuredAt: { $gte: start, $lte: end } } },
    // 2. (occuredAt - 시간 기본값) - ((occuredAt - 시간 기본값) % interval)으로 시간을 나누어 그룹핑해주고, 그룹마다 count에 1을 더해준다.
    // mod기 때문에 나머지 초가 없어진다.
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
    // 3. _id에 저장되어있던 occuredAt의 시간을 date 객체 형태로 추출해준다.
    // 기존의 id를 제거하기 위해 _id:0을 해준다. (원리는 모르겠음)
    {
      $project: {
        occuredAt: { $convert: { input: '$_id', to: 'date' } },
        count: '$count',
        _id: 0,
      },
    },
    // 4. 오름차순으로 정렬해준다.
    {
      $sort: {
        occuredAt: 1,
      },
    },
  ];
};

export { getPeriodByMillisec, getDefaultInterval, getStatsAggregate };
