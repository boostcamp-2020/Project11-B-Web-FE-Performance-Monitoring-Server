import { Types } from 'mongoose';

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

const getSharesAggregate = (
  projectIds: string[],
  start: Date,
  end: Date,
): Record<string, unknown>[] => {
  return [
    { $match: { occuredAt: { $gte: start, $lte: end }, projectId: { $in: projectIds } } },
    {
      $facet: {
        browser: getGroupAndCountAggregate('$meta.browser.name'),
        os: getGroupAndCountAggregate('$meta.os.name'),
        url: getGroupAndCountAggregate('$meta.url'),
      },
    },
  ];
};

const getIssueSharesAggregate = (
  projectIds: Types.ObjectId[],
  start: Date,
  end: Date,
): Record<string, unknown>[] => {
  return [
    { $match: { projectId: { $in: projectIds } } },
    {
      $lookup: {
        from: 'crimes',
        let: { crimeIds: '$crimeIds' },
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $in: ['$_id', '$$crimeIds'] } },
                { occuredAt: { $gte: start, $lte: end } },
              ],
            },
          },
          {
            $count: 'value',
          },
        ],
        as: 'crimeCount',
      },
    },
    { $unwind: '$crimeCount' },
    { $project: { _id: 1, type: 1, message: 1, count: '$crimeCount.value' } },
  ];
};

export { getSharesAggregate, getIssueSharesAggregate };
