import { Context } from 'koa';
import { Types } from 'mongoose';
import { IIssueDocument } from '../../../models/Issue';
import getIssues from '../services/getIssues';

export default async (ctx: Context): Promise<void> => {
  let { projectId } = ctx.query;
  if (!Array.isArray(projectId)) {
    projectId = [projectId];
  }
  projectId = projectId.map((id: string) => {
    return Types.ObjectId(id);
  });
  const page: number = parseInt(ctx.query.page, 10) || 1;
  try {
    const result: IIssueDocument[] = await getIssues(projectId, page);
    ctx.body = result;
  } catch (e) {
    ctx.throw(400);
  }
};
