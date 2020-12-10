import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  //   get
  router.get('/stats/issue/:issueId/crimes/count', controller.getCrimesCount);
  router.get('/stats/shares', controller.getShares);
  router.get('/stats/interval', controller.getCountByInterval);
  router.get('/stats', controller.getStats);

  router.get('/countbyissue', controller.getIssueCount);
  return router;
};
