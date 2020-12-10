import { Types } from 'mongoose';

interface IGetCrimesCountAggregateParams {
  start: Date;
  end: Date;
  interval: number;
  issueId: string;
}

export const getCrimesCountAggregate = (
  params: IGetCrimesCountAggregateParams,
): Record<string, unknown>[] => {
  const { start, end, interval, issueId } = params;
  return [
    { $match: { _id: Types.ObjectId(issueId) } },
    {
      $lookup: {
        from: 'crimes',
        let: { crimes: '$crimeIds' },
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $in: ['$_id', '$$crimes'] } },
                { occuredAt: { $gte: start, $lte: end } },
              ],
            },
          },
          {
            $group: {
              _id: {
                $subtract: [
                  { $toLong: '$occuredAt' },
                  { $mod: [{ $toLong: '$occuredAt' }, interval] },
                ],
              },
              count: { $sum: 1 },
            },
          },
        ],
        as: 'crimes',
      },
    },
    { $project: { _id: 0, crimes: 1 } },
  ];
};

interface ISetDefaultGroupParams {
  start: Date;
  interval: number;
  intervalType: string;
  crimes: { _id: number; count: number }[];
}

const getMillsecondsHour = (start: Date): number => {
  const [MILLSECONDS_MINUTES, MILLSECONDS_SECONDS] = [1000 * 60, 1000];
  return (
    start.getMinutes() * MILLSECONDS_MINUTES +
    start.getSeconds() * MILLSECONDS_SECONDS +
    start.getMilliseconds()
  );
};

const getMillsecondsDay = (start: Date): number => {
  const [MILLSECONDS_HOUR, MILLSECONDS_MINUTES, MILLSECONDS_SECONDS] = [
    3600 * 1000,
    1000 * 60,
    1000,
  ];
  return (
    start.getUTCHours() * MILLSECONDS_HOUR +
    start.getMinutes() * MILLSECONDS_MINUTES +
    start.getSeconds() * MILLSECONDS_SECONDS +
    start.getMilliseconds()
  );
};

// 시, 분,초의 ms를 빼줌 (ex: 167143230000 - 230000)
const getMillseconds = (start: Date, intervalType: string) => {
  const startMillseconds = start.getTime();
  const startHourMillseconds =
    intervalType === 'hour'
      ? startMillseconds - getMillsecondsHour(start)
      : startMillseconds - getMillsecondsDay(start);
  return startHourMillseconds;
};

export const setDefaultGroup = (
  params: ISetDefaultGroupParams,
): { _id: number; count: number }[] => {
  const { start, crimes, interval, intervalType } = params;
  const dateInterval = intervalType === 'hour' ? 24 : 30;
  const startMs = getMillseconds(start, intervalType);
  const date: number[] = Array(dateInterval)
    .fill(0)
    .map((_, i) => {
      return startMs + i * interval;
    });
  const crimesCountByDate = date.map((time) => {
    const crimeIndex = crimes.findIndex((crime) => crime._id === time);
    if (crimeIndex >= 0) return { _id: time, count: crimes[crimeIndex].count };
    return { _id: time, count: 0 };
  });
  return crimesCountByDate;
};

enum IntervalType {
  HOUR = 'hour',
  DAY = 'day',
}

export const getDateByInterval = (
  intervalType: string,
): { start: Date; end: Date; interval: number } => {
  const end = new Date();
  if (intervalType === IntervalType.HOUR) {
    const MILLISECOND_OF_TWELVE_HOUR = 3600 * 24 * 1000;
    const start = new Date(end.getTime() - MILLISECOND_OF_TWELVE_HOUR);
    const INTERVAL_ONE_HOUR = 60 * 1000 * 60;
    return { start, end, interval: INTERVAL_ONE_HOUR };
  }
  const MILLISECOND_OF_THIRTY_DAY = 3600 * 24 * 1000 * 29;
  const start = new Date(end.getTime() - MILLISECOND_OF_THIRTY_DAY);
  const INTERVAL_ONE_DAY = 3600 * 1000 * 24;
  return { start, end, interval: INTERVAL_ONE_DAY };
};
