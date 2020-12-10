const getGroupAndCountAggregate = (field: string, interval: number) => {
  return [
    {
      $group: {
        _id: {
          interval: {
            $toDate: {
              $subtract: [
                { $toLong: '$occuredAt' },
                { $mod: [{ $toLong: '$occuredAt' }, interval] },
              ],
            },
          },
          field,
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.field',
        timeframes: {
          $push: {
            time: '$_id.interval',
            count: { $sum: '$count' },
          },
        },
      },
    },
    { $project: { _id: 0, name: '$_id', timeframes: 1 } },
    { $sort: { name: 1 } },
  ];
};

const getCountByIntervalAggregate = (
  projectIds: string[],
  start: Date,
  end: Date,
  interval: number,
): Record<string, unknown>[] => {
  return [
    { $match: { occuredAt: { $gte: start, $lte: end }, projectId: { $in: projectIds } } },
    {
      $facet: {
        all: getGroupAndCountAggregate('', interval),
        browser: getGroupAndCountAggregate('$meta.browser.name', interval),
        os: getGroupAndCountAggregate('$meta.os.name', interval),
        url: getGroupAndCountAggregate('$meta.url', interval),
      },
    },
  ];
};

const floorByInterval = (dateTime: Date, interval: number) => {
  const ms = dateTime.getTime();
  const mod = ms % interval;
  return new Date(ms - mod);
};

const isTimeEqual = (first: Date, second: Date): boolean => {
  return first.getTime() === second.getTime();
};

interface ITimeframe {
  time: Date;
  count: number;
}

const fillTimeframes = (start: Date, end: Date, interval: number) => (
  timeframes: ITimeframe[],
): ITimeframe[] => {
  const startms = floorByInterval(start, interval).getTime();
  const endms = floorByInterval(end, interval).getTime();
  const timeframeCount = (endms - startms) / interval;
  const getNthTime = (n: number) => new Date(startms + n * interval);
  const newTimeframes = Array(timeframeCount)
    .fill(0)
    .map((_, index) => ({ time: getNthTime(index), count: 0 }));

  timeframes.forEach((oldTimeframe) => {
    const newTimeframe = newTimeframes.find((item) => isTimeEqual(item.time, oldTimeframe.time));
    if (newTimeframe !== undefined) newTimeframe.count = oldTimeframe.count;
  });

  return newTimeframes;
};

export { getCountByIntervalAggregate, fillTimeframes };
