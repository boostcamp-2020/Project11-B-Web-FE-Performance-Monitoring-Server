import { Types } from 'mongoose';
import { Context } from 'koa';
import Alert from '../../../models/Alert';

export default async (ctx: Context): Promise<void> => {
  const { projects } = ctx.request.body;
  const projectObjectIds = projects.map((proj: string) => Types.ObjectId(proj));
  try {
    const alerts = await Alert.aggregate([
      { $match: { projectId: { $in: projectObjectIds } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          'project._id': 1,
          'project.name': 1,
          'users.nickname': 1,
          'users.email': 1,
          'users._id': 1,
          period: 1,
          count: 1,
          sendedAt: 1,
          lastestIssueId: 1,
        },
      },
    ]);
    // const alerts = await Alert.find({ projectId: { $in: projects } });
    ctx.status = 200;
    ctx.body = alerts;
  } catch (e) {
    ctx.throw(400);
  }
};
