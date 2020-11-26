import { Context, Next } from 'koa';
import Issue from '../../../models/Issue';
import makeDaySampleIssues from '../../../models/sampleIssues';

/**
 * @WARNING
 * @개발용
 * 전체 데이터 삭제 API
 */
export default async (ctx: Context, next: Next): Promise<void> => {
  await Issue.insertMany(makeDaySampleIssues());
  ctx.response.status = 200;
  await next();
};
