import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/sdk/:projectId/visits/month', controller.getMonthVisits);
  router.get('/sdk/:projectId/visits/year', controller.getYearVisits);
  router.get('/sdk/:projectId/visits', controller.getVisits);

  // post
  router.post('/sdk/:projectId/visits', controller.addVisits);
  router.post('/sdk/:projectId/crime', controller.addCrime);

  return router;
};
