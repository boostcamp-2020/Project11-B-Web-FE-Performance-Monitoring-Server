import { Types } from 'mongoose';
import Issue from '../models/Issue';
import Alert from '../models/Alert';
import sendMail from './sendMail';
import { alertMailTemplateByCount, alertMailTemplateByPeriod } from './mailTemplate/alertMail';
import { getPeriodByMillisec } from '../routes/stats/services/statUtil';

const alertListAggregate = () => {
  return [
    {
      $match: {
        sendedAt: { $lte: new Date() },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'project',
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
        period: 1,
        count: 1,
        sendedAt: 1,
        lastestIssueId: 1,
      },
    },
  ];
};

const sendEmailByCount = async (
  alertId: string,
  project: any,
  lastestIssueId: string,
  count: number,
  userList: string[],
): Promise<void> => {
  const issues = await Issue.aggregate([
    {
      $match: {
        $and: [{ projectId: Types.ObjectId(project._id) }, { _id: { $gt: lastestIssueId } }],
      },
    },
    { $sort: { _id: -1 } },
    { $limit: count },
  ]);
  if (issues.length === count) {
    await sendMail({
      to: userList,
      ...alertMailTemplateByCount(project.name, issues),
    });
    await Alert.updateOne({ _id: alertId }, { $set: { lastestIssueId: issues[0]._id } });
  }
};

const alertByCount = async (alert: any): Promise<void> => {
  const { _id: alertId, lastestIssueId, count, users, project } = alert;
  const userList = users.map((user: any) => user.email);
  if (lastestIssueId) {
    sendEmailByCount(alertId, project, lastestIssueId, count, userList);
  } else {
    const [lastestIssue] = await Issue.aggregate([
      { $match: { project: Types.ObjectId(project._id) } },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ]);
    if (lastestIssue) {
      sendEmailByCount(alertId, project, lastestIssue._id, count, userList);
    }
  }
};

const sendEmailByPeriod = async (
  alertId: string,
  project: any,
  lastestIssueId: string,
  sendedAt: Date,
  now: Date,
  period: string,
  userList: string[],
): Promise<void> => {
  const date = new Date(sendedAt.getTime() + getPeriodByMillisec(period));
  if (date.getTime() - now.getTime() <= 0) {
    const issues = await Issue.aggregate([
      {
        $match: {
          $and: [{ projectId: Types.ObjectId(project._id) }, { _id: { $gt: lastestIssueId } }],
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 10 },
    ]);
    // 최근에 보낸 시간 + period가 현재 시각보다 작은 경우 -> 이메일을 보냄
    // 최근 10개의 에러만 보내게 설정
    if (issues.length) {
      await sendMail({
        to: userList,
        ...alertMailTemplateByPeriod(project.name, issues),
      });
      await Alert.updateOne(
        { _id: alertId },
        { $set: { sendedAt: date, lastestIssueId: issues[0]._id } },
      );
    }
  }
};

const alertByPeriod = async (alert: any, now: Date): Promise<void> => {
  const { _id: alertId, sendedAt, period, project, lastestIssueId, users } = alert;
  const userList = users.map((user: any) => user.email);
  if (lastestIssueId) {
    sendEmailByPeriod(alertId, project, lastestIssueId, sendedAt, now, period, userList);
  } else {
    const [lastestIssue] = await Issue.aggregate([
      { $match: { projectId: Types.ObjectId(project._id) } },
      { $sort: { _id: -1 } },
      { $limit: 1 },
    ]);
    if (lastestIssue) {
      sendEmailByPeriod(alertId, project, lastestIssue._id, sendedAt, now, period, userList);
    }
  }
};

export { alertByCount, alertListAggregate, alertByPeriod };
