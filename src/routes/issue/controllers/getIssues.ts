import { Context } from 'koa';
import { Types } from 'mongoose';
import { IIssueDocument } from '../../../models/Issue';
import getIssues from '../services/getIssues';
import getPeriodByMillisec from '../../../utils/getPeriodByMillisec';

export default async (ctx: Context): Promise<void> => {
  try {
    let { projectId, tags } = ctx.query;
    const { period } = ctx.query;
    if (!Array.isArray(projectId)) {
      projectId = [projectId];
    }

    if (tags) {
      if (!Array.isArray(tags)) {
        tags = [tags];
      }
      tags = tags.map((tag: string) => {
        const parsed = JSON.parse(tag);
        const keys = Object.keys(parsed);
        const obj = { k: keys[0], v: parsed[keys[0]] };
        return obj;
      });
    }

    projectId = projectId.map((id: string) => {
      return Types.ObjectId(id);
    });
    const page: number = parseInt(ctx.query.page, 10) || 1;
    const milliPeriod: number = getPeriodByMillisec(period);
    const start: Date = new Date(Date.now() - milliPeriod);

    const result: IIssueDocument[] = await getIssues(projectId, page, start, tags);
    ctx.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
