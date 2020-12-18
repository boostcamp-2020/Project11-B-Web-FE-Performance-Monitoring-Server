import Issue, { IIssueDocument } from '../../../models/Issue';

const CONTENT_PER_PAGE = 15;

const getIssues = async (
  projectId: string,
  page: number,
  start: Date,
  tagQuery: [],
): Promise<any> => {
  const [result]: IIssueDocument[] = await Issue.aggregate([
    { $match: { projectId: { $in: projectId } } },
    { $addFields: { stack: { $arrayElemAt: ['$stack', 0] } } },
    {
      $lookup: {
        from: 'projects',
        let: { id: '$projectId' },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$id'] } } }, { $project: { name: 1 } }],

        as: 'project',
      },
    },
    {
      $lookup: {
        from: 'crimes',
        let: { crimeIds: '$crimeIds' },
        pipeline: [
          {
            $match: {
              $and: [{ $expr: { $in: ['$_id', '$$crimeIds'] } }, { occuredAt: { $gte: start } }],
            },
          },
        ],

        as: 'totalCrime',
      },
    },
    { $addFields: { lastCrime: { $arrayElemAt: ['$totalCrime', -1] } } },
    {
      $group: {
        _id: {
          _id: '$_id',
          type: '$type',
          message: '$message',
          stack: '$stack',
          lastCrime: '$lastCrime',
          project: '$project',
        },
        crimeIds: { $addToSet: '$crimeIds' },
        users: { $addToSet: '$totalCrime.meta.ip' },
        tags: { $addToSet: '$totalCrime.meta' },
      },
    },
    { $unwind: '$crimeIds' },
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$_id._id',
        type: { $addToSet: '$_id.type' },
        message: { $addToSet: '$_id.message' },
        stack: { $addToSet: '$_id.stack' },
        project: { $addToSet: '$_id.project' },
        crimeIds: { $addToSet: '$crimeIds' },
        lastCrime: { $addToSet: '$_id.lastCrime' },
        crimeCount: { $sum: { $size: '$crimeIds' } },
        userCount: { $sum: { $size: '$users' } },
        tags: { $addToSet: '$tags' },
      },
    },
    { $unwind: '$tags' },
    { $unwind: '$tags' },
    { $addFields: { tagArr: { $objectToArray: '$tags' } } },

    tagQuery ? { $match: { tagArr: { $all: tagQuery } } } : { $sort: { tags: 1 } },
    { $unwind: '$type' },
    { $unwind: '$message' },
    { $unwind: '$stack' },
    { $unwind: '$project' },
    { $unwind: '$project' },
    { $unwind: '$crimeIds' },
    { $unwind: '$lastCrime' },
    { $addFields: { occuredAt: { $toDate: '$lastCrime.occuredAt' } } },
    {
      $sort: {
        occuredAt: -1,
        crimeCount: 1,
        userCount: 1,
        _id: 1,
      },
    },
    {
      $facet: {
        metaData: [
          { $count: 'total' },
          { $addFields: { totalPage: { $ceil: { $divide: ['$total', CONTENT_PER_PAGE] } } } },
          { $addFields: { page } },
          { $addFields: { countPerPage: CONTENT_PER_PAGE } },
        ],
        data: [{ $skip: (page - 1) * CONTENT_PER_PAGE }, { $limit: CONTENT_PER_PAGE }],
      },
    },
    { $unwind: '$metaData' },
  ]);
  return result;
};

export default getIssues;
