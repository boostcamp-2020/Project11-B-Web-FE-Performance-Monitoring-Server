import { Context } from 'koa';
import { Types } from 'mongoose';
import Project from '../../../models/Project';

export default async (ctx: Context): Promise<void> => {
  let { projectId } = ctx.query;
  if (!Array.isArray(projectId)) {
    projectId = [projectId];
  }
  projectId = projectId.map((id: string) => {
    return Types.ObjectId(id);
  });

  try {
    const duration = await Project.aggregate([
      { $match: { _id: { $in: projectId } } },
      { $unwind: '$sessions' },
      {
        $group: {
          _id: '$sessions.prevLocation',
          avg_duration: { $avg: '$sessions.duration' },
          sum_duration: { $sum: '$sessions.duration' },
          count: { $sum: 1 },
          users: { $addToSet: '$sessions.ip' },
        },
      },
      {
        $addFields: {
          userCount: { $sum: { $size: '$users' } },
        },
      },
    ]);

    const move = await Project.aggregate([
      { $match: { _id: { $in: projectId } } },
      { $unwind: '$sessions' },
      {
        $group: {
          _id: {
            prevLocation: '$sessions.prevLocation',
            presentLocation: '$sessions.presentLocation',
          },

          count: { $sum: 1 },
        },
      },
    ]);

    const perDay = await Project.aggregate([
      { $match: { _id: { $in: projectId } } },
      { $unwind: '$sessions' },

      {
        $group: {
          _id: {
            year: { $year: { $toDate: '$sessions.sessionBase' } },
            month: { $month: { $toDate: '$sessions.sessionBase' } },
            day: { $dayOfMonth: { $toDate: '$sessions.sessionBase' } },
          },
          avg_duration: { $avg: '$sessions.duration' },
          sum_duration: { $sum: '$sessions.duration' },
          users: { $addToSet: '$sessions.ip' },
          count: { $sum: 1 },
        },
      },

      {
        $addFields: {
          userCount: { $sum: { $size: '$users' } },
          base: {
            $toDate: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $toString: '$_id.month' },
                '-',
                { $toString: '$_id.day' },
              ],
            },
          },
        },
      },
      { $sort: { base: -1 } },
    ]);

    ctx.body = { move, duration, perDay };
  } catch (e) {
    ctx.throw(400);
  }
};
