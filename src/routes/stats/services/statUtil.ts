const MINUTE_MILLISEC = 1000 * 60;
const HOUR_MILLISEC = MINUTE_MILLISEC * 60;
const DAY_MILLISEC = HOUR_MILLISEC * 24;
const MONTH_MILLISEC = DAY_MILLISEC * 30; // 30일로 가정

const getPeriodByMillisec = (periodString: string): number => {
  const unit: string = periodString.substr(-1);
  const time: number = parseInt(periodString.slice(0, -1), 10);
  if (unit === 'M') {
    return time * MONTH_MILLISEC;
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

export { getPeriodByMillisec, getDefaultInterval };
