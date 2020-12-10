import { Types } from 'mongoose';
import { Context } from 'koa';
import Issue from '../../../models/Issue';

export default async (ctx: Context): Promise<void> => {
  const { issueId } = ctx.params;
  try {
    const [result] = await Issue.aggregate([
      { $match: { _id: Types.ObjectId(issueId) } },
      {
        $lookup: {
          from: 'crimes',
          let: { crimes: '$crimeIds' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$crimes'] } } },
            {
              $facet: {
                browser: [
                  {
                    $group: {
                      _id: '$meta.browser.name',
                      count: { $sum: 1 },
                    },
                  },
                  { $project: { _id: 0, name: '$_id', count: 1 } },
                  { $sort: { count: -1 } },
                ],
                os: [
                  {
                    $group: {
                      _id: '$meta.os.name',
                      count: { $sum: 1 },
                    },
                  },
                  { $project: { _id: 0, name: '$_id', count: 1 } },
                  { $sort: { count: -1 } },
                ],
                url: [
                  {
                    $group: {
                      _id: '$meta.url',
                      count: { $sum: 1 },
                    },
                  },
                  { $project: { _id: 0, name: '$_id', count: 1 } },
                  { $sort: { count: -1 } },
                ],
              },
            },
          ],
          as: 'metas',
        },
      },
      { $unwind: '$metas' },
      { $project: { metas: 1 } },
    ]);
    ctx.body = result;
  } catch (e) {
    console.log(e);
    ctx.throw(500);
  }
};
