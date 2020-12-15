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
    if (period) {
      const alert = Alert.build({ projectId, users, period, count, sendedAt, lastestIssueId });
      await alert.save();
    } else {
      const alert = Alert.build({
        projectId,
        users,
        period,
        count,
        sendedAt,
        lastestIssueId,
      });
      await alert.save();
    }
    ctx.status = 200;
  } catch (e) {
    ctx.throw(400);
  }
};
