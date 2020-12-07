import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/crimes/:issueId', controller.getCrimes);

  // post
  router.post('/crime/:projectId', controller.addCrime);

  /**
   * @WARNING
   * @개발용
   * 전체 데이터 삭제 API
   */
  router.post('/dev/issues', controller.devAddIssues);
  router.delete('/dev/issues', controller.devDeleteIssues);

  return router;
};
