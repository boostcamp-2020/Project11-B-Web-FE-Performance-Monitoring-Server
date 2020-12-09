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
                  { $subtract: ['$occuredAt', new Date('1970-01-01')] },
                  {
                    $mod: [{ $subtract: ['$occuredAt', new Date('1970-01-01')] }, interval],
                  },
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
  crimes: { _id: number; count: number }[];
}

// 분,초의 ms를 빼줌 (ex: 167143230000 - 230000)
const getMillsecondsHour = (start: Date) => {
  const startMillseconds = start.getTime();
  const [MILLSECONDS_MINUTES, MILLSECONDS_SECONDS] = [1000 * 60, 1000];
  const startHourMillseconds =
    startMillseconds -
    (start.getMinutes() * MILLSECONDS_MINUTES +
      start.getSeconds() * MILLSECONDS_SECONDS +
      start.getMilliseconds());
  return startHourMillseconds;
};

export const setDefaultGroup = (
  params: ISetDefaultGroupParams,
): { _id: number; count: number }[] => {
  const { start, crimes, interval } = params;
  const startMsOfHour = getMillsecondsHour(start);
  const date: number[] = Array(24)
    .fill(0)
    .map((_, i) => {
      return startMsOfHour + i * interval;
    });
  const crimesCountByDate = date.map((time) => {
    const crimeIndex = crimes.findIndex((crime) => crime._id === time);
    if (crimeIndex >= 0) return { _id: time, count: crimes[crimeIndex].count };
    return { _id: time, count: 0 };
  });
  return crimesCountByDate;
};
