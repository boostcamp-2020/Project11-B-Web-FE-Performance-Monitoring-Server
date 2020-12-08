const getGroupAndCountAggregate = (field: string) => {
  return [
    {
      $group: {
        _id: field,
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ];
};

const getSharesAggregate = (start: Date, end: Date): Record<string, unknown>[] => {
  return [
    { $match: { occuredAt: { $gte: start, $lte: end } } },
    {
      $facet: {
        browsers: getGroupAndCountAggregate('$meta.browser.name'),
        os: getGroupAndCountAggregate('$meta.os.name'),
        url: getGroupAndCountAggregate('$meta.url'),
      },
    },
  ];
};

export { getSharesAggregate };
