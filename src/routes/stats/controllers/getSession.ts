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
      //   { $count: 'total' },
    ]);

    const perTime = await Project.aggregate([
      { $match: { _id: { $in: projectId } } },
      { $unwind: '$sessions' },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: '$sessions.sessionBase' } },
            month: { $month: { $toDate: '$sessions.sessionBase' } },
            day: { $dayOfMonth: { $toDate: '$sessions.sessionBase' } },
            hour: { $hour: { $toDate: '$sessions.sessionBase' } },
          },
          avg_duration: { $avg: '$sessions.duration' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
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
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const perMonth = await Project.aggregate([
      { $match: { _id: { $in: projectId } } },
      { $unwind: '$sessions' },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: '$sessions.sessionBase' } },
            month: { $month: { $toDate: '$sessions.sessionBase' } },
          },
          avg_duration: { $avg: '$sessions.duration' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    ctx.body = { move, duration, perTime, perDay, perMonth };
  } catch (e) {
    ctx.throw(500);
  }
};
