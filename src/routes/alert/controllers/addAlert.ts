import { Context } from 'koa';
import Alert from '../../../models/Alert';
import Issue from '../../../models/Issue';

export default async (ctx: Context): Promise<void> => {
  const { projectId } = ctx.params;
  const { users, period, count } = ctx.request.body;
  const sendedAt = new Date();
  try {
    const lastestIssue = await Issue.findOne().sort({ _id: -1 });
    const lastestIssueId = lastestIssue ? lastestIssue._id : undefined;
    const alert = Alert.build({
      project: projectId,
      users,
      period,
      count,
      sendedAt,
      lastestIssueId,
    });
    await alert
      .save()
      .then((doc) => doc.populate('project').execPopulate())
      .then((doc) => doc.populate('users').execPopulate());
    ctx.body = alert;
    ctx.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
