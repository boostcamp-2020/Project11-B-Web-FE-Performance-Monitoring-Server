import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/crimes/:issueId', controller.getCrimes);
  router.get('/crime/:crimeId', controller.getCrime);
  router.get('/crime/:projectId/visits/month', controller.getMonthVisits);
  router.get('/crime/:projectId/visits/year', controller.getYearVisits);

  return router;
};
