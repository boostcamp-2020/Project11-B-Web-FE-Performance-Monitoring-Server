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
    return time * MINUTE_MILLISEC * 1000000;
  }
  throw new Error('Invalid period string');
};

export default getPeriodByMillisec;
